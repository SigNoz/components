import type { AriaAttributes, ComponentProps, CSSProperties, ReactNode } from 'react';
import type { SLIDER_OWN_ARIA_ATTRIBUTES, SliderColor, SliderTextOverflow } from './constants.js';

export type SliderColorType = (typeof SliderColor)[keyof typeof SliderColor];

export type SliderTextOverflowType = (typeof SliderTextOverflow)[keyof typeof SliderTextOverflow];

/**
 * The value of `Slider.Range`, the lower bound first.
 */
export type SliderRangeValue = [number, number];

type SliderBaseProps = Pick<ComponentProps<'div'>, 'id'> & {
	/**
	 * The start of the scale.
	 *
	 * @note A `max` that is not above `min` is a bug.
	 *
	 * @default 0
	 */
	min?: number;
	/**
	 * The end of the scale.
	 *
	 * @default 100
	 */
	max?: number;
	/**
	 * The distance between two values a thumb can stop at.
	 *
	 * @note `PageUp`, `PageDown` and `Shift` with an arrow move one large step: 10% of
	 * `max - min`, rounded to a multiple of `step`, and at least one `step`.
	 *
	 * @default 1
	 */
	step?: number;
	/**
	 * The color of the fill, the thumb border and the mark dots. The track and the dots outside
	 * the fill are tints of it.
	 *
	 * @note Required, with no default, like `Badge` and `Progress`.
	 */
	color: SliderColorType;
	/**
	 * Labels under the track, keyed by the value they point at. Each mark also draws a dot on the
	 * track, at the same position.
	 *
	 * @note A click on a label or its dot moves the closest thumb to the mark value. Marks are not
	 * tab stops, and the label row is hidden from screen readers.
	 *
	 * @note A mark outside `min` and `max` is not rendered.
	 *
	 * @note Each label has the room up to halfway to the mark on each side, or up to the end of the
	 * slider when there is no mark on that side. `textOverflow` says what a longer label does.
	 */
	marks?: Record<number, string>;
	/**
	 * Controls how a mark label behaves when it is longer than its room.
	 *
	 * `ellipsis` truncates the label and shows the full text in a tooltip under it on hover, and
	 * only while the label is actually truncated. `wrap` breaks the label into as many lines as it
	 * needs, and the label row grows to the tallest label.
	 *
	 * @note The tooltip is exclusive to `ellipsis`. The `disabledTooltip` or `readOnlyTooltip` on
	 * screen stacks above it, reason first.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: SliderTextOverflowType;
	/**
	 * Shows the value of each thumb in a tooltip above it, while the thumb is hovered, pressed,
	 * dragged or focused with the keyboard.
	 *
	 * @note Never opens while `disabled`, nor while `readOnly` with a `readOnlyTooltip`, which
	 * takes its place.
	 *
	 * @default false
	 */
	tooltip?: boolean;
	/**
	 * Formats a value for the tooltip and for `aria-valuetext`, so a screen reader reads
	 * `1,000 GB` and not `50`. Without it, both use the raw number.
	 */
	formatValue?: (value: number) => string;
	/**
	 * Identifies the field when the owning form is submitted. `Slider.Range` submits two values
	 * under this name, the lower bound first.
	 */
	name?: string;
	/**
	 * The id of the owning form, for a slider rendered outside the `<form>` element.
	 */
	form?: string;
	/**
	 * Accepted so a form can pass the same field props to every control. It has no effect: a
	 * slider always holds a value between `min` and `max`, so it never blocks the submit.
	 *
	 * @default false
	 */
	required?: boolean;
	/**
	 * Blocks the slider: drag, a click on the track or on a mark, and the keys. The thumbs leave
	 * the tab order and the slider is left out of the form submit.
	 *
	 * @note Requires `disabledTooltip`.
	 *
	 * @note Ignored while `readOnly` is true, along with `disabledTooltip`.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Why the slider cannot be used, shown in a tooltip on hover while `disabled` is true. Empty
	 * content renders no tooltip.
	 *
	 * @note Only allowed alongside `disabled`.
	 *
	 * @note Does not render while `readOnly` is true. `readOnlyTooltip` takes that place.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	disabledTooltip?: ReactNode;
	/**
	 * Locks the value: drag, a click on the track or on a mark, and the keys change nothing, and
	 * `onChange` and `onAfterChange` are not called. The thumbs stay in the tab order, announce
	 * the value, and the slider is still submitted with its form.
	 *
	 * @note Requires `readOnlyTooltip`.
	 *
	 * @note Outranks `disabled`: while this is true the slider is not disabled at all.
	 *
	 * @default false
	 */
	readOnly?: boolean;
	/**
	 * Why the value is locked, shown in a tooltip on hover and on keyboard focus while `readOnly`
	 * is true. Empty content renders no tooltip.
	 *
	 * @note Only allowed alongside `readOnly`.
	 *
	 * @note Takes the place of `disabledTooltip`, and of the value tooltip of `tooltip`, while it
	 * is shown.
	 *
	 * @note Pass `undefined` explicitly when there is no reason to give.
	 */
	readOnlyTooltip?: ReactNode;
	/**
	 * The width of the slider. Without it the slider fills its parent. Numbers are written as
	 * `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of the slider. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * Forwarded to the root as `data-testid`. The parts take it as a prefix: `${testId}-track`,
	 * `${testId}-indicator`, `${testId}-thumb-0` (and `${testId}-thumb-1` on `Slider.Range`) and
	 * `${testId}-mark-${value}`.
	 */
	testId?: string;
	/**
	 * Any `data-*` prop is accepted and forwarded to the root.
	 */
	[key: `data-${string}`]: unknown;
};

// JSX does not run excess property checks on hyphenated names, so the call site is rejected by the
// signature of `Slider`, which pins every key outside the props to `never`. This `Omit` is what
// leaves them outside. The slider drops a caller value for them at runtime too.
type SliderAriaAttributes = Omit<AriaAttributes, (typeof SLIDER_OWN_ARIA_ATTRIBUTES)[number]>;

/**
 * The rules below are the ones a union cannot express without blowing up {@link SliderProps}
 * into a cross product. Each is an object whose single required key is the sentence the compiler
 * should print, so a violation reads as `Property '<the sentence>' is missing ... but required in
 * type '<the rule name>'` instead of pointing at an unrelated prop.
 */
interface ADisabledSliderMustSayWhy {
	'`disabled` needs `disabledTooltip`, a disabled control has to tell the user why it cannot be used': never;
}

interface ADisabledReasonNeedsADisabledSlider {
	'`disabledTooltip` only renders while `disabled` is set, add `disabled` or drop the tooltip': never;
}

interface AReadOnlySliderMustSayWhy {
	'`readOnly` needs `readOnlyTooltip`, a locked control has to tell the user why it cannot change': never;
}

interface AReadOnlyReasonNeedsAReadOnlySlider {
	'`readOnlyTooltip` only renders while `readOnly` is set, add `readOnly` or drop the tooltip': never;
}

/**
 * Extra constraints layered on top of {@link SliderProps} and {@link SliderRangeProps} at the call
 * site.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 *
 * The pairing rules look at which props the call site writes, not at their values: `disabled`
 * typed `boolean | undefined` is still `disabled`, and `disabledTooltip={undefined}` is the
 * explicit opt-out for a call site that has no reason to give.
 *
 * @note A wrapper that forwards the whole `SliderProps` type is not checked: `T` is then the type
 * itself, every branch of the conditional is taken at once, and `unknown` from the passing
 * branches absorbs the rest. Such a wrapper is checked at its own call sites instead.
 */
export type ValidateSliderProps<T> = (T extends { disabled: boolean | undefined }
	? T extends { disabledTooltip: ReactNode }
		? unknown
		: ADisabledSliderMustSayWhy
	: unknown) &
	(T extends { disabledTooltip: ReactNode }
		? T extends { disabled: boolean | undefined }
			? unknown
			: ADisabledReasonNeedsADisabledSlider
		: unknown) &
	(T extends { readOnly: boolean | undefined }
		? T extends { readOnlyTooltip: ReactNode }
			? unknown
			: AReadOnlySliderMustSayWhy
		: unknown) &
	(T extends { readOnlyTooltip: ReactNode }
		? T extends { readOnly: boolean | undefined }
			? unknown
			: AReadOnlyReasonNeedsAReadOnlySlider
		: unknown);

export type SliderProps = SliderBaseProps &
	SliderAriaAttributes & {
		/**
		 * The controlled value.
		 *
		 * @note A value that is not a finite number renders the thumb at `min`, and one below
		 * `min` or above `max` renders the thumb at the nearest end. The slider never calls
		 * `onChange` to correct it.
		 */
		value?: number;
		/**
		 * The initial value when `value` is not set. Without both, the thumb starts at `min`.
		 */
		defaultValue?: number;
		/**
		 * Called on every change: while the thumb drags, on a click on the track or a mark, and on
		 * each key press.
		 */
		onChange?: (value: number) => void;
		/**
		 * Called once when a change ends: on pointer release, on each key press, and on a click on
		 * a mark.
		 */
		onAfterChange?: (value: number) => void;
	};

export type SliderRangeProps = SliderBaseProps &
	SliderAriaAttributes & {
		/**
		 * The controlled value, the lower bound first.
		 *
		 * @note Each value renders the way it does on `Slider`. A pair with the first value above
		 * the second is a bug.
		 */
		value?: readonly [number, number];
		/**
		 * The initial value when `value` is not set. Without both, the thumbs start at `min` and
		 * `max`.
		 */
		defaultValue?: readonly [number, number];
		/**
		 * Called on every change, the same as on `Slider`, with both values.
		 */
		onChange?: (value: SliderRangeValue) => void;
		/**
		 * Called once when a change ends, the same as on `Slider`, with both values.
		 */
		onAfterChange?: (value: SliderRangeValue) => void;
	};
