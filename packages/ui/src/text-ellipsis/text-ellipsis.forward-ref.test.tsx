import { render } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';

import { TextEllipsis } from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe('TextEllipsis forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<TextEllipsis ref={ref}>Long text here</TextEllipsis>);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});
});
