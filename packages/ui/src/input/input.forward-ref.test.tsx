import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Input } from './index.js';

describe('Input forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLInputElement>();
		render(<Input ref={ref} placeholder="Type..." />);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});
});
