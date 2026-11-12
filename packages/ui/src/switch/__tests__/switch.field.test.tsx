import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { SwitchField } from '../presets/switch-field.js';
import { Switch } from '../switch.js';

function withoutIds(html: string): string {
	return html.replace(/(base-ui-)?:r[0-9a-z]+:/g, ':id:');
}

describe('SwitchField', () => {
	it('names the switch with the label above it', () => {
		render(<SwitchField label="Send alerts" color="primary" />);

		expect(screen.getByRole('switch', { name: 'Send alerts' })).toBeInTheDocument();
		expect(screen.getByText('Send alerts').closest('label')).not.toBeNull();
	});

	it('describes the switch with the description', () => {
		render(
			<SwitchField label="Send alerts" color="primary" description="Email the on-call channel." />,
		);

		expect(screen.getByRole('switch')).toHaveAccessibleDescription('Email the on-call channel.');
	});

	it('describes the switch with the message in place of the description', () => {
		render(
			<SwitchField
				label="Send alerts"
				color="primary"
				description="Email the on-call channel."
				status="warning"
				message="No channel is set up yet."
			/>,
		);

		expect(screen.getByRole('switch')).toHaveAccessibleDescription('No channel is set up yet.');
	});

	it('adds the label tooltip text after the row', () => {
		render(
			<SwitchField
				label="Send alerts"
				color="primary"
				labelTooltip="Sent once per rule"
				description="Email the on-call channel."
			/>,
		);

		expect(screen.getByRole('switch')).toHaveAccessibleDescription(
			'Email the on-call channel. Sent once per rule',
		);
	});

	it('sets aria-invalid with an error and with a danger status', () => {
		const { rerender } = render(
			<SwitchField label="Send alerts" color="primary" error="Required" />,
		);

		expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');

		rerender(
			<SwitchField label="Send alerts" color="primary" status="danger" message="Required" />,
		);

		expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
	});

	it('leaves aria-invalid off for warning, success and a valid field', () => {
		const { rerender } = render(
			<SwitchField label="Send alerts" color="primary" status="warning" message="Careful" />,
		);

		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');

		rerender(
			<SwitchField label="Send alerts" color="primary" status="success" message="Checked" />,
		);

		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');

		rerender(<SwitchField label="Send alerts" color="primary" error={undefined} />);

		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
	});

	it('marks the label and the switch as required', () => {
		render(<SwitchField label="Accept the terms" color="primary" required />);

		expect(screen.getByRole('switch')).toHaveAttribute('aria-required', 'true');
		expect(screen.getByRole('switch', { name: 'Accept the terms' })).toBeInTheDocument();
		expect(document.querySelector('[data-slot="field-required-marker"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
	});

	it('is not required by default', () => {
		render(<SwitchField label="Send alerts" color="primary" />);

		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-required');
		expect(document.querySelector('[data-slot="field-required-marker"]')).toBeNull();
	});

	it('names the field parts from the testId and keeps the testId on the switch', () => {
		render(
			<SwitchField
				label="Send alerts"
				color="primary"
				labelTooltip="Sent once per rule"
				description="Email the on-call channel."
				testId="alerts"
			/>,
		);

		expect(screen.getByTestId('alerts')).toBe(screen.getByRole('switch'));
		expect(screen.getByTestId('alerts-label')).toHaveTextContent('Send alerts');
		expect(screen.getByTestId('alerts-label-tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('alerts-description')).toHaveTextContent(
			'Email the on-call channel.',
		);
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-testid');
	});

	it('names the message part while a message shows', () => {
		render(<SwitchField label="Send alerts" color="primary" error="Required" testId="alerts" />);

		expect(screen.getByTestId('alerts-message')).toHaveTextContent('Required');
	});

	it('adds no testId to any part without one', () => {
		render(<SwitchField label="Send alerts" color="primary" description="Help" />);

		expect(document.querySelectorAll('[data-testid]')).toHaveLength(0);
	});

	it('hands every other prop to the switch', () => {
		render(
			<SwitchField
				label="Send alerts"
				color="danger"
				name="alerts"
				id="alerts-switch"
				aria-keyshortcuts="A"
				data-source="settings"
			/>,
		);

		const control = screen.getByRole('switch');

		expect(control).toHaveAttribute('data-color', 'danger');
		expect(control).toHaveAttribute('aria-keyshortcuts', 'A');
		expect(control).toHaveAttribute('data-source', 'settings');
		expect(document.querySelector('input[name="alerts"]')).not.toBeNull();
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-source');
	});

	it('keeps the name when the switch brings its own id', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<SwitchField label="Send alerts" color="primary" id="own-id" onChange={onChange} />);

		await user.click(screen.getByText('Send alerts'));

		expect(screen.getByRole('switch', { name: 'Send alerts' })).toBeChecked();
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('forwards the ref to the switch', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<SwitchField label="Send alerts" color="primary" ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('switch'));
	});

	it('toggles from a click on the label, a click on the switch and the space key', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<SwitchField label="Send alerts" color="primary" onChange={onChange} />);

		await user.click(screen.getByText('Send alerts'));
		expect(onChange).toHaveBeenLastCalledWith(true);
		expect(screen.getByRole('switch')).toBeChecked();

		await user.click(screen.getByRole('switch'));
		expect(onChange).toHaveBeenLastCalledWith(false);
		expect(screen.getByRole('switch')).not.toBeChecked();

		screen.getByRole('switch').focus();
		await user.keyboard(' ');
		expect(onChange).toHaveBeenLastCalledWith(true);
	});

	it('reports a boolean, never an event, and follows a controlled value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState(false);

			return (
				<SwitchField
					label="Send alerts"
					color="primary"
					value={value}
					onChange={(next) => {
						onChange(next);
						setValue(next);
					}}
				/>
			);
		}

		render(<Controlled />);
		await user.click(screen.getByRole('switch'));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('does not toggle while read only, and keeps the reason', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<SwitchField
				label="Send alerts"
				color="primary"
				value
				onChange={onChange}
				readOnly
				readOnlyTooltip="Managed by your admin"
			/>,
		);

		await user.click(screen.getByRole('switch'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('switch')).toHaveAttribute('aria-readonly', 'true');
	});

	it('takes the value, onChange, name and ref a Controller hands over', async () => {
		const user = userEvent.setup();
		const ref = createRef<HTMLSpanElement>();
		const onChange = vi.fn();
		const field = { value: true, onChange, ref, name: 'enabled' };
		render(<SwitchField label="Send alerts" color="primary" {...field} error="Required" />);

		const control = screen.getByRole('switch', { name: 'Send alerts' });

		expect(control).toBeChecked();
		expect(ref.current).toBe(control);
		expect(document.querySelector('input[name="enabled"]')).toBeChecked();

		await user.click(control);

		expect(onChange).toHaveBeenCalledWith(false);
	});

	it('renders the DOM of the hand-written Field and Switch', () => {
		const { container: shorthand } = render(
			<SwitchField
				label="Send alerts"
				color="primary"
				labelTooltip="Sent once per rule"
				description="Email the on-call channel."
				required
				error="Required"
			/>,
		);
		const { container: written } = render(
			<Field
				label="Send alerts"
				labelTooltip="Sent once per rule"
				description="Email the on-call channel."
				required
				error="Required"
			>
				<Switch color="primary" textPlacement="right" />
			</Field>,
		);

		expect(withoutIds(shorthand.innerHTML)).toBe(withoutIds(written.innerHTML));
	});
});

describe('Switch inside a hand-written Field', () => {
	it('takes required from the field', () => {
		render(
			<Field label="Accept the terms" required>
				<Switch color="primary" textPlacement="right" />
			</Field>,
		);

		expect(screen.getByRole('switch', { name: 'Accept the terms' })).toHaveAttribute(
			'aria-required',
			'true',
		);
	});

	it('lets its own required win over the field', () => {
		render(
			<Field label="Accept the terms" required>
				<Switch color="primary" textPlacement="right" required={false} />
			</Field>,
		);

		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-required');
	});

	it('announces the field required with aria-required and no native required', () => {
		const { container } = render(
			<Field label="Accept the terms" required>
				<Switch color="primary" textPlacement="right" name="terms" />
			</Field>,
		);

		expect(screen.getByRole('switch')).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).toBeNull();
	});

	it('keeps the native required for its own required inside a field', () => {
		const { container } = render(
			<Field label="Accept the terms" required>
				<Switch color="primary" textPlacement="right" name="terms" required />
			</Field>,
		);

		expect(screen.getByRole('switch')).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).not.toBeNull();
	});

	it('lets an aria-required of its own win over the field', () => {
		render(
			<Field label="Accept the terms" required>
				<Switch color="primary" textPlacement="right" aria-required="false" />
			</Field>,
		);

		expect(screen.getByRole('switch')).toHaveAttribute('aria-required', 'false');
	});

	it('lets a plain form submit while the required field switch is off', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<Field label="Accept the terms" required>
					<Switch color="primary" textPlacement="right" name="terms" />
				</Field>
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(true);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('blocks a plain form with its own required while the switch is off', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<Switch color="primary" textPlacement="right" name="terms" required aria-label="Terms" />
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(false);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('is not made required by a required group around it', () => {
		render(
			<Field.Group label="Notifications" required>
				<Switch color="primary" textPlacement="right" aria-label="Email" />
				<Switch color="primary" textPlacement="right" aria-label="Slack" />
			</Field.Group>,
		);

		expect(screen.getByRole('switch', { name: 'Email' })).not.toHaveAttribute('aria-required');
		expect(screen.getByRole('switch', { name: 'Slack' })).not.toHaveAttribute('aria-required');
	});

	it('is not required outside a field', () => {
		render(<Switch color="primary" textPlacement="right" aria-label="Email" />);

		expect(screen.getByRole('switch')).not.toHaveAttribute('aria-required');
	});
});
