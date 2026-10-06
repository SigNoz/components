// #region css-tokens
/**
 * CSS Tokens for input
 * Prefix: `--input-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--input-adornment-align-items` | `center` |
 * | `--input-adornment-display` | `inline-flex` |
 * | `--input-align-items` | `center` |
 * | `--input-background` | `-` |
 * | `--input-background-color` | `var(--input-background)` |
 * | `--input-border` | `-` |
 * | `--input-border-color` | `var(--input-border)` |
 * | `--input-border-hover` | `-` |
 * | `--input-border-radius` | `var(--radius-1)` |
 * | `--input-border-width` | `1px` |
 * | `--input-color` | `var(--input-foreground)` |
 * | `--input-danger-background` | `-` |
 * | `--input-danger-background-color` | `var(--input-danger-background)` |
 * | `--input-danger-border` | `-` |
 * | `--input-danger-border-color` | `var(--input-danger-border)` |
 * | `--input-danger-icon` | `-` |
 * | `--input-danger-icon-color` | `var(--input-danger-icon)` |
 * | `--input-disabled-cursor` | `not-allowed` |
 * | `--input-disabled-opacity` | `0.4` |
 * | `--input-display` | `flex` |
 * | `--input-field-background` | `transparent` |
 * | `--input-field-border` | `none` |
 * | `--input-field-flex` | `1` |
 * | `--input-field-min-inline-size` | `0` |
 * | `--input-field-outline` | `none` |
 * | `--input-field-padding` | `0` |
 * | `--input-focus-outline` | `1px solid var(--input-internal-focus-ring)` |
 * | `--input-focus-outline-offset` | `1px` |
 * | `--input-focus-ring` | `-` |
 * | `--input-focus-ring-color` | `var(--input-focus-ring)` |
 * | `--input-font-family` | `inherit` |
 * | `--input-font-size` | `var(--periscope-font-size-base)` |
 * | `--input-font-weight` | `var(--font-weight-normal)` |
 * | `--input-foreground` | `-` |
 * | `--input-gap` | `var(--spacing-2)` |
 * | `--input-height` | `32px` |
 * | `--input-hover-border-color` | `var(--input-border-hover)` |
 * | `--input-icon` | `-` |
 * | `--input-icon-color` | `var(--input-icon)` |
 * | `--input-icon-size` | `14px` |
 * | `--input-large-height` | `40px` |
 * | `--input-letter-spacing` | `-0.005em` |
 * | `--input-line-height` | `20px` |
 * | `--input-number-root-display` | `contents` |
 * | `--input-padding` | `var(--spacing-3) var(--spacing-6) var(--spacing...` |
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
 * | `--input-readonly-opacity` | `0.8` |
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
 * | `--input-stepper-icon-size` | `12px` |
 * | `--input-success-background` | `-` |
 * | `--input-success-background-color` | `var(--input-success-background)` |
 * | `--input-success-border` | `-` |
 * | `--input-success-border-color` | `var(--input-success-border)` |
 * | `--input-success-icon` | `-` |
 * | `--input-success-icon-color` | `var(--input-success-icon)` |
 * | `--input-textarea-align-items` | `flex-start` |
 * | `--input-textarea-block-size` | `auto` |
 * | `--input-textarea-resize` | `vertical` |
 * | `--input-textarea-status-icon-offset` | `calc((var(--input-line-height, 20px) - var(--in...` |
 * | `--input-transition` | `border-color 150ms ease, background-color 150ms...` |
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
