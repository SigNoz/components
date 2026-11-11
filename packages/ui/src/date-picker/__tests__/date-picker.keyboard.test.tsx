import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../index.js';
import {
	at,
	dayButton,
	expectClosed,
	getPopup,
	getTrigger,
	openDatePicker,
	openWithKeyboard,
	readTimeRow,
	timeField,
	typeInTimeField,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

const NOV_11_2026 = new Date(2026, 10, 11);

function renderGrid(props: Partial<ComponentProps<typeof DatePicker>> = {}) {
	return render(
		<DatePicker
			placeholder="Select date"
			aria-label="Expiry"
			defaultValue={NOV_11_2026}
			testId="dp"
			{...props}
		/>,
	);
}

function monthOf(): string {
	return within(getPopup()).getByRole('grid').getAttribute('aria-label') ?? '';
}

describe('DatePicker trigger keys', () => {
	it.each([
		['Enter', '{Enter}'],
		['Space', ' '],
		['ArrowDown', '{ArrowDown}'],
	])('opens the popup on %s and moves the focus to the selected day', async (_name, keys) => {
		renderGrid();
		getTrigger().focus();

		await userEvent.keyboard(keys);

		await screen.findByRole('dialog', { name: 'Choose date' });
		await waitFor(() => {
			expect(dayButton(NOV_11_2026)).toHaveFocus();
		});
		expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
	});

	it.each([
		['Tab', '{Tab}'],
		['a letter', 'a'],
		['Escape', '{Escape}'],
		['ArrowLeft', '{ArrowLeft}'],
	])('does not open the popup on %s', async (_name, keys) => {
		renderGrid();
		getTrigger().focus();

		await userEvent.keyboard(keys);

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('opens on today with the keys when there is no value', async () => {
		renderGrid({ defaultValue: undefined });
		getTrigger().focus();

		await userEvent.keyboard('{Enter}');

		await screen.findByRole('dialog');
		await waitFor(() => {
			expect(getPopup().querySelector('button[data-day][data-today]')).toHaveFocus();
		});
	});

	it('closes the popup on Escape and returns the focus to the trigger', async () => {
		renderGrid();
		await openWithKeyboard();

		await userEvent.keyboard('{Escape}');

		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
	});

	it('opens again with the keys after it closed', async () => {
		renderGrid();
		await openWithKeyboard();
		await userEvent.keyboard('{Escape}');
		await expectClosed();

		await userEvent.keyboard('{Enter}');

		await screen.findByRole('dialog');
		await waitFor(() => {
			expect(dayButton(NOV_11_2026)).toHaveFocus();
		});
	});
});

describe('DatePicker day grid keys', () => {
	it.each([
		['ArrowLeft', '{ArrowLeft}', new Date(2026, 10, 10)],
		['ArrowRight', '{ArrowRight}', new Date(2026, 10, 12)],
		['ArrowUp', '{ArrowUp}', new Date(2026, 10, 4)],
		['ArrowDown', '{ArrowDown}', new Date(2026, 10, 18)],
		['Home', '{Home}', new Date(2026, 10, 8)],
		['End', '{End}', new Date(2026, 10, 14)],
	])('%s moves the focus within the month', async (_name, keys, expected) => {
		renderGrid();
		await openDatePicker();

		await userEvent.keyboard(keys);

		expect(dayButton(expected)).toHaveFocus();
		expect(monthOf()).toBe('November 2026');
	});

	it.each([
		['PageUp', '{PageUp}', new Date(2026, 9, 11), 'October 2026'],
		['PageDown', '{PageDown}', new Date(2026, 11, 11), 'December 2026'],
		['Shift+PageUp', '{Shift>}{PageUp}{/Shift}', new Date(2025, 10, 11), 'November 2025'],
		['Shift+PageDown', '{Shift>}{PageDown}{/Shift}', new Date(2027, 10, 11), 'November 2027'],
	])(
		'%s moves the focus a month or a year, and the grid with it',
		async (_name, keys, expected, month) => {
			renderGrid();
			await openDatePicker();

			await userEvent.keyboard(keys);

			await waitFor(() => {
				expect(dayButton(expected)).toHaveFocus();
			});
			expect(monthOf()).toBe(month);
		},
	);

	it('moves across the end of the month with the arrows', async () => {
		renderGrid({ defaultValue: new Date(2026, 10, 30) });
		await openDatePicker();

		await userEvent.keyboard('{ArrowRight}');

		await waitFor(() => {
			expect(dayButton(new Date(2026, 11, 1))).toHaveFocus();
		});
		expect(monthOf()).toBe('December 2026');

		await userEvent.keyboard('{ArrowLeft}');

		await waitFor(() => {
			expect(dayButton(new Date(2026, 10, 30))).toHaveFocus();
		});
		expect(monthOf()).toBe('November 2026');
	});

	it('keeps one day in the tab order, the focused one', async () => {
		renderGrid();
		await openDatePicker();

		const stops = [...getPopup().querySelectorAll('[data-variant="day"]')].filter(
			(day) => day.getAttribute('tabindex') === '0',
		);

		expect(stops).toHaveLength(1);
		expect(stops[0]).toBe(dayButton(NOV_11_2026));

		await userEvent.keyboard('{ArrowRight}');

		const moved = [...getPopup().querySelectorAll('[data-variant="day"]')].filter(
			(day) => day.getAttribute('tabindex') === '0',
		);

		expect(moved).toEqual([dayButton(new Date(2026, 10, 12))]);
	});

	it('picks the focused day with Enter', async () => {
		const onChange = vi.fn();
		renderGrid({ onChange });
		await openDatePicker();

		await userEvent.keyboard('{ArrowRight}{ArrowDown}{Enter}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 19), { timezone: undefined });
		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		expect(getTrigger()).toHaveTextContent('2026-11-19');
	});

	it('picks the focused day with Space', async () => {
		const onChange = vi.fn();
		renderGrid({ onChange });
		await openDatePicker();

		await userEvent.keyboard('{ArrowLeft}');
		await userEvent.keyboard(' ');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 10), { timezone: undefined });
		await expectClosed();
	});

	it('picks a day of another month after PageDown', async () => {
		const onChange = vi.fn();
		renderGrid({ onChange });
		await openDatePicker();

		await userEvent.keyboard('{PageDown}');
		await waitFor(() => {
			expect(dayButton(new Date(2026, 11, 11))).toHaveFocus();
		});
		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledWith(new Date(2026, 11, 11), { timezone: undefined });
	});

	it('keeps the popup open on Enter with showTime, and moves the draft day', async () => {
		const onChange = vi.fn();
		renderGrid({ showTime: true, onChange });
		await openDatePicker();

		await userEvent.keyboard('{ArrowRight}{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(getPopup()).toBeInTheDocument();
		expect(dayButton(new Date(2026, 10, 12))).toHaveAttribute('data-selected-single');
	});

	describe('at a limit', () => {
		it('takes the focus onto a disabled day instead of getting stuck', async () => {
			renderGrid({ defaultValue: new Date(2026, 10, 6), minDate: new Date(2026, 10, 6) });
			await openDatePicker();

			await userEvent.keyboard('{ArrowLeft}');
			expect(dayButton(new Date(2026, 10, 5))).toHaveFocus();
			expect(dayButton(new Date(2026, 10, 5))).toHaveAttribute('aria-disabled', 'true');

			await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
			expect(dayButton(new Date(2026, 10, 3))).toHaveFocus();

			await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
			expect(dayButton(new Date(2026, 10, 6))).toHaveFocus();
		});

		it('moves back to an allowed day from a disabled one', async () => {
			const onChange = vi.fn();
			renderGrid({
				defaultValue: new Date(2026, 10, 6),
				minDate: new Date(2026, 10, 6),
				onChange,
			});
			await openDatePicker();

			await userEvent.keyboard('{ArrowLeft}{Enter}');
			expect(onChange).not.toHaveBeenCalled();

			await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}');

			expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 7), { timezone: undefined });
		});

		it('keeps the focus in the popup on PageUp at the first month', async () => {
			renderGrid({ defaultValue: new Date(2026, 10, 6), minDate: new Date(2026, 10, 6) });
			await openDatePicker();

			await userEvent.keyboard('{PageUp}');

			expect(getPopup()).toContainElement(document.activeElement as HTMLElement);
			expect(monthOf()).toBe('November 2026');
		});

		it('keeps the focus in the popup on PageDown at the last month', async () => {
			renderGrid({ defaultValue: new Date(2026, 10, 6), maxDate: new Date(2026, 10, 20) });
			await openDatePicker();

			await userEvent.keyboard('{PageDown}');

			expect(getPopup()).toContainElement(document.activeElement as HTMLElement);
			expect(monthOf()).toBe('November 2026');
		});
	});
});

describe('DatePicker time field keys', () => {
	function renderTime(defaultValue = new Date(2026, 10, 6, 9, 30, 15), onChange = vi.fn()) {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={defaultValue}
				onChange={onChange}
				testId="dp"
			/>,
		);

		return onChange;
	}

	it('adds one with ArrowUp and removes one with ArrowDown', async () => {
		renderTime();
		await openDatePicker();

		for (const unit of ['Hours', 'Minutes', 'Seconds'] as const) {
			timeField(unit).focus();
			await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}');
		}

		expect(readTimeRow()).toBe('10:31:16');
	});

	it('does not commit while the fields are edited', async () => {
		const onChange = renderTime();
		await openDatePicker();

		timeField('Hours').focus();
		await userEvent.keyboard('{ArrowUp}');

		expect(onChange).not.toHaveBeenCalled();
		expect(getTrigger()).toHaveTextContent('2026-11-06 09:30:15');
	});

	it.each([
		['Hours', new Date(2026, 10, 6, 23, 30, 15), '{ArrowUp}', '00:30:15'],
		['Hours', new Date(2026, 10, 6, 0, 30, 15), '{ArrowDown}', '23:30:15'],
		['Minutes', new Date(2026, 10, 6, 9, 59, 15), '{ArrowUp}', '09:00:15'],
		['Minutes', new Date(2026, 10, 6, 9, 0, 15), '{ArrowDown}', '09:59:15'],
		['Seconds', new Date(2026, 10, 6, 9, 30, 59), '{ArrowUp}', '09:30:00'],
		['Seconds', new Date(2026, 10, 6, 9, 30, 0), '{ArrowDown}', '09:30:59'],
	] as const)(
		'wraps %s at the ends without touching the other fields',
		async (unit, value, keys, expected) => {
			renderTime(value);
			await openDatePicker();

			timeField(unit).focus();
			await userEvent.keyboard(keys);

			expect(readTimeRow()).toBe(expected);
		},
	);

	it('replaces the value with the digits, and moves to the next field after the second', async () => {
		renderTime();
		await openDatePicker();

		await userEvent.click(timeField('Hours'));
		await userEvent.keyboard('1');

		expect((timeField('Hours') as HTMLInputElement).value).toBe('01');
		expect(timeField('Hours')).toHaveFocus();

		await userEvent.keyboard('4');

		expect((timeField('Hours') as HTMLInputElement).value).toBe('14');
		expect(timeField('Minutes')).toHaveFocus();

		await userEvent.keyboard('07');

		expect((timeField('Minutes') as HTMLInputElement).value).toBe('07');
		expect(timeField('Seconds')).toHaveFocus();

		await userEvent.keyboard('59');

		expect(readTimeRow()).toBe('14:07:59');
		expect(timeField('Seconds')).toHaveFocus();
	});

	it.each([
		['Hours', '99', '23:30:15'],
		['Hours', '25', '23:30:15'],
		['Minutes', '75', '09:59:15'],
		['Seconds', '60', '09:30:59'],
		['Seconds', '99', '09:30:59'],
	] as const)('writes the maximum for %s typed as %s', async (unit, digits, expected) => {
		renderTime();
		await openDatePicker();

		await typeInTimeField(unit, digits);

		expect(readTimeRow()).toBe(expected);
	});

	it('writes the maximum itself and the smallest number as typed', async () => {
		renderTime();
		await openDatePicker();

		await typeInTimeField('Hours', '23');
		await typeInTimeField('Minutes', '00');

		expect(readTimeRow()).toBe('23:00:15');
	});

	it('starts a new number when the focus left the field after the first digit', async () => {
		renderTime();
		await openDatePicker();

		await typeInTimeField('Hours', '1');
		await userEvent.click(timeField('Minutes'));
		await typeInTimeField('Hours', '2');

		expect((timeField('Hours') as HTMLInputElement).value).toBe('02');
		expect(timeField('Hours')).toHaveFocus();
	});

	it('starts a new number after an arrow key', async () => {
		renderTime();
		await openDatePicker();

		await userEvent.click(timeField('Hours'));
		await userEvent.keyboard('1{ArrowUp}2');

		expect((timeField('Hours') as HTMLInputElement).value).toBe('02');
		expect(timeField('Hours')).toHaveFocus();
	});

	it('ignores keys that are not digits or arrows', async () => {
		renderTime();
		await openDatePicker();

		await userEvent.click(timeField('Hours'));
		await userEvent.keyboard('ax{Shift>}b{/Shift}');

		expect(readTimeRow()).toBe('09:30:15');
		expect(timeField('Hours')).toHaveFocus();
	});

	it('selects the text of a field when it takes the focus', async () => {
		renderTime();
		await openDatePicker();

		timeField('Minutes').focus();
		const minutes = timeField('Minutes') as HTMLInputElement;

		expect(minutes.selectionStart).toBe(0);
		expect(minutes.selectionEnd).toBe(2);
	});

	it('applies on Enter, the same as the Apply button', async () => {
		const onChange = renderTime();
		await openDatePicker();
		await userEvent.click(dayButton(new Date(2026, 10, 10)));
		await typeInTimeField('Hours', '17');

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 10, 17, 30, 15), {
			timezone: undefined,
		});
		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		expect(getTrigger()).toHaveTextContent('2026-11-10 17:30:15');
	});

	it('applies on Enter from the minutes and the seconds fields too', async () => {
		const onChange = renderTime();
		await openDatePicker();

		timeField('Seconds').focus();
		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('does not apply on Enter while the draft has no day', async () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				onChange={onChange}
				testId="dp"
			/>,
		);
		await openDatePicker();

		timeField('Hours').focus();
		await userEvent.keyboard('{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(getPopup()).toBeInTheDocument();
	});

	it('closes on Escape from a field, drops the edit and returns the focus to the trigger', async () => {
		const onChange = renderTime();
		await openDatePicker();
		await typeInTimeField('Hours', '17');

		await userEvent.keyboard('{Escape}');

		await expectClosed();
		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
		expect(onChange).not.toHaveBeenCalled();
		expect(getTrigger()).toHaveTextContent('2026-11-06 09:30:15');
	});

	it('takes digits pasted into a field, capped at the maximum', async () => {
		renderTime();
		await openDatePicker();

		await userEvent.click(timeField('Hours'));
		await userEvent.paste('45');

		expect((timeField('Hours') as HTMLInputElement).value).toBe('23');
	});
});

describe('DatePicker tab order', () => {
	async function tabNames(count: number): Promise<string[]> {
		const names: string[] = [];

		for (let index = 0; index < count; index += 1) {
			await userEvent.tab();
			const active = document.activeElement as HTMLElement;

			names.push(
				active.getAttribute('data-day') ??
					active.getAttribute('aria-label') ??
					active.textContent ??
					active.tagName,
			);
		}

		return names;
	}

	it('goes through the arrows, the focused day and the buttons without showTime', async () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_11_2026}
					testId="dp"
				/>
				<button type="button">Outside</button>
			</>,
		);
		await openDatePicker();

		screen.getByTestId('dp-calendar-nav-previous').focus();

		expect(await tabNames(3)).toEqual(['Go to the Next Month', '2026-11-11', 'Outside']);
		await expectClosed();
	});

	it('leaves the focus where Tab took it out of the popup, once the popup closes', async () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 11, 9)}
					testId="dp"
				/>
				<button type="button">Outside</button>
			</>,
		);
		await openDatePicker();
		screen.getByTestId('dp-apply').focus();

		await userEvent.tab();
		await expectClosed();
		await new Promise((resolve) => {
			requestAnimationFrame(resolve);
		});

		expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
	});

	it('goes through the time fields and Apply with showTime', async () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 11, 9)}
					testId="dp"
				/>
				<button type="button">Outside</button>
			</>,
		);
		await openDatePicker();

		screen.getByTestId('dp-calendar-nav-previous').focus();

		expect(await tabNames(7)).toEqual([
			'Go to the Next Month',
			'2026-11-11',
			'Hours',
			'Minutes',
			'Seconds',
			'Apply',
			'Outside',
		]);
		await expectClosed();
	});

	it('puts the time zone field between the seconds and Apply', async () => {
		render(
			<>
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
					defaultValue={at('utc', 2026, 11, 11, 9)}
					testId="dp"
				/>
				<button type="button">Outside</button>
			</>,
		);
		await openDatePicker();

		screen.getByTestId('dp-calendar-nav-previous').focus();

		expect(await tabNames(8)).toEqual([
			'Go to the Next Month',
			'2026-11-11',
			'Hours',
			'Minutes',
			'Seconds',
			'Time zone',
			'Apply',
			'Outside',
		]);
	});

	it('goes back with Shift+Tab, from the time row to the grid and the arrows', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 11, 9)}
				testId="dp"
			/>,
		);
		await openDatePicker();
		timeField('Hours').focus();

		await userEvent.tab({ shift: true });
		expect(dayButton(NOV_11_2026)).toHaveFocus();

		await userEvent.tab({ shift: true });
		expect(screen.getByTestId('dp-calendar-nav-next')).toHaveFocus();

		await userEvent.tab({ shift: true });
		expect(screen.getByTestId('dp-calendar-nav-previous')).toHaveFocus();
	});

	it('moves the focus into the popup on open and back to the trigger on close', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_11_2026}
				testId="dp"
			/>,
		);
		getTrigger().focus();

		await userEvent.keyboard('{Enter}');
		await screen.findByRole('dialog');

		await waitFor(() => {
			expect(getPopup()).toContainElement(document.activeElement as HTMLElement);
		});

		await userEvent.keyboard('{Escape}');
		await expectClosed();

		await waitFor(() => {
			expect(getTrigger()).toHaveFocus();
		});
	});
});
