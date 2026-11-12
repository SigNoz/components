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
 * Renders a `ToggleGroup` inside a `Field.Group`, from one set of props.
 *
 * The group takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. Its legend is the label, and names the `role="group"` list of the
 * `ToggleGroup`. Every other prop goes to the `ToggleGroup`.
 *
 * Visual values are the `--field-*` and `--toggle-group-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### The ref
 *
 * The `ref` is the first pressed button, or the first button that is not disabled while nothing
 * is pressed, or the first button when every one is disabled. It is not the root `<div>` of
 * `ToggleGroup`, which `focus()` does nothing on.
 *
 * So `focus()` lands on a button. That is how react-hook-form focuses the first invalid field.
 *
 * ### Status and required
 *
 * The `role="group"` list takes neither `aria-invalid` nor `aria-required`. So `required` only
 * draws the asterisk in the legend, and a `danger` status sets `data-invalid` on the root of the
 * `ToggleGroup`.
 *
 * The status shows in the legend and the message.
 *
 * ### Asserting on it
 *
 * `testId` is the `ToggleGroup`'s own. The parts of the group take it as their prefix, and the
 * `<fieldset>` gets none.
 *
 * | `data-testid` | rendered |
 * |---|---|
 * | `${testId}-label` | always, the `<legend>` |
 * | `${testId}-label-tooltip` | with `labelTooltip`, the info icon |
 * | `${testId}-description` | while `description` shows |
 * | `${testId}-message` | while a status message shows |
 *
 * The data attributes are those of `Field.Group` and `ToggleGroup`. Use them, never the hashed
 * class names.
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
 *
 * @example
 * ```tsx
 * // react-hook-form: `field` carries value, onChange, onBlur, name and ref
 * <Controller
 *   control={control}
 *   name="layout"
 *   render={({ field, fieldState }) => (
 *     <ToggleGroupField
 *       label="Layout"
 *       type="single"
 *       variant="outlined"
 *       color="secondary"
 *       size="md"
 *       items={layouts}
 *       error={fieldState.error?.message}
 *       {...field}
 *     />
 *   )}
 * />
 * ```
 */
export const ToggleGroupField = ToggleGroupFieldRoot as <T extends ToggleGroupFieldProps>(
	props: Checked<T>,
) => ReactElement;
