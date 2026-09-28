import { type ReactElement, useEffect } from 'react';
import { BUTTON_GROUP_EMPTY_LABEL } from '../constants.js';
import type {
	ButtonGroupPositionType,
	ButtonGroupResolvedItem,
	ButtonGroupTextOverflowType,
} from '../types.js';
import { ButtonGroupMember } from './button-group-member.js';

/**
 * @access private
 */
export type ButtonGroupItemProps = {
	resolved: ButtonGroupResolvedItem;
	position: ButtonGroupPositionType;
	textOverflow: ButtonGroupTextOverflowType;
	collapsed: boolean;
};

/**
 * One entry of `items` rendered as a member, visible or collapsed.
 *
 * @access private
 */
export function ButtonGroupItem({
	resolved,
	position,
	textOverflow,
	collapsed,
}: ButtonGroupItemProps): ReactElement {
	const { item, label, emptyLabel, testId, render, loading, disabled, reasons } = resolved;

	// The fallback keeps the action on screen, so say the label is missing rather than let
	// `<No label>` ship as if it were a design.
	useEffect(() => {
		if (emptyLabel) {
			console.error(
				`ButtonGroup: the item "${item.value}" renders no label, showing "${BUTTON_GROUP_EMPTY_LABEL}" instead.`,
			);
		}
	}, [emptyLabel, item.value]);

	return (
		<ButtonGroupMember
			label={label}
			emptyLabel={emptyLabel}
			icon={item.icon}
			prefix={item.prefix}
			suffix={item.suffix}
			position={position}
			textOverflow={textOverflow}
			disabled={disabled}
			loading={loading}
			tooltipEntries={reasons}
			collapsed={collapsed}
			{...(render === undefined ? {} : { render })}
			{...(item.onClick === undefined ? {} : { onClick: item.onClick })}
			{...(item.icon === undefined ? {} : { 'aria-label': item.ariaLabel })}
			{...(testId === undefined ? {} : { testId })}
		/>
	);
}
