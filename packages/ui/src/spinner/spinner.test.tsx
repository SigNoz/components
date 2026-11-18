import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './index.js';

describe('Spinner', () => {
	it('writes size to --spinner-size, pixels for a number', () => {
		render(<Spinner testId="spinner" size={24} />);

		expect(screen.getByTestId('spinner')).toHaveStyle({ '--spinner-size': '24px' });
	});

	it('keeps the ring inside the size, with no box-sizing reset on the page', () => {
		render(<Spinner testId="spinner" size={24} />);

		const { width, height } = screen.getByTestId('spinner').getBoundingClientRect();

		expect([width, height]).toEqual([24, 24]);
	});

	it('takes a size with its own unit', () => {
		render(<Spinner testId="spinner" size="2rem" />);

		expect(screen.getByTestId('spinner')).toHaveStyle({ '--spinner-size': '2rem' });
	});

	it('drops className and style that get past the types', () => {
		render(
			<Spinner
				testId="spinner"
				size={24}
				{...({ className: 'cell', style: { marginLeft: '4px' } } as object)}
			/>,
		);
		const root = screen.getByTestId('spinner');

		expect(root).not.toHaveClass('cell');
		expect(root.style.marginLeft).toBe('');
		expect(root.style.getPropertyValue('--spinner-size')).toBe('24px');
	});

	it('writes no inline style without size, even when a style gets past the types', () => {
		render(<Spinner testId="spinner" {...({ style: { marginLeft: '4px' } } as object)} />);

		expect(screen.getByTestId('spinner')).not.toHaveAttribute('style');
	});

	it('forwards the id to the root', () => {
		render(<Spinner testId="spinner" id="results-spinner" />);

		expect(screen.getByTestId('spinner')).toHaveAttribute('id', 'results-spinner');
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
