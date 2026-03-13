import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from './data-table.js';
import {
	createColumns,
	createPersonData,
	mockGetBoundingClientRect,
	renderDataTable,
} from './data-table.test-utils.js';

describe('DataTable virtualization', () => {
	it('renders when enableVirtualization with mocks', () => {
		mockGetBoundingClientRect(40);
		const data = createPersonData(100);
		renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'virt-1',
			enableVirtualization: true,
			fixedHeight: 400,
			estimateRowSize: 40,
			testId: 'table-virt',
		});
		expect(screen.getByTestId('table-virt')).toBeInTheDocument();
	});

	it('scrollToIndexRef invokes scroll when provided', () => {
		mockGetBoundingClientRect(40);
		const scrollToIndexRef = {
			current: undefined as
				| ((rowIndex: number, options?: { align?: 'start' | 'center' | 'end' }) => void)
				| undefined,
		};
		const data = createPersonData(50);
		render(
			<DataTable
				columns={createColumns()}
				data={data}
				tableId="virt-2"
				enableVirtualization={true}
				fixedHeight={400}
				estimateRowSize={40}
				scrollToIndexRef={scrollToIndexRef}
				testId="table-virt2"
			/>
		);
		expect(scrollToIndexRef.current).toBeDefined();
		expect(() => scrollToIndexRef.current?.(10, { align: 'center' })).not.toThrow();
	});
});
