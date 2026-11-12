import { Fieldset } from '@base-ui/react/fieldset';
import { forwardRef, type RefCallback, useMemo } from 'react';
import { FieldContext, type FieldContextValue } from '../../lib/field-context.js';
import { joinIdRefs, partTestId, type RejectedProps } from '../../lib/utils.js';
import styles from '../field.module.scss';
import type { FieldGroupProps } from '../types.js';
import { useFieldParts } from '../use-field-parts.js';
import { claimNoControl } from '../utils.js';
import { FieldAnnouncer } from './field-announcer.js';
import { FieldLabelContent } from './field-label-content.js';
import { FieldRow } from './field-row.js';
import { FieldTooltipText } from './field-tooltip-text.js';

/**
 * @access private
 */
export type FieldGroupImplProps = FieldGroupProps & {
	/**
	 * Set by a field shorthand, whose `testId` names the control: the group parts take it as their
	 * prefix, and the `<fieldset>` gets no `data-testid`.
	 */
	testIdOnPartsOnly?: boolean;
	/**
	 * Set by a field shorthand whose `ref` is the focus target of its control, and handed to the
	 * control through the field context.
	 */
	focusTarget?: RefCallback<HTMLElement>;
};

/**
 * Several controls under one label, as a `<fieldset>` named by its `<legend>`. Reached as
 * `Field.Group`, documented on `Field`.
 *
 * There is no Base UI field around the controls: each Checkbox in a list registers its own id, and
 * one shared field would hand them all the same one. A Radio Group takes the legend as its name
 * from Base UI's fieldset. The row and the tooltip text are listed in the fieldset's
 * `aria-describedby`.
 *
 * @access private
 */
export const FieldGroup = forwardRef<HTMLFieldSetElement, FieldGroupImplProps>(function FieldGroup(
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
		testId,
		testIdOnPartsOnly = false,
		focusTarget,
		'aria-describedby': ariaDescribedBy,
		className: _className,
		style: _style,
		...props
	}: FieldGroupImplProps & RejectedProps,
	ref,
) {
	const parts = useFieldParts({ labelTooltip, description, error, status, message });

	const context = useMemo<FieldContextValue>(
		() => ({
			kind: 'group',
			controlId: undefined,
			labelId: parts.labelId,
			describedBy: parts.describedBy,
			status: parts.status,
			required,
			claimControl: claimNoControl,
			focusTarget,
		}),
		[parts.labelId, parts.describedBy, parts.status, required, focusTarget],
	);

	return (
		<Fieldset.Root
			{...props}
			ref={ref}
			aria-describedby={joinIdRefs(ariaDescribedBy, parts.describedBy)}
			className={styles['field-group']}
			data-slot="field-group"
			data-status={parts.status}
			data-required={required || undefined}
			data-testid={testIdOnPartsOnly ? undefined : testId}
		>
			<Fieldset.Legend
				id={parts.labelId}
				render={<legend />}
				className={styles['field__label']}
				data-slot="field-label"
				data-testid={partTestId(testId, 'label')}
			>
				<FieldLabelContent
					label={label}
					labelIcon={labelIcon}
					labelTooltip={labelTooltip}
					hasLabelTooltip={parts.hasLabelTooltip}
					required={required}
					testId={testId}
				/>
			</Fieldset.Legend>
			<div className={styles['field-group__content']} data-slot="field-group-content">
				<FieldContext.Provider value={context}>{children}</FieldContext.Provider>
			</div>
			{parts.row !== null && (
				<FieldRow
					row={parts.row}
					status={parts.status}
					id={parts.rowId}
					testId={testId}
					registered={false}
				/>
			)}
			{parts.hasLabelTooltip && (
				<FieldTooltipText id={parts.tooltipTextId} registered={false}>
					{labelTooltip}
				</FieldTooltipText>
			)}
			<FieldAnnouncer messageId={parts.messageId} message={parts.announcement} />
		</Fieldset.Root>
	);
});
