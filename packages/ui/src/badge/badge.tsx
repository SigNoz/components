import { forwardRef, type ForwardedRef } from 'react';
import { BadgeRoot } from './subcomponents/badge-root.js';
import { BadgeTextTransform } from './constants.js';
import type { BadgeProps } from './types.js';

/**
 * Renders a `<span>` for status, counts, and labels, in the same colors as `Button`.
 *
 * Every `aria-*` and any `data-*` are forwarded.
 *
 * Visual values are `--badge-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Truncation
 *
 * `textOverflow="ellipsis"` (the default) measures the content and re-measures on resize.
 *
 * While it does not fit: `data-truncated`, plus a tooltip with the full content. The visible
 * content is only clipped, so nothing is lost, just hidden until hovered or focused.
 *
 * `none` clips with no tooltip.
 *
 * The trigger is always mounted, so the element never remounts when a tooltip appears. The
 * tooltip root and popup mount only while there is something to show.
 *
 * Inside a wrapping `<Tooltip>` the badge adds its content to that popup instead of opening a
 * second one.
 *
 * ### Width
 *
 * `width` and `maxWidth` are written as inline `--badge-internal-width` and
 * `--badge-internal-max-width`.
 *
 * So they compose with the tokens instead of overwriting `style.width`. Numbers are written as
 * `px`, and any `style` you pass is kept.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` and survives the tooltip trigger cloning the badge. Otherwise use
 * the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"badge"` |
 * | `data-variant`, `data-color` | mirrors the prop |
 * | `data-text-transform` | mirrors `textTransform` |
 * | `data-text-overflow` | mirrors `textOverflow` |
 * | `data-truncated` | present only while the content does not fit |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `badge-label` | always, this is the measured element |
 * | `badge-prefix` | only when `prefix` is a valid element |
 * | `badge-suffix` | only when `suffix` is a valid element |
 *
 * ### Prefix and suffix
 *
 * `prefix` and `suffix` sit either side of the label, vertically centered with a gap. Both are
 * `aria-hidden`, so give the badge an accessible name if they carry meaning `children` doesn't
 * already convey.
 *
 * @example
 * ```tsx
 * <Badge variant="solid" color="danger">
 *   Critical
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="outlined" color="success" prefix={<Check />}>
 *   Resolved
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * // Truncates once the badge is narrower than its content, full text on hover
 * <Badge variant="outlined" color="secondary" maxWidth="10rem">
 *   kubernetes-deployment-production-east-us-2
 * </Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{ textTransform = BadgeTextTransform.Uppercase, ...props },
	ref,
) {
	return (
		<BadgeRoot
			{...props}
			textTransform={textTransform}
			ref={ref as ForwardedRef<HTMLSpanElement | HTMLButtonElement>}
		/>
	);
});
