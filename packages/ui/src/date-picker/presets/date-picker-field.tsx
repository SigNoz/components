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
 * Renders a `DatePicker` inside a `Field`, from one set of props. The DOM is the same as the
 * hand-written pair.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. It names and describes the trigger, and sets `aria-required` for
 * `required` and `aria-invalid` for `danger`. Every other prop goes to the date picker.
 *
 * Visual values are the `--field-*` and `--date-picker-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Dates
 *
 * The dates are native `Date`s. For a date picker made with `createDatePicker`, write the `Field`
 * around it by hand.
 *
 * ### Asserting on it
 *
 * `testId` is the date picker's own: `DatePicker` puts it on the trigger. The field parts take it
 * as their prefix, and the field root gets none.
 *
 * | `data-slot` | `data-testid` |
 * |---|---|
 * | `field-label` | `${testId}-label` |
 * | `field-label-tooltip` | `${testId}-label-tooltip` |
 * | `field-description` | `${testId}-description` |
 * | `field-message` | `${testId}-message` |
 *
 * The data attributes are those of `Field` and `DatePicker`. Use them, never the hashed class
 * names.
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
 * // react-hook-form: spread the Controller's field; `nullable` is for a zod `.nullable()` field
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
