import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../index.js';
import {
	dayButton,
	expectClosed,
	freezeToday,
	getPopup,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	openWithKeyboard,
	queryDayButton,
	StampDatePicker,
	stamp,
	timeField,
} from './date-picker.test-utils.js';

function isDisabledDay(date: Date): boolean {
	return dayButton(date).getAttribute('aria-disabled') === 'true';
}

function drawnDays(): HTMLElement[] {
	return [...getPopup().querySelectorAll<HTMLElement>('[data-variant="day"]')];
}

function monthOf(): string {
	return within(getPopup()).getByRole('grid').getAttribute('aria-label') ?? '';
}

const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

describe('DatePicker minDate and maxDate', () => {
	it('allows the whole day of minDate, whatever time of the day it holds', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				minDate={new Date(2026, 10, 10, 23, 59, 59)}
				defaultValue={new Date(2026, 10, 12)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(isDisabledDay(new Date(2026, 10, 9))).toBe(true);
		expect(isDisabledDay(new Date(2026, 10, 10))).toBe(false);
		expect(isDisabledDay(new Date(2026, 10, 11))).toBe(false);
	});

	it('allows the whole day of maxDate, whatever time of the day it holds', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				maxDate={new Date(2026, 10, 20, 0, 0, 1)}
				defaultValue={new Date(2026, 10, 12)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(isDisabledDay(new Date(2026, 10, 19))).toBe(false);
		expect(isDisabledDay(new Date(2026, 10, 20))).toBe(false);
		expect(isDisabledDay(new Date(2026, 10, 21))).toBe(true);
	});

	it('marks a day outside the limits aria-disabled and data-disabled, and the others not', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				minDate={new Date(2026, 10, 10)}
				maxDate={new Date(2026, 10, 20)}
				defaultValue={new Date(2026, 10, 12)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		for (const day of [new Date(2026, 10, 9), new Date(2026, 10, 21), new Date(2026, 10, 30)]) {
			expect(dayButton(day)).toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(day)).toHaveAttribute('data-disabled');
		}

		for (const day of [new Date(2026, 10, 10), new Date(2026, 10, 15), new Date(2026, 10, 20)]) {
			expect(dayButton(day)).not.toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(day)).not.toHaveAttribute('data-disabled');
		}
	});

	it('does not pick a day outside the limits, and keeps the popup open', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				minDate={new Date(2026, 10, 10)}
				maxDate={new Date(2026, 10, 20)}
				defaultValue={new Date(2026, 10, 12)}
				onChange={onChange}
				testId="dp"
			/>,
		);
		await openDatePicker();

		await userEvent.click(dayButton(new Date(2026, 10, 9)));
		await userEvent.click(dayButton(new Date(2026, 10, 21)));

		expect(onChange).not.toHaveBeenCalled();
		expect(getPopup()).toBeInTheDocument();
		expect(getTrigger()).toHaveTextContent('2026-11-12');
		expect(dayButton(new Date(2026, 10, 12))).toHaveAttribute('data-selected-single');
	});

	it('picks both of the limit days', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				minDate={new Date(2026, 10, 10)}
				maxDate={new Date(2026, 10, 20)}
				defaultValue={new Date(2026, 10, 12)}
				onChange={onChange}
				testId="dp"
			/>,
		);
		await openDatePicker();

		await userEvent.click(dayButton(new Date(2026, 10, 10)));
		await expectClosed();
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 20)));

		expect(onChange).toHaveBeenNthCalledWith(1, new Date(2026, 10, 10), { timezone: undefined });
		expect(onChange).toHaveBeenNthCalledWith(2, new Date(2026, 10, 20), { timezone: undefined });
	});

	it('does not move the draft to a day outside the limits with showTime', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				minDate={new Date(2026, 10, 10)}
				defaultValue={new Date(2026, 10, 12, 9)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		await userEvent.click(dayButton(new Date(2026, 10, 9)));

		expect(dayButton(new Date(2026, 10, 12))).toHaveAttribute('data-selected-single');
		expect(dayButton(new Date(2026, 10, 9))).not.toHaveAttribute('data-selected-single');
		expect(timeField('Hours')).toHaveValue('09');
	});

	it('shows the not-allowed cursor on a disabled day, and not on an allowed one', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				minDate={new Date(2026, 10, 10)}
				defaultValue={new Date(2026, 10, 12)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(getComputedStyle(dayButton(new Date(2026, 10, 9))).cursor).toBe('not-allowed');
		expect(getComputedStyle(dayButton(new Date(2026, 10, 12))).cursor).not.toBe('not-allowed');
	});

	it('takes the limits in the type of the adapter', async () => {
		render(
			<StampDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				minDate={stamp(new Date(2026, 10, 10, 18))}
				maxDate={stamp(new Date(2026, 10, 20, 2))}
				defaultValue={stamp(new Date(2026, 10, 12))}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(isDisabledDay(new Date(2026, 10, 9))).toBe(true);
		expect(isDisabledDay(new Date(2026, 10, 10))).toBe(false);
		expect(isDisabledDay(new Date(2026, 10, 20))).toBe(false);
		expect(isDisabledDay(new Date(2026, 10, 21))).toBe(true);
	});

	describe('the month arrows', () => {
		it('stop at the month of minDate', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					minDate={new Date(2026, 9, 15)}
					defaultValue={NOV_6_2026}
					testId="dp"
				/>,
			);
			await openDatePicker();
			const previous = screen.getByTestId('dp-calendar-nav-previous');

			expect(previous).not.toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(previous);

			expect(monthOf()).toBe('October 2026');
			expect(previous).toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(previous);

			expect(monthOf()).toBe('October 2026');
		});

		it('stop at the month of maxDate', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					maxDate={new Date(2026, 11, 5)}
					defaultValue={NOV_6_2026}
					testId="dp"
				/>,
			);
			await openDatePicker();
			const next = screen.getByTestId('dp-calendar-nav-next');

			expect(next).not.toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(next);

			expect(monthOf()).toBe('December 2026');
			expect(next).toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(next);

			expect(monthOf()).toBe('December 2026');
		});

		it('are both off when the limits are in the month the popup opens on', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					minDate={new Date(2026, 10, 3)}
					maxDate={new Date(2026, 10, 25)}
					defaultValue={NOV_6_2026}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(screen.getByTestId('dp-calendar-nav-previous')).toHaveAttribute(
				'aria-disabled',
				'true',
			);
			expect(screen.getByTestId('dp-calendar-nav-next')).toHaveAttribute('aria-disabled', 'true');
		});

		it('are free without limits', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(screen.getByTestId('dp-calendar-nav-previous')).not.toHaveAttribute(
				'aria-disabled',
				'true',
			);
			expect(screen.getByTestId('dp-calendar-nav-next')).not.toHaveAttribute(
				'aria-disabled',
				'true',
			);
		});

		it('are not moved by disabledDate, even when it disables every day of a month', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					disabledDate={(date) => date.getMonth() === 11}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(screen.getByTestId('dp-calendar-nav-next'));

			expect(monthOf()).toBe('December 2026');
			expect(
				drawnDays()
					.filter((day) => !day.hasAttribute('data-outside'))
					.every((day) => day.getAttribute('aria-disabled') === 'true'),
			).toBe(true);
			expect(screen.getByTestId('dp-calendar-nav-next')).not.toHaveAttribute(
				'aria-disabled',
				'true',
			);
		});
	});

	describe('a minDate after maxDate', () => {
		it('disables every day', async () => {
			freezeToday(new Date(2026, 10, 18, 12));
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					minDate={new Date(2026, 10, 20)}
					maxDate={new Date(2026, 10, 10)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(drawnDays().length).toBeGreaterThan(28);
			expect(drawnDays().every((day) => day.getAttribute('aria-disabled') === 'true')).toBe(true);

			await userEvent.click(dayButton(new Date(2026, 10, 15)));
			await userEvent.click(dayButton(new Date(2026, 10, 20)));
			await userEvent.click(dayButton(new Date(2026, 10, 10)));

			expect(onChange).not.toHaveBeenCalled();
			expect(getPopup()).toBeInTheDocument();
		});

		it('never calls disabledDate, since no day is inside the limits', async () => {
			const disabledDate = vi.fn((_date: Date) => false);
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					minDate={new Date(2026, 10, 20)}
					maxDate={new Date(2026, 10, 10)}
					disabledDate={disabledDate}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(disabledDate).not.toHaveBeenCalled();
		});

		it('still opens and closes the popup', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					minDate={new Date(2026, 10, 20)}
					maxDate={new Date(2026, 10, 10)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.keyboard('{Escape}');

			await expectClosed();
			await waitFor(() => {
				expect(getTrigger()).toHaveFocus();
			});
		});
	});
});

describe('DatePicker disabledDate', () => {
	it('is called with the start of each day the calendar draws', async () => {
		const disabledDate = vi.fn((_date: Date) => false);
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				disabledDate={disabledDate}
				testId="dp"
			/>,
		);
		await openDatePicker();
		const days = disabledDate.mock.calls.map(([date]) => date as Date);

		expect(days.length).toBeGreaterThan(28);
		expect(days.every((date) => date instanceof Date)).toBe(true);
		expect(
			days.every(
				(date) =>
					date.getHours() === 0 &&
					date.getMinutes() === 0 &&
					date.getSeconds() === 0 &&
					date.getMilliseconds() === 0,
			),
		).toBe(true);

		const drawn = new Set(days.map((date) => date.getTime()));

		for (let day = 1; day <= 30; day += 1) {
			expect(drawn.has(new Date(2026, 10, day).getTime())).toBe(true);
		}
	});

	it('is called with the type of the adapter, for the start of each day', async () => {
		const disabledDate = vi.fn((_date: { readonly ms: number }) => false);
		render(
			<StampDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={stamp(NOV_6_2026)}
				disabledDate={disabledDate}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(disabledDate).toHaveBeenCalledWith({ ms: new Date(2026, 10, 7).getTime() });
		expect(disabledDate.mock.calls.every(([date]) => !(date instanceof Date))).toBe(true);
	});

	it('is called only for the days inside the limits', async () => {
		const disabledDate = vi.fn((_date: Date) => false);
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={new Date(2026, 10, 12)}
				minDate={new Date(2026, 10, 10)}
				maxDate={new Date(2026, 10, 20)}
				disabledDate={disabledDate}
				testId="dp"
			/>,
		);
		await openDatePicker();
		const days = new Set(disabledDate.mock.calls.map(([date]) => (date as Date).getTime()));

		expect(days.size).toBe(11);
		expect(days.has(new Date(2026, 10, 10).getTime())).toBe(true);
		expect(days.has(new Date(2026, 10, 20).getTime())).toBe(true);
		expect(days.has(new Date(2026, 10, 9).getTime())).toBe(false);
		expect(days.has(new Date(2026, 10, 21).getTime())).toBe(false);
	});

	it('disables the days it returns true for', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				disabledDate={isWeekend}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(isDisabledDay(new Date(2026, 10, 7))).toBe(true);
		expect(isDisabledDay(new Date(2026, 10, 8))).toBe(true);
		expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('data-disabled');
		expect(isDisabledDay(new Date(2026, 10, 9))).toBe(false);
		expect(isDisabledDay(new Date(2026, 10, 13))).toBe(false);
	});

	it('does not pick a day it disables, and picks the others', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				disabledDate={isWeekend}
				onChange={onChange}
				testId="dp"
			/>,
		);
		await openDatePicker();

		await userEvent.click(dayButton(new Date(2026, 10, 7)));

		expect(onChange).not.toHaveBeenCalled();
		expect(getPopup()).toBeInTheDocument();

		await userEvent.click(dayButton(new Date(2026, 10, 9)));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 9), { timezone: undefined });
	});

	it('keeps a day it disables focusable, and does not pick it with the keys', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				disabledDate={isWeekend}
				onChange={onChange}
				testId="dp"
			/>,
		);
		await openWithKeyboard();

		await userEvent.keyboard('{ArrowRight}');

		expect(dayButton(new Date(2026, 10, 7))).toHaveFocus();
		expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('aria-disabled', 'true');

		await userEvent.keyboard('{Enter}');
		await userEvent.keyboard(' ');

		expect(onChange).not.toHaveBeenCalled();
		expect(getPopup()).toBeInTheDocument();
	});

	it('opens on a day it disables, focused', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={new Date(2026, 10, 7)}
				disabledDate={isWeekend}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(dayButton(new Date(2026, 10, 7))).toHaveFocus();
	});

	it('reads a changed function on the next render', async () => {
		const { rerender } = render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				disabledDate={() => false}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(isDisabledDay(new Date(2026, 10, 9))).toBe(false);

		rerender(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				disabledDate={(date) => date.getDate() === 9}
				testId="dp"
			/>,
		);

		expect(isDisabledDay(new Date(2026, 10, 9))).toBe(true);
		expect(isDisabledDay(new Date(2026, 10, 10))).toBe(false);
	});

	it('combines with the limits: a day is disabled when either says so', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={new Date(2026, 10, 12)}
				minDate={new Date(2026, 10, 10)}
				disabledDate={(date) => date.getDate() === 12 || date.getDate() === 3}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(isDisabledDay(new Date(2026, 10, 3))).toBe(true);
		expect(isDisabledDay(new Date(2026, 10, 12))).toBe(true);
		expect(isDisabledDay(new Date(2026, 10, 11))).toBe(false);
	});
});

describe('DatePicker value outside what it allows', () => {
	it('shows a value before minDate as it is, and its day selected and disabled', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				value={new Date(2026, 10, 6)}
				minDate={new Date(2026, 10, 10)}
				onChange={onChange}
				testId="dp"
			/>,
		);

		expect(getTrigger()).toHaveTextContent('2026-11-06');

		await openDatePicker();

		expect(dayButton(NOV_6_2026)).toHaveAttribute('data-selected-single');
		expect(dayButton(NOV_6_2026)).toHaveAttribute('aria-disabled', 'true');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('shows a value after maxDate as it is, and does not correct it', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={new Date(2026, 10, 25)}
				maxDate={new Date(2026, 10, 20)}
				onChange={onChange}
				testId="dp"
			/>,
		);

		expect(getTrigger()).toHaveTextContent('2026-11-25');

		await openDatePicker();
		await userEvent.keyboard('{Escape}');
		await expectClosed();

		expect(onChange).not.toHaveBeenCalled();
		expect(getTrigger()).toHaveTextContent('2026-11-25');
	});

	it('shows a value on a day disabledDate disables as it is, selected and disabled', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				value={new Date(2026, 10, 7)}
				disabledDate={isWeekend}
				onChange={onChange}
				testId="dp"
			/>,
		);

		expect(getTrigger()).toHaveTextContent('2026-11-07');

		await openDatePicker();

		expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('data-selected-single');
		expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('aria-disabled', 'true');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('does not draw a value beyond the month of maxDate', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				value={new Date(2028, 4, 20)}
				maxDate={new Date(2027, 1, 14)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		expect(getTrigger()).toHaveTextContent('2028-05-20');
		expect(queryDayButton(new Date(2028, 4, 20))).toBeNull();
		expect(document.querySelector('[data-selected-single]')).toBeNull();
	});
});
