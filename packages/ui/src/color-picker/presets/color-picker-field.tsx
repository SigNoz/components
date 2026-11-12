import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { ColorPicker } from '../color-picker.js';
import type { ColorPickerFieldProps, ValidateColorPickerProps } from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateColorPickerProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const ColorPickerFieldRoot = createFieldShorthand<ColorPickerFieldProps, HTMLElement>(
	ColorPicker as never,
	{ displayName: 'ColorPickerField' },
);

/**
 * `ColorPicker` inside a `Field`, from one object holding the props of both. It renders the same
 * DOM as the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field, which names and describes the trigger and hands it `aria-invalid` for
 * `danger`. Every other prop goes to the picker: `children`, `value`, `onChange`, `onBlur`, `name`,
 * `ref`, `aria-*`, `data-*` and `testId` land where `ColorPicker` puts them, and `id` stays the id
 * of the popup. The field parts take `testId` as their prefix (`${testId}-label`,
 * `${testId}-message`), and the field root gets none.
 *
 * A `<button>` trigger is named by the label. Its `aria-label` outranks the label, so leave it out
 * inside a field, or make it repeat the label.
 *
 * @example
 * ```tsx
 * <ColorPickerField
 *   label="Series color"
 *   nativeButton
 *   side="bottom"
 *   align="start"
 *   value={color}
 *   onAfterChange={setColor}
 * >
 *   <button type="button">
 *     <Swatch color={color} />
 *   </button>
 * </ColorPickerField>
 * ```
 *
 * @example
 * ```tsx
 * // The `field` of a react-hook-form `Controller` spreads as is: `value`, `onChange`, `onBlur`,
 * // `name` and `ref` all land on the picker. A nullable schema field, such as a zod `.nullable()`
 * // one, adds `nullable`.
 * <Controller
 *   control={control}
 *   name="color"
 *   render={({ field, fieldState }) => (
 *     <ColorPickerField
 *       label="Series color"
 *       nativeButton
 *       side="bottom"
 *       align="start"
 *       allowClear
 *       nullable
 *       {...field}
 *       error={fieldState.error?.message}
 *     >
 *       <button type="button">
 *         <Swatch color={field.value} />
 *       </button>
 *     </ColorPickerField>
 *   )}
 * />
 * ```
 */
export const ColorPickerField = ColorPickerFieldRoot as <T extends ColorPickerFieldProps>(
	props: Checked<ColorPickerFieldProps, HTMLElement, T>,
) => ReactElement;
