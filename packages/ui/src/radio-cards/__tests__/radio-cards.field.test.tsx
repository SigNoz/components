import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { RadioCards, RadioCardsField } from '../index.js';
import { installTokens, ITEMS } from './radio-cards.test-utils.js';

installTokens();

describe('RadioCardsField name', () => {
	it('names the radio group with the legend, so the fieldset and the cards read the same name', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} testId="signal" />);

		const legend = screen.getByTestId('signal-label');
		const radioGroup = screen.getByRole('radiogroup', { name: 'Signal' });

		expect(legend.tagName).toBe('LEGEND');
		expect(radioGroup).toHaveAttribute('aria-labelledby', legend.id);
		expect(screen.getByRole('group', { name: 'Signal' }).tagName).toBe('FIELDSET');
	});

	it('names each card after its item', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} />);

		expect(screen.getByRole('radio', { name: 'Logs' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeInTheDocument();
	});

	it('lets an aria-label of its own win over the legend', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} aria-label="Own name" />);

		expect(screen.getByRole('radiogroup', { name: 'Own name' })).toBeInTheDocument();
	});

	it('lets an aria-labelledby of its own win over the legend', () => {
		render(
			<div>
				<span id="own-name">Own name</span>
				<RadioCardsField label="Signal" items={ITEMS} aria-labelledby="own-name" />
			</div>,
		);

		expect(screen.getByRole('radiogroup', { name: 'Own name' })).toBeInTheDocument();
	});

	it('renders the same name from a hand-written Field.Group', () => {
		render(
			<Field.Group label="Signal">
				<RadioCards items={ITEMS} />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup', { name: 'Signal' })).toBeInTheDocument();
	});
});

describe('RadioCardsField description, invalid and required', () => {
	it('lists the description in the fieldset description', () => {
		render(
			<RadioCardsField
				label="Signal"
				items={ITEMS}
				description="What the panel plots"
				testId="signal"
			/>,
		);

		expect(screen.getByTestId('signal-description')).toHaveAttribute(
			'data-slot',
			'field-description',
		);
		expect(screen.getByRole('group', { name: 'Signal' })).toHaveAccessibleDescription(
			'What the panel plots',
		);
	});

	it('sets aria-invalid on the radio group with danger, and not with warning', () => {
		const { rerender } = render(
			<RadioCardsField label="Signal" items={ITEMS} error="Pick a signal" testId="signal" />,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByTestId('signal-message')).toHaveTextContent('Pick a signal');

		rerender(
			<RadioCardsField
				label="Signal"
				items={ITEMS}
				status="warning"
				message="Slow"
				testId="signal"
			/>,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
	});

	it('lets an aria-invalid of its own win over the field status', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} error="Pick" aria-invalid="false" />);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'false');
	});

	it('shows the asterisk in the legend and sets aria-required on the radio group', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} required />);

		expect(document.querySelector('[data-slot="field-required-marker"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
	});

	it('is not required without the prop', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} />);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required');
	});
});

describe('RadioCardsField native required', () => {
	it('announces the required field with aria-required and no native required', () => {
		const { container } = render(
			<RadioCardsField label="Signal" items={ITEMS} name="signal" required />,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).toBeNull();
	});

	it('keeps the native required for its own required inside a Field.Group', () => {
		const { container } = render(
			<Field.Group label="Signal" required>
				<RadioCards items={ITEMS} name="signal" required />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
		expect(container.querySelectorAll('input[required]')).toHaveLength(3);
	});

	it('lets an aria-required of its own win over the field', () => {
		render(
			<Field.Group label="Signal" required>
				<RadioCards items={ITEMS} aria-required="false" />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'false');
	});

	it('lets its own required=false win over the field', () => {
		const { container } = render(
			<Field.Group label="Signal" required>
				<RadioCards items={ITEMS} required={false} />
			</Field.Group>,
		);

		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required');
		expect(container.querySelector('input[required]')).toBeNull();
	});

	it('lets a plain form submit while nothing is picked in a required field', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<RadioCardsField label="Signal" items={ITEMS} name="signal" required />
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
				<RadioCards aria-label="Signal" items={ITEMS} name="signal" required />
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(false);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});

describe('RadioCardsField props split', () => {
	it('gives the radio group the testId and the parts the same prefix, and the fieldset none', () => {
		render(<RadioCardsField label="Signal" items={ITEMS} description="Plotted" testId="signal" />);

		expect(screen.getByTestId('signal')).toBe(screen.getByRole('radiogroup'));
		expect(screen.getByTestId('signal-label')).toBeInTheDocument();
		expect(screen.getByTestId('signal-description')).toBeInTheDocument();
		expect(screen.getByTestId('signal-item-logs')).toBeInTheDocument();
		expect(document.querySelector('[data-slot="field-group"]')).not.toHaveAttribute('data-testid');
	});

	it('hands columns, name, aria and data attributes to the radio group', () => {
		render(
			<RadioCardsField
				label="Signal"
				items={ITEMS}
				columns={2}
				name="signal"
				data-analytics="signal"
				defaultValue="traces"
			/>,
		);

		const radioGroup = screen.getByRole('radiogroup');

		expect(radioGroup).toHaveAttribute('data-columns', '2');
		expect(radioGroup).toHaveAttribute('data-analytics', 'signal');
		expect(document.querySelector('input[name="signal"]')).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('hands the ref to the radio group', () => {
		const ref = createRef<HTMLDivElement>();
		render(<RadioCardsField label="Signal" items={ITEMS} ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('radiogroup'));
	});

	it('drops className, style and htmlFor that get past the types', () => {
		const props = { className: 'styled', style: { color: 'red' }, htmlFor: 'x' } as never;

		render(<RadioCardsField label="Signal" items={ITEMS} {...props} />);

		expect(screen.getByRole('radiogroup')).not.toHaveClass('styled');
		expect(screen.getByRole('radiogroup')).not.toHaveAttribute('for');
	});
});

describe('RadioCardsField value', () => {
	it('reports the checked value through onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioCardsField label="Signal" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('stays controlled by value', async () => {
		const user = userEvent.setup();

		function Controlled() {
			const [value, setValue] = useState<string | null>('logs');

			return <RadioCardsField label="Signal" items={ITEMS} value={value} onChange={setValue} />;
		}

		render(<Controlled />);
		await user.click(screen.getByRole('radio', { name: 'Metrics' }));

		expect(screen.getByRole('radio', { name: 'Metrics' })).toBeChecked();
		expect(screen.getByRole('radio', { name: 'Logs' })).not.toBeChecked();
	});

	it('clears with allowClear and reports null', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCardsField
				label="Signal"
				items={ITEMS}
				allowClear
				defaultValue="logs"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(null);
	});
});

describe('RadioCardsField.Multiple', () => {
	it('names the group with the legend and takes no aria-invalid, which role=group does not allow', () => {
		render(
			<RadioCardsField.Multiple
				label="Tools"
				items={ITEMS}
				error="Pick a tool"
				required
				testId="tools"
			/>,
		);

		const group = screen.getByTestId('tools');

		expect(group).toHaveAttribute('role', 'group');
		expect(group).toHaveAttribute('aria-labelledby', screen.getByTestId('tools-label').id);
		expect(group).not.toHaveAttribute('aria-invalid');
		expect(screen.getByTestId('tools-message')).toHaveTextContent('Pick a tool');
		expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-required', 'true');
	});

	it('announces the required field on the cards with aria-required and no native required', async () => {
		const user = userEvent.setup();
		const { container } = render(
			<RadioCardsField.Multiple label="Tools" items={ITEMS} name="tools" required />,
		);

		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).toHaveAttribute('aria-required', 'true');
		}

		expect(container.querySelector('input[required]')).toBeNull();

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));

		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).not.toHaveAttribute('aria-required');
		}
	});

	it('keeps the native required on the cards for its own required inside a Field.Group', () => {
		const { container } = render(
			<Field.Group label="Tools" required>
				<RadioCards.Multiple items={ITEMS} name="tools" required />
			</Field.Group>,
		);

		for (const card of screen.getAllByRole('checkbox')) {
			expect(card).toHaveAttribute('aria-required', 'true');
		}

		expect(container.querySelectorAll('input[required]')).toHaveLength(3);
	});

	it('lets a plain form submit while no card is checked in a required field', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<RadioCardsField.Multiple label="Tools" items={ITEMS} name="tools" required />
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(true);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('lets an aria-label of its own win over the legend', () => {
		render(<RadioCardsField.Multiple label="Tools" items={ITEMS} aria-label="Own name" />);

		expect(screen.getByRole('group', { name: 'Own name' })).toBeInTheDocument();
	});

	it('reports the checked list through onChange and hands the ref to the group', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const ref = createRef<HTMLDivElement>();
		render(<RadioCardsField.Multiple label="Tools" items={ITEMS} onChange={onChange} ref={ref} />);

		await user.click(screen.getByRole('checkbox', { name: 'Logs' }));
		await user.click(screen.getByRole('checkbox', { name: 'Metrics' }));

		expect(onChange).toHaveBeenLastCalledWith(['logs', 'metrics']);
		expect(ref.current).toHaveAttribute('data-multiple');
	});
});
