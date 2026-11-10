import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
	addDays,
	addMonths,
	addYears,
	createDate,
	dayNumber,
	differenceInCalendarDays,
	differenceInCalendarMonths,
	endOfMonth,
	endOfWeek,
	endOfYear,
	getWeekNumber,
	isAfterDay,
	isBeforeDay,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from '../date-math.js';
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

/** The same fields after `delta` days, by arithmetic on the calendar and not on a local clock. */
function utcParts(
	year: number,
	month: number,
	day: number,
	delta: number,
): [number, number, number] {
	const shifted = new Date(Date.UTC(year, month - 1, day + delta));

	return [shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate()];
}

describe.each(ZONES)('date math in %s', (zone, applies) => {
	useZone(zone);

	it('runs in the zone it names', () => {
		expect(applies()).toBe(true);
	});

	describe('createDate', () => {
		it('builds the day from its fields', () => {
			expect(parts(createDate(2026, 8, 7))).toEqual([2026, 9, 7]);
		});

		it('carries a month or a day that overflows', () => {
			expect(parts(createDate(2026, 12, 1))).toEqual([2027, 1, 1]);
			expect(parts(createDate(2026, -1, 1))).toEqual([2025, 12, 1]);
			expect(parts(createDate(2026, 1, 0))).toEqual([2026, 1, 31]);
			expect(parts(createDate(2024, 1, 30))).toEqual([2024, 3, 1]);
			expect(parts(createDate(2026, 0, 366))).toEqual([2027, 1, 1]);
		});

		it('keeps the years 0 to 99 where the Date constructor would read 1900 to 1999', () => {
			expect(createDate(99, 0, 1).getFullYear()).toBe(99);
			expect(createDate(0, 0, 1).getFullYear()).toBe(0);
			expect(parts(createDate(50, 5, 15))).toEqual([50, 6, 15]);
			expect(new Date(99, 0, 1).getFullYear()).toBe(1999);
		});
	});

	describe('dayNumber', () => {
		it('counts the days from 1 January 1970', () => {
			expect(dayNumber(createDate(1970, 0, 1))).toBe(0);
			expect(dayNumber(createDate(1970, 0, 2))).toBe(1);
			expect(dayNumber(createDate(1969, 11, 31))).toBe(-1);
			expect(dayNumber(createDate(2026, 8, 7))).toBe(Date.UTC(2026, 8, 7) / 86_400_000);
		});

		it('ignores the time of day', () => {
			expect(dayNumber(new Date(2026, 8, 7, 23, 59))).toBe(dayNumber(new Date(2026, 8, 7, 0, 1)));
		});

		it('counts the years 0 to 99 as themselves', () => {
			expect(dayNumber(createDate(99, 0, 1)) - dayNumber(createDate(98, 0, 1))).toBe(365);
		});
	});

	describe('addDays', () => {
		it('walks a leap year and the year after it day by day', () => {
			const start = createDate(2024, 0, 1);
			let walked = start;

			for (let delta = 1; delta <= 366 + 365; delta += 1) {
				const next = addDays(walked, 1);

				expect(parts(next)).toEqual(utcParts(2024, 1, 1, delta));
				expect(differenceInCalendarDays(next, walked)).toBe(1);
				expect(parts(addDays(start, delta))).toEqual(utcParts(2024, 1, 1, delta));
				walked = next;
			}
		});

		it('walks back the same way', () => {
			const start = createDate(2026, 11, 31);

			for (let delta = 1; delta <= 365; delta += 1) {
				expect(parts(addDays(start, -delta))).toEqual(utcParts(2026, 12, 31, -delta));
			}
		});

		it('drops the time of day', () => {
			const next = addDays(new Date(2026, 8, 7, 15, 30), 1);

			expect(parts(next)).toEqual([2026, 9, 8]);
			expect(next.getHours()).toBe(0);
		});

		it('crosses a day that starts after midnight', () => {
			expect(parts(addDays(createDate(2018, 10, 3), 1))).toEqual([2018, 11, 4]);
			expect(parts(addDays(createDate(2018, 10, 3), 2))).toEqual([2018, 11, 5]);
			expect(differenceInCalendarDays(createDate(2018, 10, 5), createDate(2018, 10, 4))).toBe(1);
		});

		it('moves forward through the days of a zone one at a time even where a day never happened', () => {
			const seen = new Set<string>();
			let day = createDate(2011, 11, 20);

			for (let step = 0; step < 30; step += 1) {
				const next = addDays(day, 1);
				const key = parts(next).join('-');

				expect(Number.isNaN(next.getTime())).toBe(false);
				expect(seen.has(key)).toBe(false);
				seen.add(key);
				day = next;
			}
		});
	});

	describe('addMonths', () => {
		it('lands on the last day of a month that is shorter', () => {
			expect(parts(addMonths(createDate(2026, 0, 31), 1))).toEqual([2026, 2, 28]);
			expect(parts(addMonths(createDate(2024, 0, 31), 1))).toEqual([2024, 2, 29]);
			expect(parts(addMonths(createDate(2026, 2, 31), -1))).toEqual([2026, 2, 28]);
			expect(parts(addMonths(createDate(2026, 9, 31), 1))).toEqual([2026, 11, 30]);
		});

		it('keeps the day where the month has it', () => {
			expect(parts(addMonths(createDate(2026, 0, 15), 1))).toEqual([2026, 2, 15]);
			expect(parts(addMonths(createDate(2026, 0, 30), 2))).toEqual([2026, 3, 30]);
		});

		it('crosses the year in both directions', () => {
			expect(parts(addMonths(createDate(2026, 0, 15), -1))).toEqual([2025, 12, 15]);
			expect(parts(addMonths(createDate(2026, 11, 15), 1))).toEqual([2027, 1, 15]);
			expect(parts(addMonths(createDate(2026, 0, 31), 25))).toEqual([2028, 2, 29]);
			expect(parts(addMonths(createDate(2026, 0, 31), -13))).toEqual([2024, 12, 31]);
		});

		it('does not move for zero months', () => {
			expect(parts(addMonths(createDate(2026, 0, 31), 0))).toEqual([2026, 1, 31]);
		});
	});

	describe('addYears', () => {
		it('lands on 28 February from 29 February unless the year is a leap year', () => {
			const leapDay = createDate(2024, 1, 29);

			expect(parts(addYears(leapDay, 1))).toEqual([2025, 2, 28]);
			expect(parts(addYears(leapDay, 4))).toEqual([2028, 2, 29]);
			expect(parts(addYears(leapDay, -1))).toEqual([2023, 2, 28]);
		});
	});

	describe('differenceInCalendarDays', () => {
		it('counts days across a change of the clock, whatever its length', () => {
			expect(differenceInCalendarDays(createDate(2026, 2, 9), createDate(2026, 2, 8))).toBe(1);
			expect(differenceInCalendarDays(createDate(2026, 2, 8), createDate(2026, 2, 7))).toBe(1);
			expect(differenceInCalendarDays(createDate(2026, 9, 26), createDate(2026, 9, 25))).toBe(1);
			expect(differenceInCalendarDays(createDate(2026, 10, 2), createDate(2026, 10, 1))).toBe(1);
		});

		it('counts a year and a leap year', () => {
			expect(differenceInCalendarDays(createDate(2027, 0, 1), createDate(2026, 0, 1))).toBe(365);
			expect(differenceInCalendarDays(createDate(2025, 0, 1), createDate(2024, 0, 1))).toBe(366);
		});

		it('is negative when the first day is the earlier one', () => {
			expect(differenceInCalendarDays(createDate(2026, 8, 7), createDate(2026, 8, 10))).toBe(-3);
			expect(differenceInCalendarDays(createDate(2026, 8, 7), createDate(2026, 8, 7))).toBe(0);
		});

		it('counts the calendar and not 24 hours', () => {
			expect(
				differenceInCalendarDays(new Date(2026, 8, 8, 0, 1), new Date(2026, 8, 7, 23, 59)),
			).toBe(1);
			expect(
				differenceInCalendarDays(new Date(2026, 8, 7, 23, 59), new Date(2026, 8, 7, 0, 1)),
			).toBe(0);
		});
	});

	describe('differenceInCalendarMonths', () => {
		it('counts months by the calendar, not by days', () => {
			expect(differenceInCalendarMonths(createDate(2026, 1, 1), createDate(2026, 0, 31))).toBe(1);
			expect(differenceInCalendarMonths(createDate(2026, 0, 1), createDate(2025, 11, 31))).toBe(1);
			expect(differenceInCalendarMonths(createDate(2026, 8, 30), createDate(2026, 8, 1))).toBe(0);
		});

		it('counts across years and in both directions', () => {
			expect(differenceInCalendarMonths(createDate(2028, 0, 1), createDate(2026, 0, 1))).toBe(24);
			expect(differenceInCalendarMonths(createDate(2026, 0, 1), createDate(2026, 5, 1))).toBe(-5);
		});
	});

	describe('comparisons', () => {
		it('treats two times on one day as the same day', () => {
			expect(isSameDay(new Date(2026, 8, 7, 0, 0), new Date(2026, 8, 7, 23, 59))).toBe(true);
			expect(isSameDay(new Date(2026, 8, 7, 23, 59), new Date(2026, 8, 8, 0, 0))).toBe(false);
			expect(isSameDay(new Date(2026, 8, 7), new Date(2025, 8, 7))).toBe(false);
			expect(isSameDay(new Date(2026, 8, 7), new Date(2026, 7, 7))).toBe(false);
		});

		it('treats two days of one month as the same month', () => {
			expect(isSameMonth(new Date(2026, 8, 1), new Date(2026, 8, 30, 23, 59))).toBe(true);
			expect(isSameMonth(new Date(2026, 8, 30), new Date(2026, 9, 1))).toBe(false);
			expect(isSameMonth(new Date(2026, 8, 1), new Date(2025, 8, 1))).toBe(false);
		});

		it('orders by day and not by time of day', () => {
			expect(isBeforeDay(new Date(2026, 8, 7, 23, 59), new Date(2026, 8, 8, 0, 1))).toBe(true);
			expect(isBeforeDay(new Date(2026, 8, 7, 0, 1), new Date(2026, 8, 7, 23, 59))).toBe(false);
			expect(isAfterDay(new Date(2026, 8, 8, 0, 1), new Date(2026, 8, 7, 23, 59))).toBe(true);
			expect(isAfterDay(new Date(2026, 8, 7, 23, 59), new Date(2026, 8, 7, 0, 1))).toBe(false);
		});
	});

	describe('weeks', () => {
		// Wednesday 9 September 2026, built inside each test so it is read in the zone under test.
		const wednesday = (): Date => createDate(2026, 8, 9);

		it.each([0, 1, 2, 3, 4, 5, 6] as const)(
			'starts and ends a week that starts on day %i',
			(weekStartsOn) => {
				const behind = (3 - weekStartsOn + 7) % 7;
				const start = startOfWeek(wednesday(), weekStartsOn);
				const end = endOfWeek(wednesday(), weekStartsOn);

				expect(parts(start)).toEqual(utcParts(2026, 9, 9, -behind));
				expect(start.getDay()).toBe(weekStartsOn);
				expect(parts(end)).toEqual(utcParts(2026, 9, 9, 6 - behind));
				expect(differenceInCalendarDays(end, start)).toBe(6);
			},
		);

		it('is its own start when the day is the first of the week', () => {
			const sunday = createDate(2026, 8, 6);

			expect(parts(startOfWeek(sunday, 0))).toEqual([2026, 9, 6]);
			expect(parts(endOfWeek(sunday, 0))).toEqual([2026, 9, 12]);
			expect(parts(startOfWeek(sunday, 1))).toEqual([2026, 8, 31]);
			expect(parts(endOfWeek(sunday, 1))).toEqual([2026, 9, 6]);
		});

		it('crosses a month and a year', () => {
			expect(parts(startOfWeek(createDate(2026, 0, 1), 0))).toEqual([2025, 12, 28]);
			expect(parts(endOfWeek(createDate(2025, 11, 29), 0))).toEqual([2026, 1, 3]);
		});
	});

	describe('months and years', () => {
		it('finds the first and last day of a month, in a leap year and out of it', () => {
			expect(parts(startOfMonth(createDate(2026, 8, 17)))).toEqual([2026, 9, 1]);
			expect(parts(endOfMonth(createDate(2026, 8, 17)))).toEqual([2026, 9, 30]);
			expect(parts(endOfMonth(createDate(2026, 1, 1)))).toEqual([2026, 2, 28]);
			expect(parts(endOfMonth(createDate(2024, 1, 10)))).toEqual([2024, 2, 29]);
			expect(parts(endOfMonth(createDate(2026, 11, 3)))).toEqual([2026, 12, 31]);
		});

		it('ends the month at midnight like every other day', () => {
			expect(endOfMonth(new Date(2026, 8, 17, 15, 30)).getHours()).toBe(0);
		});

		it('finds the first and last day of a year', () => {
			expect(parts(startOfYear(createDate(2026, 8, 17)))).toEqual([2026, 1, 1]);
			expect(parts(endOfYear(createDate(2026, 8, 17)))).toEqual([2026, 12, 31]);
			expect(parts(endOfYear(createDate(2024, 1, 29)))).toEqual([2024, 12, 31]);
		});
	});

	describe('getWeekNumber', () => {
		const cases: Array<
			[weekStartsOn: CalendarWeekdayType, date: [number, number, number], week: number]
		> = [
			[0, [2025, 12, 28], 1],
			[0, [2025, 12, 27], 52],
			[0, [2026, 1, 3], 1],
			[0, [2026, 1, 4], 2],
			[0, [2026, 9, 6], 37],
			[0, [2024, 12, 28], 52],
			[0, [2024, 12, 31], 1],
			[1, [2025, 12, 29], 1],
			[1, [2025, 12, 28], 52],
			[1, [2026, 9, 6], 36],
			[1, [2026, 9, 7], 37],
			[6, [2025, 12, 27], 1],
			[6, [2025, 12, 26], 52],
		];

		it.each(cases)(
			'with the week starting on day %i, %j is week %i',
			(weekStartsOn, [year, month, day], week) => {
				expect(getWeekNumber(createDate(year, month - 1, day), weekStartsOn)).toBe(week);
			},
		);

		it('gives every day of a week the same number', () => {
			for (const weekStartsOn of [0, 1, 6] as const) {
				for (let delta = 0; delta < 7; delta += 1) {
					const day = addDays(startOfWeek(createDate(2026, 8, 9), weekStartsOn), delta);

					expect(getWeekNumber(day, weekStartsOn)).toBe(
						getWeekNumber(createDate(2026, 8, 9), weekStartsOn),
					);
				}
			}
		});

		it('never skips or repeats a number inside a year', () => {
			const weekStartsOn = 0;
			let previous = getWeekNumber(createDate(2026, 0, 4), weekStartsOn);

			for (let delta = 7; delta <= 50 * 7; delta += 7) {
				const week = getWeekNumber(addDays(createDate(2026, 0, 4), delta), weekStartsOn);

				expect(week).toBe(previous + 1);
				previous = week;
			}
		});
	});
});
