import type { AriaAttributes, ComponentProps, CSSProperties, ReactNode } from 'react';
import type { PillColor, PillTextOverflow, PillTextTransform, PillVariant } from './constants.js';

type OriginalButtonProps = ComponentProps<'button'>;

export type PillVariantType = (typeof PillVariant)[keyof typeof PillVariant];
export type PillColorType = (typeof PillColor)[keyof typeof PillColor];
export type PillTextOverflowType = (typeof PillTextOverflow)[keyof typeof PillTextOverflow];
export type PillTextTransformType = (typeof PillTextTransform)[keyof typeof PillTextTransform];

export type PillProps = Pick<OriginalButtonProps, 'className' | 'id' | 'style'> & {
	/**
	 * Forwarded to the rendered element as `data-testid`.
	 */
	testId?: string;
	/**
	 * `outlined` only tints the border and text, no fill.
	 */
	variant: PillVariantType;
	/**
	 * Same palette as `Badge`'s `color`.
	 */
	color: PillColorType;
	/**
	 * The content of the pill.
	 *
	 * This field is mandatory, it's not allowed to have an empty pill.
	 */
	children: ReactNode;
	/**
	 * Blocks clicks and keyboard activation and drops the pill from the tab order, natively:
	 * the root is a real `<button>`. Styled with `--pill-disabled-opacity` and
	 * `--pill-disabled-cursor`.
	 *
	 * @default false
	 */
	disabled?: OriginalButtonProps['disabled'];
	/**
	 * Called when the pill is clicked, or activated with Enter or Space. Never called while
	 * `disabled`.
	 */
	onClick?: OriginalButtonProps['onClick'];
	/**
	 * Unlike `Badge`, defaults to `none` so the label keeps whatever case it was written in.
	 * `uppercase` is not offered.
	 *
	 * @default 'none'
	 */
	textTransform?: PillTextTransformType;
	/**
	 * `ellipsis` truncates the content and shows the full content in a tooltip on hover/focus,
	 * only while it is actually truncated. `none` clips at the pill's edge, no marker and no
	 * tooltip.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: PillTextOverflowType;
	/**
	 * The width of this pill. Written as the `--pill-internal-width` custom property, so it
	 * composes with the tokens instead of overwriting `style.width`. Numbers are written as `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of this pill. Written as the `--pill-internal-max-width` custom property, so
	 * it composes with the tokens. Numbers are written as `px`.
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * Any `data-*` prop is accepted and forwarded to the rendered element.
	 */
	[key: `data-${string}`]: unknown;
} & AriaAttributes;
