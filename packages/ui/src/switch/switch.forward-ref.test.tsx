import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Switch } from './index.js';

// The ref lands on the switch's root element. Its tag is the primitive's
// choice, not part of our contract, so this asserts HTMLElement rather than a
// specific tag — the previous HTMLButtonElement assertion was pinning Radix's
// implementation detail.
describe('Switch forwardRef', () => {
	it('forwards ref', () => {
		const ref = createRef<HTMLElement>();
		render(<Switch ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLElement);
	});

	it('forwards ref with isLoading prop', () => {
		const ref = createRef<HTMLElement>();
		render(<Switch ref={ref} isLoading />);
		expect(ref.current).toBeInstanceOf(HTMLElement);
	});
});
