import { type ReactNode, useId } from 'react';
import { hasRenderableContent, joinIdRefs } from '../lib/utils.js';
import type { FieldLabelAndMessageProps, FieldStatusType } from './types.js';

/**
 * What a `Field` and a `Field.Group` both work out from their props: the status, the content of
 * the row below the control, and the ids that tie the label, the row and the tooltip text to the
 * control.
 *
 * @access private
 */
export type FieldParts = {
	status: FieldStatusType | undefined;
	/**
	 * What the row below the control shows: the status message while there is one, else the
	 * description. `null` while the row has nothing to show.
	 */
	row: { kind: 'message' | 'description'; content: ReactNode } | null;
	/**
	 * The status message the live region announces, `null` without one.
	 */
	announcement: ReactNode;
	/**
	 * The id of the row while it holds the status message. The live region reads the text from it.
	 */
	messageId: string | undefined;
	hasLabelTooltip: boolean;
	controlId: string;
	labelId: string;
	rowId: string;
	tooltipTextId: string;
	/**
	 * The ids for the control's `aria-describedby`: the row, then the tooltip text.
	 */
	describedBy: string | undefined;
};

/**
 * @access private
 */
export function useFieldParts({
	labelTooltip,
	description,
	error,
	status,
	message,
}: Pick<
	FieldLabelAndMessageProps,
	'labelTooltip' | 'description' | 'error' | 'status' | 'message'
>): FieldParts {
	const baseId = useId();
	const hasError = hasRenderableContent(error);
	const resolvedStatus = hasError ? 'danger' : status;
	const messageContent = hasError ? error : message;
	const hasMessage = resolvedStatus !== undefined && hasRenderableContent(messageContent);
	const hasLabelTooltip = hasRenderableContent(labelTooltip);

	const row: FieldParts['row'] = hasMessage
		? { kind: 'message', content: messageContent }
		: hasRenderableContent(description)
			? { kind: 'description', content: description }
			: null;

	const rowId = `${baseId}row`;
	const tooltipTextId = `${baseId}tooltip`;

	return {
		status: resolvedStatus,
		row,
		announcement: hasMessage ? messageContent : null,
		messageId: hasMessage ? rowId : undefined,
		hasLabelTooltip,
		controlId: `${baseId}control`,
		labelId: `${baseId}label`,
		rowId,
		tooltipTextId,
		describedBy: joinIdRefs(
			row === null ? undefined : rowId,
			hasLabelTooltip ? tooltipTextId : undefined,
		),
	};
}
