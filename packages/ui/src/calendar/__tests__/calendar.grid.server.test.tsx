import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { addDays, createDate, dayNumber, endOfMonth } from '../date-math.js';
import { getBaseModifiers, getDayModifiers } from '../modifiers.js';
import {
	buildMonths,
	createGridDay,
	getDisplayMonths,
	getGridDays,
	type GridOptions,
	isSameGridDay,
} from '../month-grid.js';
import {
	clampMonth,
	getInitialMonth,
	getNavMonths,
	getNextMonth,
	getPreviousMonth,
} from '../navigation.js';
import type { SelectionState } from '../selection.js';
import type { CalendarWeekdayType } from '../types.js';

/**
 * Each zone comes with one reading that only holds while the zone really applies, so a `TZ` the
 * process ignores fails here instead of passing every other test in a zone that is not the one
 * named.
 */
const ZONES: Array<[zone: string, applies: () => boolean]> = [
	['UTC', () => new Date(2026, 6, 1).getTimezoneOffset() === 0],
	// 02:30 on 8 March 2026 does not exist, so the clock reads 03:30.
	['America/New_York', () => new Date(2026, 2, 8, 2, 30).getHours() === 3],
	// Brazil still had summer time in 2018: midnight on 4 November did not exist.
	['America/Sao_Paulo', () => new Date(2018, 10, 4, 0, 30).getHours() === 1],
	['Europe/London', () => new Date(2026, 2, 29, 1, 30).getHours() === 2],
	// Summer time here is a shift of half an hour, UTC+11 against UTC+10:30.
	['Australia/Lord_Howe', () => new Date(2026, 0, 1).getTimezoneOffset() === -660],
	// Samoa moved across the date line: 30 December 2011 never happened.
	['Pacific/Apia', () => new Date(2011, 11, 30, 12).getDate() === 31],
];

const WEEK_STARTS: CalendarWeekdayType[] = [0, 1, 2, 3, 4, 5, 6];

let hostZone: string | undefined;

function useZone(zone: string): void {
	beforeAll(() => {
		hostZone = process.env['TZ'];
		process.env['TZ'] = zone;
	});

	afterAll(() => {
		if (hostZone === undefined) {
			delete process.env['TZ'];
		} else {
			process.env['TZ'] = hostZone;
		}
	});
}

/** The date as `[year, month, day]`, the month counted from 1. */
function parts(date: Date): [number, number, number] {
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

/** The date as `YYYY-MM-DD`, written the way the calendar writes it. */
function iso(year: number, month: number, day: number): string {
	return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function gridOptions(overrides: Partial<GridOptions> & { firstMonth: Date }): GridOptions {
	return {
		navEnd: undefined,
		numberOfMonths: 1,
		fixedWeeks: false,
		weekStartsOn: 0,
		...overrides,
	};
}

describe.each(ZONES)('month grid in %s', (zone, applies) => {
	useZone(zone);

	it('runs in the zone it names', () => {
		expect(applies()).toBe(true);
	});

	describe('buildMonths', () => {
		it('lays February 2026 out in four rows, and in six when the weeks are fixed', () => {
			const [month] = buildMonths(gridOptions({ firstMonth: createDate(2026, 1, 1) }));
			const [fixed] = buildMonths(
				gridOptions({ firstMonth: createDate(2026, 1, 1), fixedWeeks: true }),
			);

			expect(month?.weeks).toHaveLength(4);
			expect(parts(month?.weeks[0]?.days[0]?.date ?? new Date(NaN))).toEqual([2026, 2, 1]);
			expect(parts(month?.weeks[3]?.days[6]?.date ?? new Date(NaN))).toEqual([2026, 2, 28]);
			expect(fixed?.weeks).toHaveLength(6);
			expect(parts(fixed?.weeks[5]?.days[6]?.date ?? new Date(NaN))).toEqual([2026, 3, 14]);
		});

		it('lays the leap February of 2024 out from the end of January to the start of March', () => {
			const [month] = buildMonths(gridOptions({ firstMonth: createDate(2024, 1, 1) }));

			expect(month?.weeks).toHaveLength(5);
			expect(parts(month?.weeks[0]?.days[0]?.date ?? new Date(NaN))).toEqual([2024, 1, 28]);
			expect(parts(month?.weeks[4]?.days[6]?.date ?? new Date(NaN))).toEqual([2024, 3, 2]);
		});

		it('lays a month that straddles six weeks out in six rows', () => {
			const [month] = buildMonths(gridOptions({ firstMonth: createDate(2026, 7, 1) }));

			expect(month?.weeks).toHaveLength(6);
			expect(parts(month?.weeks[0]?.days[0]?.date ?? new Date(NaN))).toEqual([2026, 7, 26]);
			expect(parts(month?.weeks[5]?.days[6]?.date ?? new Date(NaN))).toEqual([2026, 9, 5]);
		});

		it.each(WEEK_STARTS)(
			'lays every month of 2026 and 2027 out well with the week starting on day %i',
			(weekStartsOn) => {
				for (const fixedWeeks of [false, true]) {
					for (let index = 0; index < 24; index += 1) {
						const first = createDate(2026, index, 1);
						const [month, ...rest] = buildMonths(
							gridOptions({ firstMonth: first, weekStartsOn, fixedWeeks }),
						);
						const label = `${iso(...parts(first))} weekStartsOn ${weekStartsOn} fixed ${fixedWeeks}`;
						const days = month?.weeks.flatMap((week) => week.days) ?? [];
						const daysOfTheMonth = days
							.filter((day) => !day.outside)
							.map((day) => day.date.getDate());
						const lastDay = endOfMonth(first).getDate();

						expect(rest, label).toHaveLength(0);
						expect(month?.weeks.length, label).toBeGreaterThanOrEqual(4);
						expect(month?.weeks.length, label).toBeLessThanOrEqual(6);

						if (fixedWeeks) {
							expect(month?.weeks, label).toHaveLength(6);
						}

						for (const week of month?.weeks ?? []) {
							expect(week.days, label).toHaveLength(7);
							expect(week.days[0]?.date.getDay(), label).toBe(weekStartsOn);
						}

						days.forEach((day, position) => {
							const previous = days[position - 1];

							if (previous !== undefined) {
								expect(dayNumber(day.date) - dayNumber(previous.date), label).toBe(1);
							}

							expect(parts(day.displayMonth), label).toEqual(parts(first));
							expect(day.outside, label).toBe(
								day.date.getMonth() !== first.getMonth() ||
									day.date.getFullYear() !== first.getFullYear(),
							);
						});

						expect(daysOfTheMonth, label).toEqual(Array.from({ length: lastDay }, (_, i) => i + 1));
					}
				}
			},
		);

		it('draws the week two displayed months share in both, as an outside day of the other month', () => {
			const [june, july] = buildMonths(
				gridOptions({ firstMonth: createDate(2025, 5, 1), numberOfMonths: 2 }),
			);
			const juneDays = june?.weeks.flatMap((week) => week.days) ?? [];
			const julyDays = july?.weeks.flatMap((week) => week.days) ?? [];
			const lastWeekOfJune = june?.weeks.at(-1)?.days.map((day) => day.isoDate);
			const firstWeekOfJuly = july?.weeks[0]?.days.map((day) => day.isoDate);

			expect(lastWeekOfJune).toEqual(firstWeekOfJuly);
			expect(lastWeekOfJune?.[0]).toBe('2025-06-29');

			const juneThirtyInJune = juneDays.find((day) => day.isoDate === '2025-06-30');
			const juneThirtyInJuly = julyDays.find((day) => day.isoDate === '2025-06-30');
			const julyFirstInJune = juneDays.find((day) => day.isoDate === '2025-07-01');
			const julyFirstInJuly = julyDays.find((day) => day.isoDate === '2025-07-01');

			expect(juneThirtyInJune?.outside).toBe(false);
			expect(juneThirtyInJuly?.outside).toBe(true);
			expect(julyFirstInJune?.outside).toBe(true);
			expect(julyFirstInJuly?.outside).toBe(false);

			if (juneThirtyInJune && juneThirtyInJuly && julyFirstInJune && julyFirstInJuly) {
				expect(parts(juneThirtyInJune.date)).toEqual(parts(juneThirtyInJuly.date));
				expect(isSameGridDay(juneThirtyInJune, juneThirtyInJuly)).toBe(false);
				expect(isSameGridDay(julyFirstInJune, julyFirstInJuly)).toBe(false);
				expect(isSameGridDay(juneThirtyInJune, juneThirtyInJune)).toBe(true);
			}
		});

		it('lays out three months side by side and stops at navEnd', () => {
			const firstMonth = createDate(2026, 9, 1);

			expect(buildMonths(gridOptions({ firstMonth, numberOfMonths: 3 }))).toHaveLength(3);

			const truncated = buildMonths(
				gridOptions({ firstMonth, numberOfMonths: 3, navEnd: createDate(2026, 10, 30) }),
			);

			expect(truncated.map((month) => parts(month.date))).toEqual([
				[2026, 10, 1],
				[2026, 11, 1],
			]);
		});

		it('numbers each week once with the number of its first day', () => {
			const [month] = buildMonths(gridOptions({ firstMonth: createDate(2026, 8, 1) }));

			expect(month?.weeks.map((week) => week.weekNumber)).toEqual([36, 37, 38, 39, 40]);
		});

		it('writes the numbers of a week that holds 1 January as week 1', () => {
			const [december] = buildMonths(gridOptions({ firstMonth: createDate(2025, 11, 1) }));

			expect(december?.weeks.at(-1)?.weekNumber).toBe(1);
			expect(december?.weeks.at(-2)?.weekNumber).toBe(52);
		});

		it('is empty when no month fits before navEnd', () => {
			expect(
				buildMonths(
					gridOptions({ firstMonth: createDate(2026, 9, 1), navEnd: createDate(2026, 8, 30) }),
				),
			).toEqual([]);
		});
	});

	describe('getGridDays', () => {
		it('lists every cell in the order they are drawn', () => {
			const months = buildMonths(
				gridOptions({ firstMonth: createDate(2026, 8, 1), numberOfMonths: 2 }),
			);
			const days = getGridDays(months);

			expect(days).toHaveLength(months.reduce((total, month) => total + month.weeks.length * 7, 0));
			expect(days[0]).toBe(months[0]?.weeks[0]?.days[0]);
			expect(days.at(-1)).toBe(months[1]?.weeks.at(-1)?.days[6]);
		});
	});

	describe('getDisplayMonths', () => {
		it('stops before the first month after navEnd', () => {
			const first = createDate(2026, 10, 1);

			expect(getDisplayMonths(first, createDate(2026, 11, 31), 3).map(parts)).toEqual([
				[2026, 11, 1],
				[2026, 12, 1],
			]);
			expect(getDisplayMonths(first, undefined, 3)).toHaveLength(3);
		});

		it('keeps a month that starts on navEnd', () => {
			expect(getDisplayMonths(createDate(2026, 10, 1), createDate(2026, 11, 1), 2)).toHaveLength(2);
		});

		it('crosses the year', () => {
			expect(getDisplayMonths(createDate(2026, 11, 1), undefined, 2).map(parts)).toEqual([
				[2026, 12, 1],
				[2027, 1, 1],
			]);
		});
	});
});

describe('createGridDay', () => {
	it('writes the date and the months as padded numbers', () => {
		const day = createGridDay(createDate(2026, 8, 7), createDate(2026, 8, 1));

		expect(day.isoDate).toBe('2026-09-07');
		expect(day.dateMonthId).toBe('2026-09');
		expect(day.displayMonthId).toBe('2026-09');
		expect(day.outside).toBe(false);
	});

	it('names the month of the date and the month of the grid apart for an outside day', () => {
		const day = createGridDay(createDate(2026, 7, 31), createDate(2026, 8, 1));

		expect(day.isoDate).toBe('2026-08-31');
		expect(day.dateMonthId).toBe('2026-08');
		expect(day.displayMonthId).toBe('2026-09');
		expect(day.outside).toBe(true);
	});

	it('pads a year of fewer than four digits', () => {
		const day = createGridDay(createDate(99, 0, 5), createDate(99, 0, 1));

		expect(day.isoDate).toBe('0099-01-05');
		expect(day.dateMonthId).toBe('0099-01');
	});

	it('is the same cell for any day of the grid month, and another one for another month', () => {
		const date = createDate(2026, 8, 7);

		expect(
			isSameGridDay(
				createGridDay(date, createDate(2026, 8, 1)),
				createGridDay(date, createDate(2026, 8, 15)),
			),
		).toBe(true);
		expect(
			isSameGridDay(
				createGridDay(date, createDate(2026, 8, 1)),
				createGridDay(date, createDate(2026, 9, 1)),
			),
		).toBe(false);
		expect(
			isSameGridDay(
				createGridDay(date, createDate(2026, 8, 1)),
				createGridDay(addDays(date, 1), createDate(2026, 8, 1)),
			),
		).toBe(false);
	});
});

describe('getNavMonths', () => {
	const today = createDate(2026, 8, 7);

	it('turns startMonth into its first day and endMonth into its last', () => {
		const [navStart, navEnd] = getNavMonths({
			startMonth: createDate(2026, 2, 15),
			endMonth: createDate(2026, 7, 10),
			captionLayout: 'label',
			today,
		});

		expect(navStart && parts(navStart)).toEqual([2026, 3, 1]);
		expect(navEnd && parts(navEnd)).toEqual([2026, 8, 31]);
		expect(navStart?.getHours()).toBe(0);
		expect(navEnd?.getHours()).toBe(0);
	});

	it.each(['dropdown', 'dropdown-years'] as const)(
		'with %s, starts 100 years before today and ends with its year',
		(captionLayout) => {
			const [navStart, navEnd] = getNavMonths({
				startMonth: undefined,
				endMonth: undefined,
				captionLayout,
				today,
			});

			expect(navStart && parts(navStart)).toEqual([1926, 1, 1]);
			expect(navEnd && parts(navEnd)).toEqual([2026, 12, 31]);
		},
	);

	it.each(['label', 'dropdown-months'] as const)(
		'with %s, has no limit of its own',
		(captionLayout) => {
			expect(
				getNavMonths({ startMonth: undefined, endMonth: undefined, captionLayout, today }),
			).toEqual([undefined, undefined]);
		},
	);

	it('fills in only the end that is missing for a year dropdown', () => {
		const [navStart, navEnd] = getNavMonths({
			startMonth: createDate(2020, 5, 1),
			endMonth: undefined,
			captionLayout: 'dropdown',
			today,
		});
		const [defaultStart, explicitEnd] = getNavMonths({
			startMonth: undefined,
			endMonth: createDate(2030, 3, 1),
			captionLayout: 'dropdown',
			today,
		});

		expect(navStart && parts(navStart)).toEqual([2020, 6, 1]);
		expect(navEnd && parts(navEnd)).toEqual([2026, 12, 31]);
		expect(defaultStart && parts(defaultStart)).toEqual([1926, 1, 1]);
		expect(explicitEnd && parts(explicitEnd)).toEqual([2030, 4, 30]);
	});
});

describe('getInitialMonth', () => {
	const today = createDate(2026, 8, 7);
	const base = {
		month: undefined,
		defaultMonth: undefined,
		today,
		numberOfMonths: 1,
		navStart: undefined,
		navEnd: undefined,
	};

	it('prefers month, then defaultMonth, then today, as the first day of the month', () => {
		expect(
			parts(
				getInitialMonth({
					...base,
					month: createDate(2026, 2, 15),
					defaultMonth: createDate(2026, 4, 1),
				}),
			),
		).toEqual([2026, 3, 1]);
		expect(parts(getInitialMonth({ ...base, defaultMonth: createDate(2026, 4, 20) }))).toEqual([
			2026, 5, 1,
		]);
		expect(parts(getInitialMonth(base))).toEqual([2026, 9, 1]);
	});

	it('moves back so that every month fits before navEnd', () => {
		const navEnd = createDate(2026, 11, 31);

		expect(
			parts(
				getInitialMonth({ ...base, month: createDate(2026, 11, 1), navEnd, numberOfMonths: 2 }),
			),
		).toEqual([2026, 11, 1]);
		expect(
			parts(
				getInitialMonth({ ...base, month: createDate(2026, 11, 1), navEnd, numberOfMonths: 3 }),
			),
		).toEqual([2026, 10, 1]);
		expect(
			parts(getInitialMonth({ ...base, month: createDate(2026, 0, 1), navEnd, numberOfMonths: 3 })),
		).toEqual([2026, 1, 1]);
	});

	it('moves up to navStart', () => {
		expect(
			parts(
				getInitialMonth({
					...base,
					month: createDate(2026, 0, 1),
					navStart: createDate(2026, 2, 1),
				}),
			),
		).toEqual([2026, 3, 1]);
	});

	it('lets navStart win over navEnd when the months do not fit between them', () => {
		expect(
			parts(
				getInitialMonth({
					...base,
					month: createDate(2026, 2, 1),
					navStart: createDate(2026, 2, 1),
					navEnd: createDate(2026, 2, 31),
					numberOfMonths: 3,
				}),
			),
		).toEqual([2026, 3, 1]);
	});
});

describe('getPreviousMonth and getNextMonth', () => {
	const september = createDate(2026, 8, 1);

	it('goes one month back, from any day of the month', () => {
		expect(parts(getPreviousMonth(september, undefined, false) ?? new Date(NaN))).toEqual([
			2026, 8, 1,
		]);
		expect(
			parts(getPreviousMonth(createDate(2026, 8, 15), undefined, false) ?? new Date(NaN)),
		).toEqual([2026, 8, 1]);
		expect(
			parts(getPreviousMonth(createDate(2026, 0, 1), undefined, false) ?? new Date(NaN)),
		).toEqual([2025, 12, 1]);
	});

	it('stops at the month that holds navStart', () => {
		expect(getPreviousMonth(september, createDate(2026, 8, 1), false)).toBeUndefined();
		expect(
			parts(getPreviousMonth(september, createDate(2026, 7, 1), false) ?? new Date(NaN)),
		).toEqual([2026, 8, 1]);
	});

	it('goes one month forward', () => {
		expect(parts(getNextMonth(september, undefined, 1, false) ?? new Date(NaN))).toEqual([
			2026, 10, 1,
		]);
		expect(
			parts(getNextMonth(createDate(2026, 11, 1), undefined, 1, false) ?? new Date(NaN)),
		).toEqual([2027, 1, 1]);
	});

	it('stops when the last displayed month is the one that holds navEnd', () => {
		expect(getNextMonth(september, createDate(2026, 8, 30), 1, false)).toBeUndefined();
		expect(
			parts(getNextMonth(september, createDate(2026, 9, 31), 1, false) ?? new Date(NaN)),
		).toEqual([2026, 10, 1]);
	});

	it('stops one month earlier while two months are displayed', () => {
		expect(getNextMonth(september, createDate(2026, 9, 31), 2, false)).toBeUndefined();
		expect(
			parts(getNextMonth(september, createDate(2026, 10, 30), 2, false) ?? new Date(NaN)),
		).toEqual([2026, 10, 1]);
	});

	it('goes nowhere when navigation is disabled', () => {
		expect(getPreviousMonth(september, undefined, true)).toBeUndefined();
		expect(getNextMonth(september, undefined, 1, true)).toBeUndefined();
	});
});

describe('clampMonth', () => {
	const navStart = createDate(2026, 2, 15);
	const navEnd = createDate(2026, 7, 31);

	it('returns the first day of the month it is given inside the limits', () => {
		expect(parts(clampMonth(createDate(2026, 5, 20), navStart, navEnd))).toEqual([2026, 6, 1]);
	});

	it('moves a month before navStart to the month that holds it', () => {
		expect(parts(clampMonth(createDate(2025, 11, 31), navStart, navEnd))).toEqual([2026, 3, 1]);
	});

	it('moves a month after navEnd to the month that holds it', () => {
		expect(parts(clampMonth(createDate(2027, 0, 1), navStart, navEnd))).toEqual([2026, 8, 1]);
	});

	it('does not move a month in the limit months themselves', () => {
		expect(parts(clampMonth(createDate(2026, 2, 1), navStart, navEnd))).toEqual([2026, 3, 1]);
		expect(parts(clampMonth(createDate(2026, 7, 20), navStart, navEnd))).toEqual([2026, 8, 1]);
	});

	it('does not limit what has no limit', () => {
		expect(parts(clampMonth(createDate(1900, 0, 20), undefined, undefined))).toEqual([1900, 1, 1]);
	});
});

describe('getBaseModifiers', () => {
	const september = createDate(2026, 8, 1);
	const options = {
		disabled: undefined,
		today: new Date(2026, 8, 7, 15, 30),
		showOutsideDays: true,
		navStart: undefined,
		navEnd: undefined,
	};

	it('names exactly the five states it decides, none focused', () => {
		const modifiers = getBaseModifiers(createGridDay(createDate(2026, 8, 12), september), options);

		expect(Object.keys(modifiers).sort()).toEqual([
			'disabled',
			'focused',
			'hidden',
			'outside',
			'today',
		]);
		expect(modifiers).toEqual({
			focused: false,
			disabled: false,
			hidden: false,
			outside: false,
			today: false,
		});
	});

	it('marks today whatever the time of day', () => {
		expect(getBaseModifiers(createGridDay(createDate(2026, 8, 7), september), options).today).toBe(
			true,
		);
		expect(getBaseModifiers(createGridDay(createDate(2026, 8, 8), september), options).today).toBe(
			false,
		);
	});

	it('marks a day the matchers rule out as disabled', () => {
		const disabled = [{ dayOfWeek: 0 }, createDate(2026, 8, 9)];

		expect(
			getBaseModifiers(createGridDay(createDate(2026, 8, 6), september), { ...options, disabled })
				.disabled,
		).toBe(true);
		expect(
			getBaseModifiers(createGridDay(createDate(2026, 8, 9), september), { ...options, disabled })
				.disabled,
		).toBe(true);
		expect(
			getBaseModifiers(createGridDay(createDate(2026, 8, 8), september), { ...options, disabled })
				.disabled,
		).toBe(false);
	});

	it('marks a day of another month as outside', () => {
		expect(
			getBaseModifiers(createGridDay(createDate(2026, 7, 31), september), options).outside,
		).toBe(true);
		expect(
			getBaseModifiers(createGridDay(createDate(2026, 8, 1), september), options).outside,
		).toBe(false);
	});

	it('hides outside days only when showOutsideDays is off', () => {
		const outside = createGridDay(createDate(2026, 7, 31), september);
		const inside = createGridDay(createDate(2026, 8, 1), september);

		expect(getBaseModifiers(outside, options).hidden).toBe(false);
		expect(getBaseModifiers(outside, { ...options, showOutsideDays: false }).hidden).toBe(true);
		expect(getBaseModifiers(inside, { ...options, showOutsideDays: false }).hidden).toBe(false);
	});

	it('hides the days before the month that holds navStart', () => {
		const limited = { ...options, navStart: createDate(2026, 8, 1) };

		expect(
			getBaseModifiers(createGridDay(createDate(2026, 7, 31), september), limited).hidden,
		).toBe(true);
		expect(getBaseModifiers(createGridDay(createDate(2026, 8, 1), september), limited).hidden).toBe(
			false,
		);
	});

	it('hides only the days before the month of a navStart that is mid-month', () => {
		const limited = { ...options, navStart: createDate(2026, 8, 15) };

		expect(
			getBaseModifiers(createGridDay(createDate(2026, 8, 10), september), limited).hidden,
		).toBe(false);
	});

	it('hides the days after the month that holds navEnd', () => {
		const limited = { ...options, navEnd: createDate(2026, 8, 30) };

		expect(getBaseModifiers(createGridDay(createDate(2026, 9, 1), september), limited).hidden).toBe(
			true,
		);
		expect(
			getBaseModifiers(createGridDay(createDate(2026, 8, 30), september), limited).hidden,
		).toBe(false);
	});
});

describe('getDayModifiers', () => {
	const september = createDate(2026, 8, 1);
	const none: SelectionState = { mode: 'single', selected: undefined };
	const baseOf = (date: Date, hidden = false): ReturnType<typeof getBaseModifiers> => ({
		...getBaseModifiers(createGridDay(date, september), {
			disabled: undefined,
			today: createDate(2026, 8, 7),
			showOutsideDays: true,
			navStart: undefined,
			navEnd: undefined,
		}),
		hidden,
	});
	const day = (dayOfMonth: number) => createGridDay(createDate(2026, 8, dayOfMonth), september);
	const range = (from: number | undefined, to: number | undefined): SelectionState => ({
		mode: 'range',
		selected: {
			from: from === undefined ? undefined : createDate(2026, 8, from),
			to: to === undefined ? undefined : createDate(2026, 8, to),
		},
	});

	it('marks the cell that holds the focus, and not the same date in another month', () => {
		const focused = day(12);
		const copyInOtherMonth = createGridDay(createDate(2026, 8, 12), createDate(2026, 9, 1));

		expect(getDayModifiers(day(12), baseOf(createDate(2026, 8, 12)), focused, none).focused).toBe(
			true,
		);
		expect(getDayModifiers(day(13), baseOf(createDate(2026, 8, 13)), focused, none).focused).toBe(
			false,
		);
		expect(
			getDayModifiers(copyInOtherMonth, baseOf(createDate(2026, 8, 12)), focused, none).focused,
		).toBe(false);
		expect(getDayModifiers(day(12), baseOf(createDate(2026, 8, 12)), undefined, none).focused).toBe(
			false,
		);
	});

	it('never marks a hidden day as focused', () => {
		expect(
			getDayModifiers(day(12), baseOf(createDate(2026, 8, 12), true), day(12), none).focused,
		).toBe(false);
	});

	it('keeps the base states', () => {
		const modifiers = getDayModifiers(day(7), baseOf(createDate(2026, 8, 7)), undefined, none);

		expect(modifiers.today).toBe(true);
		expect(modifiers.outside).toBe(false);
	});

	it('marks the selected day of each mode, and leaves the others undefined', () => {
		const single: SelectionState = { mode: 'single', selected: createDate(2026, 8, 12) };
		const multiple: SelectionState = {
			mode: 'multiple',
			selected: [createDate(2026, 8, 12), createDate(2026, 8, 14)],
		};

		expect(
			getDayModifiers(day(12), baseOf(createDate(2026, 8, 12)), undefined, single).selected,
		).toBe(true);
		expect(
			getDayModifiers(day(13), baseOf(createDate(2026, 8, 13)), undefined, single).selected,
		).toBeUndefined();
		expect(
			getDayModifiers(day(14), baseOf(createDate(2026, 8, 14)), undefined, multiple).selected,
		).toBe(true);
		expect(
			getDayModifiers(day(13), baseOf(createDate(2026, 8, 13)), undefined, multiple).selected,
		).toBeUndefined();
	});

	it('has no range key outside range mode', () => {
		const modifiers = getDayModifiers(day(12), baseOf(createDate(2026, 8, 12)), undefined, {
			mode: 'single',
			selected: createDate(2026, 8, 12),
		});

		expect(Object.keys(modifiers)).not.toEqual(expect.arrayContaining(['range_start']));
		expect(Object.keys(modifiers).filter((key) => key.startsWith('range_'))).toEqual([]);
	});

	it('has no range key in range mode while nothing is selected', () => {
		const modifiers = getDayModifiers(day(12), baseOf(createDate(2026, 8, 12)), undefined, {
			mode: 'range',
			selected: undefined,
		});

		expect(Object.keys(modifiers).filter((key) => key.startsWith('range_'))).toEqual([]);
		expect(modifiers.selected).toBeUndefined();
	});

	it('marks the start, the middle and the end of a range', () => {
		const selection = range(8, 10);
		const flags = (dayOfMonth: number) => {
			const { range_start, range_middle, range_end, selected } = getDayModifiers(
				day(dayOfMonth),
				baseOf(createDate(2026, 8, dayOfMonth)),
				undefined,
				selection,
			);

			return { range_start, range_middle, range_end, selected };
		};

		expect(flags(8)).toEqual({
			range_start: true,
			range_middle: false,
			range_end: false,
			selected: true,
		});
		expect(flags(9)).toEqual({
			range_start: false,
			range_middle: true,
			range_end: false,
			selected: true,
		});
		expect(flags(10)).toEqual({
			range_start: false,
			range_middle: false,
			range_end: true,
			selected: true,
		});
		expect(flags(11)).toEqual({
			range_start: false,
			range_middle: false,
			range_end: false,
			selected: undefined,
		});
		expect(flags(7)).toEqual({
			range_start: false,
			range_middle: false,
			range_end: false,
			selected: undefined,
		});
	});

	it('marks a range of one day as both its ends and no middle', () => {
		const modifiers = getDayModifiers(
			day(8),
			baseOf(createDate(2026, 8, 8)),
			undefined,
			range(8, 8),
		);

		expect(modifiers.range_start).toBe(true);
		expect(modifiers.range_end).toBe(true);
		expect(modifiers.range_middle).toBe(false);
	});

	it('selects the day of a range that has only a start, with no position', () => {
		const modifiers = getDayModifiers(
			day(8),
			baseOf(createDate(2026, 8, 8)),
			undefined,
			range(8, undefined),
		);

		expect(modifiers.selected).toBe(true);
		expect(modifiers.range_start).toBe(false);
		expect(modifiers.range_end).toBe(false);
		expect(modifiers.range_middle).toBe(false);
	});

	it('reads a range written the wrong way round by the name of each end', () => {
		const selection = range(10, 8);
		const modifiers = (dayOfMonth: number) =>
			getDayModifiers(
				day(dayOfMonth),
				baseOf(createDate(2026, 8, dayOfMonth)),
				undefined,
				selection,
			);

		expect(modifiers(10).range_start).toBe(true);
		expect(modifiers(8).range_end).toBe(true);
		expect(modifiers(9).range_middle).toBe(true);
	});
});
