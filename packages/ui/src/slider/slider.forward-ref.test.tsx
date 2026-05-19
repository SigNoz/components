import { render } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';

import { Slider } from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe('Slider forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Slider ref={ref} defaultValue={[50]} />);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});
});
