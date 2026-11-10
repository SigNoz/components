import { describe, expect, it } from 'vitest';
import { createDate } from '../date-math.js';
import {
	calculateFocusTarget,
	getFocusableDate,
	getKeyMove,
	getNextFocus,
	type MoveBy,
	type MoveDirection,
} from '../focus.js';
import { getBaseModifiers } from '../modifiers.js';
import { buildMonths, createGridDay, getGridDays, type GridDay } from '../month-grid.js';
import type { CalendarWeekdayType, Matcher } from '../types.js';

/** A day of September 2026. */
function day(dayOfMonth: number): Date {
	return new Date(2026, 8, dayOfMonth);
}

/** The date as `YYYY-MM-DD`. */
function iso(date: Date | undefined): string | undefined {
	if (date === undefined) {
		return undefined;
	}

	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

describe('getKeyMove', () => {
	const table: Array<
		[key: string, plain: [MoveBy, MoveDirection], shifted: [MoveBy, MoveDirection]]
	> = [
		['ArrowLeft', ['day', 'before'], ['month', 'before']],
		['ArrowRight', ['day', 'after'], ['month', 'after']],
		['ArrowUp', ['week', 'before'], ['year', 'before']],
		['ArrowDown', ['week', 'after'], ['year', 'after']],
		['PageUp', ['month', 'before'], ['year', 'before']],
		['PageDown', ['month', 'after'], ['year', 'after']],
		['Home', ['startOfWeek', 'before'], ['startOfWeek', 'before']],
		['End', ['endOfWeek', 'after'], ['endOfWeek', 'after']],
	];

	it.each(table)('%s moves the focus, and Shift widens it', (key, plain, shifted) => {
		expect(getKeyMove(key, false)).toEqual(plain);
		expect(getKeyMove(key, true)).toEqual(shifted);
	});

	it.each([
		'a',
		'Enter',
		' ',
		'Tab',
		'Escape',
		'arrowleft',
		'constructor',
		'toString',
		'__proto__',
		'',
	])('does nothing for %j', (key) => {
		expect(getKeyMove(key, false)).toBeUndefined();
		expect(getKeyMove(key, true)).toBeUndefined();
	});
});

describe('getFocusableDate', () => {
	const base = { navStart: undefined, navEnd: undefined, weekStartsOn: 0 as CalendarWeekdayType };
	const move = (
		moveBy: MoveBy,
		direction: MoveDirection,
		from: Date,
		overrides: Partial<Parameters<typeof getFocusableDate>[0]> = {},
	): string | undefined =>
		iso(getFocusableDate({ ...base, moveBy, direction, from, ...overrides }));

	it('moves a day, a week, a month and a year in each direction', () => {
		const from = day(15);

		expect(move('day', 'after', from)).toBe('2026-09-16');
		expect(move('day', 'before', from)).toBe('2026-09-14');
		expect(move('week', 'after', from)).toBe('2026-09-22');
		expect(move('week', 'before', from)).toBe('2026-09-08');
		expect(move('month', 'after', from)).toBe('2026-10-15');
		expect(move('month', 'before', from)).toBe('2026-08-15');
		expect(move('year', 'after', from)).toBe('2027-09-15');
		expect(move('year', 'before', from)).toBe('2025-09-15');
	});

	it('crosses the edges of a month and a year', () => {
		expect(move('day', 'after', createDate(2026, 8, 30))).toBe('2026-10-01');
		expect(move('day', 'before', createDate(2026, 0, 1))).toBe('2025-12-31');
		expect(move('week', 'after', createDate(2026, 11, 28))).toBe('2027-01-04');
	});

	it('lands on the last day of a month that is shorter', () => {
		expect(move('month', 'before', createDate(2026, 2, 31))).toBe('2026-02-28');
		expect(move('month', 'after', createDate(2026, 0, 31))).toBe('2026-02-28');
		expect(move('month', 'after', createDate(2024, 0, 31))).toBe('2024-02-29');
		expect(move('year', 'after', createDate(2024, 1, 29))).toBe('2025-02-28');
		expect(move('year', 'before', createDate(2024, 1, 29))).toBe('2023-02-28');
	});

	it.each([
		[0, '2026-09-13', '2026-09-19'],
		[1, '2026-09-14', '2026-09-20'],
		[6, '2026-09-12', '2026-09-18'],
	] as const)(
		'goes to the first and the last day of a week that starts on day %i',
		(weekStartsOn, start, end) => {
			// Wednesday 16 September 2026.
			expect(move('startOfWeek', 'before', day(16), { weekStartsOn })).toBe(start);
			expect(move('endOfWeek', 'after', day(16), { weekStartsOn })).toBe(end);
		},
	);

	it('stays on the first day of the week when it is already there', () => {
		expect(move('startOfWeek', 'before', day(13))).toBe('2026-09-13');
		expect(move('endOfWeek', 'after', day(19))).toBe('2026-09-19');
	});

	it('stops at navStart when moving back', () => {
		const navStart = createDate(2026, 8, 1);

		expect(move('day', 'before', day(1), { navStart })).toBe('2026-09-01');
		expect(move('week', 'before', day(2), { navStart })).toBe('2026-09-01');
		expect(move('month', 'before', day(15), { navStart })).toBe('2026-09-01');
		expect(move('year', 'before', day(15), { navStart })).toBe('2026-09-01');
		expect(move('startOfWeek', 'before', day(2), { navStart })).toBe('2026-09-01');
		expect(move('day', 'before', day(3), { navStart })).toBe('2026-09-02');
	});

	it('stops at navEnd when moving forward', () => {
		const navEnd = createDate(2026, 8, 30);

		expect(move('day', 'after', day(30), { navEnd })).toBe('2026-09-30');
		expect(move('week', 'after', day(29), { navEnd })).toBe('2026-09-30');
		expect(move('month', 'after', day(15), { navEnd })).toBe('2026-09-30');
		expect(move('year', 'after', day(15), { navEnd })).toBe('2026-09-30');
		expect(move('endOfWeek', 'after', day(29), { navEnd })).toBe('2026-09-30');
		expect(move('day', 'after', day(28), { navEnd })).toBe('2026-09-29');
	});

	it('applies a limit only in the direction it bounds', () => {
		expect(move('day', 'after', day(2), { navStart: day(5) })).toBe('2026-09-03');
		expect(move('day', 'before', day(28), { navEnd: day(5) })).toBe('2026-09-27');
	});
});

describe('getNextFocus', () => {
	const base = { navStart: undefined, navEnd: undefined, weekStartsOn: 0 as CalendarWeekdayType };
	const weekends: Matcher[] = [{ dayOfWeek: [0, 6] }];
	const from = (dayOfMonth: number): GridDay =>
		createGridDay(day(dayOfMonth), createDate(2026, 8, 1));

	it('lands on the next day when it is enabled', () => {
		const next = getNextFocus({
			...base,
			moveBy: 'day',
			direction: 'after',
			from: from(10),
			disabled: weekends,
		});

		expect(iso(next?.date)).toBe('2026-09-11');
	});

	it('skips the weekend when moving forward from a Friday', () => {
		// 11 September 2026 is a Friday.
		const next = getNextFocus({
			...base,
			moveBy: 'day',
			direction: 'after',
			from: from(11),
			disabled: weekends,
		});

		expect(iso(next?.date)).toBe('2026-09-14');
	});

	it('skips the weekend when moving back from a Monday', () => {
		const next = getNextFocus({
			...base,
			moveBy: 'day',
			direction: 'before',
			from: from(14),
			disabled: weekends,
		});

		expect(iso(next?.date)).toBe('2026-09-11');
	});

	it('moves on a week further when the week it lands on is disabled', () => {
		const disabled: Matcher[] = [{ from: day(9), to: day(15) }];
		const next = getNextFocus({
			...base,
			moveBy: 'week',
			direction: 'after',
			from: from(2),
			disabled,
		});

		expect(iso(next?.date)).toBe('2026-09-16');
	});

	it('moves back a week further the same way', () => {
		const disabled: Matcher[] = [{ from: day(9), to: day(15) }];
		const next = getNextFocus({
			...base,
			moveBy: 'week',
			direction: 'before',
			from: from(16),
			disabled,
		});

		expect(iso(next?.date)).toBe('2026-09-02');
	});

	it('finds a day that is days of attempts away', () => {
		const disabled: Matcher[] = [{ from: day(3), to: new Date(2026, 11, 31) }];
		const next = getNextFocus({
			...base,
			moveBy: 'day',
			direction: 'after',
			from: from(2),
			disabled,
		});

		expect(iso(next?.date)).toBe('2027-01-01');
	});

	it('gives up when every day it tries is disabled', () => {
		for (const disabled of [true, { after: day(2) }] as Matcher[]) {
			expect(
				getNextFocus({ ...base, moveBy: 'day', direction: 'after', from: from(2), disabled }),
			).toBeUndefined();
		}
	});

	it('gives up at the end of the days the user can reach when that day is disabled', () => {
		const forward = getNextFocus({
			...base,
			navEnd: createDate(2026, 8, 30),
			moveBy: 'day',
			direction: 'after',
			from: from(29),
			disabled: [day(30)],
		});
		const backward = getNextFocus({
			...base,
			navStart: createDate(2026, 8, 1),
			moveBy: 'day',
			direction: 'before',
			from: from(2),
			disabled: [day(1)],
		});

		expect(forward).toBeUndefined();
		expect(backward).toBeUndefined();
	});

	it('lands on the bound itself when it is enabled', () => {
		const next = getNextFocus({
			...base,
			navEnd: createDate(2026, 8, 30),
			moveBy: 'week',
			direction: 'after',
			from: from(28),
			disabled: weekends,
		});

		expect(iso(next?.date)).toBe('2026-09-30');
	});

	it('is the cell of the month the day belongs to, never an outside day of the month it came from', () => {
		const next = getNextFocus({
			...base,
			moveBy: 'day',
			direction: 'before',
			from: createGridDay(day(1), createDate(2026, 8, 1)),
			disabled: undefined,
		});

		expect(next?.isoDate).toBe('2026-08-31');
		expect(next?.outside).toBe(false);
		expect(next?.displayMonthId).toBe('2026-08');
		expect(iso(next?.displayMonth)).toBe('2026-08-31');
	});

	it('moves with nothing disabled', () => {
		const next = getNextFocus({
			...base,
			moveBy: 'month',
			direction: 'after',
			from: from(30),
			disabled: undefined,
		});

		expect(iso(next?.date)).toBe('2026-10-30');
	});
});

describe('calculateFocusTarget', () => {
	const grid = (numberOfMonths = 1, firstMonth = createDate(2026, 8, 1)): GridDay[] =>
		getGridDays(
			buildMonths({
				firstMonth,
				navEnd: undefined,
				numberOfMonths,
				fixedWeeks: false,
				weekStartsOn: 0,
			}),
		);
	const modifiersFor =
		(overrides: { today?: Date; disabled?: Matcher | Matcher[]; showOutsideDays?: boolean } = {}) =>
		(candidate: GridDay) =>
			getBaseModifiers(candidate, {
				disabled: overrides.disabled,
				today: overrides.today ?? createDate(2027, 0, 1),
				showOutsideDays: overrides.showOutsideDays ?? true,
				navStart: undefined,
				navEnd: undefined,
			});
	const selects =
		(...selected: Date[]) =>
		(date: Date): boolean =>
			selected.some((selectedDate) => iso(selectedDate) === iso(date));
	const cell = (dayOfMonth: number, month = createDate(2026, 8, 1)): GridDay =>
		createGridDay(day(dayOfMonth), month);

	it('takes the first day of the month when nothing else is in the grid', () => {
		const target = calculateFocusTarget(grid(), modifiersFor(), selects(), undefined);

		expect(target?.isoDate).toBe('2026-09-01');
	});

	it('takes today over the first day', () => {
		const target = calculateFocusTarget(
			grid(),
			modifiersFor({ today: day(7) }),
			selects(),
			undefined,
		);

		expect(target?.isoDate).toBe('2026-09-07');
	});

	it('takes the selected day over today', () => {
		const target = calculateFocusTarget(
			grid(),
			modifiersFor({ today: day(7) }),
			selects(day(15)),
			undefined,
		);

		expect(target?.isoDate).toBe('2026-09-15');
	});

	it('takes the first selected day of several', () => {
		const target = calculateFocusTarget(
			grid(),
			modifiersFor(),
			selects(day(20), day(10), day(5)),
			undefined,
		);

		expect(target?.isoDate).toBe('2026-09-05');
	});

	it('takes the day that was focused last over the selected day and today', () => {
		const target = calculateFocusTarget(
			grid(),
			modifiersFor({ today: day(7) }),
			selects(day(15)),
			cell(20),
		);

		expect(target?.isoDate).toBe('2026-09-20');
	});

	it('hands back the cell of the grid and not the one it was asked for', () => {
		const days = grid();
		const target = calculateFocusTarget(days, modifiersFor(), selects(), cell(20));

		expect(target).toBe(days.find((candidate) => candidate.isoDate === '2026-09-20'));
	});

	it('ignores a last focused day that cannot hold the focus', () => {
		const disabled: Matcher[] = [day(20)];
		const outside = createGridDay(createDate(2026, 7, 31), createDate(2026, 8, 1));

		expect(
			calculateFocusTarget(grid(), modifiersFor({ disabled }), selects(day(15)), cell(20))?.isoDate,
		).toBe('2026-09-15');
		expect(calculateFocusTarget(grid(), modifiersFor(), selects(day(15)), outside)?.isoDate).toBe(
			'2026-09-15',
		);
	});

	it('ignores a last focused day that is not in the grid', () => {
		const target = calculateFocusTarget(
			grid(),
			modifiersFor(),
			selects(day(15)),
			createGridDay(createDate(2027, 5, 1), createDate(2027, 5, 1)),
		);

		expect(target?.isoDate).toBe('2026-09-15');
	});

	it('never takes a selected day that is outside, disabled or hidden', () => {
		const outsideSelected = calculateFocusTarget(
			grid(),
			modifiersFor({ today: day(7) }),
			selects(createDate(2026, 7, 31)),
			undefined,
		);
		const disabledSelected = calculateFocusTarget(
			grid(),
			modifiersFor({ today: day(7), disabled: [day(15)] }),
			selects(day(15)),
			undefined,
		);

		expect(outsideSelected?.isoDate).toBe('2026-09-07');
		expect(disabledSelected?.isoDate).toBe('2026-09-07');
	});

	it('never takes today when it is only an outside day, or disabled', () => {
		expect(
			calculateFocusTarget(
				grid(),
				modifiersFor({ today: createDate(2026, 9, 1) }),
				selects(),
				undefined,
			)?.isoDate,
		).toBe('2026-09-01');
		expect(
			calculateFocusTarget(
				grid(),
				modifiersFor({ today: day(1), disabled: [day(1)] }),
				selects(),
				undefined,
			)?.isoDate,
		).toBe('2026-09-02');
	});

	it('skips a first day that is disabled', () => {
		const target = calculateFocusTarget(
			grid(),
			modifiersFor({ disabled: [{ before: day(5) }] }),
			selects(),
			undefined,
		);

		expect(target?.isoDate).toBe('2026-09-05');
	});

	it('takes the cell of the month a day is in when two displayed months show it', () => {
		const june = createDate(2025, 5, 1);
		const july = createDate(2025, 6, 1);
		const days = grid(2, june);
		const inJuly = createGridDay(createDate(2025, 6, 1), july);
		const inJune = createGridDay(createDate(2025, 6, 1), june);

		const target = calculateFocusTarget(days, modifiersFor(), selects(), inJuly);
		const outsideCopy = calculateFocusTarget(days, modifiersFor(), selects(), inJune);

		expect(target).toBe(
			days.find((candidate) => candidate.isoDate === '2025-07-01' && !candidate.outside),
		);
		expect(outsideCopy?.isoDate).toBe('2025-06-01');
	});

	it('has no target when no day can hold the focus', () => {
		expect(
			calculateFocusTarget(grid(), modifiersFor({ disabled: true }), selects(), undefined),
		).toBeUndefined();
		expect(calculateFocusTarget([], modifiersFor(), selects(), undefined)).toBeUndefined();
	});

	it('has no target when every day of the month is hidden or outside', () => {
		expect(
			calculateFocusTarget(
				grid(),
				() => ({ outside: true, hidden: false, disabled: false }),
				selects(),
				undefined,
			),
		).toBeUndefined();
		expect(
			calculateFocusTarget(
				grid(),
				() => ({ outside: false, hidden: true, disabled: false }),
				selects(),
				undefined,
			),
		).toBeUndefined();
	});
});
