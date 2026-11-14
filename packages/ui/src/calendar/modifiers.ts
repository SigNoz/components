import { differenceInCalendarDays, endOfMonth, isSameDay, startOfMonth } from './date-math.js';
import { matchesDate, rangeIncludesDate } from './matchers.js';
import { type GridDay, isSameGridDay } from './month-grid.js';
import { isDateSelected, type SelectionState } from './selection.js';
import type { Matcher, Modifiers } from './types.js';

/**
 * What decides the states a day is in apart from the selection and the focus.
 *
 * @access private
 */
export type DayStateOptions = {
	disabled: Matcher | Matcher[] | undefined;
	today: Date;
	showOutsideDays: boolean;
	navStart: Date | undefined;
	navEnd: Date | undefined;
};

/**
 * The states a day is in that do not depend on what is selected or focused: `disabled`, `hidden`,
 * `outside` and `today`. A day is hidden when it falls outside the months the user can reach, and
 * when it belongs to a neighbouring month while `showOutsideDays` is off.
 *
 * @access private
 */
export function getBaseModifiers(day: GridDay, options: DayStateOptions): Modifiers {
	const { date } = day;
	const { disabled, today, showOutsideDays, navStart, navEnd } = options;
	const isBeforeNavStart =
		navStart !== undefined && differenceInCalendarDays(date, startOfMonth(navStart)) < 0;
	const isAfterNavEnd =
		navEnd !== undefined && differenceInCalendarDays(date, endOfMonth(navEnd)) > 0;

	return {
		focused: false,
		disabled: matchesDate(date, disabled),
		hidden: isBeforeNavStart || isAfterNavEnd || (!showOutsideDays && day.outside),
		outside: day.outside,
		today: isSameDay(date, today),
	};
}

/**
 * Every state of a day: the base ones, whether it holds the focus, whether it is selected and, in
 * `range` mode, where it sits in the range. A hidden day never holds the focus.
 *
 * @access private
 */
export function getDayModifiers(
	day: GridDay,
	base: Modifiers,
	focused: GridDay | undefined,
	selection: SelectionState,
): Modifiers {
	const modifiers: Record<string, boolean | undefined> = {
		...base,
		focused: !base.hidden && focused !== undefined && isSameGridDay(focused, day),
		// `undefined` rather than `false` for a day that is not selected, as `onSelect` reports it.
		selected: isDateSelected(selection, day.date) || undefined,
	};

	if (selection.mode === 'range' && selection.selected !== undefined) {
		const { from, to } = selection.selected;

		modifiers.range_start = Boolean(from && to && isSameDay(day.date, from));
		modifiers.range_end = Boolean(from && to && isSameDay(day.date, to));
		modifiers.range_middle = rangeIncludesDate(selection.selected, day.date, true);
	}

	return modifiers as Modifiers;
}
