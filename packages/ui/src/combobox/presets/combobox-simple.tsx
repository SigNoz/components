import * as React from 'react';
import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxSeparator,
	ComboboxTrigger,
} from '../combobox.js';

export type ComboboxSimpleItem = {
	/**
	 * Unique value for the option.
	 */
	value: string;
	/**
	 * Display content for the option. Can be string or ReactNode (e.g. icon + text).
	 */
	label: React.ReactNode;
	/**
	 * Optional string to show in the trigger instead of label. Use when label is ReactNode but you want plain text in the trigger.
	 */
	displayValue?: string;
};

export type ComboboxSimpleGroup = {
	/**
	 * Optional heading for the group.
	 */
	heading?: string;
	/**
	 * Items in this group.
	 */
	items: ComboboxSimpleItem[];
};

export type ComboboxSimpleProps = {
	/**
	 * List of items to display (flat). Ignored when groups is provided.
	 * @default []
	 */
	items?: ComboboxSimpleItem[];
	/**
	 * Grouped items with optional headings. When provided, items is ignored.
	 * @default undefined
	 */
	groups?: ComboboxSimpleGroup[];
	/**
	 * Placeholder text when no value is selected and in the search input.
	 * @default 'Select an option...'
	 */
	placeholder?: string;
	/**
	 * Text shown when there are no results (e.g. after filtering).
	 * @default 'No results found.'
	 */
	emptyPlaceholder?: string;
	/**
	 * Controlled selected value.
	 * @default undefined
	 */
	value?: string;
	/**
	 * Initial value when uncontrolled.
	 * @default ''
	 */
	defaultValue?: string;
	/**
	 * Callback when selection changes.
	 * @param value - The new selected value.
	 */
	onChange?: (value: string) => void;
	/**
	 * Customize what is shown in the trigger. Receives the selected item (or undefined). Use when you want a string instead of the label ReactNode.
	 * @param item - The selected item (or undefined).
	 * @returns The string or ReactNode to show in the trigger.
	 */
	displayValue?: (item: ComboboxSimpleItem | undefined) => string | React.ReactNode;
};

function flattenItems(groups: ComboboxSimpleGroup[]): ComboboxSimpleItem[] {
	return groups.flatMap((g) => g.items);
}

function renderItem(item: ComboboxSimpleItem, value: string, handleSelect: (v: string) => void) {
	return (
		<ComboboxItem
			key={item.value}
			value={item.value}
			onSelect={handleSelect}
			isSelected={value === item.value}
		>
			{item.label}
		</ComboboxItem>
	);
}

function ComboboxSimpleInner({
	items = [],
	groups,
	placeholder = 'Select an option...',
	emptyPlaceholder = 'No results found.',
	value: controlledValue,
	defaultValue = '',
	onChange,
	displayValue: displayValueFn,
}: ComboboxSimpleProps) {
	const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
	const [open, setOpen] = React.useState(false);

	const isControlled = controlledValue !== undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	const allItems = React.useMemo(() => (groups ? flattenItems(groups) : items), [groups, items]);

	const handleSelect = React.useCallback(
		(selectedValue: string) => {
			if (!isControlled) {
				setUncontrolledValue(selectedValue);
			}
			onChange?.(selectedValue);
			setOpen(false);
		},
		[isControlled, onChange]
	);

	const selectedItem = React.useMemo(
		() => allItems.find((item) => item.value === value),
		[allItems, value]
	);
	const triggerValue = displayValueFn
		? displayValueFn(selectedItem)
		: selectedItem
			? (selectedItem.displayValue ?? selectedItem.label)
			: undefined;

	const listContent = React.useMemo(
		() =>
			groups ? (
				<>
					{groups.map((group, idx) => (
						<React.Fragment key={group.heading ?? idx}>
							{idx > 0 && <ComboboxSeparator />}
							<ComboboxGroup heading={group.heading}>
								{group.items.map((item) => renderItem(item, value, handleSelect))}
							</ComboboxGroup>
						</React.Fragment>
					))}
					<ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>
				</>
			) : (
				<>
					{items.map((item) => renderItem(item, value, handleSelect))}
					<ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>
				</>
			),
		[groups, items, value, handleSelect, emptyPlaceholder]
	);

	return (
		<Combobox open={open} onOpenChange={setOpen}>
			<ComboboxTrigger placeholder={placeholder} value={triggerValue} />
			{open && (
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxInput placeholder={placeholder} />
						<ComboboxList>{listContent}</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			)}
		</Combobox>
	);
}

/**
 * Minimal combobox preset. Accepts a list of items and handles selection,
 * filtering, and value display with minimal configuration.
 *
 * @example Flat items (value + label)
 * ```tsx
 * const items = [
 *   { value: 'react', label: 'React' },
 *   { value: 'vue', label: 'Vue' },
 *   { value: 'angular', label: 'Angular' },
 * ];
 *
 * <ComboboxSimple
 *   items={items}
 *   placeholder="Select a framework..."
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 *
 * @example Items with ReactNode labels (icon + text)
 * ```tsx
 * const items = [
 *   { value: 'react', label: <><StarIcon /> React</> },
 *   { value: 'vue', label: <><StarIcon /> Vue</> },
 * ];
 *
 * <ComboboxSimple items={items} value={value} onChange={setValue} />
 * ```
 *
 * @example Items with displayValue (ReactNode label, plain text in trigger)
 * ```tsx
 * const items = [
 *   { value: 'react', label: <><StarIcon /> React</>, displayValue: 'React' },
 *   { value: 'vue', label: <><StarIcon /> Vue</>, displayValue: 'Vue' },
 * ];
 *
 * <ComboboxSimple items={items} value={value} onChange={setValue} />
 * ```
 *
 * @example Grouped items with headings
 * ```tsx
 * const groups = [
 *   { heading: 'Frontend', items: [{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }] },
 *   { heading: 'Backend', items: [{ value: 'node', label: 'Node.js' }, { value: 'go', label: 'Go' }] },
 * ];
 *
 * <ComboboxSimple groups={groups} value={value} onChange={setValue} />
 * ```
 *
 * @example Custom displayValue callback
 * ```tsx
 * <ComboboxSimple
 *   items={items}
 *   value={value}
 *   onChange={setValue}
 *   displayValue={(item) => item ? `${item.displayValue ?? item.value} ✓` : 'Choose...'}
 * />
 * ```
 */
export const ComboboxSimple = React.memo(ComboboxSimpleInner);
