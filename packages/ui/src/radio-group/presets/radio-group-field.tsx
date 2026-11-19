import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { RadioGroup } from '../radio-group.js';
import type { RadioGroupFieldProps, ValidateRadioGroupProps } from '../types.js';

type Checked<T extends RadioGroupFieldProps> = T &
	ValidateFieldProps<T> &
	ValidateRadioGroupProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<
		Exclude<keyof T, keyof RadioGroupFieldProps | keyof RefAttributes<HTMLInputElement>>,
		never
	> &
	RefAttributes<HTMLInputElement>;

const RadioGroupFieldRoot = createFieldShorthand<RadioGroupFieldProps, HTMLInputElement>(
	RadioGroup as never,
	{ displayName: 'RadioGroupField', group: true, refIsFocusTarget: true },
);

/**
 * Renders a `RadioGroup` inside a `Field.Group`, from one set of props.
 *
 * The group takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. Its legend is the label, and names the `RadioGroup`. `required` sets
 * `aria-required` on the `RadioGroup`, and a `danger` status sets `aria-invalid`. Every other
 * prop goes to the `RadioGroup`.
 *
 * Visual values are the `--field-*` and `--radio-group-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### The ref
 *
 * The `ref` is the hidden `<input>` of the checked radio, or of the first radio while none is
 * checked. A disabled radio is never the one. It is not the root `<div>` of `RadioGroup`, which
 * `focus()` does nothing on.
 *
 * The input hands its focus to its radio, so `focus()` lands on the radio. That is how
 * react-hook-form focuses the first invalid field.
 *
 * While the group is disabled, every radio is, so the `ref` is `null`.
 *
 * ### Asserting on it
 *
 * `testId` is the `RadioGroup`'s own. The parts of the group take it as their prefix, and the
 * `<fieldset>` gets none.
 *
 * | `data-testid` | rendered |
 * |---|---|
 * | `${testId}-label` | always, the `<legend>` |
 * | `${testId}-label-tooltip` | with `labelTooltip`, the info icon |
 * | `${testId}-description` | while `description` shows |
 * | `${testId}-message` | while a status message shows |
 *
 * The data attributes are those of `Field.Group` and `RadioGroup`. Use them, never the hashed
 * class names.
 *
 * @example
 * ```tsx
 * <RadioGroupField
 *   label="Retention"
 *   description="How long the data is kept."
 *   color="primary"
 *   items={periods}
 *   value={retention}
 *   onChange={setRetention}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // react-hook-form: `field` carries value, onChange, onBlur, name and ref
 * <Controller
 *   control={control}
 *   name="retention"
 *   render={({ field, fieldState }) => (
 *     <RadioGroupField
 *       label="Retention"
 *       color="primary"
 *       items={periods}
 *       error={fieldState.error?.message}
 *       {...field}
 *     />
 *   )}
 * />
 * ```
 */
export const RadioGroupField = RadioGroupFieldRoot as <T extends RadioGroupFieldProps>(
	props: Checked<T>,
) => ReactElement;
