import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
];

describe('RadioGroupField name', () => {
	it('names the radio group with the legend, so the fieldset and the group read the same name', () => {
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} testId="retention" />);

		const legend = screen.getByTestId('retention-label');
		const radioGroup = screen.getByRole('radiogroup', { name: 'Retention' });

		expect(legend.tagName).toBe('LEGEND');
		expect(radioGroup).toHaveAttribute('aria-labelledby', legend.id);
		expect(screen.getByRole('group', { name: 'Retention' }).tagName).toBe('FIELDSET');
	});

	it('names each radio after its item', () => {
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} />);

		expect(screen.getByRole('radio', { name: '7 days' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: '30 days' })).toBeInTheDocument();
	});

	it('lets an aria-labelledby of its own win over the legend', () => {
		render(
			<div>
				<span id="own-name">Own name</span>
				<RadioGroupField
					label="Retention"
					color="primary"
					items={ITEMS}
					aria-labelledby="own-name"
				/>
			</div>,
		);

		expect(screen.getByRole('radiogroup', { name: 'Own name' })).toBeInTheDocument();
	});

	it('lets an aria-label of its own win over the legend', () => {
		render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} aria-label="Own name" />,
		);

		expect(screen.getByRole('radiogroup', { name: 'Own name' })).toBeInTheDocument();
	});

	it('renders the same name from a hand-written Field.Group', () => {
		render(
			<Field.Group label="Retention">
				<RadioGroup color="primary" items={ITEMS} />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup', { name: 'Retention' })).toBeInTheDocument();
	});
});

describe('RadioGroupField description and message', () => {
	it('lists the description in the fieldset description', () => {
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				description="How long the data is kept"
				testId="retention"
			/>,
		);

		const description = screen.getByTestId('retention-description');

		expect(description).toHaveAttribute('data-slot', 'field-description');
		expect(screen.getByRole('group', { name: 'Retention' })).toHaveAttribute(
			'aria-describedby',
			description.id,
		);
		expect(screen.getByRole('group', { name: 'Retention' })).toHaveAccessibleDescription(
			'How long the data is kept',
		);
	});

	it('replaces the description with the message and announces it', () => {
		const { rerender } = render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				description="How long the data is kept"
				testId="retention"
			/>,
		);

		rerender(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				description="How long the data is kept"
				error="Pick a period"
				testId="retention"
			/>,
		);

		expect(screen.queryByTestId('retention-description')).not.toBeInTheDocument();
		expect(screen.getByRole('group', { name: 'Retention' })).toHaveAccessibleDescription(
			'Pick a period',
		);
		expect(document.querySelector('[data-slot="field-announcer"]')).toHaveTextContent(
			'Pick a period',
		);
	});

	it('adds the labelTooltip text to the fieldset description', () => {
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				labelTooltip="Applies to every signal"
				testId="retention"
			/>,
		);

		expect(screen.getByTestId('retention-label-tooltip')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByRole('group', { name: 'Retention' })).toHaveAccessibleDescription(
			'Applies to every signal',
		);
	});
});

describe('RadioGroupField invalid and required', () => {
	it('sets aria-invalid on the radio group with danger', () => {
		const { rerender } = render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} error="Pick a period" />,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
		expect(document.querySelector('[data-slot="field-group"]')).toHaveAttribute(
			'data-status',
			'danger',
		);

		rerender(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				status="danger"
				message="Pick a period"
			/>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
	});

	it('leaves aria-invalid off for warning, success and no status', () => {
		const { rerender } = render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				status="warning"
				message="Short"
			/>,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');

		rerender(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				status="success"
				message="Fine"
			/>,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');

		rerender(<RadioGroupField label="Retention" color="primary" items={ITEMS} error={undefined} />);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
	});

	it('lets an aria-invalid of its own win over the field status', () => {
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				error="Pick a period"
				aria-invalid="false"
			/>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'false');
	});

	it('shows the asterisk in the legend and sets aria-required on the radio group', () => {
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} required />);

		const marker = document.querySelector('[data-slot="field-required-marker"]');

		expect(marker).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByRole('radiogroup')).toBeRequired();
		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
		expect(screen.getByRole('radiogroup', { name: 'Retention' })).toBeInTheDocument();
	});

	it('is not required without the prop, and its own required=false wins', () => {
		const { rerender } = render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} />,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required');

		rerender(
			<Field.Group label="Retention" required>
				<RadioGroup color="primary" items={ITEMS} required={false} />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required');
	});

	it('announces the required field with aria-required and no native required', () => {
		const { container } = render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} name="retention" required />,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).toBeNull();
	});

	it('keeps the native required for its own required inside a Field.Group', () => {
		const { container } = render(
			<Field.Group label="Retention" required>
				<RadioGroup color="primary" items={ITEMS} name="retention" required />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).not.toBeNull();
	});

	it('lets an aria-required of its own win over the field', () => {
		render(
			<Field.Group label="Retention" required>
				<RadioGroup color="primary" items={ITEMS} aria-required="false" />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'false');
	});

	it('lets a plain form submit while nothing is picked in a required field', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<RadioGroupField
					label="Retention"
					color="primary"
					items={ITEMS}
					name="retention"
					required
				/>
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(true);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('blocks a plain form with its own required while nothing is picked', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<RadioGroup
					color="primary"
					items={ITEMS}
					name="retention"
					required
					aria-label="Retention"
				/>
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(false);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});

describe('RadioGroupField props split', () => {
	it('gives the radio group the testId and the parts the same prefix, and the fieldset none', () => {
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				description="Kept"
				testId="retention"
			/>,
		);

		expect(screen.getByTestId('retention')).toBe(screen.getByRole('radiogroup'));
		expect(screen.getByTestId('retention-label')).toBeInTheDocument();
		expect(screen.getByTestId('retention-description')).toBeInTheDocument();
		expect(screen.getByTestId('retention-item-7')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="field-group"]')).not.toHaveAttribute('data-testid');
	});

	it('hands name, color, aria and data attributes to the radio group', () => {
		render(
			<RadioGroupField
				label="Retention"
				color="success"
				items={ITEMS}
				name="retention"
				data-analytics="retention"
				defaultValue="30"
			/>,
		);

		const radioGroup = screen.getByRole('radiogroup');

		expect(radioGroup).toHaveAttribute('data-color', 'success');
		expect(radioGroup).toHaveAttribute('data-analytics', 'retention');
		expect(document.querySelector('input[name="retention"]')).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
	});

	it('hands the ref to the hidden input of a radio, not to the root', () => {
		const ref = createRef<HTMLInputElement>();
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).not.toBe(screen.getByRole('radiogroup'));
	});

	it('drops className, style and htmlFor that get past the types', () => {
		const props = { className: 'styled', style: { color: 'red' }, htmlFor: 'x' } as never;

		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} {...props} />);

		expect(screen.getByRole('radiogroup')).not.toHaveClass('styled');
		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('for');
	});
});

describe('RadioGroupField value', () => {
	it('reports the checked value through onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith('30');
		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
	});

	it('stays controlled by value', async () => {
		const user = userEvent.setup();

		function Controlled() {
			const [value, setValue] = useState<string | null>('7');

			return (
				<RadioGroupField
					label="Retention"
					color="primary"
					items={ITEMS}
					value={value}
					onChange={setValue}
				/>
			);
		}

		render(<Controlled />);

		expect(screen.getByRole('radio', { name: '7 days' })).toBeChecked();

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
		expect(screen.getByRole('radio', { name: '7 days' })).not.toBeChecked();
	});

	it('moves the focus into the group with the ref and the arrows keep working', async () => {
		const user = userEvent.setup();
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} defaultValue="7" />);

		await user.tab();

		expect(screen.getByRole('radio', { name: '7 days' })).toHaveFocus();

		await user.keyboard('{ArrowDown}');

		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
	});
});
