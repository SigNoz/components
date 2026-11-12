import type { AriaAttributes, ComponentProps, ReactElement, ReactNode } from 'react';
import type { FieldStatus } from './constants.js';

export type FieldStatusType = (typeof FieldStatus)[keyof typeof FieldStatus];

/**
 * The props a `Field`, a `Field.Group` and every field shorthand share: the label, its marker and
 * tooltip, and the row below the control.
 */
export type FieldLabelAndMessageProps = {
	/**
	 * The name of the field, rendered as the label above the control. It is also the control's
	 * accessible name.
	 *
	 * @note An empty label renders `<No label>`, so the missing name shows in review and in tests.
	 *
	 * @note Wraps to 2 lines, then ends with an ellipsis and a tooltip with the full text. A label
	 * that needs more is a sentence: split it into a short label and a `description`.
	 */
	label: string;
	/**
	 * An icon before the label text. Only for a label that fits on one line.
	 */
	labelIcon?: ReactElement;
	/**
	 * Renders an info icon after the label, with this content in a tooltip. The content is also
	 * part of the control's description.
	 *
	 * @note Use plain text. A link or a button inside cannot be reached with the keyboard, use
	 * `description` for those.
	 */
	labelTooltip?: ReactNode;
	/**
	 * Neutral help text below the control. A status message replaces it while one shows.
	 */
	description?: ReactNode;
	/**
	 * When true, marks the label with an asterisk and sets `aria-required` on the control.
	 *
	 * @note Never the native `required`: the form's validation owns the rule, and the browser would
	 * otherwise stop the submit with its own bubble before it runs. For the browser's check, pass
	 * `required` to the control as well.
	 *
	 * @default false
	 */
	required?: boolean;
	/**
	 * The validation error, a shorthand for `status="danger"` with `message`.
	 *
	 * @note A value that renders nothing (`undefined`, `null`, `''`) shows no message and sets no
	 * status, so `error={errors.name?.message}` is the whole react-hook-form wiring.
	 *
	 * @note Not allowed next to `status` or `message`.
	 */
	error?: ReactNode;
	/**
	 * The validation state of the field. It colors the label and the message, and tints the
	 * control. `danger` sets `aria-invalid` on the control.
	 *
	 * @note Requires `message`. For a `danger` status with one string, `error` says both at once.
	 *
	 * @note `success` confirms a check that ran and passed. It is not the state of a valid field.
	 */
	status?: FieldStatusType;
	/**
	 * What the status has to say, rendered below the control with the status icon.
	 *
	 * @note Only allowed next to `status`.
	 */
	message?: ReactNode;
};

type FieldRootProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes &
	FieldLabelAndMessageProps & {
		/**
		 * Forwarded to the root as `data-testid`, and the prefix of the parts.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root.
		 */
		[key: `data-${string}`]: unknown;
	};

export type FieldProps = FieldRootProps & {
	/**
	 * Exactly one form control. The field hands it the control id, the description ids, `status`
	 * and `required` through context. The control's own props win.
	 */
	children: ReactElement;
	/**
	 * The id of the control, for a control that sets its own `id` instead of taking the one the
	 * field generates, or that does not read the field yet.
	 */
	htmlFor?: string;
};

export type FieldGroupProps = FieldRootProps & {
	/**
	 * The controls that share the label: a Radio Group, a Toggle Group, a `Slider.Range`, a list of
	 * Checkboxes or Switches, or several Fields.
	 */
	children: ReactNode;
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
 * Extra constraints layered on top of the field props at the call site. Resolves to `unknown`
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
