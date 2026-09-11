import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button.js';

function renderForm(button: React.ReactNode, onSubmit = vi.fn()) {
	render(
		<form
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
		>
			<input name="name" defaultValue="" data-testid="input" />
			{button}
		</form>,
	);

	return onSubmit;
}

describe('Button inside a form', () => {
	it('submits the form with type="submit"', async () => {
		const user = userEvent.setup();
		const onSubmit = renderForm(
			<Button size="md" variant="solid" color="primary" type="submit">
				Submit
			</Button>,
		);

		await user.click(screen.getByRole('button'));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('does not submit the form with the default type', async () => {
		const user = userEvent.setup();
		const onSubmit = renderForm(
			<Button size="md" variant="solid" color="primary">
				Do something else
			</Button>,
		);

		await user.click(screen.getByRole('button'));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('resets the form fields with type="reset"', async () => {
		const user = userEvent.setup();
		renderForm(
			<Button size="md" variant="solid" color="primary" type="reset">
				Reset
			</Button>,
		);
		const input = screen.getByTestId('input');

		await user.type(input, 'typed');
		expect(input).toHaveValue('typed');

		await user.click(screen.getByRole('button'));

		expect(input).toHaveValue('');
	});

	it('does not submit while disabled', async () => {
		const user = userEvent.setup();
		const onSubmit = renderForm(
			<Button
				size="md"
				variant="solid"
				color="primary"
				type="submit"
				disabled
				disabledTooltip="Fill the form first"
			>
				Submit
			</Button>,
		);

		await user.click(screen.getByRole('button'));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('does not submit twice while loading', async () => {
		const user = userEvent.setup();
		const onSubmit = renderForm(
			<Button size="md" variant="solid" color="primary" type="submit" loading>
				Submitting…
			</Button>,
		);

		await user.click(screen.getByRole('button'));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});
