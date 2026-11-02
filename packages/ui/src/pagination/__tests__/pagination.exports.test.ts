import { describe, expect, it } from 'vitest';
import * as pagination from '../index.js';

describe('pagination exports', () => {
	it('exports Pagination only', () => {
		expect(Object.keys(pagination).sort()).toEqual(['Pagination']);
	});

	it('does not export the primitives', () => {
		for (const name of [
			'PaginationContainer',
			'PaginationContent',
			'PaginationItem',
			'PaginationLink',
			'PaginationPrevious',
			'PaginationNext',
			'PaginationEllipsis',
			'PaginationSelector',
			'PaginationCursor',
			'PaginationUrl',
		]) {
			expect(pagination, name).not.toHaveProperty(name);
		}
	});

	it('reaches the cursor bar as a static of Pagination', () => {
		expect(pagination.Pagination.Cursor).toBeDefined();
	});
});
