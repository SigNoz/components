import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InputNumber } from './index.js';

describe('InputNumber — addons', () => {
	it('renders addonBefore and addonAfter wrappers', () => {
		render(
			<InputNumber
				addonBefore={<span data-testid="addon-before">unit</span>}
				addonAfter={<span data-testid="addon-after">GiB</span>}
			/>
		);
		expect(screen.getByTestId('addon-before')).toBeInTheDocument();
		expect(screen.getByTestId('addon-after')).toBeInTheDocument();
	});
});
