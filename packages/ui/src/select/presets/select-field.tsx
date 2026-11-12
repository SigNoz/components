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
 * Renders a `Select` inside a `Field`, from one set of props. The DOM is the same as the
 * hand-written pair.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. It names and describes the trigger, and sets `aria-required` for
 * `required` and `aria-invalid` for `danger`. Every other prop goes to the select.
 *
 * Visual values are the `--field-*` and `--select-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Multiple
 *
 * With `multiple` the trigger is a `<div>`. The field still names it, and a click on the label
 * focuses it.
 *
 * ### Asserting on it
 *
 * `testId` is the select's own: `Select` puts it on the trigger. The field parts take it as their
 * prefix, and the field root gets none.
 *
 * | `data-slot` | `data-testid` |
 * |---|---|
 * | `field-label` | `${testId}-label` |
 * | `field-label-tooltip` | `${testId}-label-tooltip` |
 * | `field-description` | `${testId}-description` |
 * | `field-message` | `${testId}-message` |
 *
 * The data attributes are those of `Field` and `Select`. Use them, never the hashed class names.
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
 * <Controller
 *   control={control}
 *   name="framework"
 *   render={({ field, fieldState }) => (
 *     <SelectField
 *       label="Framework"
 *       placeholder="Select a framework..."
 *       items={frameworks}
 *       value={field.value}
 *       onChange={field.onChange}
 *       ref={field.ref}
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 * ```
 */
export const SelectField = SelectFieldRoot as <T extends SelectFieldProps>(
	props: Checked<SelectFieldProps, HTMLElement, T>,
) => ReactElement;
