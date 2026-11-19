import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../input.js';

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

describe('Input.Number form reset', () => {
	it('brings an uncontrolled field back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<Input.Number aria-label="Replicas" name="replicas" defaultValue={3} onChange={onChange} />
				<button type="reset">Reset</button>
			</form>,
		);

		const field = screen.getByRole('textbox', { name: 'Replicas' });
		await user.clear(field);
		await user.type(field, '7');

		expect(field).toHaveValue('7');
		expect(submitted()).toEqual([['replicas', '7']]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(field).toHaveValue('3');
		});
		expect(submitted()).toEqual([['replicas', '3']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('empties a field with no defaultValue', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Input.Number aria-label="Replicas" name="replicas" />
				<button type="reset">Reset</button>
			</form>,
		);

		const field = screen.getByRole('textbox', { name: 'Replicas' });
		await user.type(field, '7');

		expect(submitted()).toEqual([['replicas', '7']]);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(field).toHaveValue('');
		});
		expect(submitted()).toEqual([['replicas', '']]);
	});

	it('follows the step buttons back to defaultValue', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Input.Number aria-label="Replicas" name="replicas" defaultValue={3} testId="replicas" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByTestId('replicas-step-up'));
		await user.click(screen.getByTestId('replicas-step-up'));

		expect(screen.getByRole('textbox', { name: 'Replicas' })).toHaveValue('5');

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(screen.getByRole('textbox', { name: 'Replicas' })).toHaveValue('3');
		});
	});

	it('follows a form attribute to a form outside the field', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Input.Number aria-label="Replicas" name="replicas" form="outer" defaultValue={3} />
				<form id="outer" data-testid="form">
					<button type="reset">Reset</button>
				</form>
			</>,
		);

		const field = screen.getByRole('textbox', { name: 'Replicas' });
		await user.clear(field);
		await user.type(field, '7');
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(field).toHaveValue('3');
		});
		expect(submitted()).toEqual([['replicas', '3']]);
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<Input.Number aria-label="Replicas" name="replicas" value={7} onChange={() => undefined} />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(screen.getByRole('textbox', { name: 'Replicas' })).toHaveValue('7');
		expect(submitted()).toEqual([['replicas', '7']]);
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<Input.Number aria-label="Replicas" name="replicas" defaultValue={3} />
				<button type="reset">Reset</button>
			</form>,
		);

		const field = screen.getByRole('textbox', { name: 'Replicas' });
		await user.clear(field);
		await user.type(field, '7');
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(field).toHaveValue('7');
		expect(submitted()).toEqual([['replicas', '7']]);
	});
});
