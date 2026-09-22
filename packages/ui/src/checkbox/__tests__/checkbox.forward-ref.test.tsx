import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../index.js';

describe('Checkbox forwardRef', () => {
	it('forwards the ref to the checkbox itself, not the wrapper', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Checkbox color="primary" ref={ref}>
				Accept the terms
			</Checkbox>,
		);

		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toBe(screen.getByRole('checkbox'));
		expect(ref.current).toHaveAttribute('data-slot', 'checkbox');
	});

	it('forwards the ref on a bare checkbox', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Checkbox color="primary" aria-label="Accept the terms" ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('checkbox'));
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Checkbox
				color="primary"
				aria-label="Accept the terms"
				disabled
				disabledTooltip="Ask an admin"
				ref={ref}
			/>,
		);

		expect(ref.current).toBe(screen.getByRole('checkbox'));
	});

	it('hands containerRef the label wrapper', () => {
		const containerRef = createRef<HTMLLabelElement>();
		render(
			<Checkbox color="primary" containerRef={containerRef}>
				Accept the terms
			</Checkbox>,
		);

		expect(containerRef.current).toBeInstanceOf(HTMLLabelElement);
		expect(containerRef.current).toHaveAttribute('data-slot', 'checkbox-container');
	});

	it('calls a callback ref with the checkbox and with null on unmount', () => {
		const seen: Array<HTMLSpanElement | null> = [];
		const { unmount } = render(
			<Checkbox
				color="primary"
				aria-label="Accept the terms"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const root = screen.getByRole('checkbox');

		unmount();

		expect(seen[0]).toBe(root);
		expect(seen.at(-1)).toBeNull();
	});
});
