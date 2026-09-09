import type {
	BadgeColor,
	BadgeTextOverflow,
	BadgeTextTransform,
	BadgeVariant,
} from './constants.js';
import type { AriaAttributes, CSSProperties, ReactElement, ReactNode } from 'react';

export type BadgeVariantType = (typeof BadgeVariant)[keyof typeof BadgeVariant];
export type BadgeColorType = (typeof BadgeColor)[keyof typeof BadgeColor];
export type BadgeTextOverflowType = (typeof BadgeTextOverflow)[keyof typeof BadgeTextOverflow];
export type BadgeTextTransformType = (typeof BadgeTextTransform)[keyof typeof BadgeTextTransform];

export type BadgeProps = Pick<React.ComponentProps<'span'>, 'className' | 'id' | 'style'> & {
	/**
	 * Forwarded to the rendered element as `data-testid`.
	 */
	testId?: string;
	/**
	 * `outlined` only tints the border and text, no fill.
	 */
	variant: BadgeVariantType;
	/**
	 * Same palette as `Button`'s `color`.
	 */
	color: BadgeColorType;
	/**
	 * The content of the badge.
	 *
	 * This field is mandatory, it's not allowed to have an empty badge.
	 */
	children: ReactNode;
	/**
	 * @default 'uppercase'
	 */
	textTransform?: BadgeTextTransformType;
	/**
	 * `ellipsis` truncates the content and shows the full content in a tooltip on hover/focus,
	 * only while it is actually truncated. `none` clips at the badge's edge, no marker and no
	 * tooltip.
	 *
	 * @note Truncation only kicks in once something constrains the badge's width, for example a
	 * `--badge-width` custom property or a narrower parent.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: BadgeTextOverflowType;
	/**
	 * The width of this badge. Written as the `--badge-internal-width` custom property, so it
	 * composes with the tokens instead of overwriting `style.width`. Numbers are written as `px`.
	 * Without it the badge sizes to its content.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of this badge. Written as the `--badge-internal-max-width` custom property, so
	 * it composes with the tokens. Numbers are written as `px`. Without it the badge is capped at
	 * `100%` of its container.
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * Element rendered before the label, vertically centered with a gap. The sizing class is
	 * merged into the element's own `className`. `aria-hidden`, so give the badge itself an
	 * accessible name if it carries meaning `children` doesn't already convey.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered after the label, vertically centered with a gap. The sizing class is
	 * merged into the element's own `className`. `aria-hidden`, so give the badge itself an
	 * accessible name if it carries meaning `children` doesn't already convey.
	 */
	suffix?: ReactElement;
	/**
	 * Any `data-*` prop is accepted and forwarded to the rendered element.
	 */
	[key: `data-${string}`]: unknown;
} & AriaAttributes;
