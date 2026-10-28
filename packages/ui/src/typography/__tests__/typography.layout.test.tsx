import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Typography } from '../typography.js';

function internal(element: HTMLElement, name: string): string {
	return element.style.getPropertyValue(`--typography-internal-${name}`);
}

describe('Typography display', () => {
	it.each([
		['span', 'inline'],
		['label', 'inline'],
		['code', 'inline'],
		['p', 'block'],
		['div', 'block'],
		['li', 'block'],
		['h2', 'block'],
	] as const)('follows as="%s" with %s when display is not set', (as, display) => {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as={as}
				textOverflow="wrap"
				testId="text"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-display', display);
	});

	it('takes display when it is set, over the one of the element', () => {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="span"
				display="block"
				textOverflow="wrap"
				testId="text"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-display', 'block');
	});

	it.each([undefined, 'block'] as const)('keeps the marker of an li with display=%s', (display) => {
		render(
			<ul>
				<Typography
					variant="paragraph"
					size="base"
					weight="regular"
					color="main"
					as="li"
					display={display}
					textOverflow="wrap"
					testId="text"
				>
					Text
				</Typography>
			</ul>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-display', 'block');
		expect(getComputedStyle(text).display).toBe('list-item');
	});

	it('renders an inline-block text inline with a box', () => {
		render(
			<p>
				Before{' '}
				<Typography
					variant="paragraph"
					size="base"
					weight="regular"
					color="main"
					as="span"
					display="inline-block"
					width={120}
					textOverflow="wrap"
					testId="text"
				>
					Text
				</Typography>{' '}
				after
			</p>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-display', 'inline-block');
		expect(getComputedStyle(text).display).toBe('inline-block');
		expect(text.getBoundingClientRect().width).toBe(120);
		expect(text.querySelector('[data-slot="typography-text"]')).toBeNull();
	});
});

describe('Typography box', () => {
	it('writes the width props as internal custom properties, numbers as px', () => {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="wrap"
				testId="text"
				width={240}
				minWidth="4rem"
				maxWidth="50%"
			>
				Text
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(internal(text, 'width')).toBe('240px');
		expect(internal(text, 'min-width')).toBe('4rem');
		expect(internal(text, 'max-width')).toBe('50%');
	});

	it('writes no inline style when no box prop is set', () => {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="wrap"
				testId="text"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text').getAttribute('style') ?? '').toBe('');
	});

	it('mirrors align, only when set', () => {
		const { rerender } = render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="wrap"
				testId="text"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text')).not.toHaveAttribute('data-align');

		rerender(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="wrap"
				testId="text"
				align="center"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-align', 'center');
	});
});

describe('Typography spacing', () => {
	function renderSpaced(spacing: Record<string, unknown>): HTMLElement {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="wrap"
				testId="text"
				{...spacing}
			>
				Text
			</Typography>,
		);

		return screen.getByTestId('text');
	}

	it.each([
		[{ margin: 4 }, 'var(--spacing-4)'],
		[{ margin: 0 }, '0'],
		[{ marginTop: 3 }, 'var(--spacing-3) 0 0'],
		[{ marginY: 4 }, 'var(--spacing-4) 0'],
		[{ marginLeft: 'auto' }, '0 0 0 auto'],
		[{ margin: 2, marginBottom: 6 }, 'var(--spacing-2) var(--spacing-2) var(--spacing-6)'],
		[
			{ margin: 2, marginX: 4, marginRight: 8 },
			'var(--spacing-2) var(--spacing-8) var(--spacing-2) var(--spacing-4)',
		],
		[{ marginY: 1, marginTop: 0 }, '0 0 var(--spacing-1)'],
	])('writes %o as the margin %s', (spacing, margin) => {
		expect(internal(renderSpaced(spacing), 'margin')).toBe(margin);
	});

	it.each([
		[{ padding: 2 }, 'var(--spacing-2)'],
		[{ paddingX: 4, paddingY: 2 }, 'var(--spacing-2) var(--spacing-4)'],
		[{ padding: 2, paddingLeft: 0 }, 'var(--spacing-2) var(--spacing-2) var(--spacing-2) 0'],
	])('writes %o as the padding %s', (spacing, padding) => {
		expect(internal(renderSpaced(spacing), 'padding')).toBe(padding);
	});

	it('keeps the margin and padding props off the element', () => {
		const text = renderSpaced({ marginTop: 2, paddingX: 4 });

		expect(text).not.toHaveAttribute('marginTop');
		expect(text).not.toHaveAttribute('paddingX');
	});
});

describe('Typography flex', () => {
	it('wraps each run of text in a typography-text span and leaves elements alone', () => {
		const count = 12;

		render(
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="div"
				display="flex"
				gap={2}
				textOverflow="ellipsis"
				testId="text"
			>
				<svg data-testid="icon" />
				Showing {count} logs
				<svg data-testid="trailing" />
			</Typography>,
		);

		const text = screen.getByTestId('text');
		const runs = text.querySelectorAll(':scope > [data-slot="typography-text"]');

		expect(runs).toHaveLength(1);
		expect(runs[0]).toHaveTextContent('Showing 12 logs');
		expect(screen.getByTestId('icon').parentElement).toBe(text);
		expect(screen.getByTestId('trailing').parentElement).toBe(text);
		expect(internal(text, 'gap')).toBe('var(--spacing-2)');
	});

	it('wraps the text inside a fragment and keeps the keys of its elements apart', () => {
		const count = 12;
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="div"
				display="flex"
				textOverflow="ellipsis"
				testId="text"
			>
				<svg data-testid="icon" />
				<>
					<svg data-testid="inner" />
					Showing {count} logs
				</>
			</Typography>,
		);

		const text = screen.getByTestId('text');
		const runs = text.querySelectorAll(':scope > [data-slot="typography-text"]');

		expect(runs).toHaveLength(1);
		expect(runs[0]).toHaveTextContent('Showing 12 logs');
		expect(screen.getByTestId('icon').parentElement).toBe(text);
		expect(screen.getByTestId('inner').parentElement).toBe(text);
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});

	it('aligns the children to the center by default', () => {
		render(
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="span"
				display="inline-flex"
				textOverflow="visible"
				testId="text"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-vertical-align', 'center');
	});

	it('mirrors verticalAlign on a flex text', () => {
		render(
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="span"
				display="flex"
				verticalAlign="baseline"
				textOverflow="visible"
				testId="text"
			>
				Text
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-vertical-align', 'baseline');
	});

	it('has no vertical alignment and no text runs on a text that is not flex', () => {
		render(
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="p"
				textOverflow="visible"
				testId="text"
			>
				Text
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).not.toHaveAttribute('data-vertical-align');
		expect(text.querySelector('[data-slot="typography-text"]')).toBeNull();
	});

	it('lets a text inside it shrink and cut, and keeps every other child whole', () => {
		render(
			<div style={{ width: 120 }}>
				<Typography
					variant="label"
					size="base"
					weight="medium"
					color="main"
					as="div"
					display="flex"
					gap={2}
					textOverflow="visible"
					testId="text"
				>
					<svg data-testid="icon" width={12} height={12} />
					<Typography
						variant="label"
						size="base"
						weight="regular"
						color="inherit"
						as="span"
						display="block"
						textOverflow="ellipsis"
						testId="inner"
					>
						checkout-service-production-east-us-2-deployment
					</Typography>
				</Typography>
			</div>,
		);

		const text = screen.getByTestId('text');
		const inner = screen.getByTestId('inner');
		expect(getComputedStyle(inner).flexShrink).toBe('1');
		expect(getComputedStyle(screen.getByTestId('icon')).flexShrink).toBe('0');
		expect(inner.scrollWidth).toBeGreaterThan(inner.clientWidth);
		expect(inner.getBoundingClientRect().right).toBeLessThanOrEqual(
			text.getBoundingClientRect().right,
		);
	});
});
