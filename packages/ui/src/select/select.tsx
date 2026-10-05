import { Select as BaseSelect } from '@base-ui/react/select';
import {
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { useForceOpen } from '../lib/force-open.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { useLabelFor } from '../lib/use-label-for.js';
import { useSelectionValue } from '../lib/use-selection-value.js';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import styles from './select.module.scss';
import { SelectPopup } from './subcomponents/select-popup.js';
import { SelectTrigger } from './subcomponents/select-trigger.js';
import type { SelectProps, ValidateSelectProps } from './types.js';
import { indexSelectOptions, visibleSelectItems } from './utils.js';

type SelectChangeDetails = BaseSelect.Root.ChangeEventDetails;

const SelectImpl = forwardRef<HTMLElement, SelectProps & RejectedProps>(
	function Select(props, ref) {
		const {
			items,
			multiple = false,
			value,
			defaultValue,
			onChange,
			displayValue,
			maxDisplayedPills,
			placeholder,
			loading = false,
			loadingContent,
			noContent,
			disabled = false,
			disabledTooltip,
			readOnly = false,
			readOnlyTooltip,
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

		const options = useMemo(() => indexSelectOptions(items), [items]);
		const rows = useMemo(() => visibleSelectItems(items), [items]);

		const isEmptyByMistake = items.length === 0 && !loading && noContent === undefined;

		useEffect(() => {
			if (isEmptyByMistake) {
				console.warn('Select: `items` is empty, showing the empty row.');
			}
		}, [isEmptyByMistake]);

		function handleValueChange(
			next: string | string[] | null,
			eventDetails: SelectChangeDetails,
		): void {
			// Base UI picks a row from a letter typed on a closed single trigger, which the open guard
			// below does not see.
			if (isInert) {
				eventDetails.cancel();
				return;
			}

			if (Array.isArray(next)) {
				commit(next);
			} else if (next !== null) {
				commit([next]);
			}
		}

		function handleOpenChange(nextOpen: boolean, eventDetails: SelectChangeDetails): void {
			if (nextOpen && isInert) {
				eventDetails.cancel();
				return;
			}

			setOpenState(nextOpen);
		}

		// The name, in the order the accessible name takes it: `aria-labelledby`, `aria-label`, a
		// `<label for>`, then the placeholder. The popup list takes the same one.
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
			...(width != null && { '--select-internal-width': toCssLength(width) }),
			...(maxWidth != null && { '--select-internal-max-width': toCssLength(maxWidth) }),
		} as CSSProperties;

		return (
			<TooltipProviderIfMissing>
				<BaseSelect.Root<string, boolean>
					multiple={multiple}
					value={(multiple ? selectedValues : (selectedValues[0] ?? null)) as never}
					onValueChange={handleValueChange as never}
					open={open}
					onOpenChange={handleOpenChange}
					modal={false}
				>
					<div
						data-slot="select"
						data-multiple={multiple || undefined}
						data-disabled={disabled || undefined}
						data-readonly={readOnly || undefined}
						data-loading={loading || undefined}
						data-popup-open={open || undefined}
						className={styles['select']}
						style={rootStyle}
					>
						<SelectTrigger
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
						/>
					</div>
					<SelectPopup
						trigger={triggerElement}
						accessibleName={accessibleName}
						labelledBy={labelledBy}
						container={container}
						contentMaxWidth={contentMaxWidth}
						contentMaxHeight={contentMaxHeight}
						items={rows}
						loading={loading}
						loadingContent={loadingContent}
						noContent={noContent}
						multiple={multiple}
						testId={testId}
					/>
				</BaseSelect.Root>
			</TooltipProviderIfMissing>
		);
	},
);

/**
 * Renders a field that picks one value, or several, from a short list (Base UI `Select`).
 *
 * The select owns its markup: there are no subcomponents to import and nothing to compose. The
 * trigger is the field, and the popup lists the rows under it. `id`, `aria-*`, `data-*` and the ref
 * land on the trigger. For a list that needs a search, use `Combobox`, which takes the same rows.
 *
 * Visual values are `--select-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Accessibility
 *
 * The trigger is `role="combobox"` with `aria-haspopup="listbox"`, and the list is
 * `role="listbox"`. The focus moves to the selected row, or the first one, on open.
 *
 * The trigger is named by `aria-label` or `aria-labelledby`, and by `placeholder` when neither is
 * given. A placeholder is not a label: pass one of the two.
 *
 * ### Values
 *
 * `value` is the `value` of an `item` row, a `string`, or a `string[]` with `multiple`. Writing
 * `value` makes the select controlled, even with `undefined`. `onChange` reports a `string`, or a
 * `string[]` with `multiple`, `[]` once every chip is removed. A single select has no way to clear
 * its value.
 *
 * A single trigger shows the selected row's `prefix`, then its `displayValue` when it has one, its
 * label otherwise. A multiple select shows chips, and `maxDisplayedPills` collapses the rest into a
 * `+N` chip with a tooltip. A selected value `items` does not have shows as itself.
 *
 * The `displayValue` prop replaces all of that: it gets the selected row, or the selected rows with
 * `multiple`, and returns what the trigger shows.
 *
 * ### Keyboard
 *
 * `Enter`, `Space` and the arrow keys on the trigger open the popup. The arrow keys move the
 * highlight and stop at the ends, `Home` and `End` jump to them, and typing a letter moves to the
 * next row that starts with it. `Enter` and `Space` pick the highlighted row. A single select
 * closes on a pick, a multiple one stays open. `Esc` closes and returns the focus to the trigger.
 *
 * Typing a letter on a closed single trigger picks the next row that starts with it, as a native
 * `<select>` does.
 *
 * ### Disabled, read-only, invalid and loading
 *
 * `disabled` and `readOnly` keep the popup closed, block typing on the trigger and hide the chip
 * remove buttons. The trigger carries `aria-disabled` or `aria-readonly`, never the native
 * `disabled`, so it stays focusable and its tooltip reachable. `disabled` outranks `readOnly`:
 * only `disabledTooltip` shows.
 *
 * `aria-invalid` reaches the trigger like any other `aria-*` prop and paints its border in the
 * destructive colour, hovered or not. It changes nothing else.
 *
 * `loading` swaps the trigger's chevron for a spinner and the rows for `loadingContent`. It blocks
 * nothing: the popup still opens.
 *
 * ### Truncation
 *
 * Row labels and the trigger text end in an ellipsis when they do not fit, and the full text shows
 * in a tooltip only while they are truncated. A disabled row's reason comes first in the same
 * tooltip.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the trigger, and it names everything else: a row is
 * `` `${testId}-item-${value}` ``, a group `` `${testId}-group-${value}` ``, a chip
 * `` `${testId}-chip-${value}` `` and its button `` `${testId}-chip-${value}-remove` ``. The single
 * parts are `` `${testId}-chip-overflow` ``, `-loading` and `-empty`. A row's own `testId` wins.
 * Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"select"` |
 * | `data-multiple`, `data-disabled`, `data-readonly`, `data-loading` | present while the prop is true |
 * | `data-popup-open` | present while the popup is open |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `select-trigger` | always, the field. `data-popup-open`, `data-disabled` and `data-readonly` as they apply |
 * | `select-value`, `select-placeholder` | inside the trigger, one of the two, unless a multiple trigger shows chips |
 * | `select-value-prefix` | inside a single trigger, when the selected row has a `prefix` and there is no `displayValue` prop |
 * | `select-chips`, `select-chip`, `select-chip-remove`, `select-chip-overflow` | inside a multiple trigger with values and no `displayValue` prop |
 * | `select-icon`, `select-spinner` | the trailing glyph of the trigger, the spinner while `loading` |
 * | `select-positioner`, `select-popup` | while the popup is open |
 * | `select-list` | the listbox, the part that scrolls |
 * | `select-item` | one per row, `data-highlighted`, `data-selected`, `data-disabled` |
 * | `select-item-prefix`, `select-item-label`, `select-item-suffix`, `select-item-indicator` | the parts of a row |
 * | `select-group`, `select-group-label`, `select-separator` | one per group and separator |
 * | `select-loading`, `select-empty` | while loading, and when `items` is empty |
 *
 * @example
 * ```tsx
 * <Select
 *   aria-label="Framework"
 *   placeholder="Select a framework..."
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
 * // Several values, in groups
 * <Select
 *   multiple
 *   aria-label="Technologies"
 *   placeholder="Select technologies..."
 *   items={[
 *     { type: 'group', value: 'frameworks', label: 'Frameworks', items: frameworkItems },
 *     { type: 'separator', value: 'after-frameworks' },
 *     { type: 'group', value: 'languages', label: 'Languages', items: languageItems },
 *   ]}
 *   value={technologies}
 *   onChange={setTechnologies}
 *   maxDisplayedPills={2}
 * />
 * ```
 */
export const Select = SelectImpl as <T extends SelectProps>(
	props: T &
		ValidateSelectProps<T> &
		// `T` is inferred from the call site, so `T extends SelectProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof SelectProps | keyof RefAttributes<HTMLElement>>, never> &
		RefAttributes<HTMLElement>,
) => ReactElement;
