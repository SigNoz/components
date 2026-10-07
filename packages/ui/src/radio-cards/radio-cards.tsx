import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipAnchor } from '../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { TooltipTriggerBoundary } from '../tooltip/tooltip-trigger-context.js';
import { RadioCardsTextOverflow } from './constants.js';
import { RadioCardsItem } from './subcomponents/radio-cards-item.js';
import { RadioCardsMultiple } from './subcomponents/radio-cards-multiple.js';
import type { RadioCardsMultipleProps, RadioCardsProps, ValidateRadioCardsProps } from './types.js';
import { hasCheckedCard, NO_VALUES, useRadioCardsGroup, useRadioCardsValue } from './utils.js';

const RadioCardsRoot = forwardRef<HTMLDivElement, RadioCardsProps>(function RadioCards(
	{
		items,
		columns,
		textOverflow = RadioCardsTextOverflow.Ellipsis,
		disabled = false,
		disabledTooltip,
		readOnly = false,
		readOnlyTooltip,
		required = false,
		name,
		form,
		value,
		defaultValue,
		onChange,
		allowClear = false,
		testId,
		className: _className,
		style: _style,
		...props
	}: RadioCardsProps & RejectedProps,
	ref,
) {
	const {
		items: cards,
		isReadOnly,
		isDisabled,
		tooltipContent,
		hasTooltip,
		rootProps,
	} = useRadioCardsGroup({
		component: 'RadioCards',
		items,
		columns,
		textOverflow,
		disabled,
		disabledTooltip,
		readOnly,
		readOnlyTooltip,
		testId,
	});

	// The group keeps the value itself, even uncontrolled, since Base UI has no way to uncheck a
	// radio: `allowClear` writes `null` here.
	const [selectedValue, setSelectedValue] = useRadioCardsValue<string | null>({
		component: 'RadioCards',
		value,
		defaultValue,
		empty: null,
	});

	function onValueChange(next: string | null): void {
		setSelectedValue(next);

		// Only `allowClear` reaches this with `null`, and its `onChange` takes it.
		(onChange as ((value: string | null) => void) | undefined)?.(next);
	}

	function clear(): void {
		onValueChange(null);
	}

	// Base UI drops a click on a disabled card or group before it reaches `onUncheck`, but runs it
	// on a read-only one.
	const canClear = allowClear && !isReadOnly;

	const isEmpty = !hasCheckedCard(cards, selectedValue === null ? NO_VALUES : [selectedValue]);

	const groupEl = (
		<RadioGroupPrimitive<string | null>
			ref={ref}
			data-slot="radio-cards"
			disabled={isDisabled}
			readOnly={isReadOnly}
			// Base UI puts `required` on every hidden radio, and a radio with no `name` is a group of
			// its own, so a required one left unchecked would block the form after another card is
			// checked. It stays only while the group is empty, as on `RadioCards.Multiple`.
			required={required && isEmpty}
			name={name}
			form={form}
			value={selectedValue}
			onValueChange={onValueChange}
			{...props}
			{...rootProps}
		>
			{/* One provider for every card, and each card opens its own tooltip, not one stacked into
			    the group's. */}
			<TooltipProviderIfMissing>
				<TooltipTriggerBoundary>
					{cards.map((item) => (
						<RadioCardsItem
							key={item.value}
							item={item}
							textOverflow={textOverflow}
							tooltipsSuppressed={tooltipContent !== null}
							groupTestId={testId}
							onUncheck={canClear && item.value === selectedValue ? clear : undefined}
						/>
					))}
				</TooltipTriggerBoundary>
			</TooltipProviderIfMissing>
		</RadioGroupPrimitive>
	);

	if (!hasTooltip) {
		return groupEl;
	}

	return <TooltipAnchor content={tooltipContent}>{groupEl}</TooltipAnchor>;
});

/**
 * Renders a group of cards where one can be checked (Base UI `RadioGroup` and `Radio`). For
 * several, use `RadioCards.Multiple`.
 *
 * Every `aria-*` and any `data-*` are forwarded to the root. `className` and `style` are not props,
 * and a value that gets past the types is dropped.
 *
 * Visual values are `--radio-cards-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The root is the `role="radiogroup"`, and each card is a `role="radio"` named by its label. The
 * group needs a name, the question its cards answer: `aria-labelledby` with the id of the visible
 * question above it, or `aria-label` when there is none. Leaving both out is a type error.
 *
 * ### Keyboard
 *
 * The group is one tab stop, on the checked card, or on the first card that is not disabled. The
 * arrow keys move the focus to the next or the previous card and check it, wrapping at the ends.
 * They follow the order of `items`, not the grid, whatever `columns` is, and they skip a disabled
 * card. `Space` checks the focused card. `Enter`, `Home` and `End` do nothing.
 *
 * ### Clearing
 *
 * With `allowClear`, the types ask for an `onChange` that takes `null`.
 *
 * ### Layout
 *
 * The cards fill the width of the parent in a grid. The group does not scroll, the parent owns the
 * scroll.
 *
 * ### In a form
 *
 * Each card renders a hidden radio input with `name` and `form`, so the group submits the checked
 * `value` like a native radio group.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root, and survives the tooltip trigger cloning it. It also names
 * every card: a card with no `testId` of its own is `` `${testId}-item-${value}` ``, and its icon
 * is `` `${testId}-item-${value}-prefix` ``. A card's own `testId` wins, and names its icon the
 * same way. Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"radio-cards"` |
 * | `data-columns` | mirrors `columns`, absent without it |
 * | `data-text-overflow` | `ellipsis` (default) or `wrap` |
 * | `data-disabled` | present while the group is disabled |
 * | `data-readonly` | present while the group is read-only |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `radio-cards-item` | one per item, the card itself, `role="radio"`, with `data-checked` or `data-unchecked`, and `data-disabled` |
 * | `radio-cards-item-prefix` | only when the item has a `prefix` |
 * | `radio-cards-item-label` | always, `data-truncated` while it does not fit, `data-empty-label` while it is the fallback |
 * | `radio-cards-item-indicator` | the check, on every card, with `data-checked` or `data-unchecked` |
 *
 * @example
 * ```tsx
 * <Typography.Text id="migration-question">When do you plan to migrate?</Typography.Text>
 * <RadioCards
 *   aria-labelledby="migration-question"
 *   columns={2}
 *   name="migrationTimeline"
 *   value={timeline}
 *   onChange={setTimeline}
 *   items={[
 *     { label: 'This month', value: 'month' },
 *     { label: 'This quarter', value: 'quarter' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Icons before the label, and a card that cannot be picked
 * <RadioCards
 *   aria-label="Panel type"
 *   columns={2}
 *   defaultValue="graph"
 *   items={[
 *     { label: 'Time series', value: 'graph', prefix: <ChartLine /> },
 *     { label: 'Table', value: 'table', prefix: <Table />, disabled: true, disabledTooltip: 'Needs a query' },
 *   ]}
 * />
 * ```
 */
export const RadioCards = Object.assign(RadioCardsRoot, { Multiple: RadioCardsMultiple }) as (<
	T extends RadioCardsProps,
>(
	props: T &
		ValidateRadioCardsProps<T> &
		// `T` is inferred from the call site, so `T extends RadioCardsProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof RadioCardsProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement) & {
	Multiple: <T extends RadioCardsMultipleProps>(
		props: T &
			ValidateRadioCardsProps<T> &
			Record<
				Exclude<keyof T, keyof RadioCardsMultipleProps | keyof RefAttributes<HTMLDivElement>>,
				never
			> &
			RefAttributes<HTMLDivElement>,
	) => ReactElement;
};
