import { type ReactNode, useId } from 'react';
import { hasRenderableContent, joinIdRefs } from '../lib/utils.js';
import type { FieldLabelAndMessageProps, FieldStatusType } from './types.js';

/**
 * @access private
 */
export type FieldParts = {
	status: FieldStatusType | undefined;
	row: { kind: 'message' | 'description'; content: ReactNode } | null;
	announcement: ReactNode;
	messageId: string | undefined;
	hasLabelTooltip: boolean;
	controlId: string;
	labelId: string;
	rowId: string;
	tooltipTextId: string;
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
