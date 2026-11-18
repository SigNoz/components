// #region css-tokens
/**
 * CSS Tokens for date-picker
 * Prefix: `--date-picker-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--date-picker-apply-display` | `flex` |
 * | `--date-picker-apply-justify-content` | `flex-end` |
 * | `--date-picker-background` | `-` |
 * | `--date-picker-border` | `-` |
 * | `--date-picker-box-sizing` | `border-box` |
 * | `--date-picker-calendar-background-color` | `transparent` |
 * | `--date-picker-clear-align-items` | `center` |
 * | `--date-picker-clear-background-color` | `transparent` |
 * | `--date-picker-clear-border` | `none` |
 * | `--date-picker-clear-cursor` | `pointer` |
 * | `--date-picker-clear-display` | `inline-flex` |
 * | `--date-picker-clear-inset-block` | `0` |
 * | `--date-picker-clear-inset-inline-end` | `calc( var(--date-picker-trigger-border-width, 1...` |
 * | `--date-picker-clear-justify-content` | `center` |
 * | `--date-picker-clear-margin` | `0` |
 * | `--date-picker-clear-padding` | `0` |
 * | `--date-picker-clear-position` | `absolute` |
 * | `--date-picker-display` | `flex` |
 * | `--date-picker-footer-border-style` | `solid` |
 * | `--date-picker-footer-border-width` | `1px` |
 * | `--date-picker-footer-display` | `flex` |
 * | `--date-picker-footer-flex-direction` | `column` |
 * | `--date-picker-footer-gap` | `var(--spacing-4)` |
 * | `--date-picker-footer-padding` | `var(--spacing-6)` |
 * | `--date-picker-footer-padding-block-start` | `var(--spacing-4)` |
 * | `--date-picker-icon-align-items` | `center` |
 * | `--date-picker-icon-color` | `var(--date-picker-trigger-icon)` |
 * | `--date-picker-icon-display` | `inline-flex` |
 * | `--date-picker-icon-flex-shrink` | `0` |
 * | `--date-picker-icon-hover-color` | `var(--date-picker-trigger-icon-hover)` |
 * | `--date-picker-icon-justify-content` | `center` |
 * | `--date-picker-icon-readonly-visibility` | `hidden` |
 * | `--date-picker-icon-size` | `14px` |
 * | `--date-picker-input-block-size` | `100%` |
 * | `--date-picker-input-border` | `0` |
 * | `--date-picker-input-box-sizing` | `border-box` |
 * | `--date-picker-input-inline-size` | `100%` |
 * | `--date-picker-input-inset` | `0` |
 * | `--date-picker-input-margin` | `0` |
 * | `--date-picker-input-opacity` | `0` |
 * | `--date-picker-input-padding` | `0` |
 * | `--date-picker-input-pointer-events` | `none` |
 * | `--date-picker-input-position` | `absolute` |
 * | `--date-picker-max-width` | `var(--date-picker-internal-max-width, 100%)` |
 * | `--date-picker-placeholder-color` | `var(--date-picker-trigger-placeholder)` |
 * | `--date-picker-popup-backdrop-filter` | `blur(40px)` |
 * | `--date-picker-popup-background-color` | `var(--date-picker-background)` |
 * | `--date-picker-popup-border-color` | `var(--date-picker-border)` |
 * | `--date-picker-popup-border-radius` | `var(--radius-2)` |
 * | `--date-picker-popup-border-style` | `solid` |
 * | `--date-picker-popup-border-width` | `1px` |
 * | `--date-picker-popup-box-shadow` | `var(--date-picker-shadow)` |
 * | `--date-picker-popup-box-sizing` | `border-box` |
 * | `--date-picker-popup-display` | `flex` |
 * | `--date-picker-popup-flex-direction` | `column` |
 * | `--date-picker-popup-focus-visible-outline` | `none` |
 * | `--date-picker-popup-font-family` | `var(--paragraph-base-400-font-family)` |
 * | `--date-picker-popup-font-size` | `var(--paragraph-base-400-font-size)` |
 * | `--date-picker-popup-font-weight` | `var(--paragraph-base-400-font-weight)` |
 * | `--date-picker-popup-inline-size` | `min-content` |
 * | `--date-picker-popup-letter-spacing` | `var(--paragraph-base-400-letter-spacing)` |
 * | `--date-picker-popup-line-height` | `var(--paragraph-base-400-line-height)` |
 * | `--date-picker-popup-max-block-size` | `var(--available-height, none)` |
 * | `--date-picker-popup-overflow` | `auto` |
 * | `--date-picker-popup-text-transform` | `var(--paragraph-base-400-text-transform)` |
 * | `--date-picker-position` | `relative` |
 * | `--date-picker-positioner-focus-visible-outline` | `none` |
 * | `--date-picker-positioner-inline-size` | `max-content` |
 * | `--date-picker-positioner-pointer-events` | `auto` |
 * | `--date-picker-separator` | `-` |
 * | `--date-picker-separator-color` | `var(--date-picker-separator)` |
 * | `--date-picker-shadow` | `-` |
 * | `--date-picker-time-align-items` | `center` |
 * | `--date-picker-time-display` | `flex` |
 * | `--date-picker-time-field-background-color` | `transparent` |
 * | `--date-picker-time-field-block-size` | `2rem` |
 * | `--date-picker-time-field-border` | `-` |
 * | `--date-picker-time-field-border-color` | `var(--date-picker-time-field-border)` |
 * | `--date-picker-time-field-border-hover` | `-` |
 * | `--date-picker-time-field-border-radius` | `var(--radius-1)` |
 * | `--date-picker-time-field-border-style` | `solid` |
 * | `--date-picker-time-field-border-width` | `1px` |
 * | `--date-picker-time-field-box-sizing` | `border-box` |
 * | `--date-picker-time-field-caret-color` | `transparent` |
 * | `--date-picker-time-field-color` | `var(--date-picker-time-field-label)` |
 * | `--date-picker-time-field-focus-outline-offset` | `1px` |
 * | `--date-picker-time-field-focus-outline-style` | `solid` |
 * | `--date-picker-time-field-focus-outline-width` | `1px` |
 * | `--date-picker-time-field-focus-ring` | `-` |
 * | `--date-picker-time-field-focus-ring-color` | `var(--date-picker-time-field-focus-ring)` |
 * | `--date-picker-time-field-font-family` | `var(--label-base-400-font-family)` |
 * | `--date-picker-time-field-font-size` | `var(--label-base-400-font-size)` |
 * | `--date-picker-time-field-font-variant-numeric` | `tabular-nums` |
 * | `--date-picker-time-field-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--date-picker-time-field-hover-border-color` | `var(--date-picker-time-field-border-hover)` |
 * | `--date-picker-time-field-inline-size` | `2.5rem` |
 * | `--date-picker-time-field-label` | `-` |
 * | `--date-picker-time-field-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--date-picker-time-field-line-height` | `var(--label-base-400-line-height)` |
 * | `--date-picker-time-field-margin` | `0` |
 * | `--date-picker-time-field-padding-block` | `0` |
 * | `--date-picker-time-field-padding-inline` | `var(--spacing-2)` |
 * | `--date-picker-time-field-text-align` | `center` |
 * | `--date-picker-time-field-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--date-picker-time-field-transition-duration` | `150ms` |
 * | `--date-picker-time-field-transition-property` | `border-color` |
 * | `--date-picker-time-field-transition-timing-function` | `ease` |
 * | `--date-picker-time-gap` | `var(--spacing-2)` |
 * | `--date-picker-time-part-align-items` | `center` |
 * | `--date-picker-time-part-display` | `inline-flex` |
 * | `--date-picker-time-part-gap` | `var(--spacing-2)` |
 * | `--date-picker-time-separator` | `-` |
 * | `--date-picker-time-separator-color` | `var(--date-picker-time-separator)` |
 * | `--date-picker-timezone-display` | `flex` |
 * | `--date-picker-timezone-inline-size` | `0` |
 * | `--date-picker-timezone-min-inline-size` | `100%` |
 * | `--date-picker-trigger-align-items` | `center` |
 * | `--date-picker-trigger-background` | `-` |
 * | `--date-picker-trigger-background-color` | `var(--date-picker-trigger-background)` |
 * | `--date-picker-trigger-block-size` | `2rem` |
 * | `--date-picker-trigger-border` | `-` |
 * | `--date-picker-trigger-border-color` | `var(--date-picker-trigger-border)` |
 * | `--date-picker-trigger-border-hover` | `-` |
 * | `--date-picker-trigger-border-radius` | `var(--radius-1)` |
 * | `--date-picker-trigger-border-style` | `solid` |
 * | `--date-picker-trigger-border-width` | `1px` |
 * | `--date-picker-trigger-box-sizing` | `border-box` |
 * | `--date-picker-trigger-color` | `var(--date-picker-trigger-label)` |
 * | `--date-picker-trigger-cursor` | `pointer` |
 * | `--date-picker-trigger-disabled-cursor` | `not-allowed` |
 * | `--date-picker-trigger-disabled-opacity` | `0.6` |
 * | `--date-picker-trigger-display` | `flex` |
 * | `--date-picker-trigger-flex-grow` | `1` |
 * | `--date-picker-trigger-focus-outline-offset` | `1px` |
 * | `--date-picker-trigger-focus-outline-style` | `solid` |
 * | `--date-picker-trigger-focus-outline-width` | `1px` |
 * | `--date-picker-trigger-focus-ring` | `-` |
 * | `--date-picker-trigger-focus-ring-color` | `var(--date-picker-trigger-focus-ring)` |
 * | `--date-picker-trigger-font-family` | `var(--label-base-400-font-family)` |
 * | `--date-picker-trigger-font-size` | `var(--label-base-400-font-size)` |
 * | `--date-picker-trigger-font-weight` | `var(--label-base-400-font-weight)` |
 * | `--date-picker-trigger-forced-colors-outline-style` | `none` |
 * | `--date-picker-trigger-gap` | `var(--spacing-4)` |
 * | `--date-picker-trigger-hover-border-color` | `var(--date-picker-trigger-border-hover)` |
 * | `--date-picker-trigger-icon` | `-` |
 * | `--date-picker-trigger-icon-hover` | `-` |
 * | `--date-picker-trigger-invalid-border-color` | `var(--destructive)` |
 * | `--date-picker-trigger-label` | `-` |
 * | `--date-picker-trigger-letter-spacing` | `var(--label-base-400-letter-spacing)` |
 * | `--date-picker-trigger-line-height` | `var(--label-base-400-line-height)` |
 * | `--date-picker-trigger-margin` | `0` |
 * | `--date-picker-trigger-min-inline-size` | `0` |
 * | `--date-picker-trigger-outline-color` | `transparent` |
 * | `--date-picker-trigger-padding-block` | `var(--spacing-2)` |
 * | `--date-picker-trigger-padding-inline-end` | `var(--spacing-4)` |
 * | `--date-picker-trigger-padding-inline-start` | `var(--spacing-6)` |
 * | `--date-picker-trigger-placeholder` | `-` |
 * | `--date-picker-trigger-readonly-cursor` | `not-allowed` |
 * | `--date-picker-trigger-readonly-opacity` | `0.8` |
 * | `--date-picker-trigger-text-align` | `start` |
 * | `--date-picker-trigger-text-transform` | `var(--label-base-400-text-transform)` |
 * | `--date-picker-trigger-transition-duration` | `150ms` |
 * | `--date-picker-trigger-transition-property` | `border-color, opacity, outline-color` |
 * | `--date-picker-trigger-transition-timing-function` | `ease-out` |
 * | `--date-picker-value-clearable-margin-inline-end` | `calc(var(--date-picker-internal-icon-size) + va...` |
 * | `--date-picker-value-flex-grow` | `1` |
 * | `--date-picker-value-min-inline-size` | `0` |
 * | `--date-picker-value-overflow` | `clip visible` |
 * | `--date-picker-value-text-overflow` | `ellipsis` |
 * | `--date-picker-value-white-space` | `nowrap` |
 * | `--date-picker-width` | `var(--date-picker-internal-width, 100%)` |
 * | `--date-picker-z-index` | `50` |
 */
// #endregion css-tokens

export { createDatePicker, DatePicker } from './date-picker.js';
export { DATE_PICKER_EMPTY_LABEL } from './constants.js';
export { DatePickerField } from './presets/date-picker-field.js';
export type {
	DateAdapter,
	DatePickerChangeDetailsType,
	DatePickerComponentType,
	DatePickerFieldProps,
	DatePickerProps,
	DatePickerTimezoneOptionType,
	DatePickerTimezoneType,
	ValidateDatePickerProps,
} from './types.js';
