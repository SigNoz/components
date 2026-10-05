import { cleanupSeparators, toSearchText } from '../lib/search-text.js';
import { SelectItemKind } from './constants.js';
import type { SelectGroupChildType, SelectItemType, SelectOptionItemType } from './types.js';

function isSeparator(item: SelectItemType): boolean {
	return item.type === SelectItemKind.Separator;
}

/**
 * Every `item` row by its `value`, groups included.
 *
 * @access private
 */
export function indexSelectOptions(
	items: readonly SelectItemType[],
): Map<string, SelectOptionItemType> {
	const options = new Map<string, SelectOptionItemType>();

	for (const item of items) {
		if (item.type === SelectItemKind.Group) {
			for (const child of item.items) {
				if (child.type === SelectItemKind.Item) {
					options.set(child.value, child);
				}
			}
		} else if (item.type === SelectItemKind.Item) {
			options.set(item.value, item);
		}
	}

	return options;
}

/**
 * `items` as the list renders it: a group with no row is dropped, and so is a separator that would
 * land first, last, or next to another one.
 *
 * @access private
 */
export function visibleSelectItems(items: readonly SelectItemType[]): SelectItemType[] {
	const kept = items.flatMap((item): SelectItemType[] => {
		if (item.type !== SelectItemKind.Group) {
			return [item];
		}

		const children = cleanupSeparators<SelectGroupChildType>(item.items, isSeparator);

		return children.length === 0 ? [] : [{ ...item, items: children }];
	});

	return cleanupSeparators(kept, isSeparator);
}

/**
 * What typing on the keyboard matches a row against: its `displayValue`, or its label when that
 * renders to text.
 *
 * @access private
 */
export function selectOptionText(option: SelectOptionItemType): string {
	return option.displayValue ?? toSearchText(option.label);
}
