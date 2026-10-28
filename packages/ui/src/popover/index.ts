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
 * | `--popover-border` | `var(--l2-border)` |
 * | `--popover-border-color` | `var(--popover-border, var(--l2-border))` |
 * | `--popover-border-radius` | `var(--radius-2)` |
 * | `--popover-border-style` | `solid` |
 * | `--popover-border-width` | `1px` |
 * | `--popover-box-shadow` | `var(--popover-shadow, var(--shadow-dropdown))` |
 * | `--popover-box-sizing` | `border-box` |
 * | `--popover-display` | `flex` |
 * | `--popover-flex-direction` | `column` |
 * | `--popover-focus-visible-outline` | `none` |
 * | `--popover-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--popover-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--popover-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--popover-foreground` | `-` |
 * | `--popover-foreground-color` | `var(--popover-foreground)` |
 * | `--popover-inline-size` | `var(--popover-internal-inline-size, fit-content)` |
 * | `--popover-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--popover-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--popover-max-block-size` | `var(--popover-internal-max-block-size, var(--av...` |
 * | `--popover-max-inline-size` | `var(--popover-internal-max-inline-size, 25rem)` |
 * | `--popover-min-inline-size` | `10rem` |
 * | `--popover-overflow` | `hidden` |
 * | `--popover-padding` | `0` |
 * | `--popover-positioner-focus-visible-outline` | `none` |
 * | `--popover-positioner-inline-size` | `max-content` |
 * | `--popover-positioner-pointer-events` | `auto` |
 * | `--popover-shadow` | `var(--shadow-dropdown)` |
 * | `--popover-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--popover-z-index` | `50` |
 */
// #endregion css-tokens

export { POPOVER_SIDE_OFFSET } from './constants.js';
export { Popover } from './popover.js';
export { usePopoverHandle } from './use-popover-handle.js';
export type {
	PopupAnchorTarget as PopoverAnchorTargetType,
	PopupHandle as PopoverHandleType,
} from '../lib/popup-handle.js';
export type {
	PopoverAnchorType,
	PopoverProps,
	PopoverSideType,
	ValidatePopoverProps,
} from './types.js';
