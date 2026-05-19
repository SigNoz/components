import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Kbd } from './index.js';

describe('Kbd forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLElement>();
		render(<Kbd ref={ref}>Ctrl</Kbd>);
		expect(ref.current).toBeInstanceOf(HTMLElement);
		expect(ref.current?.tagName).toBe('KBD');
	});
});
