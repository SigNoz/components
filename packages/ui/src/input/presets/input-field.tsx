import type { ReactElement, RefAttributes } from 'react';
import { createFieldShorthand } from '../../field/field-shorthand.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { Input } from '../input.js';
import type {
	InputFieldNumberProps,
	InputFieldPasswordProps,
	InputFieldProps,
	InputFieldTextAreaProps,
	ValidateInputProps,
} from '../types.js';

type Checked<P, E, T extends P> = T &
	ValidateFieldProps<T> &
	ValidateInputProps<T> &
	// `T` is inferred from the call site, so `T extends P` alone never runs excess property checks.
	// Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof P | keyof RefAttributes<E>>, never> &
	RefAttributes<E>;

const InputFieldRoot = createFieldShorthand<InputFieldProps, HTMLInputElement>(Input as never, {
	displayName: 'InputField',
});
const InputFieldPassword = createFieldShorthand<InputFieldPasswordProps, HTMLInputElement>(
	Input.Password as never,
	{ displayName: 'InputField.Password' },
);
const InputFieldTextArea = createFieldShorthand<InputFieldTextAreaProps, HTMLTextAreaElement>(
	Input.TextArea as never,
	{ displayName: 'InputField.TextArea' },
);
const InputFieldNumber = createFieldShorthand<InputFieldNumberProps, HTMLInputElement>(
	Input.Number as never,
	{ displayName: 'InputField.Number' },
);

/**
 * Renders an `Input` inside a `Field`, from one set of props. The DOM is the same as the
 * hand-written pair.
 *
 * The field takes `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`,
 * `message` and `required`. It names and describes the input, and hands it `status` and
 * `aria-required`. Every other prop goes to the input.
 *
 * Visual values are the `--field-*` and `--input-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Members
 *
 * `InputField.Password`, `InputField.TextArea` and `InputField.Number` render the same pair around
 * `Input.Password`, `Input.TextArea` and `Input.Number`.
 *
 * ### Asserting on it
 *
 * `testId` is the input's own: `Input` puts it on the frame. The field parts take it as their
 * prefix, and the field root gets none.
 *
 * | `data-slot` | `data-testid` |
 * |---|---|
 * | `field-label` | `${testId}-label` |
 * | `field-label-tooltip` | `${testId}-label-tooltip` |
 * | `field-description` | `${testId}-description` |
 * | `field-message` | `${testId}-message` |
 *
 * The data attributes are those of `Field` and `Input`. Use them, never the hashed class names.
 *
 * @example
 * ```tsx
 * <InputField
 *   label="Email"
 *   required
 *   type="email"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // `InputField.Number` reports a number, so react-hook-form drives it through a `Controller`
 * <Controller
 *   control={control}
 *   name="replicas"
 *   render={({ field, fieldState }) => (
 *     <InputField.Number
 *       label="Replica count"
 *       min={1}
 *       error={fieldState.error?.message}
 *       {...field}
 *     />
 *   )}
 * />
 * ```
 */
export const InputField = Object.assign(InputFieldRoot, {
	Password: InputFieldPassword,
	TextArea: InputFieldTextArea,
	Number: InputFieldNumber,
}) as (<T extends InputFieldProps>(
	props: Checked<InputFieldProps, HTMLInputElement, T>,
) => ReactElement) & {
	Password: <T extends InputFieldPasswordProps>(
		props: Checked<InputFieldPasswordProps, HTMLInputElement, T>,
	) => ReactElement;
	TextArea: <T extends InputFieldTextAreaProps>(
		props: Checked<InputFieldTextAreaProps, HTMLTextAreaElement, T>,
	) => ReactElement;
	Number: <T extends InputFieldNumberProps>(
		props: Checked<InputFieldNumberProps, HTMLInputElement, T>,
	) => ReactElement;
};
