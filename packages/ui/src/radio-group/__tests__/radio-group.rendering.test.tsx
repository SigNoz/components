import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RADIO_GROUP_EMPTY_LABEL } from '../constants.js';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

describe('RadioGroup rendering', () => {
	it('renders one radio per item, named by its label', () => {
		render(<RadioGroup color="primary" items={ITEMS} />);

		expect(screen.getAllByRole('radio')).toHaveLength(2);
		expect(screen.getByRole('radio', { name: 'Staging' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Production' })).toBeInTheDocument();
	});

	it('groups them under a radiogroup role', () => {
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);

		expect(screen.getByRole('radiogroup')).toBe(screen.getByTestId('group'));
	});

	it('renders nothing but the group for an empty list', () => {
		render(<RadioGroup color="primary" items={[]} testId="group" />);

		expect(screen.getByTestId('group')).toBeEmptyDOMElement();
	});

	it('mirrors color and textOverflow on the root', () => {
		render(<RadioGroup color="danger" textOverflow="wrap" items={ITEMS} testId="group" />);

		const group = screen.getByTestId('group');
		expect(group).toHaveAttribute('data-slot', 'radio-group');
		expect(group).toHaveAttribute('data-color', 'danger');
		expect(group).toHaveAttribute('data-text-overflow', 'wrap');
	});

	it('defaults textOverflow to ellipsis', () => {
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);

		expect(screen.getByTestId('group')).toHaveAttribute('data-text-overflow', 'ellipsis');
	});

	it('stamps the item slots', () => {
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);
		const group = screen.getByTestId('group');

		expect(group.querySelectorAll('[data-slot="radio-group-item"]')).toHaveLength(2);
		expect(group.querySelectorAll('[data-slot="radio-group-control"]')).toHaveLength(2);
		expect(group.querySelectorAll('[data-slot="radio-group-label"]')).toHaveLength(2);
	});

	it('forwards an item testId to its control', () => {
		render(
			<RadioGroup
				color="primary"
				items={[{ label: 'Staging', value: 'staging', testId: 'staging-radio' }]}
			/>,
		);

		expect(screen.getByTestId('staging-radio')).toBe(
			screen.getByRole('radio', { name: 'Staging' }),
		);
	});

	it('forwards id, className, style, aria and data attributes to the root', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				testId="group"
				id="environment"
				className="custom"
				style={{ gap: '10px' }}
				aria-label="Environment"
				data-analytics="env-picker"
			/>,
		);

		const group = screen.getByTestId('group');
		expect(group).toHaveAttribute('id', 'environment');
		expect(group).toHaveClass('custom');
		expect(group).toHaveStyle({ gap: '10px' });
		expect(group).toHaveAttribute('aria-label', 'Environment');
		expect(group).toHaveAttribute('data-analytics', 'env-picker');
	});

	it('checks the defaultValue on first render', () => {
		render(<RadioGroup color="primary" items={ITEMS} defaultValue="production" />);

		expect(screen.getByRole('radio', { name: 'Production' })).toBeChecked();
		expect(screen.getByRole('radio', { name: 'Staging' })).not.toBeChecked();
	});

	it('checks the controlled value, and nothing for null', () => {
		const { rerender } = render(
			<RadioGroup color="primary" items={ITEMS} value="staging" onChange={() => {}} />,
		);
		expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();

		rerender(<RadioGroup color="primary" items={ITEMS} value={null} onChange={() => {}} />);

		expect(screen.getByRole('radio', { name: 'Staging' })).not.toBeChecked();
		expect(screen.getByRole('radio', { name: 'Production' })).not.toBeChecked();
	});

	it('submits under the group name', () => {
		render(<RadioGroup color="primary" items={ITEMS} name="environment" defaultValue="staging" />);

		const inputs = document.querySelectorAll<HTMLInputElement>('input[name="environment"]');
		expect(inputs).toHaveLength(2);
	});

	it('marks the group required', () => {
		render(<RadioGroup color="primary" items={ITEMS} required testId="group" />);

		expect(screen.getByTestId('group')).toHaveAttribute('aria-required', 'true');
	});

	it('names the group from aria-labelledby', () => {
		render(
			<>
				<span id="environment-question">Which environment?</span>
				<RadioGroup
					color="primary"
					items={ITEMS}
					testId="group"
					aria-labelledby="environment-question"
				/>
			</>,
		);

		expect(screen.getByRole('radiogroup', { name: 'Which environment?' })).toBe(
			screen.getByTestId('group'),
		);
	});
});

// The stylesheet reads these off the radio rather than the group, and the row wrapper picks them
// back up with `:has()`. Nothing else pins them, so a Base UI change that moved one would only
// show up as a silent styling regression.
describe('RadioGroup styling hooks', () => {
	it('marks each radio checked or unchecked', () => {
		render(<RadioGroup color="primary" items={ITEMS} defaultValue="staging" />);

		const staging = screen.getByRole('radio', { name: 'Staging' });
		const production = screen.getByRole('radio', { name: 'Production' });

		expect(staging).toHaveAttribute('data-checked');
		expect(staging).not.toHaveAttribute('data-unchecked');
		expect(production).toHaveAttribute('data-unchecked');
		expect(production).not.toHaveAttribute('data-checked');
	});

	it('marks every radio disabled when the group is', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip="Locked while the workspace migrates"
			/>,
		);

		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).toHaveAttribute('data-disabled');
		}
	});

	it('keeps one tab stop, on the checked item', () => {
		render(<RadioGroup color="primary" items={ITEMS} defaultValue="production" />);

		expect(screen.getByRole('radio', { name: 'Production' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('radio', { name: 'Staging' })).toHaveAttribute('tabindex', '-1');
	});

	it('moves that tab stop to the first item when nothing is checked', () => {
		render(<RadioGroup color="primary" items={ITEMS} />);

		expect(screen.getByRole('radio', { name: 'Staging' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('radio', { name: 'Production' })).toHaveAttribute('tabindex', '-1');
	});

	// The radio is a `<span role="radio">`, never a native button, so `disabled` is announced
	// rather than applied. The group stays reachable, which is the only reason `disabledTooltip`
	// can be read at all.
	it('keeps the disabled group hoverable and in the tab order', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="staging"
				disabled
				disabledTooltip="Locked while the workspace migrates"
				testId="group"
			/>,
		);

		const staging = screen.getByRole('radio', { name: 'Staging' });
		expect(staging.tagName).toBe('SPAN');
		expect(staging).not.toHaveAttribute('disabled');
		expect(staging).toHaveAttribute('aria-disabled', 'true');
		expect(staging).toHaveAttribute('tabindex', '0');
		expect(screen.getByTestId('group')).toHaveAttribute('aria-disabled', 'true');
	});

	it('marks the one disabled item without touching its peers', () => {
		render(
			<RadioGroup
				color="primary"
				items={[
					{ label: 'Staging', value: 'staging' },
					{
						label: 'Production',
						value: 'production',
						disabled: true,
						disabledTooltip: 'Ask an admin',
					},
				]}
			/>,
		);

		expect(screen.getByRole('radio', { name: 'Production' })).toHaveAttribute('data-disabled');
		expect(screen.getByRole('radio', { name: 'Staging' })).not.toHaveAttribute('data-disabled');
	});
});

describe('RadioGroup role', () => {
	it('is the radiogroup itself, with its state announced on the root', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				required
				readOnly
				readOnlyTooltip="Saving your changes"
				testId="group"
			/>,
		);

		const group = screen.getByRole('radiogroup');
		expect(group).toBe(screen.getByTestId('group'));
		expect(group).toHaveAttribute('aria-required', 'true');
		expect(group).toHaveAttribute('aria-readonly', 'true');
	});
});

describe('RadioGroup empty label', () => {
	it.each([
		['null', null],
		['undefined', undefined],
		['false', false],
		['an empty string', ''],
	])('falls back to the placeholder when the label is %s', (_name, label) => {
		render(<RadioGroup color="primary" items={[{ label, value: 'staging' }]} testId="group" />);

		const labelEl = screen
			.getByTestId('group')
			.querySelector('[data-slot="radio-group-label"]') as HTMLElement;
		expect(labelEl).toHaveTextContent(RADIO_GROUP_EMPTY_LABEL);
		expect(labelEl).toHaveAttribute('data-empty-label');
	});

	it('names the radio from the placeholder, so the row is still reachable', () => {
		render(<RadioGroup color="primary" items={[{ label: null, value: 'staging' }]} />);

		expect(screen.getByRole('radio', { name: RADIO_GROUP_EMPTY_LABEL })).toBeInTheDocument();
	});

	it('leaves a real label alone', () => {
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);

		for (const labelEl of screen
			.getByTestId('group')
			.querySelectorAll('[data-slot="radio-group-label"]')) {
			expect(labelEl).not.toHaveAttribute('data-empty-label');
		}
	});
});

describe('RadioGroup derived item testIds', () => {
	it('names every row from the group testId', () => {
		render(<RadioGroup color="primary" items={ITEMS} testId="group" />);

		expect(screen.getByTestId('group-item-staging')).toBe(
			screen.getByRole('radio', { name: 'Staging' }),
		);
		expect(screen.getByTestId('group-item-production')).toBe(
			screen.getByRole('radio', { name: 'Production' }),
		);
	});

	it("lets an item's own testId win", () => {
		render(
			<RadioGroup
				color="primary"
				testId="group"
				items={[
					{ label: 'Staging', value: 'staging', testId: 'staging-radio' },
					{ label: 'Production', value: 'production' },
				]}
			/>,
		);

		expect(screen.getByTestId('staging-radio')).toBe(
			screen.getByRole('radio', { name: 'Staging' }),
		);
		expect(screen.queryByTestId('group-item-staging')).toBeNull();
		expect(screen.getByTestId('group-item-production')).toBeInTheDocument();
	});

	it('leaves the rows unnamed when the group has no testId', () => {
		render(<RadioGroup color="primary" items={ITEMS} />);

		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).not.toHaveAttribute('data-testid');
		}
	});
});
