import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PopupContainer } from '../../lib/popup-container.js';
import { ForceOpenProvider } from '../../testing/index.js';
import {
	at,
	dayButton,
	expectClosed,
	freezeToday,
	getPopup,
	getTrigger,
	openDatePicker,
	pickZone,
	readTimeRow,
	timeField,
	typeInTimeField,
	wallClock,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

type ZonedProps = Partial<ComponentProps<typeof ZonedDatePicker>>;

function renderZoned(props: ZonedProps = {}) {
	return render(
		<ZonedDatePicker
			placeholder="Select date"
			aria-label="Expiry"
			showTime
			showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
			defaultValue={at('kolkata', 2026, 11, 6, 9)}
			testId="dp"
			{...(props as object)}
		/>,
	);
}

function zoneField(): HTMLElement {
	return within(getPopup()).getByRole('combobox', { name: 'Time zone' });
}

describe('DatePicker time zone', () => {
	describe('what shows in the selected zone', () => {
		it('shows the wall clock of the value in the zone of the trigger', () => {
			renderZoned();

			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 Asia/Kolkata');
		});

		it('shows the same instant as another wall clock in another zone', () => {
			const instant = at('kolkata', 2026, 11, 6, 9);
			const { unmount } = renderZoned({
				showTimezone: { options: ZONE_OPTIONS, defaultValue: 'utc' },
				defaultValue: instant,
			});

			expect(getTrigger()).toHaveTextContent('2026-11-06 03:30:00 UTC');
			unmount();

			renderZoned({
				showTimezone: { options: ZONE_OPTIONS, defaultValue: 'honolulu' },
				defaultValue: instant,
			});

			expect(getTrigger()).toHaveTextContent('2026-11-05 17:30:00 Pacific/Honolulu');
		});

		it('opens on the day and the time of the value in the zone', async () => {
			renderZoned({ defaultValue: at('utc', 2026, 11, 6, 22, 15, 40) });
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 7))).toHaveFocus();
			expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('data-selected-single');
			expect(readTimeRow()).toBe('03:45:40');
		});

		it('names the zone in the field, and lists the options by label', async () => {
			renderZoned();
			await openDatePicker();

			expect(zoneField()).toHaveTextContent('Asia/Kolkata');

			await userEvent.click(zoneField());
			const list = await screen.findByRole('listbox');

			expect(
				within(list)
					.getAllByRole('option')
					.map((option) => option.textContent),
			).toEqual(['UTC', 'Asia/Kolkata', 'Pacific/Honolulu']);
			expect(within(list).getByRole('option', { name: 'Asia/Kolkata' })).toHaveAttribute(
				'aria-selected',
				'true',
			);
			expect(within(list).getByRole('option', { name: 'UTC' })).toHaveAttribute(
				'aria-selected',
				'false',
			);
		});

		it('leaves the zone field empty without a zone', async () => {
			renderZoned({ showTimezone: { options: ZONE_OPTIONS }, defaultValue: undefined });
			await openDatePicker();

			expect(zoneField()).toHaveTextContent('Select a time zone');
		});

		// Inside a Dialog the zone field would otherwise pick the Dialog's own popup container, away
		// from the `container` the popup was given.
		it('opens the zone list in the container of the popup, inside a dialog too', async () => {
			const outside = document.createElement('div');
			document.body.append(outside);
			render(
				<PopupContainer>
					<ZonedDatePicker
						placeholder="Select date"
						aria-label="Expiry"
						showTime
						showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'kolkata' }}
						container={outside}
					/>
				</PopupContainer>,
			);
			await openDatePicker();

			await userEvent.click(zoneField());
			const list = await screen.findByRole('listbox');

			expect(outside.contains(list)).toBe(true);
			outside.remove();
		});

		it('filters the zones by label as the user types, and picks with the keys', async () => {
			renderZoned();
			await openDatePicker();
			await userEvent.click(zoneField());
			await screen.findByRole('listbox');

			await userEvent.keyboard('pac');

			const list = screen.getByRole('listbox');

			expect(within(list).getAllByRole('option')).toHaveLength(1);
			expect(within(list).getByRole('option', { name: 'Pacific/Honolulu' })).toBeInTheDocument();

			await userEvent.keyboard('{ArrowDown}{Enter}');

			await waitFor(() => {
				expect(screen.queryByRole('listbox')).toBeNull();
			});
			expect(zoneField()).toHaveTextContent('Pacific/Honolulu');
		});

		it.each([
			['utc', '{ArrowDown}{Enter}', 'Asia/Kolkata'],
			['utc', '{ArrowDown}{ArrowDown}{Enter}', 'Pacific/Honolulu'],
			['kolkata', '{ArrowUp}{Enter}', 'UTC'],
			['honolulu', '{ArrowUp}{ArrowUp}{Enter}', 'UTC'],
		])('starts on the selected zone (%s), and %s picks %s', async (selected, keys, label) => {
			renderZoned({ showTimezone: { options: ZONE_OPTIONS, defaultValue: selected } });
			await openDatePicker();
			await userEvent.click(zoneField());
			await screen.findByRole('listbox');
			// The list highlights the selected zone a moment after it opens. Keys typed before that
			// start from no row, so the case waits for it.
			await waitFor(() => {
				expect(screen.getByRole('option', { selected: true })).toHaveAttribute('data-highlighted');
			});

			await userEvent.keyboard(keys);

			await waitFor(() => {
				expect(screen.queryByRole('listbox')).toBeNull();
			});
			expect(zoneField()).toHaveTextContent(label);
		});
	});

	describe('changing the zone in the popup', () => {
		it('keeps the wall clock of the draft, the day and the time', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();

			await pickZone('UTC');

			expect(zoneField()).toHaveTextContent('UTC');
			expect(readTimeRow()).toBe('09:00:00');
			expect(dayButton(new Date(2026, 10, 6))).toHaveAttribute('data-selected-single');
			expect(onChange).not.toHaveBeenCalled();
			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 Asia/Kolkata');
		});

		it('keeps an edited day and time too', async () => {
			renderZoned();
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 12)));
			await typeInTimeField('Hours', '17');

			await pickZone('Pacific/Honolulu');

			expect(dayButton(new Date(2026, 10, 12))).toHaveAttribute('data-selected-single');
			expect(readTimeRow()).toBe('17:00:00');
		});

		it('commits the wall clock in the new zone with Apply, which is another instant', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();
			await pickZone('UTC');

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(at('utc', 2026, 11, 6, 9), { timezone: 'utc' });
			expect(at('utc', 2026, 11, 6, 9).getTime()).not.toBe(at('kolkata', 2026, 11, 6, 9).getTime());
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 UTC');
		});

		it('commits the picked day and time in the picked zone', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 10)));
			await typeInTimeField('Hours', '21');
			await typeInTimeField('Minutes', '05');
			await pickZone('Pacific/Honolulu');

			await userEvent.click(screen.getByTestId('dp-apply'));

			const [value, details] = onChange.mock.calls[0] as [Date, { timezone: string }];

			expect(details).toEqual({ timezone: 'honolulu' });
			expect(wallClock(value, 'honolulu')).toBe('2026-11-10 21:05:00');
			expect(value).toEqual(at('honolulu', 2026, 11, 10, 21, 5));
		});

		it('commits once with the zone that was already selected, when only the day changed', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 10)));

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(at('kolkata', 2026, 11, 10, 9), {
				timezone: 'kolkata',
			});
		});

		it('commits when the zone is the only thing that changed', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();
			await pickZone('Pacific/Honolulu');

			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(at('honolulu', 2026, 11, 6, 9), {
				timezone: 'honolulu',
			});
		});

		it('applies on Enter in a time field with the new zone too', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();
			await pickZone('UTC');

			timeField('Hours').focus();
			await userEvent.keyboard('{Enter}');

			expect(onChange).toHaveBeenCalledWith(at('utc', 2026, 11, 6, 9), { timezone: 'utc' });
		});

		it('remembers the zone after Apply when the zone is not controlled', async () => {
			renderZoned();
			await openDatePicker();
			await pickZone('UTC');
			await userEvent.click(screen.getByTestId('dp-apply'));
			await expectClosed();

			await openDatePicker();

			expect(zoneField()).toHaveTextContent('UTC');
			expect(readTimeRow()).toBe('09:00:00');
		});

		it('drops the zone picked in the popup on Escape', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange });
			await openDatePicker();
			await pickZone('UTC');

			await userEvent.keyboard('{Escape}');
			await expectClosed();

			expect(onChange).not.toHaveBeenCalled();
			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 Asia/Kolkata');

			await openDatePicker();

			expect(zoneField()).toHaveTextContent('Asia/Kolkata');
		});

		it('reports the committed zone when the value is cleared', async () => {
			const onChange = vi.fn();
			renderZoned({ onChange, allowClear: true });

			await userEvent.click(screen.getByTestId('dp-clear'));

			expect(onChange).toHaveBeenCalledWith(undefined, { timezone: 'kolkata' });
			expect(getTrigger()).toHaveTextContent('Select date');
		});
	});

	describe('without a zone', () => {
		it('disables Apply until a zone is picked, even with a day', async () => {
			const onChange = vi.fn();
			renderZoned({
				showTimezone: { options: ZONE_OPTIONS },
				defaultValue: undefined,
				onChange,
			});
			await openDatePicker();
			await userEvent.click(
				dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)),
			);
			const apply = screen.getByTestId('dp-apply');

			expect(apply).toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(apply);
			timeField('Hours').focus();
			await userEvent.keyboard('{Enter}');

			expect(onChange).not.toHaveBeenCalled();
			expect(getPopup()).toBeInTheDocument();

			await pickZone('UTC');

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'false');
		});

		it('keeps Apply disabled with a zone and no day', async () => {
			renderZoned({
				showTimezone: { options: ZONE_OPTIONS, defaultValue: 'utc' },
				defaultValue: undefined,
			});
			await openDatePicker();

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'true');
		});

		it('disables Apply for a value whose zone is not picked yet', async () => {
			renderZoned({
				showTimezone: { options: ZONE_OPTIONS },
				defaultValue: new Date(2026, 10, 6, 9),
			});
			await openDatePicker();

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'true');
			expect(readTimeRow()).toBe('09:00:00');
		});

		it('commits the day at 00:00:00 in the zone that was picked after it', async () => {
			const onChange = vi.fn();
			renderZoned({
				showTimezone: { options: ZONE_OPTIONS },
				defaultValue: undefined,
				onChange,
			});
			await openDatePicker();
			await userEvent.click(
				dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)),
			);
			await pickZone('Asia/Kolkata');

			await userEvent.click(screen.getByTestId('dp-apply'));

			const year = new Date().getFullYear();
			const month = new Date().getMonth() + 1;

			expect(onChange).toHaveBeenCalledWith(at('kolkata', year, month, 15), {
				timezone: 'kolkata',
			});
		});
	});

	describe('a controlled zone', () => {
		it('starts the zone field at showTimezone.value and reports a pick without changing it', async () => {
			const onChange = vi.fn();
			renderZoned({
				showTimezone: { options: ZONE_OPTIONS, value: 'kolkata' },
				onChange,
			});
			await openDatePicker();

			expect(zoneField()).toHaveTextContent('Asia/Kolkata');

			await pickZone('UTC');
			await userEvent.click(screen.getByTestId('dp-apply'));

			expect(onChange).toHaveBeenCalledWith(at('utc', 2026, 11, 6, 9), { timezone: 'utc' });
			await expectClosed();
			expect(getTrigger()).toHaveTextContent('2026-11-06 14:30:00 Asia/Kolkata');
		});

		it('shows the committed value in the zone the parent gives', async () => {
			const instant = at('kolkata', 2026, 11, 6, 9);
			const { rerender } = renderZoned({
				showTimezone: { options: ZONE_OPTIONS, value: 'kolkata' },
				value: instant,
			});

			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 Asia/Kolkata');

			rerender(
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Expiry"
					showTime
					showTimezone={{ options: ZONE_OPTIONS, value: 'utc' }}
					value={instant}
					testId="dp"
				/>,
			);

			expect(getTrigger()).toHaveTextContent('2026-11-06 03:30:00 UTC');
		});

		it('follows the parent after Apply when it stores both the value and the zone', async () => {
			function Controlled() {
				const [value, setValue] = useState<Date | undefined>(at('kolkata', 2026, 11, 6, 9));
				const [zone, setZone] = useState<string | undefined>('kolkata');

				return (
					<ZonedDatePicker
						placeholder="Select date"
						aria-label="Expiry"
						showTime
						showTimezone={{ options: ZONE_OPTIONS, value: zone }}
						value={value}
						onChange={(next, details) => {
							setValue(next);
							setZone(details.timezone);
						}}
						testId="dp"
					/>
				);
			}
			render(<Controlled />);
			await openDatePicker();
			await pickZone('Pacific/Honolulu');
			await userEvent.click(dayButton(new Date(2026, 10, 9)));

			await userEvent.click(screen.getByTestId('dp-apply'));
			await expectClosed();

			expect(getTrigger()).toHaveTextContent('2026-11-09 09:00:00 Pacific/Honolulu');
		});

		it('stays controlled with an undefined zone, and keeps Apply disabled', async () => {
			const onChange = vi.fn();
			renderZoned({
				showTimezone: { options: ZONE_OPTIONS, value: undefined },
				defaultValue: undefined,
				onChange,
			});
			await openDatePicker();
			await userEvent.click(
				dayButton(new Date(new Date().getFullYear(), new Date().getMonth(), 15)),
			);
			await pickZone('UTC');
			await userEvent.click(screen.getByTestId('dp-apply'));
			await expectClosed();

			expect(onChange).toHaveBeenCalledTimes(1);

			await openDatePicker();

			expect(zoneField()).toHaveTextContent('Select a time zone');
		});
	});

	describe('today and the limits', () => {
		it('marks today in the selected zone', async () => {
			freezeToday(new Date(Date.UTC(2026, 10, 6, 22, 0, 0)));
			renderZoned({ defaultValue: undefined });
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('data-today');
			expect(dayButton(new Date(2026, 10, 7))).toHaveFocus();
			expect(dayButton(new Date(2026, 10, 6))).not.toHaveAttribute('data-today');
		});

		it('moves the today mark to the new zone at once, before Apply', async () => {
			freezeToday(new Date(Date.UTC(2026, 10, 6, 22, 0, 0)));
			renderZoned({ defaultValue: undefined });
			await openDatePicker();

			await pickZone('UTC');

			expect(dayButton(new Date(2026, 10, 6))).toHaveAttribute('data-today');
			expect(dayButton(new Date(2026, 10, 7))).not.toHaveAttribute('data-today');

			await pickZone('Pacific/Honolulu');

			expect(dayButton(new Date(2026, 10, 6))).toHaveAttribute('data-today');
		});

		it('opens on today in the zone with no value, and on a limit when today is outside', async () => {
			freezeToday(new Date(Date.UTC(2026, 10, 6, 22, 0, 0)));
			renderZoned({
				defaultValue: undefined,
				showTimezone: { options: ZONE_OPTIONS, defaultValue: 'honolulu' },
				minDate: at('honolulu', 2026, 11, 20, 8),
			});
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 20))).toHaveFocus();
		});

		it('reads minDate in the selected zone, and moves it with the zone at once', async () => {
			renderZoned({
				minDate: at('utc', 2026, 11, 10, 0),
				defaultValue: at('kolkata', 2026, 11, 12, 9),
			});
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 9))).toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(new Date(2026, 10, 10))).not.toHaveAttribute('aria-disabled', 'true');

			await pickZone('Pacific/Honolulu');

			expect(dayButton(new Date(2026, 10, 9))).not.toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(new Date(2026, 10, 8))).toHaveAttribute('aria-disabled', 'true');
		});

		it('reads maxDate in the selected zone, and moves it with the zone at once', async () => {
			renderZoned({
				maxDate: at('utc', 2026, 11, 20, 22),
				defaultValue: at('kolkata', 2026, 11, 12, 9),
			});
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 20))).not.toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(new Date(2026, 10, 21))).not.toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(new Date(2026, 10, 22))).toHaveAttribute('aria-disabled', 'true');

			await pickZone('Pacific/Honolulu');

			expect(dayButton(new Date(2026, 10, 20))).not.toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(new Date(2026, 10, 21))).toHaveAttribute('aria-disabled', 'true');
		});

		it('does not apply a draft day that a zone change disables', async () => {
			const onChange = vi.fn();
			renderZoned({
				maxDate: at('utc', 2026, 11, 20, 22),
				defaultValue: at('kolkata', 2026, 11, 12, 9),
				onChange,
			});
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 21)));

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'false');

			await pickZone('Pacific/Honolulu');

			expect(screen.getByTestId('dp-apply')).toHaveAttribute('aria-disabled', 'true');

			await userEvent.click(screen.getByTestId('dp-apply'));
			timeField('Hours').focus();
			await userEvent.keyboard('{Enter}');

			expect(onChange).not.toHaveBeenCalled();
			expect(getPopup()).toBeInTheDocument();
		});

		it('calls disabledDate with the start of each day in the selected zone', async () => {
			const disabledDate = vi.fn((_date: Date) => false);
			renderZoned({ disabledDate });
			await openDatePicker();
			const dates = disabledDate.mock.calls.map(([date]) => date);

			expect(dates.map((date) => date.getTime())).toContain(at('kolkata', 2026, 11, 7).getTime());
			expect(dates.every((date) => wallClock(date, 'kolkata').endsWith('00:00:00'))).toBe(true);

			disabledDate.mockClear();
			await pickZone('UTC');
			const moved = disabledDate.mock.calls.map(([date]) => date);

			expect(moved.map((date) => date.getTime())).toContain(at('utc', 2026, 11, 7).getTime());
			expect(wallClock(moved.at(-1) as Date, 'utc').endsWith('00:00:00')).toBe(true);
		});

		it('disables the days disabledDate says in the zone, and moves them with it', async () => {
			// Nov 7 starts at 18:30 UTC on Nov 6, so the same instant is a different day in each zone.
			const firstOfTheSeventh = at('kolkata', 2026, 11, 7).getTime();
			renderZoned({ disabledDate: (date) => date.getTime() === firstOfTheSeventh });
			await openDatePicker();

			expect(dayButton(new Date(2026, 10, 7))).toHaveAttribute('aria-disabled', 'true');
			expect(dayButton(new Date(2026, 10, 8))).not.toHaveAttribute('aria-disabled', 'true');

			await pickZone('UTC');

			expect(dayButton(new Date(2026, 10, 7))).not.toHaveAttribute('aria-disabled', 'true');
		});
	});

	describe('formatValue', () => {
		it('gets the committed zone, and the new one after Apply', async () => {
			const formatValue = vi.fn(
				(value: Date, details: { timezone: string | undefined }) =>
					`${wallClock(value, (details.timezone ?? 'utc') as 'utc')} in ${details.timezone}`,
			);
			renderZoned({ formatValue });

			expect(getTrigger()).toHaveTextContent('2026-11-06 09:00:00 in kolkata');

			await openDatePicker();
			await pickZone('Pacific/Honolulu');
			await userEvent.click(screen.getByTestId('dp-apply'));
			await expectClosed();

			expect(formatValue).toHaveBeenLastCalledWith(at('honolulu', 2026, 11, 6, 9), {
				timezone: 'honolulu',
			});
		});
	});

	describe('Escape in the zone list', () => {
		it('closes the list only, and keeps the popup and the draft', async () => {
			renderZoned();
			await openDatePicker();
			await userEvent.click(dayButton(new Date(2026, 10, 10)));
			await userEvent.click(zoneField());
			await screen.findByRole('listbox');

			await userEvent.keyboard('{Escape}');

			await waitFor(() => {
				expect(screen.queryByRole('listbox')).toBeNull();
			});
			expect(getPopup()).toBeInTheDocument();
			expect(dayButton(new Date(2026, 10, 10))).toHaveAttribute('data-selected-single');
		});

		it('closes the popup on the next Escape', async () => {
			renderZoned();
			await openDatePicker();
			await userEvent.click(zoneField());
			await screen.findByRole('listbox');
			await userEvent.keyboard('{Escape}');
			await waitFor(() => {
				expect(screen.queryByRole('listbox')).toBeNull();
			});

			await userEvent.keyboard('{Escape}');

			await expectClosed();
			await waitFor(() => {
				expect(getTrigger()).toHaveFocus();
			});
		});
	});
});

describe('DatePicker time zone field width', () => {
	it('keeps the popup as wide with a long zone label as with a short one', async () => {
		const longLabel = 'Coordinated Universal Time, the zone every other zone is an offset from';

		render(
			<ForceOpenProvider>
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Short"
					showTime
					showTimezone={{ options: [{ value: 'utc', label: 'UTC' }], defaultValue: 'utc' }}
					defaultValue={at('utc', 2026, 11, 6, 9)}
					testId="short"
				/>
				<ZonedDatePicker
					placeholder="Select date"
					aria-label="Long"
					showTime
					showTimezone={{ options: [{ value: 'utc', label: longLabel }], defaultValue: 'utc' }}
					defaultValue={at('utc', 2026, 11, 6, 9)}
					testId="long"
				/>
			</ForceOpenProvider>,
		);
		await waitFor(() => {
			expect(screen.getByTestId('short-popup')).toBeVisible();
			expect(screen.getByTestId('long-popup')).toBeVisible();
		});

		const shortWidth = screen.getByTestId('short-popup').getBoundingClientRect().width;
		const longWidth = screen.getByTestId('long-popup').getBoundingClientRect().width;

		expect(longWidth).toBe(shortWidth);
	});
});
