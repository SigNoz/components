import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Button } from './index.js';

describe('Button forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<Button ref={ref}>Click</Button>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
