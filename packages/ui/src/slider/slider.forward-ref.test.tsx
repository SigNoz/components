import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Slider } from './index.js';

describe('Slider forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Slider ref={ref} defaultValue={[50]} />);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});
});
