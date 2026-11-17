import type { ReactNode } from 'react';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';

/**
 * A props rest split between the two elements: `data-*` for the frame, everything else (the native
 * attributes and the remaining `aria-*`) for the control.
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
