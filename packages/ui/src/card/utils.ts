import { isValidElement, type CSSProperties, type ReactNode } from 'react';
import { isBlankText } from '../lib/blank-text.js';
import { toOptionalCssLength } from '../lib/css-length.js';
import { splitProps, toSpacingValue } from '../lib/spacing.js';
import { hasRenderableContent } from '../lib/utils.js';
import { CardSpacingPropNames } from './constants.js';
import type { CardLoadingParts, CardProps } from './types.js';

const SPACING_PROP_NAMES: ReadonlySet<string> = new Set(CardSpacingPropNames);

const SIDES = ['Top', 'Right', 'Bottom', 'Left'] as const;

type CardSide = (typeof SIDES)[number];
type CardSpacingProp = 'margin' | 'padding';
type CardSpacingPropName = (typeof CardSpacingPropNames)[number];

/**
 * The margin and padding props of a card.
 *
 * @access private
 */
export type CardSpacingProps = Pick<CardProps, CardSpacingPropName>;

/**
 * The size props of a card, which arrive as `--card-internal-*` custom properties.
 *
 * @access private
 */
export type CardSizeProps = Pick<CardProps, 'width' | 'maxWidth' | 'height' | 'minHeight' | 'gap'>;

function resolveSide(
	spacing: CardSpacingProps,
	prop: CardSpacingProp,
	side: CardSide,
): CardSpacingProps[CardSpacingPropName] {
	const axis = side === 'Top' || side === 'Bottom' ? 'Y' : 'X';

	return spacing[`${prop}${side}` as const] ?? spacing[`${prop}${axis}` as const] ?? spacing[prop];
}

/**
 * Splits the margin and padding props from the rest of the props.
 *
 * @access private
 */
export function splitCardSpacing<Props extends object>(
	props: Props,
): [CardSpacingProps, Omit<Props, CardSpacingPropName>] {
	const [spacing, rest] = splitProps(props, SPACING_PROP_NAMES);

	return [spacing as CardSpacingProps, rest as Omit<Props, CardSpacingPropName>];
}

/**
 * Whether the body has no padding on any side, which is the one that clips to the radius of the
 * card. A side with no prop is the default step of 8.
 *
 * @access private
 */
export function isFlushBody(spacing: CardSpacingProps): boolean {
	return SIDES.every((side) => (resolveSide(spacing, 'padding', side) ?? 8) === 0);
}

/**
 * The inline custom properties of a card: its size, its gap, its margin and the padding of its
 * body. Only the ones that are set are written. The style holds only `--card-internal-*`
 * properties.
 *
 * @access private
 */
export function getCardStyle(size: CardSizeProps, spacing: CardSpacingProps): CSSProperties {
	const internal: Record<string, string | undefined> = {
		'--card-internal-width': toOptionalCssLength(size.width),
		'--card-internal-max-width': toOptionalCssLength(size.maxWidth),
		'--card-internal-height': toOptionalCssLength(size.height),
		'--card-internal-min-height': toOptionalCssLength(size.minHeight),
		'--card-internal-gap': toSpacingValue(size.gap),
		'--card-internal-body-flex': size.height == null ? undefined : '1 1 0%',
	};

	for (const side of SIDES) {
		const name = side.toLowerCase();

		internal[`--card-internal-margin-${name}`] = toSpacingValue(
			resolveSide(spacing, 'margin', side),
		);
		internal[`--card-internal-padding-${name}`] = toSpacingValue(
			resolveSide(spacing, 'padding', side),
		);
	}

	return Object.fromEntries(
		Object.entries(internal).filter(([, value]) => value !== undefined),
	) as CSSProperties;
}

/**
 * Whether a description has anything to read: a string with more than spaces, or any other node
 * that renders something.
 *
 * @access private
 */
export function hasCardText(content: ReactNode): boolean {
	return typeof content === 'string' ? !isBlankText(content) : hasRenderableContent(content);
}

/**
 * What `loading` asks for, part by part. `body` is the node the caller passed, or `undefined` for
 * the default `Skeleton`.
 *
 * @access private
 */
export type CardLoadingState = {
	isLoading: boolean;
	body: ReactNode;
	header: boolean;
	footer: boolean;
};

function isLoadingParts(loading: CardProps['loading']): loading is CardLoadingParts {
	return (
		typeof loading === 'object' &&
		loading !== null &&
		!isValidElement(loading) &&
		!(Symbol.iterator in loading) &&
		!('then' in loading)
	);
}

/**
 * Reads the `loading` prop: a boolean, the parts that load on top of the body, or the node the
 * body shows. An empty node loads the body with the default `Skeleton`.
 *
 * @access private
 */
export function resolveCardLoading(loading: CardProps['loading']): CardLoadingState {
	if (isLoadingParts(loading)) {
		return {
			isLoading: true,
			body: undefined,
			header: loading.header === true,
			footer: loading.footer === true,
		};
	}

	return {
		isLoading: Boolean(loading),
		body: hasRenderableContent(loading) ? loading : undefined,
		header: false,
		footer: false,
	};
}
