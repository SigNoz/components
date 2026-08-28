import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './index.js';

/**
 * `asChild` prop-merging contract. Complements the Kbd suite: ButtonProps
 * exposes `onClick`, so handler *composition* — both our handler and the
 * child's running on one click — can only be asserted here.
 */
describe('Button asChild prop merging', () => {
	it("runs both our handler and the child's on a single click", () => {
		const fromButton = vi.fn();
		const fromChild = vi.fn();
		render(
			<Button asChild onClick={fromButton}>
				<a href="/docs" onClick={fromChild}>
					Docs
				</a>
			</Button>,
		);

		screen.getByRole('link', { name: 'Docs' }).click();

		expect(fromButton).toHaveBeenCalledTimes(1);
		expect(fromChild).toHaveBeenCalledTimes(1);
	});

	it("joins our className with the child's", () => {
		render(
			<Button asChild className="from-button">
				<a href="/docs" className="from-child">
					Docs
				</a>
			</Button>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link).toHaveClass('from-child');
		expect(link).toHaveClass('from-button');
	});

	it("preserves the child's own attributes", () => {
		render(
			<Button asChild>
				<a href="/docs" target="_blank" rel="noreferrer">
					Docs
				</a>
			</Button>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link).toHaveAttribute('href', '/docs');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('renders no native button element when asChild is set', () => {
		render(
			<Button asChild>
				<a href="/docs">Docs</a>
			</Button>,
		);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('forwards the ref to the child element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Button asChild ref={ref}>
				<a href="/docs">Docs</a>
			</Button>,
		);

		expect(ref.current).toBe(screen.getByRole('link', { name: 'Docs' }));
	});

	it('still applies the disabled state through to the child', () => {
		render(
			<Button asChild disabled>
				<button type="button">Save</button>
			</Button>,
		);

		expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
	});
});
