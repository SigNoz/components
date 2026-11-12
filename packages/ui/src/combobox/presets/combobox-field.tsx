import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { Combobox } from '../combobox.js';
import type { ComboboxFieldProps, ValidateComboboxProps } from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateComboboxProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const ComboboxFieldImpl = createFieldShorthand<ComboboxFieldProps, HTMLElement>(Combobox as never, {
	displayName: 'ComboboxField',
});

/**
 * `Combobox` inside a `Field`, from one object holding the props of both. It renders the same DOM
 * as the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field, which hands `required` to the combobox and sets `aria-invalid` on its trigger
 * for a `danger` status. Every other prop goes to the combobox: `id`, `ref`, `aria-*`, `data-*`,
 * `searchInputProps` and `testId` land where `Combobox` puts them. The field parts take `testId`
 * as their prefix (`${testId}-label`, `${testId}-message`), and the field root gets none.
 *
 * The label names the trigger, in single and multiple mode, and a click on it focuses the trigger.
 * Only `danger` tints the frame, `warning` and `success` reach the label and the message.
 *
 * @example
 * ```tsx
 * <ComboboxField
 *   label="Service"
 *   required
 *   placeholder="Select a service..."
 *   searchInputProps={{ placeholder: 'Search services' }}
 *   items={services}
 *   error={errors.service?.message}
 *   value={service}
 *   onChange={setService}
 * />
 * ```
 */
export const ComboboxField = ComboboxFieldImpl as <T extends ComboboxFieldProps>(
	props: Checked<ComboboxFieldProps, HTMLElement, T>,
) => ReactElement;
