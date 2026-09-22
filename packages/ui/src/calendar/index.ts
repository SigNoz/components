// #region css-tokens
/**
 * CSS Tokens for calendar
 * Prefix: `--calendar-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--calendar-background` | `-` |
 * | `--calendar-button-background` | `-` |
 * | `--calendar-button-background-active` | `-` |
 * | `--calendar-button-background-hover` | `-` |
 * | `--calendar-button-border-radius` | `var(--radius-1)` |
 * | `--calendar-button-cursor` | `pointer` |
 * | `--calendar-button-disabled-cursor` | `not-allowed` |
 * | `--calendar-button-disabled-opacity` | `0.6` |
 * | `--calendar-button-focus-outline-offset` | `1px` |
 * | `--calendar-button-focus-outline-width` | `1px` |
 * | `--calendar-button-focus-ring` | `-` |
 * | `--calendar-button-font-weight` | `var(--font-weight-medium)` |
 * | `--calendar-button-gap` | `var(--spacing-3)` |
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
 * | `--calendar-day-disabled-label` | `-` |
 * | `--calendar-day-margin` | `var(--spacing-2)` |
 * | `--calendar-day-outside-label` | `-` |
 * | `--calendar-day-range-edge-background` | `-` |
 * | `--calendar-day-range-edge-background-hover` | `-` |
 * | `--calendar-day-range-edge-label` | `-` |
 * | `--calendar-day-range-middle-background` | `-` |
 * | `--calendar-day-range-middle-background-hover` | `-` |
 * | `--calendar-day-range-middle-label` | `-` |
 * | `--calendar-day-selected-background` | `-` |
 * | `--calendar-day-selected-background-hover` | `-` |
 * | `--calendar-day-selected-label` | `-` |
 * | `--calendar-day-today-background` | `-` |
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
 * | `--calendar-select-border` | `-` |
 * | `--calendar-select-border-focus` | `-` |
 * | `--calendar-select-icon` | `-` |
 * | `--calendar-select-shadow` | `-` |
 * | `--calendar-select-shadow-focus` | `-` |
 * | `--calendar-transition-duration` | `150ms` |
 * | `--calendar-week-gap` | `var(--spacing-4)` |
 * | `--calendar-week-number-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-week-number-label` | `-` |
 * | `--calendar-weekday-border-radius` | `var(--radius-1)` |
 * | `--calendar-weekday-font-size` | `var(--periscope-font-size-small)` |
 * | `--calendar-weekday-font-weight` | `var(--font-weight-normal)` |
 * | `--calendar-weekday-label` | `-` |
 * | `--calendar-weekdays-margin-bottom` | `var(--spacing-4)` |
 */
// #endregion css-tokens

/**
 * The tokens below were renamed or merged when the calendar moved to the `--calendar-internal-*`
 * pairs above. The rest kept their names. The old names are gone rather than aliased, and a
 * stylesheet still setting one parses without error, so a theme written against them goes quiet
 * rather than failing.
 *
 * | Old | New |
 * |---|---|
 * | `--calendar-selected-single-background-color` | `--calendar-day-selected-background` |
 * | `--calendar-selected-single-color` | `--calendar-day-selected-label` |
 * | `--calendar-range-start-end-background-color` | `--calendar-day-range-edge-background` |
 * | `--calendar-range-start-end-color` | `--calendar-day-range-edge-label` |
 * | `--calendar-range-middle-background-color` | `--calendar-day-range-middle-background` |
 * | `--calendar-range-middle-color` | `--calendar-day-range-middle-label` |
 * | `--calendar-range-start-border-radius`, `--calendar-range-end-border-radius` | `--calendar-range-edge-border-radius` |
 * | `--calendar-range-start-default-border-radius`, `--calendar-range-end-default-border-radius` | `--calendar-button-border-radius` |
 * | `--calendar-today-border-radius` | `--calendar-button-border-radius` |
 * | `--calendar-today-background-color` | `--calendar-day-today-background` |
 * | `--calendar-today-color` | `--calendar-day-today-label` |
 * | `--calendar-outside-color` | `--calendar-day-outside-label` |
 * | `--calendar-disabled-color` | `--calendar-day-disabled-label` |
 * | `--calendar-disabled-opacity` | `--calendar-button-disabled-opacity` |
 * | `--calendar-weekday-color` | `--calendar-weekday-label` |
 * | `--calendar-week-number-color` | `--calendar-week-number-label` |
 * | `--calendar-weekdays-margin` | `--calendar-weekdays-margin-bottom` |
 * | `--calendar-chevron-width`, `--calendar-chevron-height` | `--calendar-chevron-size` |
 * | `--calendar-caption-label-dropdown-svg-width`, `-height` | `--calendar-caption-label-dropdown-svg-size` |
 * | `--calendar-caption-label-dropdown-svg-color` | `--calendar-select-icon` |
 * | `--calendar-dropdown-background` | `--calendar-select-background` |
 * | `--calendar-dropdown-border` | `--calendar-dropdown-border-width` and `--calendar-select-border` |
 * | `--calendar-dropdown-box-shadow` | `--calendar-select-shadow` |
 * | `--calendar-dropdown-focus-box-shadow` | `--calendar-select-shadow-focus` |
 * | `--calendar-button-nav-padding` | `--calendar-nav-button-padding` |
 * | `--calendar-button-nav-disabled-opacity` | `--calendar-button-disabled-opacity` |
 * | `--calendar-day-button-span-font-size` | `--calendar-day-button-font-size` |
 *
 * `--calendar-day-button-span-opacity` and `--calendar-outside-selected-color` have no successor:
 * the day number is always painted at full opacity, and an outside day inside a selection is
 * painted as the selection.
 *
 * `--calendar-dropdown-border` was a shorthand. It is split in two: `--calendar-dropdown-border-width`
 * takes the width and `--calendar-select-border` takes only the colour, so `1px solid red` becomes
 * `--calendar-dropdown-border-width: 1px` and `--calendar-select-border: red`. A shorthand set on
 * `--calendar-select-border` makes the border invalid, and the dropdown renders with none.
 *
 * Changes to the component itself, which the compiler catches only in part:
 *
 * | Before | Now |
 * |---|---|
 * | `mode` optional | required, see {@link CalendarProps} |
 * | `CalendarDayButtonProps.color` and `type` | removed, a date cell is always `type="button"` and painted from the tokens |
 * | `data-day` from `toLocaleDateString()`, e.g. `6/11/2025` | `YYYY-MM-DD`, e.g. `2025-06-11` |
 * | global `periscope-calendar-*`, `btn-previous` and `btn-next` classes | removed, select on `data-slot` and `data-variant` |
 * | a `classNames` entry replaced the calendar's class for that part | appended to it, so the calendar styling stays |
 */

export { Calendar } from './calendar.js';
export { CalendarDayButton } from './subcomponents/calendar-day-button.js';
export type { CalendarDayButtonProps, CalendarProps } from './types.js';

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
