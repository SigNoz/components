import { Field as BaseField } from '@base-ui/react/field';
import {
	forwardRef,
	type ReactElement,
	type RefAttributes,
	type RefCallback,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { FieldContext, type FieldContextValue } from '../lib/field-context.js';
import { partTestId, type RejectedProps } from '../lib/utils.js';
import styles from './field.module.scss';
import { FieldAnnouncer } from './subcomponents/field-announcer.js';
import { FieldGroup } from './subcomponents/field-group.js';
import { FieldLabelContent } from './subcomponents/field-label-content.js';
import { FieldRow } from './subcomponents/field-row.js';
import { FieldTooltipText } from './subcomponents/field-tooltip-text.js';
import type { FieldGroupProps, FieldProps, ValidateFieldProps } from './types.js';
import { useFieldParts } from './use-field-parts.js';
import { focusLabelledControl } from './utils.js';

/**
 * @access private
 */
export type FieldImplProps = FieldProps & {
	/**
	 * Set by a field shorthand, whose `testId` names the control: the field parts take it as their
	 * prefix, and the root gets no `data-testid`.
	 */
	testIdOnPartsOnly?: boolean;
	/**
	 * Set by a field shorthand whose `ref` is the focus target of its control, and handed to the
	 * control through the field context.
	 */
	focusTarget?: RefCallback<HTMLElement>;
};

/**
 * `Field` without the call-site type checks, for the field shorthands.
 *
 * @access private
 */
export const FieldImpl = forwardRef<HTMLDivElement, FieldImplProps>(function Field(
	{
		children,
		label,
		labelIcon,
		labelTooltip,
		description,
		error,
		status,
		message,
		required = false,
		htmlFor,
		testId,
		testIdOnPartsOnly = false,
		focusTarget,
		className: _className,
		style: _style,
		...props
	}: FieldImplProps & RejectedProps,
	ref,
) {
	const parts = useFieldParts({ labelTooltip, description, error, status, message });
	const [claimedId, setClaimedId] = useState<string | undefined>(undefined);
	const claimControl = useCallback((id: string | undefined) => setClaimedId(id), []);
	const controlId = htmlFor ?? parts.controlId;
	// A native control hands back its id. A Base UI control registers with Base UI's field, which
	// points the label at it when no id is set here.
	const labelFor = htmlFor ?? claimedId;

	const context = useMemo<FieldContextValue>(
		() => ({
			kind: 'field',
			controlId,
			labelId: parts.labelId,
			describedBy: parts.describedBy,
			status: parts.status,
			required,
			claimControl,
			focusTarget,
		}),
		[
			controlId,
			parts.labelId,
			parts.describedBy,
			parts.status,
			required,
			claimControl,
			focusTarget,
		],
	);

	return (
		<BaseField.Root
			{...props}
			ref={ref}
			invalid={parts.status === 'danger'}
			className={styles['field']}
			data-slot="field"
			data-status={parts.status}
			data-required={required || undefined}
			data-testid={testIdOnPartsOnly ? undefined : testId}
		>
			<BaseField.Label
				id={parts.labelId}
				className={styles['field__label']}
				data-slot="field-label"
				data-testid={partTestId(testId, 'label')}
				onClick={focusLabelledControl}
				{...(labelFor === undefined ? {} : { htmlFor: labelFor })}
			>
				<FieldLabelContent
					label={label}
					labelIcon={labelIcon}
					labelTooltip={labelTooltip}
					hasLabelTooltip={parts.hasLabelTooltip}
					required={required}
					testId={testId}
				/>
			</BaseField.Label>
			<div className={styles['field__control']} data-slot="field-control">
				<FieldContext.Provider value={context}>{children}</FieldContext.Provider>
			</div>
			{parts.row !== null && (
				<FieldRow
					row={parts.row}
					status={parts.status}
					id={parts.rowId}
					testId={testId}
					registered
				/>
			)}
			{parts.hasLabelTooltip && (
				// Base UI lists the descriptions in the order they mount. The key mounts the tooltip text
				// again after the row appears, so the row always comes first.
				<FieldTooltipText
					key={parts.row === null ? 'alone' : 'after-row'}
					id={parts.tooltipTextId}
					registered
				>
					{labelTooltip}
				</FieldTooltipText>
			)}
			<FieldAnnouncer messageId={parts.messageId} message={parts.announcement} />
		</BaseField.Root>
	);
});

type FieldComponent = (<T extends FieldProps>(
	props: T &
		ValidateFieldProps<T> &
		// `T` is inferred from the call site, so `T extends FieldProps` alone never runs excess
		// property checks. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof FieldProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement) & {
	Group: <T extends FieldGroupProps>(
		props: T &
			ValidateFieldProps<T> &
			Record<
				Exclude<keyof T, keyof FieldGroupProps | keyof RefAttributes<HTMLFieldSetElement>>,
				never
			> &
			RefAttributes<HTMLFieldSetElement>,
	) => ReactElement;
};

/**
 * The label, the control and the row below it of one form field, in the one layout the design
 * draws: the label above, the description or the validation message below.
 *
 * The control is `children`. The field reaches it through context: it hands down the id its
 * `<label for>` points at, `status`, `required`, and the ids for `aria-describedby`. The control's
 * own props win. The Base UI controls (Checkbox, Switch, Select, Combobox, Slider, Radio Group)
 * take the label, the description and `aria-invalid` from Base UI's own field, which `Field`
 * renders. A control that reads neither yet needs `id` and `htmlFor`.
 *
 * `Field.Group` is the same for several controls that share one label, as a `<fieldset>` with a
 * `<legend>`.
 *
 * Every `aria-*` and any `data-*` are forwarded to the root.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped. A field
 * that moved its label or restyled its message would not read as the same form.
 *
 * Visual values are `--field-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Status and `error`
 *
 * `error` is the common case: `error={errors.name?.message}` is the whole react-hook-form wiring,
 * and renders nothing while the field is valid. `status` with `message` covers `warning`,
 * `success`, and a `danger` message that is not a string. The label and the message take the
 * status color, the message starts with the status icon, and `danger` sets `aria-invalid` on the
 * control.
 *
 * The message replaces the description in the same row, so the field does not grow by a line when
 * an error appears. A polite live region announces a message that appears or changes.
 *
 * ### `required`
 *
 * The asterisk on the label and `aria-required` on the control, never the native `required`. The
 * form's validation owns the rule: a native `required` would let the browser stop the submit with
 * its own bubble before react-hook-form or zod run, in any `<form>` without `noValidate`. A control
 * that wants the browser's check takes `required` itself.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root, and the prefix of the parts. The control keeps its own
 * `testId`. Otherwise use the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"field"` |
 * | `data-status` | the resolved status, `danger` while `error` renders, absent without one |
 * | `data-required` | present while `required` |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `field-label` | always, the `<label>` | `${testId}-label` |
 * | `field-label-icon` | with `labelIcon`, `aria-hidden` | none |
 * | `field-label-tooltip` | while `labelTooltip` renders something, `aria-hidden` | `${testId}-label-tooltip` |
 * | `field-required-marker` | while `required`, `aria-hidden` | none |
 * | `field-control` | always, wraps the control | none |
 * | `field-description` | while `description` shows | `${testId}-description` |
 * | `field-message` | while a status message shows, holds the status icon | `${testId}-message` |
 *
 * @example
 * ```tsx
 * <Field label="Email" required error={errors.email?.message}>
 *   <Input type="email" {...register('email')} />
 * </Field>
 * ```
 *
 * @example
 * ```tsx
 * <Field.Group label="Retention" description="How long the data is kept.">
 *   <RadioGroup items={periods} value={period} onChange={setPeriod} />
 * </Field.Group>
 * ```
 */
export const Field = Object.assign(FieldImpl, { Group: FieldGroup }) as FieldComponent;
