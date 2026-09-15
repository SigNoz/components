import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

function ControlledGroup({ onChange }: { onChange: (value: string | null) => void }): JSX.Element {
	const [value, setValue] = useState<string | null>(null);

	return (
		<RadioGroup
			color="primary"
			items={ITEMS}
			value={value}
			onChange={(next) => {
				setValue(next);
				onChange(next);
			}}
		/>
	);
}

describe('RadioGroup interaction', () => {
	it('checks an item on click and reports its value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioGroup color="primary" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(onChange).toHaveBeenCalledWith('production');
		expect(screen.getByRole('radio', { name: 'Production' })).toBeChecked();
	});

	it('checks an item when its label is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioGroup color="primary" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByText('Staging'));

		expect(onChange).toHaveBeenCalledWith('staging');
	});

	it('moves the checked item with the arrow keys', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioGroup color="primary" items={ITEMS} defaultValue="staging" onChange={onChange} />);

		await user.tab();
		await user.keyboard('{ArrowDown}');

		expect(onChange).toHaveBeenLastCalledWith('production');
		expect(screen.getByRole('radio', { name: 'Production' })).toBeChecked();
	});

	it('drives a controlled group from its own state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledGroup onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: 'Staging' }));

		expect(onChange).toHaveBeenCalledWith('staging');
		expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();
	});

	it('never moves a controlled group the consumer did not move', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS} value="staging" onChange={() => {}} />);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();
		expect(screen.getByRole('radio', { name: 'Production' })).not.toBeChecked();
	});

	it('calls onChange with the value alone, not with Base UI event details', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioGroup color="primary" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(onChange.mock.calls[0]).toEqual(['production']);
	});

	it('calls onChange once per pick, not once per render', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<RadioGroup color="primary" items={ITEMS} onChange={onChange} />);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(onChange).toHaveBeenCalledTimes(1);
	});
});

describe('RadioGroup disabled', () => {
	it('reports itself disabled on the root', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				testId="group"
			/>,
		);

		expect(screen.getByTestId('group')).toHaveAttribute('data-disabled');
	});

	it('does not change value on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Production' })).not.toBeChecked();
	});
});

describe('RadioGroup readOnly', () => {
	it('outranks disabled: the group is locked, not disabled', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="staging"
				disabled
				disabledTooltip="Ask an admin"
				readOnly
				readOnlyTooltip="Saving your changes"
				testId="group"
			/>,
		);

		expect(screen.getByTestId('group')).not.toHaveAttribute('data-disabled');
		expect(screen.getByRole('radio', { name: 'Staging' })).toHaveAttribute('data-readonly');
		expect(screen.getByRole('radio', { name: 'Staging' })).not.toHaveAttribute('data-disabled');
	});

	it('does not change value on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="staging"
				readOnly
				readOnlyTooltip="Saving your changes"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Staging' })).toBeChecked();
	});

	it('keeps the items reachable, unlike disabled', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="staging"
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		expect(screen.getByRole('radio', { name: 'Staging' })).toHaveAttribute('data-readonly');
		expect(screen.getByRole('radio', { name: 'Staging' })).not.toHaveAttribute('data-disabled');
	});

	it('announces itself on the group, not on each radio', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="staging"
				readOnly
				readOnlyTooltip="Saving your changes"
				testId="group"
			/>,
		);

		expect(screen.getByTestId('group')).toHaveAttribute('aria-readonly', 'true');

		for (const radio of screen.getAllByRole('radio')) {
			expect(radio).not.toHaveAttribute('aria-readonly');
		}
	});

	// The one case where suppressing the interaction silently is worse than refusing it out loud:
	// arrow keys move focus and selection together, so a group that stops moving focus reads as
	// broken rather than as locked.
	it('keeps arrow keys moving focus while the value stays put', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="staging"
				readOnly
				readOnlyTooltip="Saving your changes"
				onChange={onChange}
			/>,
		);

		const staging = screen.getByRole('radio', { name: 'Staging' });
		const production = screen.getByRole('radio', { name: 'Production' });

		await user.tab();
		expect(staging).toHaveFocus();

		await user.keyboard('{ArrowDown}');

		expect(production).toHaveFocus();
		expect(staging).toBeChecked();
		expect(production).not.toBeChecked();
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('RadioGroup item disabled', () => {
	it('blocks that item alone', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
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
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Production' }));
		expect(onChange).not.toHaveBeenCalled();

		await user.click(screen.getByRole('radio', { name: 'Staging' }));
		expect(onChange).toHaveBeenCalledWith('staging');
	});

	it('marks the row and the control disabled', () => {
		render(
			<RadioGroup
				color="primary"
				items={[
					{
						label: 'Production',
						value: 'production',
						disabled: true,
						disabledTooltip: 'Ask an admin',
						testId: 'production-radio',
					},
				]}
			/>,
		);

		const control = screen.getByTestId('production-radio');
		expect(control).toHaveAttribute('data-disabled');
		expect(control.closest('[data-slot="radio-group-item"]')).toHaveAttribute('data-disabled');
	});
});
