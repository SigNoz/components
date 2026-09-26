import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { forwardRef, type ReactElement, type RefAttributes, useId, useMemo } from 'react';
import { cn } from '../lib/utils.js';
import { TooltipContent } from '../tooltip/subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../tooltip/subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../tooltip/subcomponents/tooltip-trigger.js';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';
import { useTooltipHandle } from '../tooltip/tooltip-handle.js';
import { RadioGroupTextOverflow } from './constants.js';
import styles from './radio-group.module.scss';
import { RadioGroupItem } from './subcomponents/radio-group-item.js';
import type { RadioGroupProps, ValidateRadioGroupProps } from './types.js';

const RadioGroupImpl = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
	{
		className,
		items,
		color,
		textOverflow = RadioGroupTextOverflow.Ellipsis,
		disabled,
		disabledTooltip,
		readOnly,
		readOnlyTooltip,
		required,
		name,
		value,
		defaultValue,
		onChange,
		testId,
		...props
	},
	ref,
) {
	const tooltipHandle = useTooltipHandle();
	const tooltipContentId = useId();

	const isReadOnly = readOnly === true;

	// Base UI hands the change two arguments, the value and its event details, and types the value
	// as `string | null` because the generic also covers the `value` prop. Only a radio reports a
	// change, and it reports its own `value`, so `null` never arrives here: both the extra argument
	// and the null half of the type stop at this boundary.
	const onValueChange = useMemo(
		() =>
			onChange === undefined
				? undefined
				: (next: string | null): void => {
						if (next === null) {
							return;
						}

						onChange(next);
					},
		[onChange],
	);
	const hasReadOnlyTooltip = isReadOnly && hasTooltipContent(readOnlyTooltip);
	const hasDisabledTooltip = !isReadOnly && Boolean(disabled) && hasTooltipContent(disabledTooltip);

	const tooltipContent = useMemo(() => {
		if (hasReadOnlyTooltip) {
			return readOnlyTooltip;
		}

		return hasDisabledTooltip ? disabledTooltip : null;
	}, [hasReadOnlyTooltip, readOnlyTooltip, hasDisabledTooltip, disabledTooltip]);

	const hasTooltip = disabledTooltip != null || readOnlyTooltip != null;

	const groupEl = (
		<RadioGroupPrimitive<string | null>
			ref={ref}
			data-slot="radio-group"
			data-color={color}
			data-text-overflow={textOverflow}
			className={cn(styles['radio-group'], className)}
			disabled={isReadOnly ? false : disabled}
			readOnly={readOnly}
			required={required}
			name={name}
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{items.map((item) => (
				<RadioGroupItem
					key={item.value}
					item={item}
					textOverflow={textOverflow}
					tooltipsSuppressed={tooltipContent !== null}
					groupTestId={testId}
				/>
			))}
		</RadioGroupPrimitive>
	);

	if (!hasTooltip) {
		return groupEl;
	}

	return (
		<TooltipProviderIfMissing>
			<TooltipTrigger
				handle={tooltipHandle}
				contentId={tooltipContent === null ? undefined : tooltipContentId}
			>
				{groupEl}
			</TooltipTrigger>
			{tooltipContent !== null && (
				<TooltipRoot handle={tooltipHandle}>
					<TooltipContent id={tooltipContentId}>{tooltipContent}</TooltipContent>
				</TooltipRoot>
			)}
		</TooltipProviderIfMissing>
	);
});

/**
 * Renders a group of radio buttons from `items` (Base UI `RadioGroup` and `Radio`).
 *
 * The group owns its markup: there are no children to compose, and no `RadioGroupItem` to import.
 * Every `aria-*` and any `data-*` are forwarded to the root.
 *
 * The root is the `role="radiogroup"`, and `required`, `disabled` and `readOnly` are announced on
 * it as `aria-required`, `aria-disabled` and `aria-readonly`. The group has no accessible name of
 * its own, so give it one with `aria-label` or `aria-labelledby`: the item labels are the answers,
 * and the group label is the question they answer.
 *
 * Visual values are `--radio-group-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Items
 *
 * Each item is `{ label, value }`, plus an optional `testId`. `value` is what `onChange` reports
 * and what the owning form submits, so it is unique within the group.
 *
 * An item can disable itself with `disabled` + `disabledTooltip`, which blocks that row alone.
 *
 * `label` is a node. When it holds something that draws outside its own box, such as an `Input` or
 * a `Button` with a focus ring, the group takes `textOverflow="visible"`.
 *
 * A label that renders nothing (`null`, `false` or an empty string) falls back to the text
 * `<No label>`, and that row carries `data-empty-label`. The row is never dropped: an option that
 * disappears takes an answer out of the group without saying so.
 *
 * ### Disabled and read-only
 *
 * `disabled` blocks the whole group, `readOnly` locks its value. Neither leaves the keyboard: Base
 * UI renders each radio as a `<span role="radio">`, so both are announced through `aria-disabled`
 * and `aria-readonly` while the group keeps its tab stop and stays hoverable. That is what makes
 * the two tooltips reachable.
 *
 * `readOnly` outranks `disabled`: while it is set the group is not disabled at all, and
 * `readOnlyTooltip` is the reason shown. `disabledTooltip` is suppressed for that whole time.
 *
 * Both require their reason (`disabledTooltip`, `readOnlyTooltip`), and both suppress the items'
 * own tooltips while they show: a locked group has one reason, not one per row.
 *
 * ### Row height
 *
 * The dial is centred on the first line of its label, never on the row, and the row reserves one
 * line of label height. A label is a `ReactNode`, so it can hold an `Input` or a `Button`; when it
 * does, the row grows downwards and the dial stays on its line rather than moving under the cursor.
 *
 * ### Truncation
 *
 * `textOverflow="ellipsis"` (the default) measures each label and re-measures on resize. While one
 * does not fit it carries `data-truncated` and shows the full text in a tooltip. `wrap` lets the
 * label take another line, `hidden` clips it, and `visible` clips nothing. None of those three shows
 * a tooltip.
 *
 * `visible` is the mode for a label that holds a control: every other one clips the label, which
 * cuts the control's focus ring.
 *
 * An item's `disabledTooltip` stacks above the truncated label, reason first.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` and survives the tooltip trigger cloning the element. Otherwise use the
 * data attributes, never the hashed class names.
 *
 * The group's `testId` also names every row: an item with no `testId` of its own is addressable as
 * `` `${testId}-item-${value}` ``. An item's own `testId` wins, and with no `testId` on the group
 * an item is only addressable when it names itself.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"radio-group"` |
 * | `data-color` | mirrors the prop |
 * | `data-text-overflow` | `ellipsis` (default), `wrap`, `visible` or `hidden` |
 * | `data-disabled` | present while the group is disabled |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `radio-group-item` | one per item, the `<label>` wrapping the row |
 * | `radio-group-control` | the radio itself, `role="radio"`, carries the item's `testId` |
 * | `radio-group-indicator` | inside the control, only while that item is checked |
 * | `radio-group-label` | the measured element, `data-truncated` while it does not fit, `data-empty-label` while it is the fallback |
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   color="primary"
 *   name="environment"
 *   defaultValue="staging"
 *   onChange={setEnvironment}
 *   items={[
 *     { label: 'Staging', value: 'staging' },
 *     { label: 'Production', value: 'production', disabled: true, disabledTooltip: 'Ask an admin' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled, and locked while the form is in flight
 * <RadioGroup
 *   color="primary"
 *   value={plan}
 *   onChange={setPlan}
 *   readOnly={isSaving}
 *   readOnlyTooltip="Saving your changes"
 *   items={plans}
 * />
 * ```
 */
export const RadioGroup = RadioGroupImpl as <T extends RadioGroupProps>(
	props: T &
		ValidateRadioGroupProps<T> &
		// `T` is inferred from the call site, so `T extends RadioGroupProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof RadioGroupProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
