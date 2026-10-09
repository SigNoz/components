import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from '../divider.js';

describe('Divider accessibility', () => {
	it('is a horizontal separator by default', () => {
		render(<Divider />);

		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('is a vertical separator with orientation vertical', () => {
		render(<Divider orientation="vertical" />);

		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('drops the role with a label, so the label is read as text', () => {
		render(<Divider testId="divider">Or get started with these sample alerts</Divider>);
		const divider = screen.getByTestId('divider');

		expect(screen.queryByRole('separator')).toBeNull();
		expect(divider).not.toHaveAttribute('role');
		expect(divider).not.toHaveAttribute('aria-orientation');
		expect(screen.getByText('Or get started with these sample alerts')).toBeVisible();
	});

	it('stays a separator with a label when aria-label or aria-labelledby names it', () => {
		const { rerender } = render(<Divider aria-label="Steps">OR</Divider>);

		expect(screen.getByRole('separator', { name: 'Steps' })).toHaveAttribute(
			'aria-orientation',
			'horizontal',
		);

		rerender(
			<>
				<span id="steps-title">Steps</span>
				<Divider aria-labelledby="steps-title">OR</Divider>
			</>,
		);

		expect(screen.getByRole('separator', { name: 'Steps' })).toBeInTheDocument();
	});

	it('writes its own role and aria-orientation over the caller ones', () => {
		const stray = { role: 'presentation', 'aria-orientation': 'vertical' } as object;
		const { rerender } = render(<Divider {...stray} />);

		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');

		rerender(
			<Divider testId="divider" {...stray}>
				OR
			</Divider>,
		);

		expect(screen.getByTestId('divider')).not.toHaveAttribute('role');
		expect(screen.getByTestId('divider')).not.toHaveAttribute('aria-orientation');
	});

	it('forwards aria attributes', () => {
		render(<Divider aria-label="Steps" />);

		expect(screen.getByRole('separator', { name: 'Steps' })).toBeInTheDocument();
	});

	it('is not focusable', () => {
		render(<Divider />);
		const divider = screen.getByRole('separator');

		expect(divider).not.toHaveAttribute('tabindex');
		divider.focus();
		expect(divider).not.toHaveFocus();
	});
});
