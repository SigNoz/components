import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupFieldProps, ValidateToggleGroupProps } from '../types.js';

type Checked<T extends ToggleGroupFieldProps> = T &
	ValidateFieldProps<T> &
	ValidateToggleGroupProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<
		Exclude<keyof T, keyof ToggleGroupFieldProps | keyof RefAttributes<HTMLButtonElement>>,
		never
	> &
	RefAttributes<HTMLButtonElement>;

const ToggleGroupFieldRoot = createFieldShorthand<ToggleGroupFieldProps, HTMLButtonElement>(
	ToggleGroup as never,
	{ displayName: 'ToggleGroupField', group: true, refIsFocusTarget: true },
);

/**
 * `ToggleGroup` inside a `Field.Group`, from one object holding the props of both. It renders the
 * same DOM as the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the group. The label is its `<legend>`, and the `role="group"` list of the bar takes it as
 * its name. Every other prop goes to the bar: `type`, `items`, `value`, `onChange`, `onBlur`, `name`,
 * `aria-*`, `data-*` and `testId` land where `ToggleGroup` puts them. The group parts take
 * `testId` as their prefix (`${testId}-label`, `${testId}-message`), and the `<fieldset>` gets
 * none.
 *
 * The `ref` is the pressed button, or the first one that is not disabled while nothing is
 * pressed, and not the root `<div>` of `ToggleGroup`. Its `focus()` puts the focus on that button,
 * which is how react-hook-form focuses the first invalid field.
 *
 * A toggle group has nothing to mark invalid or required, because `role="group"` takes neither
 * `aria-invalid` nor `aria-required`. `required` shows the asterisk, and the legend and the message
 * carry the status.
 *
 * @example
 * ```tsx
 * <ToggleGroupField
 *   label="Layout"
 *   type="single"
 *   variant="outlined"
 *   color="secondary"
 *   size="md"
 *   items={layouts}
 *   value={layout}
 *   onChange={setLayout}
 * />
 * ```
 */
export const ToggleGroupField = ToggleGroupFieldRoot as <T extends ToggleGroupFieldProps>(
	props: Checked<T>,
) => ReactElement;
