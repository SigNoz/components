import type { AriaAttributes, CSSProperties, ReactElement, ReactNode } from 'react';
import type { CalloutColor, CalloutSize } from './constants.js';

export type CalloutColorType = (typeof CalloutColor)[keyof typeof CalloutColor];
export type CalloutSizeType = (typeof CalloutSize)[keyof typeof CalloutSize];

export type CalloutProps = {
	/**
	 * Forwarded to the callout as `data-testid`. The parts derive theirs from it, as
	 * `{testId}-icon`, `{testId}-title`, `{testId}-description`, `{testId}-toggle` and
	 * `{testId}-close`.
	 */
	testId?: string;
	/**
	 * Forwarded to the callout.
	 */
	id?: string;
	/**
	 * The color intent of the callout, which sets the tint and the live region role: `danger` and
	 * `highlight-danger` are `role="alert"`, every other color is `role="status"`.
	 * `Callout.Expandable` has no live role.
	 */
	color: CalloutColorType;
	/**
	 * The type scale and the icon size of the callout.
	 */
	size: CalloutSizeType;
	/**
	 * The icon that carries the meaning of the callout, so severity is never conveyed by color
	 * alone. `aria-hidden`.
	 *
	 * @note The callout sets the icon size, the one passed on the element is ignored. The icon
	 * inherits the color of the callout through `currentColor`, and a `color` set on the icon
	 * element wins. The `Solid*` icons of `@signozhq/icons` paint their disc in the color of the
	 * callout and their glyph in the page surface. Any other fixed color on an icon is kept.
	 */
	icon: ReactElement;
	/**
	 * The description of the callout. It wraps, and scrolls once the callout has no height left.
	 *
	 * @note `Callout` and `Callout.Closeable` render nothing while it is empty.
	 */
	children: ReactNode;
	/**
	 * The width of this callout. Without it the callout fills its parent. Numbers are written as
	 * `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of this callout. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * The height of this callout. Without it the height grows with the content. Numbers are
	 * written as `px`.
	 *
	 * @note A height smaller than the padding and the title row of `Callout.Expandable` clips
	 * below the title, which does not scroll.
	 */
	height?: CSSProperties['height'];
	/**
	 * The max-height of this callout. Past it, the description scrolls. Numbers are written as
	 * `px`.
	 *
	 * @default '100%'
	 */
	maxHeight?: CSSProperties['maxHeight'];
	/**
	 * Any `data-*` prop is accepted and forwarded to the callout.
	 */
	[key: `data-${string}`]: unknown;
} & AriaAttributes;
