import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg />;

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

describe('Callout.Link', () => {
	it('renders an anchor with its slot and testId', () => {
		render(
			<Callout color="warning" size="md" icon={icon}>
				<Callout.Link href="/docs" testId="l">
					docs
				</Callout.Link>
			</Callout>,
		);

		const link = screen.getByRole('link', { name: 'docs' });
		expect(link).toHaveAttribute('href', '/docs');
		expect(link).toHaveAttribute('data-slot', 'callout-link');
		expect(link).toHaveAttribute('data-testid', 'l');
	});

	it('adds rel for a _blank target', () => {
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link href="/docs" target="_blank">
					docs
				</Callout.Link>
			</Callout>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders through `render`, keeps its own props and runs its onClick first', async () => {
		const user = userEvent.setup();
		const order: string[] = [];
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link
					render={<RouterLink to="/alerts" onClick={() => order.push('router')} />}
					onClick={() => order.push('callout')}
				>
					alerts
				</Callout.Link>
			</Callout>,
		);

		const link = screen.getByRole('link', { name: 'alerts' });
		expect(link).toHaveAttribute('href', '/alerts');
		expect(link).toHaveAttribute('data-slot', 'callout-link');

		await user.click(link);

		expect(order).toEqual(['router', 'callout']);
	});

	it('renders plain text and warns without a destination', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link>nowhere</Callout.Link>
			</Callout>,
		);

		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.getByText('nowhere')).toBeInTheDocument();
		expect(warn).toHaveBeenCalled();
	});

	it('forwards the ref and aria attributes to the rendered element', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link ref={ref} href="/docs" aria-describedby="hint">
					docs
				</Callout.Link>
			</Callout>,
		);

		expect(ref.current).toBe(screen.getByRole('link'));
		expect(screen.getByRole('link')).toHaveAttribute('aria-describedby', 'hint');
	});

	it('keeps the ref and the className of the render element', () => {
		const ref = createRef<HTMLElement>();
		const ownRef = createRef<HTMLAnchorElement>();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link ref={ref} render={<RouterLink ref={ownRef} to="/x" className="track" />}>
					docs
				</Callout.Link>
			</Callout>,
		);

		const link = screen.getByRole('link');
		expect(ref.current).toBe(link);
		expect(ownRef.current).toBe(link);
		expect(link).toHaveClass('track');
		expect(link.classList.length).toBeGreaterThan(1);
	});

	it('adds rel for a _blank target set on the render element', () => {
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link render={<RouterLink to="/docs" target="_blank" />}>docs</Callout.Link>
			</Callout>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('keeps the testId and the slot on the plain text fallback', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Callout color="danger" size="sm" icon={icon}>
				<Callout.Link testId="l">nowhere</Callout.Link>
			</Callout>,
		);

		expect(screen.getByTestId('l')).toHaveAttribute('data-slot', 'callout-link');
	});

	it('keeps the rel of the render element next to noopener noreferrer', () => {
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link render={<RouterLink to="/docs" rel="nofollow noopener" />} target="_blank">
					docs
				</Callout.Link>
			</Callout>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow noopener noreferrer');
	});

	it('keeps its href, target and children over undefined ones on the render element', () => {
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link
					href="/docs"
					target="_blank"
					render={
						<RouterLink href={undefined} target={undefined}>
							{undefined}
						</RouterLink>
					}
				>
					docs
				</Callout.Link>
			</Callout>,
		);

		const link = screen.getByRole('link', { name: 'docs' });
		expect(link).toHaveAttribute('href', '/docs');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('keeps the rel of the render element without a _blank target', () => {
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link render={<RouterLink to="/docs" rel="nofollow" />}>docs</Callout.Link>
			</Callout>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow');
	});

	it('is reachable with the keyboard', async () => {
		const user = userEvent.setup();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link href="/docs">docs</Callout.Link>
			</Callout>,
		);

		await user.tab();

		expect(screen.getByRole('link')).toHaveFocus();
	});
});
