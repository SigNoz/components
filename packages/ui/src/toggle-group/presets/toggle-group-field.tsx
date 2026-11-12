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
		Exclude<keyof T, keyof ToggleGroupFieldProps | keyof RefAttributes<HTMLDivElement>>,
		never
	> &
	RefAttributes<HTMLDivElement>;

const ToggleGroupFieldRoot = createFieldShorthand<ToggleGroupFieldProps, HTMLDivElement>(
	ToggleGroup as never,
	{ displayName: 'ToggleGroupField', group: true },
);

/**
 * `ToggleGroup` inside a `Field.Group`, from one object holding the props of both. It renders the
 * same DOM as the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the group. The label is its `<legend>`, and the `role="group"` list of the bar takes it as
 * its name. Every other prop goes to the bar: `type`, `items`, `value`, `onChange`, `ref`, `aria-*`,
 * `data-*` and `testId` land where `ToggleGroup` puts them. The group parts take `testId` as their
 * prefix (`${testId}-label`, `${testId}-message`), and the `<fieldset>` gets none.
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
