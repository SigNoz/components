import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
	createColumnsWithFilter,
	createPersonData,
	renderDataTable,
} from './data-table.test-utils.js';

describe('DataTable filtering', () => {
	it('column filter input filters rows', () => {
		const data = createPersonData(5);
		renderDataTable({
			columns: createColumnsWithFilter(),
			data,
			tableId: 'filter-1',
			enableFiltering: true,
			testId: 'table-filter',
		});
		const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
		const filterButton = within(nameHeader).getAllByRole('button')[1];
		fireEvent.click(filterButton);
		const filterInput = screen.getByPlaceholderText('Filter Name...');
		fireEvent.change(filterInput, { target: { value: 'Person 1' } });
		expect(screen.getByText('Person 1')).toBeInTheDocument();
		expect(() => screen.getByText('Person 2')).toThrowError();
	});
});
