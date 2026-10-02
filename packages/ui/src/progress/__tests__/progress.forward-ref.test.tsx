import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Progress } from '../index.js';

describe('Progress forwardRef', () => {
	it('forwards the ref to the progressbar element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Progress color="primary" percent={50} ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('progressbar'));
		expect(ref.current).toHaveAttribute('data-slot', 'progress');
	});
});
