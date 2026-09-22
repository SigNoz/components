import { isValidElement, type ReactNode } from 'react';
import { DropdownItemKind } from './constants.js';
import type { DropdownItemType, DropdownRadioItemType } from './types.js';

/**
 * The text a node puts on screen, as far as it can be read without rendering it.
 *
 * Strings and numbers are the text itself, and an array or a fragment is the text of its parts. An
 * element is opaque: its children may come from a component the menu cannot run. That is what
 * `searchMetadata` is for.
 *
 * @access private
 */
export function toSearchText(node: ReactNode): string {
	if (typeof node === 'string') {
		return node;
	}

	if (typeof node === 'number') {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node.map(toSearchText).join(' ');
	}

	if (isValidElement<{ children?: ReactNode }>(node)) {
		return toSearchText(node.props.children);
	}

	return '';
}

type SearchableRow = {
	label?: ReactNode;
	searchMetadata?: string;
};

function matchesQuery(row: SearchableRow, query: string): boolean {
	const haystack = `${toSearchText(row.label)} ${row.searchMetadata ?? ''}`.toLowerCase();

	return haystack.includes(query);
}

/**
 * Whether anything under this row matches, however deep. Used by a submenu, which survives on its
 * own label or on any of its rows.
 */
function matchesDeep(items: readonly DropdownItemType[], query: string): boolean {
	return items.some((item) => {
		if (item.type === DropdownItemKind.Separator) {
			return false;
		}

		if (item.type === DropdownItemKind.RadioGroup) {
			return item.items.some((option) => matchesQuery(option, query));
		}

		if (item.type === DropdownItemKind.Group || item.type === DropdownItemKind.Submenu) {
			return matchesQuery(item, query) || matchesDeep(item.items, query);
		}

		return matchesQuery(item, query);
	});
}

/**
 * Drops the separators that have nothing to separate: one that would land first, one that would
 * land last, and the second of any two in a row.
 *
 * @access private
 */
export function cleanupSeparators<T extends DropdownItemType>(items: readonly T[]): T[] {
	const cleaned: T[] = [];

	for (const item of items) {
		if (item.type !== DropdownItemKind.Separator) {
			cleaned.push(item);
			continue;
		}

		if (cleaned.length === 0) {
			continue;
		}

		if (cleaned[cleaned.length - 1]?.type === DropdownItemKind.Separator) {
			continue;
		}

		cleaned.push(item);
	}

	while (cleaned.length > 0 && cleaned[cleaned.length - 1]?.type === DropdownItemKind.Separator) {
		cleaned.pop();
	}

	return cleaned;
}

/**
 * The rows left once the query is applied, with the tree still legible.
 *
 * A group survives when any of its rows match, and renders with only those. A submenu survives on
 * its own label or on anything under it, and keeps every one of its rows: once you are inside a
 * submenu, the query that got you there is behind you. A radio group survives on its options, and
 * renders with only those.
 *
 * @access private
 */
export function filterDropdownItems<T extends DropdownItemType>(
	items: readonly T[],
	query: string,
): T[] {
	const normalized = query.trim().toLowerCase();

	if (normalized === '') {
		return cleanupSeparators(items);
	}

	const kept: T[] = [];

	for (const item of items) {
		if (item.type === DropdownItemKind.Separator) {
			kept.push(item);
			continue;
		}

		if (item.type === DropdownItemKind.Group) {
			// The children are narrower than `T`, so rebuilding the group loses the link between
			// the two. The shape is unchanged, only the list is shorter.
			const rows = filterDropdownItems(item.items, normalized);

			if (rows.length > 0) {
				kept.push({ ...item, items: rows } as T);
			}

			continue;
		}

		if (item.type === DropdownItemKind.RadioGroup) {
			const options: DropdownRadioItemType[] = item.items.filter((option) =>
				matchesQuery(option, normalized),
			);

			if (options.length > 0) {
				kept.push({ ...item, items: options } as T);
			}

			continue;
		}

		if (item.type === DropdownItemKind.Submenu) {
			if (matchesQuery(item, normalized) || matchesDeep(item.items, normalized)) {
				kept.push(item);
			}

			continue;
		}

		if (matchesQuery(item, normalized)) {
			kept.push(item);
		}
	}

	return cleanupSeparators(kept);
}
