import { render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Card } from '../card.js';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Card forwardRef', () => {
	it('forwards the ref to the root', () => {
		const ref = createRef<HTMLDivElement>();

		render(
			<Card ref={ref} title="Title">
				Body
			</Card>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'card');
	});

	it('forwards the ref of a card with nothing in it', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const ref = createRef<HTMLDivElement>();

		render(<Card ref={ref} />);

		expect(ref.current).toHaveAttribute('data-slot', 'card');
	});
});
