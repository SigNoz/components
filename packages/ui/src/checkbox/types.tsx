import type { AriaAttributes, ComponentProps, CSSProperties, ReactNode, Ref } from 'react';
import type { CheckboxColor, CheckboxTextOverflow } from './constants.js';

export type CheckboxColorType = (typeof CheckboxColor)[keyof typeof CheckboxColor];
export type CheckboxTextOverflowType =
	(typeof CheckboxTextOverflow)[keyof typeof CheckboxTextOverflow];

/**
 * `disabled` and `disabledTooltip` travel together, enforced by {@link ValidateCheckboxProps}
 * rather than by a union of the two shapes: a union here would be multiplied by
 * {@link CheckboxReadOnlyType} into a four member cross product that TypeScript cannot narrow
 * from call sites that write neither prop.
 */
export type CheckboxDisableType = {
	/**
	 * When true, prevents the user from toggling the checkbox.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note Base UI's checkbox is a `<span role="checkbox">`, not a native `<button>`, so this is
	 * `aria-disabled` rather than the native attribute. The control stays hoverable and keeps its
	 * tab stop, which is what makes `disabledTooltip` reachable at all.
	 *
	 * @note Suppressed entirely while `readOnly` is true, along with `disabledTooltip`.
	 */
	disabled?: boolean;
	/**
	 * Why the checkbox cannot be used, shown in a tooltip while `disabled` is true.
	 *
	 * @note Only allowed alongside `disabled`.
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
 * as {@link CheckboxDisableType}.
 */
export type CheckboxReadOnlyType = {
	/**
	 * When true, the value cannot change, but the checkbox stays focusable and keeps its checked
	 * state readable.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note This is the difference from `disabled`: a read-only checkbox is still reachable with
	 * the keyboard, so its tooltip is reachable too.
	 *
	 * @note Outranks `disabled`, the way `loading` outranks it on `Button`. While this is true the
	 * checkbox is not disabled at all, whatever `disabled` says.
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown in a tooltip while `readOnly` is true.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Takes the place of `disabledTooltip`, which is suppressed for the whole time the
	 * checkbox is read-only.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
};

/**
 * The rules below are the ones a union cannot express without blowing up {@link CheckboxProps}
 * into a cross product. Each is an object whose single required key is the sentence the compiler
 * should print, so a violation reads as `Property '<the sentence>' is missing ... but required in
 * type '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledCheckboxMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledCheckbox {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlyCheckboxMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlyCheckbox {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which survives the tooltip trigger cloning the checkbox': never;
}

interface ACheckboxIsControlledOrUncontrolledNeverBoth {
	'`value` makes the checkbox controlled for its whole life, so `defaultValue` never applies, drop one of the two': never;
}

/**
 * Extra constraints layered on top of {@link CheckboxProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled`
 * typed `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the
 * explicit opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole `CheckboxProps` type is not checked: `T` is then the
 * type itself, every branch of the conditional is taken at once, and `unknown` from the passing
 * branches absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateCheckboxProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledCheckboxMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledCheckbox
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlyCheckboxMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlyCheckbox
		: unknown) &
	(T extends { value: boolean | undefined }
		? T extends { defaultValue: boolean | undefined }
			? ACheckboxIsControlledOrUncontrolledNeverBoth
			: unknown
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

export type CheckboxProps = Pick<
	ComponentProps<'button'>,
	'id' | 'className' | 'style' | 'children' | 'tabIndex'
> &
	AriaAttributes &
	CheckboxDisableType &
	CheckboxReadOnlyType & {
		/**
		 * Fills the box while the checkbox is checked or indeterminate; the unchecked box keeps a
		 * neutral border for every color, because an unchecked box has no status to report yet.
		 *
		 * Same palette as `Badge`'s `color`. Required: the box's checked fill is a semantic
		 * statement, so the call site has to make it.
		 */
		color: CheckboxColorType;
		/**
		 * Shows the mixed state: a dash instead of the check mark, announced as
		 * `aria-checked="mixed"`. For a parent in a tree whose children are partly selected.
		 *
		 * @note Purely visual on top of the checked state. Clicking still reports the next boolean
		 * through `onChange`; deriving `indeterminate` from the children's state is the call
		 * site's job.
		 */
		indeterminate?: boolean;
		/**
		 * Controls how the label behaves when it does not fit.
		 *
		 * `ellipsis` truncates the label and shows the full text in a tooltip on hover/focus, and
		 * only while the label is actually truncated. `wrap` lets the text take as many lines as
		 * it needs, no tooltip. `hidden` clips at the text's edge, no marker and no tooltip.
		 * `visible` clips nothing and lets the label paint outside its box.
		 *
		 * @note The tooltip is exclusive to `ellipsis`, and the checkbox's own `disabledTooltip`
		 * or `readOnlyTooltip` stacks above it, reason first.
		 *
		 * @default 'ellipsis'
		 */
		textOverflow?: CheckboxTextOverflowType;
		/**
		 * Identifies the field when the owning form is submitted. Base UI renders a hidden
		 * checkbox input that carries it.
		 *
		 * @note Also the first fallback for the label when `children` renders nothing.
		 */
		name?: string;
		/**
		 * When true, the owning form cannot be submitted until the checkbox is checked.
		 *
		 * @default false
		 */
		required?: boolean;
		/**
		 * The controlled checked state.
		 *
		 * @note Use with `onChange`. For an uncontrolled checkbox use `defaultValue` instead,
		 * never both.
		 */
		value?: boolean;
		/**
		 * The checked state on first render, for a checkbox that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled checkbox use `value` instead, never both.
		 */
		defaultValue?: boolean;
		/**
		 * Called with the new checked state.
		 *
		 * @note Never called while `disabled` or `readOnly`.
		 */
		onChange?: (checked: boolean) => void;
		/**
		 * Forwarded to the checkbox itself as `data-testid`. Survives the tooltip trigger cloning
		 * the element, which a raw `data-testid` prop does not. The wrapper is addressed with
		 * `containerTestId` instead.
		 */
		testId?: string;
		/**
		 * The width of the labelled row. Written as the `--checkbox-internal-width` custom
		 * property, so it composes with the tokens instead of overwriting `style.width`. Numbers
		 * are written as `px`.
		 *
		 * @note Sizes the row, never the box: the box reads `--checkbox-size`. With no label
		 * there is no row, so this has no effect on a bare checkbox.
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the labelled row. Written as the `--checkbox-internal-max-width`
		 * custom property, so it composes with the tokens. Numbers are written as `px`. Without
		 * it the row is capped at `100%` of its container.
		 */
		maxWidth?: CSSProperties['maxWidth'];
		/**
		 * Additional CSS classes for the `<label>` wrapper that holds the checkbox and its label.
		 *
		 * @note Any `container*` prop forces the wrapper to render even with no label.
		 */
		containerClassName?: string;
		/**
		 * Inline styles for the wrapper.
		 */
		containerStyle?: CSSProperties;
		/**
		 * The `id` of the wrapper.
		 */
		containerId?: string;
		/**
		 * Forwarded to the wrapper as `data-testid`.
		 */
		containerTestId?: string;
		/**
		 * A ref to the wrapper. The component's own `ref` is the checkbox itself.
		 */
		containerRef?: Ref<HTMLLabelElement>;
		/**
		 * Any `data-*` prop is accepted and forwarded to the checkbox itself.
		 */
		[key: `data-${string}`]: unknown;
	};
