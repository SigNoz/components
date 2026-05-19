import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { DatePicker } from './index.js';

describe('DatePicker forwardRef', () => {
	it('DatePicker forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<DatePicker ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
