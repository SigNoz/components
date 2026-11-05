import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typography } from '../typography.js';
import type { TypographyProps } from '../types.js';

describe('Typography element', () => {
	it.each(['span', 'p', 'div', 'li', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
		'renders as="%s" as that element',
		(as) => {
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

			expect(screen.getByTestId('text').tagName).toBe(as.toUpperCase());
		},
	);

	it('renders a label that names its control', () => {
		render(
			<>
				<Typography
					variant="label"
					size="base"
					weight="medium"
					color="main"
					as="label"
					htmlFor="name"
					textOverflow="visible"
				>
					Name
				</Typography>
				<input id="name" />
			</>,
		);

		expect(screen.getByLabelText('Name')).toBe(document.getElementById('name'));
	});

	it('renders a heading only from as, never from size', () => {
		render(
			<Typography
				variant="label"
				size="large"
				weight="bold"
				color="main"
				as="span"
				textOverflow="visible"
			>
				Large
			</Typography>,
		);

		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	it('renders an empty element with no fallback text', () => {
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
				{null}
			</Typography>,
		);

		expect(screen.getByTestId('text')).toBeEmptyDOMElement();
	});

	it('keeps the case of the children for uppercase, which only CSS changes', () => {
		render(
			<Typography
				variant="uppercase"
				size="small"
				weight="medium"
				color="secondary"
				as="h3"
				textOverflow="visible"
			>
				Recent logs
			</Typography>,
		);

		expect(screen.getByRole('heading')).toHaveTextContent(/^Recent logs$/);
	});
});

describe('Typography attributes', () => {
	it('mirrors the style props and the slot on the element', () => {
		render(
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="danger"
				as="span"
				textOverflow="visible"
				testId="text"
			>
				Failed
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-slot', 'typography');
		expect(text).toHaveAttribute('data-variant', 'label');
		expect(text).toHaveAttribute('data-size', 'base');
		expect(text).toHaveAttribute('data-weight', 'medium');
		expect(text).toHaveAttribute('data-color', 'danger');
		expect(text).toHaveAttribute('data-text-overflow', 'visible');
	});

	it('marks the numerals only when asked', () => {
		const { rerender } = render(
			<Typography
				variant="code"
				size="small"
				weight="regular"
				color="main"
				as="code"
				textOverflow="visible"
				testId="text"
			>
				4f0a-27b0
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).not.toHaveAttribute('data-tabular-numbers');
		expect(text).not.toHaveAttribute('data-slashed-zero');

		rerender(
			<Typography
				variant="code"
				size="small"
				weight="regular"
				color="main"
				as="code"
				textOverflow="visible"
				testId="text"
				tabularNumbers
				slashedZero
			>
				4f0a-27b0
			</Typography>,
		);

		expect(text).toHaveAttribute('data-tabular-numbers');
		expect(text).toHaveAttribute('data-slashed-zero');
	});

	it('forwards id, role, aria-* and data-*', () => {
		render(
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="danger"
				as="p"
				textOverflow="wrap"
				id="error"
				role="alert"
				aria-live="assertive"
				data-kind="error"
			>
				The query failed.
			</Typography>,
		);

		const text = screen.getByRole('alert');
		expect(text).toHaveAttribute('id', 'error');
		expect(text).toHaveAttribute('aria-live', 'assertive');
		expect(text).toHaveAttribute('data-kind', 'error');
	});

	it('keeps its own class and no inline style when className and style get past the types', () => {
		const props = {
			variant: 'paragraph',
			size: 'base',
			weight: 'regular',
			color: 'main',
			as: 'p',
			textOverflow: 'wrap',
			testId: 'text',
			className: 'consumer',
			style: { color: 'red' },
			children: 'Text',
		} as unknown as TypographyProps;

		render(<Typography {...props} />);

		const text = screen.getByTestId('text');
		expect(text).not.toHaveClass('consumer');
		expect(text.getAttribute('style') ?? '').not.toContain('color');
	});
});
