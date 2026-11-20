import { forwardRef, type ReactNode } from 'react';
import { InternalButton } from '../../button/button.js';
import type { ButtonInternalProps, ButtonProps } from '../../button/types.js';
import type { TooltipContentStackEntry } from '../../tooltip/tooltip-content-stack-context.js';
import styles from '../button-group.module.scss';
import type {
	ButtonGroupItemButtonProps,
	ButtonGroupJoinType,
	ButtonGroupPositionType,
	ButtonGroupSizeType,
	ButtonGroupTextOverflowType,
	ButtonGroupVariantColorType,
} from '../types.js';

/**
 * @access private
 */
export type ButtonGroupMemberProps = {
	look: ButtonGroupVariantColorType;
	size: ButtonGroupSizeType;
	/**
	 * Where the member sits in the visible row.
	 */
	position: ButtonGroupPositionType;
	/**
	 * How the member meets the one before it and the one after it. `undefined` at the ends of the
	 * row.
	 */
	joinStart: ButtonGroupJoinType | undefined;
	joinEnd: ButtonGroupJoinType | undefined;
	textOverflow: ButtonGroupTextOverflowType;
	disabled: boolean;
	loading: boolean;
	/**
	 * Why the member is blocked, most general first. `Button` adds the truncated label after them.
	 */
	tooltipEntries: TooltipContentStackEntry[];
	/**
	 * True while the member sits in the overflow menu. It stays mounted, out of the flow and
	 * invisible, so the group measures it as it would render.
	 */
	collapsed?: boolean;
	/**
	 * The member's content. An element for an icon member, the label otherwise.
	 */
	children: ReactNode;
	icon?: boolean;
	buttonProps?: ButtonGroupItemButtonProps & Pick<ButtonProps, 'onClick' | 'prefix' | 'suffix'>;
	render?: ButtonInternalProps['render'];
	testId?: string;
	'aria-label'?: string;
	[key: `data-${string}`]: unknown;
};

/**
 * One segment of the group: an `InternalButton` in the member's variant and colour, with the
 * corners and margin of its joins. Also the overflow menu's trigger, so every prop the menu merges
 * in is forwarded to the button.
 *
 * @access private
 */
export const ButtonGroupMember = forwardRef<HTMLButtonElement, ButtonGroupMemberProps>(
	function ButtonGroupMember(
		{
			look,
			size,
			position,
			joinStart,
			joinEnd,
			textOverflow,
			disabled,
			loading,
			tooltipEntries,
			collapsed = false,
			children,
			icon = false,
			buttonProps,
			render,
			testId,
			...props
		},
		ref,
	) {
		// `data-slot` after the spread, so the overflow menu's trigger props do not rename the
		// ellipsis. A collapsed member leaves its `testId` to its menu row.
		const memberProps = {
			textOverflow,
			...buttonProps,
			...props,
			...look,
			size,
			disabled,
			disabledTooltip: undefined,
			loading,
			tooltipEntries,
			className: styles['button-group__item'],
			'data-slot': 'button-group-item',
			'data-position': position,
			'data-join-start': joinStart,
			'data-join-end': joinEnd,
			'data-collapsed': collapsed || undefined,
			...(collapsed ? { 'aria-hidden': true, tabIndex: -1 } : {}),
			...(testId === undefined || collapsed ? {} : { testId }),
			...(render === undefined ? {} : { render }),
		};

		// One assertion for the whole bag: the item type already enforced the pairings `Button`
		// checks at a call site (variant and colour, icon and `aria-label`), and an icon member's
		// children are the icon element.
		const buttonAllProps = {
			...memberProps,
			icon: icon || undefined,
			children,
		} as ButtonProps & ButtonInternalProps;

		return <InternalButton ref={ref} {...buttonAllProps} />;
	},
);
