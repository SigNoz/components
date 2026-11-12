// #region css-tokens
/**
 * CSS Tokens for checkbox
 * Prefix: `--checkbox-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--checkbox-archive-background` | `-` |
 * | `--checkbox-archive-border-hover` | `-` |
 * | `--checkbox-archive-foreground` | `-` |
 * | `--checkbox-background` | `transparent` |
 * | `--checkbox-border` | `-` |
 * | `--checkbox-border-color` | `var(--checkbox-border)` |
 * | `--checkbox-border-hover` | `var(--checkbox-internal-hover-border-color)` |
 * | `--checkbox-border-radius` | `var(--radius-1)` |
 * | `--checkbox-border-width` | `1.5px` |
 * | `--checkbox-box-align-items` | `center` |
 * | `--checkbox-box-display` | `flex` |
 * | `--checkbox-box-justify-content` | `center` |
 * | `--checkbox-checked-background` | `var(--checkbox-internal-checked-background)` |
 * | `--checkbox-checked-border` | `var(--checkbox-internal-checked-background)` |
 * | `--checkbox-checked-foreground` | `var(--checkbox-internal-checked-foreground)` |
 * | `--checkbox-container-align-items` | `flex-start` |
 * | `--checkbox-container-display` | `inline-flex` |
 * | `--checkbox-container-min-width` | `0` |
 * | `--checkbox-cursor` | `pointer` |
 * | `--checkbox-danger-background` | `-` |
 * | `--checkbox-danger-border-hover` | `-` |
 * | `--checkbox-danger-foreground` | `-` |
 * | `--checkbox-disabled-cursor` | `not-allowed` |
 * | `--checkbox-disabled-opacity` | `0.6` |
 * | `--checkbox-display` | `inline-flex` |
 * | `--checkbox-field-align-items` | `flex-start` |
 * | `--checkbox-field-danger-icon-color` | `var(--field-danger-icon)` |
 * | `--checkbox-field-danger-label-color` | `var(--field-danger-label)` |
 * | `--checkbox-field-danger-message-color` | `var(--field-danger-message)` |
 * | `--checkbox-field-description-color` | `var(--l2-foreground)` |
 * | `--checkbox-field-display` | `flex` |
 * | `--checkbox-field-flex-direction` | `column` |
 * | `--checkbox-field-font-feature-settings` | `'ss01' 1` |
 * | `--checkbox-field-font-variant-numeric` | `normal` |
 * | `--checkbox-field-gap` | `var(--spacing-4)` |
 * | `--checkbox-field-label-align-items` | `last baseline` |
 * | `--checkbox-field-label-display` | `inline-flex` |
 * | `--checkbox-field-label-gap` | `var(--spacing-2)` |
 * | `--checkbox-field-label-icon-color` | `var(--field-label-icon)` |
 * | `--checkbox-field-label-max-inline-size` | `100%` |
 * | `--checkbox-field-label-min-inline-size` | `0` |
 * | `--checkbox-field-message-icon-color` | `var(--field-label-icon)` |
 * | `--checkbox-field-min-inline-size` | `0` |
 * | `--checkbox-field-position` | `relative` |
 * | `--checkbox-field-row-box-sizing` | `border-box` |
 * | `--checkbox-field-row-max-inline-size` | `100%` |
 * | `--checkbox-field-row-min-inline-size` | `0` |
 * | `--checkbox-field-row-offset` | `calc(var(--checkbox-size, 16px) + var(--checkbo...` |
 * | `--checkbox-field-success-icon-color` | `var(--field-success-icon)` |
 * | `--checkbox-field-success-label-color` | `var(--field-success-label)` |
 * | `--checkbox-field-success-message-color` | `var(--field-success-message)` |
 * | `--checkbox-field-warning-icon-color` | `var(--field-warning-icon)` |
 * | `--checkbox-field-warning-label-color` | `var(--field-warning-label)` |
 * | `--checkbox-field-warning-message-color` | `var(--field-warning-message)` |
 * | `--checkbox-flex-shrink` | `0` |
 * | `--checkbox-focus-ring` | `-` |
 * | `--checkbox-focus-visible-outline` | `1px solid var(--checkbox-focus-ring)` |
 * | `--checkbox-focus-visible-outline-offset` | `1px` |
 * | `--checkbox-gap` | `var(--spacing-5)` |
 * | `--checkbox-highlight-danger-background` | `-` |
 * | `--checkbox-highlight-danger-border-hover` | `-` |
 * | `--checkbox-highlight-danger-foreground` | `-` |
 * | `--checkbox-icon-size` | `12px` |
 * | `--checkbox-info-background` | `-` |
 * | `--checkbox-info-border-hover` | `-` |
 * | `--checkbox-info-foreground` | `-` |
 * | `--checkbox-label` | `-` |
 * | `--checkbox-label-color` | `var(--checkbox-label)` |
 * | `--checkbox-label-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--checkbox-label-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--checkbox-label-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--checkbox-label-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--checkbox-label-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--checkbox-label-overflow` | `hidden` |
 * | `--checkbox-label-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--checkbox-label-tooltip-max-width` | `20rem` |
 * | `--checkbox-label-transition` | `opacity 150ms ease` |
 * | `--checkbox-label-white-space` | `nowrap` |
 * | `--checkbox-margin-block-start` | `calc((var(--checkbox-internal-label-line-height...` |
 * | `--checkbox-primary-background` | `-` |
 * | `--checkbox-primary-border-hover` | `-` |
 * | `--checkbox-primary-foreground` | `-` |
 * | `--checkbox-readonly-cursor` | `not-allowed` |
 * | `--checkbox-readonly-opacity` | `0.8` |
 * | `--checkbox-size` | `16px` |
 * | `--checkbox-success-background` | `-` |
 * | `--checkbox-success-border-hover` | `-` |
 * | `--checkbox-success-foreground` | `-` |
 * | `--checkbox-text-overflow-visible` | `visible` |
 * | `--checkbox-text-text-overflow` | `ellipsis` |
 * | `--checkbox-transition` | `background-color 150ms ease, border-color 150ms...` |
 * | `--checkbox-warning-background` | `-` |
 * | `--checkbox-warning-border-hover` | `-` |
 * | `--checkbox-warning-foreground` | `-` |
 * | `--checkbox-wrap-overflow-wrap` | `anywhere` |
 * | `--checkbox-wrap-white-space` | `normal` |
 */
// #endregion css-tokens

export { Checkbox } from './checkbox.js';
export { CheckboxField } from './presets/checkbox-field.js';
export { CheckboxColor, CheckboxTextOverflow } from './constants.js';
export type {
	CheckboxColorType,
	CheckboxDisableType,
	CheckboxFieldProps,
	CheckboxProps,
	CheckboxReadOnlyType,
	CheckboxTextOverflowType,
	CheckboxValueType,
	ValidateCheckboxProps,
} from './types.js';
