import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf, declareDesignTokens } from './pagination.test-utils.js';

declareDesignTokens();

function left(testId: string): number {
	return screen.getByTestId(testId).getBoundingClientRect().left;
}

describe('Pagination compact', () => {
	it('renders Previous and Next in place of the page list', () => {
		render(<Pagination total={100} variant="compact" defaultCurrent={5} testId="p" />);

		expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
		expect(document.querySelector('[data-slot="pagination-page"]')).toBeNull();
		expect(document.querySelector('[data-slot="pagination-separator"]')).toBeNull();
		expect(screen.getByTestId('p')).toHaveAttribute('data-variant', 'compact');
	});

	it('names the buttons by their visible label', () => {
		render(<Pagination total={100} variant="compact" defaultCurrent={5} />);

		expect(screen.queryByRole('button', { name: 'Previous page' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull();
	});

	it('draws a divider between them, hidden from assistive tech', () => {
		render(<Pagination total={100} variant="compact" defaultCurrent={5} testId="p" />);

		const divider = screen.getByTestId('p-divider');

		expect(divider).toHaveAttribute('data-slot', 'pagination-divider');
		expect(divider).toHaveAttribute('aria-hidden', 'true');
		expect(divider).toBeVisible();
	});

	it('gives the buttons the slots and test ids of the arrows', () => {
		render(<Pagination total={100} variant="compact" defaultCurrent={5} testId="p" />);

		expect(screen.getByTestId('p-previous')).toHaveAttribute('data-slot', 'pagination-previous');
		expect(screen.getByTestId('p-next')).toHaveAttribute('data-slot', 'pagination-next');
	});

	it('moves a page at a time', async () => {
		const onPageChange = vi.fn();
		render(
			<Pagination
				total={100}
				variant="compact"
				defaultCurrent={5}
				onPageChange={onPageChange}
				testId="p"
			/>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));
		expect(onPageChange).toHaveBeenLastCalledWith(6);
		expect(positionOf('p-total')).toBe('51 \u2014 60 of 100');

		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
		expect(onPageChange).toHaveBeenLastCalledWith(4);
	});

	it('hides Previous and the divider on the first page, and keeps their space', () => {
		const { rerender } = render(
			<Pagination total={100} variant="compact" current={5} testId="p" />,
		);
		const middle = {
			previous: left('p-previous'),
			divider: left('p-divider'),
			next: left('p-next'),
		};

		rerender(<Pagination total={100} variant="compact" current={1} testId="p" />);

		expect(screen.getByTestId('p-previous')).not.toBeVisible();
		expect(screen.getByTestId('p-divider')).not.toBeVisible();
		expect(screen.getByTestId('p-next')).toBeVisible();
		expect(left('p-previous')).toBe(middle.previous);
		expect(left('p-divider')).toBe(middle.divider);
		expect(left('p-next')).toBe(middle.next);
	});

	it('hides Next and the divider on the last page, and keeps their space', () => {
		const { rerender } = render(
			<Pagination total={100} variant="compact" current={5} testId="p" />,
		);
		const middle = {
			previous: left('p-previous'),
			divider: left('p-divider'),
			next: left('p-next'),
		};

		rerender(<Pagination total={100} variant="compact" current={10} testId="p" />);

		expect(screen.getByTestId('p-next')).not.toBeVisible();
		expect(screen.getByTestId('p-divider')).not.toBeVisible();
		expect(screen.getByTestId('p-previous')).toBeVisible();
		expect(left('p-previous')).toBe(middle.previous);
		expect(left('p-divider')).toBe(middle.divider);
		expect(left('p-next')).toBe(middle.next);
	});

	it('keeps the other button where it was on every page', () => {
		const { rerender } = render(
			<Pagination total={100} variant="compact" current={1} testId="p" />,
		);
		const nextAtStart = left('p-next');

		for (let page = 2; page <= 10; page += 1) {
			rerender(<Pagination total={100} variant="compact" current={page} testId="p" />);

			expect(left('p-next'), `page ${page}`).toBe(nextAtStart);
		}
	});

	it('takes a hidden button out of the accessibility tree and the tab order', async () => {
		render(<Pagination total={100} variant="compact" current={1} testId="p" />);

		expect(screen.queryByRole('button', { name: 'Previous' })).toBeNull();
		expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Next']);
		expect(screen.getByTestId('p-previous')).toBeInTheDocument();

		await userEvent.tab();

		expect(screen.getByTestId('p-next')).toHaveFocus();

		await userEvent.tab();

		expect(screen.getByTestId('p-previous')).not.toHaveFocus();
		expect(screen.getByTestId('p-next')).not.toHaveFocus();
	});

	it('keeps the divider out of the tab order and the accessibility tree', () => {
		render(<Pagination total={100} variant="compact" current={5} testId="p" />);

		expect(screen.getByTestId('p-divider')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('p-divider')).not.toHaveAttribute('tabindex');
	});

	it('marks the hidden controls, so a test can tell them apart', () => {
		render(<Pagination total={100} variant="compact" current={1} testId="p" />);

		expect(screen.getByTestId('p-previous')).toHaveAttribute('data-hidden');
		expect(screen.getByTestId('p-divider')).toHaveAttribute('data-hidden');
		expect(screen.getByTestId('p-next')).not.toHaveAttribute('data-hidden');
	});

	it.each([
		['a single page', 10, '1 — 10 of 10'],
		['a total of 0', 0, '0 — 0 of 0'],
	])('still renders for %s, with Previous, Next and the divider hidden', (_name, total, label) => {
		render(<Pagination total={total} variant="compact" pageSizeOptions testId="p" />);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
		expect(positionOf('p-total')).toBe(label);

		for (const id of ['p-previous', 'p-divider', 'p-next']) {
			expect(screen.getByTestId(id), id).toHaveAttribute('data-hidden');
			expect(screen.getByTestId(id), id).not.toBeVisible();
		}

		expect(screen.queryAllByRole('button')).toHaveLength(0);
		expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument();
	});

	it('keeps the space of the hidden controls for a single page', () => {
		const { rerender } = render(
			<Pagination total={100} variant="compact" current={5} testId="p" />,
		);
		const middle = {
			previous: left('p-previous'),
			divider: left('p-divider'),
			next: left('p-next'),
		};

		rerender(<Pagination total={0} variant="compact" testId="p" />);

		expect(left('p-previous')).toBe(middle.previous);
		expect(left('p-divider')).toBe(middle.divider);
		expect(left('p-next')).toBe(middle.next);
	});

	it('has the compact padding at the end of the bar', () => {
		render(<Pagination total={100} variant="compact" testId="p" />);

		expect(getComputedStyle(screen.getByTestId('p')).paddingInlineEnd).toBe('6px');
	});
});
