import * as React from 'react';
import { Select } from '../components/select.js';
import { SelectContent } from '../components/select-content.js';
import { SelectGroup, SelectLabel } from '../components/select-group.js';
import { SelectItem } from '../components/select-item.js';
import { SelectSeparator } from '../components/select-separator.js';
import { SelectTrigger } from '../components/select-trigger.js';

export type SelectSimpleItem = {
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
	/**
	 * Whether this item is disabled.
	 */
	disabled?: boolean;
};

export type SelectSimpleGroup = {
	/**
	 * Optional heading for the group.
	 */
	heading?: string;
	/**
	 * Items in this group.
	 */
	items: SelectSimpleItem[];
};

export type SelectSimpleProps = {
	/**
	 * Additional CSS class names for the trigger.
	 */
	className?: string;
	/**
	 * Inline styles for the trigger element.
	 */
	style?: React.CSSProperties;
	/**
	 * Unique identifier for the trigger element.
	 */
	id?: string;
	/**
	 * Test identifier for testing libraries.
	 */
	testId?: string;
	/**
	 * List of items to display (flat). Ignored when groups is provided.
	 * @default []
	 */
	items?: SelectSimpleItem[];
	/**
	 * Grouped items with optional headings. When provided, items is ignored.
	 * @default undefined
	 */
	groups?: SelectSimpleGroup[];
	/**
	 * Placeholder text when no value is selected.
	 * @default 'Select...'
	 */
	placeholder?: string;
	/**
	 * Controlled selected value.
	 * @default undefined
	 */
	value?: string | string[];
	/**
	 * Initial value when uncontrolled.
	 * @default ''
	 */
	defaultValue?: string | string[];
	/**
	 * Callback when selection changes.
	 */
	onChange?: (value: string | string[]) => void;
	/**
	 * Enable multi-select mode.
	 * @default false
	 */
	multiple?: boolean;
	/**
	 * Customize what is shown in the trigger.
	 */
	displayValue?: (selectedItems: SelectSimpleItem[]) => React.ReactNode;
	/**
	 * Whether to render in a portal.
	 * @default true
	 */
	withPortal?: boolean;
	/**
	 * Whether the select is disabled.
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Initial open state when uncontrolled.
	 * @default false
	 */
	defaultOpen?: boolean;
	/**
	 * Maximum number of pills to display in multi-select mode.
	 * Overflow items are shown as "+N" badge.
	 * @default undefined (show all)
	 */
	maxDisplayedPills?: number;
};

function flattenItems(groups: SelectSimpleGroup[]): SelectSimpleItem[] {
	return groups.flatMap((g) => g.items);
}

function SelectSimpleInner({
	className,
	style,
	id,
	testId,
	items = [],
	groups,
	placeholder = 'Select...',
	value: controlledValue,
	defaultValue,
	onChange,
	multiple = false,
	displayValue: displayValueFn,
	withPortal = true,
	disabled = false,
	defaultOpen = false,
	maxDisplayedPills,
}: SelectSimpleProps) {
	const allItems = React.useMemo(() => (groups ? flattenItems(groups) : items), [groups, items]);

	const itemsMap = React.useMemo(() => {
		const map = new Map<string, SelectSimpleItem>();
		for (const item of allItems) {
			map.set(item.value, item);
		}
		return map;
	}, [allItems]);

	const resolveLabel = React.useCallback(
		(value: string): React.ReactNode => {
			const item = itemsMap.get(value);
			if (!item) return value;
			return item.displayValue ?? item.label;
		},
		[itemsMap]
	);

	const renderTriggerValue = React.useMemo(() => {
		if (!displayValueFn) return undefined;

		return (values: string[]) => {
			const selectedItems = values
				.map((v) => itemsMap.get(v))
				.filter(Boolean) as SelectSimpleItem[];
			return displayValueFn(selectedItems);
		};
	}, [displayValueFn, itemsMap]);

	const renderItems = (itemList: SelectSimpleItem[]) =>
		itemList.map((item) => (
			<SelectItem
				key={item.value}
				value={item.value}
				disabled={item.disabled}
				textValue={item.displayValue ?? (typeof item.label === 'string' ? item.label : undefined)}
			>
				{item.label}
			</SelectItem>
		));

	const content = groups
		? groups.map((group, idx) => (
				<React.Fragment key={group.heading ?? idx}>
					{idx > 0 && <SelectSeparator />}
					<SelectGroup>
						{group.heading && <SelectLabel>{group.heading}</SelectLabel>}
						{renderItems(group.items)}
					</SelectGroup>
				</React.Fragment>
			))
		: renderItems(items);

	return (
		<Select
			value={controlledValue}
			defaultValue={defaultValue}
			onChange={onChange}
			multiple={multiple}
			disabled={disabled}
			defaultOpen={defaultOpen}
		>
			<SelectTrigger
				className={className}
				style={style}
				id={id}
				testId={testId}
				placeholder={placeholder}
				renderValue={renderTriggerValue}
				resolveLabel={resolveLabel}
				maxDisplayedPills={maxDisplayedPills}
			/>
			<SelectContent withPortal={withPortal}>{content}</SelectContent>
		</Select>
	);
}

/**
 * Minimal select preset. Accepts a list of items and handles selection
 * and value display with minimal configuration.
 *
 * @example Flat items (value + label)
 * ```tsx
 * const items = [
 *   { value: 'react', label: 'React' },
 *   { value: 'vue', label: 'Vue' },
 *   { value: 'angular', label: 'Angular' },
 * ];
 *
 * <SelectSimple
 *   items={items}
 *   placeholder="Select a framework..."
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 *
 * @example Multi-select
 * ```tsx
 * <SelectSimple
 *   multiple
 *   items={items}
 *   value={values}
 *   onChange={setValues}
 * />
 * ```
 *
 * @example Grouped items with headings
 * ```tsx
 * const groups = [
 *   { heading: 'Frontend', items: [{ value: 'react', label: 'React' }] },
 *   { heading: 'Backend', items: [{ value: 'node', label: 'Node.js' }] },
 * ];
 *
 * <SelectSimple groups={groups} value={value} onChange={setValue} />
 * ```
 */
export const SelectSimple = React.memo(SelectSimpleInner);
