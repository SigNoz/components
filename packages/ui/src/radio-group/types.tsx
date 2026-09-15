import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { RadioGroupColor, RadioGroupTextOverflow } from './constants.js';

export type RadioGroupColorType = (typeof RadioGroupColor)[keyof typeof RadioGroupColor];
export type RadioGroupTextOverflowType =
	(typeof RadioGroupTextOverflow)[keyof typeof RadioGroupTextOverflow];

/**
 * Everything an item carries regardless of whether it can be picked.
 */
type RadioGroupItemBaseType = {
	/**
	 * What the user reads next to the control. Also the item's accessible name.
	 *
	 * @note A node, so it can hold more than text. When it holds something that draws outside its
	 * own box, such as an `Input` or a `Button` with a focus ring, the group takes
	 * `textOverflow="visible"`: every other mode clips the label and the ring with it.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and the row carries `data-empty-label`. The row still renders: an option that
	 * disappears takes an answer out of the group without saying so.
	 */
	label: ReactNode;
	/**
	 * What lands in `value`/`onChange`, and what the owning form submits under the group's `name`.
	 *
	 * @note Unique within the group. Two items sharing a value check together.
	 */
	value: string;
	/**
	 * Forwarded to the item as `data-testid`. Survives the tooltip trigger cloning the item.
	 *
	 * @note Optional because the group names its rows for you: with a `testId` on the group, an
	 * item with none of its own is addressable as `` `${groupTestId}-item-${value}` ``. Write this
	 * only to give one row a name of its own, which then wins.
	 */
	testId?: string;
};

/**
 * One option in the group.
 *
 * `disabled` and `disabledTooltip` travel together. Items are plain data rather than call sites, so
 * a union expresses the pairing here, unlike the group's own props (see
 * {@link ValidateRadioGroupProps}).
 */
export type RadioGroupItemType = RadioGroupItemBaseType &
	(
		| {
				disabled?: never;
				disabledTooltip?: never;
		  }
		| {
				/**
				 * When true, blocks this item alone. The group's own `disabled` blocks all of them.
				 *
				 * @note Requires `disabledTooltip`.
				 */
				disabled: boolean;
				/**
				 * Why this item cannot be picked. Only renders while `disabled` is true.
				 *
				 * @note Only allowed alongside `disabled`. Pass `undefined` when there is no reason to
				 * give.
				 */
				disabledTooltip: ReactNode;
		  }
	);

/**
 * `disabled` and `disabledTooltip` travel together, but the pairing is enforced by
 * {@link ValidateRadioGroupProps} rather than by a union of the two shapes.
 *
 * A union here would be multiplied by {@link RadioGroupReadOnlyType} into a four member cross product.
 * TypeScript can only narrow such a union through a discriminant the call site actually writes, and
 * `disabled` is absent from most call sites, so it would give up and blame whichever member came
 * first.
 */
export type RadioGroupDisableType = {
	/**
	 * When true, prevents the user from interacting with any item in the group.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note Base UI's radio is a `<span role="radio">`, not a native `<button>`, so this is
	 * `aria-disabled` rather than the native attribute. The group stays hoverable and keeps its one
	 * tab stop, which is what makes `disabledTooltip` reachable at all.
	 *
	 * @note Suppressed entirely while `readOnly` is true, along with `disabledTooltip`.
	 */
	disabled?: boolean;
	/**
	 * Why the group cannot be used, shown in a tooltip while `disabled` is true.
	 *
	 * @note Only allowed alongside `disabled`.
	 *
	 * @note Takes the place of every item's own `disabledTooltip` while it is showing: a disabled
	 * group has one reason, not one per item.
	 *
	 * @note Does not render while `readOnly` is true. `readOnlyTooltip` takes that place.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give, for example in a wrapper
	 * that only forwards `disabled`. Leaving the prop out is the type error.
	 */
	disabledTooltip?: ReactNode;
};

/**
 * `readOnly` and `readOnlyTooltip` travel together, enforced the same way and for the same reason
 * as {@link RadioGroupDisableType}.
 */
export type RadioGroupReadOnlyType = {
	/**
	 * When true, the value cannot change, but the items stay focusable and keep their checked
	 * state readable.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note This is the difference from `disabled`: a read-only group is still reachable with the
	 * keyboard, so its tooltip is reachable too.
	 *
	 * @note Outranks `disabled`, the way `loading` outranks it on `Button`. While this is true the
	 * group is not disabled at all, whatever `disabled` says.
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown in a tooltip while `readOnly` is true.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Takes the place of `disabledTooltip`, which is suppressed for the whole time the group
	 * is read-only.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
};

/**
 * The rules below are the ones a union cannot express without blowing up {@link RadioGroupProps}
 * into a cross product. Each is an object whose single required key is the sentence the compiler
 * should print, so a violation reads as `Property '<the sentence>' is missing ... but required in
 * type '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledRadioGroupMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledRadioGroup {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyRadioGroupMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlyRadioGroup {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which survives the tooltip trigger cloning the group': never;
}

/**
 * Extra constraints layered on top of {@link RadioGroupProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled` typed
 * `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the explicit
 * opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole `RadioGroupProps` type is not checked: `T` is then the
 * type itself, every branch of the conditional is taken at once, and `unknown` from the passing
 * branches absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateRadioGroupProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledRadioGroupMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledRadioGroup
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyRadioGroupMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyRadioGroup
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

export type RadioGroupProps = Pick<ComponentProps<'div'>, 'id' | 'className' | 'style'> &
	AriaAttributes &
	RadioGroupDisableType &
	RadioGroupReadOnlyType & {
		/**
		 * The options, in the order they are rendered. The group owns its markup, so there are no
		 * children to compose.
		 *
		 * This field is mandatory, it's not allowed to have an empty radio group.
		 */
		items: RadioGroupItemType[];
		/**
		 * Tints the checked item's dial and dot.
		 */
		color: RadioGroupColorType;
		/**
		 * Controls how an item label behaves when it does not fit.
		 *
		 * `ellipsis` truncates the label and shows the full text in a tooltip on hover/focus, and
		 * only while that label is actually truncated. `wrap` lets the label take as many lines as
		 * it needs, no tooltip. `hidden` clips at the label's edge, no marker and no tooltip.
		 * `visible` clips nothing and lets the label paint outside its box.
		 *
		 * @note Reach for `visible` when a label holds an `Input`, a `Button` or anything else that
		 * draws a focus ring: every other mode clips the label, and a clipped label cuts that ring.
		 *
		 * @note The tooltip is exclusive to `ellipsis`.
		 *
		 * @note An item's `disabledTooltip` stacks above it, reason first.
		 *
		 * @default 'ellipsis'
		 */
		textOverflow?: RadioGroupTextOverflowType;
		/**
		 * Identifies the field when the owning form is submitted, as one half of a name/value pair.
		 */
		name?: string;
		/**
		 * When true, the owning form cannot be submitted until one item is checked.
		 *
		 * @default false
		 */
		required?: boolean;
		/**
		 * The controlled value, which is one of the items' `value`s.
		 *
		 * @note `null` is the empty group, and it is the only way to write one: `undefined` makes
		 * the group uncontrolled for the rest of its life, so a controlled group that starts with
		 * nothing checked passes `null`.
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
		/**
		 * Called with the newly checked item's `value`.
		 *
		 * @note Only a radio reports a change, and it reports its own `value`, so this never fires
		 * with `null`. A group is cleared by the call site writing `value={null}`, which is not a
		 * change the group made.
		 *
		 * @note Never called while `disabled` or `readOnly`.
		 */
		onChange?: (value: string) => void;
		/**
		 * Forwarded to the rendered element as `data-testid`. Survives the tooltip trigger cloning
		 * the group, which a raw `data-testid` prop does not.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the rendered element.
		 */
		[key: `data-${string}`]: unknown;
	};
