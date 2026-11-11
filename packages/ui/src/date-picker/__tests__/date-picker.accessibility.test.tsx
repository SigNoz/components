import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DatePicker } from '../index.js';
import {
	at,
	dayButton,
	freezeToday,
	getPopup,
	getTrigger,
	NOV_6_2026,
	openDatePicker,
	timeField,
	ZONE_OPTIONS,
	ZonedDatePicker,
} from './date-picker.test-utils.js';

describe('DatePicker trigger semantics', () => {
	it('is a combobox that opens a dialog', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);
		const trigger = getTrigger();

		expect(trigger).toHaveAttribute('role', 'combobox');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('reports the popup it controls while it is open', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		const popup = await openDatePicker();

		expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
		expect(getTrigger()).toHaveAttribute('aria-controls', popup.id);
		expect(popup.id).not.toBe('');
	});

	it('reads the placeholder as its text while there is no value', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		expect(getTrigger()).toHaveTextContent('Select date');
	});

	it('reads the formatted value as its text', () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				formatValue={(value) => `Expires on ${value.getDate()} November`}
			/>,
		);

		expect(getTrigger()).toHaveTextContent('Expires on 6 November');
	});

	it('does not read the calendar icon', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		expect(getTrigger().querySelector('[data-slot="date-picker-icon"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
	});

	it('marks aria-required while required', () => {
		const { rerender } = render(
			<DatePicker placeholder="Select date" aria-label="Expiry" required />,
		);

		expect(getTrigger()).toHaveAttribute('aria-required', 'true');

		rerender(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		expect(getTrigger()).not.toHaveAttribute('aria-required');
	});

	it('passes aria-invalid and aria-describedby through, so a form can point at its error', () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					aria-invalid="true"
					aria-describedby="expiry-error"
				/>
				<p id="expiry-error">Pick a day in the future</p>
			</>,
		);

		expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
		expect(getTrigger()).toHaveAccessibleDescription('Pick a day in the future');
	});

	it('shows the focus ring on keyboard focus', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		await userEvent.tab();
		const style = getComputedStyle(getTrigger());

		expect(getTrigger()).toHaveFocus();
		expect(getTrigger().matches(':focus-visible')).toBe(true);
		expect(style.outlineStyle).toBe('solid');
		expect(style.outlineWidth).toBe('1px');
	});
});

describe('DatePicker naming', () => {
	it('is named by aria-label', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		expect(screen.getByRole('combobox', { name: 'Expiry' })).toBeInTheDocument();
	});

	it('is named by aria-labelledby', () => {
		render(
			<>
				<span id="expiry-label">Expires on</span>
				<DatePicker placeholder="Select date" aria-labelledby="expiry-label" />
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Expires on' })).toBeInTheDocument();
	});

	it('is named by a label that points at its id', () => {
		render(
			<>
				<label htmlFor="expiry">Expires on</label>
				<DatePicker id="expiry" placeholder="Select date" />
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Expires on' })).toHaveAttribute('id', 'expiry');
	});

	it('is named by a label that comes after it in the document', () => {
		render(
			<>
				<DatePicker id="expiry" placeholder="Select date" />
				<label htmlFor="expiry">Expires on</label>
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Expires on' })).toBeInTheDocument();
	});

	it('is named by the placeholder when nothing else names it', () => {
		render(<DatePicker placeholder="Select date" />);

		expect(screen.getByRole('combobox', { name: 'Select date' })).toBeInTheDocument();
	});

	it('keeps the placeholder as the name when a label points at another id', () => {
		render(
			<>
				<label htmlFor="other">Other field</label>
				<DatePicker id="expiry" placeholder="Select date" />
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Select date' })).toBeInTheDocument();
	});

	it('keeps an aria-label over a label that points at its id', () => {
		render(
			<>
				<label htmlFor="expiry">Expires on</label>
				<DatePicker id="expiry" aria-label="Key expiry" placeholder="Select date" />
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Key expiry' })).toBeInTheDocument();
	});

	it('keeps aria-labelledby over a label that points at its id', () => {
		render(
			<>
				<label htmlFor="expiry">Expires on</label>
				<span id="custom">Custom name</span>
				<DatePicker id="expiry" aria-labelledby="custom" placeholder="Select date" />
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'Custom name' })).toBeInTheDocument();
	});

	it('does not name itself after its value', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" defaultValue={NOV_6_2026} />);

		expect(screen.getByRole('combobox', { name: 'Expiry' })).toHaveTextContent('2026-11-06');
		expect(screen.queryByRole('combobox', { name: /2026/ })).toBeNull();
	});

	it('names the popup, not after the label of the field', async () => {
		render(
			<>
				<label htmlFor="expiry">Expires on</label>
				<DatePicker id="expiry" placeholder="Select date" />
			</>,
		);

		await openDatePicker('Expires on');

		expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
	});
});

describe('DatePicker popup semantics', () => {
	it('is a dialog named Choose date', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		const popup = await openDatePicker();

		expect(popup).toHaveAttribute('role', 'dialog');
		expect(popup).toHaveAccessibleName('Choose date');
	});

	it('is named Choose date and time with showTime', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" showTime />);

		const popup = await openDatePicker();

		expect(popup).toHaveAccessibleName('Choose date and time');
	});

	it('draws a grid named after the month, with a button per day named with the full date', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" defaultValue={NOV_6_2026} />);
		const popup = await openDatePicker();
		const grid = within(popup).getByRole('grid');

		expect(grid).toHaveAccessibleName('November 2026');
		expect(within(grid).getByRole('button', { name: 'Saturday, November 7th, 2026' })).toBe(
			document.querySelector('[data-day="2026-11-07"][data-variant="day"]'),
		);
		expect(
			within(grid).getByRole('button', { name: 'Monday, November 30th, 2026' }),
		).toBeInTheDocument();
	});

	it('marks the selected day aria-selected, and no other', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				testId="dp"
			/>,
		);
		const popup = await openDatePicker();
		const selected = within(popup).getAllByRole('gridcell', { selected: true });

		expect(selected).toHaveLength(1);
		expect(selected[0]).toHaveAttribute('data-day', '2026-11-06');
		expect(dayButton(NOV_6_2026).closest('[role="gridcell"]')).toHaveAttribute(
			'aria-selected',
			'true',
		);
	});

	it('names the selected day and today in the label of their buttons', async () => {
		freezeToday(new Date(2026, 10, 18, 12));
		render(<DatePicker placeholder="Select date" aria-label="Expiry" defaultValue={NOV_6_2026} />);
		const popup = await openDatePicker();

		expect(
			within(popup).getByRole('button', { name: 'Friday, November 6th, 2026, selected' }),
		).toBeInTheDocument();
		expect(
			within(popup).getByRole('button', { name: 'Today, Wednesday, November 18th, 2026' }),
		).toBeInTheDocument();
	});

	it('marks today with data-today, as well as in its name', async () => {
		freezeToday(new Date(2026, 10, 18, 12));
		render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);
		await openDatePicker();

		expect(dayButton(new Date(2026, 10, 18))).toHaveAttribute('data-today');
		expect(document.querySelectorAll('button[data-today]')).toHaveLength(1);
	});

	it('marks today with aria-current="date"', async () => {
		freezeToday(new Date(2026, 10, 18, 12));
		render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);
		await openDatePicker();

		expect(dayButton(new Date(2026, 10, 18))).toHaveAttribute('aria-current', 'date');
	});

	it('marks a day that cannot be picked with aria-disabled, and keeps it a button', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				minDate={new Date(2026, 10, 3)}
				testId="dp"
			/>,
		);
		await openDatePicker();
		const day = dayButton(new Date(2026, 10, 2));

		expect(day).toHaveAttribute('aria-disabled', 'true');
		expect(day).not.toBeDisabled();
		expect(within(getPopup()).getByRole('button', { name: 'Monday, November 2nd, 2026' })).toBe(
			day,
		);
	});

	it('announces the month as a polite live region, and a month change with it', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				testId="dp"
			/>,
		);
		const popup = await openDatePicker();
		const caption = within(popup).getByRole('status');

		expect(caption).toHaveAttribute('aria-live', 'polite');
		expect(caption).toHaveTextContent('November 2026');

		await userEvent.click(screen.getByTestId('dp-calendar-nav-next'));

		expect(within(popup).getByRole('status')).toHaveTextContent('December 2026');
	});

	it('names the month arrows', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" testId="dp" />);
		await openDatePicker();

		expect(screen.getByTestId('dp-calendar-nav-previous')).toHaveAccessibleName(
			'Go to the Previous Month',
		);
		expect(screen.getByTestId('dp-calendar-nav-next')).toHaveAccessibleName('Go to the Next Month');
	});
});

describe('DatePicker time row semantics', () => {
	it('is a group named Time with three spin buttons', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 6, 9, 5, 7)}
			/>,
		);
		const popup = await openDatePicker();
		const group = within(popup).getByRole('group', { name: 'Time' });

		expect(
			within(group)
				.getAllByRole('spinbutton')
				.map((field) => field.getAttribute('aria-label')),
		).toEqual(['Hours', 'Minutes', 'Seconds']);
	});

	it('gives each spin button its range and its value', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 6, 9, 5, 7)}
			/>,
		);
		await openDatePicker();

		expect(timeField('Hours')).toHaveAttribute('aria-valuemin', '0');
		expect(timeField('Hours')).toHaveAttribute('aria-valuemax', '23');
		expect(timeField('Hours')).toHaveAttribute('aria-valuenow', '9');
		expect(timeField('Hours')).toHaveAttribute('aria-valuetext', '09');
		expect(timeField('Minutes')).toHaveAttribute('aria-valuemax', '59');
		expect(timeField('Minutes')).toHaveAttribute('aria-valuenow', '5');
		expect(timeField('Seconds')).toHaveAttribute('aria-valuemax', '59');
		expect(timeField('Seconds')).toHaveAttribute('aria-valuenow', '7');
		expect(timeField('Seconds')).toHaveAttribute('aria-valuetext', '07');
	});

	it('updates the value of a spin button as it steps', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 6, 9, 5, 7)}
			/>,
		);
		await openDatePicker();

		timeField('Hours').focus();
		await userEvent.keyboard('{ArrowUp}');

		expect(timeField('Hours')).toHaveAttribute('aria-valuenow', '10');
		expect(timeField('Hours')).toHaveAttribute('aria-valuetext', '10');
	});

	it('names Apply, and exposes it as disabled with aria-disabled', async () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" showTime testId="dp" />);
		await openDatePicker();
		const apply = within(getPopup()).getByRole('button', { name: 'Apply' });

		expect(apply).toBe(screen.getByTestId('dp-apply'));
		expect(apply).toHaveAttribute('aria-disabled', 'true');
		expect(apply).not.toHaveAttribute('disabled');
	});

	it('names the time zone field Time zone', async () => {
		render(
			<ZonedDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
				defaultValue={at('utc', 2026, 11, 6, 9)}
			/>,
		);
		const popup = await openDatePicker();

		expect(within(popup).getByRole('combobox', { name: 'Time zone' })).toBeInTheDocument();
	});

	it('names the search box of the zone list and each zone', async () => {
		render(
			<ZonedDatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				showTimezone={{ options: ZONE_OPTIONS, defaultValue: 'utc' }}
				defaultValue={at('utc', 2026, 11, 6, 9)}
			/>,
		);
		const popup = await openDatePicker();

		await userEvent.click(within(popup).getByRole('combobox', { name: 'Time zone' }));
		const list = await screen.findByRole('listbox');

		expect(screen.getByRole('combobox', { name: 'Search time zones' })).toHaveFocus();
		expect(within(list).getByRole('option', { name: 'Asia/Kolkata' })).toBeInTheDocument();
	});

	it('shows the focus ring on keyboard focus of the time fields and Apply', async () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				showTime
				defaultValue={new Date(2026, 10, 6, 9)}
				testId="dp"
			/>,
		);
		await openDatePicker();

		await userEvent.tab();

		expect(timeField('Hours')).toHaveFocus();
		expect(timeField('Hours').matches(':focus-visible')).toBe(true);

		await userEvent.tab({ shift: true });
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.tab();

		expect(screen.getByTestId('dp-apply')).toHaveFocus();
		expect(screen.getByTestId('dp-apply').matches(':focus-visible')).toBe(true);
	});
});

describe('DatePicker clear button semantics', () => {
	it('is named Clear date, and out of the tab order', async () => {
		render(
			<>
				<DatePicker
					placeholder="Select date"
					aria-label="Expiry"
					defaultValue={NOV_6_2026}
					allowClear
					testId="dp"
				/>
				<button type="button">After</button>
			</>,
		);
		const clear = screen.getByRole('button', { name: 'Clear date' });

		expect(clear).toBe(screen.getByTestId('dp-clear'));
		expect(clear).toHaveAttribute('tabindex', '-1');
		expect(clear).toHaveAttribute('type', 'button');

		getTrigger().focus();
		await userEvent.tab();

		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
	});

	it('is not a sibling inside the trigger, so a screen reader reads the field value alone', () => {
		render(
			<DatePicker
				placeholder="Select date"
				aria-label="Expiry"
				defaultValue={NOV_6_2026}
				allowClear
				testId="dp"
			/>,
		);

		expect(getTrigger()).not.toContainElement(screen.getByTestId('dp-clear'));
		expect(getTrigger()).toHaveTextContent(/^2026-11-06$/);
	});
});
