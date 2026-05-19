import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Badge } from './index.js';

describe('Badge forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Badge ref={ref}>Test</Badge>);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toHaveAttribute('data-slot', 'badge');
	});
});
