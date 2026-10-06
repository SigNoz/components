import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import { InputBase } from './subcomponents/input-base.js';
import { InputNumber } from './subcomponents/input-number.js';
import { InputPassword } from './subcomponents/input-password.js';
import { InputTextArea } from './subcomponents/input-textarea.js';
import type {
	InputNumberProps,
	InputPasswordProps,
	InputProps,
	InputTextAreaProps,
	ValidateInputProps,
} from './types.js';

/**
 * A one-line text field: a native `<input>` inside a frame that owns the border, the sizes, the
 * validation states and the `prefix`/`suffix` slots. `Input.Password`, `Input.TextArea` and
 * `Input.Number` swap the control and keep the frame.
 *
 * Every native input prop is forwarded to the `<input>`, so react-hook-form's `register()`
 * spreads straight onto it. Every `aria-*` goes to the `<input>` too; any `data-*` goes to the
 * frame.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped.
 *
 * Visual values are `--input-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The input has no visible label of its own. Name it with `aria-label` or `aria-labelledby`, or
 * with a `<label htmlFor>` that matches `id`.
 *
 * ### Status
 *
 * `status` tints the border and the background and renders a matching icon at the trailing edge,
 * after the `suffix`. `danger` also announces itself as `aria-invalid`. `success` is confirmation
 * of a completed check (name available, connection verified), not a resting state for a valid
 * field.
 *
 * ### Focus
 *
 * Keyboard focus draws a 1px ring one pixel outside the field edge, on `:focus-visible` only. The
 * border itself never changes color on focus: the ring is the one focus signal, the same as every
 * other control. `noFocusRing` is for a surface that draws a focus treatment of its own; it never
 * goes with `variant="unstyled"`, where the ring is all that marks focus.
 *
 * ### Disabled and read-only
 *
 * `disabled` fades the field, blocks typing, and leaves it out of the tab order and the form
 * submit. Hover still opens `disabledTooltip`: the pointer finds the frame, not the `<input>`.
 *
 * `readOnly` fades it less and locks the value; the field keeps its tab stop and its value stays
 * selectable and copyable. `readOnlyTooltip` opens on hover and on keyboard focus.
 *
 * `readOnly` outranks `disabled`: with both, the field is only read-only.
 *
 * Each state travels with its reason: `disabled` with `disabledTooltip`, `readOnly` with
 * `readOnlyTooltip`. Pass the reason as `undefined` when there is none to give.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the frame, and the prefix of the parts. The `<input>` itself is
 * `` `${testId}-field` ``, or `getByRole('textbox')`. Otherwise use the data attributes, never the
 * hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"input"` |
 * | `data-size` | `"base"` or `"large"` |
 * | `data-variant` | `"default"` or `"unstyled"` |
 * | `data-status` | mirrors the resolved status, absent without one |
 * | `data-disabled` | present while disabled, and not read-only |
 * | `data-readonly` | present while `readOnly` |
 * | `data-no-focus-ring` | present with `noFocusRing` |
 * | `data-member` | `"password"`, `"textarea"` or `"number"` on the members, absent on `Input` |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `input-field` | always, the native control | `${testId}-field` |
 * | `input-prefix` | while `prefix` renders something | `${testId}-prefix` |
 * | `input-suffix` | while `suffix` renders something | `${testId}-suffix` |
 * | `input-status-icon` | while `status` is set, `aria-hidden` | `${testId}-status` |
 *
 * @example
 * ```tsx
 * <Input placeholder="For eg. Simpsonville..." prefix={<Search />} aria-label="Organisation" />
 * ```
 *
 */
const InputRoot = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
	return <InputBase {...props} ref={ref} />;
});

// `T` is inferred from the call site, so `T extends InputProps` alone never runs excess property
// checks. Every key outside the props is pinned to `never` instead.
export const Input = Object.assign(InputRoot, {
	Password: InputPassword,
	TextArea: InputTextArea,
	Number: InputNumber,
}) as (<T extends InputProps>(
	props: T &
		ValidateInputProps<T> &
		Record<Exclude<keyof T, keyof InputProps | keyof RefAttributes<HTMLInputElement>>, never> &
		RefAttributes<HTMLInputElement>,
) => ReactElement) & {
	Password: (<T extends InputPasswordProps>(
		props: T &
			ValidateInputProps<T> &
			Record<
				Exclude<keyof T, keyof InputPasswordProps | keyof RefAttributes<HTMLInputElement>>,
				never
			> &
			RefAttributes<HTMLInputElement>,
	) => ReactElement) & { displayName: string };
	TextArea: (<T extends InputTextAreaProps>(
		props: T &
			ValidateInputProps<T> &
			Record<
				Exclude<keyof T, keyof InputTextAreaProps | keyof RefAttributes<HTMLTextAreaElement>>,
				never
			> &
			RefAttributes<HTMLTextAreaElement>,
	) => ReactElement) & { displayName: string };
	Number: (<T extends InputNumberProps>(
		props: T &
			ValidateInputProps<T> &
			Record<
				Exclude<keyof T, keyof InputNumberProps | keyof RefAttributes<HTMLInputElement>>,
				never
			> &
			RefAttributes<HTMLInputElement>,
	) => ReactElement) & { displayName: string };
};
