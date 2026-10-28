import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createColumns, createPersonData, renderDataTable } from './data-table.test-utils.js';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from './table.js';

/**
 * The design tokens are not loaded here, so the values the table reads are declared in the test,
 * with the numbers `@signozhq/design-tokens` ships.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--spacing-1: 2px;
		--spacing-2: 4px;
		--spacing-4: 8px;
		--spacing-6: 12px;
		--spacing-8: 16px;
		--spacing-16: 32px;
		--label-base-400-line-height: 1;
		--label-base-500-line-height: 1;
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function height(element: Element): number {
	return element.getBoundingClientRect().height;
}

function renderTable(): void {
	render(
		<Table>
			<TableCaption>A list of people.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>Jane Smith</TableCell>
				</TableRow>
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell>Total</TableCell>
				</TableRow>
			</TableFooter>
		</Table>,
	);
}

describe('Table rows', () => {
	it('keeps body and footer rows with one line of text 32px tall', () => {
		renderTable();

		expect(height(screen.getByRole('cell', { name: 'Jane Smith' }))).toBe(32);
		expect(height(screen.getByRole('cell', { name: 'Total' }))).toBe(32);
	});

	it('keeps a DataTable row with dynamic heights 32px tall on one line', () => {
		renderDataTable({
			columns: createColumns(),
			data: createPersonData(1),
			enableDynamicRowHeights: true,
		});

		expect(height(screen.getByRole('cell', { name: 'Person 1' }))).toBe(32);
	});

	it('does not grow the infinite scroll sentinel row', () => {
		renderDataTable({
			columns: createColumns(),
			data: createPersonData(10),
			enableVirtualization: true,
			enableInfiniteScroll: true,
			hasMore: true,
			fixedHeight: 300,
		});

		const sentinel = document.querySelector('tbody tr[role="presentation"]') as HTMLElement;
		expect(height(sentinel)).toBe(17);
	});
});

describe('DataTable pagination', () => {
	it('is as tall as the page size select, with no margin on the label', () => {
		renderDataTable({ enablePagination: true });

		const label = screen.getByText('Rows per page');
		const style = getComputedStyle(label);
		expect(style.marginTop).toBe('0px');
		expect(style.marginBottom).toBe('0px');
		const bar = label.parentElement?.parentElement as HTMLElement;
		expect(height(bar)).toBe(32);
	});
});
