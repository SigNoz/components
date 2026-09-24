import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import {
	type CSSProperties,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useMemo,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { useOverflowScroll } from '../lib/use-overflow-scroll.js';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { ToggleGroupScrollDirection, ToggleGroupType } from './constants.js';
import { ToggleGroupButton } from './subcomponents/toggle-group-button.js';
import { ToggleGroupScrollButton } from './subcomponents/toggle-group-scroll-button.js';
import styles from './toggle-group.module.scss';
import type { ToggleGroupProps, ValidateToggleGroupProps } from './types.js';

/**
 * Base UI holds the pressed state as an array whatever the selection mode is, so a `single` bar's
 * string goes in as a one entry array and the empty string as none at all.
 *
 * @access private
 */
function toGroupValue(value: string | string[] | undefined): string[] | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (Array.isArray(value)) {
		return value;
	}

	return value === '' ? [] : [value];
}

const ToggleGroupImpl = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
	{
		items,
		type,
		variant,
		color,
		size,
		value,
		defaultValue,
		onChange,
		disabled = false,
		disabledTooltip,
		readOnly = false,
		readOnlyTooltip,
		allowClear = false,
		testId,
		width,
		maxWidth,
		className: _className,
		style: _style,
		...props
	}: ToggleGroupProps & RejectedProps,
	ref,
) {
	const isMultiple = type === ToggleGroupType.Multiple;

	// `readOnly` outranks `disabled`: while the value is locked the bar is not disabled at all, and
	// the lock owns the reason. Nothing downstream sees the `disabled` the call site wrote.
	const isReadOnly = readOnly === true;
	const isDisabled = isReadOnly ? false : disabled;

	const groupValue = useMemo(() => toGroupValue(value), [value]);
	const groupDefaultValue = useMemo(() => toGroupValue(defaultValue), [defaultValue]);

	const onValueChange = useMemo(
		() =>
			(next: string[], eventDetails: ToggleGroupPrimitive.ChangeEventDetails): void => {
				// Base UI reads `isCanceled` after this call, so vetoing here holds the group where
				// it was rather than reporting a move we then have to undo.
				if (!allowClear && next.length === 0) {
					eventDetails.cancel();
					return;
				}

				if (onChange === undefined) {
					return;
				}

				if (isMultiple) {
					(onChange as (next: string[]) => void)(next);
					return;
				}

				// Only `allowClear` reaches this with nothing pressed, and the empty string is what
				// a `single` bar calls that.
				(onChange as (next: string) => void)(next[0] ?? '');
			},
		[onChange, isMultiple, allowClear],
	);

	const {
		viewportRef,
		isOverflowing,
		canScrollToStart,
		canScrollToEnd,
		scrollTowardsStart,
		scrollTowardsEnd,
	} = useOverflowScroll({
		activeKey: (groupValue ?? groupDefaultValue)?.[0],
		activeItemSelector: '[data-slot="toggle-group-button"][data-pressed]',
	});

	const toggleGroupStyle = {
		...(width != null && { '--toggle-group-internal-inline-size': toCssLength(width) }),
		...(maxWidth != null && {
			'--toggle-group-internal-max-inline-size': toCssLength(maxWidth),
		}),
	} as CSSProperties;

	return (
		<div
			ref={ref}
			data-slot="toggle-group"
			data-variant={variant}
			data-color={color}
			data-size={size}
			data-disabled={isDisabled || undefined}
			data-readonly={isReadOnly || undefined}
			className={styles['toggle-group']}
			style={toggleGroupStyle}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<TooltipProviderIfMissing>
				{isOverflowing && (
					<ToggleGroupScrollButton
						direction={ToggleGroupScrollDirection.Start}
						disabled={!canScrollToStart}
						onScroll={scrollTowardsStart}
						groupTestId={testId}
					/>
				)}

				<div
					ref={viewportRef}
					data-slot="toggle-group-viewport"
					className={styles['toggle-group__viewport']}
				>
					<ToggleGroupPrimitive
						data-slot="toggle-group-list"
						className={styles['toggle-group__list']}
						value={groupValue}
						defaultValue={groupDefaultValue}
						onValueChange={onValueChange}
						multiple={isMultiple}
					>
						{items.map((item) => (
							<ToggleGroupButton
								key={item.value}
								item={item}
								groupTestId={testId}
								groupDisabled={isDisabled}
								groupDisabledTooltip={disabledTooltip}
								groupReadOnly={isReadOnly}
								groupReadOnlyTooltip={readOnlyTooltip}
							/>
						))}
					</ToggleGroupPrimitive>
				</div>

				{isOverflowing && (
					<ToggleGroupScrollButton
						direction={ToggleGroupScrollDirection.End}
						disabled={!canScrollToEnd}
						onScroll={scrollTowardsEnd}
						groupTestId={testId}
					/>
				)}
			</TooltipProviderIfMissing>
		</div>
	);
});

/**
 * Renders a segmented button bar from `items` (Base UI `ToggleGroup`).
 *
 * The bar owns its markup: there is no `ToggleGroupItem` to import. Every `aria-*` and any `data-*`
 * are forwarded to the root.
 *
 * Visual values are `--toggle-group-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Items
 *
 * Each item is `{ value, label }`, plus optional `prefix`, `suffix`, `testId` and the `disabled`
 * pair.
 *
 * `value` is what `value`/`defaultValue`/`onChange` carry, and it is unique within the bar: two
 * items sharing one are indistinguishable to the component.
 *
 * `label` is the button's text and its accessible name. An icon beside it goes in `prefix` or
 * `suffix`, which sit outside the truncation cap and so keep their size while the text truncates.
 *
 * A label that renders nothing falls back to the text `<No label>`, marks its label element with
 * `data-empty-label` and logs an error. The button is never dropped: an option that disappears
 * leaves the group without saying so.
 *
 * Five options is where the design spec stops. Past that the pattern degrades, and the content
 * wants a dropdown.
 *
 * ### Selection
 *
 * `type="single"` presses one button at a time and reports a string. `type="multiple"` presses any
 * number of them and reports an array.
 *
 * Once something is pressed the bar keeps reporting a value: the press that would leave it empty is
 * cancelled, so `onChange` is not called.
 *
 * `allowClear` hands that press back. A `single` bar then reports the empty string, which is also
 * what `value=""` means, and a `multiple` bar reports the empty array.
 *
 * A bar that starts with nothing pressed stays that way until the first press either way.
 *
 * Pressed is the filled state, and hovering an unpressed button paints half that fill, so the hover
 * previews the press.
 *
 * ### Disabled and read-only
 *
 * `disabled` turns the whole bar off, `readOnly` locks the value it is reporting, and an item's own
 * `disabled` blocks that button alone. All three require their reason.
 *
 * No button ever carries the native `disabled` attribute on any of those paths. It carries
 * `aria-disabled` and a cancelled press instead, so it stays hoverable and focusable and its reason
 * stays reachable, the same trade `Button` makes.
 *
 * `data-disabled` on a button is the item's own: it says this option is blocked inside a bar that
 * is otherwise live.
 *
 * `readOnly` outranks `disabled`: while it is set the bar is not disabled at all, `readOnlyTooltip`
 * is the reason shown, and `disabledTooltip` and every item's own reason are suppressed for that
 * whole time. A locked bar has one reason, not one per button.
 *
 * A locked button carries `data-readonly`. `aria-readonly` is not allowed on `role="button"`,
 * unlike the `radiogroup` a `RadioGroup` root is, so `aria-disabled` is what says the press will
 * not land.
 *
 * The paint differs from disabled: the bar fades to 0.8 rather than 0.6 and keeps its label
 * colours, so the pressed option still reads.
 *
 * ### Keyboard
 *
 * The bar is one tab stop. Arrow keys move focus between the buttons and loop at either end, and
 * `Enter` or `Space` presses the focused one.
 *
 * Arrow keys stop moving while the bar is off or locked, because Base UI's composite skips every
 * inert option and on those two paths they all are. The roving tab stop stays, and the reason is
 * the bar's own, identical on every button, so one tab stop reaches it.
 *
 * An overflowing bar adds its two arrows as tab stops of their own.
 *
 * ### Truncation
 *
 * A label is capped at 120px (`--toggle-group-label-max-inline-size`). Past it the label truncates
 * and carries `data-truncated`.
 *
 * The visible text is only clipped, so the accessible name is already the full label.
 *
 * ### Its tooltips
 *
 * Three of them, and the first two are exclusive: the bar's reason (`readOnlyTooltip` while locked,
 * `disabledTooltip` while off), the item's own reason, and the full text of a truncated label.
 *
 * When more than one applies, one popup holds them all, most general first, split by a
 * `tooltip-divider`.
 *
 * The trigger is always mounted, so the button never remounts when a tooltip appears. The tooltip
 * root and popup mount only while there is something to show.
 *
 * ### Overflow
 *
 * A bar narrower than its buttons scrolls, and an arrow appears at each end. A press moves the
 * strip 0.8 of the viewport, so the option it stops on is the one that was at the edge.
 *
 * Each arrow is a named `<button>` (`Scroll options left`, `Scroll options right`), natively
 * disabled while the strip cannot travel that way.
 *
 * The buttons never shrink: a segmented control that squeezes its options is unreadable.
 *
 * Changing the pressed value scrolls that button back into view.
 *
 * ### Width
 *
 * `width` and `maxWidth` are written as inline `--toggle-group-internal-inline-size` and
 * `--toggle-group-internal-max-inline-size`.
 *
 * So they compose with the tokens. Numbers are written as `px`.
 *
 * They size the bar, never one button: a button holds its own size and the bar scrolls instead.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root, and it names every button: an item with no `testId` of its
 * own is `` `${testId}-button-${value}` ``, and the arrows are `` `${testId}-scroll-start` `` and
 * `` `${testId}-scroll-end` ``. Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"toggle-group"` |
 * | `data-variant`, `data-color`, `data-size` | mirrors the prop |
 * | `data-disabled` | present only while the whole bar is disabled |
 * | `data-readonly` | present only while the bar's value is locked |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `toggle-group-viewport` | always, the box the strip scrolls inside |
 * | `toggle-group-list` | always, the Base UI group itself, `data-multiple` while `type="multiple"` |
 * | `toggle-group-button` | one per item, `data-pressed` while pressed, `data-disabled` while it alone is disabled, `data-readonly` while the bar is locked, `aria-disabled` on any of those paths |
 * | `toggle-group-prefix`, `toggle-group-suffix` | only when the item carries one |
 * | `toggle-group-label` | the measured element, `data-truncated` while it does not fit, `data-empty-label` while it is the fallback |
 * | `toggle-group-scroll-button` | only while the strip overflows, `data-direction` says which end |
 *
 * @example
 * ```tsx
 * <ToggleGroup
 *   type="single"
 *   variant="outlined"
 *   color="secondary"
 *   size="sm"
 *   defaultValue="list"
 *   items={[
 *     { value: 'list', label: 'List' },
 *     { value: 'grid', label: 'Grid' },
 *   ]}
 *   onChange={setLayout}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Multiple: the callback carries every pressed value
 * <ToggleGroup
 *   type="multiple"
 *   variant="outlined"
 *   color="secondary"
 *   size="md"
 *   value={severities}
 *   onChange={setSeverities}
 *   items={[
 *     { value: 'warning', label: 'Warning' },
 *     { value: 'error', label: 'Error' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled, and locked while the form is in flight
 * <ToggleGroup
 *   type="single"
 *   variant="outlined"
 *   color="secondary"
 *   size="sm"
 *   value={layout}
 *   onChange={setLayout}
 *   readOnly={isSaving}
 *   readOnlyTooltip="Saving your changes"
 *   items={layouts}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // One option blocked, with the reason, and an icon beside a label
 * <ToggleGroup
 *   type="single"
 *   variant="outlined"
 *   color="secondary"
 *   size="sm"
 *   maxWidth="20rem"
 *   defaultValue="logs"
 *   testId="signal-picker"
 *   items={[
 *     { value: 'logs', label: 'Logs', prefix: <FileText /> },
 *     { value: 'traces', label: 'Traces' },
 *     { value: 'profiles', label: 'Profiles', disabled: true, disabledTooltip: 'Profiling is not enabled for this workspace' },
 *   ]}
 * />
 * ```
 */
export const ToggleGroup = ToggleGroupImpl as <T extends ToggleGroupProps>(
	props: T &
		ValidateToggleGroupProps<T> &
		// `T` is inferred from the call site, so `T extends ToggleGroupProps` alone never runs
		// excess property checks. Every key outside the props (a typo, a prop the bar dropped on
		// purpose) is pinned to `never` instead.
		Record<Exclude<keyof T, keyof ToggleGroupProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
