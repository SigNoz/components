import type { AriaAttributes, ReactNode } from 'react';
import { useFieldContext } from '../lib/field-context.js';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';
import type { InputSizeType, InputStatusType } from './types.js';

/**
 * A props rest split between the two elements: `data-*` for the frame, everything else (the native
 * attributes and the remaining `aria-*`) for the control. The aria attributes the input resolves
 * against the surrounding `Field` are destructured away before the rest reaches this.
 *
 * @access private
 */
export function splitAttributes(props: Record<string, unknown>): {
	control: Record<string, unknown>;
	data: Record<string, unknown>;
} {
	const control: Record<string, unknown> = {};
	const data: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (key.startsWith('data-')) {
			data[key] = value;
		} else {
			control[key] = value;
		}
	}

	return { control, data };
}

/**
 * @access private
 */
export type FieldControlProps = {
	id: string | undefined;
	status: InputStatusType | undefined;
	size: InputSizeType | undefined;
	required: boolean | undefined;
	ariaDescribedBy: AriaAttributes['aria-describedby'];
	ariaInvalid: AriaAttributes['aria-invalid'];
};

/**
 * The control's own props resolved against the surrounding `Field`, which supplies the defaults:
 * the id its label points at, the status it shows a message for, its size and `required`. The
 * control's own props win.
 *
 * `aria-describedby` gains the field's message id, and `aria-invalid` follows a `danger` status
 * unless the call site writes it.
 *
 * @access private
 */
export function useFieldControl(own: FieldControlProps): {
	id: string | undefined;
	status: InputStatusType | undefined;
	size: InputSizeType;
	required: boolean | undefined;
	ariaDescribedBy: AriaAttributes['aria-describedby'];
	ariaInvalid: AriaAttributes['aria-invalid'];
} {
	const field = useFieldContext();
	const status = own.status ?? field?.status;
	const describedBy = [own.ariaDescribedBy, field?.messageId].filter(Boolean).join(' ');

	return {
		id: own.id ?? field?.controlId,
		status,
		size: own.size ?? field?.size ?? 'base',
		required: own.required ?? field?.required,
		ariaDescribedBy: describedBy === '' ? undefined : describedBy,
		ariaInvalid: own.ariaInvalid ?? (status === 'danger' ? true : undefined),
	};
}

/**
 * The reason tooltip of a locked control: the read-only reason while `readOnly`, the disabled one
 * while `disabled`, and whether an anchor should mount at all. The anchor mounts from the props,
 * not from whether there is a reason right now, so the control never remounts and keeps its focus
 * when a reason appears.
 *
 * @access private
 */
export function getReasonTooltip({
	disabled,
	disabledTooltip,
	readOnly,
	readOnlyTooltip,
}: {
	disabled: boolean;
	disabledTooltip: ReactNode;
	readOnly: boolean;
	readOnlyTooltip: ReactNode;
}): { reason: ReactNode; hasReasonAnchor: boolean } {
	const hasReadOnlyTooltip = readOnly && hasTooltipContent(readOnlyTooltip);
	const hasDisabledTooltip = disabled && !readOnly && hasTooltipContent(disabledTooltip);

	return {
		reason: hasReadOnlyTooltip ? readOnlyTooltip : hasDisabledTooltip ? disabledTooltip : null,
		hasReasonAnchor: disabledTooltip != null || readOnlyTooltip != null,
	};
}
