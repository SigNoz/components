import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from './index.js';

describe('Checkbox forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<Checkbox ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
