import type { AriaAttributes, ComponentProps, CSSProperties, ReactNode, Ref } from 'react';
import type { SwitchColor, SwitchTextOverflow, SwitchTextPlacement } from './constants.js';

export type SwitchColorType = (typeof SwitchColor)[keyof typeof SwitchColor];
export type SwitchTextPlacementType =
	(typeof SwitchTextPlacement)[keyof typeof SwitchTextPlacement];
export type SwitchTextOverflowType = (typeof SwitchTextOverflow)[keyof typeof SwitchTextOverflow];

/**
 * `disabled` and `disabledTooltip` travel together, enforced by {@link ValidateSwitchProps} rather
 * than by a union of the two shapes: a union here would be multiplied by
 * {@link SwitchReadOnlyType} into a four member cross product that TypeScript cannot narrow from
 * call sites that write neither prop.
 */
export type SwitchDisableType = {
	/**
	 * When true, prevents the user from toggling the switch.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note Base UI's switch is a `<span role="switch">`, not a native `<button>`, so this is
	 * `aria-disabled` rather than the native attribute. The control stays hoverable and keeps its
	 * tab stop, which is what makes `disabledTooltip` reachable at all.
	 *
	 * @note Suppressed entirely while `readOnly` is true, along with `disabledTooltip`.
	 */
	disabled?: boolean;
	/**
	 * Why the switch cannot be used, shown in a tooltip while `disabled` is true.
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
 * as {@link SwitchDisableType}.
 */
export type SwitchReadOnlyType = {
	/**
	 * When true, the value cannot change, but the switch stays focusable and keeps its on/off
	 * state readable.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note This is the difference from `disabled`: a read-only switch is still reachable with the
	 * keyboard, so its tooltip is reachable too.
	 *
	 * @note Outranks `disabled`, the way `loading` outranks it on `Button`. While this is true the
	 * switch is not disabled at all, whatever `disabled` says.
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown in a tooltip while `readOnly` is true.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Takes the place of `disabledTooltip`, which is suppressed for the whole time the
	 * switch is read-only.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
};

/**
 * The rules below are the ones a union cannot express without blowing up {@link SwitchProps} into
 * a cross product. Each is an object whose single required key is the sentence the compiler
 * should print, so a violation reads as `Property '<the sentence>' is missing ... but required in
 * type '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledSwitchMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledSwitch {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlySwitchMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlySwitch {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, which survives the tooltip trigger cloning the switch': never;
}

interface ASwitchIsControlledOrUncontrolledNeverBoth {
	'`value` makes the switch controlled for its whole life, so `defaultValue` never applies, drop one of the two': never;
}

/**
 * Extra constraints layered on top of {@link SwitchProps} at the call site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled`
 * typed `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the
 * explicit opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole `SwitchProps` type is not checked: `T` is then the type
 * itself, every branch of the conditional is taken at once, and `unknown` from the passing
 * branches absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateSwitchProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledSwitchMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledSwitch
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlySwitchMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlySwitch
		: unknown) &
	(T extends { value: boolean | undefined }
		? T extends { defaultValue: boolean | undefined }
			? ASwitchIsControlledOrUncontrolledNeverBoth
			: unknown
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);

export type SwitchProps = Pick<
	ComponentProps<'button'>,
	'id' | 'className' | 'style' | 'children'
> &
	AriaAttributes &
	SwitchDisableType &
	SwitchReadOnlyType & {
		/**
		 * Tints the track while the switch is on. The knob keeps one color across the whole
		 * palette: it is the physical object being moved, not a status indicator.
		 *
		 * Same palette as `Badge`'s `color`.
		 *
		 * @default 'primary'
		 */
		color?: SwitchColorType;
		/**
		 * A muted second line under the label, announced through `aria-describedby`.
		 *
		 * @note With no `children` the description renders alone: the switch then has a
		 * description but no name, so give it one with `aria-label`.
		 */
		description?: string;
		/**
		 * Which side of the switch the label and description sit on.
		 *
		 * `right` is the plain toggle row. `left` is the settings row: text first, switch after,
		 * and pairing it with `width` plus the `--switch-container-justify` custom property pushes
		 * the switch to the far edge.
		 *
		 * @default 'right'
		 */
		textPlacement?: SwitchTextPlacementType;
		/**
		 * Controls how the label behaves when it does not fit.
		 *
		 * `ellipsis` truncates the label and shows the full text in a tooltip on hover/focus, and
		 * only while the label is actually truncated. `wrap` lets the text take as many lines as
		 * it needs, no tooltip. `hidden` clips at the text's edge, no marker and no tooltip.
		 * `visible` clips nothing and lets the label paint outside its box.
		 *
		 * @note The tooltip is exclusive to `ellipsis`, and the switch's own `disabledTooltip` or
		 * `readOnlyTooltip` stacks above it, reason first.
		 *
		 * @default 'ellipsis'
		 */
		textOverflow?: SwitchTextOverflowType;
		/**
		 * Identifies the field when the owning form is submitted. Base UI renders a hidden
		 * checkbox input that carries it.
		 */
		name?: string;
		/**
		 * When true, the owning form cannot be submitted until the switch is on.
		 *
		 * @default false
		 */
		required?: boolean;
		/**
		 * The controlled checked state.
		 *
		 * @note Use with `onChange`. For an uncontrolled switch use `defaultValue` instead, never
		 * both.
		 */
		value?: boolean;
		/**
		 * The checked state on first render, for a switch that keeps its own state.
		 *
		 * @note Use with `onChange`. For a controlled switch use `value` instead, never both.
		 */
		defaultValue?: boolean;
		/**
		 * Called with the new checked state.
		 *
		 * @note Never called while `disabled` or `readOnly`.
		 */
		onChange?: (checked: boolean) => void;
		/**
		 * Forwarded to the switch itself as `data-testid`. Survives the tooltip trigger cloning
		 * the element, which a raw `data-testid` prop does not. The wrapper is addressed with
		 * `containerTestId` instead.
		 */
		testId?: string;
		/**
		 * The width of the labelled row. Written as the `--switch-internal-width` custom property,
		 * so it composes with the tokens instead of overwriting `style.width`. Numbers are written
		 * as `px`.
		 *
		 * @note Sizes the row, never the track: the track reads `--switch-track-width`. With no
		 * label there is no row, so this has no effect on a bare switch.
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the labelled row. Written as the `--switch-internal-max-width` custom
		 * property, so it composes with the tokens. Numbers are written as `px`. Without it the
		 * row is capped at `100%` of its container.
		 */
		maxWidth?: CSSProperties['maxWidth'];
		/**
		 * Additional CSS classes for the `<label>` wrapper that holds the switch and its text.
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
		 * A ref to the wrapper. The component's own `ref` is the switch itself.
		 */
		containerRef?: Ref<HTMLLabelElement>;
		/**
		 * Any `data-*` prop is accepted and forwarded to the switch itself.
		 */
		[key: `data-${string}`]: unknown;
	};
