import type * as React from 'react';
import { commandDefaultFilter } from '../../../command/index.js';
import type { ComboboxSimpleGroup, ComboboxSimpleItem, VirtualizedRowData } from './types.js';

export function flattenItems(groups: ComboboxSimpleGroup[]): ComboboxSimpleItem[] {
	return groups.flatMap((g) => g.items);
}

export function normalizeValue(v: string | string[] | undefined): string[] {
	if (v === undefined) return [];
	const arr = Array.isArray(v) ? v : [v];
	return arr.filter((val): val is string => typeof val === 'string' && val !== '');
}

export type CreateState = {
	showCreateOption: boolean;
	createValue: string;
};

export function getCreateState(
	selectedValues: string[],
	itemsMap: Map<string, ComboboxSimpleItem>,
	inputValue: string
): CreateState {
	const trimmed = inputValue.trim();
	const showCreateOption =
		Boolean(trimmed) && !selectedValues.includes(trimmed) && !itemsMap.has(trimmed);
	return { showCreateOption, createValue: trimmed };
}

export function buildItemsMap(items: ComboboxSimpleItem[]): Map<string, ComboboxSimpleItem> {
	const map = new Map<string, ComboboxSimpleItem>();
	for (const item of items) {
		map.set(item.value, item);
	}
	return map;
}

export function getItemSearchStrings(item: ComboboxSimpleItem): string[] {
	const out: string[] = [item.value];
	if (item.displayValue) out.push(item.displayValue);
	if (item.insertValue) out.push(item.insertValue);
	if (typeof item.label === 'string') out.push(item.label);
	if (item.keywords) out.push(...item.keywords);
	return out;
}

export function buildSearchStringsMap(items: ComboboxSimpleItem[]): Map<string, string[]> {
	const map = new Map<string, string[]>();
	for (const item of items) {
		map.set(
			item.value,
			getItemSearchStrings(item).map((s) => s.toLowerCase())
		);
	}
	return map;
}

export function scoreItem(item: ComboboxSimpleItem, query: string): number {
	if (!query) return 1;
	return commandDefaultFilter(item.value, query, getItemSearchStrings(item));
}

export type RenderTreeGroup = {
	heading?: React.ReactNode;
	items: ComboboxSimpleItem[];
};

export type RenderTree = {
	customValues: string[];
	groups: RenderTreeGroup[];
	showCreate: boolean;
	createValue: string;
};

export type BuildRenderTreeOptions = {
	customValues: string[];
	groups?: ComboboxSimpleGroup[];
	items: ComboboxSimpleItem[];
	inputValue: string;
	showHints: boolean;
	showCreate: boolean;
	createValue: string;
	applyQueryFilter: boolean;
};

export function buildRenderTree({
	customValues,
	groups,
	items,
	inputValue,
	showHints,
	showCreate,
	createValue,
	applyQueryFilter,
}: BuildRenderTreeOptions): RenderTree {
	const filterHints = (list: ComboboxSimpleItem[]) =>
		list.filter((item) => (item.insertValue !== undefined ? showHints : true));

	const filterQuery = (list: ComboboxSimpleItem[]) =>
		applyQueryFilter && inputValue ? list.filter((item) => scoreItem(item, inputValue) > 0) : list;

	const filterAll = (list: ComboboxSimpleItem[]) => filterQuery(filterHints(list));

	const filteredCustomValues =
		applyQueryFilter && inputValue
			? customValues.filter((v) => commandDefaultFilter(v, inputValue, [v]) > 0)
			: customValues;

	const outGroups: RenderTreeGroup[] = [];

	if (groups) {
		for (const group of groups) {
			const filtered = filterAll(group.items);
			if (filtered.length > 0) {
				outGroups.push({ heading: group.heading, items: filtered });
			}
		}
	} else {
		const filtered = filterAll(items);
		if (filtered.length > 0) {
			outGroups.push({ items: filtered });
		}
	}

	return { customValues: filteredCustomValues, groups: outGroups, showCreate, createValue };
}

export function treeToVirtualRows(tree: RenderTree): VirtualizedRowData[] {
	const rows: VirtualizedRowData[] = [];

	if (tree.showCreate) {
		rows.push({ type: 'create', value: tree.createValue });
	}

	if (tree.customValues.length > 0) {
		if (tree.showCreate) {
			rows.push({ type: 'separator' });
		}
		rows.push({ type: 'group-heading', heading: 'Custom' });
		for (const v of tree.customValues) {
			rows.push({ type: 'custom', value: v });
		}
	}

	const hasContentBefore = tree.showCreate || tree.customValues.length > 0;
	if (hasContentBefore && tree.groups.length > 0) {
		rows.push({ type: 'separator' });
	}

	tree.groups.forEach((group, i) => {
		if (i > 0) rows.push({ type: 'separator' });
		if (group.heading) rows.push({ type: 'group-heading', heading: group.heading });
		for (const item of group.items) {
			rows.push({ type: 'item', item });
		}
	});

	return rows;
}
