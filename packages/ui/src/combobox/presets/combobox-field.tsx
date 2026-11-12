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
 * Renders a `Combobox` inside a `Field`, from one set of props. The DOM is the same as the
 * hand-written pair.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. It names and describes the trigger, and sets `aria-required` for
 * `required` and `aria-invalid` for `danger`. Every other prop goes to the combobox.
 *
 * Visual values are the `--field-*` and `--combobox-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Accessible name
 *
 * The field's label names the trigger and the popup, in single and multiple mode, and a click on
 * the label focuses the trigger. An `aria-label` or `aria-labelledby` on the combobox replaces the
 * label as the name.
 *
 * ### Asserting on it
 *
 * `testId` is the combobox's own: `Combobox` puts it on the trigger. The field parts take it as
 * their prefix, and the field root gets none.
 *
 * | `data-slot` | `data-testid` |
 * |---|---|
 * | `field-label` | `${testId}-label` |
 * | `field-label-tooltip` | `${testId}-label-tooltip` |
 * | `field-description` | `${testId}-description` |
 * | `field-message` | `${testId}-message` |
 *
 * The data attributes are those of `Field` and `Combobox`. Use them, never the hashed class names.
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
