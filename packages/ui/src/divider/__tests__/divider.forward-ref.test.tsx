import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Divider } from '../index.js';

describe('Divider forwardRef', () => {
	it('forwards the ref to the separator element', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Divider ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toBe(screen.getByRole('separator'));
		expect(ref.current).toHaveAttribute('data-slot', 'divider');
	});

	it('forwards the ref to the root of a divider with a label', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<Divider ref={ref} testId="divider">
				OR
			</Divider>,
		);

		expect(ref.current).toBe(screen.getByTestId('divider'));
	});
});
