import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
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

// Stands in for a design system button: takes the props, adds its own, sets no `type`.
const CustomButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
	function CustomButton(props, ref) {
		return (
			// eslint-disable-next-line jsx-a11y/control-has-associated-label, react/button-has-type -- the children arrive through `props`, and the type is left to the caller.
			<button ref={ref} data-custom="" {...props} />
		);
	},
);

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
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
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

	it('forwards the ref and aria attributes to the plain text fallback', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const ref = createRef<HTMLElement>();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link ref={ref} aria-describedby="hint" testId="l">
					nowhere
				</Callout.Link>
			</Callout>,
		);

		const text = screen.getByTestId('l');
		expect(ref.current).toBe(text);
		expect(text).toHaveAttribute('aria-describedby', 'hint');
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

	it('renders a button for an onClick without a destination, and runs it on click', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onClick = vi.fn();
		render(
			<Callout color="danger" size="sm" icon={icon}>
				Update your card details{' '}
				<Callout.Link onClick={onClick} testId="l">
					here
				</Callout.Link>
				.
			</Callout>,
		);

		const button = screen.getByRole('button', { name: 'here' });
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveAttribute('data-slot', 'callout-link');
		expect(button).toHaveAttribute('data-testid', 'l');

		await user.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
	});

	it('gives the button the class of the anchor link', () => {
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link href="/docs">docs</Callout.Link>
				<Callout.Link onClick={() => {}}>action</Callout.Link>
			</Callout>,
		);

		const anchor = screen.getByRole('link', { name: 'docs' });
		const button = screen.getByRole('button', { name: 'action' });
		expect(button.className).not.toBe('');
		expect(button.className).toBe(anchor.className);
	});

	it('forwards the ref and aria attributes to the button', async () => {
		const user = userEvent.setup();
		const ref = createRef<HTMLElement>();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link ref={ref} onClick={() => {}} aria-describedby="hint">
					action
				</Callout.Link>
			</Callout>,
		);

		const button = screen.getByRole('button');
		expect(ref.current).toBe(button);
		expect(button).toHaveAttribute('aria-describedby', 'hint');

		await user.tab();

		expect(button).toHaveFocus();
	});

	it('uses the render element for an action, keeps its own props and runs onClick', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const ref = createRef<HTMLElement>();
		render(
			<Callout color="primary" size="sm" icon={icon}>
				<Callout.Link
					ref={ref}
					render={<CustomButton className="track" />}
					onClick={onClick}
					testId="l"
				>
					action
				</Callout.Link>
			</Callout>,
		);

		const action = screen.getByRole('button', { name: 'action' });
		expect(action.tagName).toBe('BUTTON');
		expect(action).toHaveAttribute('data-custom');
		expect(action).not.toHaveAttribute('type');
		expect(action).toHaveClass('track');
		expect(action).toHaveAttribute('data-slot', 'callout-link');
		expect(action).toHaveAttribute('data-testid', 'l');
		expect(ref.current).toBe(action);

		await user.click(action);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
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
