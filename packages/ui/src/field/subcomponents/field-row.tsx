import { Field as BaseField } from '@base-ui/react/field';
import { SolidAlertCircle, SolidAlertTriangle, SolidCheckCircle2 } from '@signozhq/icons';
import { partTestId } from '../../lib/utils.js';
import styles from '../field.module.scss';
import type { FieldStatusType } from '../types.js';
import type { FieldParts } from '../use-field-parts.js';

const STATUS_ICONS = {
	success: SolidCheckCircle2,
	warning: SolidAlertCircle,
	danger: SolidAlertTriangle,
} as const;

/**
 * @access private
 */
export type FieldRowProps = {
	row: NonNullable<FieldParts['row']>;
	status: FieldStatusType | undefined;
	id: string;
	testId: string | undefined;
	/**
	 * Registers the row with Base UI's field, so the Base UI controls inside list it in their
	 * `aria-describedby`. A group has no Base UI field, its `<fieldset>` lists the row itself.
	 */
	registered: boolean;
};

/**
 * The row below the control: the status message with its icon, or the description. One element
 * with one id for both, so the control's `aria-describedby` does not change when an error replaces
 * the description, and the field does not grow by a line.
 *
 * @access private
 */
export function FieldRow({ row, status, id, testId, registered }: FieldRowProps) {
	const isMessage = row.kind === 'message';
	const StatusIcon = isMessage && status !== undefined ? STATUS_ICONS[status] : null;
	const props = {
		id,
		className: styles['field__row'],
		'data-slot': isMessage ? 'field-message' : 'field-description',
		'data-testid': partTestId(testId, isMessage ? 'message' : 'description'),
	};
	const content = (
		<>
			{StatusIcon !== null && (
				<span className={styles['field__message-icon']} aria-hidden="true">
					<StatusIcon aria-hidden="true" />
				</span>
			)}
			<span className={styles['field__row-text']}>{row.content}</span>
		</>
	);

	return registered ? (
		<BaseField.Description {...props} render={<div />}>
			{content}
		</BaseField.Description>
	) : (
		<div {...props}>{content}</div>
	);
}
