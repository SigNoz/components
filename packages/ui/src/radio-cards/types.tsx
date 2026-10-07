import type { AriaAttributes, ComponentProps, ReactElement, ReactNode } from 'react';
import type { RadioCardsTextOverflow } from './constants.js';

export type RadioCardsTextOverflowType =
	(typeof RadioCardsTextOverflow)[keyof typeof RadioCardsTextOverflow];

/**
 * Everything a card carries on both `RadioCards` and `RadioCards.Multiple`.
 */
type RadioCardsItemBaseType = {
	/**
	 * The name of the option, and the card's accessible name.
	 *
	 * @note Text and inline formatting only. The card is one control, so a link, a button or an
	 * input inside it cannot be reached by a screen reader, and a click on it checks the card too.
	 * A field that belongs to one option goes under the group.
	 *
	 * @note A label that renders nothing (`null`, `false` or an empty string) falls back to the
	 * text `<No label>`, and the label carries `data-empty-label`. The card still renders: an option
	 * that disappears takes an answer out of the question without saying so.
	 */
	label: ReactNode;
	/**
	 * What lands in `value`/`onChange`, and what the owning form submits under the group's `name`.
	 *
	 * @note Unique within the group. Of two items with the same `value`, only the first renders,
	 * and the group logs a warning.
	 */
	value: string;
	/**
	 * An icon before the label, such as the kind of signal. Hidden from screen readers, so when
	 * the icon is the only thing that tells two cards apart, its name goes in `label`.
	 */
	prefix?: ReactElement;
	/**
	 * Forwarded to the card as `data-testid`, and names its parts (`${testId}-prefix`).
	 *
	 * @note Optional because the group names its cards for you: with a `testId` on the group, a card
	 * with none of its own is `` `${groupTestId}-item-${value}` ``. Write this only to give one card
	 * a name of its own, which then wins.
	 */
	testId?: string;
};

/**
 * `disabled` and `disabledTooltip` travel together. Items are plain data rather than call sites, so
 * a union expresses the pairing here, unlike the group's own props (see
 * {@link ValidateRadioCardsProps}).
 */
type RadioCardsItemDisableType =
	| {
			disabled?: never;
			disabledTooltip?: never;
	  }
	| {
			/**
			 * When true, blocks this card alone. The group's own `disabled` blocks all of them.
			 *
			 * @note Requires `disabledTooltip`.
			 *
			 * @note The arrow keys of `RadioCards` skip the card, and on `RadioCards.Multiple` it is not
			 * a tab stop, so its reason shows on hover only.
			 */
			disabled: boolean;
			/**
			 * Why this card cannot be checked. Only renders while `disabled` is true.
			 *
			 * @note Only allowed alongside `disabled`. Pass `undefined` when there is no reason to give.
			 */
			disabledTooltip: ReactNode;
	  };

/**
 * One card of `RadioCards` or `RadioCards.Multiple`.
 */
export type RadioCardsItemType = RadioCardsItemBaseType &
	RadioCardsItemDisableType & {
		/**
		 * Not supported: the slot after the label holds the check of a checked card.
		 */
		suffix?: never;
	};

/**
 * `disabled` and `disabledTooltip` travel together, but the pairing is enforced by
 * {@link ValidateRadioCardsProps} rather than by a union of the two shapes, for the same reason as
 * `RadioGroupDisableType`: a union here would multiply with {@link RadioCardsReadOnlyType}.
 */
export type RadioCardsDisableType = {
	/**
	 * When true, no card can be checked or unchecked, and `onChange` is not called.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note The group keeps one tab stop and the cards stay hoverable, so `disabledTooltip` stays
	 * reachable: the root carries `aria-disabled` and `data-disabled`, never the native `disabled` on
	 * the cards.
	 *
	 * @note Leaves the group out of the submit, the same as a disabled native input.
	 *
	 * @note Suppressed entirely while `readOnly` is true, along with `disabledTooltip`.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Why the group cannot be used, shown in a tooltip while `disabled` is true.
	 *
	 * @note Only allowed alongside `disabled`.
	 *
	 * @note Takes the place of every card's own `disabledTooltip` while it shows: a disabled group
	 * has one reason, not one per card.
	 *
	 * @note Does not render while `readOnly` is true. `readOnlyTooltip` takes that place.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give. Leaving the prop out is the
	 * type error.
	 */
	disabledTooltip?: ReactNode;
};

/**
 * `readOnly` and `readOnlyTooltip` travel together, enforced the same way and for the same reason
 * as {@link RadioCardsDisableType}.
 */
export type RadioCardsReadOnlyType = {
	/**
	 * When true, the value cannot change, but the cards stay focusable and the checked cards stay
	 * readable.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note The focus still moves, by arrow on `RadioCards` and by `Tab` on `RadioCards.Multiple`,
	 * and the group is still submitted, since its value is real.
	 *
	 * @note Outranks `disabled`. While this is true the group is not disabled at all, whatever
	 * `disabled` says.
	 *
	 * @default false
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown in a tooltip while `readOnly` is true, on hover and on focus.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Takes the place of `disabledTooltip` and of every card's own reason while it shows.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
};

/**
 * The rules below are the ones a union cannot express without blowing up the props into a cross
 * product. Each is an object whose single required key is the sentence the compiler should print,
 * so a violation reads as `Property '<the sentence>' is missing ... but required in type '<the rule
 * name>'` instead of pointing at an unrelated prop.
 */
interface ARadioCardsGroupNeedsAName {
	'`aria-label` or `aria-labelledby` is required, the group needs a name: the question its cards answer': never;
}

interface ADisabledRadioCardsGroupMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledRadioCardsGroup {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyRadioCardsGroupMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlyRadioCardsGroup {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which survives the tooltip trigger cloning the group': never;
}

/**
 * Extra constraints layered on top of {@link RadioCardsProps} and {@link RadioCardsMultipleProps}
 * at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not.
 *
 * The rules look at which props the call site writes, not at their values: `disabled` typed
 * `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the explicit
 * opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole props type is not checked: every key is then written, so
 * every rule passes. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateRadioCardsProps<T> = ('aria-label' extends keyof T
	? unknown
	: 'aria-labelledby' extends keyof T
		? unknown
		: ARadioCardsGroupNeedsAName) &
	(T extends { disabled: boolean | undefined }
		? T extends { disabledTooltip: ReactNode }
			? unknown
			: ADisabledRadioCardsGroupMustSayWhy
		: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledRadioCardsGroup
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyRadioCardsGroupMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyRadioCardsGroup
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

/**
 * The props `RadioCards` and `RadioCards.Multiple` share.
 */
type RadioCardsSharedProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes &
	RadioCardsDisableType &
	RadioCardsReadOnlyType & {
		/**
		 * The most cards a row holds. The cards share the row equally, and a row holds fewer when a
		 * card would get narrower than its minimum width, so the rest wrap to the next row.
		 *
		 * @note Without it, a row holds as many cards as fit at the minimum width.
		 *
		 * @note `1` stacks the cards. The number of items puts every card in one row.
		 *
		 * @note A value that is not a whole number from 1 up is ignored, with a warning.
		 */
		columns?: number;
		/**
		 * What a label longer than its card does.
		 *
		 * `ellipsis` keeps the label on one line, truncates it at the end, and shows the full label in
		 * a tooltip only while it is truncated. `wrap` lets the label take as many lines as it needs,
		 * the card grows in height, and no tooltip shows.
		 *
		 * @note A disabled card's reason comes first in the same tooltip.
		 *
		 * @default 'ellipsis'
		 */
		textOverflow?: RadioCardsTextOverflowType;
		/**
		 * Identifies the field when the owning form is submitted.
		 */
		name?: string;
		/**
		 * The id of the owning form, for a group rendered outside the `<form>` element.
		 */
		form?: string;
		/**
		 * When true, the owning form cannot be submitted while no card is checked. A value that matches
		 * no item submits nothing, so it does not count as checked.
		 *
		 * @note On `RadioCards`, a checked card that is disabled still fills `required`, as a disabled
		 * checked radio does in a native radio group, though the form leaves it out of the submit.
		 *
		 * @note On `RadioCards.Multiple`, one checked card is enough, where `required` on a native
		 * checkbox list asks for every box. A checked card that is disabled submits nothing, so it
		 * does not count as checked.
		 *
		 * @default false
		 */
		required?: boolean;
		/**
		 * Forwarded to the root as `data-testid`. Survives the tooltip trigger cloning the group,
		 * which a raw `data-testid` prop does not. Also names every card, see `items`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root.
		 */
		[key: `data-${string}`]: unknown;
	};

/**
 * `allowClear` decides whether `onChange` can report `null`, so the two travel as a union: a group
 * that cannot be emptied keeps a callback typed `(value: string) => void`, and a group that can
 * takes one that handles `null`.
 *
 * The first member takes `boolean`, not `true`, so an `allowClear` decided at run time asks for the
 * callback that handles `null` too.
 *
 * The member without `allowClear` comes last on purpose. TypeScript reports a props object that
 * matches neither member against the last one, so a group missing `items` is told about `items`,
 * not about a missing `allowClear`.
 */
export type RadioCardsClearType =
	| {
			/**
			 * When true, a click or `Space` on the checked card unchecks it, and the group reports
			 * `null`.
			 *
			 * @note Without it a click on the checked card changes nothing, the same as a native radio.
			 *
			 * @note A group that starts with nothing checked stays that way until the first check
			 * either way. This blocks the way back to empty, not the empty state itself.
			 *
			 * @default false
			 */
			allowClear: boolean;
			/**
			 * Called with the `value` of the card that becomes checked: on a click, on `Space`, and on
			 * each arrow key as the focus walks the cards. Called with `null` once the checked card is
			 * unchecked.
			 *
			 * @note A choice, not an action. Navigating, creating a record or opening a dialog here
			 * runs on the first arrow key press, so the action belongs to a button next to the group.
			 *
			 * @note Never called while `disabled` or `readOnly`.
			 */
			onChange?: (value: string | null) => void;
	  }
	| {
			/**
			 * When true, a click or `Space` on the checked card unchecks it, and the group reports
			 * `null`.
			 *
			 * @note Without it a click on the checked card changes nothing, the same as a native radio.
			 *
			 * @note A group that starts with nothing checked stays that way until the first check
			 * either way. This blocks the way back to empty, not the empty state itself.
			 *
			 * @default false
			 */
			allowClear?: false;
			/**
			 * Called with the `value` of the card that becomes checked: on a click, on `Space`, and on
			 * each arrow key as the focus walks the cards.
			 *
			 * @note A choice, not an action. Navigating, creating a record or opening a dialog here
			 * runs on the first arrow key press, so the action belongs to a button next to the group.
			 *
			 * @note Never called with `null` without `allowClear`: a click on the checked card changes
			 * nothing. The call site clears the group by writing `value={null}`.
			 *
			 * @note Never called while `disabled` or `readOnly`.
			 */
			onChange?: (value: string) => void;
	  };

export type RadioCardsProps = RadioCardsSharedProps &
	RadioCardsClearType & {
		/**
		 * The cards, in the order they are rendered. The group owns its markup, so there are no
		 * children to compose.
		 *
		 * @note An empty array renders no card and logs a warning.
		 */
		items: readonly RadioCardsItemType[];
		/**
		 * The controlled value, one of the items' `value`s.
		 *
		 * @note `null` is the group with no card checked, and it is the only way to write one:
		 * `undefined` makes the group uncontrolled for the rest of its life, so a controlled group
		 * that starts with nothing checked passes `null`.
		 *
		 * @note Decided on the first render. A `value` that turns `undefined` later shows no card
		 * checked, and one that appears on a group that started uncontrolled is ignored. Both log a
		 * warning.
		 *
		 * @note Use with `onChange`. For an uncontrolled group use `defaultValue` instead.
		 */
		value?: string | null;
		/**
		 * The value checked on the first render, for a group that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled group use `value` instead.
		 */
		defaultValue?: string;
	};

export type RadioCardsMultipleProps = RadioCardsSharedProps & {
	/**
	 * The cards, in the order they are rendered, as on `RadioCards`.
	 *
	 * @note An empty array renders no card and logs a warning.
	 */
	items: readonly RadioCardsItemType[];
	/**
	 * The controlled value, the `value` of every checked card. `[]` is the group with no card
	 * checked, which the group reaches on its own only with `allowClear`.
	 *
	 * @note `undefined` makes the group uncontrolled for the rest of its life, as on `RadioCards`:
	 * a `value` that turns `undefined` later shows no card checked, and one that appears on a group
	 * that started uncontrolled is ignored. Both log a warning.
	 *
	 * @note Use with `onChange`. For an uncontrolled group use `defaultValue` instead.
	 */
	value?: readonly string[];
	/**
	 * The values checked on the first render, for a group that keeps its own state.
	 *
	 * @note Use with `onChange`. For a controlled group use `value` instead.
	 */
	defaultValue?: readonly string[];
	/**
	 * Called with the new list of checked values, in the order of `items`, on a click and on
	 * `Space`.
	 *
	 * @note Reaching the empty array takes `allowClear`.
	 *
	 * @note Never called while `disabled` or `readOnly`.
	 */
	onChange?: (value: string[]) => void;
	/**
	 * When true, the last checked card can be unchecked, and the group reports the empty array.
	 *
	 * @note Without it, once a card is checked the group keeps one: the press that would leave it
	 * empty is cancelled, so `onChange` is not called. A value that matches no item, or a checked
	 * card that is disabled, does not count, the same as for `required`.
	 *
	 * @note A group that starts with nothing checked stays that way until the first check either
	 * way. This blocks the way back to empty, not the empty state itself.
	 *
	 * @default false
	 */
	allowClear?: boolean;
};
