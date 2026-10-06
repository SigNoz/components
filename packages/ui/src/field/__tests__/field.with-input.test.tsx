import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../../input/input.js';
import { Field } from '../field.js';

describe('Field with an Input', () => {
	it('focuses the input on a label click', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Your Organisation Name" testId="field">
				<Input placeholder="For eg. Simpsonville..." />
			</Field>,
		);

		await user.click(screen.getByTestId('field-label'));

		expect(screen.getByRole('textbox')).toHaveFocus();
	});

	it('wires the full accessibility contract in one render', () => {
		render(
			<Field label="Organisation" error="This name is taken" required testId="field">
				<Input placeholder="For eg. Simpsonville..." />
			</Field>,
		);

		const input = screen.getByRole('textbox', { name: 'Organisation' });
		const message = screen.getByTestId('field-message');

		expect(input).toBeRequired();
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', message.id);
	});

	it('tints the input from the field status', () => {
		render(
			<Field label="Organisation" status="success" message="This name is available">
				<Input testId="org" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-status', 'success');
	});

	it('lets the input status win over the field status', () => {
		render(
			<Field label="Organisation" status="warning" message="Almost taken">
				<Input status="success" testId="org" />
			</Field>,
		);

		expect(screen.getByTestId('org')).toHaveAttribute('data-status', 'success');
	});
});
