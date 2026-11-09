// #region css-tokens
/**
 * CSS Tokens for alert-dialog
 * Prefix: `--alert-dialog-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--alert-dialog-backdrop-color` | `color-mix(in srgb, black 40%, transparent)` |
 * | `--alert-dialog-backdrop-hidden-opacity` | `0` |
 * | `--alert-dialog-backdrop-inset` | `0` |
 * | `--alert-dialog-backdrop-opacity` | `1` |
 * | `--alert-dialog-backdrop-position` | `fixed` |
 * | `--alert-dialog-backdrop-transition-duration` | `150ms` |
 * | `--alert-dialog-backdrop-transition-property` | `opacity` |
 * | `--alert-dialog-backdrop-transition-timing-function` | `ease` |
 * | `--alert-dialog-background-color` | `var(--surface-2)` |
 * | `--alert-dialog-body-color` | `var(--l2-foreground)` |
 * | `--alert-dialog-body-display` | `block` |
 * | `--alert-dialog-body-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--alert-dialog-body-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--alert-dialog-body-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--alert-dialog-body-gap` | `var(--spacing-6)` |
 * | `--alert-dialog-body-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--alert-dialog-body-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--alert-dialog-body-margin` | `0` |
 * | `--alert-dialog-body-min-block-size` | `0` |
 * | `--alert-dialog-body-overflow-wrap` | `anywhere` |
 * | `--alert-dialog-body-overflow-y` | `auto` |
 * | `--alert-dialog-body-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--alert-dialog-border-color` | `var(--l2-border)` |
 * | `--alert-dialog-border-radius` | `var(--radius-2)` |
 * | `--alert-dialog-border-style` | `solid` |
 * | `--alert-dialog-border-width` | `1px` |
 * | `--alert-dialog-box-shadow` | `var(--shadow-dialog)` |
 * | `--alert-dialog-box-sizing` | `border-box` |
 * | `--alert-dialog-content-display` | `flex` |
 * | `--alert-dialog-content-flex-direction` | `column` |
 * | `--alert-dialog-content-gap` | `var(--spacing-3)` |
 * | `--alert-dialog-content-min-block-size` | `0` |
 * | `--alert-dialog-display` | `flex` |
 * | `--alert-dialog-flex-direction` | `column` |
 * | `--alert-dialog-focus-visible-outline` | `none` |
 * | `--alert-dialog-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--alert-dialog-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--alert-dialog-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--alert-dialog-footer-display` | `flex` |
 * | `--alert-dialog-footer-flex-direction` | `row` |
 * | `--alert-dialog-footer-flex-shrink` | `0` |
 * | `--alert-dialog-footer-gap` | `var(--spacing-6)` |
 * | `--alert-dialog-footer-justify-content` | `flex-end` |
 * | `--alert-dialog-footer-narrow-flex-direction` | `column-reverse` |
 * | `--alert-dialog-gap` | `var(--spacing-12)` |
 * | `--alert-dialog-heading-align-items` | `center` |
 * | `--alert-dialog-heading-display` | `flex` |
 * | `--alert-dialog-heading-flex-shrink` | `0` |
 * | `--alert-dialog-heading-gap` | `var(--spacing-4)` |
 * | `--alert-dialog-heading-min-inline-size` | `0` |
 * | `--alert-dialog-hidden-opacity` | `0` |
 * | `--alert-dialog-hidden-transform` | `scale(0.98)` |
 * | `--alert-dialog-inline-size` | `100%` |
 * | `--alert-dialog-layer-position` | `relative` |
 * | `--alert-dialog-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--alert-dialog-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--alert-dialog-max-block-size` | `100%` |
 * | `--alert-dialog-max-inline-size` | `24rem` |
 * | `--alert-dialog-opacity` | `1` |
 * | `--alert-dialog-padding` | `var(--spacing-8)` |
 * | `--alert-dialog-position` | `relative` |
 * | `--alert-dialog-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--alert-dialog-title-color` | `var(--l1-foreground)` |
 * | `--alert-dialog-title-font-family` | `var(--paragraph-base-500-font-family)` |
 * | `--alert-dialog-title-font-size` | `var(--paragraph-base-500-font-size)` |
 * | `--alert-dialog-title-font-weight` | `var(--paragraph-base-500-font-weight)` |
 * | `--alert-dialog-title-icon-color` | `var(--l2-foreground)` |
 * | `--alert-dialog-title-icon-display` | `inline-flex` |
 * | `--alert-dialog-title-icon-flex-shrink` | `0` |
 * | `--alert-dialog-title-icon-size` | `14px` |
 * | `--alert-dialog-title-letter-spacing` | `var(--paragraph-base-500-letter-spacing)` |
 * | `--alert-dialog-title-line-height` | `var(--paragraph-base-500-line-height)` |
 * | `--alert-dialog-title-margin` | `0` |
 * | `--alert-dialog-title-min-inline-size` | `0` |
 * | `--alert-dialog-title-overflow-wrap` | `anywhere` |
 * | `--alert-dialog-title-text-transform` | `var(--paragraph-base-500-text-transform)` |
 * | `--alert-dialog-transform` | `none` |
 * | `--alert-dialog-transition-duration` | `150ms` |
 * | `--alert-dialog-transition-property` | `opacity, transform` |
 * | `--alert-dialog-transition-timing-function` | `ease` |
 * | `--alert-dialog-viewport-align-items` | `center` |
 * | `--alert-dialog-viewport-box-sizing` | `border-box` |
 * | `--alert-dialog-viewport-display` | `flex` |
 * | `--alert-dialog-viewport-inset` | `0` |
 * | `--alert-dialog-viewport-justify-content` | `center` |
 * | `--alert-dialog-viewport-padding` | `var(--spacing-8)` |
 * | `--alert-dialog-viewport-position` | `fixed` |
 * | `--alert-dialog-will-change` | `transform` |
 * | `--alert-dialog-z-index` | `50` |
 */
// #endregion css-tokens

export { AlertDialog } from './alert-dialog.js';
export type { AlertDialogColorType, AlertDialogProps, ValidateAlertDialogProps } from './types.js';
