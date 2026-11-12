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
		Exclude<keyof T, keyof RadioGroupFieldProps | keyof RefAttributes<HTMLDivElement>>,
		never
	> &
	RefAttributes<HTMLDivElement>;

const RadioGroupFieldRoot = createFieldShorthand<RadioGroupFieldProps, HTMLDivElement>(
	RadioGroup as never,
	{ displayName: 'RadioGroupField', group: true },
);

/**
 * `RadioGroup` inside a `Field.Group`, from one object holding the props of both. It renders the
 * same DOM as the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the group. The label is its `<legend>`, and the radio group takes it as its name, takes
 * `aria-required` from `required`, and gets `aria-invalid` while the status is `danger`. Every
 * other prop goes to the radio group: `items`, `value`, `onChange`, `name`, `ref`, `aria-*`,
 * `data-*` and `testId` land where `RadioGroup` puts them. The group parts take `testId` as their
 * prefix (`${testId}-label`, `${testId}-message`), and the `<fieldset>` gets none.
 *
 * @example
 * ```tsx
 * <RadioGroupField
 *   label="Retention"
 *   color="primary"
 *   items={periods}
 *   error={errors.retention?.message}
 *   {...field}
 * />
 * ```
 */
export const RadioGroupField = RadioGroupFieldRoot as <T extends RadioGroupFieldProps>(
	props: Checked<T>,
) => ReactElement;
