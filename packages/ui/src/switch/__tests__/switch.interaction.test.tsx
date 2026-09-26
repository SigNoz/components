import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../switch.js';

function ControlledSwitch({ onChange }: { onChange: (checked: boolean) => void }): JSX.Element {
	const [checked, setChecked] = useState(false);

	return (
		<Switch
			color="primary"
			textPlacement="right"
			value={checked}
			onChange={(next) => {
				setChecked(next);
				onChange(next);
			}}
		>
			Wrap text
		</Switch>
	);
}

describe('Switch interaction', () => {
	it('toggles on click and reports the new state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch color="primary" textPlacement="right" onChange={onChange}>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch', { name: 'Wrap text' }));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('toggles back off', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch color="primary" textPlacement="right" defaultValue onChange={onChange}>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledWith(false);
		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	it('toggles when the label is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch color="primary" textPlacement="right" onChange={onChange}>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByText('Wrap text'));

		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('toggles when the description is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				onChange={onChange}
				description="Use the 24-hour convention"
			>
				Display in 24-hour format
			</Switch>,
		);

		await user.click(screen.getByText('Use the 24-hour convention'));

		expect(onChange).toHaveBeenCalledWith(true);
	});

	// The label wraps the control and Base UI renders a hidden input beside it, which is the
	// classic double-fire shape: the browser forwards a label click to the input while the switch
	// handles it too. One user action has to stay one change.
	it('calls onChange once per click, on the switch and on the label alike', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch color="primary" textPlacement="right" onChange={onChange}>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch'));
		expect(onChange).toHaveBeenCalledTimes(1);

		await user.click(screen.getByText('Wrap text'));
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it('toggles with the keyboard', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch color="primary" textPlacement="right" onChange={onChange}>
				Wrap text
			</Switch>,
		);

		await user.tab();
		expect(screen.getByRole('switch')).toHaveFocus();

		await user.keyboard(' ');

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('drives a controlled switch from its own state', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ControlledSwitch onChange={onChange} />);

		await user.click(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('never moves a controlled switch the consumer did not move', async () => {
		const user = userEvent.setup();
		render(
			<Switch color="primary" textPlacement="right" value={false} onChange={() => {}}>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch'));

		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	it('calls onChange with the checked state alone, not with Base UI event details', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch color="primary" textPlacement="right" onChange={onChange}>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch'));

		expect(onChange.mock.calls[0]).toEqual([true]);
	});
});

describe('Switch disabled', () => {
	it('does not toggle on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				disabled
				disabledTooltip="Ask an admin"
				onChange={onChange}
			>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	it('does not toggle from the label either', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				disabled
				disabledTooltip="Ask an admin"
				onChange={onChange}
			>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByText('Wrap text'));

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('Switch readOnly', () => {
	it('does not toggle on click', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				defaultValue
				readOnly
				readOnlyTooltip="Saving your changes"
				onChange={onChange}
			>
				Wrap text
			</Switch>,
		);

		await user.click(screen.getByRole('switch'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('outranks disabled: the switch is locked, not disabled', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				disabled
				disabledTooltip="Ask an admin"
				readOnly
				readOnlyTooltip="Saving your changes"
			/>,
		);

		const root = screen.getByTestId('switch');
		expect(root).not.toHaveAttribute('data-disabled');
		expect(root).not.toHaveAttribute('aria-disabled');
		expect(root).toHaveAttribute('data-readonly');
	});

	it('keeps its tab stop', async () => {
		const user = userEvent.setup();
		render(
			<Switch color="primary" textPlacement="right" readOnly readOnlyTooltip="Saving your changes">
				Wrap text
			</Switch>,
		);

		await user.tab();

		expect(screen.getByRole('switch')).toHaveFocus();
	});
});
