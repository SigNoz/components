import { differenceInCalendarDays, isAfterDay, isBeforeDay, isSameDay } from './date-math.js';
import type { DateRange, Matcher } from './types.js';

// A `Date` from another window fails `instanceof`, so it is told by its tag.
function isDate(value: unknown): value is Date {
	return Object.prototype.toString.call(value) === '[object Date]';
}

function hasKey(value: unknown, key: string): boolean {
	return typeof value === 'object' && value !== null && key in value;
}

// `{ from, to }` is told by `from` alone.
function isDateRange(value: unknown): value is DateRange {
	return hasKey(value, 'from');
}

/**
 * Whether the day is in the range, both ends included unless `excludeEnds` is set. A range whose
 * ends are the wrong way round counts as the other way round, and a range with one end holds that
 * day alone.
 *
 * @access private
 */
export function rangeIncludesDate(range: DateRange, date: Date, excludeEnds = false): boolean {
	const { from, to } = range;

	if (from && to) {
		const [first, last] = differenceInCalendarDays(to, from) < 0 ? [to, from] : [from, to];
		const margin = excludeEnds ? 1 : 0;

		return (
			differenceInCalendarDays(date, first) >= margin &&
			differenceInCalendarDays(last, date) >= margin
		);
	}

	if (excludeEnds) {
		return false;
	}

	const end = to ?? from;

	return end !== undefined && isSameDay(end, date);
}

function matchesOne(date: Date, matcher: Matcher): boolean {
	if (typeof matcher === 'boolean') {
		return matcher;
	}

	if (isDate(matcher)) {
		return isSameDay(date, matcher);
	}

	if (Array.isArray(matcher)) {
		return matcher.some((matcherDate) => isSameDay(date, matcherDate));
	}

	if (typeof matcher === 'function') {
		return matcher(date);
	}

	if (isDateRange(matcher)) {
		return rangeIncludesDate(matcher, date);
	}

	if ('dayOfWeek' in matcher) {
		return Array.isArray(matcher.dayOfWeek)
			? matcher.dayOfWeek.includes(date.getDay())
			: matcher.dayOfWeek === date.getDay();
	}

	if ('before' in matcher && 'after' in matcher) {
		const isDayBefore = differenceInCalendarDays(matcher.before, date) > 0;
		const isDayAfter = differenceInCalendarDays(matcher.after, date) < 0;

		return isAfterDay(matcher.before, matcher.after)
			? isDayAfter && isDayBefore
			: isDayBefore || isDayAfter;
	}

	if ('after' in matcher) {
		return isAfterDay(date, matcher.after);
	}

	return isBeforeDay(date, matcher.before);
}

/**
 * Whether the day matches any of the matchers, which are already `Date` shaped.
 *
 * @access private
 */
export function matchesDate(date: Date, matchers: Matcher | Matcher[] | undefined): boolean {
	if (matchers === undefined) {
		return false;
	}

	return (Array.isArray(matchers) ? matchers : [matchers]).some((matcher) =>
		matchesOne(date, matcher),
	);
}
