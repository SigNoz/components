import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pill } from '../pill.js';

function renderForm(pill: React.ReactNode, onSubmit = vi.fn()) {
	render(
		<form
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
		>
			<input name="name" defaultValue="" data-testid="input" />
			{pill}
		</form>,
	);

	return onSubmit;
}

describe('Pill inside a form', () => {
	it('does not submit the form, its default type is button', async () => {
		const user = userEvent.setup();
		const onSubmit = renderForm(
			<Pill variant="outlined" color="primary">
				Filter
			</Pill>,
		);

		await user.click(screen.getByRole('button'));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('does not submit the form from a Closeable body or its close button', async () => {
		const user = userEvent.setup();
		const onSubmit = renderForm(<Pill.Closeable onClose={vi.fn()}>env:prod</Pill.Closeable>);

		await user.click(screen.getByRole('button', { name: 'env:prod' }));
		await user.click(screen.getByRole('button', { name: 'Remove env:prod' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});
