import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { DatePicker } from '../date-picker.js';
import type { DatePickerFieldProps, ValidateDatePickerProps } from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateDatePickerProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const DatePickerFieldRoot = createFieldShorthand<DatePickerFieldProps, HTMLButtonElement>(
	DatePicker as never,
	{ displayName: 'DatePickerField' },
);

/**
 * `DatePicker` inside a `Field`, from one object holding the props of both. It renders the same
 * DOM as the hand-written pair and adds nothing of its own. Its dates are native `Date`s; for a
 * date picker made with `createDatePicker`, write the `Field` around it by hand.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field, which names and describes the trigger and hands it `aria-required` and, for
 * `danger`, `aria-invalid`. Every other prop goes to the date picker: `value`, `onChange`,
 * `onBlur`, `name`, `ref`, `id`, `aria-*`, `data-*` and `testId` land where `DatePicker` puts
 * them. The field parts take `testId` as their prefix (`${testId}-label`, `${testId}-message`),
 * and the field root gets none.
 *
 * @example
 * ```tsx
 * <DatePickerField
 *   label="Expiry"
 *   placeholder="Select date"
 *   value={expiry}
 *   onChange={setExpiry}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // The `field` of a react-hook-form `Controller` spreads as is: `value`, `onChange`, `onBlur`,
 * // `name` and `ref` all land on the date picker. A nullable schema field, such as a zod
 * // `.nullable()` one, adds `nullable`.
 * <Controller
 *   control={control}
 *   name="expiry"
 *   render={({ field, fieldState }) => (
 *     <DatePickerField
 *       label="Expiry"
 *       placeholder="Select date"
 *       allowClear
 *       nullable
 *       {...field}
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 * ```
 */
export const DatePickerField = DatePickerFieldRoot as <T extends DatePickerFieldProps>(
	props: Checked<DatePickerFieldProps, HTMLButtonElement, T>,
) => ReactElement;
