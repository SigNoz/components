import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FormEvent, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../button/button.js';
import { Field } from '../../field/field.js';
import { InputField } from '../../input/presets/input-field.js';
import { Form } from '../form.js';

function SignUp({ onValid }: { onValid: () => void }) {
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | undefined>(undefined);

	const submit = (event: FormEvent<HTMLFormElement>): void => {
		const next = email.includes('@') ? undefined : 'Enter an email address';

		setError(next);

		if (next === undefined) {
			onValid();
			return;
		}

		(event.currentTarget.elements.namedItem('email') as HTMLInputElement).focus();
	};

	return (
		<Form onSubmit={submit} testId="form">
			<InputField
				label="Email"
				name="email"
				required
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				error={error}
				testId="email"
			/>
			<Button size="md" variant="solid" color="primary" type="submit">
				Create account
			</Button>
		</Form>
	);
}

describe('Form with plain state', () => {
	it('shows the error of a field after a submit that fails, and takes it away once fixed', async () => {
		const user = userEvent.setup();
		const onValid = vi.fn();
		render(<SignUp onValid={onValid} />);
		const input = screen.getByRole('textbox', { name: 'Email' });

		await user.click(screen.getByRole('button', { name: 'Create account' }));

		expect(onValid).not.toHaveBeenCalled();
		expect(screen.getByTestId('email-message')).toHaveTextContent('Enter an email address');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAccessibleDescription('Enter an email address');
		expect(input).toHaveFocus();

		await user.type(input, 'alex@example.com');
		await user.click(screen.getByRole('button', { name: 'Create account' }));

		expect(onValid).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId('email-message')).toBeNull();
		expect(input).not.toHaveAttribute('aria-invalid');
	});

	it('announces the message once, through the live region of the field', async () => {
		const user = userEvent.setup();
		render(<SignUp onValid={() => {}} />);

		await user.click(screen.getByRole('button', { name: 'Create account' }));

		const regions = screen.getByTestId('form').querySelectorAll('[aria-live="polite"]:not(:empty)');

		expect(regions).toHaveLength(1);
		expect(regions[0]).toHaveTextContent('Enter an email address');
	});
});

describe('Form around hand-written fields', () => {
	it('lets any element sit in the form, not only fields', () => {
		render(
			<Form onSubmit={() => {}} testId="form">
				<h2>Account</h2>
				<Field label="Email">
					<input />
				</Field>
				<p>Footer note</p>
			</Form>,
		);

		const form = screen.getByTestId('form');

		expect(form).toContainElement(screen.getByRole('heading', { name: 'Account' }));
		expect(form).toContainElement(screen.getByText('Footer note'));
		expect(form.querySelector('[data-slot="field"]')).not.toBeNull();
	});
});
