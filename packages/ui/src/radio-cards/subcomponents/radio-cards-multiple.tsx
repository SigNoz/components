import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { forwardRef } from 'react';
import { onFocusLeave } from '../../lib/focus-leave.js';
import type { RejectedProps } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipProviderIfMissing } from '../../tooltip/subcomponents/tooltip-provider.js';
import { TooltipTriggerBoundary } from '../../tooltip/tooltip-trigger-context.js';
import { RadioCardsTextOverflow } from '../constants.js';
import type { RadioCardsItemType, RadioCardsMultipleProps } from '../types.js';
import {
	hasCheckedCard,
	NO_VALUES,
	useRadioCardsField,
	useRadioCardsGroup,
	useRadioCardsValue,
} from '../utils.js';
import { RadioCardsItem } from './radio-cards-item.js';

// Base UI appends a checked value to the end of the list, so the list would follow the clicks. It
// follows `items` instead, the order the form submits in. A value that matches no item keeps its
// place after them.
function orderByItems(items: readonly RadioCardsItemType[], values: readonly string[]): string[] {
	const order = new Map(items.map((item, index) => [item.value, index]));

	return [...values].sort(
		(a, b) => (order.get(a) ?? items.length) - (order.get(b) ?? items.length),
	);
}

/**
 * Renders a form field where each option is a card, and picks several options (Base UI
 * `CheckboxGroup` and `Checkbox`). Reached as `RadioCards.Multiple`, not imported on its own.
 *
 * It takes every prop of `RadioCards`. `value`, `defaultValue` and `onChange` hold the list of
 * checked values, and every checked card shows its check. `onChange` reports the list in the order
 * of `items`.
 *
 * The root is a `role="group"`, named with `aria-label` or `aria-labelledby` as on `RadioCards`,
 * and each card is a `role="checkbox"`. The root carries `aria-disabled` while the group is
 * disabled. A `group` takes neither `aria-readonly` nor `aria-required`, so the cards carry them:
 * `aria-readonly` while the group is read-only, `aria-required` while it is required and no card
 * is checked. A `Field.Group` that is `required` sets `aria-required` alone, with no native
 * `required`, so the form's own validation runs before the browser's. The group's own `required`
 * keeps the native one.
 *
 * ### Keyboard
 *
 * Each card is its own tab stop, in the order of `items`, and a disabled card is not one. `Space`
 * checks or unchecks the focused card. The arrows, `Enter`, `Home` and `End` do nothing. While the
 * group is disabled, its first card stays the one tab stop, so `disabledTooltip` stays reachable.
 *
 * ### In a form
 *
 * Each card renders a hidden checkbox input with `name` and `form`, so the group submits one `name`
 * entry per checked card, like a native checkbox list.
 *
 * ### Asserting on it
 *
 * The same as `RadioCards`. The root also has `data-multiple`, and a card has `role="checkbox"`.
 *
 * @example
 * ```tsx
 * <RadioCards.Multiple
 *   aria-labelledby="tools-question"
 *   columns={2}
 *   name="observabilityTools"
 *   value={tools}
 *   onChange={setTools}
 *   items={[
 *     { label: 'Datadog', value: 'datadog' },
 *     { label: 'Grafana / Prometheus', value: 'grafana' },
 *   ]}
 * />
 * ```
 */
export const RadioCardsMultiple = forwardRef<HTMLDivElement, RadioCardsMultipleProps>(
	function RadioCardsMultiple(
		{
			items,
			columns,
			textOverflow = RadioCardsTextOverflow.Ellipsis,
			disabled = false,
			disabledTooltip,
			readOnly = false,
			readOnlyTooltip,
			required: requiredProp,
			name,
			form,
			value,
			defaultValue,
			onChange,
			onBlur,
			allowClear = false,
			nullable: _nullable,
			testId,
			className: _className,
			style: _style,
			...props
		}: RadioCardsMultipleProps & RejectedProps,
		ref,
	) {
		const { required, isFieldRequired, nameProps, invalidDataProps, focusTarget } =
			useRadioCardsField(props, requiredProp);
		const {
			items: cards,
			isReadOnly,
			isDisabled,
			tooltipContent,
			hasTooltip,
			rootProps,
		} = useRadioCardsGroup({
			component: 'RadioCards.Multiple',
			items,
			columns,
			textOverflow,
			disabled,
			disabledTooltip,
			readOnly,
			readOnlyTooltip,
			testId,
		});

		// Not `useSelectionValue`: it reads `''` as no value, the rule of a select. A card's value is
		// any string, `''` included, as on `RadioCards`.
		const [selectedValues, setSelectedValues] = useRadioCardsValue<readonly string[]>({
			component: 'RadioCards.Multiple',
			value,
			defaultValue,
			empty: NO_VALUES,
		});

		function onValueChange(
			changed: string[],
			eventDetails: CheckboxGroup.ChangeEventDetails,
		): void {
			const next = orderByItems(cards, changed);

			// Base UI reads `isCanceled` after this call, so the card that would leave the group with
			// no check stays checked.
			if (!allowClear && !hasCheckedCard(cards, next)) {
				eventDetails.cancel();
				return;
			}

			setSelectedValues(next);
			onChange?.(next);
		}

		const isEmpty = !hasCheckedCard(cards, selectedValues);
		// The first checked card, else the first one, as `RadioCards` does with its checked radio. A
		// disabled card is skipped: Base UI moves the focus from a checkbox input to its card, and a
		// disabled input takes none.
		const focusTargetCard =
			cards.find((item) => item.disabled !== true && selectedValues.includes(item.value)) ??
			cards.find((item) => item.disabled !== true);

		const groupEl = (
			<CheckboxGroup
				ref={ref}
				data-slot="radio-cards"
				data-multiple=""
				data-readonly={isReadOnly || undefined}
				aria-disabled={isDisabled || undefined}
				disabled={isDisabled}
				// Base UI types the list as mutable, but never writes to it.
				value={selectedValues as string[]}
				onValueChange={onValueChange}
				onBlur={onFocusLeave(onBlur)}
				{...nameProps}
				{...invalidDataProps}
				{...props}
				{...rootProps}
			>
				{/* One provider for every card, and each card opens its own tooltip, not one stacked
				    into the group's. */}
				<TooltipProviderIfMissing>
					<TooltipTriggerBoundary>
						{cards.map((item, index) => (
							<RadioCardsItem
								key={item.value}
								item={item}
								textOverflow={textOverflow}
								tooltipsSuppressed={tooltipContent !== null}
								groupTestId={testId}
								multiple
								name={name}
								form={form}
								readOnly={isReadOnly}
								required={required && isEmpty}
								ariaRequired={isFieldRequired && isEmpty}
								focusableWhenDisabled={isDisabled && index === 0}
								inputRef={item === focusTargetCard ? focusTarget : undefined}
							/>
						))}
					</TooltipTriggerBoundary>
				</TooltipProviderIfMissing>
			</CheckboxGroup>
		);

		if (!hasTooltip) {
			return groupEl;
		}

		return <TooltipAnchor content={tooltipContent}>{groupEl}</TooltipAnchor>;
	},
);

RadioCardsMultiple.displayName = 'RadioCards.Multiple';
