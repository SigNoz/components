import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CSSProperties, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf, slotsOf, declareDesignTokens, widthOf } from './pagination.test-utils.js';

declareDesignTokens();

const WIDE: CSSProperties = { inlineSize: '900px' };

function Frame({ children, width = 900 }: { children: ReactNode; width?: number }) {
	return <div style={{ inlineSize: `${width}px` }}>{children}</div>;
}

function slotWidths(testId: string): number[] {
	return Array.from(
		screen
			.getByTestId(testId)
			.querySelectorAll('[data-slot="pagination-page"], [data-slot="pagination-separator"]'),
	).map(widthOf);
}

function pagesElement(testId: string): HTMLElement {
	return screen.getByTestId(`${testId}-previous`).parentElement as HTMLElement;
}

describe('Pagination stable layout', () => {
	it('gives every slot, separators included, the same width', () => {
		render(
			<Frame>
				<Pagination total={200} current={10} testId="p" />
			</Frame>,
		);

		const widths = slotWidths('p');

		expect(widths).toHaveLength(7);
		expect(new Set(widths.map((width) => width.toFixed(2))).size).toBe(1);
	});

	it('keeps the width of the page list on every page of 20 pages', () => {
		const { rerender } = render(
			<Frame>
				<Pagination total={200} current={1} testId="p" />
			</Frame>,
		);
		const reference = widthOf(pagesElement('p'));
		const referenceSlot = slotWidths('p')[0];

		for (let page = 1; page <= 20; page += 1) {
			rerender(
				<Frame>
					<Pagination total={200} current={page} testId="p" />
				</Frame>,
			);

			expect(slotsOf('p'), `page ${page}`).toHaveLength(7);
			expect(widthOf(pagesElement('p')), `page ${page}`).toBeCloseTo(reference, 2);
			expect(new Set(slotWidths('p').map((width) => width.toFixed(2))).size).toBe(1);
			expect(slotWidths('p')[0]).toBeCloseTo(referenceSlot ?? 0, 2);
		}
	});

	it('keeps every control where it was while the page changes', () => {
		const { rerender } = render(
			<Frame>
				<Pagination total={1000} current={1} pageSizeOptions testId="p" />
			</Frame>,
		);
		const positions = () =>
			['p-previous', 'p-next', 'p-page-size'].map(
				(id) => screen.getByTestId(id).getBoundingClientRect().left,
			);
		const before = positions();

		for (const page of [2, 3, 4, 5, 9, 10, 11, 50, 97, 98, 99, 100]) {
			rerender(
				<Frame>
					<Pagination total={1000} current={page} pageSizeOptions testId="p" />
				</Frame>,
			);

			expect(positions(), `page ${page}`).toEqual(before);
		}
	});

	it('keeps the slots square up to two digits and grows them for a third', () => {
		const { rerender } = render(
			<Frame>
				<Pagination total={90} current={1} testId="p" />
			</Frame>,
		);
		const oneDigit = slotWidths('p')[0] ?? 0;

		rerender(
			<Frame>
				<Pagination total={990} current={1} testId="p" />
			</Frame>,
		);
		const twoDigits = slotWidths('p')[0] ?? 0;

		rerender(
			<Frame>
				<Pagination total={1000} current={1} testId="p" />
			</Frame>,
		);
		const threeDigits = slotWidths('p')[0] ?? 0;

		rerender(
			<Frame>
				<Pagination total={10000} current={1} testId="p" />
			</Frame>,
		);
		const fourDigits = slotWidths('p')[0] ?? 0;

		expect(oneDigit).toBe(24);
		expect(twoDigits).toBe(24);
		expect(threeDigits).toBeGreaterThan(twoDigits);
		expect(fourDigits).toBeGreaterThan(threeDigits);
	});

	it('does not change a width going from page 9 to page 10', () => {
		const { rerender } = render(
			<Frame>
				<Pagination total={1000} current={9} testId="p" />
			</Frame>,
		);
		const before = widthOf(pagesElement('p'));

		rerender(
			<Frame>
				<Pagination total={1000} current={10} testId="p" />
			</Frame>,
		);

		expect(widthOf(pagesElement('p'))).toBeCloseTo(before, 2);
	});

	it('uses the widest slot for the longest page number, with the padding of the current page', () => {
		render(
			<Frame>
				<Pagination total={1000} current={50} testId="p" />
			</Frame>,
		);

		const current = screen.getByTestId('p-page-50');
		const digits = widthOf(current) - 8;

		expect(digits).toBeGreaterThanOrEqual(24 - 8);
		expect(slotWidths('p').every((width) => Math.abs(width - widthOf(current)) < 0.01)).toBe(true);
	});

	it('is a 24px square per slot up to 99 pages', () => {
		render(
			<Frame>
				<Pagination total={200} current={10} testId="p" />
			</Frame>,
		);

		for (const id of ['p-page-1', 'p-page-10', 'p-separator-start']) {
			const rect = screen.getByTestId(id).getBoundingClientRect();

			expect(rect.height, id).toBe(24);
			expect(rect.width, id).toBe(24);
		}
	});

	it('keeps the position label at one width for the longest value', async () => {
		render(
			<Frame>
				<Pagination total={100} pageSize={20} testId="p" />
			</Frame>,
		);
		const first = widthOf(screen.getByTestId('p-total'));

		expect(positionOf('p-total')).toBe('1 \u2014 20 of 100');

		await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));

		expect(positionOf('p-total')).toBe('81 \u2014 100 of 100');
		expect(widthOf(screen.getByTestId('p-total'))).toBeCloseTo(first, 2);
	});

	it('keeps the position label width across every page', () => {
		const { rerender } = render(
			<Frame>
				<Pagination total={12345} pageSize={20} current={1} showTotalLabel="pods" testId="p" />
			</Frame>,
		);
		const first = widthOf(screen.getByTestId('p-total'));

		for (const page of [2, 9, 10, 11, 100, 500, 617]) {
			rerender(
				<Frame>
					<Pagination total={12345} pageSize={20} current={page} showTotalLabel="pods" testId="p" />
				</Frame>,
			);

			expect(widthOf(screen.getByTestId('p-total')), `page ${page}`).toBeCloseTo(first, 2);
		}
	});

	it('changes the label width when the total or the page size changes', () => {
		const { rerender } = render(
			<Frame>
				<Pagination total={100} pageSize={20} testId="p" />
			</Frame>,
		);
		const before = widthOf(screen.getByTestId('p-total'));

		rerender(
			<Frame>
				<Pagination total={100000} pageSize={20} testId="p" />
			</Frame>,
		);

		expect(widthOf(screen.getByTestId('p-total'))).toBeGreaterThan(before);
	});

	it('does not stack the invisible copy under the visible text', () => {
		render(
			<Frame>
				<Pagination total={100} pageSize={20} testId="p" />
			</Frame>,
		);

		expect(screen.getByTestId('p-total').getBoundingClientRect().height).toBeLessThan(20);
	});
});

describe('Pagination bar', () => {
	it('has the padding and gap of the design', () => {
		render(
			<Frame>
				<Pagination total={200} testId="p" />
			</Frame>,
		);

		const style = getComputedStyle(screen.getByTestId('p'));

		expect(style.paddingBlockStart).toBe('8px');
		expect(style.paddingBlockEnd).toBe('8px');
		expect(style.paddingInlineStart).toBe('16px');
		expect(style.paddingInlineEnd).toBe('10px');
		expect(style.columnGap).toBe('16px');
	});

	it('fills the width of its parent', () => {
		render(
			<Frame width={640}>
				<Pagination total={200} testId="p" />
			</Frame>,
		);

		expect(widthOf(screen.getByTestId('p'))).toBe(640);
	});

	it('takes its padding from custom properties', () => {
		render(
			<div
				style={
					{
						inlineSize: '640px',
						'--pagination-padding-block': '2px',
						'--pagination-padding-inline-start': '40px',
						'--pagination-padding-inline-end': '4px',
					} as CSSProperties
				}
			>
				<Pagination total={200} testId="p" />
			</div>,
		);

		const style = getComputedStyle(screen.getByTestId('p'));

		expect(style.paddingBlockStart).toBe('2px');
		expect(style.paddingInlineStart).toBe('40px');
		expect(style.paddingInlineEnd).toBe('4px');
	});

	it('puts the position label at the start and the controls at the end', () => {
		render(
			<Frame>
				<Pagination total={200} testId="p" />
			</Frame>,
		);

		const nav = screen.getByTestId('p').getBoundingClientRect();
		const total = screen.getByTestId('p-total').getBoundingClientRect();
		const next = screen.getByTestId('p-next').getBoundingClientRect();

		expect(total.left).toBe(nav.left + 16);
		expect(nav.right - next.right).toBe(10);
	});

	it.each([
		['start', 16],
		['end', 10],
	] as const)('places the controls at the %s without a position label', (align, inset) => {
		render(
			<Frame>
				<Pagination total={200} showTotal={false} align={align} testId="p" />
			</Frame>,
		);

		const nav = screen.getByTestId('p').getBoundingClientRect();
		const previous = screen.getByTestId('p-previous').getBoundingClientRect();
		const next = screen.getByTestId('p-next').getBoundingClientRect();

		if (align === 'start') {
			expect(previous.left - nav.left).toBe(inset);
		} else {
			expect(nav.right - next.right).toBe(inset);
		}
	});

	it('centers the controls without a position label', () => {
		render(
			<Frame>
				<Pagination total={200} showTotal={false} align="center" testId="p" />
			</Frame>,
		);

		const nav = screen.getByTestId('p').getBoundingClientRect();
		const controls = pagesElement('p').getBoundingClientRect();

		expect(controls.left - nav.left).toBeGreaterThan(100);
		expect(nav.right - controls.right).toBeGreaterThan(100);
	});

	it('ignores align while the position label shows', () => {
		render(
			<Frame>
				<Pagination total={200} align="start" testId="p" />
			</Frame>,
		);

		const nav = screen.getByTestId('p').getBoundingClientRect();

		expect(nav.right - screen.getByTestId('p-next').getBoundingClientRect().right).toBe(10);
	});
});

describe('Pagination overflow', () => {
	const LABEL = 'a very long noun for the total of this list';

	it('truncates the position label first, and never the controls', async () => {
		render(
			<Frame width={420}>
				<Pagination total={1000000} showTotalLabel={LABEL} pageSizeOptions testId="p" />
			</Frame>,
		);

		const text = screen.getByTestId('p-total').firstElementChild as HTMLElement;

		expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
		await waitFor(() => expect(screen.getByTestId('p-total')).toHaveAttribute('data-truncated'));
		expect(widthOf(screen.getByTestId('p-total'))).toBeLessThan(250);

		const nav = screen.getByTestId('p').getBoundingClientRect();

		for (const id of ['p-previous', 'p-page-1', 'p-next', 'p-page-size']) {
			const rect = screen.getByTestId(id).getBoundingClientRect();

			expect(rect.right, id).toBeLessThanOrEqual(nav.right + 0.5);
			expect(rect.height, id).toBeLessThan(40);
		}
	});

	it('keeps a gap between the position label and the controls', () => {
		render(
			<Frame width={420}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);

		const total = screen.getByTestId('p-total').getBoundingClientRect();
		const previous = screen.getByTestId('p-previous').getBoundingClientRect();

		expect(previous.left - total.right).toBeGreaterThanOrEqual(16);
	});

	it('does not shrink the controls with the bar', () => {
		const { rerender } = render(
			<Frame width={900}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);
		const wide = widthOf(pagesElement('p'));

		rerender(
			<Frame width={420}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);

		expect(widthOf(pagesElement('p'))).toBeCloseTo(wide, 2);
	});

	it('shows the full text in a tooltip only while it is truncated', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Frame width={420}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);

		await waitFor(() => expect(screen.getByTestId('p-total')).toHaveAttribute('data-truncated'));
		await user.hover(screen.getByTestId('p-total'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(
			`1 \u2014 10 of 1,000,000 ${LABEL}`,
		);

		await user.unhover(screen.getByTestId('p-total'));
		rerender(
			<Frame width={1200}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);

		await waitFor(() =>
			expect(screen.getByTestId('p-total')).not.toHaveAttribute('data-truncated'),
		);
	});

	it('puts the truncated label in the tab order and shows the full text on keyboard focus', async () => {
		const user = userEvent.setup();
		render(
			<Frame width={420}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);

		await waitFor(() => expect(screen.getByTestId('p-total')).toHaveAttribute('data-truncated'));
		await user.tab();

		expect(screen.getByTestId('p-total')).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(
			`1 \u2014 10 of 1,000,000 ${LABEL}`,
		);
	});

	it('keeps a label that fits out of the tab order', async () => {
		const user = userEvent.setup();
		render(
			<Frame width={900}>
				<Pagination total={100} testId="p" />
			</Frame>,
		);

		await user.tab();

		expect(screen.getByTestId('p-total')).not.toHaveAttribute('tabindex');
		expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus();
	});

	it('shows no tooltip for a label that fits', async () => {
		const user = userEvent.setup();
		render(
			<Frame width={900}>
				<Pagination total={100} testId="p" />
			</Frame>,
		);

		await user.hover(screen.getByTestId('p-total'));
		await new Promise((resolve) => {
			setTimeout(resolve, 450);
		});

		expect(screen.queryByRole('tooltip')).toBeNull();
		expect(screen.getByTestId('p-total')).not.toHaveAttribute('data-truncated');
	});

	it('keeps the full text for assistive tech while it is clipped', () => {
		render(
			<Frame width={420}>
				<Pagination total={1000000} showTotalLabel={LABEL} testId="p" />
			</Frame>,
		);

		expect(positionOf('p-total')).toBe(`1 \u2014 10 of 1,000,000 ${LABEL}`);
	});
});

describe('Pagination layout style hooks', () => {
	it('is not a wide element when the container is', () => {
		render(
			<div style={WIDE}>
				<Pagination total={200} testId="p" />
			</div>,
		);

		expect(getComputedStyle(screen.getByTestId('p')).display).toBe('flex');
	});

	it('hides the compact controls with visibility, not display', () => {
		render(
			<Frame>
				<Pagination total={200} variant="compact" current={1} testId="p" />
			</Frame>,
		);

		expect(getComputedStyle(screen.getByTestId('p-previous')).visibility).toBe('hidden');
		expect(getComputedStyle(screen.getByTestId('p-previous')).display).not.toBe('none');
	});
});
