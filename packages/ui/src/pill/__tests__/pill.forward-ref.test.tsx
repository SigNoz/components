import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Pill } from '../index.js';

describe('Pill forwardRef', () => {
	it('forwards the ref to the rendered button element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Pill ref={ref} variant="outlined" color="primary">
				Click
			</Pill>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByRole('button'));
		expect(ref.current).toHaveAttribute('data-slot', 'pill');
	});

	it('forwards the ref without a tooltip trigger in the way', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Pill ref={ref} variant="outlined" color="primary" textOverflow="none">
				Click
			</Pill>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('calls a callback ref with the button and with null on unmount', () => {
		const seen: Array<HTMLButtonElement | null> = [];
		const { unmount } = render(
			<Pill
				variant="outlined"
				color="primary"
				ref={(node) => {
					seen.push(node);
				}}
			>
				Click
			</Pill>,
		);
		const button = screen.getByRole('button');

		unmount();

		expect(seen[0]).toBe(button);
		expect(seen.at(-1)).toBeNull();
	});
});

describe('Pill.Closeable forwardRef', () => {
	it('forwards the ref to the outer container', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Pill.Closeable ref={ref} onClose={() => {}}>
				Test
			</Pill.Closeable>,
		);

		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toHaveAttribute('data-slot', 'pill');
		expect(ref.current).toBe(screen.getByRole('button', { name: 'Test' }));
	});

	it('calls a callback ref with the container and with null on unmount', () => {
		const seen: Array<HTMLSpanElement | null> = [];
		const { unmount } = render(
			<Pill.Closeable
				onClose={() => {}}
				ref={(node) => {
					seen.push(node);
				}}
			>
				Test
			</Pill.Closeable>,
		);
		const container = screen.getByRole('button', { name: 'Test' });

		unmount();

		expect(seen[0]).toBe(container);
		expect(seen.at(-1)).toBeNull();
	});
});
