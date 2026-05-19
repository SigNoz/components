import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Callout } from './index.js';

describe('Callout forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Callout ref={ref} title="Test" />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'callout');
	});
});
