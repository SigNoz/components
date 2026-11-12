import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { DatePicker } from '../index.js';
import { DatePickerField } from '../presets/date-picker-field.js';
import { dayButton, getTrigger, NOV_6_2026, openDatePicker } from './date-picker.test-utils.js';

const NOV_10_2026 = new Date(2026, 10, 10);

function label(): HTMLLabelElement {
	const element = screen.getByText('Expiry').closest('label');

	if (element === null) {
		throw new Error('The field label is missing');
	}

	return element;
}

describe('DatePicker inside a Field', () => {
	it('is named by the field label, which points at the trigger', () => {
		render(
			<Field label="Expiry">
				<DatePicker placeholder="Select date" testId="dp" />
			</Field>,
		);

		const trigger = screen.getByTestId('dp');

		expect(getTrigger()).toBe(trigger);
		expect(label().htmlFor).toBe(trigger.id);
		expect(trigger.id).not.toBe('');
	});

	it('keeps its own id, and points the label at it', () => {
		render(
			<Field label="Expiry">
				<DatePicker placeholder="Select date" id="expiry" />
			</Field>,
		);

		expect(label().htmlFor).toBe('expiry');
		expect(getTrigger()).toHaveAttribute('id', 'expiry');
	});

	it('lets its own aria-label name the trigger', () => {
		render(
			<Field label="Expiry">
				<DatePicker placeholder="Select date" aria-label="Expiry date" testId="dp" />
			</Field>,
		);

		expect(screen.getByTestId('dp')).toHaveAccessibleName('Expiry date');
	});

	it('focuses the trigger on a click on the label, and leaves the popup closed', async () => {
		render(
			<Field label="Expiry">
				<DatePicker placeholder="Select date" />
			</Field>,
		);

		await userEvent.click(screen.getByText('Expiry'));

		expect(getTrigger()).toHaveFocus();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('is described by the description, and by the message in its place', () => {
		const { rerender } = render(
			<Field label="Expiry" description="The key stops working after this day.">
				<DatePicker placeholder="Select date" />
			</Field>,
		);

		expect(getTrigger()).toHaveAccessibleDescription('The key stops working after this day.');

		rerender(
			<Field label="Expiry" description="The key stops working after this day." error="Pick a day.">
				<DatePicker placeholder="Select date" />
			</Field>,
		);

		expect(getTrigger()).toHaveAccessibleDescription('Pick a day.');
	});

	it('adds the field description to its own aria-describedby', () => {
		render(
			<>
				<p id="hint">In UTC.</p>
				<Field label="Expiry" description="The key stops working after this day.">
					<DatePicker placeholder="Select date" aria-describedby="hint" />
				</Field>
			</>,
		);

		expect(getTrigger()).toHaveAccessibleDescription(
			'In UTC. The key stops working after this day.',
		);
	});

	it('is invalid while the field is in danger', () => {
		const { rerender } = render(
			<Field label="Expiry" error="Pick a day.">
				<DatePicker placeholder="Select date" />
			</Field>,
		);

		expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
		expect(getTrigger()).toHaveAttribute('data-invalid');

		rerender(
			<Field label="Expiry" status="warning" message="This is soon.">
				<DatePicker placeholder="Select date" />
			</Field>,
		);

		expect(getTrigger()).not.toHaveAttribute('aria-invalid');
		expect(getTrigger()).not.toHaveAttribute('data-invalid');
	});

	it('keeps its own aria-invalid over the field status', () => {
		render(
			<Field label="Expiry" error="Pick a day.">
				<DatePicker placeholder="Select date" aria-invalid={false} />
			</Field>,
		);

		expect(getTrigger()).toHaveAttribute('aria-invalid', 'false');
	});

	it('takes aria-required from a required field, and no native required', () => {
		render(
			<Field label="Expiry" required>
				<DatePicker placeholder="Select date" name="expiry" />
			</Field>,
		);

		expect(getTrigger()).toHaveAttribute('aria-required', 'true');
		expect(document.querySelector('input[name="expiry"]')).not.toBeRequired();
	});

	it('keeps the native required of its own prop inside a field', () => {
		render(
			<Field label="Expiry">
				<DatePicker placeholder="Select date" name="expiry" required />
			</Field>,
		);

		expect(getTrigger()).toHaveAttribute('aria-required', 'true');
		expect(document.querySelector('input[name="expiry"]')).toBeRequired();
	});

	it('leaves a date picker outside a field as it was', () => {
		render(<DatePicker placeholder="Select date" aria-label="Expiry" />);

		const trigger = getTrigger();

		expect(trigger).not.toHaveAttribute('aria-describedby');
		expect(trigger).not.toHaveAttribute('aria-invalid');
		expect(trigger).not.toHaveAttribute('data-invalid');
		expect(trigger).not.toHaveAttribute('aria-required');
	});
});

describe('DatePickerField', () => {
	it('renders the label, the description and the message, wired to the trigger', () => {
		render(
			<DatePickerField
				label="Expiry"
				description="The key stops working after this day."
				error="Pick a day."
				placeholder="Select date"
				testId="expiry"
			/>,
		);

		const trigger = getTrigger();

		expect(trigger).toBe(screen.getByTestId('expiry'));
		expect(trigger).toHaveAccessibleDescription('Pick a day.');
		expect(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByTestId('expiry-label')).toHaveTextContent('Expiry');
		expect(screen.getByTestId('expiry-message')).toHaveTextContent('Pick a day.');
	});

	it('hands the day to onChange and submits it under name', async () => {
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<DatePickerField
					label="Expiry"
					placeholder="Select date"
					name="expiry"
					defaultValue={NOV_6_2026}
					onChange={onChange}
					testId="dp"
				/>
			</form>,
		);

		await openDatePicker();
		await userEvent.click(dayButton(NOV_10_2026));

		const form = screen.getByTestId('form') as HTMLFormElement;

		expect(onChange).toHaveBeenCalledWith(NOV_10_2026, { timezone: undefined });
		expect(new FormData(form).get('expiry')).toBe('2026-11-10');
	});

	it('takes the object a react-hook-form Controller hands over, null value included', async () => {
		const onChange = vi.fn();
		const onBlur = vi.fn();
		const ref = createRef<HTMLButtonElement>();
		const field = { value: null, onChange, onBlur, name: 'expiry', ref };

		render(
			<DatePickerField
				label="Expiry"
				placeholder="Select date"
				allowClear
				nullable
				testId="dp"
				{...field}
			/>,
		);

		expect(ref.current).toBe(getTrigger());
		expect(getTrigger()).toHaveTextContent('Select date');

		await openDatePicker();
		await userEvent.click(dayButton(NOV_10_2026));

		expect(onChange).toHaveBeenLastCalledWith(NOV_10_2026, { timezone: undefined });
		expect(getTrigger()).toHaveTextContent('Select date');
	});
});
