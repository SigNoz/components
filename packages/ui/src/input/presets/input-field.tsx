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
 * `Input` inside a `Field`, from one object holding the props of both. It renders the same DOM as
 * the hand-written pair and adds nothing of its own.
 *
 * `label`, `labelIcon`, `labelTooltip`, `description`, `error`, `status`, `message` and `required`
 * go to the field, which hands `status` and `required` to the input. Every other prop goes to the
 * input: `id`, `ref`, `name`, `aria-*`, `data-*` and `testId` land where `Input` puts them. The
 * field parts take `testId` as their prefix (`${testId}-label`, `${testId}-message`), and the field
 * root gets none.
 *
 * `InputField.Password`, `InputField.TextArea` and `InputField.Number` do the same for the members
 * of `Input`.
 *
 * @example
 * ```tsx
 * <InputField label="Email" required type="email" error={errors.email?.message} {...register('email')} />
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
