import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { SelectContext, type SelectContextValue } from './select-context.js';

export type SelectProps = {
	/** The content of the select (trigger, content, items, etc.) */
	children: React.ReactNode;
	/** The controlled value of the select. Use with `onChange`. */
	value?: string | string[];
	/** The default value when uncontrolled. */
	defaultValue?: string | string[];
	/** Callback fired when the value changes. */
	onChange?: (value: string | string[]) => void;
	/** Whether multiple items can be selected. */
	multiple?: boolean;
	/** The controlled open state of the select. */
	open?: boolean;
	/** The default open state when uncontrolled. */
	defaultOpen?: boolean;
	/** Callback fired when the open state changes. */
	onOpenChange?: (open: boolean) => void;
	/** Whether the select is disabled. */
	disabled?: boolean;
	/** Whether the select is required in a form. */
	required?: boolean;
	/** The name of the select for form submission. */
	name?: string;
};

/**
 * Root component for the select. Controls open/close state and selection.
 *
 * @example
 * ```tsx
 * // Single select
 * <Select value={value} onChange={setValue}>
 *   <SelectTrigger placeholder="Select..." />
 *   <SelectContent>
 *     <SelectItem value="a">Option A</SelectItem>
 *   </SelectContent>
 * </Select>
 *
 * // Multi-select
 * <Select multiple value={values} onChange={setValues}>
 *   <SelectTrigger placeholder="Select..." />
 *   <SelectContent>
 *     <SelectItem value="a">Option A</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
export function Select({
	children,
	value: controlledValue,
	defaultValue,
	onChange,
	multiple = false,
	open,
	defaultOpen,
	onOpenChange,
	disabled,
	required,
	name,
}: SelectProps) {
	// Normalize to array for internal state
	const normalizeValue = (v: string | string[] | undefined): string[] => {
		if (v === undefined) return [];
		return Array.isArray(v) ? v : [v];
	};

	const [internalValue, setInternalValue] = React.useState<string[]>(() =>
		normalizeValue(defaultValue)
	);

	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? normalizeValue(controlledValue) : internalValue;

	const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
	const isOpenControlled = open !== undefined;
	const currentOpen = isOpenControlled ? open : internalOpen;

	const handleOpenChange = React.useCallback(
		(newOpen: boolean) => {
			if (!isOpenControlled) {
				setInternalOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[isOpenControlled, onOpenChange]
	);

	const handleValueChange = React.useCallback(
		(selectedValue: string) => {
			if (multiple) {
				const newValue = currentValue.includes(selectedValue)
					? currentValue.filter((v) => v !== selectedValue)
					: [...currentValue, selectedValue];

				if (!isControlled) {
					setInternalValue(newValue);
				}
				onChange?.(newValue);
				// Keep open for multi-select
			} else {
				const newValue = selectedValue;
				if (!isControlled) {
					setInternalValue([newValue]);
				}
				onChange?.(newValue);
				handleOpenChange(false);
			}
		},
		[multiple, currentValue, isControlled, onChange, handleOpenChange]
	);

	const handleRemove = React.useCallback(
		(valueToRemove: string) => {
			const newValue = currentValue.filter((v) => v !== valueToRemove);
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(multiple ? newValue : (newValue[0] ?? ''));
		},
		[currentValue, isControlled, onChange, multiple]
	);

	const contextValue = React.useMemo<SelectContextValue>(
		() => ({
			multiple,
			value: currentValue,
			onValueChange: handleValueChange,
			onRemove: handleRemove,
		}),
		[multiple, currentValue, handleValueChange, handleRemove]
	);

	if (multiple) {
		// For multi-select, we use a custom implementation
		return (
			<SelectContext.Provider value={contextValue}>
				<SelectPrimitive.Root
					open={currentOpen}
					onOpenChange={handleOpenChange}
					disabled={disabled}
					required={required}
					name={name}
					value="" // Always empty for multi-select, we manage state ourselves
					onValueChange={handleValueChange}
				>
					{children}
				</SelectPrimitive.Root>
			</SelectContext.Provider>
		);
	}

	// Single select uses native Radix behavior
	return (
		<SelectContext.Provider value={contextValue}>
			<SelectPrimitive.Root
				value={currentValue[0] ?? ''}
				defaultValue={defaultValue as string | undefined}
				onValueChange={handleValueChange}
				open={currentOpen}
				onOpenChange={handleOpenChange}
				disabled={disabled}
				required={required}
				name={name}
			>
				{children}
			</SelectPrimitive.Root>
		</SelectContext.Provider>
	);
}
