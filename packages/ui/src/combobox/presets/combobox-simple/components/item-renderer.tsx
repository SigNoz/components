import * as React from 'react';
import { ComboboxHint } from '../../../subcomponents/combobox-hint.js';
import { ComboboxItem } from '../../../subcomponents/combobox-item.js';
import type { ComboboxSimpleItem } from '../types.js';

export function renderItemContent(
	item: ComboboxSimpleItem,
	selectedValues: string[],
	handleSelect: (v: string) => void,
	handleInsert: (v: string) => void
): React.ReactNode {
	if (item.insertValue !== undefined) {
		return (
			<ComboboxHint value={item.value} insertValue={item.insertValue} onInsert={handleInsert}>
				{item.label}
			</ComboboxHint>
		);
	}

	return (
		<ComboboxItem
			value={item.value}
			onSelect={handleSelect}
			isSelected={selectedValues.includes(item.value)}
		>
			{item.label}
		</ComboboxItem>
	);
}

export function renderItem(
	item: ComboboxSimpleItem,
	selectedValues: string[],
	handleSelect: (v: string) => void,
	handleInsert: (v: string) => void
): React.ReactNode {
	return (
		<React.Fragment key={item.value}>
			{renderItemContent(item, selectedValues, handleSelect, handleInsert)}
		</React.Fragment>
	);
}
