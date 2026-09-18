import type { AriaAttributes, ComponentProps, CSSProperties, ReactElement, ReactNode } from 'react';
import type {
	ToggleGroupColor,
	ToggleGroupScrollDirection,
	ToggleGroupSize,
	ToggleGroupType,
	ToggleGroupVariant,
} from './constants.js';

export type ToggleGroupTypeType = (typeof ToggleGroupType)[keyof typeof ToggleGroupType];
export type ToggleGroupVariantType = (typeof ToggleGroupVariant)[keyof typeof ToggleGroupVariant];
export type ToggleGroupColorType = (typeof ToggleGroupColor)[keyof typeof ToggleGroupColor];
export type ToggleGroupSizeType = (typeof ToggleGroupSize)[keyof typeof ToggleGroupSize];
export type ToggleGroupScrollDirectionType =
	(typeof ToggleGroupScrollDirection)[keyof typeof ToggleGroupScrollDirection];

/**
 * Everything a button carries regardless of whether it can be pressed.
 */
type ToggleGroupItemBaseType = {
	/**
	 * Identifies this button. What `value`, `defaultValue` and `onChange` carry.
	 *
	 * @note Unique within the bar. Two items sharing a value are indistinguishable to the component.
	 */
	value: string;
	/**
	 * What the user reads on the button. Also its accessible name.
	 *
	 * @note Text alone. An icon flanking it goes in `prefix` or `suffix`, which sit outside the
	 * truncation cap and so survive a label that does not fit.
	 *
	 * @note Capped at `--toggle-group-label-max-inline-size` (120px). Past it the label truncates
	 * and shows its full text in a tooltip. Override the variable to change the cap, or set it to
	 * `none`.
	 *
	 * @note A node that renders nothing (`null`, `false` or an empty string) falls back to the text
	 * `<No label>`, and that button's label element carries `data-empty-label`. The button still
	 * renders: an option that disappears from the bar leaves the group without saying so.
	 */
	label: ReactNode;
	/**
	 * Element rendered before the label, inside the button.
	 *
	 * @note Wrapped in a `toggle-group-prefix` slot rather than cloned, so it needs no `className`
	 * of its own. An `svg` inside is sized to `--toggle-group-button-icon-size` unless it carries a
	 * `size-*` class.
	 *
	 * @note Never truncated: the 120px cap is the label's alone, so the icon stays put while the
	 * text ellipsis.
	 */
	prefix?: ReactElement;
	/**
	 * Element rendered after the label, inside the button. Same treatment as `prefix`.
	 */
	suffix?: ReactElement;
	/**
	 * Forwarded to the button as `data-testid`. Survives the tooltip trigger cloning the button.
	 *
	 * @note Optional because the bar names its buttons for you: with a `testId` on the bar, an item
	 * with none of its own is addressable as `` `${groupTestId}-button-${value}` ``. Write this only
	 * to give one button a name of its own, which then wins.
	 */
	testId?: string;
};

/**
 * One button in the bar.
 *
 * `disabled` and `disabledTooltip` travel together. Items are plain data rather than call sites, so
 * a union expresses the pairing directly, unlike a component's own props (see `Button`'s
 * `ValidateButtonProps` for the call-site version of the same rule).
 */
export type ToggleGroupItemProps = ToggleGroupItemBaseType &
	(
		| {
				disabled?: never;
				disabledTooltip?: never;
		  }
		| {
				/**
				 * When true, this button cannot be pressed or released.
				 *
				 * @note Requires `disabledTooltip`.
				 *
				 * @note The button carries `aria-disabled` rather than the native `disabled` attribute,
				 * so it keeps receiving hover and focus and its tooltip stays reachable.
				 */
				disabled: boolean;
				/**
				 * Why this button cannot be used. Only renders while `disabled` is true.
				 *
				 * @note Only allowed alongside `disabled`. Pass `undefined` explicitly when there is no
				 * reason to give.
				 *
				 * @note Stacks above the truncation tooltip: the reason first, then the full label.
				 */
				disabledTooltip: ReactNode;
		  }
	);

/**
 * The rules below are the ones a union cannot express without blowing {@link ToggleGroupProps} up
 * into a cross product. Each is an object whose single required key is the sentence the compiler
 * should print, the same device `RadioGroup`, `Button` and `Tabs` use, so a violation reads as
 * `Property '<the sentence>' is missing ... but required in type '<the rule name>'` instead of
 * pointing at an unrelated prop.
 */
interface ADisabledToggleGroupMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledToggleGroup {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyToggleGroupMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlyToggleGroup {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which also names every button': never;
}

/**
 * Extra constraints layered on top of {@link ToggleGroupProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to a
 * rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled` typed
 * `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the explicit
 * opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole `ToggleGroupProps` type is not checked: `T` is then the
 * type itself, every branch of the conditional is taken at once, and `unknown` from the passing
 * branches absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateToggleGroupProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledToggleGroupMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledToggleGroup
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyToggleGroupMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyToggleGroup
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

/**
 * How many buttons can be pressed at once, and the value/callback triple that follows from it.
 */
type ToggleGroupSelectionType =
	| {
			/**
			 * Only one button can be pressed. Pressing another releases the previous one.
			 */
			type: 'single';
			/**
			 * The controlled pressed item's `value`, or the empty string while nothing is pressed.
			 *
			 * @note Use with `onChange`. For an uncontrolled bar use `defaultValue` instead.
			 *
			 * @note The empty string is the only way to write an empty bar: the bar reaches it on
			 * its own only with `allowClear`.
			 */
			value?: string;
			/**
			 * The pressed item's `value` on the first render, for a bar that keeps its own state.
			 *
			 * @note Use with `onChange`. For a controlled bar use `value` instead. Without it the bar
			 * starts with nothing pressed.
			 */
			defaultValue?: string;
			/**
			 * Called with the newly pressed item's `value`, or the empty string once the pressed
			 * button is released, which takes `allowClear`.
			 */
			onChange?: (value: string) => void;
	  }
	| {
			/**
			 * Any number of buttons can be pressed at once.
			 */
			type: 'multiple';
			/**
			 * The controlled pressed items' `value`s.
			 *
			 * @note Use with `onChange`. For an uncontrolled bar use `defaultValue` instead.
			 *
			 * @note The empty array is the empty bar, which the bar reaches on its own only with
			 * `allowClear`.
			 */
			value?: string[];
			/**
			 * The pressed items' `value`s on the first render, for a bar that keeps its own state.
			 *
			 * @note Use with `onChange`. For a controlled bar use `value` instead.
			 */
			defaultValue?: string[];
			/**
			 * Called with every pressed item's `value`. Reaching the empty array takes
			 * `allowClear`.
			 */
			onChange?: (value: string[]) => void;
	  };

/**
 * `disabled` and `disabledTooltip` travel together, but the pairing is enforced by
 * {@link ValidateToggleGroupProps} rather than by a union of the two shapes.
 *
 * A union here would be multiplied by {@link ToggleGroupReadOnlyType}, and by the selection union
 * on top of that, into an eight member cross product. TypeScript can only narrow such a union
 * through a discriminant the call site actually writes, and `disabled` is absent from most call
 * sites, so it would give up and blame whichever member came first: a bar missing `items` was being
 * told it was missing `disabled`.
 */
export type ToggleGroupDisableType = {
	/**
	 * When true, no button in the bar can be pressed or released.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note An item carrying its own `disabled` blocks that button alone, and says why.
	 *
	 * @note Every button carries `aria-disabled` rather than the native attribute, so the bar stays
	 * hoverable and focusable and the reason stays reachable.
	 *
	 * @note Suppressed entirely while `readOnly` is true, along with `disabledTooltip`.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Why the bar cannot be used. Shown on every button while `disabled` is true.
	 *
	 * @note Only allowed alongside `disabled`.
	 *
	 * @note Stacks above an item's own reason and above the truncation tooltip, most general first.
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
 * as {@link ToggleGroupDisableType}.
 */
export type ToggleGroupReadOnlyType = {
	/**
	 * When true, the pressed value cannot change, but the buttons stay focusable and keep their
	 * pressed state readable.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note Outranks `disabled`, the way `loading` outranks it on `Button`. While this is true the
	 * bar is not disabled at all, whatever `disabled` says.
	 *
	 * @note A locked button carries `aria-disabled` and `data-readonly`. `aria-readonly` is not
	 * allowed on `role="button"`, unlike the `radiogroup` a `RadioGroup` root is, so `aria-disabled`
	 * is what tells assistive technology the press will not land. It keeps its tab stop either way.
	 *
	 * @note The bar dims less than a disabled one (0.8 against 0.6) and keeps its label colours, so
	 * the pressed option stays readable: a locked value is still a value the user is reading.
	 *
	 * @default false
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown on every button while `readOnly` is true.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Takes the place of `disabledTooltip` and of every item's own reason, which are
	 * suppressed for the whole time the bar is read-only: a locked bar has one reason, not one per
	 * button. The truncated label still stacks under it.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
};

export type ToggleGroupProps = Pick<ComponentProps<'div'>, 'id' | 'className' | 'style'> &
	AriaAttributes &
	ToggleGroupSelectionType &
	ToggleGroupDisableType &
	ToggleGroupReadOnlyType & {
		/**
		 * The buttons, in the order they are rendered. The component owns the bar's markup, so the
		 * buttons themselves are never composed as children.
		 *
		 * @note Five is where the design spec stops. Past that the pattern degrades, and a
		 * dropdown is the control the content wants.
		 */
		items: ToggleGroupItemProps[];
		/**
		 * The visual treatment of the bar.
		 *
		 * @note `outlined` is the only value. The prop is kept so the bar states its treatment.
		 */
		variant: ToggleGroupVariantType;
		/**
		 * The colour treatment of the bar.
		 *
		 * @note `secondary` is the only value the design spec draws today.
		 */
		color: ToggleGroupColorType;
		/**
		 * Height + padding token.
		 *
		 * @note Both sizes are 32px tall and differ in horizontal padding alone.
		 */
		size: ToggleGroupSizeType;
		/**
		 * Whether the last pressed button can be released, leaving the bar with nothing pressed.
		 *
		 * @note Off by default: once something is pressed the bar keeps reporting a value. The
		 * press that would empty it is cancelled, so `onChange` is not called and nothing moves.
		 *
		 * @note On a `single` bar this is the press of the pressed button. On a `multiple` bar it
		 * is the release of the last pressed one, and releasing any other is unaffected.
		 *
		 * @note A bar that starts with nothing pressed stays that way until the first press. This
		 * blocks the way back to empty, not the empty state itself.
		 *
		 * @default false
		 */
		allowClear?: boolean;
		/**
		 * The width of the bar. Written as the `--toggle-group-internal-inline-size` custom
		 * property, so it composes with the tokens instead of overwriting `style.width`. Numbers are
		 * written as `px`.
		 *
		 * @note Sizes no single button: a button holds its own size and the bar scrolls instead.
		 *
		 * @default "fit-content"
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the bar. Written as the `--toggle-group-internal-max-inline-size` custom
		 * property, so it composes with the tokens. Numbers are written as `px`.
		 *
		 * @note A bar narrower than its buttons scrolls, with an arrow at each end that is live only
		 * while there is more in that direction.
		 *
		 * @default "100%"
		 */
		maxWidth?: CSSProperties['maxWidth'];
		/**
		 * Forwarded to the rendered element as `data-testid`.
		 *
		 * @note Also names every button: an item with no `testId` of its own is addressable as
		 * `` `${testId}-button-${value}` ``. An item's own `testId` wins.
		 */
		testId?: string;
		/**
		 * Any `data-*` attribute is accepted and forwarded to the rendered element.
		 */
		[key: `data-${string}`]: unknown;
	};
