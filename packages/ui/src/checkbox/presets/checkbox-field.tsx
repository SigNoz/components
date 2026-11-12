import { Field as BaseField } from '@base-ui/react/field';
import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import { FieldAnnouncer } from '../../field/subcomponents/field-announcer.js';
import { FieldLabelContent } from '../../field/subcomponents/field-label-content.js';
import { FieldRow } from '../../field/subcomponents/field-row.js';
import { FieldTooltipText } from '../../field/subcomponents/field-tooltip-text.js';
import type { ValidateFieldProps } from '../../field/types.js';
import { useFieldParts } from '../../field/use-field-parts.js';
import type { RejectedProps } from '../../lib/utils.js';
import { Checkbox } from '../checkbox.js';
import styles from '../checkbox.module.scss';
import { CheckboxTextOverflow } from '../constants.js';
import type { CheckboxFieldProps, CheckboxProps, ValidateCheckboxProps } from '../types.js';
import { keepInfoIconFromToggling } from '../utils.js';

const CheckboxFieldImpl = forwardRef<HTMLSpanElement, CheckboxFieldProps>(function CheckboxField(
	{
		label,
		labelTooltip,
		description,
		error,
		status,
		message,
		required = false,
		testId,
		children: _children,
		htmlFor: _htmlFor,
		textOverflow: _textOverflow,
		...control
	}: CheckboxFieldProps & RejectedProps<'children' | 'htmlFor' | 'textOverflow'>,
	ref,
) {
	const parts = useFieldParts({ labelTooltip, description, error, status, message });

	return (
		<BaseField.Root
			invalid={parts.status === 'danger'}
			className={styles['checkbox-field']}
			data-slot="field"
			data-status={parts.status}
			data-required={required || undefined}
		>
			<Checkbox
				// The field's `required` is `aria-required` only: the form's validation owns the rule,
				// and a native `required` would let the browser block the submit before it runs.
				aria-required={required || undefined}
				{...(control as CheckboxProps)}
				ref={ref}
				testId={testId}
				textOverflow={CheckboxTextOverflow.Wrap}
			>
				<span
					role="presentation"
					className={styles['checkbox-field__label']}
					data-slot="checkbox-field-label"
					onClick={keepInfoIconFromToggling}
				>
					<FieldLabelContent
						label={label}
						labelTooltip={labelTooltip}
						hasLabelTooltip={parts.hasLabelTooltip}
						required={required}
						testId={testId}
					/>
				</span>
			</Checkbox>
			{parts.row !== null && (
				<div className={styles['checkbox-field__row']} data-slot="checkbox-field-row">
					<FieldRow
						row={parts.row}
						status={parts.status}
						id={parts.rowId}
						testId={testId}
						registered
					/>
				</div>
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

type Checked<T extends CheckboxFieldProps> = T &
	ValidateFieldProps<T> &
	ValidateCheckboxProps<T> &
	// `T` is inferred from the call site, so `T extends CheckboxFieldProps` alone never runs excess
	// property checks. Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof CheckboxFieldProps | keyof RefAttributes<HTMLSpanElement>>, never> &
	RefAttributes<HTMLSpanElement>;

/**
 * One `Checkbox` whose text is the field `label`, with the rest of a field around it: the required
 * marker, the description or the validation message, and the wiring. It is the one field whose
 * label is not above the control: a checkbox has its own text next to the box, and a label above it
 * would give it two names. A checkbox with a heading above it is a group, so use `Field.Group`.
 *
 * `label` is the text and the checkbox's accessible name. The asterisk of `required` follows it,
 * `aria-hidden`, while `aria-required` lands on the checkbox, never the native `required`.
 * `labelTooltip` adds an info icon after the text, and its content joins the checkbox's
 * `aria-describedby`. The `description`, or the message while there is one, sits below the text,
 * lined up with the text and not with the box. A message that appears or changes is announced once, through a polite live
 * region. `danger` sets `aria-invalid` on the checkbox, and the text and the message take the
 * status color.
 *
 * Every other prop goes to the `Checkbox`: `color`, `value`, `onChange`, `name`, `id`, `ref`,
 * `aria-*`, `data-*` and `testId` land where `Checkbox` puts them. The field parts take `testId` as
 * their prefix: `${testId}-description`, `${testId}-message` and `${testId}-label-tooltip`. There
 * is no `${testId}-label`, the checkbox owns its text.
 *
 * `children` and `htmlFor` are not props, since `label` takes the place of `children` and the
 * field wires the checkbox itself. `textOverflow` and `labelIcon` are not props either: the text
 * wraps, up to 2 lines and then an ellipsis with a tooltip, so the asterisk and the info icon
 * always show.
 *
 * Built on Base UI `Field.Root` and `Field.Description`, the pair `Field` is built on. The
 * checkbox reads the description ids and the invalid state from it, so a change in how Base UI
 * wires them reaches `Field` and `CheckboxField` together. The checkbox takes `required` as a
 * prop, since it is the only control in the field.
 *
 * @example
 * ```tsx
 * <CheckboxField
 *   color="primary"
 *   label="I accept the terms of service"
 *   required
 *   description="You can read them in your account settings."
 *   error={errors.terms?.message}
 *   {...field}
 * />
 * ```
 */
export const CheckboxField = CheckboxFieldImpl as <T extends CheckboxFieldProps>(
	props: Checked<T>,
) => ReactElement;
