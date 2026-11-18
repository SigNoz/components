import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox.js';

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

describe('Checkbox form reset', () => {
	it('brings an uncontrolled checkbox back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<Checkbox
					color="primary"
					aria-label="Accept"
					name="accept"
					defaultValue
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).not.toBeChecked();
		expect(submitted()).toEqual([]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('checkbox')).toBeChecked();
		});
		expect(submitted()).toEqual([['accept', 'on']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('brings back the indeterminate dash of defaultValue', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Checkbox color="primary" aria-label="Select all" defaultValue="indeterminate" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
		});
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Checkbox color="primary" aria-label="Accept" value onChange={() => undefined} />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<Checkbox color="primary" aria-label="Accept" defaultValue />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('checkbox'));
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});
});
