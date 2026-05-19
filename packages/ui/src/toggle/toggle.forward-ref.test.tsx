import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Toggle } from './index.js';

describe('Toggle forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<Toggle ref={ref}>Toggle</Toggle>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
