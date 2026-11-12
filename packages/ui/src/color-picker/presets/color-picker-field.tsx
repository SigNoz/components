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
 * Renders a `ColorPicker` inside a `Field`, from one set of props. The DOM is the same as the
 * hand-written pair.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. It names and describes the trigger, and sets `aria-invalid` for
 * `danger`. Every other prop goes to the picker.
 *
 * Visual values are the `--field-*` and `--color-picker-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Accessible name
 *
 * The field's label names the trigger. A trigger with an `aria-label` or `aria-labelledby` of its
 * own keeps that name instead, so leave `aria-label` out inside a field, or make it repeat the
 * label.
 *
 * ### Asserting on it
 *
 * `testId` is the picker's own: `ColorPicker` puts it on the trigger. The field parts take it as
 * their prefix, and the field root gets none.
 *
 * | `data-slot` | `data-testid` |
 * |---|---|
 * | `field-label` | `${testId}-label` |
 * | `field-label-tooltip` | `${testId}-label-tooltip` |
 * | `field-description` | `${testId}-description` |
 * | `field-message` | `${testId}-message` |
 *
 * The data attributes are those of `Field` and `ColorPicker`. Use them, never the hashed class
 * names.
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
 * // react-hook-form: spread the Controller's field; `nullable` is for a zod `.nullable()` field
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
