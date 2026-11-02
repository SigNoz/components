import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Pagination } from '../pagination.js';
import { declareDesignTokens } from './pagination.test-utils.js';

declareDesignTokens();

const L1 = 'rgb(236, 238, 242)';
const L2 = 'rgb(192, 193, 195)';
const PRIMARY = 'rgb(78, 116, 248)';
const PRIMARY_FOREGROUND = 'rgb(255, 255, 255)';
const SECONDARY_BORDER = 'rgb(35, 38, 46)';

function style(testId: string): CSSStyleDeclaration {
	return getComputedStyle(screen.getByTestId(testId));
}

function afterTransition(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 300);
	});
}

describe('Pagination page buttons', () => {
	it('draw the pages in the secondary foreground at 13px', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		expect(style('p-page-9').color).toBe(L2);
		expect(style('p-page-9').fontSize).toBe('13px');
		expect(style('p-page-9').backgroundColor).toBe('rgba(0, 0, 0, 0)');
	});

	it('draw the current page on the primary background with a 2px radius and a 1px 4px padding', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		const current = style('p-page-10');

		expect(current.backgroundColor).toBe(PRIMARY);
		expect(current.color).toBe(PRIMARY_FOREGROUND);
		expect(current.borderRadius).toBe('2px');
		expect(current.paddingBlockStart).toBe('1px');
		expect(current.paddingInlineStart).toBe('4px');
		expect(current.paddingInlineEnd).toBe('4px');
	});

	it('are at least 24px tall and wide', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		const rect = screen.getByTestId('p-page-9').getBoundingClientRect();

		expect(rect.height).toBe(24);
		expect(rect.width).toBeGreaterThanOrEqual(24);
	});

	it('use tabular numerals', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		expect(style('p-page-9').fontVariantNumeric).toContain('tabular-nums');
		expect(style('p-total').fontVariantNumeric).toContain('tabular-nums');
	});

	it('take the foreground of the first level on hover', async () => {
		render(<Pagination total={200} current={10} testId="p" />);

		await userEvent.hover(screen.getByTestId('p-page-9'));

		await expect.poll(() => style('p-page-9').color).toBe(L1);
	});

	it('leave the current page as it is on hover', async () => {
		render(<Pagination total={200} current={10} testId="p" />);

		await userEvent.hover(screen.getByTestId('p-page-10'));
		await afterTransition();

		expect(style('p-page-10').color).toBe(PRIMARY_FOREGROUND);
		expect(style('p-page-10').backgroundColor).toBe(PRIMARY);
	});

	it('do not change on hover while disabled', async () => {
		render(<Pagination total={200} current={10} disabled disabledTooltip="Loading" testId="p" />);

		await userEvent.hover(screen.getByTestId('p-page-9'));
		await afterTransition();

		expect(style('p-page-9').color).toBe(L2);
		expect(style('p-page-9').opacity).toBe('0.4');
	});
});

describe('Pagination arrows', () => {
	it('draw a 16px wide, 24px tall box in the secondary foreground', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		const rect = screen.getByTestId('p-previous').getBoundingClientRect();

		expect(rect.width).toBe(16);
		expect(rect.height).toBe(24);
		expect(style('p-previous').color).toBe(L2);
	});

	it('take the foreground of the first level on hover', async () => {
		render(<Pagination total={200} current={10} testId="p" />);

		await userEvent.hover(screen.getByTestId('p-next'));

		await expect.poll(() => style('p-next').color).toBe(L1);
	});

	it('fade to 0.4 and do not change on hover at the end of the range', async () => {
		render(<Pagination total={200} current={1} testId="p" />);

		expect(style('p-previous').opacity).toBe('0.4');
		expect(style('p-next').opacity).toBe('1');

		await userEvent.hover(screen.getByTestId('p-previous'));
		await afterTransition();

		expect(style('p-previous').color).toBe(L2);
	});
});

describe('Pagination separator', () => {
	it('draws a 1px rule with round ends, in the foreground of the first level', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		const rule = getComputedStyle(screen.getByTestId('p-separator-start'), '::before');

		expect(rule.height).toBe('1px');
		expect(Number.parseFloat(rule.width)).toBe(
			screen.getByTestId('p-separator-start').getBoundingClientRect().width,
		);
		expect(rule.backgroundColor).toBe(L1);
		expect(Number.parseFloat(rule.borderTopLeftRadius)).toBeGreaterThanOrEqual(0.5);
	});

	it('is a 24px tall box, as wide as a page', () => {
		render(<Pagination total={200} current={10} testId="p" />);

		const separator = screen.getByTestId('p-separator-start').getBoundingClientRect();
		const page = screen.getByTestId('p-page-9').getBoundingClientRect();

		expect(separator.height).toBe(24);
		expect(separator.width).toBe(page.width);
	});
});

describe('Pagination compact controls', () => {
	it('draw Previous and Next as ghost buttons with a 6px 10px padding and a 13px label', () => {
		render(<Pagination total={200} variant="compact" current={10} testId="p" />);

		for (const id of ['p-previous', 'p-next']) {
			expect(screen.getByTestId(id)).toHaveAttribute('data-variant', 'ghost');
			expect(screen.getByTestId(id)).toHaveAttribute('data-color', 'secondary');
			expect(style(id).paddingBlockStart).toBe('6px');
			expect(style(id).paddingInlineStart).toBe('10px');
			expect(style(id).fontSize).toBe('13px');
		}
	});

	it('put the arrows beside the labels, the left one before Previous and the right one after Next', () => {
		render(<Pagination total={200} variant="compact" current={10} testId="p" />);

		const previous = screen.getByTestId('p-previous');
		const next = screen.getByTestId('p-next');

		expect(previous.querySelector('[data-testid="arrow-left"]')).not.toBeNull();
		expect(next.querySelector('[data-testid="arrow-right"]')).not.toBeNull();
		expect(
			Boolean(
				previous
					.querySelector('[data-testid="arrow-left"]')
					?.compareDocumentPosition(
						previous.querySelector('[data-slot="button-label"]') as Element,
					) & Node.DOCUMENT_POSITION_FOLLOWING,
			),
		).toBe(true);
		expect(
			Boolean(
				next
					.querySelector('[data-slot="button-label"]')
					?.compareDocumentPosition(next.querySelector('[data-testid="arrow-right"]') as Element) &
				Node.DOCUMENT_POSITION_FOLLOWING,
			),
		).toBe(true);
	});

	it('draw a 1px by 16px divider in the secondary border color', () => {
		render(<Pagination total={200} variant="compact" current={10} testId="p" />);

		const rect = screen.getByTestId('p-divider').getBoundingClientRect();

		expect(rect.width).toBe(1);
		expect(rect.height).toBe(16);
		expect(style('p-divider').backgroundColor).toBe(SECONDARY_BORDER);
	});

	it('leave 8px between the buttons and the divider', () => {
		render(<Pagination total={200} variant="compact" current={10} testId="p" />);

		const previous = screen.getByTestId('p-previous').getBoundingClientRect();
		const divider = screen.getByTestId('p-divider').getBoundingClientRect();
		const next = screen.getByTestId('p-next').getBoundingClientRect();

		expect(divider.left - previous.right).toBe(8);
		expect(next.left - divider.right).toBe(8);
	});
});

describe('Pagination position label', () => {
	it('draws in the secondary foreground', () => {
		render(<Pagination total={200} testId="p" />);

		expect(style('p-total').color).toBe(L2);
	});
});
