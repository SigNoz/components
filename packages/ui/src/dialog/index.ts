// #region css-tokens
/**
 * CSS Tokens for dialog
 * Prefix: `--dialog-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--dialog-backdrop-color` | `color-mix(in srgb, black 40%, transparent)` |
 * | `--dialog-backdrop-hidden-opacity` | `0` |
 * | `--dialog-backdrop-inset` | `0` |
 * | `--dialog-backdrop-opacity` | `1` |
 * | `--dialog-backdrop-position` | `fixed` |
 * | `--dialog-backdrop-transition-property` | `opacity` |
 * | `--dialog-background-color` | `var(--surface-2)` |
 * | `--dialog-base-max-inline-size` | `32rem` |
 * | `--dialog-body-color` | `var(--l2-foreground)` |
 * | `--dialog-body-flex` | `1 1 auto` |
 * | `--dialog-body-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--dialog-body-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--dialog-body-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--dialog-body-last-child-border-end-end-radius` | `inherit` |
 * | `--dialog-body-last-child-border-end-start-radius` | `inherit` |
 * | `--dialog-body-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--dialog-body-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--dialog-body-min-block-size` | `0` |
 * | `--dialog-body-overflow-y` | `auto` |
 * | `--dialog-body-padding` | `var(--spacing-8)` |
 * | `--dialog-body-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--dialog-border-color` | `var(--l2-border)` |
 * | `--dialog-border-radius` | `var(--radius-2)` |
 * | `--dialog-border-style` | `solid` |
 * | `--dialog-border-width` | `1px` |
 * | `--dialog-box-shadow` | `var(--shadow-dialog)` |
 * | `--dialog-box-sizing` | `border-box` |
 * | `--dialog-close-display` | `flex` |
 * | `--dialog-close-inset-block-start` | `var(--spacing-4)` |
 * | `--dialog-close-inset-inline-end` | `var(--spacing-4)` |
 * | `--dialog-close-position` | `absolute` |
 * | `--dialog-close-size` | `2rem` |
 * | `--dialog-description-color` | `var(--l2-foreground)` |
 * | `--dialog-description-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--dialog-description-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--dialog-description-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--dialog-description-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--dialog-description-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--dialog-description-margin` | `0` |
 * | `--dialog-description-overflow-wrap` | `anywhere` |
 * | `--dialog-description-skeleton-block-size` | `var(--paragraph-base-400-line-height)` |
 * | `--dialog-description-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--dialog-display` | `flex` |
 * | `--dialog-extra-wide-max-inline-size` | `51.25rem` |
 * | `--dialog-flex-direction` | `column` |
 * | `--dialog-focus-visible-outline` | `none` |
 * | `--dialog-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--dialog-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--dialog-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--dialog-footer-align-items` | `center` |
 * | `--dialog-footer-border-style` | `solid` |
 * | `--dialog-footer-border-width` | `1px 0 0 0` |
 * | `--dialog-footer-display` | `flex` |
 * | `--dialog-footer-flex-direction` | `row` |
 * | `--dialog-footer-flex-shrink` | `0` |
 * | `--dialog-footer-gap` | `var(--spacing-6)` |
 * | `--dialog-footer-justify-content` | `flex-end` |
 * | `--dialog-footer-narrow-align-items` | `stretch` |
 * | `--dialog-footer-narrow-flex-direction` | `column-reverse` |
 * | `--dialog-footer-padding` | `var(--spacing-6) var(--spacing-8)` |
 * | `--dialog-footer-prefix-align-items` | `center` |
 * | `--dialog-footer-prefix-display` | `flex` |
 * | `--dialog-footer-prefix-margin-inline-end` | `auto` |
 * | `--dialog-footer-prefix-min-inline-size` | `0` |
 * | `--dialog-footer-prefix-narrow-align-items` | `stretch` |
 * | `--dialog-footer-prefix-narrow-flex-direction` | `column` |
 * | `--dialog-footer-prefix-narrow-margin-inline-end` | `0` |
 * | `--dialog-footer-suffix-display` | `flex` |
 * | `--dialog-footer-suffix-flex-direction` | `row` |
 * | `--dialog-footer-suffix-gap` | `var(--spacing-6)` |
 * | `--dialog-footer-suffix-justify-content` | `flex-end` |
 * | `--dialog-footer-suffix-narrow-flex-direction` | `column-reverse` |
 * | `--dialog-full-max-inline-size` | `100%` |
 * | `--dialog-header-border-style` | `solid` |
 * | `--dialog-header-border-width` | `0 0 1px 0` |
 * | `--dialog-header-display` | `flex` |
 * | `--dialog-header-flex-direction` | `column` |
 * | `--dialog-header-flex-shrink` | `0` |
 * | `--dialog-header-gap` | `var(--spacing-3)` |
 * | `--dialog-header-padding-block` | `var(--spacing-8)` |
 * | `--dialog-header-padding-inline-end` | `calc(var(--spacing-4) * 2 + var(--dialog-close-...` |
 * | `--dialog-header-padding-inline-start` | `var(--spacing-8)` |
 * | `--dialog-header-position` | `relative` |
 * | `--dialog-heading-align-items` | `center` |
 * | `--dialog-heading-display` | `flex` |
 * | `--dialog-heading-gap` | `var(--spacing-4)` |
 * | `--dialog-heading-min-inline-size` | `0` |
 * | `--dialog-hidden-opacity` | `0` |
 * | `--dialog-hidden-transform` | `scale(0.98)` |
 * | `--dialog-inline-size` | `100%` |
 * | `--dialog-layer-position` | `relative` |
 * | `--dialog-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--dialog-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--dialog-max-block-size` | `100%` |
 * | `--dialog-max-inline-size` | `var(--dialog-internal-max-inline-size)` |
 * | `--dialog-narrow-max-inline-size` | `24rem` |
 * | `--dialog-opacity` | `1` |
 * | `--dialog-position` | `relative` |
 * | `--dialog-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--dialog-title-color` | `var(--l1-foreground)` |
 * | `--dialog-title-font-family` | `var(--label-base-400-font-family)` |
 * | `--dialog-title-font-size` | `var(--label-base-400-font-size)` |
 * | `--dialog-title-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--dialog-title-icon-color` | `var(--l2-foreground)` |
 * | `--dialog-title-icon-display` | `inline-flex` |
 * | `--dialog-title-icon-flex-shrink` | `0` |
 * | `--dialog-title-icon-size` | `14px` |
 * | `--dialog-title-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--dialog-title-line-height` | `var(--label-base-400-line-height)` |
 * | `--dialog-title-margin` | `0` |
 * | `--dialog-title-min-inline-size` | `0` |
 * | `--dialog-title-overflow-wrap` | `anywhere` |
 * | `--dialog-title-skeleton-block-size` | `var(--label-base-400-font-size)` |
 * | `--dialog-title-skeleton-flex` | `1 1 auto` |
 * | `--dialog-title-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--dialog-transform` | `none` |
 * | `--dialog-transition-duration` | `150ms` |
 * | `--dialog-transition-property` | `opacity, transform` |
 * | `--dialog-transition-timing-function` | `ease` |
 * | `--dialog-viewport-align-items` | `center` |
 * | `--dialog-viewport-box-sizing` | `border-box` |
 * | `--dialog-viewport-display` | `flex` |
 * | `--dialog-viewport-inset` | `0` |
 * | `--dialog-viewport-justify-content` | `center` |
 * | `--dialog-viewport-padding` | `var(--spacing-8)` |
 * | `--dialog-viewport-position` | `fixed` |
 * | `--dialog-visually-hidden-block-size` | `1px` |
 * | `--dialog-visually-hidden-border-width` | `0` |
 * | `--dialog-visually-hidden-clip-path` | `inset(50%)` |
 * | `--dialog-visually-hidden-inline-size` | `1px` |
 * | `--dialog-visually-hidden-margin` | `-1px` |
 * | `--dialog-visually-hidden-overflow` | `hidden` |
 * | `--dialog-visually-hidden-padding` | `0` |
 * | `--dialog-visually-hidden-position` | `absolute` |
 * | `--dialog-visually-hidden-white-space` | `nowrap` |
 * | `--dialog-wide-max-inline-size` | `42rem` |
 * | `--dialog-will-change` | `transform` |
 * | `--dialog-z-index` | `50` |
 */
// #endregion css-tokens

export { Dialog } from './dialog.js';
export type { DialogHandle as DialogHandleType } from './dialog-handle.js';
export { useDialogHandle } from './use-dialog-handle.js';
export type {
	DialogCloseReasonType,
	DialogProps,
	DialogWidthType,
	ValidateDialogProps,
} from './types.js';
