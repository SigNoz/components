import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Switch } from '../index.js';

describe('Switch forwardRef', () => {
	it('forwards the ref to the switch itself, not the wrapper', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Switch color="primary" textPlacement="right" ref={ref}>
				Wrap text
			</Switch>,
		);

		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toBe(screen.getByRole('switch'));
		expect(ref.current).toHaveAttribute('data-slot', 'switch');
	});

	it('forwards the ref on a bare switch', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Switch color="primary" textPlacement="right" aria-label="Wrap text" ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('switch'));
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Wrap text"
				disabled
				disabledTooltip="Ask an admin"
				ref={ref}
			/>,
		);

		expect(ref.current).toBe(screen.getByRole('switch'));
	});

	it('hands containerRef the label wrapper', () => {
		const containerRef = createRef<HTMLLabelElement>();
		render(
			<Switch color="primary" textPlacement="right" containerRef={containerRef}>
				Wrap text
			</Switch>,
		);

		expect(containerRef.current).toBeInstanceOf(HTMLLabelElement);
		expect(containerRef.current).toHaveAttribute('data-slot', 'switch-container');
	});

	it('calls a callback ref with the switch and with null on unmount', () => {
		const seen: Array<HTMLSpanElement | null> = [];
		const { unmount } = render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Wrap text"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const root = screen.getByRole('switch');

		unmount();

		expect(seen[0]).toBe(root);
		expect(seen.at(-1)).toBeNull();
	});
});
