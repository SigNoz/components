import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Resizable } from '../index.js';
import { makeItems } from './resizable.test-utils.js';

describe('Resizable forwardRef', () => {
	it('forwards the ref to the root', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Resizable ref={ref} testId="split" orientation="horizontal" items={makeItems('a', 'b')} />,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('split'));
		expect(ref.current).toHaveAttribute('data-slot', 'resizable');
	});

	it('hands the root to a new ref, and null to the old one', () => {
		const first = vi.fn();
		const second = vi.fn();
		const items = makeItems('a', 'b');
		const { rerender, unmount } = render(
			<Resizable ref={first} testId="split" orientation="horizontal" items={items} />,
		);
		const root = screen.getByTestId('split');

		rerender(<Resizable ref={second} testId="split" orientation="horizontal" items={items} />);

		expect(first.mock.calls).toEqual([[root], [null]]);
		expect(second.mock.calls).toEqual([[root]]);

		unmount();

		expect(second).toHaveBeenLastCalledWith(null);
	});
});
