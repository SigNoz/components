import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Typography } from '../typography.js';

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

const MESSAGES = { settings: 'Settings' };

function Translated({ id }: { id: keyof typeof MESSAGES }) {
	return <>{MESSAGES[id]}</>;
}

afterEach(() => vi.restoreAllMocks());

describe('Typography.Link', () => {
	it('renders an anchor with its slot, testId and style attributes', () => {
		render(
			<Typography.Link
				variant="paragraph"
				size="base"
				weight="medium"
				textOverflow="wrap"
				href="/docs"
				testId="link"
			>
				docs
			</Typography.Link>,
		);

		const link = screen.getByRole('link', { name: 'docs' });
		expect(link).toHaveAttribute('href', '/docs');
		expect(link).toHaveAttribute('data-slot', 'typography-link');
		expect(link).toHaveAttribute('data-testid', 'link');
		expect(link).toHaveAttribute('data-variant', 'paragraph');
		expect(link).toHaveAttribute('data-size', 'base');
		expect(link).toHaveAttribute('data-weight', 'medium');
		expect(link).toHaveAttribute('data-display', 'inline');
		expect(link).not.toHaveAttribute('data-color');
	});

	it('marks the numerals and the case when asked, and keeps the props off the element', () => {
		render(
			<Typography.Link
				variant="code"
				size="small"
				weight="regular"
				textOverflow="visible"
				href="/traces/4f0a"
				tabularNumbers
				slashedZero
				textTransform="capitalize"
			>
				4f0a-27b0
			</Typography.Link>,
		);

		const link = screen.getByRole('link', { name: '4f0a-27b0' });
		expect(link).toHaveAttribute('data-tabular-numbers');
		expect(link).toHaveAttribute('data-slashed-zero');
		expect(link).toHaveAttribute('data-text-transform', 'capitalize');
		expect(link).not.toHaveAttribute('tabularNumbers');
		expect(link).not.toHaveAttribute('slashedZero');
		expect(link).not.toHaveAttribute('textTransform');
	});

	it('adds noopener and noreferrer for a _blank target', () => {
		render(
			<Typography.Link
				variant="paragraph"
				size="base"
				weight="regular"
				textOverflow="wrap"
				href="/docs"
				target="_blank"
			>
				docs
			</Typography.Link>,
		);

		expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders through render, keeps its own props and runs its onClick first', async () => {
		const user = userEvent.setup();
		const order: string[] = [];
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				render={<RouterLink to="/settings" onClick={() => order.push('router')} />}
				onClick={() => order.push('link')}
			>
				Settings
			</Typography.Link>,
		);

		const link = screen.getByRole('link', { name: 'Settings' });
		expect(link).toHaveAttribute('href', '/settings');
		expect(link).toHaveAttribute('data-slot', 'typography-link');

		await user.click(link);

		expect(order).toEqual(['router', 'link']);
	});

	it('is a tab stop', async () => {
		const user = userEvent.setup();
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				href="/docs"
			>
				docs
			</Typography.Link>,
		);

		await user.tab();

		expect(screen.getByRole('link')).toHaveFocus();
	});

	it('renders plain text in the same style and warns without a destination', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				testId="link"
			>
				docs
			</Typography.Link>,
		);

		const text = screen.getByTestId('link');
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(text.tagName).toBe('SPAN');
		expect(text).toHaveAttribute('data-variant', 'label');
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Typography.Link needs an `href`'));
	});

	it('renders a button for an onClick without a destination, and runs it on click', async () => {
		const user = userEvent.setup();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onClick = vi.fn();
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				onClick={onClick}
				testId="link"
			>
				Retry
			</Typography.Link>,
		);

		const button = screen.getByRole('button', { name: 'Retry' });
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveAttribute('data-slot', 'typography-link');
		expect(button).toHaveAttribute('data-testid', 'link');
		expect(button).toHaveAttribute('data-variant', 'label');
		expect(button).toHaveAttribute('data-display', 'inline');

		await user.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
	});

	it('gives the button the class of the anchor link', () => {
		render(
			<>
				<Typography.Link
					variant="label"
					size="base"
					weight="medium"
					textOverflow="visible"
					href="/docs"
				>
					docs
				</Typography.Link>
				<Typography.Link
					variant="label"
					size="base"
					weight="medium"
					textOverflow="visible"
					onClick={() => {}}
				>
					action
				</Typography.Link>
			</>,
		);

		const anchor = screen.getByRole('link', { name: 'docs' });
		const button = screen.getByRole('button', { name: 'action' });
		expect(button.className).not.toBe('');
		expect(button.className).toBe(anchor.className);
	});

	it('forwards the ref and aria attributes to the button and runs it with the keyboard', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const ref = createRef<HTMLElement>();
		render(
			<Typography.Link
				ref={ref}
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				onClick={onClick}
				aria-describedby="hint"
			>
				action
			</Typography.Link>,
		);

		const button = screen.getByRole('button');
		expect(ref.current).toBe(button);
		expect(button).toHaveAttribute('aria-describedby', 'hint');

		await user.tab();
		expect(button).toHaveFocus();
		await user.keyboard('{Enter}');

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('uses the render element for an action, keeps its own props and runs onClick', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const ref = createRef<HTMLElement>();
		render(
			<Typography.Link
				ref={ref}
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				render={<CustomButton className="track" />}
				onClick={onClick}
				testId="link"
			>
				action
			</Typography.Link>,
		);

		const action = screen.getByRole('button', { name: 'action' });
		expect(action).toHaveAttribute('data-custom');
		expect(action).not.toHaveAttribute('type');
		expect(action).toHaveClass('track');
		expect(action).toHaveAttribute('data-slot', 'typography-link');
		expect(action).toHaveAttribute('data-testid', 'link');
		expect(ref.current).toBe(action);

		await user.click(action);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
	});

	it('keeps the ref, the id and the aria and data props on the plain text fallback', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const ref = createRef<HTMLElement>();
		render(
			<Typography.Link
				ref={ref}
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				id="nowhere"
				aria-describedby="hint"
				data-kind="plain"
				testId="link"
			>
				docs
			</Typography.Link>,
		);

		const text = screen.getByTestId('link');
		expect(ref.current).toBe(text);
		expect(text).toHaveAttribute('id', 'nowhere');
		expect(text).toHaveAttribute('aria-describedby', 'hint');
		expect(text).toHaveAttribute('data-kind', 'plain');
	});

	it('warns when it has no accessible name', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				href="/settings"
			>
				<svg />
			</Typography.Link>,
		);

		expect(warn).toHaveBeenCalledWith(expect.stringContaining('no accessible name'));
	});

	it('does not warn when an icon link has an aria-label', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				href="/settings"
				aria-label="Settings"
			>
				<svg />
			</Typography.Link>,
		);

		expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
		expect(warn).not.toHaveBeenCalled();
	});

	it('does not warn when a child component renders the text', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				href="/settings"
			>
				<Translated id="settings" />
			</Typography.Link>,
		);

		expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
		expect(warn).not.toHaveBeenCalled();
	});

	it('wraps the text runs of a flex link', () => {
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				display="inline-flex"
				gap={2}
				textOverflow="ellipsis"
				href="/docs"
			>
				<svg data-testid="icon" />
				Open the docs
			</Typography.Link>,
		);

		const link = screen.getByRole('link', { name: 'Open the docs' });
		expect(link.querySelector('[data-slot="typography-text"]')).toHaveTextContent('Open the docs');
		expect(screen.getByTestId('icon').parentElement).toBe(link);
		expect(link.style.getPropertyValue('--typography-internal-gap')).toBe('var(--spacing-2)');
	});

	it('writes the margin and padding of a block link and keeps them off the element', () => {
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				display="block"
				marginTop={2}
				paddingX={4}
				textOverflow="wrap"
				href="/docs"
			>
				Open the docs
			</Typography.Link>,
		);

		const link = screen.getByRole('link', { name: 'Open the docs' });
		expect(link.style.getPropertyValue('--typography-internal-margin')).toBe(
			'var(--spacing-2) 0 0',
		);
		expect(link.style.getPropertyValue('--typography-internal-padding')).toBe('0 var(--spacing-4)');
		expect(link).not.toHaveAttribute('marginTop');
		expect(link).not.toHaveAttribute('paddingX');
	});
});

describe('Typography.Link action styling', () => {
	it('draws an action like the anchor link inside italic prose', () => {
		render(
			<p style={{ fontStyle: 'italic', wordSpacing: '4px' }}>
				Read the{' '}
				<Typography.Link
					variant="paragraph"
					size="base"
					weight="medium"
					textOverflow="wrap"
					href="#docs"
					testId="anchor"
				>
					docs
				</Typography.Link>{' '}
				or{' '}
				<Typography.Link
					variant="paragraph"
					size="base"
					weight="medium"
					textOverflow="wrap"
					onClick={() => {}}
					testId="action"
				>
					retry
				</Typography.Link>
				.
			</p>,
		);

		const anchor = getComputedStyle(screen.getByTestId('anchor'));
		const action = getComputedStyle(screen.getByTestId('action'));

		for (const property of [
			'color',
			'fontFamily',
			'fontSize',
			'fontWeight',
			'fontStyle',
			'lineHeight',
			'letterSpacing',
			'wordSpacing',
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

	it('starts the text of a wide action where an anchor starts it, and follows align', () => {
		render(
			<>
				<Typography.Link
					variant="label"
					size="base"
					weight="medium"
					textOverflow="visible"
					display="block"
					width={200}
					onClick={() => {}}
					testId="start"
				>
					retry
				</Typography.Link>
				<Typography.Link
					variant="label"
					size="base"
					weight="medium"
					textOverflow="visible"
					display="block"
					width={200}
					align="end"
					onClick={() => {}}
					testId="end"
				>
					retry
				</Typography.Link>
			</>,
		);

		expect(getComputedStyle(screen.getByTestId('start')).textAlign).toBe('start');
		expect(getComputedStyle(screen.getByTestId('end')).textAlign).toBe('end');
	});

	it('cuts a long action with an ellipsis', () => {
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="ellipsis"
				display="block"
				width={60}
				onClick={() => {}}
				testId="action"
			>
				View every log line of this service
			</Typography.Link>,
		);

		const action = screen.getByTestId('action');
		expect(getComputedStyle(action).textOverflow).toBe('ellipsis');
		expect(action.scrollWidth).toBeGreaterThan(action.clientWidth);
	});
});
