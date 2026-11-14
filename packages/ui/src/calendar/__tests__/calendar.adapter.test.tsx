import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { DateAdapter } from '../../lib/date-adapter.js';
import { createCalendar } from '../create-calendar.js';
import { JUNE_11_2025, dayButton, isoDay, june, navButtons } from './calendar.test-utils.js';

/** A date type that is not a `Date`, and not a class either, so only the adapter can read it. */
type Boxed = { readonly boxed: Date };

const boxed = (date: Date): Boxed => ({ boxed: date });

function createBoxedCalendar() {
	const toDate = vi.fn((value: Boxed, _timezone: string | undefined) => value.boxed);
	const fromDate = vi.fn((date: Date, _timezone: string | undefined): Boxed => boxed(date));
	const adapter: DateAdapter<Boxed> = { toDate, fromDate };

	return { Calendar: createCalendar(adapter), toDate, fromDate };
}

describe('Calendar adapter', () => {
	it('reads every date it is given through toDate', () => {
		const { Calendar, toDate } = createBoxedCalendar();
		const given = {
			selected: boxed(june(12)),
			today: boxed(JUNE_11_2025),
			defaultMonth: boxed(JUNE_11_2025),
			startMonth: boxed(new Date(2025, 5, 1)),
			endMonth: boxed(new Date(2025, 6, 31)),
			disabledDay: boxed(june(3)),
			disabledListed: boxed(june(4)),
			disabledFrom: boxed(june(5)),
			disabledTo: boxed(june(6)),
			disabledBefore: boxed(june(2)),
			disabledAfter: boxed(june(28)),
		};

		render(
			<Calendar
				mode="single"
				selected={given.selected}
				today={given.today}
				defaultMonth={given.defaultMonth}
				startMonth={given.startMonth}
				endMonth={given.endMonth}
				onSelect={vi.fn()}
				disabled={[
					given.disabledDay,
					[given.disabledListed],
					{ from: given.disabledFrom, to: given.disabledTo },
					{ before: given.disabledBefore },
					{ after: given.disabledAfter },
				]}
			/>,
		);

		for (const value of Object.values(given)) {
			expect(toDate).toHaveBeenCalledWith(value, undefined);
		}

		expect(dayButton(june(12))).toHaveAttribute('data-selected-single', 'true');
		expect(dayButton(JUNE_11_2025)).toHaveAttribute('data-today', 'true');
		expect(dayButton(june(3))).toBeDisabled();
		expect(dayButton(june(4))).toBeDisabled();
		expect(dayButton(june(5))).toBeDisabled();
		expect(dayButton(june(6))).toBeDisabled();
		expect(dayButton(june(1))).toBeDisabled();
		expect(dayButton(june(29))).toBeDisabled();
		expect(dayButton(june(2))).not.toBeDisabled();
		expect(dayButton(june(28))).not.toBeDisabled();
		// June is the first month the user can reach.
		expect(navButtons().previous).toHaveAttribute('aria-disabled', 'true');
	});

	it('hands every date it reports through fromDate', async () => {
		const user = userEvent.setup();
		const { Calendar, fromDate } = createBoxedCalendar();
		const onSelect = vi.fn();
		const onMonthChange = vi.fn();

		render(
			<Calendar
				mode="single"
				defaultMonth={boxed(JUNE_11_2025)}
				onSelect={onSelect}
				onMonthChange={onMonthChange}
			/>,
		);

		await user.click(dayButton(june(18)));
		await user.click(navButtons().next);

		const [selected, triggerDate] = onSelect.mock.calls[0] as [Boxed, Boxed];
		const [month] = onMonthChange.mock.calls[0] as [Boxed];
		const made = fromDate.mock.results.map((result) => result.value as Boxed);

		expect(selected.boxed.getDate()).toBe(18);
		expect(triggerDate.boxed.getDate()).toBe(18);
		expect(month.boxed).toEqual(new Date(2025, 6, 1));
		// The very objects fromDate made, not Dates the adapter never saw.
		expect(made).toContain(selected);
		expect(made).toContain(triggerDate);
		expect(made).toContain(month);
		expect(fromDate).toHaveBeenCalledWith(expect.any(Date), undefined);
	});

	it('reports a multiple selection and a range as lists and ranges of the adapter type', async () => {
		const user = userEvent.setup();
		const { Calendar, fromDate } = createBoxedCalendar();
		const onMultiple = vi.fn();
		const onRange = vi.fn();

		const { rerender } = render(
			<Calendar
				mode="multiple"
				defaultMonth={boxed(JUNE_11_2025)}
				selected={[boxed(june(3))]}
				onSelect={onMultiple}
			/>,
		);

		await user.click(dayButton(june(9)));

		const [days] = onMultiple.mock.calls[0] as [Boxed[]];
		const madeByNow = fromDate.mock.results.map((result) => result.value as Boxed);

		expect(days.map((day) => day.boxed.getDate())).toEqual([3, 9]);
		expect(madeByNow).toContain(days[0]);
		expect(madeByNow).toContain(days[1]);

		rerender(
			<Calendar
				mode="range"
				defaultMonth={boxed(JUNE_11_2025)}
				selected={{ from: boxed(june(3)), to: undefined }}
				onSelect={onRange}
			/>,
		);

		await user.click(dayButton(june(9)));

		const [range] = onRange.mock.calls[0] as [{ from: Boxed; to: Boxed }];

		expect(range.from.boxed.getDate()).toBe(3);
		expect(range.to.boxed.getDate()).toBe(9);
		expect(fromDate.mock.results.map((result) => result.value as Boxed)).toContain(range.to);
	});

	it('hands a matcher function each day as the adapter type', () => {
		const { Calendar } = createBoxedCalendar();
		const matcher = vi.fn((date: Boxed) => date.boxed.getDate() === 12);

		render(<Calendar mode="single" defaultMonth={boxed(JUNE_11_2025)} disabled={matcher} />);

		expect(matcher).toHaveBeenCalled();

		for (const [argument] of matcher.mock.calls) {
			expect(argument).toEqual({ boxed: expect.any(Date) });
		}

		expect(dayButton(june(12))).toBeDisabled();
		expect(dayButton(june(13))).not.toBeDisabled();
	});

	it('never asks for a time zone', async () => {
		const user = userEvent.setup();
		const { Calendar, toDate, fromDate } = createBoxedCalendar();

		render(
			<Calendar
				mode="single"
				today={boxed(JUNE_11_2025)}
				defaultMonth={boxed(JUNE_11_2025)}
				onSelect={vi.fn()}
			/>,
		);

		await user.click(dayButton(june(18)));

		expect(toDate.mock.calls.length).toBeGreaterThan(0);
		expect(fromDate.mock.calls.length).toBeGreaterThan(0);

		for (const [, timezone] of [...toDate.mock.calls, ...fromDate.mock.calls]) {
			expect(timezone).toBeUndefined();
		}
	});

	it('counts a date the adapter reads as not valid as no date', () => {
		const { Calendar } = createBoxedCalendar();
		const invalid = boxed(new Date(Number.NaN));

		render(
			<Calendar
				mode="single"
				defaultMonth={boxed(JUNE_11_2025)}
				today={invalid}
				selected={invalid}
				startMonth={invalid}
				endMonth={invalid}
				onSelect={vi.fn()}
				disabled={[invalid, { before: invalid }, { from: invalid, to: invalid }]}
			/>,
		);

		expect(document.querySelector('[data-selected-single]')).toBeNull();
		expect(document.querySelector('[data-disabled]')).toBeNull();
		expect(navButtons().previous).not.toHaveAttribute('aria-disabled');
		expect(navButtons().next).not.toHaveAttribute('aria-disabled');
	});

	it('works with a date type that is a string', async () => {
		const user = userEvent.setup();
		const toDate = (value: string): Date => {
			const [year, month, day] = value.split('-').map(Number);

			return new Date(year ?? 0, (month ?? 1) - 1, day);
		};
		const Calendar = createCalendar<string>({ toDate, fromDate: (date) => isoDay(date) });
		const onSelect = vi.fn();

		render(
			<Calendar
				mode="single"
				defaultMonth="2025-06-11"
				selected="2025-06-11"
				onSelect={onSelect}
				disabled={['2025-06-12', { before: '2025-06-05' }]}
			/>,
		);

		expect(dayButton(JUNE_11_2025)).toHaveAttribute('data-selected-single', 'true');
		expect(dayButton(june(12))).toBeDisabled();
		expect(dayButton(june(4))).toBeDisabled();
		expect(dayButton(june(5))).not.toBeDisabled();

		await user.click(dayButton(june(18)));

		expect(onSelect.mock.calls[0]?.[0]).toBe('2025-06-18');
		expect(onSelect.mock.calls[0]?.[1]).toBe('2025-06-18');
	});
});
