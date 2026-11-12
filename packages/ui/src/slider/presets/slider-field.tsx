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

const SliderFieldRoot = createFieldShorthand<SliderFieldProps, HTMLDivElement>(Slider as never, {
	displayName: 'SliderField',
});
const SliderFieldRange = createFieldShorthand<SliderFieldRangeProps, HTMLDivElement>(
	Slider.Range as never,
	{ displayName: 'SliderField.Range', group: true },
);

/**
 * `Slider` inside a `Field`, from one object holding the props of both. It renders the same DOM as
 * the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field. Every other prop goes to the slider: `id`, `ref`, `name`, `aria-*`, `data-*` and
 * `testId` land where `Slider` puts them. The field parts take `testId` as their prefix
 * (`${testId}-label`, `${testId}-message`), and the field root gets none.
 *
 * A slider has no frame, so `status` shows on the label and the message, and `danger` sets
 * `aria-invalid` on the thumb. `required` only draws the asterisk: a slider always holds a value,
 * so it takes no `required` or `aria-required`.
 *
 * `SliderField.Range` does the same for `Slider.Range` inside a `Field.Group`, which names the
 * range with its legend.
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
	props: Checked<SliderFieldProps, HTMLDivElement, T>,
) => ReactElement) & {
	Range: <T extends SliderFieldRangeProps>(
		props: Checked<SliderFieldRangeProps, HTMLDivElement, T>,
	) => ReactElement;
};
