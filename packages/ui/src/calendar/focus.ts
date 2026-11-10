import {
	addDays,
	addMonths,
	addYears,
	differenceInCalendarDays,
	endOfWeek,
	startOfWeek,
} from './date-math.js';
import { createGridDay, type GridDay, isSameGridDay } from './month-grid.js';
import { matchesDate } from './matchers.js';
import type { CalendarWeekdayType, Matcher, Modifiers } from './types.js';

/**
 * How far a key moves the focus.
 *
 * @access private
 */
export type MoveBy = 'day' | 'week' | 'month' | 'year' | 'startOfWeek' | 'endOfWeek';

/**
 * @access private
 */
export type MoveDirection = 'before' | 'after';

/**
 * What a key does to the focus, or `undefined` for a key that does nothing. Shift widens an arrow
 * to a month and a vertical arrow or a page key to a year.
 *
 * @access private
 */
export function getKeyMove(
	key: string,
	shiftKey: boolean,
): [moveBy: MoveBy, direction: MoveDirection] | undefined {
	switch (key) {
		case 'ArrowLeft':
			return [shiftKey ? 'month' : 'day', 'before'];
		case 'ArrowRight':
			return [shiftKey ? 'month' : 'day', 'after'];
		case 'ArrowDown':
			return [shiftKey ? 'year' : 'week', 'after'];
		case 'ArrowUp':
			return [shiftKey ? 'year' : 'week', 'before'];
		case 'PageUp':
			return [shiftKey ? 'year' : 'month', 'before'];
		case 'PageDown':
			return [shiftKey ? 'year' : 'month', 'after'];
		case 'Home':
			return ['startOfWeek', 'before'];
		case 'End':
			return ['endOfWeek', 'after'];
		default:
			return undefined;
	}
}

// A month of disabled days is 31 tries, a year 365: past that the focus stays where it is.
const MAX_FOCUS_ATTEMPTS = 365;

/**
 * The day a move lands on, kept inside the days the user can reach.
 *
 * @access private
 */
export function getFocusableDate(options: {
	moveBy: MoveBy;
	direction: MoveDirection;
	from: Date;
	navStart: Date | undefined;
	navEnd: Date | undefined;
	weekStartsOn: CalendarWeekdayType;
}): Date {
	const { moveBy, direction, from, navStart, navEnd, weekStartsOn } = options;
	const sign = direction === 'after' ? 1 : -1;
	let target: Date;

	switch (moveBy) {
		case 'day':
			target = addDays(from, sign);
			break;
		case 'week':
			target = addDays(from, sign * 7);
			break;
		case 'month':
			target = addMonths(from, sign);
			break;
		case 'year':
			target = addYears(from, sign);
			break;
		case 'startOfWeek':
			target = startOfWeek(from, weekStartsOn);
			break;
		case 'endOfWeek':
			target = endOfWeek(from, weekStartsOn);
			break;
	}

	if (direction === 'before' && navStart && differenceInCalendarDays(navStart, target) > 0) {
		return navStart;
	}

	if (direction === 'after' && navEnd && differenceInCalendarDays(navEnd, target) < 0) {
		return navEnd;
	}

	return target;
}

/**
 * The day the focus moves to, skipping the days that are disabled, or `undefined` when there is
 * none to land on. A skipped day moves on in the same direction, so at the edge of the days the
 * user can reach a disabled day ends the search.
 *
 * @access private
 */
export function getNextFocus(options: {
	moveBy: MoveBy;
	direction: MoveDirection;
	from: GridDay;
	navStart: Date | undefined;
	navEnd: Date | undefined;
	weekStartsOn: CalendarWeekdayType;
	disabled: Matcher | Matcher[] | undefined;
}): GridDay | undefined {
	const { disabled, from: start, ...move } = options;
	let from = start;

	for (let attempt = 0; attempt <= MAX_FOCUS_ATTEMPTS; attempt += 1) {
		const date = getFocusableDate({ ...move, from: from.date });
		// The target is the cell of the month it belongs to, so a day of a neighbouring month is
		// reached through that month rather than as an outside day of this one.
		const day = createGridDay(date, date);

		if (!matchesDate(date, disabled)) {
			return day;
		}

		from = day;
	}

	return undefined;
}

/**
 * The day that is the tab stop of the grid: the one last focused, else the first selected day,
 * else today, else the first day that can be focused. Outside, hidden and disabled days are never
 * the stop.
 *
 * @access private
 */
export function calculateFocusTarget(
	days: GridDay[],
	getModifiers: (day: GridDay) => Modifiers,
	isSelected: (date: Date) => boolean,
	lastFocused: GridDay | undefined,
): GridDay | undefined {
	const focusable: Array<{ day: GridDay; today: boolean }> = [];

	for (const day of days) {
		const modifiers = getModifiers(day);

		if (!modifiers.disabled && !modifiers.hidden && !modifiers.outside) {
			focusable.push({ day, today: modifiers.today === true });
		}
	}

	const lastFocusedDay = focusable.find(
		({ day }) => lastFocused !== undefined && isSameGridDay(lastFocused, day),
	);

	return (
		lastFocusedDay ??
		focusable.find(({ day }) => isSelected(day.date)) ??
		focusable.find(({ today }) => today) ??
		focusable[0]
	)?.day;
}
