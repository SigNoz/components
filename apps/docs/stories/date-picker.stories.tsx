import {
	Button,
	createDatePicker,
	DatePicker,
	type DateAdapter,
	type DatePickerProps,
	Dialog,
	Typography,
} from '@signozhq/ui';
import { ForceOpenProvider } from '@signozhq/ui/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	Fragment,
	type ReactElement,
	type ReactNode,
	type RefAttributes,
	useEffect,
	useState,
} from 'react';
import { expect, fireEvent, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './date-picker.stories.module.css';
import { datePickerArgTypes } from './shared/date-picker-arg-types.js';
import { waitForEffects } from './shared/play.js';

// The stories write the date picker without `nullable`, so their args take the props it has then.
type PlainDatePicker = (
	props: Extract<DatePickerProps, { nullable?: never }> & RefAttributes<HTMLButtonElement>,
) => ReactElement;

const meta: Meta<PlainDatePicker> = {
	title: 'Composed Components/DatePicker',
	component: DatePicker as PlainDatePicker,
	argTypes: datePickerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<PlainDatePicker>;

/**
 * The playground the Controls table drives.
 */
export const Default: Story = {
	args: {
		placeholder: 'Select date',
		'aria-label': 'Expires on',
		disabledTooltip: 'Ask an admin to change the date',
		readOnlyTooltip: 'The date is set by your admin',
		onChange: fn(),
	},
	parameters: {
		// Playground: the states of the trigger and the popup are in the showcases, which snapshot
		// them.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className={styles.playground}>
			<DatePicker {...args} />
		</div>
	),
};

// Every story picks in September 2026, a month that is over: the popup marks today, so a month
// that holds today would change the snapshot every day.
const YEAR = 2026;
const MONTH_INDEX = 8;
const MONTH_NUMBER = MONTH_INDEX + 1;

function day(date: number, hours = 0, minutes = 0, seconds = 0): Date {
	return new Date(YEAR, MONTH_INDEX, date, hours, minutes, seconds);
}

/**
 * A day of August 2026, the month before, for the one popup that needs six rows. It is over too.
 */
function augustDay(date: number): Date {
	return new Date(YEAR, MONTH_INDEX - 1, date);
}

function pad(value: number): string {
	return String(value).padStart(2, '0');
}

function isWeekend(date: Date): boolean {
	return date.getDay() === 0 || date.getDay() === 6;
}

const ZONE_OFFSET_MINUTES: Record<string, number> = {
	UTC: 0,
	'Asia/Kolkata': 330,
	'Pacific/Honolulu': -600,
};

/**
 * The three zones have no daylight saving, so a fixed offset is exact for them. An app with a date
 * library does the same math with it, see the `Date adapter` section of the docs.
 */
const fixedOffsetAdapter: DateAdapter<Date, true> = {
	supportsTimezone: true,
	toDate: (value, timezone) => {
		if (timezone === undefined) {
			return new Date(value.getTime());
		}

		const wall = new Date(value.getTime() + (ZONE_OFFSET_MINUTES[timezone] ?? 0) * 60000);

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

		const wallAsUtc = Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
		);

		return new Date(wallAsUtc - (ZONE_OFFSET_MINUTES[timezone] ?? 0) * 60000);
	},
};

const ZonedDatePicker = createDatePicker(fixedOffsetAdapter);

const ZONES = [
	{ value: 'UTC', label: 'UTC' },
	{ value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
	{ value: 'Pacific/Honolulu', label: 'Pacific/Honolulu' },
];

const LONG_ZONES = [
	{ value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
	{ value: 'Asia/Kolkata', label: 'India Standard Time (Asia/Kolkata, UTC+05:30)' },
	{
		value: 'Pacific/Honolulu',
		label: 'Hawaii-Aleutian Standard Time (Pacific/Honolulu, UTC-10:00)',
	},
];

/**
 * 04:00 UTC is 09:30 in `Asia/Kolkata`, whatever zone the browser runs in.
 */
const ZONED_VALUE = new Date(Date.UTC(YEAR, MONTH_INDEX, 14, 4, 0, 0));

/**
 * A date type that is not a `Date`: a `YYYY-MM-DD` string, the shape an API sends a day in.
 */
const isoDayAdapter: DateAdapter<string> = {
	toDate: (value) => {
		const [year, month, date] = value.split('-').map(Number);

		return new Date(year ?? Number.NaN, (month ?? Number.NaN) - 1, date);
	},
	fromDate: (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
};

const IsoDayDatePicker = createDatePicker(isoDayAdapter);

function dayTestId(testId: string, date: number, monthNumber = MONTH_NUMBER): string {
	return `${testId}-calendar-button-${pad(date)}-${pad(monthNumber)}-${YEAR}`;
}

function getNode(testId: string): HTMLElement {
	// The popup portals to `document.body`, so most of it is outside the canvas element.
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);

	if (node === null) {
		throw new Error(`DatePicker story: no node named "${testId}".`);
	}

	return node;
}

function getDay(testId: string, date: number, monthNumber = MONTH_NUMBER): HTMLElement {
	return getNode(dayTestId(testId, date, monthNumber));
}

async function waitForPopup(testId: string): Promise<HTMLElement> {
	await waitFor(() => expect(getNode(`${testId}-popup`)).toBeVisible());

	return getNode(`${testId}-popup`);
}

async function waitForNoPopup(testId: string): Promise<void> {
	await waitFor(() => expect(document.querySelector(`[data-testid="${testId}-popup"]`)).toBeNull());
}

async function openPopup(testId: string): Promise<HTMLElement> {
	await userEvent.click(getNode(testId));

	return waitForPopup(testId);
}

async function pickDay(testId: string, date: number): Promise<void> {
	await openPopup(testId);
	await waitFor(() => expect(getDay(testId, date)).toBeVisible());
	await userEvent.click(getDay(testId, date));
	await waitForNoPopup(testId);
}

/**
 * Picks the given day of the month the popup opened on, and returns it as `YYYY-MM-DD`. An empty
 * date picker opens on today, so a story that starts from nothing reads the day it picked from
 * the grid, rather than assuming a month.
 */
async function pickDayOfOpenedMonth(testId: string, dayOfMonth: number): Promise<string> {
	const popup = await openPopup(testId);
	const button = await waitFor(() => {
		const found = popup.querySelector<HTMLElement>(
			`[data-slot="calendar-button"][data-day$="-${pad(dayOfMonth)}"]:not([data-outside])`,
		);

		if (found === null) {
			throw new Error(`DatePicker story: no day ${dayOfMonth} in the opened month.`);
		}

		return found;
	});
	const isoDay = button.dataset.day ?? '';

	await userEvent.click(button);

	return isoDay;
}

/**
 * Puts the pointer on `element` without ever taking it off, so what opens on hover stays open.
 */
function restPointerOn(element: HTMLElement): void {
	fireEvent.pointerEnter(element);
	fireEvent.mouseEnter(element);
	fireEvent.mouseMove(element);
}

// A tooltip opens a hover delay after the pointer arrives, so it gets longer than the default
// second under the load of a CI run.
async function waitForTooltip(trigger: HTMLElement): Promise<HTMLElement> {
	return waitFor(
		() => {
			const tooltip = document.getElementById(trigger.getAttribute('aria-describedby') ?? '');

			if (tooltip === null) {
				throw new Error('DatePicker story: the tooltip of the trigger is not open.');
			}

			return tooltip;
		},
		{ timeout: 5000 },
	);
}

/**
 * Forced by `storybook-addon-pseudo-states`, for the states a snapshot cannot reach.
 */
type TriggerPseudo = 'hover' | 'focus' | 'hover-clear';

type TriggerRow = {
	id: string;
	label: string;
	note: ReactNode;
	render: (id: string, label: string) => ReactElement;
	pseudo?: TriggerPseudo;
};

type TriggerGroup = {
	title: string;
	rows: TriggerRow[];
};

/**
 * Closed triggers, one per thing the trigger can show.
 */
const TRIGGER_GROUPS: TriggerGroup[] = [
	{
		title: 'Content',
		rows: [
			{
				id: 'trigger-placeholder',
				label: 'placeholder',
				note: (
					<>
						No value, so the trigger shows <code>placeholder</code>.
					</>
				),
				render: (id, label) => (
					<DatePicker aria-label={label} placeholder="Select date" testId={id} />
				),
			},
			{
				id: 'trigger-long-placeholder',
				label: 'long placeholder',
				note: 'The placeholder ends in an ellipsis too, and keeps its own colour.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select the day the key expires"
						width={180}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-value',
				label: 'value',
				note: (
					<>
						The default text is <code>YYYY-MM-DD</code>.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-show-time',
				label: 'showTime',
				note: (
					<>
						With <code>showTime</code> the text adds the time of day.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date and time"
						showTime
						defaultValue={day(14, 9, 30)}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-timezone',
				label: 'showTimezone',
				note: (
					<>
						With <code>showTimezone</code> the text ends with the label of the selected zone.
					</>
				),
				render: (id, label) => (
					<ZonedDatePicker
						aria-label={label}
						placeholder="Select date and time"
						showTime
						showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
						defaultValue={ZONED_VALUE}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-format-value',
				label: 'formatValue',
				note: (
					<>
						<code>formatValue</code> writes the text, and the accessible value with it.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						formatValue={(value) =>
							value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
						}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-empty-label',
				label: 'empty formatValue',
				note: (
					<>
						A <code>formatValue</code> that returns an empty string shows{' '}
						<code>&lt;No label&gt;</code>.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						formatValue={() => ''}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-truncated',
				label: 'long value',
				note: 'The text ends in an ellipsis, and the full text shows in a tooltip on hover.',
				render: (id, label) => (
					<ZonedDatePicker
						aria-label={label}
						placeholder="Select date and time"
						showTime
						showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
						defaultValue={ZONED_VALUE}
						width={180}
						testId={id}
					/>
				),
			},
		],
	},
	{
		title: 'Size',
		rows: [
			{
				id: 'trigger-width',
				label: 'width',
				note: (
					<>
						<code>width</code> sets the width, and a number is read as pixels. Here 128px.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						width={128}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-max-width',
				label: 'maxWidth',
				note: (
					<>
						<code>maxWidth</code> stops the trigger short of its parent. Here 12rem in a 16rem
						column.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						maxWidth="12rem"
						testId={id}
					/>
				),
			},
		],
	},
	{
		title: 'Pointer and focus',
		rows: [
			{
				id: 'trigger-hover',
				label: 'hovered',
				note: 'The border darkens under the pointer.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						testId={id}
					/>
				),
				pseudo: 'hover',
			},
			{
				id: 'trigger-focus',
				label: 'focus-visible',
				note: 'The keyboard focus ring.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						testId={id}
					/>
				),
				pseudo: 'focus',
			},
			{
				id: 'trigger-allow-clear',
				label: 'allowClear',
				note: 'The clear button shows while there is a value, and the value gives it room.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						allowClear
						defaultValue={day(14)}
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-clear-hover',
				label: 'clear hovered',
				note: 'The clear button takes the colour of the icon on hover, and the border darkens with it.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						allowClear
						defaultValue={day(14)}
						testId={id}
					/>
				),
				pseudo: 'hover-clear',
			},
		],
	},
	{
		title: 'Invalid, disabled and read-only',
		rows: [
			{
				id: 'trigger-invalid',
				label: 'aria-invalid',
				note: 'The border turns destructive.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						aria-invalid
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-invalid-hover',
				label: 'aria-invalid hovered',
				note: 'It stays destructive under the pointer.',
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						aria-invalid
						testId={id}
					/>
				),
				pseudo: 'hover',
			},
			{
				id: 'trigger-disabled',
				label: 'disabled',
				note: (
					<>
						Fades, never opens, and hides the clear button even with <code>allowClear</code>. The
						trigger keeps the focus and shows <code>disabledTooltip</code> on hover.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						allowClear
						disabled
						disabledTooltip="Ask an admin to change the date"
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-read-only',
				label: 'readOnly',
				note: (
					<>
						Keeps its colours, fades a little, hides its icon and the clear button, never opens, and
						shows <code>readOnlyTooltip</code> on hover.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						allowClear
						readOnly
						readOnlyTooltip="The date is set by your admin"
						testId={id}
					/>
				),
			},
			{
				id: 'trigger-disabled-read-only',
				label: 'disabled and readOnly',
				note: (
					<>
						<code>readOnly</code> outranks <code>disabled</code>, so it looks read-only and shows
						only <code>readOnlyTooltip</code>.
					</>
				),
				render: (id, label) => (
					<DatePicker
						aria-label={label}
						placeholder="Select date"
						defaultValue={day(14)}
						disabled
						disabledTooltip="Ask an admin to change the date"
						readOnly
						readOnlyTooltip="The date is set by your admin"
						testId={id}
					/>
				),
			},
		],
	},
];

type PopupCell = {
	id: string;
	title: string;
	note: ReactNode;
	render: (id: string, title: string) => ReactElement;
	/**
	 * A popup with a time row is taller than one without, so its cell is too.
	 */
	tall?: boolean;
	/**
	 * The month the popup opens on, when it is not September.
	 */
	monthNumber?: number;
	/**
	 * The days the story asserts on, as they must read.
	 */
	enabledDays?: number[];
	disabledDays?: number[];
	selectedDay?: number;
	/**
	 * What the story asserts on the popup beyond its days.
	 */
	check?: (id: string) => Promise<void>;
};

type PopupGroup = {
	title: string;
	note: ReactNode;
	cells: PopupCell[];
};

// A date picker with no value opens on today, moved to the nearest limit. These limits are the
// whole of September 2026, so a popup with no value still opens on that month on the day it runs.
const SEPTEMBER_LIMITS = { minDate: day(1), maxDate: day(30) };

async function expectDayCount(testId: string, count: number): Promise<void> {
	await expect(
		getNode(`${testId}-popup`).querySelectorAll('[data-slot="calendar-button"][data-day]'),
	).toHaveLength(count);
}

/**
 * The popups the showcase holds open with `ForceOpenProvider`.
 */
const POPUP_GROUPS: PopupGroup[] = [
	{
		title: 'Date',
		note: 'One month of the calendar, always six rows tall, so the popup keeps its height from one month to the next.',
		cells: [
			{
				id: 'popup-date',
				title: 'Date',
				note: 'September 2026 needs five rows and gets a sixth. A pick commits and closes the popup.',
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date"
						defaultValue={day(14)}
						testId={id}
					/>
				),
				selectedDay: 14,
				check: (id) => expectDayCount(id, 42),
			},
			{
				id: 'popup-six-weeks',
				title: 'Six weeks',
				note: 'August 2026 needs six rows, the height of the popup next to it.',
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date"
						defaultValue={augustDay(14)}
						testId={id}
					/>
				),
				monthNumber: 8,
				selectedDay: 14,
				check: (id) => expectDayCount(id, 42),
			},
		],
	},
	{
		title: 'Date and time',
		note: (
			<>
				<code>showTime</code> adds the time row and <code>Apply</code>, which commits the day and
				the time together. <code>showTimezone</code> adds the zone field.
			</>
		),
		cells: [
			{
				id: 'popup-time',
				title: 'Date and time',
				note: 'The time row starts at the time of the value.',
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date and time"
						showTime
						defaultValue={day(14, 9, 30)}
						testId={id}
					/>
				),
				tall: true,
				selectedDay: 14,
				check: async (id) => {
					await expect(getNode(`${id}-time-hours`)).toHaveValue('09');
					await expect(getNode(`${id}-time-minutes`)).toHaveValue('30');
					await expect(getNode(`${id}-apply`)).not.toHaveAttribute('aria-disabled', 'true');
				},
			},
			{
				id: 'popup-time-empty',
				title: 'No value',
				note: (
					<>
						No day is selected, the row reads <code>00:00:00</code> and <code>Apply</code> waits for
						a day.
					</>
				),
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date and time"
						showTime
						{...SEPTEMBER_LIMITS}
						testId={id}
					/>
				),
				tall: true,
				check: async (id) => {
					await expect(getNode(`${id}-popup`).querySelector('[data-selected-single]')).toBeNull();
					await expect(getNode(`${id}-time-hours`)).toHaveValue('00');
					await expect(getNode(`${id}-time-minutes`)).toHaveValue('00');
					await expect(getNode(`${id}-time-seconds`)).toHaveValue('00');
					await expect(getNode(`${id}-apply`)).toHaveAttribute('aria-disabled', 'true');
				},
			},
			{
				id: 'popup-timezone',
				title: 'Date, time and zone',
				note: 'The zone field shows the label of the selected zone.',
				render: (id, title) => (
					<ZonedDatePicker
						aria-label={title}
						placeholder="Select date and time"
						showTime
						showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
						defaultValue={ZONED_VALUE}
						testId={id}
					/>
				),
				tall: true,
				selectedDay: 14,
				check: async (id) => {
					await expect(getNode(`${id}-time-hours`)).toHaveValue('09');
					await expect(getNode(id)).toHaveTextContent('2026-09-14 09:30:00 Asia/Kolkata');
					await expect(getNode(`${id}-timezone`)).toHaveTextContent('Asia/Kolkata');
				},
			},
			{
				id: 'popup-timezone-unset',
				title: 'No zone picked',
				note: (
					<>
						The zone field shows its placeholder and <code>Apply</code> waits for a zone, even with
						a day.
					</>
				),
				render: (id, title) => (
					<ZonedDatePicker
						aria-label={title}
						placeholder="Select date and time"
						showTime
						showTimezone={{ options: ZONES }}
						defaultValue={day(14, 9, 30)}
						testId={id}
					/>
				),
				tall: true,
				check: async (id) => {
					await expect(getNode(id)).toHaveTextContent('2026-09-14 09:30:00');
					await expect(getNode(`${id}-timezone`)).toHaveTextContent('Select a time zone');
					await expect(getNode(`${id}-apply`)).toHaveAttribute('aria-disabled', 'true');
				},
			},
			{
				id: 'popup-timezone-long',
				title: 'Long zone label',
				note: 'A zone label longer than the calendar is wide ends in an ellipsis, and the popup keeps its width.',
				render: (id, title) => (
					<ZonedDatePicker
						aria-label={title}
						placeholder="Select date and time"
						showTime
						showTimezone={{ options: LONG_ZONES, defaultValue: 'Pacific/Honolulu' }}
						defaultValue={ZONED_VALUE}
						testId={id}
					/>
				),
				tall: true,
				check: async (id) => {
					await expect(getNode(`${id}-timezone`)).toHaveTextContent(
						'Hawaii-Aleutian Standard Time (Pacific/Honolulu, UTC-10:00)',
					);
				},
			},
		],
	},
	{
		title: 'Limits',
		note: 'A disabled day keeps its place in the grid, and the month arrows stop at the month of each limit.',
		cells: [
			{
				id: 'popup-limits',
				title: 'minDate and maxDate',
				note: 'The days outside the limits are disabled, and both arrows stop in the month of the limits.',
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date"
						defaultValue={day(16)}
						minDate={day(8)}
						maxDate={day(25)}
						testId={id}
					/>
				),
				enabledDays: [8, 16, 25],
				disabledDays: [7, 26],
				selectedDay: 16,
			},
			{
				id: 'popup-disabled-date',
				title: 'disabledDate',
				note: (
					<>
						<code>disabledDate</code> disables single days between the limits, here the weekends.
					</>
				),
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date"
						defaultValue={day(16)}
						disabledDate={isWeekend}
						testId={id}
					/>
				),
				enabledDays: [11, 14, 16],
				disabledDays: [12, 13, 19, 20],
				selectedDay: 16,
			},
			{
				id: 'popup-outside',
				title: 'Value outside the limits',
				note: 'The value is shown as it is, selected and disabled. The popup opens on the nearest limit.',
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date"
						defaultValue={day(5)}
						minDate={day(10)}
						maxDate={day(25)}
						testId={id}
					/>
				),
				enabledDays: [10, 25],
				disabledDays: [5, 26],
				selectedDay: 5,
				check: async (id) => {
					await expect(getDay(id, 5)).toHaveAttribute('data-selected-single', 'true');
					await expect(getDay(id, 5)).toHaveAttribute('aria-disabled', 'true');
				},
			},
			{
				id: 'popup-inverted',
				title: 'minDate after maxDate',
				note: 'No day is inside both limits, so every day is disabled.',
				render: (id, title) => (
					<DatePicker
						aria-label={title}
						placeholder="Select date"
						minDate={day(20)}
						maxDate={day(10)}
						testId={id}
					/>
				),
				disabledDays: [1, 10, 15, 20, 30],
			},
		],
	},
];

const POPUP_CELLS = POPUP_GROUPS.flatMap((group) => group.cells);

type TooltipCell = {
	id: string;
	title: string;
	note: ReactNode;
	render: (id: string, title: string) => ReactElement;
	/**
	 * What the tooltip says, in the order it says it.
	 */
	says: string[];
	/**
	 * What it must not say.
	 */
	silentOn?: string[];
};

const DISABLED_REASON = 'Ask an admin to change the date';
const READ_ONLY_REASON = 'The date is set by your admin';
const TRUNCATED_VALUE = '2026-09-14 09:30:00 Asia/Kolkata';

/**
 * The tooltips the trigger carries. `ForceOpenProvider` does not hold them open, so `play` puts the
 * pointer on every trigger.
 */
const TOOLTIP_CELLS: TooltipCell[] = [
	{
		id: 'tooltip-disabled',
		title: 'disabled',
		note: (
			<>
				<code>disabledTooltip</code> says why the date picker cannot be used.
			</>
		),
		render: (id, title) => (
			<DatePicker
				aria-label={title}
				placeholder="Select date"
				defaultValue={day(14)}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId={id}
			/>
		),
		says: [DISABLED_REASON],
	},
	{
		id: 'tooltip-read-only',
		title: 'readOnly',
		note: (
			<>
				<code>readOnlyTooltip</code> says why the date cannot be changed.
			</>
		),
		render: (id, title) => (
			<DatePicker
				aria-label={title}
				placeholder="Select date"
				defaultValue={day(14)}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId={id}
			/>
		),
		says: [READ_ONLY_REASON],
	},
	{
		id: 'tooltip-disabled-read-only',
		title: 'disabled and readOnly',
		note: (
			<>
				<code>readOnly</code> outranks <code>disabled</code>, so only its reason shows.
			</>
		),
		render: (id, title) => (
			<DatePicker
				aria-label={title}
				placeholder="Select date"
				defaultValue={day(14)}
				disabled
				disabledTooltip={DISABLED_REASON}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId={id}
			/>
		),
		says: [READ_ONLY_REASON],
		silentOn: [DISABLED_REASON],
	},
	{
		id: 'tooltip-truncated',
		title: 'long value',
		note: 'A value cut off by an ellipsis shows in full.',
		render: (id, title) => (
			<ZonedDatePicker
				aria-label={title}
				placeholder="Select date and time"
				showTime
				showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
				defaultValue={ZONED_VALUE}
				width={180}
				testId={id}
			/>
		),
		says: [TRUNCATED_VALUE],
	},
	{
		id: 'tooltip-read-only-truncated',
		title: 'readOnly and long value',
		note: 'The reason comes first, then the full value under a divider.',
		render: (id, title) => (
			<ZonedDatePicker
				aria-label={title}
				placeholder="Select date and time"
				showTime
				showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
				defaultValue={ZONED_VALUE}
				width={180}
				readOnly
				readOnlyTooltip={READ_ONLY_REASON}
				testId={id}
			/>
		),
		says: [READ_ONLY_REASON, TRUNCATED_VALUE],
	},
	{
		id: 'tooltip-disabled-truncated',
		title: 'disabled and long value',
		note: 'The same stack for a disabled date picker.',
		render: (id, title) => (
			<ZonedDatePicker
				aria-label={title}
				placeholder="Select date and time"
				showTime
				showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
				defaultValue={ZONED_VALUE}
				width={180}
				disabled
				disabledTooltip={DISABLED_REASON}
				testId={id}
			/>
		),
		says: [DISABLED_REASON, TRUNCATED_VALUE],
	},
];

/**
 * The window height, so the popup grid can remount when a snapshot tool grows the viewport.
 *
 * Base UI flips a popup whose trigger is below the fold to open upwards, and keeps it flipped
 * while it stays open. The tools shoot a tall page by growing the viewport after the story has
 * rendered, so the popups have to open again once it has grown.
 */
function useWindowHeight(): number {
	const [height, setHeight] = useState(() => window.innerHeight);

	useEffect(() => {
		const onResize = (): void => setHeight(window.innerHeight);

		window.addEventListener('resize', onResize);

		return () => window.removeEventListener('resize', onResize);
	}, []);

	return height;
}

function Heading({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			as="p"
			variant="paragraph"
			size="base"
			weight="bold"
			color="inherit"
			textOverflow="wrap"
		>
			{children}
		</Typography>
	);
}

function SubHeading({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			as="p"
			variant="label"
			size="base"
			weight="medium"
			color="secondary"
			textOverflow="wrap"
		>
			{children}
		</Typography>
	);
}

function Note({
	children,
	color = 'inherit',
	size = 'small',
}: {
	children: ReactNode;
	color?: 'inherit' | 'secondary';
	size?: 'small' | 'base';
}): ReactElement {
	return (
		<Typography
			as="p"
			variant="paragraph"
			size={size}
			weight="regular"
			color={color}
			textOverflow="wrap"
		>
			{children}
		</Typography>
	);
}

function ShowcaseCell({
	title,
	note,
	className,
	children,
}: {
	title: string;
	note: ReactNode;
	className: string;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={`story-section ${className}`}>
			<Heading>{title}</Heading>
			<div className={styles.cellNote}>
				<Note color="secondary">{note}</Note>
			</div>
			{children}
		</div>
	);
}

/**
 * Text above a story outside the showcases: what it shows, why the date picker behaves that way,
 * and what to do in the canvas to see it.
 */
function StoryIntro({
	title,
	what,
	why,
	tryIt,
	children,
}: {
	title: string;
	what: ReactNode;
	why: ReactNode;
	tryIt: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={styles.story}>
			<div className={styles.intro}>
				<Heading>{title}</Heading>
				<Note size="base">{what}</Note>
				<Note size="base">{why}</Note>
				<Note size="base">Try it: {tryIt}</Note>
			</div>
			{children}
		</div>
	);
}

function TriggerRowView({ id, label, note, render, pseudo }: TriggerRow): ReactElement {
	return (
		<>
			<Typography
				as="span"
				variant="label"
				size="small"
				weight="medium"
				color="inherit"
				textOverflow="visible"
			>
				{label}
			</Typography>
			<div data-pseudo={pseudo}>{render(id, label)}</div>
			<Note color="secondary">{note}</Note>
		</>
	);
}

/**
 * Every state the trigger can show, and every popup held open at once in one snapshot. The pickers
 * use September 2026, and August 2026 for the month of six rows, so the snapshot never depends on
 * the day it runs. The tooltips and the layers that a press opens are in
 * `DatePickerTooltipsShowcase` and `DatePickerLayersShowcase`.
 */
export const DatePickerShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
		pseudo: {
			hover: [
				'[data-pseudo="hover"] [data-slot="date-picker"]',
				'[data-pseudo="hover-clear"] [data-slot="date-picker"]',
				'[data-pseudo="hover-clear"] [data-slot="date-picker-clear"]',
			],
			focusVisible: '[data-pseudo="focus"] [data-slot="date-picker-trigger"]',
		},
	},
	play: async () => {
		await waitForEffects();

		for (const cell of POPUP_CELLS) {
			await waitForPopup(cell.id);

			for (const date of cell.enabledDays ?? []) {
				await expect(getDay(cell.id, date, cell.monthNumber)).not.toHaveAttribute(
					'aria-disabled',
					'true',
				);
			}

			for (const date of cell.disabledDays ?? []) {
				await expect(getDay(cell.id, date, cell.monthNumber)).toHaveAttribute(
					'aria-disabled',
					'true',
				);
			}

			if (cell.selectedDay !== undefined) {
				await expect(getDay(cell.id, cell.selectedDay, cell.monthNumber)).toHaveAttribute(
					'data-selected-single',
					'true',
				);
			}

			await cell.check?.(cell.id);
		}

		await expect(document.querySelectorAll('[data-slot="date-picker-popup"]')).toHaveLength(
			POPUP_CELLS.length,
		);
		await waitFor(() =>
			expect(getNode('trigger-truncated').querySelector('[data-truncated]')).not.toBeNull(),
		);
		await waitFor(() =>
			expect(getNode('trigger-long-placeholder').querySelector('[data-truncated]')).not.toBeNull(),
		);
		await expect(getNode('trigger-allow-clear-clear')).toHaveAccessibleName('Clear date');
		await expect(getNode('trigger-clear-hover-clear')).toHaveAccessibleName('Clear date');
		await expect(getNode('trigger-read-only')).toHaveAttribute('aria-readonly', 'true');
		await expect(getNode('trigger-disabled')).toHaveAttribute('aria-disabled', 'true');
		await expect(getNode('trigger-disabled-read-only')).toHaveAttribute('aria-readonly', 'true');
		await expect(getNode('trigger-disabled-read-only')).not.toHaveAttribute('aria-disabled');
		await expect(document.querySelector('[data-testid="trigger-disabled-clear"]')).toBeNull();
		await expect(document.querySelector('[data-testid="trigger-read-only-clear"]')).toBeNull();
		await expect(getNode('trigger-invalid-hover')).toHaveAttribute('aria-invalid', 'true');
		await waitForEffects();
	},
	render: () => <DatePickerShowcaseView />,
};

function DatePickerShowcaseView(): ReactElement {
	const windowHeight = useWindowHeight();

	return (
		<div className="story-container-full">
			<div className={styles.columnLayout}>
				<div className="story-section">
					<Heading>Trigger</Heading>
					<Note>
						What the closed trigger shows, one row per case. The <code>hovered</code>,{' '}
						<code>clear hovered</code> and <code>focus-visible</code> rows are forced by{' '}
						<code>storybook-addon-pseudo-states</code>.
					</Note>
					<div className={`${styles.triggerGrid} ${styles.marginTopMedium}`}>
						{TRIGGER_GROUPS.map((group) => (
							<Fragment key={group.title}>
								<div className={styles.gridHeading}>
									<SubHeading>{group.title}</SubHeading>
								</div>
								{group.rows.map((row) => (
									<TriggerRowView key={row.id} {...row} />
								))}
							</Fragment>
						))}
					</div>
				</div>
				<div className="story-section">
					<Heading>Popup</Heading>
					<Note>
						Every popup below is held open by <code>ForceOpenProvider</code>, so they all fit in one
						snapshot. Without it, the popup that opens last takes the focus and closes the rest.
					</Note>
					<ForceOpenProvider>
						<div key={windowHeight} className={`${styles.columnLayout} ${styles.marginTopMedium}`}>
							{POPUP_GROUPS.map((group) => (
								<div key={group.title} className="story-section">
									<SubHeading>{group.title}</SubHeading>
									<Note>{group.note}</Note>
									<div className={styles.showcaseGrid}>
										{group.cells.map((cell) => (
											<ShowcaseCell
												key={cell.id}
												title={cell.title}
												note={cell.note}
												className={cell.tall === true ? styles.cellTall : styles.cell}
											>
												{cell.render(cell.id, cell.title)}
											</ShowcaseCell>
										))}
									</div>
								</div>
							))}
						</div>
					</ForceOpenProvider>
				</div>
			</div>
		</div>
	);
}

/**
 * The tooltips of the trigger, held open: the reason of a disabled and of a read-only date picker,
 * the full value of one that does not fit, the reason over the value when both apply, and the
 * read-only reason alone when both props are set. `ForceOpenProvider` leaves them closed, so `play`
 * puts the pointer on each trigger and keeps it there.
 */
export const DatePickerTooltipsShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	play: async () => {
		await waitForEffects();

		for (const cell of TOOLTIP_CELLS) {
			const trigger = getNode(cell.id);

			await expect(trigger).not.toBeDisabled();

			if (cell.id.endsWith('truncated')) {
				await waitFor(() => expect(trigger.querySelector('[data-truncated]')).not.toBeNull());
			}
		}

		for (const cell of TOOLTIP_CELLS) {
			restPointerOn(getNode(cell.id));
		}

		for (const cell of TOOLTIP_CELLS) {
			const tooltip = await waitForTooltip(getNode(cell.id));

			for (const text of cell.says) {
				await expect(tooltip).toHaveTextContent(text);
			}

			for (const text of cell.silentOn ?? []) {
				await expect(tooltip).not.toHaveTextContent(text);
			}
		}

		await expect(document.querySelectorAll('[data-slot="tooltip-content"]')).toHaveLength(
			TOOLTIP_CELLS.length,
		);
		await expect(document.querySelector('[data-slot="date-picker-popup"]')).toBeNull();
		await waitForEffects();
	},
	render: () => (
		<div className="story-container-full">
			<div className="story-section">
				<Heading>Trigger tooltips</Heading>
				<Note>
					The pointer rests on every trigger below, so every tooltip is open. A disabled or
					read-only trigger stays focusable, which is what keeps its reason reachable.
				</Note>
				<div className={`${styles.tooltipGrid} ${styles.marginTopMedium}`}>
					{TOOLTIP_CELLS.map((cell) => (
						<ShowcaseCell
							key={cell.id}
							title={cell.title}
							note={cell.note}
							className={styles.tooltipCell}
						>
							<div className={styles.tooltipAnchor}>{cell.render(cell.id, cell.title)}</div>
						</ShowcaseCell>
					))}
				</div>
			</div>
		</div>
	),
};

function LayersExample(): ReactElement {
	return (
		<div className={styles.page}>
			<Dialog
				open
				onClose={() => undefined}
				title="Schedule maintenance"
				testId="layers-dialog"
				footerSuffix={
					<Button variant="solid" color="primary" size="md">
						Save
					</Button>
				}
			>
				<div className={styles.field}>
					<Typography
						as="label"
						htmlFor="layers-starts"
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						textOverflow="wrap"
					>
						Starts at
					</Typography>
					<ForceOpenProvider>
						<ZonedDatePicker
							id="layers-starts"
							placeholder="Select date and time"
							showTime
							showTimezone={{ options: ZONES, defaultValue: 'Asia/Kolkata' }}
							defaultValue={ZONED_VALUE}
							testId="layers-date"
						/>
					</ForceOpenProvider>
				</div>
			</Dialog>
		</div>
	);
}

/**
 * The popup of a date picker inside an open `Dialog`, with the time zone list open over it: three
 * layers, each above the one under it. The popup and the list both go into the panel of the
 * dialog. `ForceOpenProvider` holds the popup, not the list, so `play` opens the list with a press
 * on the `Time zone` field.
 */
export const DatePickerLayersShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('layers-dialog')).toBeVisible());

		const dialog = getNode('layers-dialog');
		const popup = await waitForPopup('layers-date');

		await expect(dialog).toContainElement(popup);

		await userEvent.click(within(popup).getByRole('combobox', { name: 'Time zone' }));

		const list = await screen.findByRole('listbox');

		await expect(dialog).toContainElement(list);
		await expect(within(list).getByRole('option', { name: 'Asia/Kolkata' })).toBeVisible();
		await expect(within(list).getAllByRole('option')).toHaveLength(ZONES.length);
		await expect(popup).toBeVisible();
		await waitForEffects();
	},
	render: () => <LayersExample />,
};

/**
 * Picks a day. The popup opens on the selected day and puts the focus on it, a pick commits the
 * start of that day and closes the popup, and the focus goes back to the trigger. Picking the day
 * that is already selected closes the popup and calls nothing.
 */
export const PickingADay: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="Picking a day"
			what={
				<>
					The basic flow, with no time. The popup opens on the selected day with the focus on it. A
					click on a day commits the start of that day, closes the popup and gives the focus back to
					the trigger.
				</>
			}
			why={
				<>
					A day is the whole choice, so there is no <code>Apply</code> step to press. Picking the
					day that is already selected only closes the popup and calls nothing, so the app never
					handles a change that changed nothing.
				</>
			}
			tryIt={
				<>
					open it and pick the 17th, then open it again and pick the 17th once more. The Actions
					panel shows one <code>onChange</code> call.
				</>
			}
		>
			<div className={styles.page}>
				<DatePicker
					{...args}
					aria-label="Expires on"
					placeholder="Select date"
					defaultValue={day(14)}
					testId="pick"
				/>
			</div>
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();

		const trigger = getNode('pick');

		await expect(trigger).toHaveTextContent('2026-09-14');
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		const popup = await openPopup('pick');

		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(popup).toHaveAccessibleName('Choose date');
		await waitFor(() => expect(getDay('pick', 14)).toHaveFocus());

		await userEvent.click(getDay('pick', 17));
		await waitForNoPopup('pick');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(day(17), { timezone: undefined });
		await expect(trigger).toHaveTextContent('2026-09-17');
		await waitFor(() => expect(trigger).toHaveFocus());

		await openPopup('pick');
		await userEvent.click(getDay('pick', 17));
		await waitForNoPopup('pick');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
	},
};

/**
 * A day and a time, committed together. A pick moves the draft day and keeps the popup open, the
 * time fields edit the draft, and `Apply` calls `onChange` once. `Esc` drops the draft, and
 * `Enter` in a time field applies.
 */
export const PickingATime: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="Picking a day and a time"
			what={
				<>
					With <code>showTime</code> the popup edits a draft. A click on a day moves the draft and
					keeps the popup open, the time fields under the month edit it, and <code>Apply</code>{' '}
					commits the day and the time together in one <code>onChange</code> call.
				</>
			}
			why={
				<>
					The day and the time are one value. Committing on every click would hand the app a time
					the user did not pick yet, so nothing leaves the popup before <code>Apply</code>.{' '}
					<code>Esc</code> drops the draft, and <code>Enter</code> in a time field applies it.
				</>
			}
			tryIt={
				<>
					pick the 18th, type 14 and 45 in the time fields and press <code>Apply</code>. Then open
					it, pick another day and press <code>Esc</code>: the trigger keeps the value it had.
				</>
			}
		>
			<div className={styles.page}>
				<DatePicker
					{...args}
					aria-label="Starts at"
					placeholder="Select date and time"
					showTime
					defaultValue={day(14, 9, 30)}
					testId="time"
				/>
			</div>
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();

		const trigger = getNode('time');

		await expect(trigger).toHaveTextContent('2026-09-14 09:30:00');

		const popup = await openPopup('time');

		await expect(popup).toHaveAccessibleName('Choose date and time');
		await expect(getNode('time-time-hours')).toHaveValue('09');

		await userEvent.click(getDay('time', 18));
		await expect(popup).toBeVisible();
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(trigger).toHaveTextContent('2026-09-14 09:30:00');

		await userEvent.click(getNode('time-time-hours'));
		await userEvent.keyboard('14');
		await waitFor(() => expect(getNode('time-time-minutes')).toHaveFocus());
		await userEvent.keyboard('45');
		await expect(getNode('time-time-hours')).toHaveValue('14');
		await expect(getNode('time-time-minutes')).toHaveValue('45');

		await userEvent.click(getNode('time-apply'));
		await waitForNoPopup('time');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(day(18, 14, 45, 0), { timezone: undefined });
		await expect(trigger).toHaveTextContent('2026-09-18 14:45:00');

		await openPopup('time');
		await userEvent.click(getDay('time', 22));
		await userEvent.keyboard('{Escape}');
		await waitForNoPopup('time');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(trigger).toHaveTextContent('2026-09-18 14:45:00');
		await waitFor(() => expect(trigger).toHaveFocus());

		await openPopup('time');
		await expect(getNode('time-time-hours')).toHaveValue('14');
		await userEvent.click(getNode('time-time-hours'));
		await userEvent.keyboard('{ArrowUp}{Enter}');
		await waitForNoPopup('time');
		await expect(args.onChange).toHaveBeenCalledTimes(2);
		await expect(args.onChange).toHaveBeenLastCalledWith(day(18, 15, 45, 0), {
			timezone: undefined,
		});
	},
};

function formatCommitted(value: Date | undefined, timezone: string | undefined): string {
	return value === undefined ? 'Nothing committed.' : `${value.toISOString()} in ${timezone}`;
}

function ZoneExample({
	onChange,
}: {
	// The example is not `nullable`, so its handler is the one that reports `undefined` on a clear.
	onChange?: Extract<DatePickerProps<Date, true>, { nullable?: never }>['onChange'];
}): ReactElement {
	const [value, setValue] = useState<Date | undefined>(ZONED_VALUE);
	const [timezone, setTimezone] = useState<string | undefined>('Asia/Kolkata');

	return (
		<div className={styles.page}>
			<ZonedDatePicker
				aria-label="Maintenance starts at"
				placeholder="Select date and time"
				showTime
				showTimezone={{ options: ZONES, value: timezone }}
				value={value}
				onChange={(next, details) => {
					setValue(next);
					setTimezone(details.timezone);
					onChange?.(next, details);
				}}
				testId="zone"
			/>
			<Typography
				as="p"
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				textOverflow="wrap"
				testId="zone-committed"
			>
				{formatCommitted(value, timezone)}
			</Typography>
		</div>
	);
}

/**
 * Picks a time zone. The date picker does no time zone math: the adapter does, and this one
 * uses fixed offsets. Changing the zone keeps the wall clock of the draft, so `09:30` stays
 * `09:30` and `Apply` commits 09:30 in the new zone, which is another instant. The zone comes back
 * in `onChange` next to the date, and both commit with `Apply`.
 */
// Without `nullable`, like the stories above.
type PlainZonedDatePicker = (
	props: Extract<DatePickerProps<Date, true>, { nullable?: never }> &
		RefAttributes<HTMLButtonElement>,
) => ReactElement;

export const PickingATimeZone: StoryObj<PlainZonedDatePicker> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="Picking a time zone"
			what={
				<>
					<code>showTimezone</code> adds a zone field under the time. The zone is part of the draft:
					it commits with <code>Apply</code> and reaches <code>onChange</code> as{' '}
					<code>details.timezone</code>, next to the date. The line under the trigger prints the
					committed instant in UTC.
				</>
			}
			why={
				<>
					Changing the zone keeps the wall clock, so 09:30 in Asia/Kolkata becomes 09:30 in UTC,
					which is another instant. Someone who sets a schedule means the time they typed, in the
					zone they picked. The date picker does no zone math itself: the adapter does, and the one
					in this story uses fixed offsets.
				</>
			}
			tryIt={
				<>
					open it, switch the zone to UTC, press <code>Apply</code>, and compare the instant under
					the trigger before and after.
				</>
			}
		>
			<ZoneExample onChange={args.onChange} />
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();

		const trigger = getNode('zone');

		await expect(trigger).toHaveTextContent('2026-09-14 09:30:00 Asia/Kolkata');
		await expect(getNode('zone-committed')).toHaveTextContent(
			'2026-09-14T04:00:00.000Z in Asia/Kolkata',
		);

		const popup = await openPopup('zone');
		const zoneField = within(popup).getByRole('combobox', { name: 'Time zone' });

		await userEvent.click(zoneField);

		const list = await screen.findByRole('listbox');

		await userEvent.click(within(list).getByRole('option', { name: 'UTC' }));
		await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
		await expect(popup).toBeVisible();
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(getNode('zone-time-hours')).toHaveValue('09');

		await userEvent.click(getNode('zone-apply'));
		await waitForNoPopup('zone');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(
			new Date(Date.UTC(YEAR, MONTH_INDEX, 14, 9, 30, 0)),
			{
				timezone: 'UTC',
			},
		);
		await expect(trigger).toHaveTextContent('2026-09-14 09:30:00 UTC');
		await expect(getNode('zone-committed')).toHaveTextContent('2026-09-14T09:30:00.000Z in UTC');
	},
};

/**
 * Drives the popup with the keys only. `ArrowDown` opens it on the selected day, the arrows move
 * the focus by a day or a week, `PageDown` by a month, `Enter` picks, and `Esc` closes the popup
 * and gives the focus back to the trigger without calling `onChange`.
 */
export const KeyboardOpenAndEscape: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="Keyboard only"
			what={
				<>
					Every step works without a pointer. <code>Enter</code>, <code>Space</code> or{' '}
					<code>ArrowDown</code> on the trigger opens the popup on the selected day. The arrows move
					one day or one week, <code>PageUp</code> and <code>PageDown</code> one month, and{' '}
					<code>Enter</code> picks.
				</>
			}
			why={
				<>
					<code>Esc</code> closes the popup without calling <code>onChange</code> and gives the
					focus back to the trigger. Someone who opened it by mistake loses nothing and lands where
					they started, ready to tab on through the form.
				</>
			}
			tryIt={
				<>
					click the canvas, press <code>Tab</code> to reach the trigger and <code>ArrowDown</code>{' '}
					to open it, move around, then press <code>Esc</code>. Open it again with{' '}
					<code>Enter</code>, press <code>PageDown</code> and pick a day in October.
				</>
			}
		>
			<div className={styles.page}>
				<DatePicker
					{...args}
					aria-label="Expires on"
					placeholder="Select date"
					defaultValue={day(14)}
					testId="keys"
				/>
			</div>
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();

		const trigger = getNode('keys');

		await userEvent.tab();
		await expect(trigger).toHaveFocus();

		await userEvent.keyboard('{ArrowDown}');
		await waitForPopup('keys');
		await waitFor(() => expect(getDay('keys', 14)).toHaveFocus());

		await userEvent.keyboard('{ArrowRight}');
		await expect(getDay('keys', 15)).toHaveFocus();

		await userEvent.keyboard('{Escape}');
		await waitForNoPopup('keys');
		await waitFor(() => expect(trigger).toHaveFocus());
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(trigger).toHaveTextContent('2026-09-14');

		await userEvent.keyboard('{Enter}');
		await waitForPopup('keys');
		await waitFor(() => expect(getDay('keys', 14)).toHaveFocus());

		await userEvent.keyboard('{PageDown}');
		await waitFor(() => expect(getDay('keys', 14, 10)).toHaveFocus());

		await userEvent.keyboard('{ArrowDown}');
		await expect(getDay('keys', 21, 10)).toHaveFocus();

		await userEvent.keyboard('{Enter}');
		await waitForNoPopup('keys');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(new Date(YEAR, 9, 21), {
			timezone: undefined,
		});
		await expect(trigger).toHaveTextContent('2026-10-21');
		await waitFor(() => expect(trigger).toHaveFocus());
	},
};

/**
 * Limits the days. `minDate` and `maxDate` bound the range and stop the month arrows, and
 * `disabledDate` takes out single days inside it, here the weekends. A disabled day takes the
 * focus, so the keys never get stuck at a limit, and it cannot be picked.
 */
export const DateLimits: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="Limiting the days"
			what={
				<>
					<code>minDate</code> and <code>maxDate</code> hold the range to 8 to 25 September, and{' '}
					<code>disabledDate</code> takes the weekends out of it. Those days show as disabled, and
					the month arrows stop at the ends of the range.
				</>
			}
			why={
				<>
					A disabled day still takes the keyboard focus, so the arrows never get stuck at the edge
					of the range or in front of a weekend. It only refuses the pick. Use <code>minDate</code>{' '}
					and <code>maxDate</code> for a range, and <code>disabledDate</code> for a rule that a
					range cannot say.
				</>
			}
			tryIt={<>click a Saturday and see the popup stay open, then click a weekday.</>}
		>
			<div className={styles.page}>
				<DatePicker
					{...args}
					aria-label="Maintenance day"
					placeholder="Select a weekday"
					defaultValue={day(16)}
					minDate={day(8)}
					maxDate={day(25)}
					disabledDate={isWeekend}
					testId="limits"
				/>
			</div>
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();
		await openPopup('limits');

		await expect(getDay('limits', 7)).toHaveAttribute('aria-disabled', 'true');
		await expect(getDay('limits', 8)).not.toHaveAttribute('aria-disabled', 'true');
		await expect(getDay('limits', 12)).toHaveAttribute('aria-disabled', 'true');
		await expect(getDay('limits', 13)).toHaveAttribute('aria-disabled', 'true');
		await expect(getDay('limits', 25)).not.toHaveAttribute('aria-disabled', 'true');
		await expect(getDay('limits', 26)).toHaveAttribute('aria-disabled', 'true');
		await expect(getNode('limits-calendar-nav-previous')).toHaveAttribute('aria-disabled', 'true');
		await expect(getNode('limits-calendar-nav-next')).toHaveAttribute('aria-disabled', 'true');

		await waitFor(() => expect(getDay('limits', 16)).toHaveFocus());
		await userEvent.click(getDay('limits', 12));
		await expect(getNode('limits-popup')).toBeVisible();
		await expect(args.onChange).not.toHaveBeenCalled();

		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await expect(getDay('limits', 26)).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect(getNode('limits-popup')).toBeVisible();
		await expect(args.onChange).not.toHaveBeenCalled();

		await userEvent.click(getDay('limits', 15));
		await waitForNoPopup('limits');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith(day(15), { timezone: undefined });
	},
};

/**
 * Clears the value. `allowClear` shows a clear button while there is a value, and `Delete` and
 * `Backspace` on the trigger do the same. `onChange` gets `undefined`, and the trigger shows the
 * placeholder again.
 */
export const Clearing: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="Clearing the value"
			what={
				<>
					<code>allowClear</code> shows a clear button in the trigger while there is a value.{' '}
					<code>Delete</code> and <code>Backspace</code> on the focused trigger do the same.{' '}
					<code>onChange</code> gets <code>undefined</code>, and the trigger shows the placeholder
					again.
				</>
			}
			why={
				<>
					It is off by default, since a field that needs a value gains nothing from it. Turn it on
					where an empty date means something, like the end of a schedule that may never end, and
					let the placeholder say what empty means. The clear button is not a tab stop, because the
					keys on the trigger already cover it.
				</>
			}
			tryIt={
				<>
					press the clear button, pick a day, then press <code>Delete</code> while the trigger has
					the focus.
				</>
			}
		>
			<div className={styles.page}>
				<DatePicker
					{...args}
					aria-label="Ends on"
					placeholder="No end date"
					allowClear
					defaultValue={day(14)}
					testId="clear"
				/>
			</div>
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();

		const trigger = getNode('clear');

		await expect(getNode('clear-clear')).toHaveAccessibleName('Clear date');
		await expect(getNode('clear-clear')).toHaveAttribute('tabindex', '-1');

		await userEvent.click(getNode('clear-clear'));
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenLastCalledWith(undefined, { timezone: undefined });
		await expect(trigger).toHaveTextContent('No end date');
		await expect(trigger).toHaveAttribute('data-empty');
		await waitFor(() => expect(trigger).toHaveFocus());
		await expect(document.querySelector('[data-testid="clear-clear"]')).toBeNull();

		const picked = await pickDayOfOpenedMonth('clear', 20);

		await waitForNoPopup('clear');
		await expect(args.onChange).toHaveBeenCalledTimes(2);
		await expect(trigger).toHaveTextContent(picked);
		await waitFor(() => expect(trigger).toHaveFocus());

		await userEvent.keyboard('{Delete}');
		await expect(args.onChange).toHaveBeenCalledTimes(3);
		await expect(args.onChange).toHaveBeenLastCalledWith(undefined, { timezone: undefined });
		await expect(trigger).toHaveTextContent('No end date');
	},
};

function FormExample(): ReactElement {
	const [submitted, setSubmitted] = useState<Array<[string, string]>>();

	return (
		<div className={styles.page}>
			<form
				className={styles.form}
				onReset={() => setSubmitted(undefined)}
				onSubmit={(event) => {
					event.preventDefault();

					const entries: Array<[string, string]> = [];

					new FormData(event.currentTarget).forEach((value, key) => {
						entries.push([key, String(value)]);
					});
					setSubmitted(entries);
				}}
			>
				<div className={styles.field}>
					<Typography
						as="label"
						htmlFor="form-expires"
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						textOverflow="wrap"
					>
						Expires on
					</Typography>
					<DatePicker
						id="form-expires"
						name="expires"
						required
						placeholder="Select date"
						testId="form-expires"
					/>
				</div>
				<div className={styles.field}>
					<Typography
						as="label"
						htmlFor="form-starts"
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						textOverflow="wrap"
					>
						Starts at
					</Typography>
					<ZonedDatePicker
						id="form-starts"
						name="starts"
						placeholder="Select date and time"
						showTime
						showTimezone={{ options: ZONES, defaultValue: 'UTC' }}
						testId="form-starts"
					/>
				</div>
				<div className={styles.actions}>
					<Button variant="solid" color="primary" size="md" type="submit" testId="form-submit">
						Save
					</Button>
					<Button variant="outlined" color="secondary" size="md" type="reset" testId="form-reset">
						Reset
					</Button>
				</div>
			</form>
			<ul className={styles.result} data-testid="form-result">
				{submitted?.map(([key, value]) => (
					<li key={key}>
						<Typography
							as="span"
							variant="code"
							size="small"
							weight="regular"
							color="secondary"
							textOverflow="wrap"
						>
							{`${key}=${value}`}
						</Typography>
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * Submits with a form. `name` makes the date picker submit `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm:ss`
 * with `showTime`, and `showTimezone` adds a field named `<name>-timezone`. `required` makes an
 * empty date picker fail the validation, and a reset brings an uncontrolled one back to
 * `defaultValue`.
 */
export const Forms: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<StoryIntro
			title="Inside a form"
			what={
				<>
					With <code>name</code>, the date picker submits like a native input:{' '}
					<code>YYYY-MM-DD</code>, or <code>YYYY-MM-DDTHH:mm:ss</code> with <code>showTime</code>.{' '}
					<code>showTimezone</code> adds a second field named <code>&lt;name&gt;-timezone</code>.
					The list under the buttons prints what the form sent.
				</>
			}
			why={
				<>
					A form that reads <code>FormData</code> needs no glue code for the date. It also behaves
					like the inputs next to it: <code>required</code> makes an empty date picker fail the
					validation of the form, and a reset brings an uncontrolled one back to{' '}
					<code>defaultValue</code>.
				</>
			}
			tryIt={
				<>
					press <code>Save</code> with no date, then pick both dates, press <code>Save</code> again
					and read the list, then press <code>Reset</code>.
				</>
			}
		>
			<FormExample />
		</StoryIntro>
	),
	play: async ({ canvasElement }) => {
		await waitForEffects();

		const form = canvasElement.querySelector('form');

		if (form === null) {
			throw new Error('DatePicker story: the form did not render.');
		}

		await expect(getNode('form-expires')).toHaveAccessibleName('Expires on');
		await expect(getNode('form-expires')).toHaveAttribute('aria-required', 'true');
		await expect(form.checkValidity()).toBe(false);

		const expires = await pickDayOfOpenedMonth('form-expires', 17);

		await waitForNoPopup('form-expires');
		await expect(form.checkValidity()).toBe(true);

		const starts = await pickDayOfOpenedMonth('form-starts', 22);

		await userEvent.click(getNode('form-starts-apply'));
		await waitForNoPopup('form-starts');
		await expect(getNode('form-starts')).toHaveTextContent(`${starts} 00:00:00 UTC`);

		await userEvent.click(getNode('form-submit'));

		const result = getNode('form-result');

		await waitFor(() => expect(result).toHaveTextContent(`expires=${expires}`));
		await expect(result).toHaveTextContent(`starts=${starts}T00:00:00`);
		await expect(result).toHaveTextContent('starts-timezone=UTC');

		await userEvent.click(getNode('form-reset'));
		await waitFor(() => expect(getNode('form-expires')).toHaveTextContent('Select date'));
		await expect(result).toBeEmptyDOMElement();
		await expect(getNode('form-starts')).toHaveTextContent('Select date and time');
	},
};

function DialogExample(): ReactElement {
	const [open, setOpen] = useState(true);

	return (
		<div className={styles.page}>
			<Button variant="outlined" color="secondary" size="md" onClick={() => setOpen(true)}>
				Edit key
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				title="Edit API key"
				testId="key-dialog"
				footerSuffix={
					<Button variant="solid" color="primary" size="md" onClick={() => setOpen(false)}>
						Save
					</Button>
				}
			>
				<div className={styles.field}>
					<Typography
						as="label"
						htmlFor="key-expires"
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						textOverflow="wrap"
					>
						Expires on
					</Typography>
					<DatePicker
						id="key-expires"
						placeholder="Select date"
						defaultValue={day(14)}
						testId="key-date"
					/>
				</div>
			</Dialog>
		</div>
	);
}

/**
 * Inside a `Dialog` the popup goes into the panel on its own, where the focus trap of the modal
 * lets the keyboard reach the calendar. `Esc` closes the popup and leaves the dialog open.
 */
export const InsideADialog: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<StoryIntro
			title="Inside a dialog"
			what={
				<>
					The dialog opens on load with a date picker in it. The popup of the date picker renders
					inside the panel of the dialog on its own, with no prop to set. <code>Drawer</code> works
					the same way.
				</>
			}
			why={
				<>
					A modal keeps the focus inside its panel. A popup rendered at the end of the page would
					sit outside that trap, and the keyboard could not reach the calendar. <code>Esc</code>{' '}
					closes only the popup and leaves the dialog open, so one key press never throws away the
					whole form.
				</>
			}
			tryIt={
				<>
					open the date picker, move with the arrows, press <code>Esc</code> once to close the popup
					and once more to close the dialog. <code>Edit key</code> opens it again.
				</>
			}
		>
			<DialogExample />
		</StoryIntro>
	),
	play: async () => {
		await waitForEffects();
		await waitFor(() => expect(getNode('key-dialog')).toBeVisible());

		const dialog = getNode('key-dialog');
		const popup = await openPopup('key-date');

		await expect(dialog).toContainElement(popup);
		await waitFor(() => expect(getDay('key-date', 14)).toHaveFocus());

		await userEvent.keyboard('{ArrowRight}');
		await expect(getDay('key-date', 15)).toHaveFocus();
		await userEvent.keyboard('{Escape}');
		await waitForNoPopup('key-date');
		await expect(dialog).toBeVisible();
		await waitFor(() => expect(getNode('key-date')).toHaveFocus());

		await pickDay('key-date', 18);
		await expect(getNode('key-date')).toHaveTextContent('2026-09-18');
		await expect(dialog).toBeVisible();
		await waitFor(() => expect(getNode('key-date')).toHaveFocus());
	},
};

/**
 * A date picker made with `createDatePicker` takes and returns the app's date type. This one holds
 * a `YYYY-MM-DD` string, so `value`, `minDate`, `onChange` and `disabledDate` are strings and no
 * call site converts. An app with a date library writes the same adapter around it.
 */
export const CustomDateType: StoryObj<typeof IsoDayDatePicker> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: { onChange: fn() },
	render: (args) => (
		<StoryIntro
			title="A custom date type"
			what={
				<>
					<code>createDatePicker(adapter)</code> makes a date picker typed to the date value of the
					app. This one holds a <code>YYYY-MM-DD</code> string, so <code>value</code>,{' '}
					<code>minDate</code>, <code>disabledDate</code> and <code>onChange</code> all take and
					return strings. Here <code>minDate</code> is 10 September and <code>disabledDate</code>{' '}
					refuses the 15th.
				</>
			}
			why={
				<>
					The call sites never convert to <code>Date</code> and back, which is where off-by-one days
					and lost zones come from. An app on a date library writes the same small adapter around it
					once, and every date picker in the app then speaks its type.
				</>
			}
			tryIt={
				<>
					pick the 17th and read the <code>onChange</code> call in the Actions panel: the value is
					the string <code>2026-09-17</code>.
				</>
			}
		>
			<div className={styles.page}>
				<IsoDayDatePicker
					{...args}
					aria-label="Report day"
					placeholder="Select date"
					defaultValue="2026-09-14"
					minDate="2026-09-10"
					disabledDate={(value) => value.endsWith('-15')}
					testId="iso"
				/>
			</div>
		</StoryIntro>
	),
	play: async ({ args }) => {
		await waitForEffects();

		const trigger = getNode('iso');

		await expect(trigger).toHaveTextContent('2026-09-14');
		await openPopup('iso');
		await expect(getDay('iso', 9)).toHaveAttribute('aria-disabled', 'true');
		await expect(getDay('iso', 15)).toHaveAttribute('aria-disabled', 'true');

		await userEvent.click(getDay('iso', 17));
		await waitForNoPopup('iso');
		await expect(args.onChange).toHaveBeenCalledTimes(1);
		await expect(args.onChange).toHaveBeenCalledWith('2026-09-17', { timezone: undefined });
		await expect(trigger).toHaveTextContent('2026-09-17');
	},
};
