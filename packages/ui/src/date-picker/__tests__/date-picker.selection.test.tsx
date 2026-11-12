import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as pointer } from 'vitest/browser';
import { DatePicker } from '../index.js';
import {
	dayButton,
	expectClosed,
	freezeToday,
	getPopup,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	queryDayButton,
	readTimeRow,
	typeInTimeField,
} from './date-picker.test-utils.js';

const NOV_10_2026 = new Date(2026, 10, 10);

describe('DatePicker selection', () => {
	describe('uncontrolled', () => {
		it('picks a day, reports the start of it and closes', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_10_2026));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(NOV_10_2026, { timezone: undefined });
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('2026-11-10');
		});

		it('returns the focus to the trigger after a pick', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_10_2026));
			await expectClosed();

			await waitFor(() => {
				expect(getTrigger()).toHaveFocus();
			});
		});

		it('starts empty without a defaultValue, and keeps the pick', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);

			expect(getTrigger()).toHaveTextContent('Select date');

			await openDatePicker();
			await userEvent.click(
				dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)),
			);
			await expectClosed();

			expect(getTrigger()).not.toHaveTextContent('Select date');
			expect(getTrigger()).not.toHaveAttribute('data-empty');
		});

		it('drops the time of the value when it picks a day without showTime', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={new Date(2026, 10, 6, 9, 30, 15)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_10_2026));

			expect(onChange.mock.calls[0]?.[0]).toEqual(NOV_10_2026);
		});

		it('picks a day of the next month after the arrow moved the grid', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(screen.getByTestId('dp-calendar-nav-next'));

			expect(within(getPopup()).getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();

			await userEvent.click(dayButton(new Date(2026, 11, 24)));

			expect(onChange).toHaveBeenCalledWith(new Date(2026, 11, 24), { timezone: undefined });
			expect(getTrigger()).toHaveTextContent('2026-12-24');
		});

		it('picks a day of the next month that the grid draws after the current one', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(new Date(2026, 11, 2)));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(new Date(2026, 11, 2), { timezone: undefined });
		});
	});

	describe('controlled', () => {
		it('reports the pick and leaves the value to the parent', async () => {
			const onChange = vi.fn();
			const { rerender } = render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					value={NOV_6_2026}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_10_2026));

			expect(onChange).toHaveBeenCalledWith(NOV_10_2026, { timezone: undefined });
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('2026-11-06');

			rerender(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					value={NOV_10_2026}
					onChange={onChange}
					testId="dp"
				/>,
			);

			expect(getTrigger()).toHaveTextContent('2026-11-10');
		});

		it('stays controlled with a null value, even after a pick', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					nullable
					value={null}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(
				dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)),
			);

			expect(onChange).toHaveBeenCalledTimes(1);
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('Select date');
		});

		it('shows the pick when the parent stores it', async () => {
			function Controlled() {
				const [value, setValue] = useState<Date | undefined>(NOV_6_2026);

				return (
					<DatePicker
						placeholder="Select date"
						aria-label="Expiry"
						value={value}
						onChange={setValue}
						testId="dp"
					/>
				);
			}
			render(<Controlled />);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_10_2026));
			await expectClosed();

			expect(getTrigger()).toHaveTextContent('2026-11-10');
		});

		it('ignores a defaultValue once value is written', () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					value={NOV_10_2026}
					defaultValue={NOV_6_2026}
				/>,
			);

			expect(getTrigger()).toHaveTextContent('2026-11-10');
		});

		it('opens on the month and the day of the value the parent gives', async () => {
			const { rerender } = render(
				<DatePicker placeholder="Select date" aria-label="Expiry" value={NOV_6_2026} testId="dp" />,
			);

			rerender(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					value={new Date(2027, 1, 3)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(within(getPopup()).getByRole('grid', { name: 'February 2027' })).toBeInTheDocument();
			expect(dayButton(new Date(2027, 1, 3))).toHaveFocus();
		});
	});

	describe('the day that is already selected', () => {
		it('closes the popup and calls nothing', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_6_2026));

			await expectClosed();
			expect(onChange).not.toHaveBeenCalled();
			expect(getTrigger()).toHaveTextContent('2026-11-06');
			await waitFor(() => {
				expect(getTrigger()).toHaveFocus();
			});
		});

		it('calls nothing when the value holds a time on that day', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={new Date(2026, 10, 6, 15, 45)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_6_2026));

			await expectClosed();
			expect(onChange).not.toHaveBeenCalled();
		});

		it('keeps the time of the value, which a pick on its own day does not touch', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={new Date(2026, 10, 6, 15, 45)}
					formatValue={(value) => value.toISOString()}
					testId="dp"
				/>,
			);
			const before = getTrigger().textContent;
			await openDatePicker();

			await userEvent.click(dayButton(NOV_6_2026));
			await expectClosed();

			expect(getTrigger().textContent).toBe(before);
		});
	});

	describe('where the popup opens', () => {
		it('opens on the month of the selected day and focuses it', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={new Date(2027, 2, 17)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(within(getPopup()).getByRole('grid', { name: 'March 2027' })).toBeInTheDocument();
			expect(dayButton(new Date(2027, 2, 17))).toHaveFocus();
			expect(dayButton(new Date(2027, 2, 17))).toHaveAttribute('data-selected-single');
		});

		it('opens on today without a value, and focuses it', async () => {
			freezeToday(new Date(2026, 10, 18, 12));
			render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);
			await openDatePicker();

			expect(within(getPopup()).getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
			expect(dayButton(new Date(2026, 10, 18))).toHaveFocus();
			expect(dayButton(new Date(2026, 10, 18))).toHaveAttribute('data-today');
			expect(document.querySelector('[data-selected-single]')).toBeNull();
		});

		it('marks today even when the value is on another day', async () => {
			freezeToday(new Date(2026, 10, 18, 12));
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(dayButton(NOV_6_2026)).toHaveAttribute('data-selected-single');
			expect(dayButton(NOV_6_2026)).not.toHaveAttribute('data-today');
			expect(dayButton(new Date(2026, 10, 18))).toHaveAttribute('data-today');
		});

		it('reads today again each time it opens', async () => {
			freezeToday(new Date(2026, 10, 18, 23, 59));
			render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 18))).toHaveAttribute('data-today');

			await userEvent.keyboard('{Escape}');
			await expectClosed();
			vi.setSystemTime(new Date(2026, 10, 19, 0, 1));
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 19))).toHaveAttribute('data-today');
			expect(dayButton(new Date(2026, 10, 18))).not.toHaveAttribute('data-today');
		});

		it('opens on the nearest limit when today is before minDate', async () => {
			freezeToday(new Date(2026, 10, 18, 12));
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					minDate={new Date(2027, 0, 10)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(within(getPopup()).getByRole('grid', { name: 'January 2027' })).toBeInTheDocument();
			expect(dayButton(new Date(2027, 0, 10))).toHaveFocus();
		});

		it('opens on the nearest limit when today is after maxDate', async () => {
			freezeToday(new Date(2026, 10, 18, 12));
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					maxDate={new Date(2026, 8, 5)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(within(getPopup()).getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
			expect(dayButton(new Date(2026, 8, 5))).toHaveFocus();
		});

		it('opens on the nearest limit when the selected day is outside them', async () => {
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

			expect(within(getPopup()).getByRole('grid', { name: 'February 2027' })).toBeInTheDocument();
			expect(dayButton(new Date(2027, 1, 14))).toHaveFocus();
			expect(queryDayButton(new Date(2028, 4, 20))).toBeNull();
		});

		it('opens on the selected day with the keyboard too', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={new Date(2027, 2, 17)}
					testId="dp"
				/>,
			);
			getTrigger().focus();

			await userEvent.keyboard('{Enter}');
			await screen.findByRole('dialog');

			await waitFor(() => {
				expect(dayButton(new Date(2027, 2, 17))).toHaveFocus();
			});
		});
	});

	describe('with showTime', () => {
		it('moves the draft day on a pick and keeps the popup open', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9, 30)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(dayButton(NOV_10_2026));

			expect(getPopup()).toBeInTheDocument();
			expect(onChange).not.toHaveBeenCalled();
			expect(dayButton(NOV_10_2026)).toHaveAttribute('data-selected-single');
			expect(dayButton(NOV_6_2026)).not.toHaveAttribute('data-selected-single');
			expect(getTrigger()).toHaveTextContent('2026-11-06 09:30:00');
		});

		it('starts the time row at the time of the value', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9, 5, 7)}
				/>,
			);
			await openDatePicker();

			expect(readTimeRow()).toBe('09:05:07');
		});

		it('starts the time row at 00:00:00 without a value', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" showTime />);
			await openDatePicker();

			expect(readTimeRow()).toBe('00:00:00');
		});

		it('commits the day and the time once with Apply, closes and returns the focus', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9, 30)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();
			await userEvent.click(dayButton(NOV_10_2026));
			await typeInTimeField('Hours', '14');
			await userEvent.keyboard('{ArrowUp}');

			expect(onChange).not.toHaveBeenCalled();

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 10, 14, 31, 0), {
				timezone: undefined,
			});
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('2026-11-10 14:31:00');
			await waitFor(() => {
				expect(getTrigger()).toHaveFocus();
			});
		});

		it('commits the time of the value on a new day when only the day changed', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9, 5, 7)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();
			await userEvent.click(dayButton(NOV_10_2026));

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 10, 9, 5, 7), {
				timezone: undefined,
			});
		});

		it('commits the value again when nothing was edited', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9, 30)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 6, 9, 30), {
				timezone: undefined,
			});
		});

		it('leaves the value to the parent when controlled', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					value={new Date(2026, 10, 6, 9, 30)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();
			await userEvent.click(dayButton(NOV_10_2026));

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledTimes(1);
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('2026-11-06 09:30:00');
		});

		it('disables Apply until the draft has a day, and ignores a press on it', async () => {
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
			const apply = screen.getByTestId('dp-apply');

			expect(apply).toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(apply);

			expect(onChange).not.toHaveBeenCalled();
			expect(getPopup()).toBeInTheDocument();

			await userEvent.click(
				dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)),
			);

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'false');
		});

		it('enables Apply from the start when there is a value', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={new Date(2026, 10, 6, 9, 30)}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'false');
		});

		it('does not call onChange for any number of picks before Apply', async () => {
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

			await userEvent.click(dayButton(new Date(2026, 10, 20)));
			await userEvent.click(dayButton(new Date(2026, 10, 21)));

			expect(onChange).not.toHaveBeenCalled();
		});

		describe.each([
			[
				'Escape',
				async () => {
					await userEvent.keyboard('{Escape}');
				},
			],
			[
				'a press outside',
				async () => {
					await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
				},
			],
			[
				'a second press on the trigger',
				async () => {
					await userEvent.click(getTrigger());
				},
			],
			[
				'focus that leaves the popup',
				async () => {
					screen.getByTestId('dp-apply').focus();
					await userEvent.tab();
				},
			],
		])('%s', (_name, dismiss) => {
			it('closes the popup and drops the draft', async () => {
				const onChange = vi.fn();
				render(
					<>
						<DatePicker
							placeholder="Select date"
							aria-label="Expiry"
							showTime
							defaultValue={new Date(2026, 10, 6, 9, 30)}
							onChange={onChange}
							testId="dp"
						/>
						<button type="button">Outside</button>
					</>,
				);
				await openDatePicker();
				await userEvent.click(dayButton(NOV_10_2026));
				await typeInTimeField('Hours', '21');

				await dismiss();

				await expectClosed();
				expect(onChange).not.toHaveBeenCalled();
				expect(getTrigger()).toHaveTextContent('2026-11-06 09:30:00');

				await openDatePicker();

				expect(dayButton(NOV_6_2026)).toHaveAttribute('data-selected-single');
				expect(dayButton(NOV_10_2026)).not.toHaveAttribute('data-selected-single');
				expect(readTimeRow()).toBe('09:30:00');
			});
		});

		it('returns the focus to the trigger when Escape drops the draft', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" showTime testId="dp" />);
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 20)));

			await userEvent.keyboard('{Escape}');
			await expectClosed();

			await waitFor(() => {
				expect(getTrigger()).toHaveFocus();
			});
		});

		it('leaves the focus in the field a press outside the popup went to', async () => {
			render(
				<>
					<input aria-label="Notes" />
					<DatePicker placeholder="Select date" aria-label="Expiry" showTime testId="dp" />
				</>,
			);
			await openDatePicker();
			const notes = screen.getByRole('textbox', { name: 'Notes' });

			await pointer.click(notes);
			await expectClosed();
			await new Promise((resolve) => {
				requestAnimationFrame(resolve);
			});

			expect(notes).toHaveFocus();
		});

		it('keeps Apply disabled after a dropped draft with no value', async () => {
			render(<DatePicker placeholder="Select date" aria-label="Expiry" showTime testId="dp" />);
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 20)));
			await userEvent.keyboard('{Escape}');
			await expectClosed();

			await openDatePicker();

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'true');
		});
	});

	describe('clearing', () => {
		it('shows a clear button while there is a value, and clears with it', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					allowClear
					onChange={onChange}
					testId="dp"
				/>,
			);

			await userEvent.click(screen.getByTestId('dp-clear'));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(undefined, { timezone: undefined });
			expect(getTrigger()).toHaveTextContent('Select date');
			expect(getTrigger()).toHaveAttribute('data-empty');
			expect(screen.queryByTestId('dp-clear')).toBeNull();
		});

		it('moves the focus to the trigger and does not open the popup', async () => {
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					allowClear
					testId="dp"
				/>,
			);

			await userEvent.click(screen.getByTestId('dp-clear'));

			expect(getTrigger()).toHaveFocus();
			expect(screen.queryByRole('dialog')).toBeNull();
		});

		it('leaves the value to the parent when controlled', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					value={NOV_6_2026}
					allowClear
					onChange={onChange}
					testId="dp"
				/>,
			);

			await userEvent.click(screen.getByTestId('dp-clear'));

			expect(onChange).toHaveBeenCalledWith(undefined, { timezone: undefined });
			expect(getTrigger()).toHaveTextContent('2026-11-06');
			expect(screen.getByTestId('dp-clear')).toBeInTheDocument();
		});

		it('clears on Delete and keeps the focus on the trigger', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					allowClear
					onChange={onChange}
					testId="dp"
				/>,
			);
			getTrigger().focus();

			await userEvent.keyboard('{Delete}');

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenLastCalledWith(undefined, { timezone: undefined });
			expect(getTrigger()).toHaveTextContent('Select date');
			expect(getTrigger()).toHaveFocus();
		});

		it('clears on Backspace', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					allowClear
					onChange={onChange}
				/>,
			);
			getTrigger().focus();

			await userEvent.keyboard('{Backspace}');

			expect(onChange).toHaveBeenCalledWith(undefined, { timezone: undefined });
			expect(getTrigger()).toHaveTextContent('Select date');
		});

		it('does nothing on Delete or Backspace without a value', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker placeholder="Select date" aria-label="Expiry" allowClear onChange={onChange} />,
			);
			getTrigger().focus();

			await userEvent.keyboard('{Delete}{Backspace}');

			expect(onChange).not.toHaveBeenCalled();
		});

		it('leaves the value alone on Delete and Backspace without allowClear', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					onChange={onChange}
				/>,
			);
			getTrigger().focus();

			await userEvent.keyboard('{Delete}{Backspace}');

			expect(onChange).not.toHaveBeenCalled();
			expect(getTrigger()).toHaveTextContent('2026-11-06');
		});

		it('opens on today after the value was cleared', async () => {
			freezeToday(new Date(2026, 10, 18, 12));
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={new Date(2027, 5, 3)}
					allowClear
					testId="dp"
				/>,
			);
			await userEvent.click(screen.getByTestId('dp-clear'));

			await openDatePicker();

			expect(within(getPopup()).getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
			expect(dayButton(new Date(2026, 10, 18))).toHaveFocus();
		});
	});

	describe('a year before 100', () => {
		// `new Date(50, 0, 1)` means 1950, so these dates are built with setFullYear.
		function inYear(year: number, ...rest: [number, number, number?, number?, number?]): Date {
			const date = new Date(2000, ...rest);
			date.setFullYear(year);

			return date;
		}

		it('opens on that year and keeps it on a pick', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={inYear(50, 0, 6, 12)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();

			expect(dayButton(inYear(50, 0, 6))).toHaveFocus();

			await userEvent.click(dayButton(inYear(50, 0, 10)));

			expect(onChange).toHaveBeenCalledWith(inYear(50, 0, 10), { timezone: undefined });
		});

		it('keeps that year when Apply commits the day and the time', async () => {
			const onChange = vi.fn();
			render(
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					defaultValue={inYear(50, 0, 6, 9, 30)}
					onChange={onChange}
					testId="dp"
				/>,
			);
			await openDatePicker();
			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledWith(inYear(50, 0, 6, 9, 30), { timezone: undefined });
		});
	});
});
