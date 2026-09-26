import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox.js';

function ControlledCheckbox({ onChange }: { onChange: (checked: boolean) => void }): JSX.Element {
	const [checked, setChecked] = useState(false);

	return (
		<Checkbox
			color="primary"
			value={checked}
			onChange={(next) => {
				setChecked(next);
				onChange(next);
			}}
		>
			Accept the terms
		</Checkbox>
	);
}

describe('Checkbox interaction', () => {
	it('toggles on click and reports the new state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Accept the terms' }));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('toggles back off', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" defaultValue onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(false);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('toggles when the label is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByText('Accept the terms'));

		expect(onChange).toHaveBeenCalledWith(true);
	});

	// The root span carries a 2px hit-area ring around the 16px box, so the pointer target is the
	// whole span, not only the painted box.
	it('toggles from a click on the bare root span, hit area included', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Checkbox color="primary" aria-label="Accept the terms" onChange={onChange} />);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	// The label wraps the control and Base UI renders a hidden input beside it, which is the
	// classic double-fire shape: the browser forwards a label click to the input while the checkbox
	// handles it too. One user action has to stay one change.
	it('calls onChange once per click, on the checkbox and on the label alike', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));
		expect(onChange).toHaveBeenCalledTimes(1);

		await user.click(screen.getByText('Accept the terms'));
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it('toggles with Space', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.tab();
		expect(screen.getByRole('checkbox')).toHaveFocus();

		await user.keyboard(' ');

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	// Enter belongs to the form: Base UI submits the owning form instead of toggling, like a
	// native checkbox.
	it('does not toggle on Enter', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.tab();
		expect(screen.getByRole('checkbox')).toHaveFocus();

		await user.keyboard('{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('drives a controlled checkbox from its own state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledCheckbox onChange={onChange} />);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('never moves a controlled checkbox the consumer did not move', async () => {
		const user = userEvent.setup();
		render(
			<Checkbox color="primary" value={false} onChange={() => {}}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('calls onChange with the checked state alone, not with Base UI event details', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange.mock.calls[0]).toEqual([true]);
	});

	// The mixed state is one more value of `value`, so a click still reports the next boolean.
	it('still reports the next boolean while indeterminate', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" value="indeterminate" onChange={onChange}>
				Select all
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange.mock.calls[0]).toEqual([true]);
	});
});

describe('Checkbox disabled', () => {
	it('does not toggle on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" disabled disabledTooltip="Ask an admin" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('does not toggle from the label either', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox color="primary" disabled disabledTooltip="Ask an admin" onChange={onChange}>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByText('Accept the terms'));

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('Checkbox readOnly', () => {
	it('does not toggle on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Checkbox
				color="primary"
				defaultValue
				readOnly
				readOnlyTooltip="Saving your changes"
				onChange={onChange}
			>
				Accept the terms
			</Checkbox>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('outranks disabled: the checkbox is locked, not disabled', () => {
		render(
			<Checkbox
				color="primary"
				testId="checkbox"
				aria-label="Accept the terms"
				disabled
				disabledTooltip="Ask an admin"
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		const root = screen.getByTestId('checkbox');
		expect(root).not.toHaveAttribute('data-disabled');
		expect(root).not.toHaveAttribute('aria-disabled');
		expect(root).toHaveAttribute('data-readonly');
		expect(root).toHaveAttribute('aria-readonly', 'true');
	});

	it('keeps its tab stop', async () => {
		const user = userEvent.setup();
		render(
			<Checkbox color="primary" readOnly readOnlyTooltip="Saving your changes">
				Accept the terms
			</Checkbox>,
		);

		await user.tab();

		expect(screen.getByRole('checkbox')).toHaveFocus();
	});
});
