// #region css-tokens
/**
 * CSS Tokens for alert-strip
 * Prefix: `--alert-strip-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--alert-strip-archive-background` | `-` |
 * | `--alert-strip-archive-background-color` | `var(--alert-strip-archive-background)` |
 * | `--alert-strip-archive-foreground` | `-` |
 * | `--alert-strip-archive-foreground-color` | `var(--alert-strip-archive-foreground)` |
 * | `--alert-strip-archive-link-hover` | `-` |
 * | `--alert-strip-archive-link-hover-color` | `var(--alert-strip-archive-link-hover)` |
 * | `--alert-strip-bar-height` | `8px` |
 * | `--alert-strip-body-align-items` | `center` |
 * | `--alert-strip-body-display` | `flex` |
 * | `--alert-strip-body-flex` | `1 1 0%` |
 * | `--alert-strip-body-gap` | `var(--spacing-2)` |
 * | `--alert-strip-body-min-width` | `0` |
 * | `--alert-strip-body-padding` | `var(--spacing-1) var(--spacing-2)` |
 * | `--alert-strip-box-sizing` | `border-box` |
 * | `--alert-strip-button-background` | `-` |
 * | `--alert-strip-button-background-color` | `var(--alert-strip-button-background)` |
 * | `--alert-strip-button-background-hover` | `-` |
 * | `--alert-strip-button-foreground` | `-` |
 * | `--alert-strip-button-foreground-color` | `var(--alert-strip-button-foreground)` |
 * | `--alert-strip-button-hover-background-color` | `var(--alert-strip-button-background-hover)` |
 * | `--alert-strip-button-margin-inline-start` | `var(--spacing-4)` |
 * | `--alert-strip-button-vertical-align` | `middle` |
 * | `--alert-strip-close-border` | `none` |
 * | `--alert-strip-close-border-radius` | `var(--radius-1)` |
 * | `--alert-strip-close-cursor` | `pointer` |
 * | `--alert-strip-close-display` | `flex` |
 * | `--alert-strip-close-icon-size` | `12px` |
 * | `--alert-strip-close-size` | `24px` |
 * | `--alert-strip-close-transition-property` | `background-color` |
 * | `--alert-strip-content-flex` | `1 1 0%` |
 * | `--alert-strip-content-font-feature-settings` | `'ss01'` |
 * | `--alert-strip-content-font-variant-numeric` | `slashed-zero lining-nums tabular-nums` |
 * | `--alert-strip-content-min-width` | `0` |
 * | `--alert-strip-content-overflow-wrap` | `anywhere` |
 * | `--alert-strip-danger-background` | `-` |
 * | `--alert-strip-danger-background-color` | `var(--alert-strip-danger-background)` |
 * | `--alert-strip-danger-foreground` | `-` |
 * | `--alert-strip-danger-foreground-color` | `var(--alert-strip-danger-foreground)` |
 * | `--alert-strip-danger-link-hover` | `-` |
 * | `--alert-strip-danger-link-hover-color` | `var(--alert-strip-danger-link-hover)` |
 * | `--alert-strip-decoration` | `-` |
 * | `--alert-strip-decoration-color` | `var(--alert-strip-decoration)` |
 * | `--alert-strip-display` | `flex` |
 * | `--alert-strip-dots-inset-inline-start` | `31px` |
 * | `--alert-strip-dots-size` | `18px` |
 * | `--alert-strip-end-inline-size` | `54px` |
 * | `--alert-strip-focus-visible-outline` | `var(--alert-strip-internal-foreground) solid 1px` |
 * | `--alert-strip-focus-visible-outline-offset` | `1px` |
 * | `--alert-strip-font-size` | `var(--periscope-font-size-base)` |
 * | `--alert-strip-font-weight` | `var(--periscope-font-weight-medium)` |
 * | `--alert-strip-highlight-danger-background` | `-` |
 * | `--alert-strip-highlight-danger-background-color` | `var(--alert-strip-highlight-danger-background)` |
 * | `--alert-strip-highlight-danger-foreground` | `-` |
 * | `--alert-strip-highlight-danger-foreground-color` | `var(--alert-strip-highlight-danger-foreground)` |
 * | `--alert-strip-highlight-danger-link-hover` | `-` |
 * | `--alert-strip-highlight-danger-link-hover-color` | `var(--alert-strip-highlight-danger-link-hover)` |
 * | `--alert-strip-info-background` | `-` |
 * | `--alert-strip-info-background-color` | `var(--alert-strip-info-background)` |
 * | `--alert-strip-info-foreground` | `-` |
 * | `--alert-strip-info-foreground-color` | `var(--alert-strip-info-foreground)` |
 * | `--alert-strip-info-link-hover` | `-` |
 * | `--alert-strip-info-link-hover-color` | `var(--alert-strip-info-link-hover)` |
 * | `--alert-strip-justify-content` | `center` |
 * | `--alert-strip-letter-spacing` | `-0.005em` |
 * | `--alert-strip-line-height` | `var(--periscope-line-height-base)` |
 * | `--alert-strip-link-border-radius` | `var(--radius-1)` |
 * | `--alert-strip-link-cursor` | `pointer` |
 * | `--alert-strip-link-text-decoration` | `underline` |
 * | `--alert-strip-link-transition-property` | `color` |
 * | `--alert-strip-min-height` | `2rem` |
 * | `--alert-strip-prefix-display` | `flex` |
 * | `--alert-strip-prefix-gap` | `var(--spacing-2)` |
 * | `--alert-strip-prefix-icon-disc-color` | `currentcolor` |
 * | `--alert-strip-prefix-icon-glyph-color` | `var(--alert-strip-internal-background)` |
 * | `--alert-strip-prefix-icon-size` | `12px` |
 * | `--alert-strip-primary-background` | `-` |
 * | `--alert-strip-primary-background-color` | `var(--alert-strip-primary-background)` |
 * | `--alert-strip-primary-foreground` | `-` |
 * | `--alert-strip-primary-foreground-color` | `var(--alert-strip-primary-foreground)` |
 * | `--alert-strip-primary-link-hover` | `-` |
 * | `--alert-strip-primary-link-hover-color` | `var(--alert-strip-primary-link-hover)` |
 * | `--alert-strip-region-display` | `flex` |
 * | `--alert-strip-region-flex` | `0 1 942px` |
 * | `--alert-strip-region-min-width` | `0` |
 * | `--alert-strip-secondary-background` | `-` |
 * | `--alert-strip-secondary-background-color` | `var(--alert-strip-secondary-background)` |
 * | `--alert-strip-secondary-foreground` | `-` |
 * | `--alert-strip-secondary-foreground-color` | `var(--alert-strip-secondary-foreground)` |
 * | `--alert-strip-secondary-link-hover` | `-` |
 * | `--alert-strip-secondary-link-hover-color` | `var(--alert-strip-secondary-link-hover)` |
 * | `--alert-strip-success-background` | `-` |
 * | `--alert-strip-success-background-color` | `var(--alert-strip-success-background)` |
 * | `--alert-strip-success-foreground` | `-` |
 * | `--alert-strip-success-foreground-color` | `var(--alert-strip-success-foreground)` |
 * | `--alert-strip-success-link-hover` | `-` |
 * | `--alert-strip-success-link-hover-color` | `var(--alert-strip-success-link-hover)` |
 * | `--alert-strip-suffix-display` | `flex` |
 * | `--alert-strip-suffix-gap` | `var(--spacing-2)` |
 * | `--alert-strip-suffix-margin-inline-start` | `var(--spacing-2)` |
 * | `--alert-strip-transition-duration` | `150ms` |
 * | `--alert-strip-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
 * | `--alert-strip-warning-background` | `-` |
 * | `--alert-strip-warning-background-color` | `var(--alert-strip-warning-background)` |
 * | `--alert-strip-warning-foreground` | `-` |
 * | `--alert-strip-warning-foreground-color` | `var(--alert-strip-warning-foreground)` |
 * | `--alert-strip-warning-link-hover` | `-` |
 * | `--alert-strip-warning-link-hover-color` | `var(--alert-strip-warning-link-hover)` |
 * | `--alert-strip-width` | `100%` |
 */
// #endregion css-tokens

export type * from './types.js';
export { AlertStrip } from './alert-strip.js';
export { AlertStripColor, AlertStripSide } from './constants.js';
export type {
	AlertStripButtonProps,
	ValidateAlertStripButtonProps,
} from './subcomponents/alert-strip-button.js';
export type { AlertStripCloseableProps } from './subcomponents/alert-strip-closeable.js';
export type { AlertStripCloseablePersistedProps } from './subcomponents/alert-strip-closeable-persisted.js';
export type { AlertStripLinkProps } from './subcomponents/alert-strip-link.js';
