// #region css-tokens
/**
 * CSS Tokens for field
 * Prefix: `--field-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--field-danger-icon` | `-` |
 * | `--field-danger-icon-color` | `var(--field-danger-icon)` |
 * | `--field-danger-label` | `-` |
 * | `--field-danger-label-color` | `var(--field-danger-label)` |
 * | `--field-danger-message` | `-` |
 * | `--field-danger-message-color` | `var(--field-danger-message)` |
 * | `--field-direction` | `column` |
 * | `--field-display` | `flex` |
 * | `--field-gap` | `var(--spacing-4)` |
 * | `--field-icon-size` | `14px` |
 * | `--field-label` | `-` |
 * | `--field-label-align-items` | `baseline` |
 * | `--field-label-color` | `var(--field-label)` |
 * | `--field-label-display` | `inline-flex` |
 * | `--field-label-font-family` | `inherit` |
 * | `--field-label-font-size` | `var(--periscope-font-size-base)` |
 * | `--field-label-font-weight` | `var(--font-weight-normal)` |
 * | `--field-label-gap` | `var(--spacing-4)` |
 * | `--field-label-hover` | `-` |
 * | `--field-label-hover-color` | `var(--field-label-hover)` |
 * | `--field-label-icon` | `-` |
 * | `--field-label-icon-align-items` | `center` |
 * | `--field-label-icon-color` | `var(--field-label-icon)` |
 * | `--field-label-icon-display` | `inline-flex` |
 * | `--field-label-letter-spacing` | `-0.005em` |
 * | `--field-label-line-height` | `20px` |
 * | `--field-label-row-align-items` | `center` |
 * | `--field-label-row-display` | `flex` |
 * | `--field-label-transition` | `color 150ms ease` |
 * | `--field-message-align-items` | `flex-start` |
 * | `--field-message-color` | `initial` |
 * | `--field-message-display` | `flex` |
 * | `--field-message-font-family` | `inherit` |
 * | `--field-message-font-size` | `var(--periscope-font-size-small)` |
 * | `--field-message-font-weight` | `var(--font-weight-normal)` |
 * | `--field-message-gap` | `var(--spacing-3)` |
 * | `--field-message-icon-color` | `initial` |
 * | `--field-message-icon-display` | `inline-flex` |
 * | `--field-message-icon-offset` | `var(--spacing-1)` |
 * | `--field-message-letter-spacing` | `-0.005em` |
 * | `--field-message-line-height` | `18px` |
 * | `--field-message-text-min-inline-size` | `0` |
 * | `--field-required-marker` | `-` |
 * | `--field-required-marker-color` | `var(--field-required-marker)` |
 * | `--field-required-marker-gap` | `var(--spacing-1)` |
 * | `--field-success-icon` | `-` |
 * | `--field-success-icon-color` | `var(--field-success-icon)` |
 * | `--field-success-label` | `-` |
 * | `--field-success-label-color` | `var(--field-success-label)` |
 * | `--field-success-message` | `-` |
 * | `--field-success-message-color` | `var(--field-success-message)` |
 * | `--field-warning-icon` | `-` |
 * | `--field-warning-icon-color` | `var(--field-warning-icon)` |
 * | `--field-warning-label` | `-` |
 * | `--field-warning-label-color` | `var(--field-warning-label)` |
 * | `--field-warning-message` | `-` |
 * | `--field-warning-message-color` | `var(--field-warning-message)` |
 */
// #endregion css-tokens

export type * from './types.js';
export { Field } from './field.js';
export { FieldSize, FieldStatus } from './constants.js';
