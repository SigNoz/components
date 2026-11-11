import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, onTestFinished, vi } from 'vitest';
import { createDatePicker, type DateAdapter } from '../index.js';

// The cases are written in November 2026, and the popup opens on today without a value and names
// today's button "Today, ...". Every case in a file that imports this one starts on a day of that
// month that no case names, so none of them breaks on another day. `freezeToday` moves it.
beforeEach(() => {
	vi.useFakeTimers({ toFake: ['Date'] });
	vi.setSystemTime(new Date(2026, 10, 24, 12));
});
afterEach(() => {
	vi.useRealTimers();
});

/**
 * The `testId` every case passes, so the parts are `dp-popup`, `dp-apply`, `dp-calendar-button-...`.
 */
export const TEST_ID = 'dp';

/**
 * The default accessible name of the trigger in the cases that open it.
 */
export const FIELD_NAME = 'Expiry';

/**
 * Midnight of 6 November 2026, in the browser's zone. A Friday. Every case builds its dates from
 * the local fields, so none of them depends on which zone the browser runs in.
 */
export const NOV_6_2026 = new Date(2026, 10, 6);

/**
 * Makes `new Date()` read `now` for the current test, and nothing else: timers, animation frames and
 * `performance.now()` keep running, so the popup and the user events behave as they do outside it.
 * The date picker reads today when it opens, so call this before opening it.
 */
export function freezeToday(now: Date): void {
	vi.useFakeTimers({ toFake: ['Date'] });
	vi.setSystemTime(now);
	onTestFinished(() => {
		vi.useRealTimers();
	});
}

function padTwo(value: number): string {
	return String(value).padStart(2, '0');
}

/**
 * The part of a day button's `testId` that names the day: `DD-MM-YYYY`, the way Calendar writes it.
 */
export function formatDayId(date: Date): string {
	return `${padTwo(date.getDate())}-${padTwo(date.getMonth() + 1)}-${date.getFullYear()}`;
}

/**
 * The day button of `date` in the open popup. Throws when the grid does not draw it.
 */
export function dayButton(date: Date, testId = TEST_ID): HTMLElement {
	return screen.getByTestId(`${testId}-calendar-button-${formatDayId(date)}`);
}

/**
 * The day button of `date`, or `null` when the grid does not draw it.
 */
export function queryDayButton(date: Date, testId = TEST_ID): HTMLElement | null {
	return screen.queryByTestId(`${testId}-calendar-button-${formatDayId(date)}`);
}

/**
 * The trigger, found the way a user finds it: by its role and its name.
 */
export function getTrigger(name = FIELD_NAME): HTMLElement {
	return screen.getByRole('combobox', { name });
}

/**
 * The popup, found by its `dialog` role. It is portalled to `document.body`, so it is never inside
 * the render container.
 */
export function getPopup(name?: string): HTMLElement {
	return screen.getByRole('dialog', name === undefined ? undefined : { name });
}

/**
 * Waits until the popup is gone from the screen.
 */
export async function expectClosed(): Promise<void> {
	await waitFor(() => {
		expect(screen.queryByRole('dialog')).toBeNull();
	});
}

/**
 * Waits until the focus is inside the popup, which is where the day to start from takes it.
 */
export async function expectFocusInPopup(): Promise<void> {
	await waitFor(() => {
		expect(getPopup()).toContainElement(document.activeElement as HTMLElement | null);
	});
}

/**
 * Opens the popup by clicking the trigger and hands back the dialog, once the focus has moved into
 * it.
 */
export async function openDatePicker(name = FIELD_NAME): Promise<HTMLElement> {
	await userEvent.click(getTrigger(name));
	const dialog = await screen.findByRole('dialog');

	await expectFocusInPopup();

	return dialog;
}

/**
 * Opens the popup with the keyboard: focuses the trigger and presses `ArrowDown`.
 */
export async function openWithKeyboard(name = FIELD_NAME): Promise<HTMLElement> {
	getTrigger(name).focus();
	await userEvent.keyboard('{ArrowDown}');
	const dialog = await screen.findByRole('dialog');

	await expectFocusInPopup();

	return dialog;
}

/**
 * One of the three spin buttons of the time row.
 */
export function timeField(unit: 'Hours' | 'Minutes' | 'Seconds'): HTMLElement {
	return within(getPopup()).getByRole('spinbutton', { name: unit });
}

/**
 * The text of the three spin buttons, as `HH:mm:ss`.
 */
export function readTimeRow(): string {
	return (['Hours', 'Minutes', 'Seconds'] as const)
		.map((unit) => (timeField(unit) as HTMLInputElement).value)
		.join(':');
}

/**
 * Types a number into a time field: focuses it and presses the digits.
 */
export async function typeInTimeField(
	unit: 'Hours' | 'Minutes' | 'Seconds',
	digits: string,
): Promise<void> {
	await userEvent.click(timeField(unit));
	await userEvent.keyboard(digits);
}

export type Stamp = { readonly ms: number };

/**
 * An adapter whose date is not a `Date`: a wrapper that holds the milliseconds. It makes a case
 * fail when the date picker hands a native `Date` to a callback that should get the wrapper, or
 * the other way round.
 */
export const stampAdapter: DateAdapter<Stamp> = {
	toDate: (value) => new Date(value.ms),
	fromDate: (date) => ({ ms: date.getTime() }),
};

export const StampDatePicker = createDatePicker(stampAdapter);

export function stamp(date: Date): Stamp {
	return { ms: date.getTime() };
}

export const ZONE_OFFSETS = {
	utc: 0,
	kolkata: 330,
	honolulu: -600,
} as const;

export type ZoneId = keyof typeof ZONE_OFFSETS;

/**
 * The options of the time zone field. The value is the id the adapter reads and `onChange` reports,
 * the label is what the field and the trigger show.
 */
export const ZONE_OPTIONS = [
	{ value: 'utc', label: 'UTC' },
	{ value: 'kolkata', label: 'Asia/Kolkata' },
	{ value: 'honolulu', label: 'Pacific/Honolulu' },
] as const satisfies ReadonlyArray<{ value: ZoneId; label: string }>;

function offsetOf(timezone: string): number {
	if (!(timezone in ZONE_OFFSETS)) {
		throw new Error(`The offset adapter does not know the zone "${timezone}".`);
	}

	return ZONE_OFFSETS[timezone as ZoneId];
}

/**
 * A date adapter whose zones are fixed offsets from UTC, so a case needs no date library and no
 * daylight saving rules, and reads the same in every browser zone. A `Date` that crosses it holds
 * the wall clock in its local fields.
 *
 * `undefined` is the browser's zone, where the instant and the wall clock are the same `Date`.
 */
export const offsetAdapter: DateAdapter<Date, true> = {
	supportsTimezone: true,
	toDate: (value, timezone) => {
		if (timezone === undefined) {
			return new Date(value.getTime());
		}

		const wall = new Date(value.getTime() + offsetOf(timezone) * 60_000);

		return new Date(
			wall.getUTCFullYear(),
			wall.getUTCMonth(),
			wall.getUTCDate(),
			wall.getUTCHours(),
			wall.getUTCMinutes(),
			wall.getUTCSeconds(),
		);
	},
	fromDate: (date, timezone) => {
		if (timezone === undefined) {
			return new Date(date.getTime());
		}

		const utc = Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
		);

		return new Date(utc - offsetOf(timezone) * 60_000);
	},
};

export const ZonedDatePicker = createDatePicker(offsetAdapter);

/**
 * The instant of a wall clock in a zone: `at('kolkata', 2026, 11, 6, 9)` is 09:00 on 6 November
 * 2026 in `Asia/Kolkata`. The month is 1-based.
 */
export function at(
	timezone: ZoneId,
	year: number,
	month: number,
	day: number,
	hours = 0,
	minutes = 0,
	seconds = 0,
): Date {
	return new Date(
		Date.UTC(year, month - 1, day, hours, minutes, seconds) - ZONE_OFFSETS[timezone] * 60_000,
	);
}

/**
 * The wall clock of an instant in a zone, as `YYYY-MM-DD HH:mm:ss`.
 */
export function wallClock(instant: Date, timezone: ZoneId): string {
	const wall = new Date(instant.getTime() + ZONE_OFFSETS[timezone] * 60_000);

	return `${wall.getUTCFullYear()}-${padTwo(wall.getUTCMonth() + 1)}-${padTwo(wall.getUTCDate())} ${padTwo(wall.getUTCHours())}:${padTwo(wall.getUTCMinutes())}:${padTwo(wall.getUTCSeconds())}`;
}

/**
 * Picks a zone in the open popup: opens the time zone field, clicks the option, and waits until the
 * list is gone.
 */
export async function pickZone(label: string): Promise<void> {
	await userEvent.click(within(getPopup()).getByRole('combobox', { name: 'Time zone' }));
	const list = await screen.findByRole('listbox');

	await userEvent.click(within(list).getByRole('option', { name: label }));
	await waitFor(() => {
		expect(screen.queryByRole('listbox')).toBeNull();
	});
}
