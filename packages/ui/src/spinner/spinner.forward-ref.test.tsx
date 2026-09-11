import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './index.js';

describe('Spinner forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Spinner ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'spinner');
	});
});
