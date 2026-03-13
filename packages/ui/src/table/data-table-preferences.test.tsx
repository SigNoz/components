import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from './data-table.js';
import {
	clearTablePreferences,
	createColumns,
	createPersonData,
	getStoredPreferences,
	renderDataTable,
} from './data-table.test-utils.js';

describe('DataTable preferences', () => {
	it('preferences saved to localStorage after state changes', () => {
		const tableId = `pref-${Date.now()}`;
		clearTablePreferences(tableId);
		const { unmount } = renderDataTable({
			columns: createColumns(),
			data: createPersonData(5),
			tableId,
			enableRowSelection: true,
			testId: 'table-pref',
		});
		const checkbox = screen.getAllByRole('checkbox', { name: /Select row/ })[0];
		fireEvent.click(checkbox);
		unmount();
		const prefs = getStoredPreferences(tableId);
		expect(prefs.rowSelection).toBeDefined();
	});

	it('preferences restored on remount', () => {
		const tableId = `pref-restore-${Date.now()}`;
		clearTablePreferences(tableId);
		const data = createPersonData(5);
		const { unmount } = render(
			<DataTable
				columns={createColumns()}
				data={data}
				tableId={tableId}
				enableRowSelection={true}
				testId="table-pref2"
			/>
		);
		const checkbox = screen.getAllByRole('checkbox', { name: /Select row/ })[0];
		fireEvent.click(checkbox);
		unmount();
		render(
			<DataTable
				columns={createColumns()}
				data={data}
				tableId={tableId}
				enableRowSelection={true}
				testId="table-pref2"
			/>
		);
		const prefs = getStoredPreferences(tableId);
		expect(prefs.rowSelection).toBeDefined();
	});
});
