import { type ReactElement, useEffect } from 'react';
import { Dropdown } from '../../dropdown/dropdown.js';
import styles from '../button-group.module.scss';
import { BUTTON_GROUP_EMPTY_LABEL } from '../constants.js';
import type {
	ButtonGroupJoinType,
	ButtonGroupPositionType,
	ButtonGroupResolvedItem,
	ButtonGroupSizeType,
	ButtonGroupTextOverflowType,
} from '../types.js';
import { ButtonGroupMember } from './button-group-member.js';

/**
 * @access private
 */
export type ButtonGroupItemProps = {
	resolved: ButtonGroupResolvedItem;
	size: ButtonGroupSizeType;
	position: ButtonGroupPositionType;
	joinStart: ButtonGroupJoinType | undefined;
	joinEnd: ButtonGroupJoinType | undefined;
	/**
	 * How the ellipsis would meet this member if it were the last one visible.
	 */
	overflowJoin: ButtonGroupJoinType;
	/**
	 * How the suffix would meet this member if it were the last segment, `undefined` without one.
	 */
	suffixJoin: ButtonGroupJoinType | undefined;
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
	size,
	position,
	joinStart,
	joinEnd,
	overflowJoin,
	suffixJoin,
	textOverflow,
	collapsed,
}: ButtonGroupItemProps): ReactElement {
	const {
		item,
		look,
		buttonProps,
		label,
		emptyLabel,
		testId,
		render,
		menu,
		loading,
		disabled,
		reasons,
	} = resolved;

	// The fallback keeps the action on screen, so say the label is missing rather than let
	// `<No label>` ship as if it were a design.
	useEffect(() => {
		if (emptyLabel) {
			console.error(
				`ButtonGroup: the item "${item.value}" renders no label, showing "${BUTTON_GROUP_EMPTY_LABEL}" instead.`,
			);
		}
	}, [emptyLabel, item.value]);

	// A collapsed member paints a text label from `data-label` instead of holding the text, so the
	// text is in the DOM once and `getByText` finds the open menu's row, not two matches.
	const paintLabel = collapsed && (typeof label === 'string' || typeof label === 'number');
	const content =
		item.icon ??
		(paintLabel || emptyLabel ? (
			<span
				data-slot="button-group-item-label"
				data-empty-label={emptyLabel || undefined}
				data-label={paintLabel ? String(label) : undefined}
				className={styles['button-group__label']}
			>
				{paintLabel ? null : label}
			</span>
		) : (
			label
		));

	const member = (
		<ButtonGroupMember
			look={look}
			size={size}
			position={position}
			joinStart={joinStart}
			joinEnd={joinEnd}
			textOverflow={textOverflow}
			disabled={disabled}
			loading={loading}
			tooltipEntries={reasons}
			collapsed={collapsed}
			data-overflow-join={overflowJoin}
			data-suffix-join={suffixJoin}
			icon={item.icon !== undefined}
			buttonProps={{
				...buttonProps,
				...(item.prefix === undefined ? {} : { prefix: item.prefix }),
				...(item.suffix === undefined ? {} : { suffix: item.suffix }),
				...(item.onClick === undefined ? {} : { onClick: item.onClick }),
			}}
			{...(render === undefined ? {} : { render })}
			{...(testId === undefined ? {} : { testId })}
		>
			{content}
		</ButtonGroupMember>
	);

	if (menu === undefined) {
		return member;
	}

	const { items, ...placement } = menu;

	// The member already shows why it is blocked, so the menu only refuses to open: with no reason
	// of its own it adds no second tooltip. Wrapped while collapsed too, so the member is not
	// remounted and dropped from the group's measurements when it moves in or out of the row.
	return (
		<Dropdown
			nativeButton
			items={items}
			{...placement}
			disabled={disabled}
			disabledTooltip={undefined}
		>
			{member}
		</Dropdown>
	);
}
