import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from './index.js';

describe('Badge closable', () => {
	it('renders close button only when closable', () => {
		const { rerender } = render(<Badge>Test</Badge>);

		expect(screen.queryByRole('button', { name: /close badge/i })).not.toBeInTheDocument();

		rerender(<Badge closable>Test</Badge>);

		expect(screen.getByRole('button', { name: /close badge/i })).toBeInTheDocument();
	});

	it('calls onClose when close button is clicked', () => {
		const onClose = vi.fn();
		render(
			<Badge closable onClose={onClose}>
				Test
			</Badge>
		);

		fireEvent.click(screen.getByRole('button', { name: /close badge/i }));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('hides after close button is clicked', () => {
		render(
			<Badge closable testId="badge">
				Test
			</Badge>
		);

		fireEvent.click(screen.getByRole('button', { name: /close badge/i }));

		expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
	});

	it('stays visible when onClose prevents default', () => {
		render(
			<Badge closable testId="badge" onClose={(event) => event.preventDefault()}>
				Test
			</Badge>
		);

		fireEvent.click(screen.getByRole('button', { name: /close badge/i }));

		expect(screen.getByTestId('badge')).toBeInTheDocument();
	});

	it('renders a custom close icon', () => {
		render(
			<Badge closable closeIcon={<span data-testid="custom-close-icon" />}>
				Test
			</Badge>
		);

		expect(screen.getByTestId('custom-close-icon')).toBeInTheDocument();
	});

	it('preserves asChild rendering when closable is provided', () => {
		render(
			<Badge asChild closable>
				<button type="button">Child badge</button>
			</Badge>
		);

		expect(screen.getByRole('button', { name: /child badge/i })).toHaveAttribute(
			'data-slot',
			'badge'
		);
		expect(screen.queryByRole('button', { name: /close badge/i })).not.toBeInTheDocument();
	});
});
