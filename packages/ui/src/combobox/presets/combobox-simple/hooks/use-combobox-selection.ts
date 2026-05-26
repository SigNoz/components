import * as React from 'react';
import type { ComboboxSimpleItem } from '../types.js';
import { normalizeValue } from '../utils.js';

export type UseComboboxSelectionOptions = {
	controlledValue?: string | string[];
	isControlled: boolean;
	defaultValue?: string | string[];
	multiple?: boolean;
	itemsMap: Map<string, ComboboxSimpleItem>;
	onChange?: (value: string | string[] | undefined) => void;
	setOpen?: (value: boolean) => void;
	setInputValue?: (value: string) => void;
};

export type UseComboboxSelectionReturn = {
	selectedValues: string[];
	customValues: string[];
	selectedItem: ComboboxSimpleItem | undefined;
	handleSelect: (value: string) => void;
	handleRemove: (value: string) => void;
	addValue: (value: string) => void;
	clearSelection: () => void;
};

export function useComboboxSelection({
	controlledValue,
	isControlled,
	defaultValue,
	multiple = false,
	itemsMap,
	onChange,
	setOpen,
	setInputValue,
}: UseComboboxSelectionOptions): UseComboboxSelectionReturn {
	const [internalValue, setInternalValue] = React.useState<string[]>(() =>
		normalizeValue(defaultValue)
	);

	const selectedValues = isControlled ? normalizeValue(controlledValue) : internalValue;

	const customValues = React.useMemo(
		() => selectedValues.filter((v) => !itemsMap.has(v)),
		[selectedValues, itemsMap]
	);

	const selectedItem = React.useMemo(
		() => (multiple ? undefined : itemsMap.get(selectedValues[0] ?? '')),
		[multiple, itemsMap, selectedValues]
	);

	const handleSelect = React.useCallback(
		(selectedValue: string) => {
			if (multiple) {
				const newValues = selectedValues.includes(selectedValue)
					? selectedValues.filter((v) => v !== selectedValue)
					: [...selectedValues, selectedValue];
				setInternalValue(newValues);
				onChange?.(newValues);
				setInputValue?.('');
			} else {
				setInternalValue([selectedValue]);
				onChange?.(selectedValue);
				setInputValue?.('');
				setOpen?.(false);
			}
		},
		[multiple, onChange, selectedValues, setOpen, setInputValue]
	);

	const handleRemove = React.useCallback(
		(valueToRemove: string) => {
			const newValues = selectedValues.filter((v) => v !== valueToRemove);
			setInternalValue(newValues);
			onChange?.(newValues);
		},
		[onChange, selectedValues]
	);

	const addValue = React.useCallback(
		(valueToAdd: string) => {
			if (selectedValues.includes(valueToAdd)) return;

			if (multiple) {
				const newValues = [...selectedValues, valueToAdd];
				setInternalValue(newValues);
				onChange?.(newValues);
			} else {
				setInternalValue([valueToAdd]);
				onChange?.(valueToAdd);
				setOpen?.(false);
			}
		},
		[multiple, onChange, selectedValues, setOpen]
	);

	const clearSelection = React.useCallback(() => {
		setInternalValue([]);
		if (multiple) {
			onChange?.([]);
		} else {
			onChange?.(undefined);
		}
	}, [multiple, onChange]);

	return {
		selectedValues,
		customValues,
		selectedItem,
		handleSelect,
		handleRemove,
		addValue,
		clearSelection,
	};
}
