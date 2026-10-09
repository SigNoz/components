import type { ReactNode } from 'react';
import { cleanupSeparators, toSearchText } from '../lib/search-text.js';
import { ComboboxItemKind } from './constants.js';
import type {
	ComboboxGroupItemType,
	ComboboxHintItemType,
	ComboboxItemType,
	ComboboxOptionItemType,
} from './types.js';

/**
 * What a row that is not a plain value hands to Base UI as its value, so the selection handler can
 * tell it apart from a real one.
 *
 * @access private
 */
export type ComboboxMarker =
	| { readonly marker: 'create' }
	| { readonly marker: 'hint'; readonly insertValue: string };

/**
 * @access private
 */
export type ComboboxBaseValue = string | ComboboxMarker;

/**
 * @access private
 */
export function isComboboxMarker(value: unknown): value is ComboboxMarker {
	return typeof value === 'object' && value !== null && 'marker' in value;
}

const CREATE_MARKER: ComboboxMarker = Object.freeze({ marker: 'create' });

/**
 * A row the user can pick, in the order the list renders it.
 *
 * @access private
 */
export type ComboboxOptionEntry =
	| { kind: 'item'; key: string; value: string; item: ComboboxOptionItemType }
	| { kind: 'hint'; key: string; value: ComboboxMarker; item: ComboboxHintItemType }
	| { kind: 'create'; key: string; value: ComboboxMarker; query: string }
	| { kind: 'custom'; key: string; value: string };

/**
 * @access private
 */
export type ComboboxSeparatorEntry = { kind: 'separator'; key: string };

/**
 * @access private
 */
export type ComboboxGroupEntry = {
	kind: 'group';
	key: string;
	value: string;
	label: ReactNode;
	testId: string | undefined;
	entries: Array<ComboboxOptionEntry | ComboboxSeparatorEntry>;
};

/**
 * @access private
 */
export type ComboboxEntry = ComboboxOptionEntry | ComboboxSeparatorEntry | ComboboxGroupEntry;

/**
 * One row of the virtual list. A group heading is a row of its own there.
 *
 * @access private
 */
export type ComboboxVirtualRow =
	| ComboboxOptionEntry
	| ComboboxSeparatorEntry
	| { kind: 'group-label'; key: string; label: ReactNode };

/**
 * Case and accent insensitive, so `cafe` finds `Café`.
 *
 * @access private
 */
export function normalizeSearchText(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

// Keyed by the row object, like every other memo of `items`, so a list of thousands of rows is read
// and normalized once rather than on every keystroke.
const rowSearchTexts = new WeakMap<ComboboxOptionItemType | ComboboxHintItemType, string>();

function rowSearchText(row: ComboboxOptionItemType | ComboboxHintItemType): string {
	const cached = rowSearchTexts.get(row);

	if (cached !== undefined) {
		return cached;
	}

	const parts = [toSearchText(row.label), row.value, row.searchMetadata ?? ''];

	if (row.type === ComboboxItemKind.Item) {
		parts.push(row.displayValue ?? '');
	} else {
		parts.push(row.insertValue);
	}

	const text = normalizeSearchText(parts.join(' '));
	rowSearchTexts.set(row, text);

	return text;
}

function isSeparatorEntry(entry: ComboboxEntry): boolean {
	return entry.kind === 'separator';
}

function forEachRow(
	items: readonly ComboboxItemType[],
	visit: (row: ComboboxOptionItemType | ComboboxHintItemType) => void,
): void {
	for (const item of items) {
		if (item.type === ComboboxItemKind.Group) {
			forEachRow(item.items, visit);
		} else if (item.type !== ComboboxItemKind.Separator) {
			visit(item);
		}
	}
}

/**
 * Every `item` row by its `value`, groups included.
 *
 * @access private
 */
export function indexComboboxOptions(
	items: readonly ComboboxItemType[],
): Map<string, ComboboxOptionItemType> {
	const options = new Map<string, ComboboxOptionItemType>();

	forEachRow(items, (row) => {
		if (row.type === ComboboxItemKind.Item) {
			options.set(row.value, row);
		}
	});

	return options;
}

/**
 * @access private
 */
export function shouldShowHints(items: readonly ComboboxItemType[], query: string): boolean {
	const normalized = normalizeSearchText(query.trimStart());
	let show = true;

	forEachRow(items, (row) => {
		if (
			row.type === ComboboxItemKind.Hint &&
			normalized.startsWith(normalizeSearchText(row.insertValue))
		) {
			show = false;
		}
	});

	return show;
}

type BuildEntriesOptions = {
	items: readonly ComboboxItemType[];
	options: Map<string, ComboboxOptionItemType>;
	query: string;
	filter: boolean;
	selectedValues: readonly string[];
	allowCreate: boolean;
	customGroupLabel: ReactNode;
};

function toEntries(
	items: readonly ComboboxItemType[],
	matches: (row: ComboboxOptionItemType | ComboboxHintItemType) => boolean,
	showHints: boolean,
): ComboboxEntry[] {
	const entries: ComboboxEntry[] = [];

	for (const item of items) {
		if (item.type === ComboboxItemKind.Separator) {
			entries.push({ kind: 'separator', key: `separator:${item.value}` });
			continue;
		}

		if (item.type === ComboboxItemKind.Group) {
			const children = cleanupSeparators(
				toEntries(item.items, matches, showHints) as Array<
					ComboboxOptionEntry | ComboboxSeparatorEntry
				>,
				isSeparatorEntry,
			);

			if (children.length > 0) {
				entries.push(groupEntry(item, children));
			}

			continue;
		}

		if (item.type === ComboboxItemKind.Hint) {
			if (showHints && matches(item)) {
				entries.push({
					kind: 'hint',
					key: `hint:${item.value}`,
					value: { marker: 'hint', insertValue: item.insertValue },
					item,
				});
			}

			continue;
		}

		if (matches(item)) {
			entries.push({ kind: 'item', key: `item:${item.value}`, value: item.value, item });
		}
	}

	return entries;
}

function groupEntry(
	group: ComboboxGroupItemType,
	entries: Array<ComboboxOptionEntry | ComboboxSeparatorEntry>,
): ComboboxGroupEntry {
	return {
		kind: 'group',
		key: `group:${group.value}`,
		value: group.value,
		label: group.label,
		testId: group.testId,
		entries,
	};
}

/**
 * Whether a query names a value the list already holds: the `value` of a row, hints included, or a
 * selected one. Case is ignored, so `react` is not offered as a new value next to `React`.
 */
function isKnownValue(
	items: readonly ComboboxItemType[],
	selectedValues: readonly string[],
	query: string,
): boolean {
	const wanted = query.toLowerCase();
	let known = selectedValues.some((value) => value.toLowerCase() === wanted);

	forEachRow(items, (row) => {
		if (row.value.toLowerCase() === wanted) {
			known = true;
		}
	});

	return known;
}

/**
 * The rows the list renders for this query, in order: the create row, the selected values `items`
 * does not have, then `items` filtered.
 *
 * @access private
 */
export function buildComboboxEntries({
	items,
	options,
	query,
	filter,
	selectedValues,
	allowCreate,
	customGroupLabel,
}: BuildEntriesOptions): ComboboxEntry[] {
	const trimmed = query.trim();
	const normalized = filter ? normalizeSearchText(trimmed) : '';
	const matches = (row: ComboboxOptionItemType | ComboboxHintItemType): boolean =>
		normalized === '' || rowSearchText(row).includes(normalized);

	const rows = cleanupSeparators(
		toEntries(items, matches, shouldShowHints(items, query)),
		isSeparatorEntry,
	);
	const lead: ComboboxEntry[] = [];

	if (allowCreate && trimmed !== '' && !isKnownValue(items, selectedValues, trimmed)) {
		lead.push({ kind: 'create', key: 'create', value: CREATE_MARKER, query: trimmed });
	}

	const custom = selectedValues.filter(
		(value) =>
			!options.has(value) && (normalized === '' || normalizeSearchText(value).includes(normalized)),
	);

	if (custom.length > 0) {
		lead.push({
			kind: 'group',
			// Outside the `group:` and `separator:` key spaces of `items`, so a group or a separator
			// whose `value` is `custom` or `lead` cannot share a React key with these.
			key: 'custom-group',
			value: 'custom',
			label: customGroupLabel,
			testId: undefined,
			entries: custom.map((value) => ({ kind: 'custom', key: `custom:${value}`, value })),
		});
	}

	if (lead.length === 0) {
		return rows;
	}

	return cleanupSeparators(
		[...lead, { kind: 'separator', key: 'lead-separator' }, ...rows],
		isSeparatorEntry,
	);
}

/**
 * The rows the user can pick, in render order. Base UI addresses them by their index in this list.
 *
 * @access private
 */
export function flattenComboboxOptions(entries: readonly ComboboxEntry[]): ComboboxOptionEntry[] {
	const flat: ComboboxOptionEntry[] = [];

	for (const entry of entries) {
		if (entry.kind === 'group') {
			for (const child of entry.entries) {
				if (child.kind !== 'separator') {
					flat.push(child);
				}
			}
		} else if (entry.kind !== 'separator') {
			flat.push(entry);
		}
	}

	return flat;
}

/**
 * The entries as one list of rows, group headings included, for the virtual list.
 *
 * @access private
 */
export function flattenComboboxRows(entries: readonly ComboboxEntry[]): ComboboxVirtualRow[] {
	const rows: ComboboxVirtualRow[] = [];

	for (const entry of entries) {
		if (entry.kind === 'group') {
			rows.push({ kind: 'group-label', key: `${entry.key}:label`, label: entry.label });
			rows.push(...entry.entries);
		} else {
			rows.push(entry);
		}
	}

	return rows;
}
