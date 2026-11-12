// #region css-tokens
/**
 * CSS Tokens for calendar
 * Prefix: `--calendar-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--calendar-background` | `-` |
 * | `--calendar-background-color` | `var(--calendar-background)` |
 * | `--calendar-box-sizing` | `border-box` |
 * | `--calendar-button-active-background-color` | `var(--calendar-button-background-active)` |
 * | `--calendar-button-align-items` | `center` |
 * | `--calendar-button-background` | `-` |
 * | `--calendar-button-background-active` | `-` |
 * | `--calendar-button-background-color` | `var(--calendar-button-background)` |
 * | `--calendar-button-background-hover` | `-` |
 * | `--calendar-button-border` | `none` |
 * | `--calendar-button-border-radius` | `var(--radius-1)` |
 * | `--calendar-button-box-sizing` | `border-box` |
 * | `--calendar-button-color` | `var(--calendar-button-label)` |
 * | `--calendar-button-cursor` | `pointer` |
 * | `--calendar-button-disabled-cursor` | `not-allowed` |
 * | `--calendar-button-disabled-opacity` | `0.6` |
 * | `--calendar-button-display` | `inline-flex` |
 * | `--calendar-button-focus-outline-offset` | `1px` |
 * | `--calendar-button-focus-outline-style` | `solid` |
 * | `--calendar-button-focus-outline-width` | `1px` |
 * | `--calendar-button-focus-ring` | `-` |
 * | `--calendar-button-focus-ring-color` | `var(--calendar-button-focus-ring)` |
 * | `--calendar-button-font-feature-settings` | `'ss01' 1` |
 * | `--calendar-button-font-variant-numeric` | `slashed-zero` |
 * | `--calendar-button-font-weight` | `var(--label-small-500-font-weight)` |
 * | `--calendar-button-gap` | `var(--spacing-3)` |
 * | `--calendar-button-hover-background-color` | `var(--calendar-button-background-hover)` |
 * | `--calendar-button-hover-color` | `var(--calendar-button-label-hover)` |
 * | `--calendar-button-justify-content` | `center` |
 * | `--calendar-button-label` | `-` |
 * | `--calendar-button-label-hover` | `-` |
 * | `--calendar-button-letter-spacing` | `var(--label-small-500-letter-spacing)` |
 * | `--calendar-button-text-transform` | `var(--label-small-500-text-transform)` |
 * | `--calendar-button-transition-property` | `background-color, color` |
 * | `--calendar-button-transition-timing-function` | `ease` |
 * | `--calendar-button-user-select` | `none` |
 * | `--calendar-button-white-space` | `nowrap` |
 * | `--calendar-caption-label-dropdown-align-items` | `center` |
 * | `--calendar-caption-label-dropdown-border-radius` | `var(--radius-1)` |
 * | `--calendar-caption-label-dropdown-box-sizing` | `border-box` |
 * | `--calendar-caption-label-dropdown-display` | `flex` |
 * | `--calendar-caption-label-dropdown-font-size` | `var(--label-small-500-font-size)` |
 * | `--calendar-caption-label-dropdown-gap` | `var(--spacing-2)` |
 * | `--calendar-caption-label-dropdown-height` | `var(--spacing-16)` |
 * | `--calendar-caption-label-dropdown-padding` | `0 var(--spacing-2) 0 var(--spacing-4)` |
 * | `--calendar-caption-label-dropdown-svg-size` | `var(--spacing-7)` |
 * | `--calendar-caption-label-font-family` | `var(--label-small-500-font-family)` |
 * | `--calendar-caption-label-font-size` | `var(--label-small-500-font-size)` |
 * | `--calendar-caption-label-font-weight` | `var(--label-small-500-font-weight)` |
 * | `--calendar-caption-label-letter-spacing` | `var(--label-small-500-letter-spacing)` |
 * | `--calendar-caption-label-line-height` | `var(--label-small-500-line-height)` |
 * | `--calendar-caption-label-text-transform` | `var(--label-small-500-text-transform)` |
 * | `--calendar-caption-label-user-select` | `none` |
 * | `--calendar-cell-size` | `var(--spacing-16)` |
 * | `--calendar-chevron-size` | `var(--spacing-8)` |
 * | `--calendar-day-aspect-ratio` | `1` |
 * | `--calendar-day-box-sizing` | `border-box` |
 * | `--calendar-day-button-font-family` | `var(--label-small-500-font-family)` |
 * | `--calendar-day-button-font-size` | `var(--label-small-500-font-size)` |
 * | `--calendar-day-button-line-height` | `var(--label-small-500-line-height)` |
 * | `--calendar-day-button-padding` | `0` |
 * | `--calendar-day-button-width` | `100%` |
 * | `--calendar-day-disabled-color` | `var(--calendar-day-disabled-label)` |
 * | `--calendar-day-disabled-label` | `-` |
 * | `--calendar-day-height` | `100%` |
 * | `--calendar-day-margin` | `var(--spacing-2)` |
 * | `--calendar-day-outside-color` | `var(--calendar-day-outside-label)` |
 * | `--calendar-day-outside-label` | `-` |
 * | `--calendar-day-padding` | `0` |
 * | `--calendar-day-position` | `relative` |
 * | `--calendar-day-range-box-shadow` | `calc(-1 * var(--calendar-internal-range-directi...` |
 * | `--calendar-day-range-edge-background` | `-` |
 * | `--calendar-day-range-edge-background-color` | `var(--calendar-day-range-edge-background)` |
 * | `--calendar-day-range-edge-background-hover` | `-` |
 * | `--calendar-day-range-edge-color` | `var(--calendar-day-range-edge-label)` |
 * | `--calendar-day-range-edge-hover-background-color` | `var(--calendar-day-range-edge-background-hover)` |
 * | `--calendar-day-range-edge-label` | `-` |
 * | `--calendar-day-range-end-border-end-start-radius` | `0` |
 * | `--calendar-day-range-end-border-start-start-radius` | `0` |
 * | `--calendar-day-range-middle-background` | `-` |
 * | `--calendar-day-range-middle-background-color` | `var(--calendar-day-range-middle-background)` |
 * | `--calendar-day-range-middle-background-hover` | `-` |
 * | `--calendar-day-range-middle-border-radius` | `0` |
 * | `--calendar-day-range-middle-color` | `var(--calendar-day-range-middle-label)` |
 * | `--calendar-day-range-middle-hover-background-color` | `var(--calendar-day-range-middle-background-hover)` |
 * | `--calendar-day-range-middle-label` | `-` |
 * | `--calendar-day-range-start-border-end-end-radius` | `0` |
 * | `--calendar-day-range-start-border-start-end-radius` | `0` |
 * | `--calendar-day-selected-background` | `-` |
 * | `--calendar-day-selected-background-color` | `var(--calendar-day-selected-background)` |
 * | `--calendar-day-selected-background-hover` | `-` |
 * | `--calendar-day-selected-color` | `var(--calendar-day-selected-label)` |
 * | `--calendar-day-selected-hover-background-color` | `var(--calendar-day-selected-background-hover)` |
 * | `--calendar-day-selected-label` | `-` |
 * | `--calendar-day-text-align` | `center` |
 * | `--calendar-day-today-background` | `-` |
 * | `--calendar-day-today-background-color` | `var(--calendar-day-today-background)` |
 * | `--calendar-day-today-color` | `var(--calendar-day-today-label)` |
 * | `--calendar-day-today-label` | `-` |
 * | `--calendar-day-user-select` | `none` |
 * | `--calendar-day-width` | `100%` |
 * | `--calendar-dropdown-border-radius` | `var(--radius-1)` |
 * | `--calendar-dropdown-border-style` | `solid` |
 * | `--calendar-dropdown-border-width` | `1px` |
 * | `--calendar-dropdown-font` | `inherit` |
 * | `--calendar-dropdown-font-family` | `var(--label-small-500-font-family)` |
 * | `--calendar-dropdown-font-size` | `var(--label-small-500-font-size)` |
 * | `--calendar-dropdown-font-weight` | `var(--label-small-500-font-weight)` |
 * | `--calendar-dropdown-gap` | `var(--spacing-3)` |
 * | `--calendar-dropdown-inset` | `0` |
 * | `--calendar-dropdown-letter-spacing` | `var(--label-small-500-letter-spacing)` |
 * | `--calendar-dropdown-line-height` | `var(--label-small-500-line-height)` |
 * | `--calendar-dropdown-opacity` | `0` |
 * | `--calendar-dropdown-position` | `absolute` |
 * | `--calendar-dropdown-root-position` | `relative` |
 * | `--calendar-dropdown-text-transform` | `var(--label-small-500-text-transform)` |
 * | `--calendar-dropdowns-align-items` | `center` |
 * | `--calendar-dropdowns-display` | `flex` |
 * | `--calendar-dropdowns-justify-content` | `center` |
 * | `--calendar-dropdowns-width` | `100%` |
 * | `--calendar-font-feature-settings` | `'ss01' 1` |
 * | `--calendar-font-variant-numeric` | `normal` |
 * | `--calendar-footer-color` | `var(--calendar-internal-weekday-label)` |
 * | `--calendar-footer-font-family` | `var(--paragraph-small-400-font-family)` |
 * | `--calendar-footer-font-size` | `var(--paragraph-small-400-font-size)` |
 * | `--calendar-footer-font-weight` | `var(--paragraph-small-400-font-weight)` |
 * | `--calendar-footer-letter-spacing` | `var(--paragraph-small-400-letter-spacing)` |
 * | `--calendar-footer-line-height` | `var(--paragraph-small-400-line-height)` |
 * | `--calendar-footer-margin-top` | `var(--spacing-4)` |
 * | `--calendar-footer-text-transform` | `var(--paragraph-small-400-text-transform)` |
 * | `--calendar-hidden-visibility` | `hidden` |
 * | `--calendar-month-caption-align-items` | `center` |
 * | `--calendar-month-caption-box-sizing` | `border-box` |
 * | `--calendar-month-caption-display` | `flex` |
 * | `--calendar-month-caption-justify-content` | `center` |
 * | `--calendar-month-caption-width` | `100%` |
 * | `--calendar-month-display` | `flex` |
 * | `--calendar-month-flex-direction` | `column` |
 * | `--calendar-month-gap` | `var(--spacing-8)` |
 * | `--calendar-month-grid-border-collapse` | `collapse` |
 * | `--calendar-month-grid-width` | `100%` |
 * | `--calendar-month-width` | `100%` |
 * | `--calendar-months-display` | `flex` |
 * | `--calendar-months-flex-direction` | `column` |
 * | `--calendar-months-gap` | `var(--spacing-8)` |
 * | `--calendar-months-position` | `relative` |
 * | `--calendar-months-wide-flex-direction` | `row` |
 * | `--calendar-nav-align-items` | `center` |
 * | `--calendar-nav-button-padding` | `0` |
 * | `--calendar-nav-button-rtl-svg-transform` | `rotate(180deg)` |
 * | `--calendar-nav-display` | `flex` |
 * | `--calendar-nav-gap` | `var(--spacing-2)` |
 * | `--calendar-nav-justify-content` | `space-between` |
 * | `--calendar-nav-left` | `0` |
 * | `--calendar-nav-position` | `absolute` |
 * | `--calendar-nav-right` | `0` |
 * | `--calendar-nav-top` | `0` |
 * | `--calendar-nav-width` | `100%` |
 * | `--calendar-padding` | `var(--spacing-6)` |
 * | `--calendar-range-edge-border-radius` | `var(--radius-2)` |
 * | `--calendar-select-background` | `-` |
 * | `--calendar-select-background-color` | `var(--calendar-select-background)` |
 * | `--calendar-select-border` | `-` |
 * | `--calendar-select-border-color` | `var(--calendar-select-border)` |
 * | `--calendar-select-border-focus` | `-` |
 * | `--calendar-select-box-shadow` | `var(--calendar-select-shadow)` |
 * | `--calendar-select-focus-border-color` | `var(--calendar-select-border-focus)` |
 * | `--calendar-select-focus-box-shadow` | `var(--calendar-select-shadow-focus)` |
 * | `--calendar-select-icon` | `-` |
 * | `--calendar-select-icon-color` | `var(--calendar-select-icon)` |
 * | `--calendar-select-shadow` | `-` |
 * | `--calendar-select-shadow-focus` | `-` |
 * | `--calendar-transition-duration` | `150ms` |
 * | `--calendar-week-display` | `flex` |
 * | `--calendar-week-gap` | `var(--spacing-4)` |
 * | `--calendar-week-number-align-items` | `center` |
 * | `--calendar-week-number-cell-align-items` | `center` |
 * | `--calendar-week-number-cell-display` | `flex` |
 * | `--calendar-week-number-cell-justify-content` | `center` |
 * | `--calendar-week-number-cell-text-align` | `center` |
 * | `--calendar-week-number-color` | `var(--calendar-week-number-label)` |
 * | `--calendar-week-number-display` | `flex` |
 * | `--calendar-week-number-font-family` | `var(--label-small-600-font-family)` |
 * | `--calendar-week-number-font-size` | `var(--label-small-600-font-size)` |
 * | `--calendar-week-number-font-weight` | `var(--label-small-600-font-weight)` |
 * | `--calendar-week-number-header-user-select` | `none` |
 * | `--calendar-week-number-label` | `-` |
 * | `--calendar-week-number-letter-spacing` | `var(--label-small-600-letter-spacing)` |
 * | `--calendar-week-number-line-height` | `var(--label-small-600-line-height)` |
 * | `--calendar-week-number-text-transform` | `var(--label-small-600-text-transform)` |
 * | `--calendar-week-number-user-select` | `none` |
 * | `--calendar-week-width` | `100%` |
 * | `--calendar-weekday-border-radius` | `var(--radius-1)` |
 * | `--calendar-weekday-color` | `var(--calendar-weekday-label)` |
 * | `--calendar-weekday-flex` | `1` |
 * | `--calendar-weekday-font-family` | `var(--label-small-400-font-family)` |
 * | `--calendar-weekday-font-size` | `var(--label-small-400-font-size)` |
 * | `--calendar-weekday-font-weight` | `var(--label-small-400-font-weight)` |
 * | `--calendar-weekday-label` | `-` |
 * | `--calendar-weekday-letter-spacing` | `var(--label-small-400-letter-spacing)` |
 * | `--calendar-weekday-line-height` | `var(--label-small-400-line-height)` |
 * | `--calendar-weekday-min-width` | `0` |
 * | `--calendar-weekday-text-transform` | `var(--label-small-400-text-transform)` |
 * | `--calendar-weekday-user-select` | `none` |
 * | `--calendar-weekdays-align-items` | `center` |
 * | `--calendar-weekdays-display` | `flex` |
 * | `--calendar-weekdays-margin-bottom` | `var(--spacing-4)` |
 * | `--calendar-weekdays-min-block-size` | `var(--spacing-8)` |
 * | `--calendar-width` | `fit-content` |
 */
// #endregion css-tokens

export { Calendar } from './calendar.js';
export type { CalendarProps } from './types.js';

// The types a `Calendar` prop is declared with, so a consumer can hold a selection or write a
// matcher without depending on react-day-picker themselves.
export type {
	ClassNames,
	CustomComponents,
	DateRange,
	DayPickerProps,
	Formatters,
	Matcher,
	Modifiers,
} from 'react-day-picker';
