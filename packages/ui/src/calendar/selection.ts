import { isBeforeDay, isSameDay } from './date-math.js';
import { rangeIncludesDate } from './matchers.js';
import type { DateRange } from './types.js';

/**
 * What is selected, with the mode that says what it holds.
 *
 * @access private
 */
export type SelectionState =
	| { mode: 'single'; selected: Date | undefined }
	| { mode: 'multiple'; selected: Date[] | undefined }
	| { mode: 'range'; selected: DateRange | undefined };

/**
 * Whether the day is part of the selection. A range with one end selects that day alone.
 *
 * @access private
 */
export function isDateSelected(state: SelectionState, date: Date): boolean {
	switch (state.mode) {
		case 'single':
			return state.selected !== undefined && isSameDay(state.selected, date);
		case 'multiple':
			return state.selected?.some((selectedDate) => isSameDay(selectedDate, date)) ?? false;
		case 'range':
			return state.selected !== undefined && rangeIncludesDate(state.selected, date);
	}
}

/**
 * The range after the day is picked.
 *
 * - With no range, the day is a range of one day.
 * - With a start only, the day is the end, or the start when it is before it. Picking the start
 *   again makes a range of one day.
 * - With both ends, a day before the start moves the start, a day after it moves the end. Picking
 *   an end makes the day both ends of the range, and picking the only day of a one-day range
 *   clears it unless `required`.
 * - With an end only, nothing is selected afterwards.
 *
 * @access private
 */
export function addToRange(
	date: Date,
	range: DateRange | undefined,
	required = false,
): DateRange | undefined {
	const { from, to } = range ?? {};

	if (!from && !to) {
		return { from: date, to: date };
	}

	if (from && !to) {
		if (isSameDay(from, date)) {
			return { from, to: date };
		}

		return isBeforeDay(date, from) ? { from: date, to: from } : { from, to: date };
	}

	if (from && to) {
		if (isSameDay(from, date) && isSameDay(to, date)) {
			return required ? { from, to } : undefined;
		}

		if (isSameDay(from, date)) {
			return { from, to: date };
		}

		if (isSameDay(to, date)) {
			return { from: date, to: date };
		}

		return isBeforeDay(date, from) ? { from: date, to } : { from, to: date };
	}

	return undefined;
}

/**
 * The selection after the day is picked, or `undefined` when picking it changes nothing: the last
 * selected day of a `required` multiple selection.
 *
 * With `required` unset, picking the selected day clears a single selection and removes the day
 * from a multiple one.
 *
 * @access private
 */
export function selectDate(
	state: SelectionState,
	date: Date,
	required: boolean,
): SelectionState | undefined {
	switch (state.mode) {
		case 'single':
			return {
				mode: 'single',
				selected:
					!required && state.selected !== undefined && isSameDay(state.selected, date)
						? undefined
						: date,
			};
		case 'multiple': {
			const selected = state.selected ?? [];

			if (!isDateSelected(state, date)) {
				return { mode: 'multiple', selected: [...selected, date] };
			}

			if (required && selected.length === 1) {
				return undefined;
			}

			return {
				mode: 'multiple',
				selected: selected.filter((selectedDate) => !isSameDay(selectedDate, date)),
			};
		}
		case 'range':
			return { mode: 'range', selected: addToRange(date, state.selected, required) };
	}
}
