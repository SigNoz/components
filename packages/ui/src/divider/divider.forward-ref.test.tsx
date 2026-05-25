import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Divider } from './index.js';

describe('Divider forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Divider ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'divider');
	});
});
