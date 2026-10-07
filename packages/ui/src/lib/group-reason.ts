import type { ReactNode } from 'react';
import { hasTooltipContent } from '../tooltip/tooltip-content-stack-context.js';

/**
 * @access private
 */
export type GroupReasonOptions = {
	disabled: boolean | undefined;
	disabledTooltip: ReactNode;
	readOnly: boolean | undefined;
	readOnlyTooltip: ReactNode;
};

/**
 * @access private
 */
export type GroupReason = {
	isReadOnly: boolean;
	isDisabled: boolean;
	/**
	 * What the group's tooltip says right now, `null` while it has nothing to say.
	 */
	reason: ReactNode;
	/**
	 * Whether the group mounts its tooltip at all.
	 */
	hasReasonAnchor: boolean;
};

/**
 * Which of `disabled` and `readOnly` holds on a group built from `items`, and the reason it shows.
 * `readOnly` outranks `disabled`: while it is set the group is not disabled at all, and only
 * `readOnlyTooltip` shows.
 *
 * @access private
 */
export function resolveGroupReason({
	disabled,
	disabledTooltip,
	readOnly,
	readOnlyTooltip,
}: GroupReasonOptions): GroupReason {
	const isReadOnly = readOnly === true;
	const isDisabled = !isReadOnly && disabled === true;
	const reason = isReadOnly ? readOnlyTooltip : isDisabled ? disabledTooltip : null;

	return {
		isReadOnly,
		isDisabled,
		reason: hasTooltipContent(reason) ? reason : null,
		// The anchor mounts from the props, not from whether there is a reason right now, so the
		// group never remounts and never drops focus when `disabled` or `readOnly` flips.
		hasReasonAnchor: disabledTooltip != null || readOnlyTooltip != null,
	};
}
