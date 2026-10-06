import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../input.js';

function ControlledInput() {
	const [value, setValue] = useState('');

	return (
		<Input
			aria-label="Organisation"
			value={value}
			onChange={(event) => setValue(event.target.value)}
		/>
	);
}

describe('Input interaction', () => {
	it('types into an uncontrolled input', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Organisation" defaultValue="Spring" />);

		const field = screen.getByRole('textbox');
		await user.type(field, 'field');

		expect(field).toHaveValue('Springfield');
	});

	it('types into a controlled input', async () => {
		const user = userEvent.setup();
		render(<ControlledInput />);

		const field = screen.getByRole('textbox');
		await user.type(field, 'Simpsonville');

		expect(field).toHaveValue('Simpsonville');
	});

	it('accepts a react-hook-form register() shaped spread', async () => {
		// The shape `register()` returns: optional callbacks and a ref, no `disabled` written.
		const registration: {
			name: string;
			onChange: (event: unknown) => Promise<boolean>;
			onBlur: (event: unknown) => Promise<boolean>;
			ref: (instance: HTMLInputElement | null) => void;
			disabled?: boolean;
		} = {
			name: 'organisation',
			onChange: vi.fn(async () => true),
			onBlur: vi.fn(async () => true),
			ref: vi.fn(),
		};
		const user = userEvent.setup();
		render(<Input aria-label="Organisation" {...registration} />);

		const field = screen.getByRole('textbox');
		await user.type(field, 'a');
		await user.tab();

		expect(field).toHaveAttribute('name', 'organisation');
		expect(registration.onChange).toHaveBeenCalled();
		expect(registration.onBlur).toHaveBeenCalled();
		expect(registration.ref).toHaveBeenCalledWith(field);
	});

	it('fires onWheel', () => {
		const onWheel = vi.fn();
		render(<Input aria-label="Count" onWheel={onWheel} />);

		screen.getByRole('textbox').dispatchEvent(new WheelEvent('wheel', { bubbles: true }));

		expect(onWheel).toHaveBeenCalledTimes(1);
	});

	it('blocks typing while disabled', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(
			<Input aria-label="Organisation" disabled disabledTooltip={undefined} onChange={onChange} />,
		);

		await user.keyboard('[Tab]');

		expect(screen.getByRole('textbox')).not.toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps a read-only input focusable without accepting changes', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		render(
			<Input
				aria-label="Organisation"
				value="Springfield"
				onChange={onChange}
				readOnly
				readOnlyTooltip={undefined}
			/>,
		);

		const field = screen.getByRole('textbox');
		await user.tab();

		expect(field).toHaveFocus();

		await user.keyboard('x');

		expect(onChange).not.toHaveBeenCalled();
		expect(field).toHaveValue('Springfield');
	});

	it('submits on Enter inside a form', async () => {
		const onSubmit = vi.fn((event: { preventDefault(): void }) => event.preventDefault());
		const user = userEvent.setup();
		render(
			<form onSubmit={onSubmit}>
				<Input aria-label="Organisation" name="organisation" />
			</form>,
		);

		await user.type(screen.getByRole('textbox'), 'Springfield[Enter]');

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('leaves a disabled input out of the form submit', () => {
		render(
			<form data-testid="form">
				<Input aria-label="Organisation" name="organisation" disabled disabledTooltip={undefined} />
			</form>,
		);

		const form = screen.getByTestId<HTMLFormElement>('form');

		expect(new FormData(form).has('organisation')).toBe(false);
	});
});
