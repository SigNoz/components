// #region css-tokens
/**
 * CSS Tokens for calendar
 * Prefix: `--calendar-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--calendar-background` | `-` |
 * | `--calendar-background-color` | `var(--calendar-background)` |
 * | `--calendar-button-active-background-color` | `var(--calendar-button-background-active)` |
 * | `--calendar-button-background` | `-` |
 * | `--calendar-button-background-active` | `-` |
 * | `--calendar-button-background-color` | `var(--calendar-button-background)` |
 * | `--calendar-button-background-hover` | `-` |
 * | `--calendar-button-border-radius` | `var(--radius-1)` |
 * | `--calendar-button-color` | `var(--calendar-button-label)` |
 * | `--calendar-button-cursor` | `pointer` |
 * | `--calendar-button-disabled-cursor` | `not-allowed` |
 * | `--calendar-button-disabled-opacity` | `0.6` |
 * | `--calendar-button-focus-outline-offset` | `1px` |
 * | `--calendar-button-focus-outline-width` | `1px` |
 * | `--calendar-button-focus-ring` | `-` |
 * | `--calendar-button-focus-ring-color` | `var(--calendar-button-focus-ring)` |
 * | `--calendar-button-font-weight` | `var(--font-weight-medium)` |
 * | `--calendar-button-gap` | `var(--spacing-3)` |
 * | `--calendar-button-hover-background-color` | `var(--calendar-button-background-hover)` |
 * | `--calendar-button-hover-color` | `var(--calendar-button-label-hover)` |
 * | `--calendar-button-label` | `-` |
 * | `--calendar-button-label-hover` | `-` |
 * | `--calendar-button-letter-spacing` | `-0.005em` |
 * | `--calendar-caption-label-dropdown-border-radius` | `var(--radius-1)` |
 * | `--calendar-caption-label-dropdown-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-caption-label-dropdown-gap` | `var(--spacing-2)` |
 * | `--calendar-caption-label-dropdown-height` | `var(--spacing-16)` |
 * | `--calendar-caption-label-dropdown-padding` | `0 var(--spacing-2) 0 var(--spacing-4)` |
 * | `--calendar-caption-label-dropdown-svg-size` | `var(--spacing-7)` |
 * | `--calendar-caption-label-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-caption-label-font-weight` | `var(--font-weight-medium)` |
 * | `--calendar-cell-size` | `var(--spacing-16)` |
 * | `--calendar-chevron-size` | `var(--spacing-8)` |
 * | `--calendar-day-button-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-day-button-padding` | `0` |
 * | `--calendar-day-disabled-color` | `var(--calendar-day-disabled-label)` |
 * | `--calendar-day-disabled-label` | `-` |
 * | `--calendar-day-margin` | `var(--spacing-2)` |
 * | `--calendar-day-outside-color` | `var(--calendar-day-outside-label)` |
 * | `--calendar-day-outside-label` | `-` |
 * | `--calendar-day-range-edge-background` | `-` |
 * | `--calendar-day-range-edge-background-color` | `var(--calendar-day-range-edge-background)` |
 * | `--calendar-day-range-edge-background-hover` | `-` |
 * | `--calendar-day-range-edge-color` | `var(--calendar-day-range-edge-label)` |
 * | `--calendar-day-range-edge-hover-background-color` | `var(--calendar-day-range-edge-background-hover)` |
 * | `--calendar-day-range-edge-label` | `-` |
 * | `--calendar-day-range-middle-background` | `-` |
 * | `--calendar-day-range-middle-background-color` | `var(--calendar-day-range-middle-background)` |
 * | `--calendar-day-range-middle-background-hover` | `-` |
 * | `--calendar-day-range-middle-color` | `var(--calendar-day-range-middle-label)` |
 * | `--calendar-day-range-middle-hover-background-color` | `var(--calendar-day-range-middle-background-hover)` |
 * | `--calendar-day-range-middle-label` | `-` |
 * | `--calendar-day-selected-background` | `-` |
 * | `--calendar-day-selected-background-color` | `var(--calendar-day-selected-background)` |
 * | `--calendar-day-selected-background-hover` | `-` |
 * | `--calendar-day-selected-color` | `var(--calendar-day-selected-label)` |
 * | `--calendar-day-selected-hover-background-color` | `var(--calendar-day-selected-background-hover)` |
 * | `--calendar-day-selected-label` | `-` |
 * | `--calendar-day-today-background` | `-` |
 * | `--calendar-day-today-background-color` | `var(--calendar-day-today-background)` |
 * | `--calendar-day-today-color` | `var(--calendar-day-today-label)` |
 * | `--calendar-day-today-label` | `-` |
 * | `--calendar-dropdown-border-radius` | `var(--radius-1)` |
 * | `--calendar-dropdown-border-width` | `1px` |
 * | `--calendar-dropdown-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-dropdown-font-weight` | `var(--font-weight-medium)` |
 * | `--calendar-dropdown-gap` | `var(--spacing-3)` |
 * | `--calendar-month-gap` | `var(--spacing-8)` |
 * | `--calendar-months-gap` | `var(--spacing-8)` |
 * | `--calendar-nav-button-padding` | `0` |
 * | `--calendar-nav-gap` | `var(--spacing-2)` |
 * | `--calendar-padding` | `var(--spacing-6)` |
 * | `--calendar-range-edge-border-radius` | `var(--radius-3)` |
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
 * | `--calendar-week-gap` | `var(--spacing-4)` |
 * | `--calendar-week-number-color` | `var(--calendar-week-number-label)` |
 * | `--calendar-week-number-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-week-number-label` | `-` |
 * | `--calendar-weekday-border-radius` | `var(--radius-1)` |
 * | `--calendar-weekday-color` | `var(--calendar-weekday-label)` |
 * | `--calendar-weekday-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-weekday-font-weight` | `var(--font-weight-normal)` |
 * | `--calendar-weekday-label` | `-` |
 * | `--calendar-weekdays-margin-bottom` | `var(--spacing-4)` |
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
