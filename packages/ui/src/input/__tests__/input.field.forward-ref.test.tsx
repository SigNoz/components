import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { InputField } from '../presets/input-field.js';

describe('InputField forwardRef', () => {
	it('forwards the ref to the native input, not to the field root', () => {
		const ref = createRef<HTMLInputElement>();
		render(<InputField label="Email" testId="email" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<InputField label="Email" disabled disabledTooltip="Ask an admin" testId="email" ref={ref} />,
		);

		expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
	});

	it('forwards the ref of InputField.Password to the native input', () => {
		const ref = createRef<HTMLInputElement>();
		render(<InputField.Password label="Secret" testId="secret" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toHaveAttribute('type', 'password');
	});

	it('forwards the ref of InputField.TextArea to the native textarea', () => {
		const ref = createRef<HTMLTextAreaElement>();
		render(<InputField.TextArea label="Notes" testId="notes" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
		expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Notes' }));
	});

	it('forwards the ref of InputField.Number to the native input', () => {
		const ref = createRef<HTMLInputElement>();
		render(<InputField.Number label="Replica count" testId="count" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Replica count' }));
	});

	it('can focus the input through the ref, as react-hook-form does for the first invalid field', () => {
		const ref = createRef<HTMLInputElement>();
		render(<InputField label="Email" error="Required" ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
	});
});
