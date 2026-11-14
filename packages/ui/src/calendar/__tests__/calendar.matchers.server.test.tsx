import { describe, expect, it } from 'vitest';
import { matchesDate, rangeIncludesDate } from '../matchers.js';
import { addToRange, isDateSelected, selectDate, type SelectionState } from '../selection.js';
import type { DateRange, Matcher } from '../types.js';

/** A day of September 2026, at midnight unless a time is given. */
function day(dayOfMonth: number, hours = 0, minutes = 0): Date {
	return new Date(2026, 8, dayOfMonth, hours, minutes);
}

describe('rangeIncludesDate', () => {
	const range: DateRange = { from: day(10), to: day(14) };

	it('includes both ends and every day between', () => {
		for (const included of [10, 11, 12, 13, 14]) {
			expect(rangeIncludesDate(range, day(included))).toBe(true);
		}

		expect(rangeIncludesDate(range, day(9))).toBe(false);
		expect(rangeIncludesDate(range, day(15))).toBe(false);
	});

	it('leaves the ends out on request', () => {
		expect(rangeIncludesDate(range, day(10), true)).toBe(false);
		expect(rangeIncludesDate(range, day(14), true)).toBe(false);
		expect(rangeIncludesDate(range, day(12), true)).toBe(true);
	});

	it('reads a range written the wrong way round as the other way round', () => {
		const inverted: DateRange = { from: day(14), to: day(10) };

		expect(rangeIncludesDate(inverted, day(12))).toBe(true);
		expect(rangeIncludesDate(inverted, day(10))).toBe(true);
		expect(rangeIncludesDate(inverted, day(14), true)).toBe(false);
		expect(rangeIncludesDate(inverted, day(15))).toBe(false);
	});

	it('holds only the day of a range with one end', () => {
		expect(rangeIncludesDate({ from: day(10), to: undefined }, day(10))).toBe(true);
		expect(rangeIncludesDate({ from: day(10), to: undefined }, day(11))).toBe(false);
		expect(rangeIncludesDate({ from: undefined, to: day(10) }, day(10))).toBe(true);
		expect(rangeIncludesDate({ from: undefined, to: day(10) }, day(9))).toBe(false);
		expect(rangeIncludesDate({ from: undefined }, day(10))).toBe(false);
	});

	it('holds no day of a range with one end when the ends are left out', () => {
		expect(rangeIncludesDate({ from: day(10) }, day(10), true)).toBe(false);
		expect(rangeIncludesDate({ to: day(10), from: undefined }, day(10), true)).toBe(false);
	});

	it('holds the one day of a range of one day, and no middle', () => {
		expect(rangeIncludesDate({ from: day(10), to: day(10) }, day(10))).toBe(true);
		expect(rangeIncludesDate({ from: day(10), to: day(10) }, day(10), true)).toBe(false);
	});

	it('goes by the day and not by the time of day', () => {
		expect(rangeIncludesDate({ from: day(10, 15, 30), to: day(14, 9) }, day(10))).toBe(true);
		expect(rangeIncludesDate({ from: day(10, 15, 30), to: day(14, 9) }, day(14, 23, 59))).toBe(
			true,
		);
	});
});

describe('matchesDate', () => {
	it('matches nothing without a matcher', () => {
		expect(matchesDate(day(10), undefined)).toBe(false);
		expect(matchesDate(day(10), [])).toBe(false);
	});

	it('matches by the boolean', () => {
		expect(matchesDate(day(10), true)).toBe(true);
		expect(matchesDate(day(10), false)).toBe(false);
	});

	it('matches the day of a date, whatever the time of day on either side', () => {
		expect(matchesDate(day(10), day(10))).toBe(true);
		expect(matchesDate(day(10, 23, 59), day(10, 0, 1))).toBe(true);
		expect(matchesDate(day(11), day(10))).toBe(false);
		expect(matchesDate(day(10), new Date(2025, 8, 10))).toBe(false);
	});

	it('matches any date of an array of dates', () => {
		expect(matchesDate(day(12), [day(10), day(12)])).toBe(true);
		expect(matchesDate(day(11), [day(10), day(12)])).toBe(false);
	});

	it('asks a function with the date', () => {
		const seen: Date[] = [];
		const odd = (date: Date): boolean => {
			seen.push(date);

			return date.getDate() % 2 === 1;
		};

		expect(matchesDate(day(11), odd)).toBe(true);
		expect(matchesDate(day(12), odd)).toBe(false);
		expect(seen.map((date) => date.getDate())).toEqual([11, 12]);
	});

	it('matches a range with both ends included', () => {
		const range = { from: day(10), to: day(12) };

		expect(matchesDate(day(10), range)).toBe(true);
		expect(matchesDate(day(12), range)).toBe(true);
		expect(matchesDate(day(13), range)).toBe(false);
		expect(matchesDate(day(10), { from: day(10) })).toBe(true);
		expect(matchesDate(day(11), { from: day(10) })).toBe(false);
	});

	it('matches the days strictly before a day', () => {
		expect(matchesDate(day(9), { before: day(10) })).toBe(true);
		expect(matchesDate(day(10), { before: day(10) })).toBe(false);
		expect(matchesDate(day(9, 23, 59), { before: day(10, 0, 1) })).toBe(true);
		expect(matchesDate(day(10, 0, 1), { before: day(10, 23, 59) })).toBe(false);
	});

	it('matches the days strictly after a day', () => {
		expect(matchesDate(day(11), { after: day(10) })).toBe(true);
		expect(matchesDate(day(10), { after: day(10) })).toBe(false);
		expect(matchesDate(day(10, 23, 59), { after: day(10, 0, 1) })).toBe(false);
	});

	it('matches the days between two days when `before` is the later one', () => {
		const between = { before: day(20), after: day(10) };

		for (const matched of [11, 15, 19]) {
			expect(matchesDate(day(matched), between)).toBe(true);
		}

		for (const missed of [9, 10, 20, 21]) {
			expect(matchesDate(day(missed), between)).toBe(false);
		}
	});

	it('matches the days outside two days when `before` is the earlier one', () => {
		const outside = { before: day(10), after: day(20) };

		for (const matched of [1, 9, 21, 30]) {
			expect(matchesDate(day(matched), outside)).toBe(true);
		}

		for (const missed of [10, 15, 20]) {
			expect(matchesDate(day(missed), outside)).toBe(false);
		}
	});

	it('matches every day but one when both bounds are the same day', () => {
		const same = { before: day(10), after: day(10) };

		expect(matchesDate(day(10), same)).toBe(false);
		expect(matchesDate(day(9), same)).toBe(true);
		expect(matchesDate(day(11), same)).toBe(true);
	});

	it('matches a day of the week, or any of several, 0 being Sunday', () => {
		// 6 September 2026 is a Sunday.
		expect(matchesDate(day(6), { dayOfWeek: 0 })).toBe(true);
		expect(matchesDate(day(7), { dayOfWeek: 0 })).toBe(false);
		expect(matchesDate(day(12), { dayOfWeek: [0, 6] })).toBe(true);
		expect(matchesDate(day(6), { dayOfWeek: [0, 6] })).toBe(true);
		expect(matchesDate(day(9), { dayOfWeek: [0, 6] })).toBe(false);
		expect(matchesDate(day(9), { dayOfWeek: [] })).toBe(false);
	});

	it('matches when any matcher of a list does', () => {
		const matchers: Matcher[] = [
			day(1),
			{ dayOfWeek: 0 },
			(date) => date.getDate() === 15,
			{ before: day(0) },
		];

		expect(matchesDate(day(1), matchers)).toBe(true);
		expect(matchesDate(day(6), matchers)).toBe(true);
		expect(matchesDate(day(15), matchers)).toBe(true);
		expect(matchesDate(day(8, 12), matchers)).toBe(false);
	});

	it('matches a list of dates nested in a list', () => {
		expect(matchesDate(day(3), [[day(2), day(3)]])).toBe(true);
		expect(matchesDate(day(4), [[day(2), day(3)]])).toBe(false);
	});
});

describe('addToRange', () => {
	const none = undefined;

	it('makes a range of one day of the first pick', () => {
		expect(addToRange(day(10), none)).toEqual({ from: day(10), to: day(10) });
		expect(addToRange(day(10), { from: undefined, to: undefined })).toEqual({
			from: day(10),
			to: day(10),
		});
	});

	it('closes a range that has a start', () => {
		expect(addToRange(day(10), { from: day(10) })).toEqual({ from: day(10), to: day(10) });
		expect(addToRange(day(12), { from: day(10) })).toEqual({ from: day(10), to: day(12) });
	});

	it('swaps the ends of a range that has a start when the day is before it', () => {
		expect(addToRange(day(8), { from: day(10) })).toEqual({ from: day(8), to: day(10) });
	});

	it('clears a one-day range when its day is picked, unless it is required', () => {
		const oneDay = { from: day(10), to: day(10) };

		expect(addToRange(day(10), oneDay)).toBeUndefined();
		expect(addToRange(day(10), oneDay, false)).toBeUndefined();
		expect(addToRange(day(10), oneDay, true)).toEqual({ from: day(10), to: day(10) });
	});

	it('shrinks a full range to its first day when its start is picked', () => {
		expect(addToRange(day(10), { from: day(10), to: day(14) })).toEqual({
			from: day(10),
			to: day(10),
		});
		expect(addToRange(day(10), { from: day(10), to: day(14) }, true)).toEqual({
			from: day(10),
			to: day(10),
		});
	});

	it('shrinks a full range to its last day when its end is picked', () => {
		expect(addToRange(day(14), { from: day(10), to: day(14) })).toEqual({
			from: day(14),
			to: day(14),
		});
		expect(addToRange(day(14), { from: day(10), to: day(14) }, true)).toEqual({
			from: day(14),
			to: day(14),
		});
	});

	it('moves the start of a full range when the day is before it', () => {
		expect(addToRange(day(8), { from: day(10), to: day(14) })).toEqual({
			from: day(8),
			to: day(14),
		});
	});

	it('moves the end of a full range when the day is after its start', () => {
		expect(addToRange(day(12), { from: day(10), to: day(14) })).toEqual({
			from: day(10),
			to: day(12),
		});
		expect(addToRange(day(20), { from: day(10), to: day(14) })).toEqual({
			from: day(10),
			to: day(20),
		});
	});

	it('leaves a range that has only an end with nothing', () => {
		expect(addToRange(day(12), { from: undefined, to: day(14) })).toBeUndefined();
	});

	it('goes by the day and not by the time of day', () => {
		const range = { from: day(10, 15, 30), to: day(10, 15, 30) };

		expect(addToRange(day(10, 0, 0), range)).toBeUndefined();
		expect(addToRange(day(10, 0, 0), range, true)).toEqual(range);
	});

	it('does not change the range it is given', () => {
		const range = { from: day(10), to: day(14) };

		addToRange(day(8), range);

		expect(range).toEqual({ from: day(10), to: day(14) });
	});
});

describe('selectDate', () => {
	describe('single', () => {
		it('selects the day', () => {
			expect(selectDate({ mode: 'single', selected: undefined }, day(10), false)).toEqual({
				mode: 'single',
				selected: day(10),
			});
			expect(selectDate({ mode: 'single', selected: day(9) }, day(10), false)).toEqual({
				mode: 'single',
				selected: day(10),
			});
		});

		it('clears the selection when its day is picked again', () => {
			expect(selectDate({ mode: 'single', selected: day(10) }, day(10), false)).toEqual({
				mode: 'single',
				selected: undefined,
			});
			expect(selectDate({ mode: 'single', selected: day(10, 15, 30) }, day(10), false)).toEqual({
				mode: 'single',
				selected: undefined,
			});
		});

		it('keeps the selection when it is required', () => {
			expect(selectDate({ mode: 'single', selected: day(10) }, day(10), true)).toEqual({
				mode: 'single',
				selected: day(10),
			});
		});
	});

	describe('multiple', () => {
		it('adds the day after the days already selected', () => {
			expect(selectDate({ mode: 'multiple', selected: undefined }, day(10), false)).toEqual({
				mode: 'multiple',
				selected: [day(10)],
			});
			expect(selectDate({ mode: 'multiple', selected: [day(12)] }, day(10), false)).toEqual({
				mode: 'multiple',
				selected: [day(12), day(10)],
			});
		});

		it('removes the day when it is picked again, leaving an empty list from the last one', () => {
			expect(
				selectDate({ mode: 'multiple', selected: [day(10), day(12)] }, day(10), false),
			).toEqual({
				mode: 'multiple',
				selected: [day(12)],
			});
			expect(selectDate({ mode: 'multiple', selected: [day(10)] }, day(10), false)).toEqual({
				mode: 'multiple',
				selected: [],
			});
		});

		it('changes nothing when it is required and the day is the last one selected', () => {
			expect(selectDate({ mode: 'multiple', selected: [day(10)] }, day(10), true)).toBeUndefined();
		});

		it('removes a day when it is required and others remain', () => {
			expect(selectDate({ mode: 'multiple', selected: [day(10), day(12)] }, day(10), true)).toEqual(
				{
					mode: 'multiple',
					selected: [day(12)],
				},
			);
		});

		it('adds a day when it is required and nothing is selected yet', () => {
			expect(selectDate({ mode: 'multiple', selected: undefined }, day(10), true)).toEqual({
				mode: 'multiple',
				selected: [day(10)],
			});
		});

		it('does not change the list it is given', () => {
			const selected = [day(10)];

			selectDate({ mode: 'multiple', selected }, day(12), false);

			expect(selected).toEqual([day(10)]);
		});
	});

	describe('range', () => {
		it('hands the pick to addToRange', () => {
			expect(selectDate({ mode: 'range', selected: undefined }, day(10), false)).toEqual({
				mode: 'range',
				selected: { from: day(10), to: day(10) },
			});
			expect(
				selectDate({ mode: 'range', selected: { from: day(10), to: day(10) } }, day(10), false),
			).toEqual({
				mode: 'range',
				selected: undefined,
			});
			expect(
				selectDate({ mode: 'range', selected: { from: day(10), to: day(10) } }, day(10), true),
			).toEqual({
				mode: 'range',
				selected: { from: day(10), to: day(10) },
			});
		});
	});
});

describe('isDateSelected', () => {
	it('is true for the day of a single selection', () => {
		const state: SelectionState = { mode: 'single', selected: day(10, 15) };

		expect(isDateSelected(state, day(10))).toBe(true);
		expect(isDateSelected(state, day(11))).toBe(false);
		expect(isDateSelected({ mode: 'single', selected: undefined }, day(10))).toBe(false);
	});

	it('is true for any day of a multiple selection', () => {
		const state: SelectionState = { mode: 'multiple', selected: [day(10), day(12)] };

		expect(isDateSelected(state, day(12))).toBe(true);
		expect(isDateSelected(state, day(11))).toBe(false);
		expect(isDateSelected({ mode: 'multiple', selected: [] }, day(10))).toBe(false);
		expect(isDateSelected({ mode: 'multiple', selected: undefined }, day(10))).toBe(false);
	});

	it('is true for every day of a range, both ends included', () => {
		const state: SelectionState = { mode: 'range', selected: { from: day(10), to: day(12) } };

		expect(isDateSelected(state, day(10))).toBe(true);
		expect(isDateSelected(state, day(11))).toBe(true);
		expect(isDateSelected(state, day(12))).toBe(true);
		expect(isDateSelected(state, day(13))).toBe(false);
	});

	it('is true for the one day of a range with one end', () => {
		expect(isDateSelected({ mode: 'range', selected: { from: day(10) } }, day(10))).toBe(true);
		expect(isDateSelected({ mode: 'range', selected: { from: day(10) } }, day(11))).toBe(false);
		expect(isDateSelected({ mode: 'range', selected: undefined }, day(10))).toBe(false);
	});
});
