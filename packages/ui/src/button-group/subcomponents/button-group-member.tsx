import { Button as BaseUiButton } from '@base-ui/react/button';
import { useRender } from '@base-ui/react/use-render';
import {
	forwardRef,
	type HTMLAttributes,
	type MouseEvent,
	type ReactElement,
	type Ref,
} from 'react';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { cn } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { TooltipStack } from '../../tooltip/subcomponents/tooltip-stack.js';
import {
	hasTooltipContent,
	type TooltipContentStackEntry,
} from '../../tooltip/tooltip-content-stack-context.js';
import styles from '../button-group.module.scss';
import { ButtonGroupTextOverflow } from '../constants.js';
import type { ButtonGroupPositionType, ButtonGroupTextOverflowType } from '../types.js';
import {
	ButtonGroupMemberContent,
	type ButtonGroupMemberContentProps,
} from './button-group-member-content.js';

/**
 * @access private
 */
export type ButtonGroupMemberProps = Omit<
	ButtonGroupMemberContentProps,
	'labelRef' | 'paintLabel'
> &
	Omit<HTMLAttributes<HTMLElement>, 'prefix' | 'onClick' | 'children'> & {
		/**
		 * Which corners stay rounded, and whether the member pulls back over its neighbour's border.
		 */
		position: ButtonGroupPositionType;
		textOverflow: ButtonGroupTextOverflowType;
		/**
		 * Blocks presses and fades the member. Set for a disabled or a loading member.
		 */
		disabled: boolean;
		/**
		 * Adds `aria-busy` and cross-fades the spinner over the prefix slot.
		 */
		loading: boolean;
		/**
		 * Why the member is blocked, most general first. The truncated label is added after them by
		 * the member itself.
		 */
		tooltipEntries: TooltipContentStackEntry[];
		/**
		 * True while the member sits in the overflow menu. It stays mounted, out of the flow and
		 * invisible, so the group measures it as it would render.
		 */
		collapsed?: boolean;
		/**
		 * Renders the member as this element instead of a `<button>`, so an anchor stays a link.
		 *
		 * @note Ignored while `disabled`: middle click and the context menu still reach an anchor, so
		 * the only way to block one is to render the plain button.
		 */
		render?: ReactElement;
		onClick?: (event: MouseEvent) => void;
		testId?: string;
	};

/**
 * One segment of the group: a Base UI `Button` with the prefix, label and suffix slots, and the
 * tooltip carrying whatever the label cannot show. Also the overflow menu's trigger, so every prop
 * the menu merges in is forwarded to the button.
 *
 * @access private
 */
export const ButtonGroupMember = forwardRef<HTMLElement, ButtonGroupMemberProps>(
	function ButtonGroupMember(
		{
			label,
			emptyLabel,
			icon,
			prefix,
			suffix,
			position,
			textOverflow,
			disabled,
			loading,
			tooltipEntries,
			collapsed = false,
			render,
			testId,
			className,
			...props
		},
		ref,
	) {
		const hasOverflowTooltip =
			icon === undefined && textOverflow === ButtonGroupTextOverflow.Ellipsis;
		const [isLabelOverflowing, labelRef] = useIsLabelTruncated(hasOverflowTooltip);

		const entries = tooltipEntries.filter((entry) => hasTooltipContent(entry.content));

		if (isLabelOverflowing) {
			entries.push({ id: 'label', content: label });
		}

		const tooltipContent = entries.length === 0 ? null : <TooltipStack items={entries} />;

		// `data-slot` after the spread, so the overflow menu's trigger props do not rename the
		// ellipsis. A collapsed member leaves its `testId` to its menu row.
		const memberProps = {
			'data-position': position,
			'data-icon': icon !== undefined,
			'data-text-overflow': textOverflow,
			'data-truncated': isLabelOverflowing || undefined,
			'data-collapsed': collapsed || undefined,
			className: cn(styles['button-group__item'], className),
			'aria-busy': loading || undefined,
			...props,
			'data-slot': 'button-group-item',
			...(collapsed ? { 'aria-hidden': true, tabIndex: -1 } : {}),
			...(testId === undefined || collapsed ? {} : { 'data-testid': testId }),
		};
		const content = (
			<ButtonGroupMemberContent
				label={label}
				emptyLabel={emptyLabel}
				icon={icon}
				prefix={prefix}
				suffix={suffix}
				labelRef={labelRef}
				paintLabel={collapsed}
			/>
		);

		const isLink = render !== undefined && !disabled;
		const linkEl = useRender({
			enabled: isLink,
			render,
			ref,
			props: { ...memberProps, children: content },
		});

		const memberEl = linkEl ?? (
			<BaseUiButton
				ref={ref as Ref<HTMLButtonElement>}
				disabled={disabled}
				focusableWhenDisabled
				{...memberProps}
			>
				{content}
			</BaseUiButton>
		);

		// The trigger stays mounted whether or not there is anything to say, so the member never
		// remounts, and never drops its focus, when a reason or a truncated label appears.
		return (
			<TooltipAnchor
				content={tooltipContent}
				contentProps={{ className: styles['button-group__tooltip'] }}
			>
				{memberEl}
			</TooltipAnchor>
		);
	},
);
