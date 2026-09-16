import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { TextEllipsis } from './index.js';

describe('TextEllipsis forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<TextEllipsis ref={ref}>Long text here</TextEllipsis>);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});
});
