import type { ReactNode } from 'react';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';

/**
 * @access private
 */
export type PaginationControlTooltipProps = {
	disabledTooltip: ReactNode;
	/**
	 * Whether the reason applies now. The anchor mounts from `disabledTooltip` alone, so the control
	 * never remounts and never drops focus when `disabled` changes.
	 */
	active: boolean;
	children: ReactNode;
};

/**
 * Shows `disabledTooltip` on a control that carries no tooltip of its own.
 *
 * @access private
 */
export function PaginationControlTooltip({
	disabledTooltip,
	active,
	children,
}: PaginationControlTooltipProps): ReactNode {
	if (disabledTooltip == null) {
		return children;
	}

	return <TooltipAnchor content={active ? disabledTooltip : null}>{children}</TooltipAnchor>;
}
