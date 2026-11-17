import type { CollapseGroupItemType } from '../types.js';

export const GROUP_ITEMS = [
	{ value: 'logs', title: 'Logs', children: 'Logs body' },
	{ value: 'traces', title: 'Traces', children: 'Traces body' },
	{ value: 'metrics', title: 'Metrics', children: 'Metrics body' },
] as const satisfies readonly CollapseGroupItemType[];

export function makeItems(count: number): CollapseGroupItemType[] {
	return Array.from({ length: count }, (_, index) => ({
		value: `item-${index + 1}`,
		title: `Item ${index + 1}`,
		children: `Body ${index + 1}`,
	}));
}

export function getHeader(root: HTMLElement): HTMLElement {
	const header = root.querySelector<HTMLElement>('[data-slot="collapse-header"]');

	if (header === null) {
		throw new Error('The collapse has no header row');
	}

	return header;
}
