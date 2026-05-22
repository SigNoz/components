import { ChevronDown, LoaderCircle } from '@signozhq/icons';
import * as React from 'react';
import { cn } from '../../../lib/utils.js';
import { TooltipProvider } from '../../../tooltip/index.js';
import styles from '../../combobox.module.scss';
import { ComboboxCommand } from '../../subcomponents/combobox-command.js';
import { ComboboxContent } from '../../subcomponents/combobox-content.js';
import { ComboboxInput } from '../../subcomponents/combobox-input.js';
import { ComboboxList } from '../../subcomponents/combobox-list.js';
import { ComboboxLoading } from '../../subcomponents/combobox-loading.js';
import { Combobox } from '../../subcomponents/combobox-root.js';
import { ComboboxTrigger } from '../../subcomponents/combobox-trigger.js';
import { ComboboxListContent } from './components/list-content.js';
import { ComboboxPills } from './components/pills.js';
import { VirtualizedList } from './components/virtualized-list.js';
import { useComboboxFilter } from './hooks/use-combobox-filter.js';
import { useComboboxOpen } from './hooks/use-combobox-open.js';
import { useComboboxSelection } from './hooks/use-combobox-selection.js';
import type { ComboboxSimpleGroup, ComboboxSimpleItem } from './types.js';
import {
	buildItemsMap,
	buildRenderTree,
	flattenItems,
	getCreateState,
	treeToVirtualRows,
} from './utils.js';

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
	/**
	 * Show loading state instead of items.
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Content shown while loading. Can be string or ReactNode.
	 * @default 'Loading...'
	 */
	loadingPlaceholder?: React.ReactNode;
	/**
	 * Whether the combobox is disabled.
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Enable virtualized rendering for large item lists.
	 * Pass `true` to enable with defaults, or an object to customize sizing.
	 * @default false
	 */
	virtualized?:
		| boolean
		| {
				/**
				 * Estimated height (in px) of each row. Used by the virtualizer to compute scroll offsets.
				 * @default 32
				 */
				estimatedItemHeight?: number;
				/**
				 * Height (in px) of the virtualized scroll container.
				 * @default 300
				 */
				virtualizedHeight?: number;
		  };
};

const ComboboxSimpleInner = React.forwardRef<
	HTMLButtonElement | HTMLDivElement,
	ComboboxSimpleProps
>(
	(
		{
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
			loading = false,
			loadingPlaceholder = 'Loading...',
			disabled = false,
			virtualized = false,
		},
		forwardedRef
	) => {
		const isVirtualized = Boolean(virtualized);
		const estimatedItemHeight =
			typeof virtualized === 'object' ? (virtualized.estimatedItemHeight ?? 32) : 32;
		const virtualizedHeight =
			typeof virtualized === 'object' ? (virtualized.virtualizedHeight ?? 300) : 300;

		const [inputValue, setInputValue] = React.useState('');
		const internalRef = React.useRef<HTMLButtonElement | HTMLDivElement>(null);

		const triggerRef = React.useMemo(() => {
			return (node: HTMLButtonElement | HTMLDivElement | null) => {
				(internalRef as React.MutableRefObject<HTMLButtonElement | HTMLDivElement | null>).current =
					node;
				if (typeof forwardedRef === 'function') {
					forwardedRef(node);
				} else if (forwardedRef) {
					forwardedRef.current = node;
				}
			};
		}, [forwardedRef]);

		const { open, setOpen } = useComboboxOpen({ disabled });

		const allItems = React.useMemo(() => (groups ? flattenItems(groups) : items), [groups, items]);
		const itemsMap = React.useMemo(() => buildItemsMap(allItems), [allItems]);

		const { selectedValues, customValues, selectedItem, handleSelect, handleRemove, addValue } =
			useComboboxSelection({
				controlledValue,
				defaultValue,
				multiple,
				itemsMap,
				onChange,
				setOpen,
				setInputValue,
			});

		const { showHints } = useComboboxFilter({ items: allItems, inputValue });

		const { showCreateOption, createValue } = React.useMemo(
			() => getCreateState(selectedValues, itemsMap, inputValue),
			[selectedValues, itemsMap, inputValue]
		);

		const showCreate = allowCreate && showCreateOption;

		const handleCreate = React.useCallback(
			(valueToCreate: string) => {
				const trimmed = valueToCreate.trim();
				if (!trimmed || selectedValues.includes(trimmed)) {
					setInputValue('');
					return;
				}
				addValue(trimmed);
				setInputValue('');
			},
			[selectedValues, addValue]
		);

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
				if (!item) return typeof value === 'string' ? value : String(value);
				return item.displayValue ?? item.label ?? item.value;
			},
			[itemsMap]
		);

		const handleTriggerKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					setOpen(true);
				}
			},
			[setOpen]
		);

		const handleInputKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Tab' && e.shiftKey) {
					e.preventDefault();
					setOpen(false);
					internalRef.current?.focus();
				}
			},
			[setOpen]
		);

		const handleInsert = React.useCallback((value: string) => {
			setInputValue(value);
		}, []);

		const renderTree = React.useMemo(
			() =>
				buildRenderTree({
					customValues,
					groups,
					items,
					inputValue,
					showHints,
					showCreate: Boolean(showCreate),
					createValue,
					applyQueryFilter: true,
				}),
			[customValues, groups, items, inputValue, showHints, showCreate, createValue]
		);

		const virtualizedRows = React.useMemo(
			() => (isVirtualized ? treeToVirtualRows(renderTree) : []),
			[isVirtualized, renderTree]
		);

		const Wrapper = disableTooltipProvider ? React.Fragment : TooltipProvider;

		const dropdownContent = (
			<ComboboxContent withPortal={withPortal}>
				<ComboboxCommand shouldFilter={false}>
					<ComboboxInput
						placeholder={inputPlaceholder ?? placeholder}
						value={inputValue}
						onValueChange={setInputValue}
						onKeyDown={handleInputKeyDown}
					/>
					{isVirtualized ? (
						loading ? (
							<ComboboxLoading>{loadingPlaceholder}</ComboboxLoading>
						) : (
							<ComboboxList className={styles['combobox__virtual-list-wrapper']}>
								<VirtualizedList
									rows={virtualizedRows}
									height={virtualizedHeight}
									estimatedItemHeight={estimatedItemHeight}
									selectedValues={selectedValues}
									emptyPlaceholder={emptyPlaceholder}
									showCreateOption={Boolean(showCreate)}
									allowCreate={allowCreate}
									handleSelect={handleSelect}
									handleCreate={handleCreate}
									handleInsert={handleInsert}
								/>
							</ComboboxList>
						)
					) : (
						<ComboboxList>
							<ComboboxListContent
								loading={loading}
								loadingPlaceholder={loadingPlaceholder}
								tree={renderTree}
								selectedValues={selectedValues}
								allowCreate={allowCreate}
								emptyPlaceholder={emptyPlaceholder}
								handleSelect={handleSelect}
								handleCreate={handleCreate}
								handleInsert={handleInsert}
							/>
						</ComboboxList>
					)}
				</ComboboxCommand>
			</ComboboxContent>
		);

		if (multiple) {
			const pillsContent =
				selectedValues.length > 0 ? (
					<ComboboxPills
						values={selectedValues}
						maxDisplayed={maxDisplayedPills}
						resolveLabel={resolveLabel}
						onRemove={handleRemove}
					/>
				) : undefined;

			return (
				<Wrapper>
					<Combobox open={open} onOpenChange={setOpen}>
						<ComboboxTrigger asChild>
							<div
								ref={triggerRef as React.RefCallback<HTMLDivElement>}
								className={cn(styles['combobox__trigger'], className)}
								style={style}
								data-slot="combobox-trigger"
								data-testid={testId}
								id={id}
								role="combobox"
								aria-expanded={open}
								aria-haspopup="listbox"
								aria-label={placeholder}
								aria-disabled={disabled}
								data-disabled={disabled || undefined}
								tabIndex={disabled ? -1 : 0}
								onKeyDown={disabled ? undefined : handleTriggerKeyDown}
							>
								<span data-slot="combobox-value" className={styles['combobox__trigger-value']}>
									{pillsContent || placeholder || 'Select an option...'}
								</span>
								{loading ? (
									<LoaderCircle
										data-slot="combobox-spinner"
										className={styles['combobox__trigger-spinner']}
									/>
								) : (
									<ChevronDown
										data-slot="combobox-icon"
										className={styles['combobox__trigger-icon']}
									/>
								)}
							</div>
						</ComboboxTrigger>
						{open && dropdownContent}
					</Combobox>
				</Wrapper>
			);
		}

		return (
			<Wrapper>
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger asChild>
						<button
							ref={triggerRef as React.RefCallback<HTMLButtonElement>}
							type="button"
							className={cn(styles['combobox__trigger'], className)}
							style={style}
							data-slot="combobox-trigger"
							data-testid={testId}
							id={id}
							disabled={disabled}
							data-disabled={disabled || undefined}
						>
							<span data-slot="combobox-value" className={styles['combobox__trigger-value']}>
								{triggerValue || placeholder || 'Select an option...'}
							</span>
							{loading ? (
								<LoaderCircle
									data-slot="combobox-spinner"
									className={styles['combobox__trigger-spinner']}
								/>
							) : (
								<ChevronDown
									data-slot="combobox-icon"
									className={styles['combobox__trigger-icon']}
								/>
							)}
						</button>
					</ComboboxTrigger>
					{open && dropdownContent}
				</Combobox>
			</Wrapper>
		);
	}
);
ComboboxSimpleInner.displayName = 'ComboboxSimpleInner';

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
 *
 * @example Loading state (async fetch)
 * ```tsx
 * const [items, setItems] = useState<ComboboxSimpleItem[]>([]);
 * const [isLoading, setIsLoading] = useState(true);
 *
 * useEffect(() => {
 *   fetchItems().then((data) => {
 *     setItems(data);
 *     setIsLoading(false);
 *   });
 * }, []);
 *
 * <ComboboxSimple
 *   items={items}
 *   loading={isLoading}
 *   loadingPlaceholder="Fetching options..."
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 *
 * @example Virtualized list (large datasets)
 * ```tsx
 * <ComboboxSimple
 *   items={largeItemList} // e.g. 10k+ items
 *   virtualized
 *   value={value}
 *   onChange={setValue}
 * />
 *
 * // Custom row height / container height:
 * <ComboboxSimple
 *   items={largeItemList}
 *   virtualized={{ estimatedItemHeight: 40, virtualizedHeight: 400 }}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export const ComboboxSimple = React.memo(ComboboxSimpleInner);
