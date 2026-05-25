import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './index.js';

describe('Avatar forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<Avatar ref={ref}>Test</Avatar>);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toHaveAttribute('data-slot', 'avatar');
	});
});
