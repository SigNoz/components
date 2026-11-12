import { DatePickerField, type DatePickerFieldProps } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, RefAttributes } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import styles from './date-picker-field.stories.module.css';
import { datePickerArgTypes } from './shared/date-picker-arg-types.js';
import { fieldLabelArgTypes, fieldParameters } from './shared/field-arg-types.js';
import { waitForEffects } from './shared/play.js';

// The field owns `required`, which marks the label and is not the date picker's native one.
const { required: _required, ...datePickerControlArgTypes } = datePickerArgTypes ?? {};

// The stories write the date picker without `nullable`, so their args take the props it has then.
type PlainDatePickerField = (
	props: Extract<DatePickerFieldProps, { nullable?: never }> & RefAttributes<HTMLButtonElement>,
) => ReactElement;

// A day in a month that is over, so the trigger reads the same on every day the story runs.
const SEPTEMBER_14_2026 = new Date(2026, 8, 14);

/**
 * `DatePickerField` is `DatePicker` inside a `Field`, in one element. It is documented on the
 * `DatePicker` page, `date-picker.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<PlainDatePickerField> = {
	title: 'Primitive Components/Field/DatePickerField',
	component: DatePickerField as PlainDatePickerField,
	tags: ['!autodocs'],
	parameters: fieldParameters,
	argTypes: {
		...datePickerControlArgTypes,
		...fieldLabelArgTypes,
		id: {
			control: 'text',
			description:
				"Lands on the trigger, as on `DatePicker`. Without it the trigger takes the field's control id, and the label points at it either way.",
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the trigger as `data-testid`, and names every part of the popup. The field parts take it as their prefix: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`. The field root gets no `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Expires on',
		description: 'The key stops working after this day.',
		placeholder: 'Select date',
		defaultValue: SEPTEMBER_14_2026,
		allowClear: true,
		onChange: fn(),
		onBlur: fn(),
	},
};

export default meta;

type Story = StoryObj<PlainDatePickerField>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// `States` holds the states of the field, and `Field` covers how they look.
		chromatic: { disableSnapshot: true },
	},
};

/**
 * The marker, the description and the status of the field, each wired to the trigger. The message
 * takes the place of the description in the same row, `required` sets `aria-required` on the
 * trigger, and only `danger` sets `aria-invalid` and turns the border red.
 */
export const States: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<DatePickerField
				label="Expires on"
				required
				description="The key stops working after this day."
				placeholder="Select date"
				defaultValue={SEPTEMBER_14_2026}
			/>
			<DatePickerField
				label="Starts on"
				labelTooltip="In the time zone of the workspace."
				description="The first day the schedule runs."
				placeholder="Select date"
			/>
			<DatePickerField
				label="Ends on"
				status="warning"
				message="The schedule runs for less than a week."
				placeholder="Select date"
				defaultValue={new Date(2026, 8, 18)}
			/>
			<DatePickerField
				label="Review on"
				required
				error="Pick the day of the review."
				placeholder="Select date"
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const expires = canvas.getByRole('combobox', { name: 'Expires on' });

		await expect(expires).toHaveAttribute('aria-required', 'true');
		await expect(expires).not.toHaveAttribute('aria-invalid');
		await expect(expires).toHaveAccessibleDescription('The key stops working after this day.');

		await expect(canvas.getByRole('combobox', { name: 'Starts on' })).toHaveAccessibleDescription(
			'The first day the schedule runs. In the time zone of the workspace.',
		);

		const ends = canvas.getByRole('combobox', { name: 'Ends on' });

		await expect(ends).toHaveAccessibleDescription('The schedule runs for less than a week.');
		await expect(ends).not.toHaveAttribute('aria-invalid');

		const review = canvas.getByRole('combobox', { name: 'Review on' });

		await expect(review).toHaveAttribute('aria-invalid', 'true');
		await expect(review).toHaveAttribute('data-invalid');
		await expect(review).toHaveAccessibleDescription('Pick the day of the review.');
	},
};

/**
 * A click on the label focuses the trigger and leaves the popup closed. Opening and closing the
 * popup does not call `onBlur`, and leaving the trigger does, once.
 */
export const LabelAndBlur: Story = {
	args: {
		description: undefined,
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
				<button type="button">After</button>
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		const trigger = canvas.getByRole('combobox', { name: 'Expires on' });

		await userEvent.click(canvas.getByText('Expires on'));

		await expect(trigger).toHaveFocus();
		await expect(within(document.body).queryByRole('dialog')).toBeNull();

		await userEvent.keyboard('{ArrowDown}');
		await within(document.body).findByRole('dialog');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(trigger).toHaveFocus());

		await expect(args.onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => expect(args.onBlur).toHaveBeenCalledTimes(1));
	},
};
