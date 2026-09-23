import { Ellipsis } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { Dropdown } from '../../dropdown/dropdown.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import type {
	ButtonGroupPositionType,
	ButtonGroupResolvedItem,
	ButtonGroupState,
	ButtonGroupTextOverflowType,
} from '../types.js';
import { toMenuRow } from '../utils.js';
import { ButtonGroupMember } from './button-group-member.js';

/**
 * @access private
 */
export type ButtonGroupOverflowProps = {
	collapsed: ButtonGroupResolvedItem[];
	group: ButtonGroupState;
	textOverflow: ButtonGroupTextOverflowType;
	position: ButtonGroupPositionType;
};

/**
 * The ellipsis member and the menu it opens, listing exactly the members that did not fit.
 *
 * @access private
 */
export function ButtonGroupOverflow({
	collapsed,
	group,
	textOverflow,
	position,
}: ButtonGroupOverflowProps): ReactElement {
	const tooltipEntries: TooltipContentStackEntry[] =
		group.loading && hasTooltipContent(group.loadingTooltip)
			? [{ id: 'group-loading-tooltip', content: group.loadingTooltip }]
			: [];

	// The menu owns its trigger's disabled state and tooltip. While loading, the member already
	// says why, so the menu is only blocked. `false` rather than `undefined` keeps the menu's
	// tooltip trigger mounted, so the ellipsis keeps focus when `loading` toggles.
	const menuDisabled = group.disabled || group.loading;
	const menuDisabledTooltip =
		group.loading && group.disabledTooltip != null ? false : group.disabledTooltip;

	return (
		<Dropdown
			nativeButton
			side="bottom"
			align="end"
			items={collapsed.map(toMenuRow)}
			disabled={menuDisabled}
			disabledTooltip={menuDisabledTooltip}
			{...(group.testId === undefined ? {} : { testId: `${group.testId}-overflow` })}
		>
			<ButtonGroupMember
				icon={<Ellipsis />}
				aria-label={`Show ${collapsed.length} more ${collapsed.length === 1 ? 'option' : 'options'}`}
				data-overflow="true"
				position={position}
				textOverflow={textOverflow}
				disabled={group.loading}
				loading={group.loading}
				tooltipEntries={tooltipEntries}
			/>
		</Dropdown>
	);
}
