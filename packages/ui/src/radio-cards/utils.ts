import {
	type AriaAttributes,
	type CSSProperties,
	type KeyboardEvent,
	type ReactNode,
	useEffect,
	useMemo,
} from 'react';
import { useFieldContext } from '../lib/field-context.js';
import { resolveGroupReason } from '../lib/group-reason.js';
import { uniqueByValue } from '../lib/unique-by-value.js';
import { useFirstRenderControl } from '../lib/use-first-render-control.js';
import styles from './radio-cards.module.scss';
import type { RadioCardsItemType, RadioCardsTextOverflowType } from './types.js';

/**
 * @access private
 */
export type UseRadioCardsGroupOptions = {
	component: string;
	items: readonly RadioCardsItemType[];
	columns: number | undefined;
	textOverflow: RadioCardsTextOverflowType;
	disabled: boolean | undefined;
	disabledTooltip: ReactNode;
	readOnly: boolean | undefined;
	readOnlyTooltip: ReactNode;
	testId: string | undefined;
};

// Base UI runs none of a disabled card's key handlers, so `Space` on the one tab stop of a
// disabled group would scroll the page. An enabled card prevents it itself.
function preventSpaceScroll(event: KeyboardEvent<HTMLElement>): void {
	if (event.key === ' ') {
		event.preventDefault();
	}
}

/**
 * @access private
 */
export const NO_VALUES: readonly string[] = [];

/**
 * Only a card that submits counts as checked: a value that matches no item, or a disabled card,
 * puts nothing in the form and shows no check the user can take back.
 *
 * @access private
 */
export function hasCheckedCard(
	items: readonly RadioCardsItemType[],
	values: readonly string[],
): boolean {
	return items.some((item) => item.disabled !== true && values.includes(item.value));
}

/**
 * What `RadioCards` and `RadioCards.Multiple` decide the same way: the cards to render, which of
 * `disabled` and `readOnly` holds, the reason the group shows, and the props of the root that do
 * not depend on the Base UI primitive under it.
 *
 * @access private
 */
export function useRadioCardsGroup({
	component,
	items,
	columns,
	textOverflow,
	disabled,
	disabledTooltip,
	readOnly,
	readOnlyTooltip,
	testId,
}: UseRadioCardsGroupOptions) {
	const { isReadOnly, isDisabled, reason, hasReasonAnchor } = resolveGroupReason({
		disabled,
		disabledTooltip,
		readOnly,
		readOnlyTooltip,
	});

	// Two cards with one `value` would share a key, a test id and a checked state. The first one
	// renders, as on `Resizable`.
	const uniqueItems = useMemo(() => uniqueByValue(items), [items]);

	const isEmpty = items.length === 0;
	const hasDuplicateValue = uniqueItems.length < items.length;

	useEffect(() => {
		if (isEmpty) {
			console.warn(`${component}: \`items\` is empty, rendering no card.`);
		}
	}, [component, isEmpty]);

	useEffect(() => {
		if (hasDuplicateValue) {
			console.warn(`${component}: two items share a \`value\`, so only the first of them renders.`);
		}
	}, [component, hasDuplicateValue]);

	// The grid divides the row by `columns`, so anything but a whole number from 1 up lays the cards
	// out as some other count would. Such a value is dropped, as if it was never passed.
	const isColumnsValid = columns === undefined || (Number.isInteger(columns) && columns >= 1);
	const resolvedColumns = isColumnsValid ? columns : undefined;

	useEffect(() => {
		if (!isColumnsValid) {
			console.warn(
				`${component}: \`columns\` is ${columns}, not a whole number from 1 up. Ignoring it.`,
			);
		}
	}, [component, isColumnsValid, columns]);

	const style = useMemo(
		() =>
			(resolvedColumns === undefined
				? undefined
				: { '--radio-cards-internal-columns': resolvedColumns }) as CSSProperties | undefined,
		[resolvedColumns],
	);

	return {
		items: uniqueItems,
		isReadOnly,
		isDisabled,
		tooltipContent: reason,
		hasTooltip: hasReasonAnchor,
		rootProps: {
			'data-columns': resolvedColumns,
			'data-text-overflow': textOverflow,
			className: styles['radio-cards'],
			style,
			onKeyDown: preventSpaceScroll,
			...(testId === undefined ? {} : { 'data-testid': testId }),
		},
	};
}

/**
 * What a `Field.Group` around the cards hands down, as defaults the cards' own props win over: the
 * legend as the name of the group while it has none of its own, `aria-required`, and
 * `aria-invalid` for a `danger` status.
 *
 * `required` is the cards' own prop alone, and it is the one that reaches Base UI as the native
 * `required`. The field's `required` comes back as `isFieldRequired` instead, for the cards to
 * announce with `aria-required` and nothing native: the form's own validation owns the rule, and a
 * native `required` would stop the browser's submit before it runs.
 *
 * Base UI names a radio group with the legend of its fieldset on its own, and that name outranks an
 * `aria-label`, so a group with an `aria-label` and no `aria-labelledby` erases it.
 *
 * The two attribute sets are spread before the cards' own props, and each is `undefined` rather
 * than holding an `undefined` value, which would erase what Base UI sets on the same attribute.
 * `aria-invalid` is not allowed on `role="group"`, so `RadioCards.Multiple` leaves it out.
 *
 * @access private
 */
export function useRadioCardsField(
	props: Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'>,
	required: boolean | undefined,
) {
	const field = useFieldContext();
	const hasOwnLabelledBy = props['aria-labelledby'] !== undefined;
	const hasOwnLabel = props['aria-label'] !== undefined;

	let nameProps: { 'aria-labelledby': string | undefined } | undefined;

	if (field !== null && !hasOwnLabelledBy) {
		if (hasOwnLabel) {
			nameProps = { 'aria-labelledby': undefined };
		} else if (field.kind === 'group') {
			nameProps = { 'aria-labelledby': field.labelId };
		}
	}

	return {
		required: required ?? false,
		isFieldRequired: required === undefined && field?.required === true,
		nameProps,
		invalidProps: field?.status === 'danger' ? { 'aria-invalid': true } : undefined,
	};
}

/**
 * The value of a group, controlled or kept by the group itself, decided on the first render with
 * the rules of `useFirstRenderControl`. The group always hands Base UI a value, so Base UI never
 * sees the switch, and the warnings speak of cards.
 *
 * @access private
 */
export function useRadioCardsValue<T>({
	component,
	value,
	defaultValue,
	empty,
}: {
	component: string;
	value: T | undefined;
	defaultValue: T | undefined;
	/**
	 * The value with no card checked: what a controlled group shows once `value` turns `undefined`.
	 */
	empty: T;
}): [T, (next: T) => void] {
	return useFirstRenderControl({
		value,
		defaultValue,
		empty,
		turnedUndefinedWarning: `${component}: \`value\` turned \`undefined\`, but it was set on the first render, so the group stays controlled and shows no card checked. Write ${JSON.stringify(empty)} to clear it.`,
		appearedWarning: `${component}: \`value\` was \`undefined\` on the first render, so the group keeps its own state and ignores \`value\`. A controlled group that starts with nothing checked passes ${JSON.stringify(empty)}.`,
	});
}
