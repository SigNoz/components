// #region css-tokens
/**
 * CSS Tokens for calendar
 * Prefix: `--calendar-`
 *
 * | Token | Default |
 * |-------|---------|
 * | `--calendar-background` | `var(--background)` |
 * | `--calendar-button-nav-disabled-opacity` | `0.5` |
 * | `--calendar-button-nav-padding` | `0` |
 * | `--calendar-caption-label-dropdown-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--calendar-caption-label-dropdown-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--calendar-caption-label-dropdown-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--calendar-caption-label-dropdown-height` | `2rem` |
 * | `--calendar-caption-label-dropdown-padding` | `0 var(--spacing-2, 0.25rem) 0 var(--spacing-4, ...` |
 * | `--calendar-caption-label-dropdown-svg-color` | `var(--muted-foreground)` |
 * | `--calendar-caption-label-dropdown-svg-height` | `0.875rem` |
 * | `--calendar-caption-label-dropdown-svg-width` | `0.875rem` |
 * | `--calendar-caption-label-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--calendar-caption-label-font-weight` | `var(--font-weight-medium)` |
 * | `--calendar-cell-size` | `var(--spacing-8, 1rem)` |
 * | `--calendar-chevron-height` | `1rem` |
 * | `--calendar-chevron-width` | `1rem` |
 * | `--calendar-day-button-span-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--calendar-day-button-span-opacity` | `0.7` |
 * | `--calendar-day-margin` | `var(--spacing-2)` |
 * | `--calendar-disabled-color` | `var(--muted-foreground)` |
 * | `--calendar-disabled-opacity` | `0.5` |
 * | `--calendar-dropdown-background` | `var(--popover)` |
 * | `--calendar-dropdown-border` | `1px solid var(--input)` |
 * | `--calendar-dropdown-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--calendar-dropdown-box-shadow` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
 * | `--calendar-dropdown-focus-box-shadow` | `0 0 0 3px color-mix(in srgb, var(--ring) 50%, t...` |
 * | `--calendar-dropdown-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--calendar-dropdown-font-weight` | `500` |
 * | `--calendar-dropdown-gap` | `var(--spacing-3, 0.375rem)` |
 * | `--calendar-month-gap` | `var(--spacing-8, 1rem)` |
 * | `--calendar-months-gap` | `var(--spacing-8, 1rem)` |
 * | `--calendar-nav-gap` | `var(--spacing-2, 0.25rem)` |
 * | `--calendar-outside-color` | `var(--muted-foreground)` |
 * | `--calendar-outside-selected-color` | `var(--muted-foreground)` |
 * | `--calendar-padding` | `var(--spacing-6, 0.75rem)` |
 * | `--calendar-range-end-border-radius` | `0.375rem` |
 * | `--calendar-range-end-default-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--calendar-range-middle-background-color` | `var(--accent)` |
 * | `--calendar-range-middle-color` | `var(--accent-foreground)` |
 * | `--calendar-range-start-border-radius` | `0.375rem` |
 * | `--calendar-range-start-default-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--calendar-range-start-end-background-color` | `var(--primary)` |
 * | `--calendar-range-start-end-color` | `var(--primary-foreground)` |
 * | `--calendar-selected-single-background-color` | `var(--primary)` |
 * | `--calendar-selected-single-color` | `var(--primary-foreground)` |
 * | `--calendar-today-background-color` | `var(--accent)` |
 * | `--calendar-today-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--calendar-today-color` | `var(--accent-foreground)` |
 * | `--calendar-week-gap` | `var(--spacing-4, 0.5rem)` |
 * | `--calendar-week-number-color` | `var(--muted-foreground)` |
 * | `--calendar-week-number-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--calendar-weekday-border-radius` | `calc(var(--radius) - 2px)` |
 * | `--calendar-weekday-color` | `var(--muted-foreground)` |
 * | `--calendar-weekday-font-size` | `var(--periscope-font-size-small, 11px)` |
 * | `--calendar-weekday-font-weight` | `var(--font-weight-normal)` |
 * | `--calendar-weekdays-margin` | `0px 0px var(--spacing-4, 0.5rem) 0px` |
 */
// #endregion css-tokens

export type * from './calendar.js';
export { Calendar, CalendarDayButton } from './calendar.js';
