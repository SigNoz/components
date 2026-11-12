import {
	type FormEvent,
	forwardRef,
	type ReactElement,
	type RefAttributes,
	useCallback,
} from 'react';
import type { RejectedProps } from '../lib/utils.js';
import styles from './form.module.scss';
import type { FormProps, ValidateFormProps } from './types.js';

const FormImpl = forwardRef<HTMLFormElement, FormProps>(function Form(
	{
		children,
		onSubmit,
		onReset,
		layout = 'vertical',
		autoComplete,
		testId,
		className: _className,
		style: _style,
		...props
	}: FormProps & RejectedProps,
	ref,
) {
	// React bubbles the submit and the reset of a form portalled out of this one, such as the form of
	// a Dialog opened from it, through this one. Those events belong to the other form.
	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			if (event.target !== event.currentTarget) {
				return;
			}

			event.preventDefault();
			onSubmit(event);
		},
		[onSubmit],
	);
	const handleReset = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			if (event.target === event.currentTarget) {
				onReset?.(event);
			}
		},
		[onReset],
	);

	return (
		<form
			{...props}
			ref={ref}
			noValidate
			autoComplete={autoComplete}
			onSubmit={handleSubmit}
			onReset={handleReset}
			className={styles['form']}
			data-slot="form"
			data-layout={layout}
			data-testid={testId}
		>
			{children}
		</form>
	);
});

/**
 * The `<form>` element and the rhythm between its fields. It holds no values and runs no
 * validation: the values live in react-hook-form or in the consumer's state, and `Field` shows
 * what the consumer decides is invalid.
 *
 * The form always calls `preventDefault()` on submit and then `onSubmit`, so the page never
 * reloads. It is always `noValidate`: the browser's own bubbles would show one error at a time on
 * top of the field message. It never posts natively, so `action`, `method`, `target` and `encType`
 * are not props.
 *
 * Every `aria-*` and any `data-*` are forwarded to the `<form>`. `className` and `style` are not
 * props, and a value that gets past the types is dropped: the spacing comes from `layout`.
 *
 * Visual values are `--form-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Layout
 *
 * `vertical` stacks the children 16px apart. `inline` puts them in one row 16px apart, wraps to a
 * new row 16px below when the width runs out, and lines the fields up on their bottom edge, so a
 * label that wraps does not push its control out of line. A two-column layout is the consumer's
 * grid. The form adds no padding of its own: the Dialog, Drawer or Card around it owns it.
 *
 * ### Submit
 *
 * Submit with a `Button` with `type="submit"`. A dialog with the buttons in its footer sets `form`
 * on the button to this form's `id`. `Enter` in a single-line text control submits through the
 * browser's implicit submission, which needs one of those buttons once the form has more than one
 * text control.
 *
 * A form in a Dialog or a Drawer opened from inside this one submits and resets on its own: this
 * form's `onSubmit` and `onReset` do not run for it.
 *
 * ### Asserting on it
 *
 * | attribute | value |
 * |---|---|
 * | `data-slot` | `"form"` |
 * | `data-layout` | `"vertical"` or `"inline"` |
 * | `data-testid` | `testId` |
 *
 * @example
 * ```tsx
 * const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onTouched' });
 *
 * <Form onSubmit={handleSubmit(save)}>
 *   <InputField label="Email" required error={errors.email?.message} {...register('email')} />
 *   <Button type="submit">Save</Button>
 * </Form>
 * ```
 */
export const Form = FormImpl as <T extends FormProps>(
	props: T &
		ValidateFormProps<T> &
		// `T` is inferred from the call site, so `T extends FormProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof FormProps | keyof RefAttributes<HTMLFormElement>>, never> &
		RefAttributes<HTMLFormElement>,
) => ReactElement;
