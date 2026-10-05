import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { X } from '@signozhq/icons';
import {
	type CSSProperties,
	forwardRef,
	type KeyboardEvent,
	type ReactElement,
	type RefAttributes,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { useForceOpen } from '../lib/force-open.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { useLabelFor } from '../lib/use-label-for.js';
import { useSelectionValue } from '../lib/use-selection-value.js';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { COMBOBOX_CLEAR_LABEL, COMBOBOX_CUSTOM_GROUP_LABEL } from './constants.js';
import styles from './combobox.module.scss';
import { ComboboxPopup } from './subcomponents/combobox-popup.js';
import { ComboboxTrigger } from './subcomponents/combobox-trigger.js';
import type { ComboboxVirtualScroller } from './subcomponents/combobox-virtual-rows.js';
import type { ComboboxProps, ValidateComboboxProps } from './types.js';
import {
	buildComboboxEntries,
	type ComboboxBaseValue,
	flattenComboboxOptions,
	indexComboboxOptions,
	isComboboxMarker,
} from './utils.js';

type ComboboxChangeDetails = BaseCombobox.Root.ChangeEventDetails;

const ComboboxImpl = forwardRef<HTMLElement, ComboboxProps & RejectedProps>(
	function Combobox(props, ref) {
		const {
			items,
			multiple = false,
			value,
			defaultValue,
			onChange,
			displayValue,
			maxDisplayedPills,
			placeholder,
			allowClear = false,
			allowCreate = false,
			searchInputProps,
			loading = false,
			loadingContent,
			noContent,
			footerAction,
			disabled = false,
			disabledTooltip,
			readOnly = false,
			readOnlyTooltip,
			virtualized = false,
			contentMaxWidth,
			contentMaxHeight,
			container,
			width,
			maxWidth,
			testId,
			id,
			className: _className,
			style: _style,
			...triggerProps
		} = props;

		const { selectedValues, commit } = useSelectionValue({
			isControlled: 'value' in props,
			multiple,
			value,
			defaultValue,
			onChange,
		});

		const isInert = disabled || readOnly;

		const forcedOpen = useForceOpen();
		const [openState, setOpenState] = useState(false);
		const open = (forcedOpen || openState) && !isInert;
		// Turning `disabled` or `readOnly` on closes an open popup, and turning it off again does not
		// bring the popup back. Adjusted while rendering, so no frame shows the popup over an inert
		// field.
		const [wasInert, setWasInert] = useState(isInert);

		if (wasInert !== isInert) {
			setWasInert(isInert);

			if (isInert) {
				setOpenState(false);
			}
		}

		const [query, setQuery] = useState('');
		const filter = searchInputProps.filter !== false;
		const scrollerRef = useRef<ComboboxVirtualScroller | null>(null);

		const options = useMemo(() => indexComboboxOptions(items), [items]);
		const entries = useMemo(
			() =>
				buildComboboxEntries({
					items,
					options,
					query,
					filter,
					selectedValues,
					allowCreate: allowCreate !== false,
					customGroupLabel: COMBOBOX_CUSTOM_GROUP_LABEL,
				}),
			[items, options, query, filter, selectedValues, allowCreate],
		);
		const flatOptions = useMemo(() => flattenComboboxOptions(entries), [entries]);
		const baseItems = useMemo(
			() => (virtualized ? flatOptions.map((option) => option.value) : undefined),
			[virtualized, flatOptions],
		);

		const isEmptyByMistake =
			items.length === 0 && !loading && filter && allowCreate === false && noContent === undefined;

		useEffect(() => {
			if (isEmptyByMistake) {
				console.warn('Combobox: `items` is empty, showing the empty row.');
			}
		}, [isEmptyByMistake]);

		function changeQuery(next: string): void {
			setQuery(next);

			if (next !== query) {
				searchInputProps.onChange?.(next);
			}
		}

		function handleValueChange(next: unknown, eventDetails: ComboboxChangeDetails): void {
			// Base UI clears the value on `Escape` over a closed combobox. Clearing is `allowClear`'s
			// job, through the clear button and `Delete`. It also picks a row from a letter typed on a
			// closed single trigger, which the open guard below does not see.
			if (isInert || eventDetails.reason === 'escape-key') {
				eventDetails.cancel();
				return;
			}

			const marker = Array.isArray(next)
				? next.find(isComboboxMarker)
				: isComboboxMarker(next)
					? next
					: undefined;

			if (marker?.marker === 'hint') {
				// Cancelled, Base UI neither selects nor closes. A letter typed on the closed trigger can
				// match a hint too, and the search row it would fill is not on screen.
				eventDetails.cancel();

				if (open) {
					changeQuery(marker.insertValue);
				}

				return;
			}

			if (marker?.marker === 'create') {
				const created = query.trim();

				if (created === '') {
					eventDetails.cancel();
					return;
				}

				commit(multiple ? [...selectedValues, created] : [created]);
				return;
			}

			const nextValues = Array.isArray(next)
				? next.filter((entry): entry is string => typeof entry === 'string')
				: typeof next === 'string'
					? [next]
					: [];

			// The typeahead of a closed trigger matches disabled rows, which the list itself refuses.
			if (
				nextValues.some(
					(entry) => !selectedValues.includes(entry) && options.get(entry)?.disabled === true,
				)
			) {
				eventDetails.cancel();
				return;
			}

			commit(nextValues);
		}

		function handleOpenChange(nextOpen: boolean, eventDetails: ComboboxChangeDetails): void {
			if (nextOpen && isInert) {
				eventDetails.cancel();
				return;
			}

			setOpenState(nextOpen);
		}

		function handleTriggerKeyDown(event: KeyboardEvent<HTMLElement>): void {
			if (
				allowClear &&
				!isInert &&
				selectedValues.length > 0 &&
				(event.key === 'Delete' || event.key === 'Backspace')
			) {
				event.preventDefault();
				commit([]);
			}
		}

		const showClear = allowClear && !isInert && !loading && selectedValues.length > 0;
		// The name, in the order the accessible name takes it: `aria-labelledby`, `aria-label`, a
		// `<label for>`, then the placeholder. The popup takes the same one.
		const [labelId, labelRef] = useLabelFor(id);
		// State, not a ref: the popup reads the layer the trigger sits in when it mounts.
		const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
		const triggerRef = useMemo(() => mergeRefs(ref, labelRef, setTriggerElement), [ref, labelRef]);
		const labelledBy =
			triggerProps['aria-labelledby'] ??
			(triggerProps['aria-label'] === undefined ? labelId : undefined);
		const accessibleName =
			triggerProps['aria-label'] ?? (labelledBy === undefined ? placeholder : undefined);

		const rootStyle = {
			...(width != null && { '--combobox-internal-width': toCssLength(width) }),
			...(maxWidth != null && { '--combobox-internal-max-width': toCssLength(maxWidth) }),
		} as CSSProperties;

		return (
			<TooltipProviderIfMissing>
				<BaseCombobox.Root<ComboboxBaseValue, boolean>
					multiple={multiple}
					value={(multiple ? selectedValues : (selectedValues[0] ?? null)) as never}
					onValueChange={handleValueChange}
					open={open}
					onOpenChange={handleOpenChange}
					inputValue={query}
					onInputValueChange={changeQuery}
					items={baseItems}
					filter={null}
					virtualized={virtualized}
					autoHighlight
					modal={false}
					onItemHighlighted={(_, eventDetails) => {
						if (virtualized && eventDetails.reason !== 'pointer' && eventDetails.index >= 0) {
							scrollerRef.current?.scrollToOption(eventDetails.index);
						}
					}}
				>
					<div
						data-slot="combobox"
						data-multiple={multiple || undefined}
						data-disabled={disabled || undefined}
						data-readonly={readOnly || undefined}
						data-loading={loading || undefined}
						data-clearable={showClear || undefined}
						data-popup-open={open || undefined}
						className={styles['combobox']}
						style={rootStyle}
					>
						<ComboboxTrigger
							ref={triggerRef}
							forwardedProps={triggerProps}
							id={id}
							accessibleName={accessibleName}
							labelledBy={labelledBy}
							multiple={multiple}
							values={selectedValues}
							options={options}
							displayValue={displayValue}
							placeholder={placeholder}
							maxDisplayedPills={maxDisplayedPills}
							disabled={disabled}
							disabledTooltip={disabledTooltip}
							readOnly={readOnly}
							readOnlyTooltip={readOnlyTooltip}
							loading={loading}
							testId={testId}
							onRemove={(removed) => commit(selectedValues.filter((entry) => entry !== removed))}
							onKeyDown={handleTriggerKeyDown}
						/>
						{showClear && (
							<BaseCombobox.Clear
								data-slot="combobox-clear"
								aria-label={COMBOBOX_CLEAR_LABEL}
								className={styles['combobox__clear']}
								{...(testId === undefined ? {} : { 'data-testid': `${testId}-clear` })}
							>
								<X />
							</BaseCombobox.Clear>
						)}
					</div>
					<ComboboxPopup
						trigger={triggerElement}
						accessibleName={accessibleName}
						labelledBy={labelledBy}
						container={container}
						contentMaxWidth={contentMaxWidth}
						contentMaxHeight={contentMaxHeight}
						searchInputProps={searchInputProps}
						entries={entries}
						optionCount={flatOptions.length}
						virtualized={virtualized}
						scrollerRef={scrollerRef}
						loading={loading}
						loadingContent={loadingContent}
						noContent={noContent}
						footerAction={footerAction}
						onFooterAction={() => setOpenState(false)}
						multiple={multiple}
						createLabel={typeof allowCreate === 'function' ? allowCreate : undefined}
						testId={testId}
					/>
				</BaseCombobox.Root>
			</TooltipProviderIfMissing>
		);
	},
);

/**
 * Renders a field that picks one value, or several, from a list the user can search (Base UI
 * `Combobox`).
 *
 * The combobox owns its markup: there are no subcomponents to import and nothing to compose. The
 * trigger is the field, and the search row sits at the top of the popup. `id`, `aria-*`, `data-*`
 * and the ref land on the trigger.
 *
 * Visual values are `--combobox-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Accessibility
 *
 * The trigger is `role="combobox"` with `aria-haspopup="dialog"`, and the popup is `role="dialog"`
 * around a `role="listbox"`. The focus moves to the search row on open and stays there: the
 * highlighted row is `aria-activedescendant` on the field.
 *
 * The trigger is named by `aria-label` or `aria-labelledby`, and by `placeholder` when neither is
 * given. A placeholder is not a label: pass one of the two. The search row is named by
 * `searchInputProps.placeholder`.
 *
 * ### Values
 *
 * `value` is the `value` of an `item` row, a `string`, or a `string[]` with `multiple`. Writing
 * `value` makes the combobox controlled, even with `undefined`. `onChange` reports `undefined` for
 * a cleared single value and `[]` for a multiple one.
 *
 * A selected value `items` does not have still shows, as itself, in the trigger and in a `Custom`
 * group at the top of the list, so it can be unselected. `allowCreate` adds a `Create "<query>"`
 * row that selects the query.
 *
 * A single trigger shows the selected row's `prefix`, then its `displayValue` when it has one, its
 * label otherwise. The `displayValue` prop replaces all of that, single only. A multiple combobox
 * shows chips, and `maxDisplayedPills` collapses the rest into a `+N` chip with a tooltip.
 *
 * ### Search
 *
 * The combobox filters `items` itself: a substring, case and accent insensitive, against the label
 * when it renders to text, the `value`, the `displayValue`, the `insertValue` and the
 * `searchMetadata`. A group survives when any of its rows match. A separator that would land first,
 * last, or next to another one is dropped.
 *
 * `searchInputProps.filter: false` turns the filtering off for rows a server already filtered. The
 * query still reaches `searchInputProps.onChange`, with `''` when the popup closes over one.
 *
 * A `hint` row writes its `insertValue` into the search row instead of selecting. Hints hide once
 * the query starts with one of them, case and accent insensitive.
 *
 * ### Keyboard
 *
 * `Enter`, `Space` and the arrow keys on the trigger open the popup. In the search row, the arrow
 * keys move the highlight and wrap, and the first match is highlighted while typing, so `Enter`
 * picks it. A single combobox closes on a pick. A multiple one stays open and clears the query.
 * `Esc` closes and returns the focus to the trigger. With `allowClear`, `Delete` and `Backspace`
 * on the trigger clear the value.
 *
 * ### Disabled, read-only, invalid and loading
 *
 * `disabled` and `readOnly` keep the popup closed and hide the clear and chip remove buttons. The
 * trigger carries `aria-disabled` or `aria-readonly`, never the native `disabled`, so it stays
 * focusable and its tooltip reachable. `disabled` outranks `readOnly`: only `disabledTooltip`
 * shows.
 *
 * `aria-invalid` reaches the trigger like any other `aria-*` prop and paints its border in the
 * destructive colour, hovered or not. It changes nothing else.
 *
 * `loading` swaps the trigger's chevron for a spinner and the rows for `loadingContent`. It blocks
 * nothing: the popup opens and the search row takes a query. `searchInputProps.loading` only swaps
 * the search glyph.
 *
 * ### Truncation
 *
 * Row labels and the single value end in an ellipsis when they do not fit, and the full text shows
 * in a tooltip only while they are truncated. A disabled row's reason comes first in the same
 * tooltip.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the trigger, and it names everything else: a row is
 * `` `${testId}-item-${value}` ``, a hint `` `${testId}-hint-${value}` ``, a group
 * `` `${testId}-group-${value}` ``, a custom value `` `${testId}-custom-${value}` ``, a chip
 * `` `${testId}-chip-${value}` `` and its button `` `${testId}-chip-${value}-remove` ``. The single
 * parts are `` `${testId}-create` ``, `-chip-overflow`, `-clear`, `-search`, `-loading`, `-empty`
 * and `-footer-action`. A row's own `testId` wins. Otherwise use the data attributes, never the
 * hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"combobox"` |
 * | `data-multiple`, `data-disabled`, `data-readonly`, `data-loading` | present while the prop is true |
 * | `data-clearable` | present while the clear button can show |
 * | `data-popup-open` | present while the popup is open |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `combobox-trigger` | always, the field. `data-popup-open`, `data-disabled` and `data-readonly` as they apply |
 * | `combobox-value`, `combobox-placeholder` | inside a single trigger, one of the two |
 * | `combobox-value-prefix` | inside a single trigger, when the selected row has a `prefix` and there is no `displayValue` prop |
 * | `combobox-chips`, `combobox-chip`, `combobox-chip-remove`, `combobox-chip-overflow` | inside a multiple trigger with values |
 * | `combobox-icon`, `combobox-spinner` | the trailing glyph of the trigger, the spinner while `loading` |
 * | `combobox-clear` | with `allowClear` and a value, while the combobox is usable |
 * | `combobox-positioner`, `combobox-popup` | while the popup is open |
 * | `combobox-search`, `combobox-search-input`, `combobox-search-prefix`, `combobox-search-suffix` | the search row, the suffix only when given |
 * | `combobox-viewport`, `combobox-list` | the scrolling part and the listbox in it |
 * | `combobox-virtual-list` | inside the listbox with `virtualized` |
 * | `combobox-item` | one per row, `data-kind` (`item`, `hint`, `create`, `custom`), `data-highlighted`, `data-selected`, `data-disabled` |
 * | `combobox-item-prefix`, `combobox-item-label`, `combobox-item-suffix`, `combobox-item-indicator` | the parts of a row |
 * | `combobox-group`, `combobox-group-label`, `combobox-separator` | one per group and separator |
 * | `combobox-loading`, `combobox-empty` | while loading, and when there is nothing to show |
 * | `combobox-footer`, `combobox-footer-action`, `combobox-footer-action-prefix`, `combobox-footer-action-label` | with `footerAction`, the prefix only when given |
 *
 * @example
 * ```tsx
 * <Combobox
 *   aria-label="Framework"
 *   placeholder="Select a framework..."
 *   searchInputProps={{ placeholder: 'Search frameworks' }}
 *   items={[
 *     { type: 'item', value: 'react', label: 'React' },
 *     { type: 'item', value: 'vue', label: 'Vue' },
 *   ]}
 *   value={framework}
 *   onChange={setFramework}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Several values, created from the query
 * <Combobox
 *   multiple
 *   allowCreate
 *   aria-label="Tags"
 *   placeholder="Select or create tags..."
 *   searchInputProps={{ placeholder: 'Search tags' }}
 *   items={tagItems}
 *   value={tags}
 *   onChange={setTags}
 *   maxDisplayedPills={2}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Rows filtered on the server, with an action under the list
 * <Combobox
 *   aria-label="Billing model"
 *   placeholder="Select a billing model..."
 *   items={rules.map((rule) => ({ type: 'item', value: rule.id, label: rule.name }))}
 *   searchInputProps={{
 *     placeholder: 'Search billing models',
 *     filter: false,
 *     onChange: setSearch,
 *     loading: isFetching,
 *   }}
 *   footerAction={{ label: 'Create a billing model', prefix: <Plus />, onClick: openCreate }}
 *   value={ruleId}
 *   onChange={setRuleId}
 * />
 * ```
 */
export const Combobox = ComboboxImpl as <T extends ComboboxProps>(
	props: T &
		ValidateComboboxProps<T> &
		// `T` is inferred from the call site, so `T extends ComboboxProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof ComboboxProps | keyof RefAttributes<HTMLElement>>, never> &
		RefAttributes<HTMLElement>,
) => ReactElement;
