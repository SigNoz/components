import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../input.js';

describe('Input.Password', () => {
	it('starts hidden and toggles to text and back', async () => {
		const user = userEvent.setup();
		render(<Input.Password aria-label="Password" testId="password" />);

		const field = screen.getByLabelText('Password');
		const toggle = screen.getByRole('button', { name: 'Show password' });

		expect(field).toHaveAttribute('type', 'password');

		await user.click(toggle);

		expect(field).toHaveAttribute('type', 'text');
		expect(screen.getByRole('button', { name: 'Hide password' })).toBe(toggle);

		await user.click(toggle);

		expect(field).toHaveAttribute('type', 'password');
	});

	it('keeps the toggle out of the tab order and disables it with the field', () => {
		render(
			<Input.Password
				aria-label="Password"
				disabled
				disabledTooltip={undefined}
				testId="password"
			/>,
		);

		const toggle = screen.getByTestId('password-toggle');

		expect(toggle).toHaveAttribute('tabindex', '-1');
		expect(toggle).toBeDisabled();
	});

	it('marks the frame as the password member', () => {
		render(<Input.Password aria-label="Password" testId="password" />);

		expect(screen.getByTestId('password')).toHaveAttribute('data-member', 'password');
	});
});

describe('Input.TextArea', () => {
	it('renders a textarea with rows', async () => {
		const user = userEvent.setup();
		render(<Input.TextArea aria-label="Description" rows={4} testId="description" />);

		const field = screen.getByRole('textbox');

		expect(field).toBeInstanceOf(HTMLTextAreaElement);
		expect(field).toHaveAttribute('rows', '4');
		expect(screen.getByTestId('description')).toHaveAttribute('data-member', 'textarea');

		await user.type(field, 'line one{Enter}line two');

		expect(field).toHaveValue('line one\nline two');
	});

	it('shows the status icon with a status', () => {
		render(<Input.TextArea aria-label="Description" status="danger" testId="description" />);

		expect(screen.getByTestId('description-status')).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
	});
});

describe('Input.Number', () => {
	it('reports the parsed value, and null when cleared', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" defaultValue={5} onChange={onChange} testId="count" />);

		const field = screen.getByRole('textbox');
		await user.clear(field);

		expect(onChange).toHaveBeenLastCalledWith(null);

		await user.type(field, '42');

		expect(onChange).toHaveBeenLastCalledWith(42);
	});

	it('steps with the buttons and stays inside min and max', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(
			<Input.Number
				aria-label="Count"
				defaultValue={9}
				min={0}
				max={10}
				onChange={onChange}
				testId="count"
			/>,
		);

		const stepUp = screen.getByTestId('count-step-up');
		await user.click(stepUp);

		expect(onChange).toHaveBeenLastCalledWith(10);

		await user.click(stepUp);

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('steps with the arrow keys', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(<Input.Number aria-label="Count" defaultValue={5} onChange={onChange} testId="count" />);

		const field = screen.getByRole('textbox');
		field.focus();
		await user.keyboard('{ArrowUp}');

		expect(onChange).toHaveBeenLastCalledWith(6);

		await user.keyboard('{ArrowDown}{ArrowDown}');

		expect(onChange).toHaveBeenLastCalledWith(4);
	});

	it('hides the steppers with controls={false}', () => {
		render(<Input.Number aria-label="Count" controls={false} testId="count" />);

		expect(screen.queryByTestId('count-step-up')).toBeNull();
		expect(screen.queryByTestId('count-step-down')).toBeNull();
	});

	it('marks the frame as the number member with the shared attributes', () => {
		render(<Input.Number aria-label="Count" size="large" status="warning" testId="count" />);

		const frame = screen.getByTestId('count');

		expect(frame).toHaveAttribute('data-slot', 'input');
		expect(frame).toHaveAttribute('data-member', 'number');
		expect(frame).toHaveAttribute('data-size', 'large');
		expect(frame).toHaveAttribute('data-status', 'warning');
		expect(screen.getByTestId('count-status')).toBeInTheDocument();
	});

	it('blocks stepping while read-only', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(
			<Input.Number
				aria-label="Count"
				value={5}
				onChange={onChange}
				readOnly
				readOnlyTooltip={undefined}
				testId="count"
			/>,
		);

		await user.click(screen.getByTestId('count-step-up'));

		expect(onChange).not.toHaveBeenCalled();
	});
});
