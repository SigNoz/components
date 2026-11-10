import {
	addMonths,
	addYears,
	differenceInCalendarDays,
	differenceInCalendarMonths,
	endOfMonth,
	endOfYear,
	startOfMonth,
	startOfYear,
} from './date-math.js';
import type { CalendarCaptionLayoutType } from './types.js';

const YEARS_BEFORE_TODAY = 100;

/**
 * The first and the last day of the months the user can reach, `undefined` where there is no limit.
 *
 * `startMonth` and `endMonth` give them. A year dropdown needs both ends to list, so it supplies
 * 100 years before `today` and the end of the year of `today` for the one that is missing.
 *
 * @access private
 */
export function getNavMonths(options: {
	startMonth: Date | undefined;
	endMonth: Date | undefined;
	captionLayout: CalendarCaptionLayoutType;
	today: Date;
}): [navStart: Date | undefined, navEnd: Date | undefined] {
	const { startMonth, endMonth, captionLayout, today } = options;
	const hasYearDropdown = captionLayout === 'dropdown' || captionLayout === 'dropdown-years';

	let navStart: Date | undefined;
	let navEnd: Date | undefined;

	if (startMonth) {
		navStart = startOfMonth(startMonth);
	} else if (hasYearDropdown) {
		navStart = startOfYear(addYears(today, -YEARS_BEFORE_TODAY));
	}

	if (endMonth) {
		navEnd = endOfMonth(endMonth);
	} else if (hasYearDropdown) {
		navEnd = endOfYear(today);
	}

	return [navStart, navEnd];
}

/**
 * The first month shown, as its first day: `month`, else `defaultMonth`, else `today`, moved to
 * the nearest month that leaves room for `numberOfMonths` before `navEnd` and that is not before
 * `navStart`.
 *
 * @access private
 */
export function getInitialMonth(options: {
	month: Date | undefined;
	defaultMonth: Date | undefined;
	today: Date;
	numberOfMonths: number;
	navStart: Date | undefined;
	navEnd: Date | undefined;
}): Date {
	const { numberOfMonths, navStart, navEnd } = options;
	let initialMonth = options.month ?? options.defaultMonth ?? options.today;

	if (navEnd && differenceInCalendarMonths(navEnd, initialMonth) < numberOfMonths - 1) {
		initialMonth = addMonths(navEnd, -(numberOfMonths - 1));
	}

	if (navStart && differenceInCalendarMonths(initialMonth, navStart) < 0) {
		initialMonth = navStart;
	}

	return startOfMonth(initialMonth);
}

/**
 * The month the previous-month arrow goes to, `undefined` when there is none.
 *
 * @access private
 */
export function getPreviousMonth(
	firstMonth: Date,
	navStart: Date | undefined,
	disableNavigation: boolean | undefined,
): Date | undefined {
	if (disableNavigation) {
		return undefined;
	}

	const month = startOfMonth(firstMonth);

	if (navStart && differenceInCalendarMonths(month, navStart) <= 0) {
		return undefined;
	}

	return addMonths(month, -1);
}

/**
 * The month the next-month arrow goes to, `undefined` when there is none. The last displayed month
 * has to stay within `navEnd`, so the arrow stops once it is the last reachable one.
 *
 * @access private
 */
export function getNextMonth(
	firstMonth: Date,
	navEnd: Date | undefined,
	numberOfMonths: number,
	disableNavigation: boolean | undefined,
): Date | undefined {
	if (disableNavigation) {
		return undefined;
	}

	if (navEnd && differenceInCalendarMonths(navEnd, firstMonth) < numberOfMonths) {
		return undefined;
	}

	return addMonths(startOfMonth(firstMonth), 1);
}

/**
 * The month to land on for a month asked for, kept between the first day of `navStart`'s month and
 * `navEnd`'s.
 *
 * @access private
 */
export function clampMonth(date: Date, navStart: Date | undefined, navEnd: Date | undefined): Date {
	let month = startOfMonth(date);

	if (navStart && differenceInCalendarDays(month, startOfMonth(navStart)) < 0) {
		month = startOfMonth(navStart);
	}

	if (navEnd && differenceInCalendarDays(month, startOfMonth(navEnd)) > 0) {
		month = startOfMonth(navEnd);
	}

	return month;
}
