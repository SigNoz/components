// #region css-tokens
/**
 * CSS Tokens for field
 * Prefix: `--field-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--field-announcer-block-size` | `1px` |
 * | `--field-announcer-border` | `0` |
 * | `--field-announcer-clip-path` | `inset(50%)` |
 * | `--field-announcer-inline-size` | `1px` |
 * | `--field-announcer-margin` | `-1px` |
 * | `--field-announcer-overflow` | `hidden` |
 * | `--field-announcer-padding` | `0` |
 * | `--field-announcer-position` | `absolute` |
 * | `--field-announcer-white-space` | `nowrap` |
 * | `--field-control-display` | `flex` |
 * | `--field-control-flex-direction` | `column` |
 * | `--field-control-min-inline-size` | `0` |
 * | `--field-danger-icon` | `-` |
 * | `--field-danger-icon-color` | `var(--field-danger-icon)` |
 * | `--field-danger-label` | `-` |
 * | `--field-danger-label-color` | `var(--field-danger-label)` |
 * | `--field-danger-message` | `-` |
 * | `--field-danger-message-color` | `var(--field-danger-message)` |
 * | `--field-description-color` | `var(--l2-foreground)` |
 * | `--field-display` | `flex` |
 * | `--field-flex-direction` | `column` |
 * | `--field-font-feature-settings` | `'ss01' 1` |
 * | `--field-font-variant-numeric` | `normal` |
 * | `--field-gap` | `var(--spacing-4)` |
 * | `--field-group-border` | `0` |
 * | `--field-group-content-display` | `flex` |
 * | `--field-group-content-flex-direction` | `column` |
 * | `--field-group-content-gap` | `var(--spacing-4)` |
 * | `--field-group-content-min-inline-size` | `0` |
 * | `--field-group-margin` | `0` |
 * | `--field-group-padding` | `0` |
 * | `--field-icon-size` | `14px` |
 * | `--field-label` | `-` |
 * | `--field-label-align-items` | `last baseline` |
 * | `--field-label-color` | `var(--field-label)` |
 * | `--field-label-display` | `inline-flex` |
 * | `--field-label-font-family` | `var(--label-base-400-font-family)` |
 * | `--field-label-font-size` | `var(--label-base-400-font-size)` |
 * | `--field-label-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--field-label-gap` | `var(--spacing-2)` |
 * | `--field-label-hover` | `-` |
 * | `--field-label-hover-color` | `var(--field-label-hover)` |
 * | `--field-label-icon` | `-` |
 * | `--field-label-icon-align-self` | `center` |
 * | `--field-label-icon-color` | `var(--field-label-icon)` |
 * | `--field-label-icon-display` | `inline-flex` |
 * | `--field-label-icon-flex-shrink` | `0` |
 * | `--field-label-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--field-label-line-height` | `var(--label-base-400-line-height)` |
 * | `--field-label-max-inline-size` | `min(100%, 48ch)` |
 * | `--field-label-max-lines` | `2` |
 * | `--field-label-text-box-orient` | `vertical` |
 * | `--field-label-text-display` | `-webkit-box` |
 * | `--field-label-text-min-inline-size` | `0` |
 * | `--field-label-text-overflow` | `hidden` |
 * | `--field-label-text-overflow-wrap` | `anywhere` |
 * | `--field-label-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--field-label-transition-duration` | `150ms` |
 * | `--field-label-transition-property` | `color` |
 * | `--field-label-transition-timing-function` | `ease` |
 * | `--field-legend-float` | `inline-start` |
 * | `--field-legend-margin` | `0` |
 * | `--field-legend-padding` | `0` |
 * | `--field-message-icon-color` | `var(--field-label-icon)` |
 * | `--field-message-icon-disc-color` | `currentcolor` |
 * | `--field-message-icon-display` | `inline-flex` |
 * | `--field-message-icon-flex-shrink` | `0` |
 * | `--field-message-icon-glyph-color` | `var(--l1-background)` |
 * | `--field-message-icon-offset` | `var(--spacing-1)` |
 * | `--field-min-inline-size` | `0` |
 * | `--field-position` | `relative` |
 * | `--field-required-marker` | `-` |
 * | `--field-required-marker-color` | `var(--field-required-marker)` |
 * | `--field-required-marker-flex-shrink` | `0` |
 * | `--field-row-align-items` | `flex-start` |
 * | `--field-row-display` | `flex` |
 * | `--field-row-font-family` | `var(--paragraph-small-400-font-family)` |
 * | `--field-row-font-size` | `var(--paragraph-small-400-font-size)` |
 * | `--field-row-font-weight` | `var(--paragraph-small-400-font-weight)` |
 * | `--field-row-gap` | `var(--spacing-3)` |
 * | `--field-row-letter-spacing` | `var(--paragraph-small-400-letter-spacing)` |
 * | `--field-row-line-height` | `var(--paragraph-small-400-line-height)` |
 * | `--field-row-text-min-inline-size` | `0` |
 * | `--field-row-text-overflow-wrap` | `anywhere` |
 * | `--field-row-text-transform` | `var(--paragraph-small-400-text-transform)` |
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
export { FieldStatus } from './constants.js';
