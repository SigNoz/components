import { waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
	createColumns,
	createPersonData,
	mockIntersectionObserver,
	renderDataTable,
} from './data-table.test-utils.js';

describe('DataTable infinite scroll', () => {
	it('onLoadMore called when sentinel intersects', async () => {
		const onLoadMore = vi.fn();
		const { getTrigger } = mockIntersectionObserver();
		renderDataTable({
			columns: createColumns(),
			data: createPersonData(10),
			tableId: 'inf-1',
			enableInfiniteScroll: true,
			hasMore: true,
			onLoadMore,
			fixedHeight: 300,
			testId: 'table-inf',
		});
		await waitFor(() => expect(getTrigger()).toBeDefined());
		getTrigger()?.(true);
		await waitFor(() => expect(onLoadMore).toHaveBeenCalled());
	});

	it('onLoadMore not called when hasMore is false', () => {
		const onLoadMore = vi.fn();
		mockIntersectionObserver();
		renderDataTable({
			columns: createColumns(),
			data: createPersonData(5),
			tableId: 'inf-2',
			enableInfiniteScroll: true,
			hasMore: false,
			onLoadMore,
			testId: 'table-inf2',
		});
		expect(onLoadMore).not.toHaveBeenCalled();
	});
});
