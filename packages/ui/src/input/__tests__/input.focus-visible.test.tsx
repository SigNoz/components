import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../input.js';

// The last modality is shared by the whole document, so every test sets it with its own first
// interaction instead of trusting what the previous one left.
describe('Input focus ring', () => {
	it.each([
		['Input', <Input key="input" aria-label="Field" testId="field" />],
		['Input.Password', <Input.Password key="password" aria-label="Field" testId="field" />],
		['Input.TextArea', <Input.TextArea key="textarea" aria-label="Field" testId="field" />],
		['Input.Number', <Input.Number key="number" aria-label="Field" testId="field" />],
	])('%s draws the ring on keyboard focus and not on a click', async (_name, element) => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">Before</button>
				{element}
			</>,
		);

		const frame = screen.getByTestId('field');
		const field = screen.getByTestId('field-field');

		await user.click(field);

		expect(field).toHaveFocus();
		expect(frame).not.toHaveAttribute('data-focus-visible');

		await user.tab({ shift: true });

		expect(frame).not.toHaveAttribute('data-focus-visible');

		await user.tab();

		expect(field).toHaveFocus();
		expect(frame).toHaveAttribute('data-focus-visible');
	});

	it('keeps the ring off while typing into a clicked field', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" testId="field" />);

		await user.click(screen.getByRole('textbox'));
		await user.keyboard('Springfield');

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('drops the ring when focus leaves for a click elsewhere', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Input aria-label="Field" testId="field" />
				<button type="button">After</button>
			</>,
		);

		await user.tab();

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');

		await user.click(screen.getByRole('button', { name: 'After' }));

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('draws the ring for focus moved by a script after a key press', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" testId="field" />);

		await user.keyboard('a');
		act(() => screen.getByRole('textbox').focus());

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');
	});

	it('ignores a shortcut held with a modifier', async () => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">Before</button>
				<Input aria-label="Field" testId="field" />
			</>,
		);

		await user.click(screen.getByRole('button', { name: 'Before' }));
		await user.keyboard('{Control>}l{/Control}');
		act(() => screen.getByRole('textbox').focus());

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('leaves the password toggle out of the field focus', async () => {
		const user = userEvent.setup();
		render(<Input.Password aria-label="Password" testId="password" />);

		await user.keyboard('a');
		act(() => screen.getByTestId('password-toggle').focus());

		expect(screen.getByTestId('password')).not.toHaveAttribute('data-focus-visible');
	});

	it('keeps data-focus-visible with noFocusRing, the stylesheet drops the ring', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" noFocusRing testId="field" />);

		await user.tab();

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');
		expect(screen.getByTestId('field')).toHaveAttribute('data-no-focus-ring');
	});
});
