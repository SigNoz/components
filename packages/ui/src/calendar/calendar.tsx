import { forwardRef, useMemo } from 'react';
import {
	type ClassNames,
	DayPicker,
	type DayPickerProps,
	defaultDateLib,
	type Formatters,
	getDefaultClassNames,
} from 'react-day-picker';
import { CalendarContext } from './calendar-context.js';
import styles from './calendar.module.scss';
import { cn, type RejectedProps } from '../lib/utils.js';
import { CalendarChevron } from './subcomponents/calendar-chevron.js';
import { CalendarDayButton } from './subcomponents/calendar-day-button.js';
import {
	CalendarMonthsDropdown,
	CalendarYearsDropdown,
} from './subcomponents/calendar-dropdown.js';
import {
	CalendarNextMonthButton,
	CalendarPreviousMonthButton,
} from './subcomponents/calendar-nav-button.js';
import { CalendarMonth } from './subcomponents/calendar-month.js';
import { CalendarRoot } from './subcomponents/calendar-root.js';
import { CalendarWeekNumber } from './subcomponents/calendar-week-number.js';
import type { CalendarProps, DayPickerStyleProp } from './types.js';

const defaultClassNames = getDefaultClassNames();

const CALENDAR_COMPONENTS = {
	Root: CalendarRoot,
	Month: CalendarMonth,
	Chevron: CalendarChevron,
	PreviousMonthButton: CalendarPreviousMonthButton,
	NextMonthButton: CalendarNextMonthButton,
	MonthsDropdown: CalendarMonthsDropdown,
	YearsDropdown: CalendarYearsDropdown,
	DayButton: CalendarDayButton,
	WeekNumber: CalendarWeekNumber,
} satisfies DayPickerProps['components'];

/**
 * Renders a month grid ([React DayPicker](https://daypicker.dev/)).
 *
 * Every DayPicker prop is forwarded, so the selection modes, matchers, locales and time-zone
 * support are upstream's. See the [DayPicker API](https://daypicker.dev/api/interfaces/PropsBase)
 * for the full list. What this adds is the SigNoz look and a `testId`.
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
 * ### Disabled days
 *
 * `disabled` takes upstream's matchers. react-day-picker disables the button natively, except on
 * the focused day, where it uses `aria-disabled` so the day stays reachable by keyboard. Both are
 * styled, and both dim by `--calendar-button-disabled-opacity` once, on the button.
 *
 * ### Where a day is painted
 *
 * On the button, never on the `<td>` around it. The button declares its own `color`, so a colour
 * set on the cell never reaches the day number, and the button covers the cell, so a background set
 * there is either hidden or has to be undone again for each selection state.
 *
 * ### Styling
 *
 * Through the `--calendar-*` tokens only. react-day-picker's `className`, `classNames`, `style`,
 * `styles`, `modifiersClassNames` and `modifiersStyles` are not accepted.
 *
 * ### The ref
 *
 * It lands on the root `<div>`, alongside react-day-picker's own, so setting `animate` does not
 * take it away.
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
 * `{stem}` is `{testId}` while one month is displayed. react-day-picker renders a caption, a week
 * number and a day button per displayed month, so with `numberOfMonths` above one the stem becomes
 * `{testId}-month-{n}`, counting the months from one as they are laid out.
 *
 * Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"calendar"` |
 * | `data-mode` | mirrors `mode`, written by react-day-picker |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `calendar-month` | one per displayed month, the caption and the grid together |
 * | `calendar-button` | every month arrow and every date cell, `data-variant` says which |
 * | `calendar-day-button-label` | inside each date cell, holds the day number |
 * | `calendar-week-number` | only while `showWeekNumber` is set |
 *
 * A date cell carries the day it stands for and the state it is in, and so does the `<td>` around
 * it, which react-day-picker writes itself.
 *
 * | date cell attribute | set when |
 * |---|---|
 * | `data-day` | always, the day as `YYYY-MM-DD` in Latin digits, unless `numerals` or a non-Gregorian `dateLib` is set |
 * | `data-today` | the day is today |
 * | `data-outside` | the day belongs to a neighbouring month |
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
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
	{
		showOutsideDays = true,
		captionLayout = 'label',
		formatters,
		components,
		testId,
		className: _className,
		classNames: _classNames,
		style: _style,
		styles: _styles,
		modifiersClassNames: _modifiersClassNames,
		modifiersStyles: _modifiersStyles,
		...props
	}: CalendarProps & RejectedProps<DayPickerStyleProp>,
	ref,
) {
	const calendarFormatters = useMemo<Partial<Formatters>>(() => {
		return {
			// Through the date library react-day-picker hands the formatter, so the shortened name
			// follows `locale` and `timeZone` the way the caption and the aria labels do.
			formatMonthDropdown: (date, dateLib = defaultDateLib) => dateLib.format(date, 'LLL'),
			...formatters,
		};
	}, [formatters]);

	const calendarClassNames = useMemo<Partial<ClassNames>>(() => {
		return {
			root: cn(styles['calendar'], defaultClassNames.root),
			months: cn(styles['calendar__months'], defaultClassNames.months),
			month: cn(styles['calendar__month'], defaultClassNames.month),
			nav: cn(styles['calendar__nav'], defaultClassNames.nav),
			month_caption: cn(styles['calendar__month-caption'], defaultClassNames.month_caption),
			dropdowns: cn(styles['calendar__dropdowns'], defaultClassNames.dropdowns),
			dropdown_root: cn(styles['calendar__dropdown-root'], defaultClassNames.dropdown_root),
			dropdown: cn(styles['calendar__dropdown'], defaultClassNames.dropdown),
			caption_label: cn(
				styles['calendar__caption-label'],
				captionLayout === 'label'
					? styles['calendar__caption-label--label']
					: styles['calendar__caption-label--dropdown'],
				defaultClassNames.caption_label,
			),
			month_grid: cn(styles['calendar__month-grid'], defaultClassNames.month_grid),
			weekdays: cn(styles['calendar__weekdays'], defaultClassNames.weekdays),
			weekday: cn(styles['calendar__weekday'], defaultClassNames.weekday),
			week: cn(styles['calendar__week'], defaultClassNames.week),
			week_number_header: cn(
				styles['calendar__week-number-header'],
				defaultClassNames.week_number_header,
			),
			week_number: cn(styles['calendar__week-number'], defaultClassNames.week_number),
			day: cn(styles['calendar__day'], defaultClassNames.day),
			hidden: cn(styles['calendar__hidden'], defaultClassNames.hidden),
		};
	}, [captionLayout]);

	const calendarComponents = useMemo<DayPickerProps['components']>(() => {
		return { ...CALENDAR_COMPONENTS, ...components };
	}, [components]);

	const contextValue = useMemo(() => ({ rootRef: ref, testId }), [ref, testId]);

	return (
		<CalendarContext.Provider value={contextValue}>
			<DayPicker
				data-slot="calendar"
				showOutsideDays={showOutsideDays}
				captionLayout={captionLayout}
				formatters={calendarFormatters}
				classNames={calendarClassNames}
				components={calendarComponents}
				{...props}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			/>
		</CalendarContext.Provider>
	);
});
