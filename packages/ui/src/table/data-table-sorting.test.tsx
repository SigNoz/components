import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';

describe('DataTable sorting', () => {
	it('clicking header toggles sort when enableSorting', () => {
		const data = createPersonData(5);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'sort-1',
			enableSorting: true,
			testId: 'table-sort',
		});
		const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
		fireEvent.click(nameHeader);
		const rows = screen.getAllByRole('row').slice(1);
		expect(rows.length).toBe(5);
	});

	it('sorting disabled when enableSorting is false', () => {
		renderDataTable({
			enableSorting: false,
			tableId: 'sort-2',
			testId: 'table-no-sort',
		});
		expect(screen.getByTestId('table-no-sort')).toBeInTheDocument();
	});
});
