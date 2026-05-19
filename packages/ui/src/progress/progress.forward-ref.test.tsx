import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Progress } from './index.js';

describe('Progress forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Progress ref={ref} value={50} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
