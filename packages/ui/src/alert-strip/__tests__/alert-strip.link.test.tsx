import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

// Stands in for a router link: takes `to`, renders an `a`, forwards the rest.
const RouterLink = forwardRef<
	HTMLAnchorElement,
	AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }
>(function RouterLink({ to, onClick, ...props }, ref) {
	return (
		// eslint-disable-next-line jsx-a11y/anchor-has-content -- the children arrive through `props`.
		<a
			ref={ref}
			href={to}
			onClick={(event) => {
				onClick?.(event);
				event.preventDefault();
			}}
			{...props}
		/>
	);
});

afterEach(() => vi.restoreAllMocks());

// The rendering itself is shared with `Callout.Link` and covered by its tests. These check the
// strip wires it with its own slot, class and name.
describe('AlertStrip.Link', () => {
	it('renders an anchor with its slot and testId', () => {
		render(
			<AlertStrip color="warning" side="bottom">
				Trial ends soon.{' '}
				<AlertStrip.Link href="/billing" testId="l">
					Upgrade
				</AlertStrip.Link>
			</AlertStrip>,
		);

		const link = screen.getByRole('link', { name: 'Upgrade' });
		expect(link).toHaveAttribute('href', '/billing');
		expect(link).toHaveAttribute('data-slot', 'alert-strip-link');
		expect(link).toHaveAttribute('data-testid', 'l');
		expect(link.className).not.toBe('');
	});

	it('adds rel for a _blank target', () => {
		render(
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Link href="/docs" target="_blank">
					docs
				</AlertStrip.Link>
			</AlertStrip>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders through `render`, keeps its own props and runs its onClick first', async () => {
		const user = userEvent.setup();
		const order: string[] = [];
		const ref = createRef<HTMLElement>();
		render(
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Link
					ref={ref}
					render={<RouterLink to="/billing" onClick={() => order.push('router')} />}
					onClick={() => order.push('strip')}
				>
					billing
				</AlertStrip.Link>
			</AlertStrip>,
		);

		const link = screen.getByRole('link', { name: 'billing' });
		expect(link).toHaveAttribute('href', '/billing');
		expect(ref.current).toBe(link);

		await user.click(link);

		expect(order).toEqual(['router', 'strip']);
	});

	it('renders plain text and warns, naming AlertStrip.Link, without a destination', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Link testId="l">nowhere</AlertStrip.Link>
			</AlertStrip>,
		);

		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.getByTestId('l')).toHaveAttribute('data-slot', 'alert-strip-link');
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('AlertStrip.Link'));
	});
});
