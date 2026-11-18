import type { AriaAttributes, ComponentProps, FormEvent, ReactNode } from 'react';
import type { FormLayout } from './constants.js';

export type FormLayoutType = (typeof FormLayout)[keyof typeof FormLayout];

export type FormProps = Pick<ComponentProps<'form'>, 'id'> &
	AriaAttributes & {
		/**
		 * The fields, groups and action buttons of the form. Any element is allowed, not only
		 * `Field`.
		 */
		children: ReactNode;
		/**
		 * Called when the form is submitted. The form has already called `preventDefault()`, so the
		 * page never reloads.
		 *
		 * @note Submit with a `Button` with `type="submit"`, inside the form, or outside it with
		 * `form` set to this form's `id`.
		 */
		onSubmit: (event: FormEvent<HTMLFormElement>) => void;
		/**
		 * Called when a `type="reset"` button resets the form. The native reset only clears
		 * uncontrolled native inputs: with react-hook-form, call `reset()` here.
		 */
		onReset?: (event: FormEvent<HTMLFormElement>) => void;
		/**
		 * How the children sit: `vertical` stacks them 16px apart, `inline` places them in a row
		 * 16px apart and wraps when the width runs out.
		 *
		 * @default 'vertical'
		 */
		layout?: FormLayoutType;
		/**
		 * Turns the browser's saved values on or off for every field.
		 */
		autoComplete?: 'on' | 'off';
		/**
		 * Forwarded to the `<form>` as `data-testid`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the `<form>`.
		 */
		[key: `data-${string}`]: unknown;
	};

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, matching every other component': never;
}

/**
 * Extra constraints layered on top of {@link FormProps} at the call site. Resolves to `unknown`
 * while the props are valid, and to a rule object when they are not.
 */
export type ValidateFormProps<T> = T extends { 'data-testid': unknown }
	? TheTestIdPropIsCalledTestId
	: unknown;
