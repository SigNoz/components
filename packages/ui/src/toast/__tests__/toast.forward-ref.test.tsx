import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Toaster } from '../toaster.js';

describe('Toaster forwardRef', () => {
	it('forwards the ref to the viewport element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Toaster ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'toaster');
	});
});
