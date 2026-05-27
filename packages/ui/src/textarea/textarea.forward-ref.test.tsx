import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Textarea } from './index.js';

describe('Textarea forwardRef', () => {
	it('forwards a ref to the underlying <textarea>', () => {
		const ref = createRef<HTMLTextAreaElement>();
		render(<Textarea ref={ref} testId="ta" placeholder="hi" />);
		expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
	});
});
