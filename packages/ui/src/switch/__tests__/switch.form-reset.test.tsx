import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../switch.js';

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

describe('Switch form reset', () => {
	it('brings an uncontrolled switch back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<Switch
					color="primary"
					textPlacement="right"
					aria-label="Notify"
					name="notify"
					defaultValue
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('switch'));

		expect(screen.getByRole('switch')).not.toBeChecked();
		expect(submitted()).toEqual([]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('switch')).toBeChecked();
		});
		expect(submitted()).toEqual([['notify', 'on']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('turns a switch with no defaultValue back off', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Switch color="primary" textPlacement="right" aria-label="Notify" name="notify" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('switch'));

		expect(submitted()).toEqual([['notify', 'on']]);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('switch')).not.toBeChecked();
		});
		expect(submitted()).toEqual([]);
	});

	it('resets through form.reset()', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Switch color="primary" textPlacement="right" aria-label="Notify" defaultValue />
			</form>,
		);

		await user.click(screen.getByRole('switch'));
		(screen.getByTestId('form') as HTMLFormElement).reset();

		await waitFor(() => {
			expect(screen.getByRole('switch')).toBeChecked();
		});
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Switch
					color="primary"
					textPlacement="right"
					aria-label="Notify"
					value
					onChange={() => undefined}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('switch')).toBeChecked();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<Switch color="primary" textPlacement="right" aria-label="Notify" defaultValue />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('switch'));
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('switch')).not.toBeChecked();
	});
});
