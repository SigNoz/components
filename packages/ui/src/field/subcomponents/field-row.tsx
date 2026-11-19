import { Field as BaseField } from '@base-ui/react/field';
import { SolidAlertCircle, SolidAlertTriangle, SolidCheckCircle2 } from '@signozhq/icons';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { cn, partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
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
	/**
	 * A class of the preset that owns the row, added to the row's own. `CheckboxField` uses it to
	 * start the row under its text. The row stays a direct child of the field, which is what the
	 * field's own layout and an inline `Form` look for.
	 */
	className?: string;
};

/**
 * One element with one id for the message and the description, so the control's
 * `aria-describedby` does not change when an error replaces the description.
 *
 * @access private
 */
export function FieldRow({ row, status, id, testId, registered, className }: FieldRowProps) {
	const isMessage = row.kind === 'message';
	const StatusIcon = isMessage && status !== undefined ? STATUS_ICONS[status] : null;
	// The row wraps, except where a layout keeps it to one line and cuts it, as an inline `Form`
	// does. A cut text shows in full in a tooltip, below the row: above it, the tooltip would cover
	// the control the message is about, and catch the click that goes to it.
	const [isTruncated, textRef] = useIsLabelTruncated(true);
	const props = {
		id,
		className: cn(styles['field__row'], className),
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
			<TooltipAnchor content={isTruncated ? row.content : null} contentProps={{ side: 'bottom' }}>
				<span
					ref={textRef}
					className={styles['field__row-text']}
					data-slot="field-row-text"
					data-truncated={isTruncated || undefined}
				>
					{row.content}
				</span>
			</TooltipAnchor>
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
