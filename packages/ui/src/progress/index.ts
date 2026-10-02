// #region css-tokens
/**
 * CSS Tokens for progress
 * Prefix: `--progress-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--progress-active-stripe` | `-` |
 * | `--progress-active-stripe-color` | `var(--progress-active-stripe)` |
 * | `--progress-align-items` | `center` |
 * | `--progress-archive-indicator` | `-` |
 * | `--progress-archive-indicator-background-color` | `var(--progress-archive-indicator)` |
 * | `--progress-border-radius` | `var(--radius-1)` |
 * | `--progress-danger-indicator` | `-` |
 * | `--progress-danger-indicator-background-color` | `var(--progress-danger-indicator)` |
 * | `--progress-display` | `flex` |
 * | `--progress-gap` | `var(--spacing-4)` |
 * | `--progress-highlight-danger-indicator` | `-` |
 * | `--progress-highlight-danger-indicator-background-color` | `var(--progress-highlight-danger-indicator)` |
 * | `--progress-indicator-active-animation-duration` | `1.5s` |
 * | `--progress-indicator-active-animation-iteration-count` | `infinite` |
 * | `--progress-indicator-active-animation-timing-function` | `linear` |
 * | `--progress-indicator-active-background-image` | `linear-gradient( 			-45deg, 			var(--progress-i...` |
 * | `--progress-indicator-active-transition-duration` | `0.3s` |
 * | `--progress-indicator-active-transition-property` | `width` |
 * | `--progress-indicator-active-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--progress-indicator-complete-animation-name` | `none` |
 * | `--progress-indicator-height` | `100%` |
 * | `--progress-info-indicator` | `-` |
 * | `--progress-info-indicator-background-color` | `var(--progress-info-indicator)` |
 * | `--progress-max-width` | `var(--progress-internal-max-width, 100%)` |
 * | `--progress-primary-indicator` | `-` |
 * | `--progress-primary-indicator-background-color` | `var(--progress-primary-indicator)` |
 * | `--progress-secondary-indicator` | `-` |
 * | `--progress-secondary-indicator-background-color` | `var(--progress-secondary-indicator)` |
 * | `--progress-step-border-radius` | `var(--progress-internal-border-radius)` |
 * | `--progress-step-gap` | `var(--spacing-1)` |
 * | `--progress-stripe-size` | `1.5rem` |
 * | `--progress-success-indicator` | `-` |
 * | `--progress-success-indicator-background-color` | `var(--progress-success-indicator)` |
 * | `--progress-track` | `-` |
 * | `--progress-track-background-color` | `var(--progress-track)` |
 * | `--progress-track-flex` | `1 1 0` |
 * | `--progress-track-height` | `var(--spacing-3)` |
 * | `--progress-track-min-width` | `0` |
 * | `--progress-track-overflow` | `hidden` |
 * | `--progress-track-steps-mask-image` | `linear-gradient( 			to right, 			transparent va...` |
 * | `--progress-track-steps-mask-position` | `0 0, 0 50%, 0 0, 0 0, 0 0, 0 0` |
 * | `--progress-track-steps-mask-repeat` | `repeat-x` |
 * | `--progress-track-steps-mask-size` | `var(--progress-internal-step-period) 100%, 		va...` |
 * | `--progress-value` | `-` |
 * | `--progress-value-color` | `var(--progress-value)` |
 * | `--progress-value-flex-shrink` | `0` |
 * | `--progress-value-font-size` | `var(--periscope-font-size-base)` |
 * | `--progress-value-font-variant-numeric` | `tabular-nums slashed-zero` |
 * | `--progress-value-font-weight` | `var(--periscope-font-weight-regular)` |
 * | `--progress-value-line-height` | `var(--periscope-line-height-base)` |
 * | `--progress-value-min-inline-size` | `var(--progress-internal-value-min-inline-size, ...` |
 * | `--progress-value-text-align` | `end` |
 * | `--progress-value-white-space` | `nowrap` |
 * | `--progress-warning-indicator` | `-` |
 * | `--progress-warning-indicator-background-color` | `var(--progress-warning-indicator)` |
 * | `--progress-width` | `var(--progress-internal-width, 100%)` |
 */
// #endregion css-tokens

export { Progress } from './progress.js';
export { ProgressColor } from './constants.js';
export type { ProgressColorType, ProgressProps } from './types.js';
