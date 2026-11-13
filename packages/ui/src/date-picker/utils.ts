import type { DateAdapter, DatePickerTimeType } from './types.js';

/**
 * The adapter behind `DatePicker`: a `Date` in, the same instant out, read in the browser's zone.
 *
 * @access private
 */
export const nativeDateAdapter: DateAdapter<Date> = {
	toDate: (value) => new Date(value.getTime()),
	fromDate: (date) => new Date(date.getTime()),
};

/**
 * The current instant. For event handlers, which may read the clock where a render may not.
 *
 * @access private
 */
export function readNow(): Date {
	return new Date();
}

/**
 * @access private
 */
export function isValidDate(date: unknown): date is Date {
	return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * The wall clock of `value` in `timezone`, or `undefined` when there is no value or the adapter
 * returns a `Date` that is not valid.
 *
 * @access private
 */
export function readWallClock<TDate>(
	adapter: DateAdapter<TDate, boolean>,
	value: TDate | undefined,
	timezone: string | undefined,
): Date | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	const date = adapter.toDate(value, timezone);

	return isValidDate(date) ? date : undefined;
}

/**
 * Midnight of the day `date` falls on, in its local fields.
 *
 * @access private
 */
export function startOfDay(date: Date): Date {
	return withTime(date, { hours: 0, minutes: 0, seconds: 0 });
}

/**
 * Negative when `a` is a day before `b`, zero on the same day, positive after it.
 *
 * @access private
 */
export function compareDays(a: Date, b: Date): number {
	return startOfDay(a).getTime() - startOfDay(b).getTime();
}

/**
 * `day`, moved to the nearest limit when it falls outside them.
 *
 * @access private
 */
export function clampDay(day: Date, minDay: Date | undefined, maxDay: Date | undefined): Date {
	if (minDay !== undefined && compareDays(day, minDay) < 0) {
		return minDay;
	}

	if (maxDay !== undefined && compareDays(day, maxDay) > 0) {
		return maxDay;
	}

	return day;
}

/**
 * The time of day held in the local fields of `date`.
 *
 * @access private
 */
export function readTime(date: Date | undefined): DatePickerTimeType {
	if (date === undefined) {
		return { hours: 0, minutes: 0, seconds: 0 };
	}

	return { hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds() };
}

/**
 * The wall clock of `day` at `time`.
 *
 * @access private
 */
export function withTime(day: Date, time: DatePickerTimeType): Date {
	// Set on a copy: `new Date(year, ...)` reads a year from 0 to 99 as 1900 to 1999.
	const date = new Date(day.getTime());
	date.setHours(time.hours, time.minutes, time.seconds, 0);

	return date;
}

/**
 * A number as two digits, `7` as `07`.
 *
 * @access private
 */
export function padTwo(value: number): string {
	return String(value).padStart(2, '0');
}

/**
 * The day as `YYYY-MM-DD`, read off the local fields. The same text as the `data-day` of a day
 * button, and the value of `<input type="date">`.
 *
 * @access private
 */
export function formatIsoDay(date: Date): string {
	return `${String(date.getFullYear()).padStart(4, '0')}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;
}

/**
 * The time as `HH:mm:ss`, read off the local fields.
 *
 * @access private
 */
export function formatIsoTime(date: Date): string {
	return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;
}

/**
 * What the trigger shows without `formatValue`: `YYYY-MM-DD`, or `YYYY-MM-DD HH:mm:ss` with the
 * time row, then the zone label when there is one.
 *
 * @access private
 */
export function formatDefaultValue(
	wallClock: Date,
	showTime: boolean,
	timezoneLabel: string | undefined,
): string {
	const text = showTime
		? `${formatIsoDay(wallClock)} ${formatIsoTime(wallClock)}`
		: formatIsoDay(wallClock);

	return timezoneLabel === undefined || timezoneLabel === '' ? text : `${text} ${timezoneLabel}`;
}

/**
 * What the hidden input submits: the formats of `<input type="date">` and
 * `<input type="datetime-local">`, or an empty string without a value.
 *
 * @access private
 */
export function formatFormValue(wallClock: Date | undefined, showTime: boolean): string {
	if (wallClock === undefined) {
		return '';
	}

	return showTime
		? `${formatIsoDay(wallClock)}T${formatIsoTime(wallClock)}`
		: formatIsoDay(wallClock);
}

/**
 * `value` moved by `delta`, wrapping past either end: `23` up is `00`, `00` down is `23`.
 *
 * @access private
 */
export function stepTimeValue(value: number, delta: number, max: number): number {
	const size = max + 1;

	return (((value + delta) % size) + size) % size;
}

/**
 * The value of a time field after a digit is typed, and whether the field is complete.
 *
 * The first digit replaces the value. The second one is appended to it, a number above `max` is
 * written as `max`, and the field is complete.
 *
 * @access private
 */
export function typeTimeDigit(
	value: number,
	digit: number,
	hasFirstDigit: boolean,
	max: number,
): { value: number; complete: boolean } {
	if (!hasFirstDigit) {
		return { value: digit, complete: false };
	}

	return { value: Math.min(value * 10 + digit, max), complete: true };
}
