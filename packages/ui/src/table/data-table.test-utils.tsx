import type { ColumnDef } from '@tanstack/react-table';
import { type RenderResult, render } from '@testing-library/react';
import type * as React from 'react';
import { type Mock, vi } from 'vitest';
import { DataTable } from './data-table.js';
import { getTablePreferences, resetTablePreferences } from './lib/preferences.js';

export type Person = {
	id: string;
	name: string;
	email: string;
	role: string;
};

export function createPersonData(count: number): Person[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `id-${i + 1}`,
		name: `Person ${i + 1}`,
		email: `person${i + 1}@example.com`,
		role: ['Developer', 'Designer', 'Manager'][i % 3],
	}));
}

export function createColumns(): ColumnDef<Person>[] {
	return [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Role' },
	];
}

export function createColumnsWithFilter(): ColumnDef<Person>[] {
	return [
		{ accessorKey: 'name', header: 'Name', filterFn: 'includesString' },
		{ accessorKey: 'email', header: 'Email', filterFn: 'includesString' },
		{ accessorKey: 'role', header: 'Role', filterFn: 'includesString' },
	];
}

const defaultColumns = createColumns();
const defaultData = createPersonData(5);

export function renderDataTable(
	props: Partial<React.ComponentProps<typeof DataTable<Person, unknown>>> & {
		columns?: ColumnDef<Person>[];
		data?: Person[];
		tableId?: string;
		testId?: string;
	}
): {
	getTableContainer: () => HTMLElement;
} & RenderResult {
	const merged = {
		columns: defaultColumns,
		data: defaultData,
		tableId: `table-${Math.random().toString(36).slice(2)}`,
		testId: 'data-table',
		...props,
	};
	const result = render(
		<DataTable<Person, unknown>
			{...merged}
			columns={merged.columns}
			data={merged.data}
			tableId={merged.tableId}
			testId={merged.testId}
		/>
	);
	return {
		...result,
		getTableContainer: () => result.getByTestId(merged.testId ?? 'data-table'),
	};
}

export function mockIntersectionObserver() {
	const observe = vi.fn<() => IntersectionObserver['observe']>();
	const disconnect = vi.fn<() => IntersectionObserver['disconnect']>();
	const unobserve = vi.fn<() => IntersectionObserver['unobserve']>();
	let triggerFn: ((isIntersecting: boolean) => void) | null = null;
	vi.stubGlobal(
		'IntersectionObserver',
		vi.fn().mockImplementation((callback: (entries: IntersectionObserverEntry[]) => void) => {
			triggerFn = (isIntersecting: boolean) =>
				callback([{ isIntersecting } as IntersectionObserverEntry]);
			return {
				observe,
				disconnect,
				unobserve,
				get trigger() {
					return triggerFn;
				},
			};
		})
	);
	return { observe, disconnect, unobserve, getTrigger: () => triggerFn };
}

export function mockResizeObserver(): {
	observe: Mock<ResizeObserver['observe']>;
	disconnect: Mock<ResizeObserver['disconnect']>;
	unobserve: Mock<ResizeObserver['unobserve']>;
} {
	const observe = vi.fn<ResizeObserver['observe']>();
	const disconnect = vi.fn<ResizeObserver['disconnect']>();
	const unobserve = vi.fn<ResizeObserver['unobserve']>();
	vi.stubGlobal(
		'ResizeObserver',
		vi.fn().mockImplementation(() => ({
			observe,
			disconnect,
			unobserve,
		}))
	);
	return { observe, disconnect, unobserve };
}

export function mockGetBoundingClientRect(height = 40): Mock<() => DOMRect> {
	const mock = vi.fn<() => DOMRect>().mockReturnValue({
		height,
		width: 200,
		top: 0,
		left: 0,
		bottom: height,
		right: 200,
		x: 0,
		y: 0,
		toJSON: () => ({}),
	});
	Element.prototype.getBoundingClientRect = mock;
	return mock;
}

export function clearTablePreferences(tableId: string) {
	resetTablePreferences(tableId);
}

export function getStoredPreferences(tableId: string) {
	return getTablePreferences(tableId);
}
