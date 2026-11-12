import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

// Stands in for a router link: takes `to`, renders an `a`, forwards the rest.
const RouterLink = forwardRef<
	HTMLAnchorElement,
	AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }
>(function RouterLink({ to, onClick, ...props }, ref) {
	return (
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
			// eslint-disable-next-line react/button-has-type -- the type is left to the caller.
			<button ref={ref} data-custom="" {...props} />
		);
	},
);

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

	it('renders a button for an onClick without a destination', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onClick = vi.fn();
		render(
			<AlertStrip color="warning" side="bottom">
				Trial ends soon.{' '}
				<AlertStrip.Link onClick={onClick} testId="l">
					Upgrade
				</AlertStrip.Link>
			</AlertStrip>,
		);

		const button = screen.getByRole('button', { name: 'Upgrade' });
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveAttribute('data-slot', 'alert-strip-link');
		expect(button).toHaveAttribute('data-testid', 'l');
		expect(button.className).not.toBe('');

		await user.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
	});

	it('forwards the ref and aria attributes to the button', () => {
		const ref = createRef<HTMLElement>();
		render(
			<AlertStrip color="warning" side="bottom">
				<AlertStrip.Link ref={ref} onClick={() => {}} aria-describedby="hint">
					Upgrade
				</AlertStrip.Link>
			</AlertStrip>,
		);

		const button = screen.getByRole('button', { name: 'Upgrade' });
		expect(ref.current).toBe(button);
		expect(button).toHaveAttribute('aria-describedby', 'hint');
	});

	it('uses the render element for an action, keeps its own props and runs onClick', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const ref = createRef<HTMLElement>();
		render(
			<AlertStrip color="warning" side="bottom">
				<AlertStrip.Link
					ref={ref}
					render={<CustomButton className="track" />}
					onClick={onClick}
					testId="l"
				>
					Upgrade
				</AlertStrip.Link>
			</AlertStrip>,
		);

		const action = screen.getByRole('button', { name: 'Upgrade' });
		expect(action.tagName).toBe('BUTTON');
		expect(action).toHaveAttribute('data-custom');
		expect(action).not.toHaveAttribute('type');
		expect(action).toHaveClass('track');
		expect(action).toHaveAttribute('data-slot', 'alert-strip-link');
		expect(action).toHaveAttribute('data-testid', 'l');
		expect(ref.current).toBe(action);

		await user.click(action);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
	});

	it('renders plain text and warns once without a destination and without an onClick', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Link testId="l">nowhere</AlertStrip.Link>
			</AlertStrip>,
		);

		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		expect(screen.getByTestId('l')).toHaveTextContent('nowhere');
		expect(warn).toHaveBeenCalledTimes(1);
	});
});

describe('AlertStrip.Link styling', () => {
	it('draws an action like the anchor link inside the prose', () => {
		render(
			<AlertStrip color="primary" side="bottom">
				Read the{' '}
				<AlertStrip.Link href="#docs" testId="anchor">
					docs
				</AlertStrip.Link>{' '}
				or{' '}
				<AlertStrip.Link onClick={() => {}} testId="action">
					act
				</AlertStrip.Link>
				.
			</AlertStrip>,
		);

		const anchor = getComputedStyle(screen.getByTestId('anchor'));
		const action = getComputedStyle(screen.getByTestId('action'));

		for (const property of [
			'color',
			'fontFamily',
			'fontSize',
			'fontWeight',
			'lineHeight',
			'letterSpacing',
			'textTransform',
			'textDecorationLine',
			'cursor',
		] as const) {
			expect(action[property], property).toBe(anchor[property]);
		}

		expect(action.backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(action.borderTopWidth).toBe('0px');
		expect(action.paddingTop).toBe('0px');
		expect(action.paddingLeft).toBe('0px');
	});
});
