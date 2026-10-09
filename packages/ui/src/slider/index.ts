// #region css-tokens
/**
 * CSS Tokens for slider
 * Prefix: `--slider-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--slider-archive-indicator` | `-` |
 * | `--slider-archive-indicator-color` | `var(--slider-archive-indicator)` |
 * | `--slider-control-align-items` | `center` |
 * | `--slider-control-cursor` | `pointer` |
 * | `--slider-control-display` | `flex` |
 * | `--slider-control-position` | `relative` |
 * | `--slider-danger-indicator` | `-` |
 * | `--slider-danger-indicator-color` | `var(--slider-danger-indicator)` |
 * | `--slider-disabled-cursor` | `not-allowed` |
 * | `--slider-disabled-opacity` | `0.6` |
 * | `--slider-display` | `flex` |
 * | `--slider-dragging-cursor` | `grabbing` |
 * | `--slider-flex-direction` | `column` |
 * | `--slider-gap` | `var(--spacing-2)` |
 * | `--slider-highlight-danger-indicator` | `-` |
 * | `--slider-highlight-danger-indicator-color` | `var(--slider-highlight-danger-indicator)` |
 * | `--slider-indicator-background-color` | `var(--slider-internal-indicator)` |
 * | `--slider-indicator-border-radius` | `var(--radius-round)` |
 * | `--slider-info-indicator` | `-` |
 * | `--slider-info-indicator-color` | `var(--slider-info-indicator)` |
 * | `--slider-isolation` | `isolate` |
 * | `--slider-mark-color` | `var(--l3-foreground)` |
 * | `--slider-mark-cursor` | `pointer` |
 * | `--slider-mark-dot-active-border-color` | `var(--slider-internal-indicator)` |
 * | `--slider-mark-dot-background-color` | `var(--base-white)` |
 * | `--slider-mark-dot-border-color` | `color-mix(in srgb, var(--slider-internal-indica...` |
 * | `--slider-mark-dot-border-radius` | `var(--radius-round)` |
 * | `--slider-mark-dot-border-style` | `solid` |
 * | `--slider-mark-dot-border-width` | `2px` |
 * | `--slider-mark-dot-box-sizing` | `border-box` |
 * | `--slider-mark-dot-cursor` | `pointer` |
 * | `--slider-mark-dot-inset-inline-start` | `calc( 			var(--slider-internal-thumb-size) / 2 ...` |
 * | `--slider-mark-dot-position` | `absolute` |
 * | `--slider-mark-dot-size` | `var(--spacing-4)` |
 * | `--slider-mark-dot-translate` | `-50% -50%` |
 * | `--slider-mark-ellipsis-overflow` | `hidden` |
 * | `--slider-mark-end-inset-inline-start` | `0` |
 * | `--slider-mark-end-justify-self` | `end` |
 * | `--slider-mark-end-text-align` | `end` |
 * | `--slider-mark-end-translate` | `none` |
 * | `--slider-mark-font-size` | `var(--periscope-font-size-small)` |
 * | `--slider-mark-grid-area` | `1 / 1` |
 * | `--slider-mark-inset-inline-start` | `var(--slider-internal-mark-anchor)` |
 * | `--slider-mark-justify-self` | `start` |
 * | `--slider-mark-line-height` | `16px` |
 * | `--slider-mark-max-width` | `var(--slider-internal-mark-max-width)` |
 * | `--slider-mark-position` | `relative` |
 * | `--slider-mark-start-inset-inline-start` | `0` |
 * | `--slider-mark-start-text-align` | `start` |
 * | `--slider-mark-start-translate` | `none` |
 * | `--slider-mark-text-align` | `center` |
 * | `--slider-mark-text-overflow` | `ellipsis` |
 * | `--slider-mark-translate` | `-50% 0` |
 * | `--slider-mark-white-space` | `nowrap` |
 * | `--slider-mark-wrap-overflow-wrap` | `anywhere` |
 * | `--slider-mark-wrap-white-space` | `normal` |
 * | `--slider-marks-display` | `grid` |
 * | `--slider-marks-gap` | `var(--spacing-4, 8px)` |
 * | `--slider-marks-grid-template-columns` | `minmax(0, 1fr)` |
 * | `--slider-max-width` | `var(--slider-internal-max-width, 100%)` |
 * | `--slider-min-width` | `calc(var(--slider-internal-thumb-size) * 2)` |
 * | `--slider-position` | `relative` |
 * | `--slider-primary-indicator` | `-` |
 * | `--slider-primary-indicator-color` | `var(--slider-primary-indicator)` |
 * | `--slider-readonly-cursor` | `not-allowed` |
 * | `--slider-readonly-opacity` | `0.8` |
 * | `--slider-secondary-indicator` | `-` |
 * | `--slider-secondary-indicator-color` | `var(--slider-secondary-indicator)` |
 * | `--slider-success-indicator` | `-` |
 * | `--slider-success-indicator-color` | `var(--slider-success-indicator)` |
 * | `--slider-thumb-background-color` | `var(--base-white)` |
 * | `--slider-thumb-border-color` | `var(--slider-internal-indicator)` |
 * | `--slider-thumb-border-radius` | `var(--radius-round)` |
 * | `--slider-thumb-border-style` | `solid` |
 * | `--slider-thumb-border-width` | `2px` |
 * | `--slider-thumb-box-shadow` | `0 1px 3px 0 color-mix(in srgb, var(--base-black...` |
 * | `--slider-thumb-box-sizing` | `border-box` |
 * | `--slider-thumb-cursor` | `grab` |
 * | `--slider-thumb-focus-visible-outline` | `1px solid var(--ring)` |
 * | `--slider-thumb-focus-visible-outline-offset` | `1px` |
 * | `--slider-thumb-size` | `18px` |
 * | `--slider-thumb-z-index` | `1` |
 * | `--slider-touch-action` | `none` |
 * | `--slider-track-background-color` | `color-mix(in srgb, var(--slider-internal-indica...` |
 * | `--slider-track-border-radius` | `var(--radius-round)` |
 * | `--slider-track-height` | `var(--spacing-3)` |
 * | `--slider-track-width` | `100%` |
 * | `--slider-user-select` | `none` |
 * | `--slider-warning-indicator` | `-` |
 * | `--slider-warning-indicator-color` | `var(--slider-warning-indicator)` |
 * | `--slider-width` | `var(--slider-internal-width, 100%)` |
 */
// #endregion css-tokens

export { SliderColor, SliderTextOverflow } from './constants.js';
export type * from './types.js';
export { Slider } from './slider.js';
