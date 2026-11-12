// #region css-tokens
/**
 * CSS Tokens for popover
 * Prefix: `--popover-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--popover-backdrop-filter` | `blur(40px)` |
 * | `--popover-background` | `var(--surface-3)` |
 * | `--popover-background-color` | `var(--popover-background, var(--surface-3))` |
 * | `--popover-block-size` | `var(--popup-height, auto)` |
 * | `--popover-border` | `var(--l2-border)` |
 * | `--popover-border-color` | `var(--popover-border, var(--l2-border))` |
 * | `--popover-border-radius` | `var(--radius-2)` |
 * | `--popover-border-style` | `solid` |
 * | `--popover-border-width` | `1px` |
 * | `--popover-box-shadow` | `var(--popover-shadow, var(--shadow-dropdown))` |
 * | `--popover-box-sizing` | `border-box` |
 * | `--popover-content-display` | `flex` |
 * | `--popover-content-flex` | `1 1 auto` |
 * | `--popover-content-flex-direction` | `column` |
 * | `--popover-content-min-block-size` | `0` |
 * | `--popover-content-shift` | `16px` |
 * | `--popover-content-swap-inline-size` | `calc(var(--popup-width) - 2 * var(--popover-bor...` |
 * | `--popover-content-swap-opacity` | `0` |
 * | `--popover-content-transition-property` | `translate, opacity` |
 * | `--popover-display` | `flex` |
 * | `--popover-flex-direction` | `column` |
 * | `--popover-focus-visible-outline` | `none` |
 * | `--popover-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--popover-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--popover-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--popover-foreground` | `-` |
 * | `--popover-foreground-color` | `var(--popover-foreground)` |
 * | `--popover-inline-size` | `var(--popover-internal-inline-size, fit-content)` |
 * | `--popover-instant-transition-duration` | `0s` |
 * | `--popover-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--popover-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--popover-max-block-size` | `var(--popover-internal-max-block-size, var(--av...` |
 * | `--popover-max-inline-size` | `var(--popover-internal-max-inline-size, 25rem)` |
 * | `--popover-min-inline-size` | `10rem` |
 * | `--popover-overflow` | `hidden` |
 * | `--popover-padding` | `0` |
 * | `--popover-positioner-block-size` | `var(--positioner-height, auto)` |
 * | `--popover-positioner-focus-visible-outline` | `none` |
 * | `--popover-positioner-inline-size` | `max-content` |
 * | `--popover-positioner-pointer-events` | `auto` |
 * | `--popover-positioner-transition-property` | `top, left` |
 * | `--popover-shadow` | `var(--shadow-dropdown)` |
 * | `--popover-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--popover-transition-duration` | `200ms` |
 * | `--popover-transition-property` | `inline-size, block-size` |
 * | `--popover-transition-timing-function` | `cubic-bezier(0.22, 1, 0.36, 1)` |
 * | `--popover-viewport-display` | `flex` |
 * | `--popover-viewport-flex` | `1 1 auto` |
 * | `--popover-viewport-flex-direction` | `column` |
 * | `--popover-viewport-min-block-size` | `0` |
 * | `--popover-viewport-overflow` | `clip` |
 * | `--popover-viewport-position` | `relative` |
 * | `--popover-z-index` | `50` |
 */
// #endregion css-tokens

export { POPOVER_SIDE_OFFSET } from './constants.js';
export { Popover } from './popover.js';
export { usePopoverHandle } from './use-popover-handle.js';
export type { PopupAnchorTarget as PopoverAnchorTargetType } from '../lib/popup-handle.js';
export type { PopoverHandle as PopoverHandleType } from './popover-handle.js';
export type {
	PopoverAnchorType,
	PopoverProps,
	PopoverSideType,
	PopoverTriggerProps,
	ValidatePopoverProps,
	ValidatePopoverTriggerProps,
} from './types.js';
