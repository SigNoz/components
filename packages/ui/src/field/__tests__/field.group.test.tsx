import { Info } from '@signozhq/icons';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../../checkbox/checkbox.js';
import { Input } from '../../input/input.js';
import { RadioGroup } from '../../radio-group/radio-group.js';
import { Field } from '../field.js';
import { describedByIds, slot } from './field.test-utils.js';

const ENVIRONMENTS = [
	{ value: 'staging', label: 'Staging' },
	{ value: 'production', label: 'Production' },
];

describe('Field.Group rendering', () => {
	it('renders a fieldset named by its legend', () => {
		render(
			<Field.Group label="Environment" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const group = screen.getByTestId('group');
		const legend = screen.getByTestId('group-label');

		expect(group.tagName).toBe('FIELDSET');
		expect(group).toHaveAttribute('data-slot', 'field-group');
		expect(legend.tagName).toBe('LEGEND');
		expect(legend).toHaveAttribute('data-slot', 'field-label');
		expect(legend).toHaveTextContent('Environment');
		expect(group.firstElementChild).toBe(legend);
		expect(screen.getByRole('group', { name: 'Environment' })).toBe(group);
	});

	it('renders the legend, the controls and the row in that order', () => {
		render(
			<Field.Group label="Environment" description="Where the data goes" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const group = screen.getByTestId('group');

		expect(Array.from(group.children).map((child) => child.getAttribute('data-slot'))).toEqual([
			'field-label',
			'field-group-content',
			'field-description',
			'field-announcer',
		]);
	});

	it('stamps the required marker, the icon and the testId parts', () => {
		render(
			<Field.Group
				label="Environment"
				labelIcon={<Info />}
				labelTooltip="Why we ask"
				description="Where the data goes"
				required
				testId="group"
			>
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const legend = screen.getByTestId('group-label');

		expect(slot(legend, 'field-label-icon')).toHaveAttribute('aria-hidden', 'true');
		expect(slot(legend, 'field-required-marker')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('group-label-tooltip')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('group-description')).toHaveTextContent('Where the data goes');
		expect(screen.getByRole('group')).toHaveAttribute('data-required');
	});

	it('sets no data-testid on any part without a testId', () => {
		const { container } = render(
			<Field.Group
				label="Environment"
				labelIcon={<Info />}
				labelTooltip="Why we ask"
				error="Pick one"
				required
			>
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const parts = container.querySelectorAll('[data-slot^="field"]');

		expect(parts.length).toBeGreaterThanOrEqual(8);

		for (const part of parts) {
			expect(part, part.getAttribute('data-slot') ?? '').not.toHaveAttribute('data-testid');
		}
	});

	it('mirrors the status and the required flag on the fieldset', () => {
		const { rerender } = render(
			<Field.Group label="Environment" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		expect(screen.getByTestId('group')).not.toHaveAttribute('data-status');
		expect(screen.getByTestId('group')).not.toHaveAttribute('data-required');

		rerender(
			<Field.Group label="Environment" error="Pick one" required testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		expect(screen.getByTestId('group')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByTestId('group')).toHaveAttribute('data-required');
	});

	it('renders <No label> for an empty label', () => {
		render(
			<Field.Group label="" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		expect(screen.getByTestId('group-label')).toHaveTextContent('<No label>');
		expect(screen.getByRole('group', { name: '<No label>' })).toBeInTheDocument();
	});

	it('forwards id, aria-* and data-* to the fieldset', () => {
		render(
			<Field.Group
				label="Environment"
				id="env-group"
				aria-label="Environment group"
				data-analytics="env"
				testId="group"
			>
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const group = screen.getByTestId('group');

		expect(group).toHaveAttribute('id', 'env-group');
		expect(group).toHaveAttribute('data-analytics', 'env');
		expect(group).toHaveAttribute('aria-label', 'Environment group');
	});
});

describe('Field.Group accessibility', () => {
	it('names a RadioGroup through the legend', () => {
		render(
			<Field.Group label="Environment" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const radioGroup = screen.getByRole('radiogroup', { name: 'Environment' });

		expect(radioGroup).toHaveAttribute('aria-labelledby', screen.getByTestId('group-label').id);
		expect(screen.getByRole('radio', { name: 'Staging' })).toBeInTheDocument();
	});

	it('describes the fieldset with the description', () => {
		render(
			<Field.Group label="Environment" description="Where the data goes" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const group = screen.getByRole('group', { name: 'Environment' });

		expect(describedByIds(group)).toEqual([screen.getByTestId('group-description').id]);
		expect(group).toHaveAccessibleDescription('Where the data goes');
	});

	it('describes the fieldset with the message, then the tooltip text', () => {
		render(
			<Field.Group label="Environment" error="Pick one" labelTooltip="Why we ask" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const group = screen.getByRole('group', { name: 'Environment' });
		const ids = describedByIds(group);

		expect(ids).toHaveLength(2);
		expect(ids[0]).toBe(screen.getByTestId('group-message').id);
		expect(document.getElementById(ids[1] as string)).toHaveTextContent('Why we ask');
		expect(group).toHaveAccessibleDescription('Pick one Why we ask');
	});

	it('lists its own aria-describedby ahead of the row', () => {
		render(
			<div>
				<span id="hint">Applies to every region</span>
				<Field.Group
					label="Environment"
					description="Where the data goes"
					aria-describedby="hint"
					testId="group"
				>
					<RadioGroup color="primary" items={ENVIRONMENTS} />
				</Field.Group>
			</div>,
		);

		expect(describedByIds(screen.getByRole('group'))).toEqual([
			'hint',
			screen.getByTestId('group-description').id,
		]);
	});

	it('keeps the description row id while the message replaces it', () => {
		const { rerender } = render(
			<Field.Group label="Environment" description="Where the data goes" testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);
		const row = screen.getByTestId('group-description');

		rerender(
			<Field.Group
				label="Environment"
				description="Where the data goes"
				error="Pick one"
				testId="group"
			>
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		const message = screen.getByTestId('group-message');

		expect(message).toBe(row);
		expect(message).toHaveAttribute('data-slot', 'field-message');
		expect(within(message).getByTestId('solid-alert-triangle')).toBeInTheDocument();
		expect(slot(screen.getByTestId('group'), 'field-announcer')).toHaveTextContent('Pick one');
	});

	it('renders no row and no aria-describedby without a description or a message', () => {
		render(
			<Field.Group label="Environment" error={undefined} testId="group">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		expect(screen.getByTestId('group')).not.toHaveAttribute('aria-describedby');
		expect(slot(screen.getByTestId('group'), 'field-message')).toBeNull();
		expect(screen.getByTestId('group')).not.toHaveAttribute('data-status');
	});

	it('gives a RadioGroup inside a danger group aria-invalid', () => {
		render(
			<Field.Group label="Environment" error="Pick one">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
	});

	it('does not set aria-invalid for a warning', () => {
		render(
			<Field.Group label="Environment" status="warning" message="Staging resets nightly">
				<RadioGroup color="primary" items={ENVIRONMENTS} />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
		expect(screen.getByRole('group')).not.toHaveAttribute('aria-invalid');
	});
});

describe('Field.Group around several controls', () => {
	it('names a list of Checkboxes by their own text, with distinct ids', () => {
		render(
			<Field.Group label="Notify me by" testId="group">
				<Checkbox color="primary">Email</Checkbox>
				<Checkbox color="primary">SMS</Checkbox>
			</Field.Group>,
		);

		const email = screen.getByRole('checkbox', { name: 'Email' });
		const sms = screen.getByRole('checkbox', { name: 'SMS' });

		expect(screen.getByRole('group', { name: 'Notify me by' })).toContainElement(email);
		expect(screen.getByRole('group', { name: 'Notify me by' })).toContainElement(sms);
		expect(email.id).not.toBe(sms.id);
	});

	it('does not point the legend at a control', () => {
		render(
			<Field.Group label="Amount" testId="group">
				<Input aria-label="Value" />
				<Input aria-label="Unit" />
			</Field.Group>,
		);

		expect(screen.getByTestId('group-label')).not.toHaveAttribute('for');
		expect(screen.getByRole('textbox', { name: 'Value' })).not.toHaveAttribute('id');
		expect(screen.getByRole('textbox', { name: 'Unit' })).not.toHaveAttribute('id');
	});

	it('hands the status to the controls inside, without a control id', () => {
		render(
			<Field.Group label="Amount" error="Pick a value and a unit" testId="group">
				<Input aria-label="Value" testId="value" />
				<Input aria-label="Unit" testId="unit" />
			</Field.Group>,
		);

		expect(screen.getByTestId('value')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByTestId('unit')).toHaveAttribute('data-status', 'danger');
		expect(screen.getByRole('textbox', { name: 'Value' })).toHaveAttribute('aria-invalid', 'true');
	});

	it('keeps the controls the Input inside a group takes from its own props', () => {
		render(
			<Field.Group label="Amount" required testId="group">
				<Input id="value-input" aria-label="Value" />
			</Field.Group>,
		);

		expect(screen.getByRole('textbox')).toHaveAttribute('id', 'value-input');
		expect(screen.getByRole('textbox')).toBeRequired();
	});
});

describe('Field inside a Field.Group', () => {
	it('names each nested field by its own label and the fieldset by the legend', () => {
		render(
			<Field.Group label="Range" description="Both ends count" testId="group">
				<Field label="From" testId="from">
					<Input />
				</Field>
				<Field label="To" error="Must come after the start" testId="to">
					<Input />
				</Field>
			</Field.Group>,
		);

		const from = screen.getByRole('textbox', { name: 'From' });
		const to = screen.getByRole('textbox', { name: 'To' });

		expect(screen.getByRole('group', { name: 'Range' })).toContainElement(from);
		expect(screen.getByTestId('from-label')).toHaveAttribute('for', from.id);
		expect(screen.getByTestId('to-label')).toHaveAttribute('for', to.id);
		expect(from.id).not.toBe(to.id);
	});

	it('gives the inputs the nested field message, not the one of the group', () => {
		render(
			<Field.Group label="Range" description="Both ends count" testId="group">
				<Field label="From" testId="from">
					<Input />
				</Field>
				<Field label="To" error="Must come after the start" testId="to">
					<Input />
				</Field>
			</Field.Group>,
		);

		const from = screen.getByRole('textbox', { name: 'From' });
		const to = screen.getByRole('textbox', { name: 'To' });

		expect(from).not.toHaveAttribute('aria-describedby');
		expect(from).not.toHaveAttribute('aria-invalid');
		expect(describedByIds(to)).toEqual([screen.getByTestId('to-message').id]);
		expect(to).toHaveAttribute('aria-invalid', 'true');
		expect(describedByIds(screen.getByRole('group', { name: 'Range' }))).toEqual([
			screen.getByTestId('group-description').id,
		]);
	});

	it('focuses the nested control when its label is clicked', async () => {
		const user = userEvent.setup();
		render(
			<Field.Group label="Range" testId="group">
				<Field label="From" testId="from">
					<Input />
				</Field>
				<Field label="To" testId="to">
					<Input />
				</Field>
			</Field.Group>,
		);

		await user.click(screen.getByTestId('to-label'));

		expect(screen.getByRole('textbox', { name: 'To' })).toHaveFocus();
	});
});
