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
 * | `--alert-strip-bar-align-self` | `flex-end` |
 * | `--alert-strip-bar-flex` | `1 1 0%` |
 * | `--alert-strip-bar-height` | `8px` |
 * | `--alert-strip-bar-min-width` | `0` |
 * | `--alert-strip-bar-top-align-self` | `flex-start` |
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
 * | `--alert-strip-close-align-items` | `center` |
 * | `--alert-strip-close-border` | `none` |
 * | `--alert-strip-close-border-radius` | `var(--radius-1)` |
 * | `--alert-strip-close-box-sizing` | `border-box` |
 * | `--alert-strip-close-cursor` | `pointer` |
 * | `--alert-strip-close-display` | `flex` |
 * | `--alert-strip-close-flex-shrink` | `0` |
 * | `--alert-strip-close-icon-size` | `12px` |
 * | `--alert-strip-close-justify-content` | `center` |
 * | `--alert-strip-close-padding` | `0` |
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
 * | `--alert-strip-dots-inset-block-end` | `calc(var(--alert-strip-internal-bar-height) - 1px)` |
 * | `--alert-strip-dots-inset-inline-start` | `31px` |
 * | `--alert-strip-dots-position` | `absolute` |
 * | `--alert-strip-dots-size` | `18px` |
 * | `--alert-strip-end-flex-shrink` | `0` |
 * | `--alert-strip-end-inline-size` | `54px` |
 * | `--alert-strip-end-last-child-transform` | `scaleX(-1)` |
 * | `--alert-strip-end-position` | `relative` |
 * | `--alert-strip-end-top-scale` | `1 -1` |
 * | `--alert-strip-focus-visible-outline` | `var(--alert-strip-internal-foreground) solid 1px` |
 * | `--alert-strip-focus-visible-outline-offset` | `1px` |
 * | `--alert-strip-font-family` | `var(--paragraph-base-500-font-family)` |
 * | `--alert-strip-font-feature-settings` | `'ss01' 1` |
 * | `--alert-strip-font-size` | `var(--paragraph-base-500-font-size)` |
 * | `--alert-strip-font-variant-numeric` | `normal` |
 * | `--alert-strip-font-weight` | `var(--paragraph-base-500-font-weight)` |
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
 * | `--alert-strip-letter-spacing` | `var(--paragraph-base-500-letter-spacing)` |
 * | `--alert-strip-line-height` | `var(--paragraph-base-500-line-height)` |
 * | `--alert-strip-link-border-radius` | `var(--radius-1)` |
 * | `--alert-strip-link-cursor` | `pointer` |
 * | `--alert-strip-link-is-button-background` | `none` |
 * | `--alert-strip-link-is-button-border` | `0` |
 * | `--alert-strip-link-is-button-display` | `inline` |
 * | `--alert-strip-link-is-button-font` | `inherit` |
 * | `--alert-strip-link-is-button-letter-spacing` | `inherit` |
 * | `--alert-strip-link-is-button-padding` | `0` |
 * | `--alert-strip-link-is-button-text-transform` | `inherit` |
 * | `--alert-strip-link-text-decoration` | `underline` |
 * | `--alert-strip-link-transition-property` | `color` |
 * | `--alert-strip-margin` | `0` |
 * | `--alert-strip-min-height` | `2rem` |
 * | `--alert-strip-prefix-align-items` | `center` |
 * | `--alert-strip-prefix-display` | `flex` |
 * | `--alert-strip-prefix-flex-shrink` | `0` |
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
 * | `--alert-strip-region-before-clip-path` | `polygon( -1px calc(100% + 1px), -1px calc(100% ...` |
 * | `--alert-strip-region-before-inset` | `0` |
 * | `--alert-strip-region-before-position` | `absolute` |
 * | `--alert-strip-region-before-top-clip-path` | `polygon( -1px -1px, -1px var(--alert-strip-inte...` |
 * | `--alert-strip-region-before-z-index` | `-1` |
 * | `--alert-strip-region-display` | `flex` |
 * | `--alert-strip-region-flex` | `0 1 942px` |
 * | `--alert-strip-region-isolation` | `isolate` |
 * | `--alert-strip-region-min-width` | `0` |
 * | `--alert-strip-region-position` | `relative` |
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
 * | `--alert-strip-suffix-align-items` | `center` |
 * | `--alert-strip-suffix-display` | `flex` |
 * | `--alert-strip-suffix-flex-shrink` | `0` |
 * | `--alert-strip-suffix-gap` | `var(--spacing-2)` |
 * | `--alert-strip-suffix-margin-inline-start` | `var(--spacing-2)` |
 * | `--alert-strip-text-transform` | `var(--paragraph-base-500-text-transform)` |
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
