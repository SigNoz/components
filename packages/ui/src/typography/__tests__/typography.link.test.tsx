import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Typography } from '../typography.js';

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

	it('marks the numerals when asked, and keeps the props off the element', () => {
		render(
			<Typography.Link
				variant="code"
				size="small"
				weight="regular"
				textOverflow="visible"
				href="/traces/4f0a"
				tabularNumbers
				slashedZero
			>
				4f0a-27b0
			</Typography.Link>,
		);

		const link = screen.getByRole('link', { name: '4f0a-27b0' });
		expect(link).toHaveAttribute('data-tabular-numbers');
		expect(link).toHaveAttribute('data-slashed-zero');
		expect(link).not.toHaveAttribute('tabularNumbers');
		expect(link).not.toHaveAttribute('slashedZero');
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
