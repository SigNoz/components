// #region css-tokens
/**
 * CSS Tokens for switch
 * Prefix: `--switch-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--switch-archive-background` | `var(--bg-sienna-500)` |
 * | `--switch-archive-hover-background` | `color-mix(in oklab, var(--bg-sienna-500) 88%, v...` |
 * | `--switch-border-radius` | `var(--radius-round)` |
 * | `--switch-checked-background` | `var(--switch-internal-checked-background)` |
 * | `--switch-checked-hover-background` | `var(--switch-internal-checked-hover-background)` |
 * | `--switch-container-align-items` | `flex-start` |
 * | `--switch-container-display` | `inline-flex` |
 * | `--switch-container-justify` | `flex-start` |
 * | `--switch-container-min-width` | `0` |
 * | `--switch-cursor` | `pointer` |
 * | `--switch-danger-background` | `var(--danger-background)` |
 * | `--switch-danger-hover-background` | `var(--danger-background-hover)` |
 * | `--switch-description-color` | `var(--l2-foreground)` |
 * | `--switch-description-font-size` | `var(--periscope-font-size-base)` |
 * | `--switch-description-line-height` | `18px` |
 * | `--switch-description-overflow` | `hidden` |
 * | `--switch-description-white-space` | `nowrap` |
 * | `--switch-disabled-cursor` | `not-allowed` |
 * | `--switch-disabled-opacity` | `0.6` |
 * | `--switch-focus-visible-outline` | `1px solid var(--ring)` |
 * | `--switch-focus-visible-outline-offset` | `1px` |
 * | `--switch-gap` | `var(--spacing-4)` |
 * | `--switch-highlight-danger-background` | `var(--bg-sakura-500)` |
 * | `--switch-highlight-danger-hover-background` | `color-mix(in oklab, var(--bg-sakura-500) 88%, v...` |
 * | `--switch-info-background` | `var(--bg-aqua-500)` |
 * | `--switch-info-hover-background` | `color-mix(in oklab, var(--bg-aqua-500) 88%, var...` |
 * | `--switch-label-color` | `var(--l1-foreground)` |
 * | `--switch-label-font-size` | `var(--periscope-font-size-base)` |
 * | `--switch-label-font-weight` | `var(--font-weight-normal)` |
 * | `--switch-label-line-height` | `18px` |
 * | `--switch-label-overflow` | `hidden` |
 * | `--switch-label-tooltip-max-width` | `20rem` |
 * | `--switch-label-white-space` | `nowrap` |
 * | `--switch-margin-block-start` | `calc((var(--switch-internal-label-line-height) ...` |
 * | `--switch-primary-background` | `var(--primary-background)` |
 * | `--switch-primary-hover-background` | `var(--primary-background-hover)` |
 * | `--switch-readonly-cursor` | `not-allowed` |
 * | `--switch-readonly-opacity` | `0.8` |
 * | `--switch-secondary-background` | `var(--secondary-background)` |
 * | `--switch-secondary-hover-background` | `var(--secondary-background-hover)` |
 * | `--switch-success-background` | `var(--success-background)` |
 * | `--switch-success-hover-background` | `var(--success-background-hover)` |
 * | `--switch-text-gap` | `var(--spacing-2)` |
 * | `--switch-text-min-width` | `0` |
 * | `--switch-text-overflow-visible` | `visible` |
 * | `--switch-text-text-overflow` | `ellipsis` |
 * | `--switch-text-transition` | `opacity 150ms ease` |
 * | `--switch-thumb-background` | `var(--primary-foreground)` |
 * | `--switch-thumb-border-radius` | `var(--radius-round)` |
 * | `--switch-thumb-hover-extend` | `2px` |
 * | `--switch-thumb-inset` | `2px` |
 * | `--switch-thumb-press-extend` | `3px` |
 * | `--switch-thumb-press-shrink` | `3px` |
 * | `--switch-thumb-shadow` | `0 1px 3px 0 color-mix(in srgb, black 30%, trans...` |
 * | `--switch-thumb-size` | `12px` |
 * | `--switch-thumb-transition` | `translate 150ms ease-out, 			inline-size 150ms ...` |
 * | `--switch-track-background` | `var(--l3-border)` |
 * | `--switch-track-height` | `16px` |
 * | `--switch-track-hover-background` | `var(--l3-background-hover)` |
 * | `--switch-track-width` | `28px` |
 * | `--switch-transition` | `background-color 150ms ease` |
 * | `--switch-warning-background` | `var(--warning-background)` |
 * | `--switch-warning-hover-background` | `var(--warning-background-hover)` |
 * | `--switch-wrap-overflow-wrap` | `anywhere` |
 * | `--switch-wrap-white-space` | `normal` |
 */
// #endregion css-tokens

export { Switch } from './switch.js';
export { SwitchColor, SwitchTextOverflow, SwitchTextPlacement } from './constants.js';
export type {
	SwitchColorType,
	SwitchDisableType,
	SwitchProps,
	SwitchReadOnlyType,
	SwitchTextOverflowType,
	SwitchTextPlacementType,
	ValidateSwitchProps,
} from './types.js';
