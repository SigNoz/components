import * as React from 'react';
import type { ComboboxSimpleItem } from '../types.js';

export type UseComboboxFilterOptions = {
	items: ComboboxSimpleItem[];
	inputValue: string;
};

export type UseComboboxFilterReturn = {
	showHints: boolean;
};

export function useComboboxFilter({
	items,
	inputValue,
}: UseComboboxFilterOptions): UseComboboxFilterReturn {
	const hintItems = React.useMemo(
		() => items.filter((item) => item.insertValue !== undefined),
		[items]
	);

	const showHints = React.useMemo(
		() =>
			hintItems.length > 0 &&
			!hintItems.some((item) => item.insertValue && inputValue.startsWith(item.insertValue)),
		[hintItems, inputValue]
	);

	return { showHints };
}
