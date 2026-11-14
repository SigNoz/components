import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';
import type { DateAdapter } from '../lib/date-adapter.js';
import { type RejectedProps } from '../lib/utils.js';
import { fromSelection, toDay, toMatchers, toSelection } from './adapter-values.js';
import { CalendarContextProvider, type CalendarContextValue } from './calendar-context.js';
import styles from './calendar.module.scss';
import { DEFAULT_LOCALE } from './constants.js';
import { getKeyMove } from './focus.js';
import { getCalendarFormatter, getWeekdayDates } from './formatting.js';
import { getBaseModifiers, getDayModifiers } from './modifiers.js';
import type { GridDay } from './month-grid.js';
import { CalendarMonth } from './subcomponents/calendar-month.js';
import { CalendarNav } from './subcomponents/calendar-nav.js';
import type { CalendarComponent, CalendarProps, CalendarStyleProp, Modifiers } from './types.js';
import { useCalendarFocus } from './use-calendar-focus.js';
import { useCalendarMonths } from './use-calendar-months.js';
import { useCalendarSelection } from './use-calendar-selection.js';

function getToday(): Date {
	return new Date();
}

/**
 * Builds a calendar whose dates are `TDate`, held and reported through the adapter.
 *
 * See `Calendar` for what the calendar does, and `DateAdapter` for what the adapter has to do.
 *
 * @example
 * ```tsx
 * import dayjs, { type Dayjs } from 'dayjs';
 *
 * const DayjsCalendar = createCalendar<Dayjs>({
 *   toDate: (value) => value.toDate(),
 *   fromDate: (date) => dayjs(date),
 * });
 *
 * <DayjsCalendar mode="single" selected={day} onSelect={(next) => setDay(next)} />
 * ```
 */
export function createCalendar<TDate, TTimezone extends boolean = false>(
	adapter: DateAdapter<TDate, TTimezone>,
): CalendarComponent<TDate> {
	return forwardRef<HTMLDivElement, CalendarProps<TDate>>(function Calendar(
		{
			mode,
			required,
			selected,
			onSelect,
			disabled,
			today,
			month,
			defaultMonth,
			startMonth,
			endMonth,
			onMonthChange,
			numberOfMonths = 1,
			captionLayout = 'label',
			showOutsideDays = true,
			fixedWeeks,
			showWeekNumber = false,
			weekStartsOn,
			locale = DEFAULT_LOCALE,
			footer,
			hideNavigation,
			hideWeekdays = false,
			disableNavigation,
			testId,
			lang,
			className: _className,
			classNames: _classNames,
			style: _style,
			styles: _styles,
			modifiersClassNames: _modifiersClassNames,
			modifiersStyles: _modifiersStyles,
			...rootProps
		}: CalendarProps<TDate> & RejectedProps<CalendarStyleProp>,
		ref,
	) {
		const formatter = getCalendarFormatter(locale);
		const firstDayOfWeek = weekStartsOn ?? formatter.weekStartsOn;
		const todayDay = toDay(adapter, today) ?? getToday();
		const disabledMatchers = toMatchers(adapter, disabled);

		const calendar = useCalendarMonths({
			month: toDay(adapter, month),
			defaultMonth: toDay(adapter, defaultMonth),
			today: todayDay,
			startMonth: toDay(adapter, startMonth),
			endMonth: toDay(adapter, endMonth),
			captionLayout,
			numberOfMonths,
			fixedWeeks,
			weekStartsOn: firstDayOfWeek,
			disableNavigation,
			onMonthChange: onMonthChange && ((date) => onMonthChange(adapter.fromDate(date, undefined))),
		});

		const { selection, isSelected, select } = useCalendarSelection({
			selected: toSelection(adapter, mode, selected),
			required: required === true,
			onSelect:
				onSelect &&
				((next, triggerDate, modifiers, event) => {
					// The handler of each `mode` takes its own selection, which `mode` alone does not tell the
					// union apart.
					(onSelect as (...args: unknown[]) => void)(
						fromSelection(adapter, next),
						adapter.fromDate(triggerDate, undefined),
						modifiers,
						event,
					);
				}),
		});

		const dayState = {
			disabled: disabledMatchers,
			today: todayDay,
			showOutsideDays,
			navStart: calendar.navStart,
			navEnd: calendar.navEnd,
		};
		const getBase = (day: GridDay): Modifiers => getBaseModifiers(day, dayState);

		const focus = useCalendarFocus({
			days: calendar.days,
			getModifiers: getBase,
			isSelected,
			navStart: calendar.navStart,
			navEnd: calendar.navEnd,
			weekStartsOn: firstDayOfWeek,
			disabled: disabledMatchers,
			disableNavigation,
			goToDay: calendar.goToDay,
		});

		const handleDayClick = (day: GridDay, modifiers: Modifiers, event: MouseEvent): void => {
			event.preventDefault();
			event.stopPropagation();
			focus.setFocused(day);

			if (!modifiers.disabled) {
				select(day.date, modifiers, event);
			}
		};

		const handleDayKeyDown = (event: KeyboardEvent): void => {
			const move = getKeyMove(event.key, event.shiftKey);

			if (move !== undefined) {
				event.preventDefault();
				event.stopPropagation();
				focus.moveFocus(...move);
			}
		};

		const context: CalendarContextValue = {
			testId,
			formatter,
			mode,
			captionLayout,
			showWeekNumber,
			hideWeekdays,
			disableNavigation: disableNavigation === true,
			weekdays: getWeekdayDates(firstDayOfWeek),
			months: calendar.months,
			navStart: calendar.navStart,
			navEnd: calendar.navEnd,
			previousMonth: calendar.previousMonth,
			nextMonth: calendar.nextMonth,
			goToMonth: calendar.goToMonth,
			getModifiers: (day) => getDayModifiers(day, getBase(day), focus.focused, selection),
			isFocusTarget: focus.isFocusTarget,
			onDayClick: handleDayClick,
			onDayFocus: focus.setFocused,
			onDayBlur: focus.blur,
			onDayKeyDown: handleDayKeyDown,
		};

		return (
			<CalendarContextProvider value={context}>
				<div
					{...rootProps}
					ref={ref}
					data-slot="calendar"
					className={styles['calendar']}
					lang={lang ?? locale}
					data-mode={mode}
					data-required={required}
					data-multiple-months={numberOfMonths > 1 || undefined}
					data-week-numbers={showWeekNumber || undefined}
					{...(testId === undefined ? {} : { 'data-testid': testId })}
				>
					<div className={styles['calendar__months']}>
						{!hideNavigation && <CalendarNav />}
						{calendar.months.map((calendarMonth, displayIndex) => (
							// A month keeps its element as the user moves, so a dropdown they are using keeps its focus.
							// eslint-disable-next-line react/no-array-index-key
							<CalendarMonth key={displayIndex} month={calendarMonth} displayIndex={displayIndex} />
						))}
					</div>
					{footer && (
						// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an <output> belongs to a form, this only announces the footer.
						<div className={styles['calendar__footer']} role="status" aria-live="polite">
							{footer}
						</div>
					)}
				</div>
			</CalendarContextProvider>
		);
	});
}
