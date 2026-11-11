import {
	Children,
	cloneElement,
	createElement,
	type CSSProperties,
	Fragment,
	isValidElement,
	type ReactNode,
} from 'react';
import { toOptionalCssLength } from '../lib/css-length.js';
import { splitProps, toSpacingShorthand, toSpacingValue } from '../lib/spacing.js';
import { isLabelTruncated, isLabelTruncatedInHeight } from '../lib/useIsLabelTruncated.js';
import { TypographySpacingPropNames } from './constants.js';
import type {
	TypographyDisplayType,
	TypographyElementType,
	TypographyLookProps,
	TypographySpacingProps,
	WithoutTypographySpacingProps,
} from './types.js';

const INLINE_ELEMENTS: ReadonlySet<TypographyElementType | 'a'> = new Set([
	'span',
	'label',
	'code',
	'a',
]);

const SPACING_PROP_NAMES: ReadonlySet<string> = new Set(TypographySpacingPropNames);

/**
 * The display a text renders with: `display` when set, otherwise the one of its element.
 *
 * @access private
 */
export function resolveTypographyDisplay(
	element: TypographyElementType | 'a',
	display: TypographyDisplayType | undefined,
): TypographyDisplayType {
	return display ?? (INLINE_ELEMENTS.has(element) ? 'inline' : 'block');
}

/**
 * @access private
 */
export function isFlexDisplay(display: TypographyDisplayType): boolean {
	return display === 'flex' || display === 'inline-flex';
}

function toLineCount(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

/**
 * Splits the margin and padding props from the props the element takes.
 *
 * @access private
 */
export function splitTypographySpacing<Props extends object>(
	props: Props,
): [TypographySpacingProps, WithoutTypographySpacingProps<Props>] {
	const [spacing, rest] = splitProps(props, SPACING_PROP_NAMES);

	return [spacing, rest as WithoutTypographySpacingProps<Props>];
}

/**
 * The `data-*` attributes and the inline custom properties of a text. The style holds only
 * `--typography-internal-*` properties.
 *
 * @access private
 */
export function getTypographyLook({
	variant,
	size,
	weight,
	color,
	textOverflow,
	maxLines,
	display,
	align,
	verticalAlign,
	tabularNumbers = false,
	slashedZero = false,
	width,
	minWidth,
	maxWidth,
	gap,
	...spacing
}: TypographyLookProps): Record<string, unknown> & { style: CSSProperties } {
	const isFlex = isFlexDisplay(display);
	const lines =
		textOverflow === 'ellipsis' ? (variant === 'paragraph' ? toLineCount(maxLines) : 1) : null;
	const internal: Record<string, string | number | undefined> = {
		'--typography-internal-width': toOptionalCssLength(width),
		'--typography-internal-min-width': toOptionalCssLength(minWidth),
		'--typography-internal-max-width': toOptionalCssLength(maxWidth),
		'--typography-internal-margin': toSpacingShorthand(spacing, 'margin'),
		'--typography-internal-padding': toSpacingShorthand(spacing, 'padding'),
		'--typography-internal-gap': isFlex ? toSpacingValue(gap) : undefined,
		'--typography-internal-max-lines': lines ?? undefined,
	};
	const style = Object.fromEntries(
		Object.entries(internal).filter(([, value]) => value !== undefined),
	) as CSSProperties;

	return {
		'data-variant': variant,
		'data-size': size,
		'data-weight': weight,
		'data-color': color,
		'data-text-overflow': textOverflow,
		'data-max-lines': lines ?? undefined,
		'data-display': display,
		'data-align': typeof align === 'string' ? align : undefined,
		'data-vertical-align': isFlex
			? typeof verticalAlign === 'string'
				? verticalAlign
				: 'center'
			: undefined,
		'data-tabular-numbers': tabularNumbers || undefined,
		'data-slashed-zero': slashedZero || undefined,
		style,
	};
}

function flattenFragments(children: ReactNode, keyPrefix = ''): ReactNode[] {
	return Children.toArray(children).flatMap((child) => {
		if (!isValidElement<{ children?: ReactNode }>(child)) {
			return [child];
		}

		if (child.type === Fragment) {
			return flattenFragments(child.props.children, `${keyPrefix}${child.key}`);
		}

		return [keyPrefix === '' ? child : cloneElement(child, { key: `${keyPrefix}${child.key}` })];
	});
}

/**
 * The children of a `flex` text, with each run of text wrapped in a `typography-text` span. That
 * span takes the ellipsis, so an icon next to the text stays whole. The children of a fragment
 * count as children of the text.
 *
 * @access private
 */
export function wrapTextRuns(children: ReactNode, className: string | undefined): ReactNode[] {
	const parts: ReactNode[] = [];
	let run: Array<string | number> = [];

	const flush = (): void => {
		if (run.length === 0) {
			return;
		}

		parts.push(
			createElement(
				'span',
				{ key: `typography-text-${parts.length}`, 'data-slot': 'typography-text', className },
				...run,
			),
		);
		run = [];
	};

	for (const child of flattenFragments(children)) {
		if (typeof child === 'string' || typeof child === 'number') {
			run.push(child);
		} else {
			flush();
			parts.push(child);
		}
	}

	flush();

	return parts;
}

function isBoxTruncated(box: HTMLElement, multiline: boolean): boolean {
	return isLabelTruncated(box) || (multiline && isLabelTruncatedInHeight(box));
}

/**
 * Whether a text with `textOverflow="ellipsis"` is cut: the element itself, or each run of text
 * of a `flex` text. Past one line, the cut is in height.
 *
 * @access private
 */
export function isTypographyTruncated(node: HTMLElement): boolean {
	const multiline = Number(node.dataset['maxLines'] ?? 1) > 1;

	if (node.dataset['display'] === 'flex' || node.dataset['display'] === 'inline-flex') {
		return Array.from(node.children).some(
			(child) =>
				child instanceof HTMLElement &&
				child.dataset['slot'] === 'typography-text' &&
				isBoxTruncated(child, multiline),
		);
	}

	return isBoxTruncated(node, multiline);
}
