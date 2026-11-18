// #region css-tokens
/**
 * CSS Tokens for input
 * Prefix: `--input-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--input-adornment-align-items` | `center` |
 * | `--input-adornment-display` | `inline-flex` |
 * | `--input-adornment-flex-shrink` | `0` |
 * | `--input-align-items` | `center` |
 * | `--input-background` | `-` |
 * | `--input-background-color` | `var(--input-background)` |
 * | `--input-border` | `-` |
 * | `--input-border-color` | `var(--input-border)` |
 * | `--input-border-hover` | `-` |
 * | `--input-border-radius` | `var(--radius-1)` |
 * | `--input-border-style` | `solid` |
 * | `--input-border-width` | `1px` |
 * | `--input-box-sizing` | `border-box` |
 * | `--input-color` | `var(--input-foreground)` |
 * | `--input-danger-background` | `-` |
 * | `--input-danger-background-color` | `var(--input-danger-background)` |
 * | `--input-danger-border` | `-` |
 * | `--input-danger-border-color` | `var(--input-danger-border)` |
 * | `--input-danger-icon` | `-` |
 * | `--input-danger-icon-color` | `var(--input-danger-icon)` |
 * | `--input-disabled-cursor` | `not-allowed` |
 * | `--input-disabled-opacity` | `0.6` |
 * | `--input-display` | `flex` |
 * | `--input-field-align-self` | `stretch` |
 * | `--input-field-background` | `transparent` |
 * | `--input-field-border` | `none` |
 * | `--input-field-disabled-pointer-events` | `none` |
 * | `--input-field-flex` | `1` |
 * | `--input-field-font` | `inherit` |
 * | `--input-field-letter-spacing` | `inherit` |
 * | `--input-field-min-inline-size` | `0` |
 * | `--input-field-outline` | `none` |
 * | `--input-field-padding` | `0` |
 * | `--input-field-text-transform` | `inherit` |
 * | `--input-focus-outline-offset` | `1px` |
 * | `--input-focus-outline-style` | `solid` |
 * | `--input-focus-outline-width` | `1px` |
 * | `--input-focus-ring` | `-` |
 * | `--input-focus-ring-color` | `var(--input-focus-ring)` |
 * | `--input-font-family` | `var(--input-internal-font-family)` |
 * | `--input-font-feature-settings` | `'ss01' 1` |
 * | `--input-font-size` | `var(--input-internal-font-size)` |
 * | `--input-font-variant-numeric` | `normal` |
 * | `--input-font-weight` | `var(--input-internal-font-weight)` |
 * | `--input-foreground` | `-` |
 * | `--input-gap` | `var(--spacing-2)` |
 * | `--input-hover-border-color` | `var(--input-border-hover)` |
 * | `--input-icon` | `-` |
 * | `--input-icon-color` | `var(--input-icon)` |
 * | `--input-icon-disc-color` | `currentcolor` |
 * | `--input-icon-flex-shrink` | `0` |
 * | `--input-icon-glyph-color` | `var(--l1-background)` |
 * | `--input-icon-size` | `14px` |
 * | `--input-letter-spacing` | `var(--input-internal-letter-spacing)` |
 * | `--input-lg-height` | `40px` |
 * | `--input-line-height` | `var(--input-internal-line-height)` |
 * | `--input-md-height` | `32px` |
 * | `--input-number-root-display` | `contents` |
 * | `--input-outline-color` | `transparent` |
 * | `--input-padding` | `var(--input-internal-padding-block) var(--spaci...` |
 * | `--input-password-toggle-align-items` | `center` |
 * | `--input-password-toggle-background` | `transparent` |
 * | `--input-password-toggle-border` | `none` |
 * | `--input-password-toggle-color` | `var(--input-internal-icon)` |
 * | `--input-password-toggle-cursor` | `pointer` |
 * | `--input-password-toggle-disabled-cursor` | `not-allowed` |
 * | `--input-password-toggle-display` | `inline-flex` |
 * | `--input-password-toggle-hover-color` | `var(--input-internal-placeholder-hover)` |
 * | `--input-password-toggle-padding` | `0` |
 * | `--input-placeholder` | `-` |
 * | `--input-placeholder-color` | `var(--input-placeholder)` |
 * | `--input-placeholder-hover` | `-` |
 * | `--input-placeholder-hover-color` | `var(--input-placeholder-hover)` |
 * | `--input-placeholder-opacity` | `0.6` |
 * | `--input-placeholder-transition-duration` | `150ms` |
 * | `--input-placeholder-transition-property` | `color` |
 * | `--input-placeholder-transition-timing-function` | `ease-out` |
 * | `--input-readonly-opacity` | `0.8` |
 * | `--input-sm-height` | `24px` |
 * | `--input-step-button-align-items` | `center` |
 * | `--input-step-button-background` | `transparent` |
 * | `--input-step-button-border` | `none` |
 * | `--input-step-button-color` | `var(--input-internal-icon)` |
 * | `--input-step-button-cursor` | `pointer` |
 * | `--input-step-button-disabled-cursor` | `default` |
 * | `--input-step-button-disabled-opacity` | `0.4` |
 * | `--input-step-button-display` | `inline-flex` |
 * | `--input-step-button-hover-color` | `var(--input-internal-placeholder-hover)` |
 * | `--input-step-button-justify-content` | `center` |
 * | `--input-step-button-line-height` | `0` |
 * | `--input-step-button-padding` | `0` |
 * | `--input-stepper-direction` | `column` |
 * | `--input-stepper-display` | `inline-flex` |
 * | `--input-stepper-flex-shrink` | `0` |
 * | `--input-stepper-icon-size` | `12px` |
 * | `--input-success-background` | `-` |
 * | `--input-success-background-color` | `var(--input-success-background)` |
 * | `--input-success-border` | `-` |
 * | `--input-success-border-color` | `var(--input-success-border)` |
 * | `--input-success-icon` | `-` |
 * | `--input-success-icon-color` | `var(--input-success-icon)` |
 * | `--input-text-transform` | `var(--input-internal-text-transform)` |
 * | `--input-textarea-align-items` | `flex-start` |
 * | `--input-textarea-block-size` | `auto` |
 * | `--input-textarea-resize` | `vertical` |
 * | `--input-textarea-status-icon-offset` | `calc((var(--input-line-height, var(--input-inte...` |
 * | `--input-transition-duration` | `150ms` |
 * | `--input-transition-property` | `border-color, background-color, color, opacity,...` |
 * | `--input-transition-timing-function` | `ease-out` |
 * | `--input-unstyled-background` | `transparent` |
 * | `--input-unstyled-border-color` | `transparent` |
 * | `--input-warning-background` | `-` |
 * | `--input-warning-background-color` | `var(--input-warning-background)` |
 * | `--input-warning-border` | `-` |
 * | `--input-warning-border-color` | `var(--input-warning-border)` |
 * | `--input-warning-icon` | `-` |
 * | `--input-warning-icon-color` | `var(--input-warning-icon)` |
 */
// #endregion css-tokens

export type * from './types.js';
export { Input } from './input.js';
export { InputSize, InputStatus, InputVariant } from './constants.js';
