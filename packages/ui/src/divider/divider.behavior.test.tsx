import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider } from './index.js';

describe('Divider semantics', () => {
	it('is a separator when it has no content', () => {
		render(<Divider testId="d" />);

		const divider = screen.getByTestId('d');
		expect(divider).toHaveAttribute('role', 'separator');
		expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('reports a vertical orientation', () => {
		render(<Divider type="vertical" testId="d" />);
		expect(screen.getByTestId('d')).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('is not a separator when it carries a label', () => {
		// A separator cannot contain content, so the labelled form is deliberately
		// a plain element rather than an empty-but-labelled separator.
		render(<Divider testId="d">OR</Divider>);

		const divider = screen.getByTestId('d');
		expect(divider).not.toHaveAttribute('role', 'separator');
		expect(divider).toHaveAttribute('data-with-text');
		expect(screen.getByText('OR')).toBeInTheDocument();
	});
});

describe('Divider styling hooks', () => {
	it('exposes type, dashed and plain', () => {
		render(<Divider type="vertical" dashed plain testId="d" />);

		const divider = screen.getByTestId('d');
		expect(divider).toHaveAttribute('data-type', 'vertical');
		expect(divider).toHaveAttribute('data-dashed');
		expect(divider).toHaveAttribute('data-plain');
	});

	it('omits the flags when not set', () => {
		render(<Divider testId="d" />);

		const divider = screen.getByTestId('d');
		expect(divider).not.toHaveAttribute('data-dashed');
		expect(divider).not.toHaveAttribute('data-with-text');
	});
});
