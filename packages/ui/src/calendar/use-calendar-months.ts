import { useState } from 'react';
import {
	buildMonths,
	getGridDays,
	type GridDay,
	type GridMonth,
	isSameGridDay,
} from './month-grid.js';
import {
	clampMonth,
	getInitialMonth,
	getNavMonths,
	getNextMonth,
	getPreviousMonth,
} from './navigation.js';
import type { CalendarCaptionLayoutType, CalendarWeekdayType } from './types.js';

type CalendarMonthsOptions = {
	month: Date | undefined;
	defaultMonth: Date | undefined;
	today: Date;
	startMonth: Date | undefined;
	endMonth: Date | undefined;
	captionLayout: CalendarCaptionLayoutType;
	numberOfMonths: number;
	fixedWeeks: boolean | undefined;
	weekStartsOn: CalendarWeekdayType;
	disableNavigation: boolean | undefined;
	onMonthChange: ((month: Date) => void) | undefined;
};

type CalendarMonths = {
	months: GridMonth[];
	days: GridDay[];
	navStart: Date | undefined;
	navEnd: Date | undefined;
	previousMonth: Date | undefined;
	nextMonth: Date | undefined;
	goToMonth: (date: Date) => void;
	goToDay: (day: GridDay) => void;
};

/**
 * Which months the calendar lays out and how it moves between them.
 *
 * The first month is state, started from `defaultMonth`, until `month` is given: then it is
 * `month`, and moving only reports where the user wants to go.
 *
 * @access private
 */
export function useCalendarMonths(options: CalendarMonthsOptions): CalendarMonths {
	const { month, numberOfMonths, disableNavigation, onMonthChange } = options;
	const [navStart, navEnd] = getNavMonths(options);
	const initialMonth = getInitialMonth({ ...options, navStart, navEnd });
	const [uncontrolledMonth, setUncontrolledMonth] = useState(initialMonth);
	const firstMonth = month === undefined ? uncontrolledMonth : initialMonth;

	const months = buildMonths({
		firstMonth,
		navEnd,
		numberOfMonths,
		fixedWeeks: options.fixedWeeks,
		weekStartsOn: options.weekStartsOn,
	});
	const days = getGridDays(months);

	const goToMonth = (date: Date): void => {
		if (disableNavigation) {
			return;
		}

		const newMonth = clampMonth(date, navStart, navEnd);

		setUncontrolledMonth(newMonth);
		onMonthChange?.(newMonth);
	};

	const goToDay = (day: GridDay): void => {
		if (!days.some((shown) => isSameGridDay(shown, day))) {
			goToMonth(day.date);
		}
	};

	return {
		months,
		days,
		navStart,
		navEnd,
		previousMonth: getPreviousMonth(firstMonth, navStart, disableNavigation),
		nextMonth: getNextMonth(firstMonth, navEnd, numberOfMonths, disableNavigation),
		goToMonth,
		goToDay,
	};
}
