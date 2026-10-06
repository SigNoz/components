import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from '../input.js';

describe('Input forwardRef', () => {
	it('forwards the ref to the native input', () => {
		const ref = createRef<HTMLInputElement>();
		render(<Input aria-label="Organisation" testId="org" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toBe(screen.getByRole('textbox'));
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<Input
				aria-label="Organisation"
				disabled
				disabledTooltip="Ask an admin"
				testId="org"
				ref={ref}
			/>,
		);

		expect(ref.current).toBe(screen.getByRole('textbox'));
	});

	it('forwards the ref of Input.Password to the native input', () => {
		const ref = createRef<HTMLInputElement>();
		render(<Input.Password aria-label="Password" testId="password" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toHaveAttribute('type', 'password');
	});

	it('forwards the ref of Input.TextArea to the native textarea', () => {
		const ref = createRef<HTMLTextAreaElement>();
		render(<Input.TextArea aria-label="Description" testId="description" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
		expect(ref.current).toBe(screen.getByRole('textbox'));
	});

	it('forwards the ref of Input.Number to the native input', () => {
		const ref = createRef<HTMLInputElement>();
		render(<Input.Number aria-label="Count" testId="count" ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toBe(screen.getByRole('textbox'));
	});

	it('names the members in DevTools', () => {
		expect(Input.Password.displayName).toBe('Input.Password');
		expect(Input.TextArea.displayName).toBe('Input.TextArea');
		expect(Input.Number.displayName).toBe('Input.Number');
	});
});
