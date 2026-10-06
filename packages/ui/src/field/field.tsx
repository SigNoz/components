import { SolidAlertCircle, SolidAlertTriangle, SolidCheckCircle2 } from '@signozhq/icons';
import { forwardRef, type ReactElement, type RefAttributes, useId, useMemo } from 'react';
import { FieldContext, type FieldContextValue } from '../lib/field-context.js';
import { hasRenderableContent, partTestId, type RejectedProps } from '../lib/utils.js';
import styles from './field.module.scss';
import type { FieldProps, FieldStatusType, ValidateFieldProps } from './types.js';

const STATUS_ICONS = {
	success: SolidCheckCircle2,
	warning: SolidAlertCircle,
	danger: SolidAlertTriangle,
} as const;

const FieldImpl = forwardRef<HTMLDivElement, FieldProps>(function Field(
	{
		children,
		label,
		labelIcon,
		error,
		status,
		message,
		required = false,
		size = 'base',
		htmlFor,
		testId,
		className: _className,
		style: _style,
		...props
	}: FieldProps & RejectedProps,
	ref,
) {
	const generatedId = useId();
	const controlId = htmlFor ?? `${generatedId}control`;

	const hasError = hasRenderableContent(error);
	const resolvedStatus: FieldStatusType | undefined = hasError ? 'danger' : status;
	const messageContent = hasError ? error : message;
	const hasMessage = hasRenderableContent(messageContent);
	const messageId = hasMessage ? `${generatedId}message` : undefined;

	const context = useMemo<FieldContextValue>(
		() => ({ controlId, messageId, status: resolvedStatus, size, required }),
		[controlId, messageId, resolvedStatus, size, required],
	);

	const StatusIcon = resolvedStatus === undefined ? null : STATUS_ICONS[resolvedStatus];

	return (
		<div
			{...props}
			ref={ref}
			className={styles['field']}
			data-slot="field"
			data-size={size}
			{...(resolvedStatus === undefined ? {} : { 'data-status': resolvedStatus })}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<div className={styles['field__label-row']} data-slot="field-label-row">
				{hasRenderableContent(labelIcon) && (
					<span
						className={styles['field__label-icon']}
						data-slot="field-label-icon"
						aria-hidden="true"
					>
						{labelIcon}
					</span>
				)}
				<label
					className={styles['field__label']}
					data-slot="field-label"
					data-testid={partTestId(testId, 'label')}
					htmlFor={controlId}
				>
					{label}
					{required && (
						<span
							className={styles['field__required-marker']}
							data-slot="field-required-marker"
							aria-hidden="true"
						>
							*
						</span>
					)}
				</label>
			</div>
			<FieldContext.Provider value={context}>{children}</FieldContext.Provider>
			{hasMessage && (
				<div
					className={styles['field__message']}
					data-slot="field-message"
					data-testid={partTestId(testId, 'message')}
					id={messageId}
				>
					{StatusIcon !== null && (
						<span className={styles['field__message-icon']} aria-hidden="true">
							<StatusIcon aria-hidden="true" />
						</span>
					)}
					<span className={styles['field__message-text']}>{messageContent}</span>
				</div>
			)}
		</div>
	);
});

/**
 * The label, the control and the validation message of one form field, in the one layout the
 * design system draws: label above, message below, nothing for the call site to arrange.
 *
 * The control is `children`, and the field reaches it through context rather than props: it hands
 * down the id its `<label>` points at, `status`, `size` and `required`, and puts the message id in
 * the control's `aria-describedby`. The control's own props win. `Input` and its members read all
 * of it today; other controls adopt the same contract as they are reworked.
 *
 * Every `aria-*` and any `data-*` are forwarded to the root.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped. The
 * layout is the point: a field that moved its label or restyled its message would not read as the
 * same form anymore.
 *
 * Visual values are `--field-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Status and `error`
 *
 * `status` + `message` show a validation state: the label and the message take the status color,
 * the message row renders the status icon, and the control inside tints itself through context.
 * `error` is the shorthand for `status="danger"` with `message`, built for form libraries that
 * hand over one string: `error={errors.name?.message}` renders nothing at all while the field is
 * valid.
 *
 * ### Spacing
 *
 * The label is 8px above the control and the message 8px below it, double the control's own
 * internal rhythm, so a field binds to its own label more strongly than to its neighbours. Stack
 * fields 16px apart (24px for `size="large"`).
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root, and the prefix of the parts. Otherwise use the data
 * attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"field"` |
 * | `data-size` | `"base"` or `"large"` |
 * | `data-status` | the resolved status, `danger` while `error` renders, absent without one |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `field-label-row` | always | none |
 * | `field-label-icon` | while `labelIcon` renders something, `aria-hidden` | none |
 * | `field-label` | always, the `<label>` | `${testId}-label` |
 * | `field-required-marker` | while `required`, `aria-hidden` | none |
 * | `field-message` | while a message renders, holds the status icon | `${testId}-message` |
 *
 * @example
 * ```tsx
 * <Field label="Your Organisation Name" error={errors.organisation?.message}>
 *   <Input placeholder="For eg. Simpsonville..." {...register('organisation')} />
 * </Field>
 * ```
 *
 * @example
 * ```tsx
 * <Field label="Organisation" status="success" message="This name is available">
 *   <Input value={name} onChange={(event) => setName(event.target.value)} />
 * </Field>
 * ```
 */
export const Field = FieldImpl as <T extends FieldProps>(
	props: T &
		ValidateFieldProps<T> &
		// `T` is inferred from the call site, so `T extends FieldProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof FieldProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement;
