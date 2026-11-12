import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { Select } from '../select.js';
import type { SelectFieldProps, ValidateSelectProps } from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateSelectProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const SelectFieldRoot = createFieldShorthand<SelectFieldProps, HTMLElement>(Select as never, {
	displayName: 'SelectField',
});

/**
 * `Select` inside a `Field`, from one object holding the props of both. It renders the same DOM as
 * the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field, which names and describes the trigger, hands it `aria-invalid` for `danger` and
 * `required`. Every other prop goes to the select: `items`, `placeholder`, `multiple`, `value`,
 * `onChange`, `id`, `ref`, `aria-*`, `data-*` and `testId` land where `Select` puts them. The field
 * parts take `testId` as their prefix (`${testId}-label`, `${testId}-message`), and the field root
 * gets none.
 *
 * With `multiple` the trigger is a `<div>`: the field still names it and focuses it when the label
 * is clicked.
 *
 * @example
 * ```tsx
 * <SelectField
 *   label="Framework"
 *   placeholder="Select a framework..."
 *   items={frameworks}
 *   value={framework}
 *   onChange={setFramework}
 *   error={errors.framework?.message}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // The `field` of a react-hook-form `Controller` spreads as is: `value`, `onChange`, `onBlur`,
 * // `name` and `ref` all land on the select. A nullable schema field, such as a zod `.nullable()`
 * // one, adds `nullable`.
 * <Controller
 *   control={control}
 *   name="framework"
 *   render={({ field, fieldState }) => (
 *     <SelectField
 *       label="Framework"
 *       placeholder="Select a framework..."
 *       items={frameworks}
 *       {...field}
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 * ```
 */
export const SelectField = SelectFieldRoot as <T extends SelectFieldProps>(
	props: Checked<SelectFieldProps, HTMLElement, T>,
) => ReactElement;
