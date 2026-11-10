import type { CalendarWeekdayType } from './types.js';

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;

/**
 * The day at midnight, built from its fields. The fields are what the calendar runs on, so a day
 * is never reached by adding milliseconds to another one: a day that is 23 or 25 hours long would
 * land on the wrong date.
 *
 * `month` and `day` may overflow, `createDate(2026, 12, 1)` is 1 January 2027 and
 * `createDate(2026, 1, 0)` is 31 January 2026. `setFullYear` keeps the years 0 to 99 where
 * `new Date(year, ...)` would read them as 1900 to 1999.
 *
 * @access private
 */
export function createDate(year: number, month: number, day: number): Date {
	const date = new Date(2000, 0, 1);

	date.setFullYear(year, month, day);

	return date;
}

/**
 * The number of the day in a continuous count, so the distance between two days is a subtraction
 * whatever the zone does between them.
 *
 * @access private
 */
export function dayNumber(date: Date): number {
	const utc = new Date(0);

	utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());

	return utc.getTime() / MS_PER_DAY;
}

/**
 * @access private
 */
export function startOfMonth(date: Date): Date {
	return createDate(date.getFullYear(), date.getMonth(), 1);
}

/**
 * The last day of the month, at midnight like every day the calendar builds.
 *
 * @access private
 */
export function endOfMonth(date: Date): Date {
	return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * @access private
 */
export function startOfYear(date: Date): Date {
	return createDate(date.getFullYear(), 0, 1);
}

/**
 * @access private
 */
export function endOfYear(date: Date): Date {
	return createDate(date.getFullYear(), MONTHS_PER_YEAR - 1, 31);
}

/**
 * @access private
 */
export function addDays(date: Date, amount: number): Date {
	return createDate(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * Moves the date by whole months. A day the target month does not have lands on its last day, so
 * 31 January plus one month is 28 February (29 in a leap year).
 *
 * @access private
 */
export function addMonths(date: Date, amount: number): Date {
	const lastDayOfTarget = createDate(date.getFullYear(), date.getMonth() + amount + 1, 0);

	return createDate(
		lastDayOfTarget.getFullYear(),
		lastDayOfTarget.getMonth(),
		Math.min(date.getDate(), lastDayOfTarget.getDate()),
	);
}

/**
 * @access private
 */
export function addYears(date: Date, amount: number): Date {
	return addMonths(date, amount * MONTHS_PER_YEAR);
}

/**
 * @access private
 */
export function differenceInCalendarDays(left: Date, right: Date): number {
	return dayNumber(left) - dayNumber(right);
}

/**
 * @access private
 */
export function differenceInCalendarMonths(left: Date, right: Date): number {
	return (
		(left.getFullYear() - right.getFullYear()) * MONTHS_PER_YEAR +
		(left.getMonth() - right.getMonth())
	);
}

/**
 * @access private
 */
export function isSameDay(left: Date, right: Date): boolean {
	return (
		left.getFullYear() === right.getFullYear() &&
		left.getMonth() === right.getMonth() &&
		left.getDate() === right.getDate()
	);
}

/**
 * @access private
 */
export function isSameMonth(left: Date, right: Date): boolean {
	return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

/**
 * Whether the day is before the other one, time of day ignored.
 *
 * @access private
 */
export function isBeforeDay(left: Date, right: Date): boolean {
	return differenceInCalendarDays(left, right) < 0;
}

/**
 * Whether the day is after the other one, time of day ignored.
 *
 * @access private
 */
export function isAfterDay(left: Date, right: Date): boolean {
	return differenceInCalendarDays(left, right) > 0;
}

/**
 * The first day of the week the date is in.
 *
 * @access private
 */
export function startOfWeek(date: Date, weekStartsOn: CalendarWeekdayType): Date {
	const behind = (date.getDay() - weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;

	return addDays(date, -behind);
}

/**
 * The last day of the week the date is in.
 *
 * @access private
 */
export function endOfWeek(date: Date, weekStartsOn: CalendarWeekdayType): Date {
	return addDays(startOfWeek(date, weekStartsOn), DAYS_PER_WEEK - 1);
}

function getWeekYear(date: Date, weekStartsOn: CalendarWeekdayType): number {
	const year = date.getFullYear();
	const today = dayNumber(date);
	const startOfNextYear = startOfWeek(createDate(year + 1, 0, 1), weekStartsOn);

	if (today >= dayNumber(startOfNextYear)) {
		return year + 1;
	}

	const startOfThisYear = startOfWeek(createDate(year, 0, 1), weekStartsOn);

	return today >= dayNumber(startOfThisYear) ? year : year - 1;
}

/**
 * The week of the year the date is in, from 1. The week that holds 1 January is the first, so the
 * last days of December can be week 1 of the next year.
 *
 * @access private
 */
export function getWeekNumber(date: Date, weekStartsOn: CalendarWeekdayType): number {
	const firstWeek = startOfWeek(createDate(getWeekYear(date, weekStartsOn), 0, 1), weekStartsOn);
	const weeksSince =
		(dayNumber(startOfWeek(date, weekStartsOn)) - dayNumber(firstWeek)) / DAYS_PER_WEEK;

	return weeksSince + 1;
}
