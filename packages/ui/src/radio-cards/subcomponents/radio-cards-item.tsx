import { Checkbox } from '@base-ui/react/checkbox';
import { Radio } from '@base-ui/react/radio';
import { Check } from '@signozhq/icons';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { useGroupItem } from '../../lib/use-group-item.js';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { RADIO_CARDS_EMPTY_LABEL, RadioCardsTextOverflow } from '../constants.js';
import styles from '../radio-cards.module.scss';
import type { RadioCardsItemType, RadioCardsTextOverflowType } from '../types.js';

/**
 * Every prop is a value or a stable callback, so a card the group renders again with the same
 * props keeps what the React Compiler cached for it.
 *
 * @access private
 */
export type RadioCardsItemProps = {
	/**
	 * The one entry of the group's `items` this card renders.
	 */
	item: RadioCardsItemType;
	/**
	 * The group's `textOverflow`, which decides whether this label is measured.
	 */
	textOverflow: RadioCardsTextOverflowType;
	/**
	 * Set while the group itself is explaining why it cannot be used. The group's reason owns the
	 * popup, so the card does not put a competing one in it.
	 */
	tooltipsSuppressed: boolean;
	/**
	 * The group's own `testId`, used to name this card when the item does not name itself.
	 */
	groupTestId: string | undefined;
} & (RadioCardsItemRadioProps | RadioCardsItemCheckboxProps);

// Each mode pins the props of the other to `never`, so a prop passed to the wrong mode is a type
// error, not a prop the card ignores.
type RadioCardsItemRadioProps = {
	multiple?: false;
	/**
	 * Set on the checked radio of a `RadioCards` with `allowClear`, while it can be unchecked. A
	 * click or `Space` on the card calls it, where Base UI would leave the radio checked.
	 */
	onUncheck?: () => void;
	name?: never;
	form?: never;
	readOnly?: never;
	required?: never;
	focusableWhenDisabled?: never;
};

type RadioCardsItemCheckboxProps = {
	/**
	 * Renders the card as a checkbox of `RadioCards.Multiple`, which takes the props below from its
	 * group: Base UI's `CheckboxGroup` does not pass them down on its own.
	 */
	multiple: true;
	onUncheck?: never;
	name?: string;
	form?: string;
	readOnly?: boolean;
	/**
	 * Set on every card while the group is required and empty, so the form blocks the submit until
	 * one card is checked, and each card announces `aria-required` until then.
	 */
	required?: boolean;
	/**
	 * Keeps this card a tab stop while the group is disabled, so `disabledTooltip` stays reachable.
	 * Set on the first card only: a disabled group is one stop, as on `RadioCards`.
	 */
	focusableWhenDisabled?: boolean;
};

// Base UI's checkbox submits the owning form on `Enter`. A card follows the radio, where `Enter`
// does nothing, and `preventDefault` is the opt-out Base UI checks for.
function preventEnter(event: KeyboardEvent<HTMLElement>): void {
	if (event.key === 'Enter') {
		event.preventDefault();
	}
}

/**
 * One card: the prefix, the label and the check of a checked card, in a Base UI `Radio.Root` or
 * `Checkbox.Root` that is the whole card.
 *
 * @access private
 */
export function RadioCardsItem({
	item,
	textOverflow,
	tooltipsSuppressed,
	groupTestId,
	onUncheck,
	multiple = false,
	name,
	form,
	readOnly,
	required,
	focusableWhenDisabled = false,
}: RadioCardsItemProps): ReactElement {
	const { value, prefix, disabled } = item;
	const {
		labelId,
		resolvedLabel,
		isLabelEmpty,
		isLabelTruncated,
		labelRef,
		testId,
		hasTooltip,
		tooltipProps,
	} = useGroupItem({
		item,
		groupTestId,
		emptyLabel: RADIO_CARDS_EMPTY_LABEL,
		measureLabel: textOverflow === RadioCardsTextOverflow.Ellipsis,
		suppressed: tooltipsSuppressed,
	});

	// `Space` reaches this too: Base UI turns its keyup into a click on the card. The prevented
	// click tells Base UI to leave the hidden input alone.
	function uncheck(event: MouseEvent<HTMLElement>): void {
		event.preventDefault();
		onUncheck?.();
	}

	const Indicator = multiple ? Checkbox.Indicator : Radio.Indicator;

	const content = (
		<>
			{prefix !== undefined && (
				<span
					aria-hidden
					data-slot="radio-cards-item-prefix"
					className={styles['radio-cards__prefix']}
					{...(testId === undefined ? {} : { 'data-testid': partTestId(testId, 'prefix') })}
				>
					{prefix}
				</span>
			)}
			<span
				id={labelId}
				ref={labelRef}
				data-slot="radio-cards-item-label"
				data-truncated={isLabelTruncated || undefined}
				data-empty-label={isLabelEmpty || undefined}
				className={styles['radio-cards__label']}
			>
				{resolvedLabel}
			</span>
			{/* Mounted on every card, so the slot can open and close around the check. */}
			<Indicator
				keepMounted
				aria-hidden
				data-slot="radio-cards-item-indicator"
				className={styles['radio-cards__indicator']}
			>
				<Check />
			</Indicator>
		</>
	);

	const cardProps = {
		value,
		disabled,
		'aria-labelledby': labelId,
		'data-slot': 'radio-cards-item',
		className: styles['radio-cards__item'],
		...(testId === undefined ? {} : { 'data-testid': testId }),
	};

	const cardEl = multiple ? (
		<Checkbox.Root
			{...cardProps}
			name={name}
			form={form}
			readOnly={readOnly}
			required={required}
			onKeyDown={preventEnter}
			// `Checkbox.Root` has no `focusableWhenDisabled`. The root of the group keeps `Space` from
			// scrolling the page, which Base UI's version of it would do here.
			{...(focusableWhenDisabled ? { tabIndex: 0 } : {})}
		>
			{content}
		</Checkbox.Root>
	) : (
		<Radio.Root {...cardProps} onClick={onUncheck === undefined ? undefined : uncheck}>
			{content}
		</Radio.Root>
	);

	if (!hasTooltip) {
		return cardEl;
	}

	return (
		<TooltipAnchor {...tooltipProps} contentProps={{ className: styles['radio-cards__tooltip'] }}>
			{cardEl}
		</TooltipAnchor>
	);
}
