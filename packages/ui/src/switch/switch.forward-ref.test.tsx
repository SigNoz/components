import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Switch } from './index.js';

describe('Switch forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<Switch ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('forwards ref with isLoading prop', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<Switch ref={ref} isLoading />);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
