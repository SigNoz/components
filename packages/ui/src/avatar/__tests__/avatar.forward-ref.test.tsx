import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from '../index.js';

describe('Avatar forwardRef', () => {
	it('forwards the ref to the root element', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Avatar color="primary" ref={ref} name="Alex Example" size="md" testId="avatar" />);

		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toBe(screen.getByTestId('avatar'));
		expect(ref.current).toHaveAttribute('data-slot', 'avatar');
	});

	it('calls a callback ref with the root element', () => {
		const ref = vi.fn();
		render(<Avatar color="primary" ref={ref} name="Alex Example" size="md" testId="avatar" />);

		expect(ref).toHaveBeenCalledWith(screen.getByTestId('avatar'));
	});

	it('keeps the ref on the same element while the image loads', () => {
		const ref = createRef<HTMLSpanElement>();
		const { rerender } = render(
			<Avatar
				color="primary"
				ref={ref}
				name="Alex Example"
				size="md"
				src="/first.png"
				testId="avatar"
			/>,
		);
		const root = ref.current;

		rerender(
			<Avatar
				color="primary"
				ref={ref}
				name="Alex Example"
				size="md"
				src="/second.png"
				testId="avatar"
			/>,
		);

		expect(ref.current).toBe(root);
	});
});
