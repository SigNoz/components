import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination.js';
import { positionOf, declareDesignTokens } from './pagination.test-utils.js';

declareDesignTokens();

describe('Pagination.Cursor', () => {
	it('renders the compact controls and the page number', () => {
		render(<Pagination.Cursor hasNextPage defaultCurrent={3} testId="p" />);

		const nav = screen.getByTestId('p');

		expect(nav).toHaveAttribute('data-slot', 'pagination');
		expect(nav).toHaveAttribute('data-variant', 'compact');
		expect(screen.getByRole('navigation', { name: 'Pagination' })).toBe(nav);
		expect(positionOf('p-total')).toBe('Page 3');
		expect(screen.getByRole('button', { name: 'Previous' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Next' })).toBeVisible();
		expect(document.querySelector('[data-slot="pagination-page"]')).toBeNull();
	});

	it('hides Previous on the first page and keeps its space', () => {
		const { rerender } = render(<Pagination.Cursor hasNextPage current={2} testId="p" />);
		const before = screen.getByTestId('p-next').getBoundingClientRect().left;

		rerender(<Pagination.Cursor hasNextPage current={1} testId="p" />);

		expect(screen.getByTestId('p-previous')).not.toBeVisible();
		expect(screen.getByTestId('p-divider')).not.toBeVisible();
		expect(screen.getByTestId('p-next').getBoundingClientRect().left).toBe(before);
	});

	it('hides Next while hasNextPage is false, and keeps its space', () => {
		const { rerender } = render(<Pagination.Cursor hasNextPage current={2} testId="p" />);
		const before = screen.getByTestId('p-previous').getBoundingClientRect().left;

		rerender(<Pagination.Cursor hasNextPage={false} current={2} testId="p" />);

		expect(screen.getByTestId('p-next')).not.toBeVisible();
		expect(screen.getByTestId('p-divider')).not.toBeVisible();
		expect(screen.getByRole('button', { name: 'Previous' })).toBeVisible();
		expect(screen.getByTestId('p-previous').getBoundingClientRect().left).toBe(before);
	});

	it('shows Next again when a next page appears', () => {
		const { rerender } = render(<Pagination.Cursor hasNextPage={false} current={1} testId="p" />);

		expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();

		rerender(<Pagination.Cursor hasNextPage current={1} testId="p" />);

		expect(screen.getByRole('button', { name: 'Next' })).toBeVisible();
	});

	it('moves a page at a time and has no last page', async () => {
		const onPageChange = vi.fn();
		render(
			<Pagination.Cursor hasNextPage defaultCurrent={40} onPageChange={onPageChange} testId="p" />,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(onPageChange).toHaveBeenCalledWith(41);
		expect(positionOf('p-total')).toBe('Page 41');

		await userEvent.click(screen.getByRole('button', { name: 'Previous' }));

		expect(onPageChange).toHaveBeenLastCalledWith(40);
	});

	it('follows current when controlled', async () => {
		const onPageChange = vi.fn();
		const { rerender } = render(
			<Pagination.Cursor hasNextPage current={3} onPageChange={onPageChange} testId="p" />,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(onPageChange).toHaveBeenCalledWith(4);
		expect(positionOf('p-total')).toBe('Page 3');

		rerender(<Pagination.Cursor hasNextPage current={4} onPageChange={onPageChange} testId="p" />);

		expect(positionOf('p-total')).toBe('Page 4');
	});

	it('renders page 1 for a page below it and calls onPageChange once', () => {
		const onPageChange = vi.fn();
		render(<Pagination.Cursor hasNextPage current={0} onPageChange={onPageChange} testId="p" />);

		expect(positionOf('p-total')).toBe('Page 1');
		expect(onPageChange).toHaveBeenCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('always renders, even on page 1 with no next page', () => {
		render(<Pagination.Cursor hasNextPage={false} testId="p" />);

		expect(positionOf('p-total')).toBe('Page 1');
	});

	it('groups a long page number', () => {
		render(<Pagination.Cursor hasNextPage current={1200} testId="p" />);

		expect(positionOf('p-total')).toBe('Page 1,200');
	});

	it('hides the position label with showTotal false', () => {
		render(<Pagination.Cursor hasNextPage showTotal={false} testId="p" />);

		expect(screen.queryByTestId('p-total')).toBeNull();
	});

	it('takes the page size selector and calls onPageSizeChange before onPageChange', async () => {
		const onPageSizeChange = vi.fn();
		const onPageChange = vi.fn();
		render(
			<Pagination.Cursor
				hasNextPage
				pageSizeOptions
				defaultCurrent={4}
				onPageSizeChange={onPageSizeChange}
				onPageChange={onPageChange}
				testId="p"
			/>,
		);

		await userEvent.click(screen.getByRole('combobox', { name: 'Rows per page' }));
		await userEvent.click(await screen.findByRole('option', { name: '30' }));

		expect(onPageSizeChange).toHaveBeenCalledWith(30);
		expect(onPageChange).toHaveBeenCalledWith(1);
		expect(onPageSizeChange.mock.invocationCallOrder[0]).toBeLessThan(
			onPageChange.mock.invocationCallOrder[0] ?? 0,
		);
		expect(positionOf('p-total')).toBe('Page 1');
	});

	it('takes align and the page size position', () => {
		render(
			<Pagination.Cursor
				hasNextPage
				showTotal={false}
				align="start"
				pageSizeOptions={{ position: 'start' }}
				testId="p"
			/>,
		);

		expect(screen.getByTestId('p')).toHaveAttribute('data-align', 'start');
		expect(
			Boolean(
				screen
					.getByTestId('p-page-size')
					.compareDocumentPosition(screen.getByTestId('p-previous')) &
				Node.DOCUMENT_POSITION_FOLLOWING,
			),
		).toBe(true);
	});

	it('forwards the id, aria-* and data-* props and the ref to the nav', () => {
		const ref = createRef<HTMLElement>();
		render(<Pagination.Cursor ref={ref} hasNextPage id="logs" aria-label="Logs" data-foo="bar" />);

		expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Logs' }));
		expect(ref.current).toHaveAttribute('id', 'logs');
		expect(ref.current).toHaveAttribute('data-foo', 'bar');
	});

	it('disables and explains like Pagination', async () => {
		const onPageChange = vi.fn();
		render(
			<Pagination.Cursor
				hasNextPage
				defaultCurrent={2}
				disabled
				disabledTooltip="Loading"
				onPageChange={onPageChange}
				testId="p"
			/>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Next' }));

		expect(onPageChange).not.toHaveBeenCalled();
		expect(screen.getByTestId('p')).toHaveAttribute('data-disabled', 'true');

		await userEvent.hover(screen.getByRole('button', { name: 'Next' }));

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Loading');
	});
});
