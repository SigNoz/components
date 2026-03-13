import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectionMode } from './data-table.js';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';

describe('DataTable selection', () => {
	it('single mode allows only one row selected', () => {
		const data = createPersonData(3);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'sel-1',
			enableRowSelection: true,
			selectionMode: SelectionMode.Single,
			testId: 'table-sel',
		});
		const checkboxes = screen.getAllByRole('checkbox', { name: /Select row/ });
		fireEvent.click(checkboxes[0]);
		expect(checkboxes[0]).toBeChecked();
		fireEvent.click(checkboxes[1]);
		expect(checkboxes[1]).toBeChecked();
		expect(checkboxes[0]).not.toBeChecked();
	});

	it('multiple mode allows multiple rows selected', () => {
		const data = createPersonData(3);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'sel-2',
			enableRowSelection: true,
			selectionMode: SelectionMode.Multiple,
			testId: 'table-multi',
		});
		const checkboxes = screen.getAllByRole('checkbox', { name: /Select row/ });
		fireEvent.click(checkboxes[1]);
		fireEvent.click(checkboxes[2]);
		expect(checkboxes[1]).toBeChecked();
		expect(checkboxes[2]).toBeChecked();
	});

	it('selection disabled when enableRowSelection is false', () => {
		renderDataTable({
			enableRowSelection: false,
			tableId: 'sel-3',
			testId: 'table-no-sel',
		});
		expect(screen.queryByRole('checkbox', { name: /Select row/ })).not.toBeInTheDocument();
	});
});
