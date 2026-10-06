import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { FieldSize, FieldStatus } from './constants.js';

export type FieldSizeType = (typeof FieldSize)[keyof typeof FieldSize];
export type FieldStatusType = (typeof FieldStatus)[keyof typeof FieldStatus];

export type FieldProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * Exactly one form control. The field hands it defaults through context: the id its label
		 * points at, `status`, `size` and `required`, and the message id for `aria-describedby`.
		 * The control's own props win.
		 */
		children: ReactNode;
		/**
		 * What the field is called, rendered as the `<label>` above the control. A field exists to
		 * own its label, so there is no way to leave it out.
		 */
		label: ReactNode;
		/**
		 * Rendered before the label text, at the label's own size. An icon takes the label icon
		 * color.
		 */
		labelIcon?: ReactNode;
		/**
		 * The validation error: shorthand for `status="danger"` with `message`, for the common case
		 * of a form library handing over one string.
		 *
		 * @note A node that renders nothing (`null`, `undefined` or an empty string) shows no
		 * message row and sets no status, so `error={errors.name?.message}` wires up react-hook-form
		 * with nothing around it.
		 *
		 * @note Not allowed alongside `status` or `message`: it is the same thing said twice.
		 */
		error?: ReactNode;
		/**
		 * The validation state of the whole field: colors the label, tints the control inside, and
		 * colors the message row below.
		 *
		 * @note Requires `message`. For a danger status with one string, `error` says both at once.
		 *
		 * @note `success` is confirmation of a completed check (name available, connection
		 * verified), not a resting state for a valid field.
		 */
		status?: FieldStatusType;
		/**
		 * What the status has to say, rendered below the control with the status icon.
		 *
		 * @note Only allowed alongside `status`.
		 */
		message?: ReactNode;
		/**
		 * When true, marks the label with an asterisk and makes the control inside required.
		 *
		 * @default false
		 */
		required?: boolean;
		/**
		 * The size the control inside defaults to, so the frame and the label scale together.
		 *
		 * @default 'base'
		 */
		size?: FieldSizeType;
		/**
		 * The id of the control, for a control that names its own `id` rather than taking the
		 * field's generated one.
		 */
		htmlFor?: string;
		/**
		 * Forwarded to the rendered element as `data-testid`, and the prefix of the parts.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the rendered element.
		 */
		[key: `data-${string}`]: unknown;
	};

/**
 * The rules below are the ones a union cannot express without pointing the compiler at an
 * unrelated prop. Each is an object whose single required key is the sentence the compiler should
 * print.
 */
interface AFieldMessageNeedsItsStatus {
	'`message` needs `status`, the message row is a validation state and takes its color and icon from one': never;
}

interface AFieldStatusNeedsItsMessage {
	'`status` needs `message`, a status with nothing to say belongs on the control itself': never;
}

interface ErrorAlreadySaysDangerAndTheMessage {
	'`error` is `status="danger"` plus `message` in one prop, pass one form or the other': never;
}

interface TheTestIdPropIsCalledTestId {
	'`data-testid` is written as the `testId` prop, matching every other component': never;
}

/**
 * Extra constraints layered on top of {@link FieldProps} at the call site. Resolves to `unknown`
 * (which disappears from an intersection) while the props are valid, and to a rule object when
 * they are not.
 */
export type ValidateFieldProps<T> = (T extends { message: ReactNode }
	? T extends { status: FieldStatusType | undefined }
		? unknown
		: AFieldMessageNeedsItsStatus
	: unknown) &
	(T extends { status: FieldStatusType | undefined }
		? T extends { message: ReactNode }
			? unknown
			: AFieldStatusNeedsItsMessage
		: unknown) &
	(T extends { error: ReactNode }
		? T extends { status: unknown }
			? ErrorAlreadySaysDangerAndTheMessage
			: T extends { message: unknown }
				? ErrorAlreadySaysDangerAndTheMessage
				: unknown
		: unknown) &
	(T extends { 'data-testid': unknown } ? TheTestIdPropIsCalledTestId : unknown);
