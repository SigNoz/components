import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Kbd } from './index.js';

/**
 * `asChild` is a public prop on Kbd, Badge and Button. It was implemented with
 * Radix's `Slot` and is now implemented with Base UI's `useRender`, whose prop
 * merging is close but not identical. These assertions pin the parts consumers
 * actually rely on: the child becomes the element, our props land on it, the
 * child's own props survive, className is joined rather than replaced, and
 * event handlers from both sides run.
 */
describe('Kbd asChild', () => {
	it('renders the child element instead of a kbd', () => {
		render(
			<Kbd asChild>
				<button type="button">Enter</button>
			</Kbd>,
		);

		expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument();
		expect(document.querySelector('kbd')).toBeNull();
	});

	it('renders a kbd when asChild is not set', () => {
		render(<Kbd>Enter</Kbd>);

		expect(document.querySelector('kbd')).not.toBeNull();
		expect(screen.getByText('Enter')).toBeInTheDocument();
	});

	it('moves our styling hooks onto the child', () => {
		render(
			<Kbd asChild size="lg" active testId="enter-key">
				<span>Enter</span>
			</Kbd>,
		);

		const element = screen.getByTestId('enter-key');
		expect(element.tagName).toBe('SPAN');
		expect(element).toHaveAttribute('data-slot', 'kbd');
		expect(element).toHaveAttribute('data-size', 'lg');
		expect(element).toHaveAttribute('data-active', 'true');
	});

	it("preserves the child's own attributes and content", () => {
		render(
			<Kbd asChild>
				<a href="/docs" title="docs link">
					Enter
				</a>
			</Kbd>,
		);

		const link = screen.getByRole('link', { name: 'Enter' });
		expect(link).toHaveAttribute('href', '/docs');
		expect(link).toHaveAttribute('title', 'docs link');
	});

	it("joins our className with the child's rather than replacing it", () => {
		render(
			<Kbd asChild className="from-kbd">
				<span className="from-child">Enter</span>
			</Kbd>,
		);

		const element = screen.getByText('Enter');
		expect(element).toHaveClass('from-child');
		expect(element).toHaveClass('from-kbd');
	});

	it("keeps the child's own event handler working", () => {
		// KbdProps does not expose `onClick`, so handler *composition* is
		// asserted on Button instead; here we only check we do not clobber the
		// child's own handler while merging props onto it.
		const fromChild = vi.fn();
		render(
			<Kbd asChild>
				<button type="button" onClick={fromChild}>
					Enter
				</button>
			</Kbd>,
		);

		screen.getByRole('button', { name: 'Enter' }).click();

		expect(fromChild).toHaveBeenCalledTimes(1);
	});

	it('forwards the ref to the child element', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Kbd asChild ref={ref}>
				<span>Enter</span>
			</Kbd>,
		);

		expect(ref.current).toBe(screen.getByText('Enter'));
		expect(ref.current?.tagName).toBe('SPAN');
	});
});
