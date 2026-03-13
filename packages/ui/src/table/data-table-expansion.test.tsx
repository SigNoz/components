import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';

describe('DataTable expansion', () => {
	it('expand via chevron when enableRowExpansion', () => {
		const data = createPersonData(3);
		const renderSubComponent = vi.fn(() => <div data-testid="sub-component">Expanded</div>);
		const { container } = renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'exp-1',
			enableRowExpansion: true,
			renderSubComponent,
			getRowCanExpand: () => true,
			testId: 'table-exp',
		});
		const tbody = container.querySelector('tbody');
		const expandBtn = tbody?.querySelector('button');
		expect(expandBtn).toBeTruthy();
		if (expandBtn) {
			fireEvent.click(expandBtn);
			expect(screen.getByTestId('sub-component')).toBeInTheDocument();
		}
	});

	it('onExpandedChange called when expand state changes', () => {
		const onExpandedChange = vi.fn();
		const data = createPersonData(2);
		const { container } = renderDataTable({
			columns: createColumns(),
			data,
			tableId: 'exp-2',
			enableRowExpansion: true,
			renderSubComponent: () => <span>Sub</span>,
			getRowCanExpand: () => true,
			onExpandedChange,
			testId: 'table-exp2',
		});
		const tbody = container.querySelector('tbody');
		const expandBtn = tbody?.querySelector('button');
		expect(expandBtn).toBeTruthy();
		if (expandBtn) {
			fireEvent.click(expandBtn);
			expect(onExpandedChange).toHaveBeenCalled();
		}
	});
});
