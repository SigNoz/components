import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';

describe('DataTable rendering', () => {
	it('renders with minimal props', () => {
		renderDataTable({
			columns: createColumns(),
			data: createPersonData(3),
			tableId: 'render-1',
			testId: 'table-1',
		});
		expect(screen.getByTestId('table-1')).toBeInTheDocument();
	});

	it('renders all column headers', () => {
		renderDataTable({ testId: 'table-2' });
		expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
		expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
		expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
	});

	it('renders all cell values', () => {
		const data = createPersonData(2);
		renderDataTable({ data, testId: 'table-3' });
		expect(screen.getByText(data[0].name)).toBeInTheDocument();
		expect(screen.getByText(data[0].email)).toBeInTheDocument();
		expect(screen.getByText(data[1].name)).toBeInTheDocument();
	});

	it('shows loading spinner when isLoading', () => {
		renderDataTable({ isLoading: true, testId: 'table-4' });
		expect(document.querySelector('.animate-fast-spin')).toBeInTheDocument();
	});

	it('hides headers when showHeaders is false', () => {
		renderDataTable({ showHeaders: false, testId: 'table-5' });
		expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
	});

	it('renders empty data without error', () => {
		renderDataTable({ data: [], testId: 'table-6' });
		expect(screen.getByTestId('table-6')).toBeInTheDocument();
	});

	it('applies testId to root', () => {
		renderDataTable({ testId: 'my-data-table' });
		expect(screen.getByTestId('my-data-table')).toBeInTheDocument();
	});
});
