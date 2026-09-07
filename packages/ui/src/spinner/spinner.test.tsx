import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './index.js';

describe('Spinner', () => {
	it('writes size to --spinner-size, pixels for a number', () => {
		render(<Spinner testId="spinner" size={24} />);

		expect(screen.getByTestId('spinner')).toHaveStyle({ '--spinner-size': '24px' });
	});

	it('takes a size with its own unit', () => {
		render(<Spinner testId="spinner" size="2rem" />);

		expect(screen.getByTestId('spinner')).toHaveStyle({ '--spinner-size': '2rem' });
	});

	it('says nothing on its own, the busy element announces it', () => {
		render(<Spinner testId="spinner" />);

		expect(screen.queryByRole('status')).not.toBeInTheDocument();
		expect(screen.getByTestId('spinner')).not.toHaveAttribute('aria-label');
	});

	it('takes a role and a name when it stands alone', () => {
		render(<Spinner role="status" aria-label="Loading results" />);

		expect(screen.getByRole('status')).toHaveAccessibleName('Loading results');
	});
});
