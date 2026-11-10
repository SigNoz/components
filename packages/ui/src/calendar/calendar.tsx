import { nativeDateAdapter } from '../lib/date-adapter.js';
import { createCalendar } from './create-calendar.js';

/**
 * Renders a month grid, with selection of one day, several days or a range.
 *
 * It holds its dates as `Date`. An app that keeps them in another type builds its own calendar
 * with `createCalendar(adapter)`, which has the same props with `TDate` in place of `Date`.
 *
 * Visual values are `--calendar-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Its buttons
 *
 * The month arrows and the date cells are one component, styled from `--calendar-button-*` rather
 * than from `Button`. A date cell is square, borderless and sized off the grid, which none of
 * `Button`'s sizes are, so the two are deliberately not shared.
 *
 * ### Cell size
 *
 * `--calendar-cell-size` is the side of a month arrow, of a date cell and of the week-number
 * column. The rest of the grid measures against it, so one variable resizes the calendar.
 *
 * ### Selection
 *
 * `mode` decides what `selected` and `onSelect` are. A day inside a range carries
 * `data-range-start`, `data-range-middle` or `data-range-end` rather than `data-selected-single`,
 * so the three positions are painted apart.
 *
 * Without `onSelect` the calendar keeps the selection itself, starting from `selected`. With it,
 * `selected` is the selection and a pick only reports the new one.
 *
 * A range reads as one band that stops at the edge of each week row. With `numberOfMonths` above
 * one, an outside day whose own month is also displayed is not painted as part of the range: that
 * month already shows it. The first month's leading and the last month's trailing outside days
 * have no other copy, so they paint.
 *
 * ### Moving between months
 *
 * The arrows, the dropdowns and the keyboard all move through `onMonthChange`. Without `month` the
 * calendar tracks the month itself, starting from `defaultMonth`. With it, the calendar shows what
 * it is given.
 *
 * ### Keyboard
 *
 * One day of the grid is in the tab order: the one last focused, else the selected day, else
 * today, else the first day of the month that can be picked. From there the arrows move by a day or
 * a week, `Home` and `End` go to the start and the end of the week, and `PageUp` and `PageDown`
 * move by a month. Shift turns an arrow into a month and a page key into a year.
 *
 * A move skips the days `disabled` rules out, and stops at `startMonth` and `endMonth`. A day of
 * another month turns the calendar to that month.
 *
 * ### Disabled days
 *
 * `disabled` takes matchers. The button of a disabled day is disabled natively, except while it
 * holds the focus, where it uses `aria-disabled` so the day stays reachable by keyboard. Both are
 * styled, and both dim by `--calendar-button-disabled-opacity` once, on the button.
 *
 * ### Dates
 *
 * Only the day counts, never the time. Days are built from their year, month and day, so a month
 * that has a daylight saving change keeps its 28 to 31 days.
 *
 * `locale` is a BCP 47 tag. It sets the names of the months and the weekdays, the day labels and
 * the first day of the week, and the formats are the browser's. Any English reads the same,
 * written as `Monday, September 7th, 2026`.
 *
 * ### Where a day is painted
 *
 * On the button, never on the `<td>` around it. The button declares its own `color`, so a colour
 * set on the cell never reaches the day number, and the button covers the cell, so a background set
 * there is either hidden or has to be undone again for each selection state. The range band is the
 * button's own `box-shadow`, so it is painted there too.
 *
 * ### Footer
 *
 * `footer` renders under the grid in a live region, at the size and in the colour of the weekday
 * labels, through `--calendar-footer-*`.
 *
 * ### The ref
 *
 * It lands on the root `<div>`.
 *
 * ### Asserting on it
 *
 * `testId` lands on the root, and every part below derives its own from it, so one prop names the
 * whole calendar. Pass nothing and no part carries a `data-testid`.
 *
 * | part | `data-testid` |
 * |---|---|
 * | root | `{testId}` |
 * | month arrows | `{testId}-nav-previous`, `{testId}-nav-next` |
 * | caption dropdowns | `{stem}-dropdown-month`, `{stem}-dropdown-year` |
 * | week number | `{stem}-week-number-{week}` |
 * | date cell | `{stem}-button-{DD-MM-YYYY}` |
 *
 * `{stem}` is `{testId}` while one month is displayed. A caption, a week number and a day button
 * are rendered per displayed month, so with `numberOfMonths` above one the stem becomes
 * `{testId}-month-{n}`, counting the months from one as they are laid out.
 *
 * Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"calendar"` |
 * | `data-mode` | mirrors `mode` |
 * | `data-required` | mirrors `required`, when it is set |
 * | `data-multiple-months` | `"true"` while `numberOfMonths` is above one |
 * | `data-week-numbers` | `"true"` while `showWeekNumber` is set |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `calendar-month` | one per displayed month, the caption and the grid together |
 * | `calendar-button` | every month arrow and every date cell, `data-variant` says which |
 * | `calendar-day-button-label` | inside each date cell, holds the day number |
 * | `calendar-week-number` | only while `showWeekNumber` is set |
 *
 * A date cell carries the day it stands for and the state it is in, and so does the `<td>` around
 * it.
 *
 * | date cell attribute | set when |
 * |---|---|
 * | `data-day` | always, the day as `YYYY-MM-DD` in Latin digits |
 * | `data-today` | the day is today |
 * | `data-outside` | the day belongs to a neighbouring month |
 * | `data-duplicate` | an outside day whose own month is displayed too |
 * | `data-selected-single` | selected, and not part of a range |
 * | `data-range-start`, `data-range-middle`, `data-range-end` | the day's position in a range |
 *
 * The `<td>` adds `data-disabled`, `data-hidden`, `data-focused`, `data-selected` and, on an
 * outside day, `data-month` with the month it really belongs to.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState<Date>();
 *
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 *
 * @example
 * ```tsx
 * // A range, with month and year dropdowns in place of the plain caption
 * <Calendar mode="range" selected={range} onSelect={setRange} captionLayout="dropdown" />
 * ```
 *
 * @example
 * ```tsx
 * // Weekends cannot be picked
 * <Calendar mode="single" selected={date} onSelect={setDate} disabled={[{ dayOfWeek: [0, 6] }]} />
 * ```
 *
 * @example
 * ```tsx
 * // Every part is addressable from the one testId
 * <Calendar mode="single" testId="report-start" />;
 *
 * screen.getByTestId('report-start-button-11-06-2025');
 * ```
 *
 * @example
 * ```tsx
 * // Two months, so each one is named apart
 * <Calendar mode="range" numberOfMonths={2} testId="report" />;
 *
 * screen.getByTestId('report-month-2-button-01-07-2025');
 * ```
 *
 * @example
 * ```tsx
 * // A calendar that holds dayjs values
 * const DayjsCalendar = createCalendar<Dayjs>({
 *   toDate: (value) => value.toDate(),
 *   fromDate: (date) => dayjs(date),
 * });
 *
 * <DayjsCalendar mode="single" selected={day} onSelect={setDay} />
 * ```
 */
export const Calendar = createCalendar(nativeDateAdapter);
