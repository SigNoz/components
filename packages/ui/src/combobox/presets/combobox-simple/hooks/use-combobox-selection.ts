import * as React from 'react';
import type { ComboboxSimpleItem } from '../types.js';
import { normalizeValue } from '../utils.js';

export type UseComboboxSelectionOptions = {
	controlledValue?: string | string[];
	defaultValue?: string | string[];
	multiple?: boolean;
	itemsMap: Map<string, ComboboxSimpleItem>;
	onChange?: (value: string | string[]) => void;
	setOpen?: (value: boolean) => void;
	setInputValue?: (value: string) => void;
};

export type UseComboboxSelectionReturn = {
	selectedValues: string[];
	customValues: string[];
	selectedItem: ComboboxSimpleItem | undefined;
	isControlled: boolean;
	handleSelect: (value: string) => void;
	handleRemove: (value: string) => void;
	addValue: (value: string) => void;
};

export function useComboboxSelection({
	controlledValue,
	defaultValue,
	multiple = false,
	itemsMap,
	onChange,
	setOpen,
	setInputValue,
}: UseComboboxSelectionOptions): UseComboboxSelectionReturn {
	const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(() =>
		normalizeValue(defaultValue)
	);

	const isControlled = controlledValue !== undefined;
	const selectedValues = React.useMemo(
		() => (isControlled ? normalizeValue(controlledValue) : uncontrolledValue),
		[isControlled, controlledValue, uncontrolledValue]
	);

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
				if (!isControlled) {
					setUncontrolledValue(newValues);
				}
				onChange?.(newValues);
				setInputValue?.('');
			} else {
				if (!isControlled) {
					setUncontrolledValue([selectedValue]);
				}
				onChange?.(selectedValue);
				setInputValue?.('');
				setOpen?.(false);
			}
		},
		[multiple, onChange, selectedValues, isControlled, setOpen, setInputValue]
	);

	const handleRemove = React.useCallback(
		(valueToRemove: string) => {
			const newValues = selectedValues.filter((v) => v !== valueToRemove);
			if (!isControlled) {
				setUncontrolledValue(newValues);
			}
			onChange?.(newValues);
		},
		[onChange, selectedValues, isControlled]
	);

	const addValue = React.useCallback(
		(valueToAdd: string) => {
			if (selectedValues.includes(valueToAdd)) return;

			if (multiple) {
				const newValues = [...selectedValues, valueToAdd];
				if (!isControlled) {
					setUncontrolledValue(newValues);
				}
				onChange?.(newValues);
			} else {
				if (!isControlled) {
					setUncontrolledValue([valueToAdd]);
				}
				onChange?.(valueToAdd);
				setOpen?.(false);
			}
		},
		[multiple, onChange, selectedValues, isControlled, setOpen]
	);

	return {
		selectedValues,
		customValues,
		selectedItem,
		isControlled,
		handleSelect,
		handleRemove,
		addValue,
	};
}
