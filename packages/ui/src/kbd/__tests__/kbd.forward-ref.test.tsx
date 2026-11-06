import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Kbd } from '../index.js';

describe('Kbd forwardRef', () => {
	it('forwards the ref to the kbd element', () => {
		const ref = createRef<HTMLElement>();
		render(<Kbd ref={ref} value="K" />);

		expect(ref.current?.tagName).toBe('KBD');
		expect(ref.current).toHaveAttribute('data-slot', 'kbd');
	});

	it('forwards the ref of Kbd.Shortcut to the outer kbd element', () => {
		const ref = createRef<HTMLElement>();
		render(<Kbd.Shortcut ref={ref} keys={['Mod', 'K']} />);

		expect(ref.current?.tagName).toBe('KBD');
		expect(ref.current).toHaveAttribute('data-slot', 'kbd-shortcut');
	});
});
