import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { Slider } from '../slider.js';
import type { SliderFieldProps, SliderFieldRangeProps, ValidateSliderProps } from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateSliderProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const SliderFieldRoot = createFieldShorthand<SliderFieldProps, HTMLInputElement>(Slider as never, {
	displayName: 'SliderField',
	refIsFocusTarget: true,
});
const SliderFieldRange = createFieldShorthand<SliderFieldRangeProps, HTMLInputElement>(
	Slider.Range as never,
	{ displayName: 'SliderField.Range', group: true, refIsFocusTarget: true },
);

/**
 * Renders a `Slider` inside a `Field`, from one set of props.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. Its label names the `Slider`. Every other prop goes to the `Slider`.
 *
 * Visual values are the `--field-*` and `--slider-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### The ref
 *
 * The `ref` is the native range `<input>` of the thumb, not the root `<div>` of `Slider`, which
 * `focus()` does nothing on.
 *
 * So `focus()` puts the focus on the thumb. That is how react-hook-form focuses the first invalid
 * field.
 *
 * ### Status and required
 *
 * Any status colors the label and the message, and `danger` also sets `aria-invalid` on the thumb.
 *
 * `required` only draws the asterisk. A slider always holds a value and takes no `aria-required`.
 *
 * ### Members
 *
 * `SliderField.Range` is the same for `Slider.Range`, inside a `Field.Group` instead of a
 * `Field`. Its legend names the range. Its root is a `role="group"`, which takes no
 * `aria-invalid`, so a `danger` status sets it on both thumbs.
 *
 * Its `ref` is the native range `<input>` of the first thumb.
 *
 * ### Asserting on it
 *
 * `testId` is the `Slider`'s own. The parts of the field take it as their prefix, and the field
 * root gets none. On `SliderField.Range` the `<fieldset>` gets none.
 *
 * | `data-testid` | rendered |
 * |---|---|
 * | `${testId}-label` | always, the `<label>`, or the `<legend>` on `SliderField.Range` |
 * | `${testId}-label-tooltip` | with `labelTooltip`, the info icon |
 * | `${testId}-description` | while `description` shows |
 * | `${testId}-message` | while a status message shows |
 *
 * The data attributes are those of `Field` and `Slider`, or of `Field.Group` and `Slider.Range` on
 * `SliderField.Range`. Use them, never the hashed class names.
 *
 * @example
 * ```tsx
 * <SliderField
 *   label="Sampling rate"
 *   color="primary"
 *   description="Share of requests that are traced."
 *   value={rate}
 *   onChange={setRate}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Two thumbs: value and onChange hold the lower and the upper bound
 * <SliderField.Range
 *   label="Duration"
 *   color="primary"
 *   max={100000}
 *   value={duration}
 *   onChange={setDuration}
 *   formatValue={(value) => `${value} ms`}
 *   error={errors.duration?.message}
 * />
 * ```
 */
export const SliderField = Object.assign(SliderFieldRoot, {
	Range: SliderFieldRange,
}) as (<T extends SliderFieldProps>(
	props: Checked<SliderFieldProps, HTMLInputElement, T>,
) => ReactElement) & {
	Range: <T extends SliderFieldRangeProps>(
		props: Checked<SliderFieldRangeProps, HTMLInputElement, T>,
	) => ReactElement;
};
