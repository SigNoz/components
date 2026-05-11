import { ChevronDown } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { TooltipProvider, TooltipSimple } from '../../tooltip/index.js';
import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxCreateItem,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxHint,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPill,
	ComboboxSeparator,
	ComboboxTrigger,
} from '../combobox.js';
import styles from '../combobox.module.scss';

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
	/**
	 * When set, item becomes a "hint" that inserts this value into input instead of selecting.
	 * Useful for suggestions like "status:" that let users continue typing.
	 */
	insertValue?: string;
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
	 * The testId associated with the combobox.
	 */
	testId?: string;
	/**
	 * The id of the combobox.
	 */
	id?: string;
	/**
	 * Additional CSS classes to apply to the combobox trigger.
	 */
	className?: string;
	/**
	 * Inline styles to apply to the combobox trigger.
	 */
	style?: React.CSSProperties;
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
	 * Placeholder text when no value is selected.
	 * @default 'Select an option...'
	 */
	placeholder?: string;
	/**
	 * Placeholder text for the search input inside the popover.
	 * Falls back to `placeholder` if not provided.
	 * @default undefined
	 */
	inputPlaceholder?: string;
	/**
	 * Text shown when there are no results (e.g. after filtering).
	 * @default 'No results found.'
	 */
	emptyPlaceholder?: string;
	/**
	 * Controlled selected value. When `multiple` is true, this should be an array.
	 * @default undefined
	 */
	value?: string | string[];
	/**
	 * Initial value when uncontrolled. When `multiple` is true, this should be an array.
	 * @default '' (or [] when multiple)
	 */
	defaultValue?: string | string[];
	/**
	 * Callback when selection changes.
	 * @param value - The new selected value (string when single, string[] when multiple).
	 */
	onChange?: (value: string | string[]) => void;
	/**
	 * Customize what is shown in the trigger. Receives the selected item (or undefined). Use when you want a string instead of the label ReactNode.
	 * @param item - The selected item (or undefined).
	 * @returns The string or ReactNode to show in the trigger.
	 */
	displayValue?: (item: ComboboxSimpleItem | undefined) => string | React.ReactNode;
	/**
	 * Only change to false when you want to include this component inside a popover
	 *
	 * @default true
	 */
	withPortal?: boolean;
	/**
	 * Enable multi-select mode. Values are shown as removable pills.
	 * @default false
	 */
	multiple?: boolean;
	/**
	 * Allow creating new items by typing and pressing Enter.
	 * When `true`, shows a default "Create [input]" option.
	 * When a function, renders custom content for the create option.
	 * @default false
	 */
	allowCreate?: boolean | ((inputValue: string) => React.ReactNode);
	/**
	 * Maximum number of pills to display in multi-select mode.
	 * Overflow items are shown as "+N" badge.
	 * @default undefined (show all)
	 */
	maxDisplayedPills?: number;
	/**
	 * Disable the internal TooltipProvider wrapper.
	 * Set to true when ComboboxSimple is already inside a TooltipProvider.
	 * @default false
	 */
	disableTooltipProvider?: boolean;
};

function flattenItems(groups: ComboboxSimpleGroup[]): ComboboxSimpleItem[] {
	return groups.flatMap((g) => g.items);
}

function renderItem(
	item: ComboboxSimpleItem,
	selectedValues: string[],
	handleSelect: (v: string) => void,
	handleInsert: (v: string) => void
) {
	// Items with insertValue render as hints
	if (item.insertValue !== undefined) {
		return (
			<ComboboxHint
				key={item.value}
				value={item.value}
				insertValue={item.insertValue}
				onInsert={handleInsert}
			>
				{item.label}
			</ComboboxHint>
		);
	}

	return (
		<ComboboxItem
			key={item.value}
			value={item.value}
			onSelect={handleSelect}
			isSelected={selectedValues.includes(item.value)}
		>
			{item.label}
		</ComboboxItem>
	);
}

const normalizeValue = (v: string | string[] | undefined): string[] => {
	if (v === undefined) return [];
	const arr = Array.isArray(v) ? v : [v];
	return arr.filter((val) => val !== '');
};

function ComboboxSimpleInner({
	items = [],
	groups,
	placeholder = 'Select an option...',
	inputPlaceholder,
	emptyPlaceholder = 'No results found.',
	value: controlledValue,
	defaultValue,
	onChange,
	displayValue: displayValueFn,
	withPortal = true,
	testId,
	id,
	className,
	style,
	multiple = false,
	allowCreate = false,
	maxDisplayedPills,
	disableTooltipProvider = false,
}: ComboboxSimpleProps) {
	const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(() =>
		normalizeValue(defaultValue)
	);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');
	const triggerRef = React.useRef<HTMLButtonElement | HTMLDivElement>(null);

	const isControlled = controlledValue !== undefined;
	const selectedValues = React.useMemo(
		() => (isControlled ? normalizeValue(controlledValue) : uncontrolledValue),
		[isControlled, controlledValue, uncontrolledValue]
	);

	const allItems = React.useMemo(() => (groups ? flattenItems(groups) : items), [groups, items]);

	const itemsMap = React.useMemo(() => {
		const map = new Map<string, ComboboxSimpleItem>();
		for (const item of allItems) {
			map.set(item.value, item);
		}
		return map;
	}, [allItems]);

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
				setInputValue('');
				// Stay open for multi-select
			} else {
				if (!isControlled) {
					setUncontrolledValue([selectedValue]);
				}
				onChange?.(selectedValue);
				setInputValue('');
				setOpen(false);
			}
		},
		[multiple, onChange, selectedValues, isControlled]
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

	const handleCreate = React.useCallback(
		(valueToCreate: string) => {
			const trimmed = valueToCreate.trim();
			if (!trimmed) return;

			// Ignore duplicates
			if (selectedValues.includes(trimmed)) {
				setInputValue('');
				return;
			}

			if (multiple) {
				const newValues = [...selectedValues, trimmed];
				if (!isControlled) {
					setUncontrolledValue(newValues);
				}
				onChange?.(newValues);
			} else {
				if (!isControlled) {
					setUncontrolledValue([trimmed]);
				}
				onChange?.(trimmed);
				setOpen(false);
			}
			setInputValue('');
		},
		[multiple, onChange, selectedValues, isControlled]
	);

	const selectedItem = React.useMemo(
		() => (multiple ? undefined : allItems.find((item) => item.value === selectedValues[0])),
		[multiple, allItems, selectedValues]
	);

	// For single-select with custom value (not in items), show the raw value
	const singleCustomValue =
		!multiple && selectedValues.length > 0 && !selectedItem ? selectedValues[0] : undefined;

	const triggerValue = displayValueFn
		? displayValueFn(selectedItem)
		: selectedItem
			? (selectedItem.displayValue ?? selectedItem.label)
			: singleCustomValue;

	const resolveLabel = React.useCallback(
		(value: string): React.ReactNode => {
			const item = itemsMap.get(value);
			if (!item) return value;
			return item.displayValue ?? item.label;
		},
		[itemsMap]
	);

	const handleTriggerKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setOpen(true);
		}
	}, []);

	const handleInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			setOpen(false);
			triggerRef.current?.focus();
		}
	}, []);

	const handleInsert = React.useCallback((value: string) => {
		setInputValue(value);
	}, []);

	// Extract hint items (items with insertValue) from allItems
	const hintItems = React.useMemo(
		() => allItems.filter((item) => item.insertValue !== undefined),
		[allItems]
	);

	// Show hints when input is empty or doesn't start with any hint's insertValue
	const showHints =
		hintItems.length > 0 && !hintItems.some((item) => inputValue.startsWith(item.insertValue!));

	// Custom filter for cmdk: always show hint items when showHints is true
	const hintValues = React.useMemo(() => new Set(hintItems.map((h) => h.value)), [hintItems]);
	const customFilter = React.useCallback(
		(value: string, search: string) => {
			const isHintItem = hintValues.has(value);
			if (isHintItem) return showHints ? 1 : 0;
			// Default cmdk behavior for regular items
			if (value.toLowerCase().includes(search.toLowerCase())) return 1;
			return 0;
		},
		[hintValues, showHints]
	);

	const showCreateOption =
		allowCreate &&
		inputValue.trim() &&
		!selectedValues.includes(inputValue.trim()) &&
		!allItems.some((item) => item.value === inputValue.trim());

	// Custom values = selected values not in predefined items
	const customValues = React.useMemo(
		() => selectedValues.filter((v) => !itemsMap.has(v)),
		[selectedValues, itemsMap]
	);

	// Filter items: show hints only when showHints is true, always show non-hint items
	const filterItems = React.useCallback(
		(itemList: ComboboxSimpleItem[]) =>
			itemList.filter((item) => (item.insertValue !== undefined ? showHints : true)),
		[showHints]
	);

	const listContent = React.useMemo(
		() =>
			groups ? (
				<>
					{customValues.length > 0 && (
						<>
							<ComboboxGroup heading="Custom" forceMount>
								{customValues.map((v) => (
									<ComboboxItem
										key={v}
										value={v}
										onSelect={handleSelect}
										isSelected={true}
										forceMount
									>
										{v}
									</ComboboxItem>
								))}
							</ComboboxGroup>
							<ComboboxSeparator />
						</>
					)}
					{groups.map((group, idx) => {
						const filteredItems = filterItems(group.items);
						if (filteredItems.length === 0) return null;
						return (
							<React.Fragment key={group.heading ?? idx}>
								{idx > 0 && <ComboboxSeparator />}
								<ComboboxGroup heading={group.heading}>
									{filteredItems.map((item) =>
										renderItem(item, selectedValues, handleSelect, handleInsert)
									)}
								</ComboboxGroup>
							</React.Fragment>
						);
					})}
					{showCreateOption && (
						<ComboboxCreateItem
							inputValue={inputValue.trim()}
							onSelect={() => handleCreate(inputValue)}
							value={`__create__${inputValue.trim()}`}
						>
							{typeof allowCreate === 'function'
								? allowCreate(inputValue.trim())
								: `Create "${inputValue.trim()}"`}
						</ComboboxCreateItem>
					)}
					{!showCreateOption && customValues.length === 0 && (
						<ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>
					)}
				</>
			) : (
				<>
					{customValues.length > 0 && (
						<>
							<ComboboxGroup heading="Custom" forceMount>
								{customValues.map((v) => (
									<ComboboxItem
										key={v}
										value={v}
										onSelect={handleSelect}
										isSelected={true}
										forceMount
									>
										{v}
									</ComboboxItem>
								))}
							</ComboboxGroup>
							{items.length > 0 && <ComboboxSeparator />}
						</>
					)}
					{filterItems(items).map((item) =>
						renderItem(item, selectedValues, handleSelect, handleInsert)
					)}
					{showCreateOption && (
						<ComboboxCreateItem
							inputValue={inputValue.trim()}
							onSelect={() => handleCreate(inputValue)}
							value={`__create__${inputValue.trim()}`}
						>
							{typeof allowCreate === 'function'
								? allowCreate(inputValue.trim())
								: `Create "${inputValue.trim()}"`}
						</ComboboxCreateItem>
					)}
					{!showCreateOption && customValues.length === 0 && (
						<ComboboxEmpty>{emptyPlaceholder}</ComboboxEmpty>
					)}
				</>
			),
		[
			groups,
			items,
			selectedValues,
			handleSelect,
			emptyPlaceholder,
			showCreateOption,
			inputValue,
			allowCreate,
			handleCreate,
			customValues,
			filterItems,
			handleInsert,
		]
	);

	const Wrapper = disableTooltipProvider ? React.Fragment : TooltipProvider;

	// Multi-select mode with pills in trigger, input in popover
	if (multiple) {
		const displayedValues =
			maxDisplayedPills !== undefined ? selectedValues.slice(0, maxDisplayedPills) : selectedValues;
		const overflowCount =
			maxDisplayedPills !== undefined ? Math.max(0, selectedValues.length - maxDisplayedPills) : 0;
		const hiddenValues = selectedValues.slice(maxDisplayedPills);

		const pillsContent =
			selectedValues.length > 0 ? (
				<span
					data-slot="combobox-pills"
					style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}
				>
					{displayedValues.map((v) => (
						<ComboboxPill key={v} value={v} onRemove={handleRemove}>
							{resolveLabel(v)}
						</ComboboxPill>
					))}
					{overflowCount > 0 && (
						<TooltipSimple title={hiddenValues.map((v) => resolveLabel(v)).join(', ')}>
							<span
								data-slot="combobox-pill-overflow"
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									height: '1.25rem',
									padding: '0 0.5rem',
									borderRadius: '2px',
									backgroundColor: 'var(--muted)',
									color: 'var(--muted-foreground)',
									fontSize: '0.75rem',
									fontWeight: 500,
									cursor: 'default',
								}}
							>
								+{overflowCount}
							</span>
						</TooltipSimple>
					)}
				</span>
			) : undefined;

		return (
			<Wrapper>
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger asChild>
						<div
							ref={triggerRef as React.RefObject<HTMLDivElement>}
							className={cn(styles['combobox__trigger'], className)}
							style={style}
							data-testid={testId}
							id={id}
							role="combobox"
							aria-expanded={open}
							aria-haspopup="listbox"
							tabIndex={0}
							onKeyDown={handleTriggerKeyDown}
						>
							<span className={styles['combobox__trigger-value']}>
								{pillsContent || placeholder || 'Select an option...'}
							</span>
							<ChevronDown className={styles['combobox__trigger-icon']} />
						</div>
					</ComboboxTrigger>
					{open && (
						<ComboboxContent withPortal={withPortal}>
							<ComboboxCommand filter={hintItems.length > 0 ? customFilter : undefined}>
								<ComboboxInput
									placeholder={inputPlaceholder ?? placeholder}
									value={inputValue}
									onValueChange={setInputValue}
									onKeyDown={handleInputKeyDown}
								/>
								<ComboboxList>{listContent}</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</Wrapper>
		);
	}

	// Single-select mode (original behavior)
	return (
		<Wrapper>
			<Combobox open={open} onOpenChange={setOpen}>
				<ComboboxTrigger
					ref={triggerRef as React.RefObject<HTMLButtonElement>}
					placeholder={placeholder}
					value={triggerValue}
					testId={testId}
					id={id}
					className={className}
					style={style}
				/>
				{open && (
					<ComboboxContent withPortal={withPortal}>
						<ComboboxCommand filter={hintItems.length > 0 ? customFilter : undefined}>
							<ComboboxInput
								placeholder={inputPlaceholder ?? placeholder}
								value={inputValue}
								onValueChange={setInputValue}
								onKeyDown={handleInputKeyDown}
							/>
							<ComboboxList>{listContent}</ComboboxList>
						</ComboboxCommand>
					</ComboboxContent>
				)}
			</Combobox>
		</Wrapper>
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
 *
 * @example Multi-select mode
 * ```tsx
 * const [values, setValues] = useState<string[]>([]);
 *
 * <ComboboxSimple
 *   multiple
 *   items={items}
 *   value={values}
 *   onChange={(v) => setValues(v as string[])}
 *   placeholder="Select frameworks..."
 * />
 * ```
 *
 * @example Allow creating new items (tags mode)
 * ```tsx
 * const [tags, setTags] = useState<string[]>([]);
 *
 * <ComboboxSimple
 *   multiple
 *   allowCreate
 *   items={[]}
 *   value={tags}
 *   onChange={(v) => setTags(v as string[])}
 *   placeholder="Type to add tags..."
 * />
 * ```
 *
 * @example Custom create option text
 * ```tsx
 * <ComboboxSimple
 *   multiple
 *   allowCreate={(input) => <span>Add <strong>"{input}"</strong> as new tag</span>}
 *   items={items}
 *   value={values}
 *   onChange={(v) => setValues(v as string[])}
 * />
 * ```
 */
export const ComboboxSimple = React.memo(ComboboxSimpleInner);
