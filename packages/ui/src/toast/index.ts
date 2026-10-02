// #region css-tokens
/**
 * CSS Tokens for toast
 * Prefix: `--toast-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--toast-action-background` | `none` |
 * | `--toast-action-background-hover` | `-` |
 * | `--toast-action-behind-expanded-opacity` | `1` |
 * | `--toast-action-behind-opacity` | `0` |
 * | `--toast-action-border` | `0` |
 * | `--toast-action-box-sizing` | `border-box` |
 * | `--toast-action-color` | `var(--toast-action-label)` |
 * | `--toast-action-cursor` | `pointer` |
 * | `--toast-action-divider` | `-` |
 * | `--toast-action-divider-color` | `var(--toast-action-divider)` |
 * | `--toast-action-divider-style` | `solid` |
 * | `--toast-action-divider-width` | `1px` |
 * | `--toast-action-flex` | `none` |
 * | `--toast-action-font` | `inherit` |
 * | `--toast-action-font-size` | `var(--periscope-font-size-small)` |
 * | `--toast-action-hover-background-color` | `var(--toast-action-background-hover)` |
 * | `--toast-action-hover-color` | `var(--toast-action-label-hover)` |
 * | `--toast-action-inline-size` | `var(--spacing-48)` |
 * | `--toast-action-label` | `-` |
 * | `--toast-action-label-hover` | `-` |
 * | `--toast-action-line-height` | `var(--line-height-18)` |
 * | `--toast-action-margin` | `0` |
 * | `--toast-action-padding-inline` | `var(--spacing-4)` |
 * | `--toast-action-transition-property` | `opacity, background-color, color` |
 * | `--toast-align-items` | `stretch` |
 * | `--toast-background` | `-` |
 * | `--toast-background-color` | `var(--toast-background)` |
 * | `--toast-border` | `-` |
 * | `--toast-border-color` | `var(--toast-border)` |
 * | `--toast-border-radius` | `var(--radius-2)` |
 * | `--toast-border-style` | `solid` |
 * | `--toast-border-width` | `1px` |
 * | `--toast-bottom` | `0` |
 * | `--toast-bottom-transform-origin` | `bottom center` |
 * | `--toast-box-shadow` | `var(--toast-shadow)` |
 * | `--toast-box-sizing` | `border-box` |
 * | `--toast-bridge-block-size` | `calc(var(--toast-internal-gap) + 1px)` |
 * | `--toast-bridge-bottom` | `100%` |
 * | `--toast-bridge-inset-inline` | `0` |
 * | `--toast-bridge-position` | `absolute` |
 * | `--toast-bridge-top` | `100%` |
 * | `--toast-content-align-items` | `flex-start` |
 * | `--toast-content-behind-expanded-opacity` | `1` |
 * | `--toast-content-behind-opacity` | `0` |
 * | `--toast-content-display` | `flex` |
 * | `--toast-content-flex` | `1 1 auto` |
 * | `--toast-content-gap` | `var(--spacing-5)` |
 * | `--toast-content-min-inline-size` | `0` |
 * | `--toast-content-padding-block` | `var(--spacing-7)` |
 * | `--toast-content-padding-inline` | `var(--spacing-8)` |
 * | `--toast-content-transition-property` | `opacity` |
 * | `--toast-danger-icon` | `-` |
 * | `--toast-danger-icon-color` | `var(--toast-danger-icon)` |
 * | `--toast-description` | `-` |
 * | `--toast-description-color` | `var(--toast-description)` |
 * | `--toast-description-margin` | `0` |
 * | `--toast-display` | `flex` |
 * | `--toast-enter-opacity` | `0` |
 * | `--toast-exit-opacity` | `0` |
 * | `--toast-focus-ring` | `-` |
 * | `--toast-focus-visible-outline` | `var(--toast-focus-ring) solid 1px` |
 * | `--toast-focus-visible-outline-offset` | `1px` |
 * | `--toast-font-size` | `var(--periscope-font-size-base)` |
 * | `--toast-font-weight` | `var(--periscope-font-weight-regular)` |
 * | `--toast-icon-align-items` | `center` |
 * | `--toast-icon-disc-color` | `currentcolor` |
 * | `--toast-icon-display` | `inline-flex` |
 * | `--toast-icon-flex` | `none` |
 * | `--toast-icon-glyph-color` | `var(--toast-internal-background)` |
 * | `--toast-icon-line-height` | `0` |
 * | `--toast-icon-size` | `var(--size-icon-toast)` |
 * | `--toast-info-icon` | `-` |
 * | `--toast-info-icon-color` | `var(--toast-info-icon)` |
 * | `--toast-inline-size` | `100%` |
 * | `--toast-inset-inline` | `0` |
 * | `--toast-limited-opacity` | `0` |
 * | `--toast-limited-pointer-events` | `none` |
 * | `--toast-line-height` | `var(--line-height-20)` |
 * | `--toast-loading-icon` | `-` |
 * | `--toast-loading-icon-color` | `var(--toast-loading-icon)` |
 * | `--toast-pointer-events` | `auto` |
 * | `--toast-position` | `absolute` |
 * | `--toast-shadow` | `-` |
 * | `--toast-stack-gap` | `var(--spacing-4)` |
 * | `--toast-stack-scale-step` | `0.05` |
 * | `--toast-stack-z-index` | `1000` |
 * | `--toast-success-icon` | `-` |
 * | `--toast-success-icon-color` | `var(--toast-success-icon)` |
 * | `--toast-text-display` | `flex` |
 * | `--toast-text-flex` | `1 1 auto` |
 * | `--toast-text-flex-direction` | `column` |
 * | `--toast-text-min-inline-size` | `0` |
 * | `--toast-text-overflow-wrap` | `anywhere` |
 * | `--toast-title` | `-` |
 * | `--toast-title-color` | `var(--toast-title)` |
 * | `--toast-title-font` | `inherit` |
 * | `--toast-title-margin` | `0` |
 * | `--toast-top` | `0` |
 * | `--toast-transform-origin` | `top center` |
 * | `--toast-transition-duration` | `150ms` |
 * | `--toast-transition-property` | `opacity, transform, block-size` |
 * | `--toast-transition-timing-function` | `ease` |
 * | `--toast-transition-travel` | `var(--spacing-4)` |
 * | `--toast-viewport-box-sizing` | `border-box` |
 * | `--toast-viewport-center-left` | `50%` |
 * | `--toast-viewport-center-transform` | `translateX(-50%)` |
 * | `--toast-viewport-inline-size` | `26.25rem` |
 * | `--toast-viewport-margin` | `0` |
 * | `--toast-viewport-max-inline-size` | `calc(100vw - 2 * var(--toast-internal-offset))` |
 * | `--toast-viewport-offset` | `var(--toast-internal-viewport-offset, var(--spa...` |
 * | `--toast-viewport-padding` | `0` |
 * | `--toast-viewport-pointer-events` | `none` |
 * | `--toast-viewport-position` | `fixed` |
 * | `--toast-viewport-z-index` | `999999999` |
 * | `--toast-warning-icon` | `-` |
 * | `--toast-warning-icon-color` | `var(--toast-warning-icon)` |
 */
// #endregion css-tokens

export { toast } from './toast.js';
export { Toaster } from './toaster.js';
export { ToastPosition, ToastVariant } from './constants.js';
export type {
	ToastAction,
	ToastDangerOptions,
	ToasterProps,
	ToastOptions,
	ToastPositionType,
	ToastPromiseOptions,
	ToastVariantType,
} from './types.js';
