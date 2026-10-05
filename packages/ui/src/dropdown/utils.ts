import type { ReactNode } from 'react';
import { cleanupSeparators, toSearchText } from '../lib/search-text.js';
import { DropdownItemKind } from './constants.js';
import type { DropdownItemType, DropdownRadioItemType } from './types.js';

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
 * The rows left once the query is applied, with the tree still legible.
 *
 * A group survives when any of its rows match, and renders with only those. A submenu survives on
 * its own label or on anything under it, and keeps every one of its rows: once you are inside a
 * submenu, the query that got you there is behind you. A radio group survives on its options, and
 * renders with only those.
 *
 * The separator cleanup runs at every level, with or without a query.
 *
 * @access private
 */
export function filterDropdownItems<T extends DropdownItemType>(
	items: readonly T[],
	query: string,
): T[] {
	const normalized = query.trim().toLowerCase();
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

			// Only a query drops a heading. Without one, the group renders whatever it holds.
			if (normalized === '' || rows.length > 0) {
				kept.push({ ...item, items: rows } as T);
			}

			continue;
		}

		if (item.type === DropdownItemKind.RadioGroup) {
			const options: DropdownRadioItemType[] = item.items.filter((option) =>
				matchesQuery(option, normalized),
			);

			if (normalized === '' || options.length > 0) {
				kept.push({ ...item, items: options } as T);
			}

			continue;
		}

		if (item.type === DropdownItemKind.Submenu) {
			if (matchesQuery(item, normalized) || matchesDeep(item.items, normalized)) {
				kept.push({ ...item, items: filterDropdownItems(item.items, '') } as T);
			}

			continue;
		}

		if (matchesQuery(item, normalized)) {
			kept.push(item);
		}
	}

	return cleanupSeparators(kept, (item) => item.type === DropdownItemKind.Separator);
}
