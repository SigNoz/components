import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';

describe('DataTable columns', () => {
	it('onColumnOrderChange called when column reordered', () => {
		const onColumnOrderChange = vi.fn();
		renderDataTable({
			columns: createColumns(),
			data: createPersonData(3),
			tableId: 'col-1',
			enableColumnReordering: true,
			onColumnOrderChange,
			testId: 'table-col',
		});
		expect(onColumnOrderChange).toHaveBeenCalled();
	});

	it('resize handle present when enableColumnResizing', () => {
		renderDataTable({
			enableColumnResizing: true,
			tableId: 'col-2',
			testId: 'table-resize',
		});
		expect(screen.getByTestId('table-resize')).toBeInTheDocument();
	});
});
