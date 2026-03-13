import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';

function getPaginationNextButton() {
	const pageInfo = screen.getByText(/Page \d+ of \d+/);
	const paginationButtons = within(pageInfo.parentElement!).getAllByRole('button');
	return paginationButtons[2];
}

describe('DataTable pagination', () => {
	it('renders pagination controls when enablePagination', () => {
		const data = createPersonData(25);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'page-1',
			enablePagination: true,
			pageSize: 10,
			testId: 'table-page',
		});
		expect(getPaginationNextButton()).toBeInTheDocument();
	});

	it('page change updates visible rows', () => {
		const data = createPersonData(25);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'page-2',
			enablePagination: true,
			pageSize: 10,
			testId: 'table-page2',
		});
		fireEvent.click(getPaginationNextButton());
		expect(screen.getByText('Person 11')).toBeInTheDocument();
	});

	it('onPageChange called when page changes', () => {
		const onPageChange = vi.fn();
		const data = createPersonData(25);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'page-3',
			enablePagination: true,
			pageSize: 10,
			onPageChange,
			testId: 'table-page3',
		});
		fireEvent.click(getPaginationNextButton());
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('pagination hidden when disabled', () => {
		renderDataTable({
			enablePagination: false,
			tableId: 'page-4',
			testId: 'table-no-page',
		});
		expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
	});
});
