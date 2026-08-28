import { Select as SelectPrimitive } from '@base-ui/react/select';
import * as React from 'react';
import {
	DismissRegistryProvider,
	runDismissHandlers,
	useDismissRegistry,
} from '../../lib/dismiss-handlers.js';
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

function normalizeValue(value: string | string[] | undefined): string[] {
	if (value === undefined) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

/**
 * Collects `{ value, label }` for every item in the subtree.
 *
 * The primitive resolves the label shown in a closed trigger from the root's
 * `items`, not from the items themselves — those live in the popup and are
 * unmounted while it is closed. Harvesting them from the children keeps a
 * plain `<SelectItem>` composition displaying its label without callers having
 * to declare the options twice.
 *
 * Items whose label is not a plain string should set `textValue`; anything the
 * walk cannot resolve simply falls back to the raw value.
 */
function collectItems(
	node: React.ReactNode,
	out: { label: React.ReactNode; value: string }[],
): void {
	React.Children.forEach(node, (child) => {
		if (!React.isValidElement(child)) {
			return;
		}
		const props = child.props as {
			value?: unknown;
			textValue?: string;
			children?: React.ReactNode;
		};

		if (typeof props.value === 'string') {
			out.push({ value: props.value, label: props.textValue ?? props.children });
			return;
		}

		if (props.children !== undefined) {
			collectItems(props.children, out);
		}
	});
}

/**
 * Root component for the select. Controls open/close state and selection.
 *
 * Multi-select is the primitive's own `multiple` mode rather than the manual
 * toggling this component used to do on top of a single-select primitive, so
 * the popup now stays open while several values are picked.
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
	const registry = useDismissRegistry();

	const items = React.useMemo(() => {
		const collected: { label: React.ReactNode; value: string }[] = [];
		collectItems(children, collected);
		return collected;
	}, [children]);

	// The value is mirrored locally even when uncontrolled, because the trigger
	// renders pills and the items render indicators from it.
	const [internalValue, setInternalValue] = React.useState<string[]>(() =>
		normalizeValue(defaultValue),
	);

	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? normalizeValue(controlledValue) : internalValue;

	const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
	const isOpenControlled = open !== undefined;
	const currentOpen = isOpenControlled ? open : internalOpen;

	const handleOpenChange = React.useCallback(
		(newOpen: boolean, eventDetails: SelectPrimitive.Root.ChangeEventDetails) => {
			runDismissHandlers(registry, newOpen, eventDetails);
			if (eventDetails.isCanceled) {
				return;
			}
			if (!isOpenControlled) {
				setInternalOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[isOpenControlled, onOpenChange, registry],
	);

	const commitValue = React.useCallback(
		(next: string[]) => {
			if (!isControlled) {
				setInternalValue(next);
			}
			onChange?.(multiple ? next : (next[0] ?? ''));
		},
		[isControlled, multiple, onChange],
	);

	const handleValueChange = React.useCallback(
		(nextValue: string | string[] | null) => {
			if (nextValue === null) {
				commitValue([]);
				return;
			}
			commitValue(Array.isArray(nextValue) ? nextValue : [nextValue]);
		},
		[commitValue],
	);

	const handleRemove = React.useCallback(
		(valueToRemove: string) => {
			commitValue(currentValue.filter((v) => v !== valueToRemove));
		},
		[commitValue, currentValue],
	);

	const contextValue = React.useMemo<SelectContextValue>(
		() => ({
			multiple,
			value: currentValue,
			onValueChange: (value: string) => {
				commitValue(
					currentValue.includes(value)
						? currentValue.filter((v) => v !== value)
						: [...currentValue, value],
				);
			},
			onRemove: handleRemove,
		}),
		[multiple, currentValue, commitValue, handleRemove],
	);

	return (
		<SelectContext.Provider value={contextValue}>
			<SelectPrimitive.Root
				items={items}
				multiple={multiple}
				// Base UI reads an absent selection as `null`; an empty string would
				// count as a value and suppress the placeholder.
				value={multiple ? currentValue : (currentValue[0] ?? null)}
				onValueChange={handleValueChange}
				open={currentOpen}
				onOpenChange={handleOpenChange}
				disabled={disabled}
				required={required}
				name={name}
			>
				<DismissRegistryProvider registry={registry}>{children}</DismissRegistryProvider>
			</SelectPrimitive.Root>
		</SelectContext.Provider>
	);
}
