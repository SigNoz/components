import {
	addDays,
	addMonths,
	differenceInCalendarDays,
	endOfMonth,
	endOfWeek,
	getWeekNumber,
	isSameDay,
	isSameMonth,
	startOfWeek,
} from './date-math.js';
import type { CalendarWeekdayType } from './types.js';

const DAYS_PER_WEEK = 7;
const FIXED_WEEKS_DAYS = 42;

/**
 * One cell of a month grid: a day, and the month whose grid it is drawn in. The same date is two
 * cells when two displayed months both reach it, once as a day of its own month and once as an
 * outside day of the neighbour.
 *
 * @access private
 */
export type GridDay = {
	date: Date;
	/**
	 * The first day of the month whose grid holds this cell.
	 */
	displayMonth: Date;
	/**
	 * Whether the date belongs to a month other than the one whose grid it is in.
	 */
	outside: boolean;
	/**
	 * The date as `YYYY-MM-DD`.
	 */
	isoDate: string;
	/**
	 * The month of the grid as `YYYY-MM`.
	 */
	displayMonthId: string;
	/**
	 * The month of the date as `YYYY-MM`.
	 */
	dateMonthId: string;
};

/**
 * @access private
 */
export type GridWeek = {
	weekNumber: number;
	days: GridDay[];
};

/**
 * @access private
 */
export type GridMonth = {
	/**
	 * The first day of the month.
	 */
	date: Date;
	weeks: GridWeek[];
};

/**
 * What decides the months that are laid out and the weeks inside them.
 *
 * @access private
 */
export type GridOptions = {
	/**
	 * The first month shown, as its first day.
	 */
	firstMonth: Date;
	/**
	 * The last day of the latest month the user can reach, when there is a limit.
	 */
	navEnd: Date | undefined;
	numberOfMonths: number;
	fixedWeeks: boolean | undefined;
	weekStartsOn: CalendarWeekdayType;
};

function formatMonthId(date: Date): string {
	return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * The cell for a date in the grid of a month.
 *
 * @access private
 */
export function createGridDay(date: Date, displayMonth: Date): GridDay {
	return {
		date,
		displayMonth,
		outside: !isSameMonth(date, displayMonth),
		isoDate: `${formatMonthId(date)}-${String(date.getDate()).padStart(2, '0')}`,
		displayMonthId: formatMonthId(displayMonth),
		dateMonthId: formatMonthId(date),
	};
}

/**
 * Whether two cells are the same one: the same date, in the grid of the same month.
 *
 * @access private
 */
export function isSameGridDay(left: GridDay, right: GridDay): boolean {
	return isSameDay(left.date, right.date) && isSameMonth(left.displayMonth, right.displayMonth);
}

/**
 * The first days of the months to lay out, from `firstMonth` for `numberOfMonths` months, stopping
 * before the first one past `navEnd`.
 *
 * @access private
 */
export function getDisplayMonths(
	firstMonth: Date,
	navEnd: Date | undefined,
	numberOfMonths: number,
): Date[] {
	const months: Date[] = [];

	for (let index = 0; index < numberOfMonths; index += 1) {
		const month = addMonths(firstMonth, index);

		if (navEnd !== undefined && differenceInCalendarDays(month, navEnd) > 0) {
			break;
		}

		months.push(month);
	}

	return months;
}

function buildMonth(month: Date, options: GridOptions): GridMonth {
	const firstDay = startOfWeek(month, options.weekStartsOn);
	const lastDay = endOfWeek(endOfMonth(month), options.weekStartsOn);
	const naturalDays = differenceInCalendarDays(lastDay, firstDay) + 1;
	const dayCount = options.fixedWeeks ? Math.max(naturalDays, FIXED_WEEKS_DAYS) : naturalDays;
	const weeks: GridWeek[] = [];

	for (let offset = 0; offset < dayCount; offset += DAYS_PER_WEEK) {
		const weekStart = addDays(firstDay, offset);
		const days: GridDay[] = [];

		for (let index = 0; index < DAYS_PER_WEEK; index += 1) {
			days.push(createGridDay(addDays(weekStart, index), month));
		}

		weeks.push({ weekNumber: getWeekNumber(weekStart, options.weekStartsOn), days });
	}

	return { date: month, weeks };
}

/**
 * The months of the calendar with their weeks and days. Every week has seven days, and a week
 * that a neighbouring month shares is drawn in both.
 *
 * @access private
 */
export function buildMonths(options: GridOptions): GridMonth[] {
	return getDisplayMonths(options.firstMonth, options.navEnd, options.numberOfMonths).map((month) =>
		buildMonth(month, options),
	);
}

/**
 * Every cell of the months, in the order they are drawn.
 *
 * @access private
 */
export function getGridDays(months: GridMonth[]): GridDay[] {
	return months.flatMap((month) => month.weeks.flatMap((week) => week.days));
}
