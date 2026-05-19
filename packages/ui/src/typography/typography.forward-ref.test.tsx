import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Typography } from './index.js';

describe('Typography forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLParagraphElement>();
		render(<Typography ref={ref}>Text</Typography>);
		expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
	});
});
