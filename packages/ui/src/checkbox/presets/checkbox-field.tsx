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
		// The root here and the `registered` row parts below are Base UI's `Field.Root` and
		// `Field.Description`, the pair `Field` is built on. The checkbox reads the description ids
		// and the invalid state from them, so a change in how Base UI wires them reaches `Field`
		// and `CheckboxField` together.
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
				<FieldRow
					row={parts.row}
					status={parts.status}
					id={parts.rowId}
					testId={testId}
					registered
					className={styles['checkbox-field__row']}
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

type Checked<T extends CheckboxFieldProps> = T &
	ValidateFieldProps<T> &
	ValidateCheckboxProps<T> &
	// `T` is inferred from the call site, so `T extends CheckboxFieldProps` alone never runs excess
	// property checks. Every key outside the props is pinned to `never` instead.
	Record<Exclude<keyof T, keyof CheckboxFieldProps | keyof RefAttributes<HTMLSpanElement>>, never> &
	RefAttributes<HTMLSpanElement>;

/**
 * Renders one `Checkbox` whose text is the field `label`, with the rest of a field around it.
 *
 * The field takes `label`, `labelTooltip`, `description`, `error`, `status`, `message` and
 * `required`. `required` sets `aria-required` on the `Checkbox`, and a `danger` status sets
 * `aria-invalid`. Every other prop goes to the `Checkbox`.
 *
 * Visual values are the `--field-*` and `--checkbox-*` custom properties, defaults in the
 * `css-tokens` regions of [../../field/index.ts](../../field/index.ts) and
 * [../index.ts](../index.ts).
 *
 * ### Label
 *
 * The `label` is the text beside the box, and the accessible name of the `Checkbox`. It does not
 * sit above the control as it does in every other field, because a label above would give the
 * checkbox two names.
 *
 * The description and the message sit below the text, lined up with it and not with the box.
 *
 * A checkbox with a heading above it is a group of choices. Use `Field.Group` around one
 * `Checkbox` per choice.
 *
 * ### Asserting on it
 *
 * `testId` is the `Checkbox`'s own. The parts take it as their prefix, and the field root gets
 * none.
 *
 * | `data-testid` | rendered |
 * |---|---|
 * | `${testId}-label-tooltip` | with `labelTooltip`, the info icon |
 * | `${testId}-description` | while `description` shows |
 * | `${testId}-message` | while a status message shows |
 *
 * There is no `${testId}-label`, since the label is the text of the `Checkbox`.
 *
 * The data attributes are those of `Field` and `Checkbox`, plus one `data-slot` of its own. Use
 * them, never the hashed class names.
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `checkbox-field-label` | always, wraps the label text |
 *
 * @example
 * ```tsx
 * <CheckboxField
 *   label="Send me product updates"
 *   color="primary"
 *   value={subscribed}
 *   onChange={setSubscribed}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // react-hook-form: `field` carries value, onChange, onBlur, name and ref
 * <Controller
 *   control={control}
 *   name="terms"
 *   render={({ field, fieldState }) => (
 *     <CheckboxField
 *       color="primary"
 *       label="I accept the terms of service"
 *       required
 *       description="You can read them in your account settings."
 *       error={fieldState.error?.message}
 *       {...field}
 *     />
 *   )}
 * />
 * ```
 */
export const CheckboxField = CheckboxFieldImpl as <T extends CheckboxFieldProps>(
	props: Checked<T>,
) => ReactElement;
