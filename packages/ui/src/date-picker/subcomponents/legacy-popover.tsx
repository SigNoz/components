import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from './legacy-popover.module.scss';

/**
 * The pre-Base-UI Radix popover, kept only as DatePicker's floating shell until
 * DatePicker's own rework. Reads `--date-picker-popover-*` custom properties, never
 * the `--popover-*` tokens, which belong to the reworked Popover component.
 *
 * @access private
 */

export type LegacyPopoverProps = {
	/**
	 * The children of the popover.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the popover. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * The open state of the popover when it is initially rendered. Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the popover changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers.
	 */
	modal?: boolean;
	/**
	 * The test id of the popover.
	 */
	testId?: string;
};

/**
 * Root component that manages the open state and accessibility wiring for a popover.
 *
 * @access private
 */
export function LegacyPopover({ testId, ...props }: LegacyPopoverProps) {
	return <PopoverPrimitive.Root data-slot="date-picker-popover" data-testid={testId} {...props} />;
}

export type LegacyPopoverTriggerProps = Omit<
	React.ComponentProps<typeof PopoverPrimitive.Trigger>,
	'id' | 'className'
> & {
	/**
	 * The id of the popover trigger.
	 */
	id?: string;
	/**
	 * The class name of the popover trigger.
	 */
	className?: string;
	/**
	 * The test id of the popover trigger.
	 */
	testId?: string;
};

/**
 * The button that toggles the popover. Use `asChild` to delegate to a child element.
 *
 * @access private
 */
export const LegacyPopoverTrigger = React.forwardRef<HTMLButtonElement, LegacyPopoverTriggerProps>(
	({ testId, id, className, ...props }, ref) => {
		return (
			<PopoverPrimitive.Trigger
				ref={ref}
				data-slot="date-picker-popover-trigger"
				data-testid={testId}
				id={id}
				className={className}
				{...props}
			/>
		);
	},
);
LegacyPopoverTrigger.displayName = 'LegacyPopoverTrigger';

type LegacyPopoverPortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal>;

function LegacyPopoverPortal(props: LegacyPopoverPortalProps) {
	return <PopoverPrimitive.Portal data-slot="date-picker-popover-portal" {...props} />;
}

/**
 * Arrow that visually links the trigger with the content. Rendered by the content's `arrow` prop.
 *
 * @access private
 */
const LegacyPopoverArrow = React.forwardRef<SVGSVGElement>((_, ref) => {
	return (
		<PopoverPrimitive.Arrow
			ref={ref}
			data-slot="date-picker-popover-arrow"
			asChild
			className={styles.popover__arrow}
		>
			<svg width={10} height={5} viewBox="0 0 30 10" preserveAspectRatio="none">
				<path d="M 0,0 L 15,10 L 30,0" className={styles.popover__arrowPath} />
			</svg>
		</PopoverPrimitive.Arrow>
	);
});
LegacyPopoverArrow.displayName = 'LegacyPopoverArrow';

type OriginalPopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>;

export type LegacyPopoverContentProps = {
	/**
	 * The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.
	 */
	side?: OriginalPopoverContentProps['side'];
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger. May change when collisions occur.
	 */
	align?: OriginalPopoverContentProps['align'];
	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 */
	alignOffset?: number;
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onPointerDownOutside?: OriginalPopoverContentProps['onPointerDownOutside'];
	/**
	 * The test id of the popover content.
	 */
	testId?: string;
	/**
	 * Whether to show the arrow.
	 */
	arrow?: boolean;
} & Pick<React.ComponentProps<'div'>, 'id' | 'className' | 'style' | 'children'>;

/**
 * The content that pops out when the popover is open. Rendered in a portal.
 *
 * @access private
 */
export const LegacyPopoverContent = React.forwardRef<HTMLDivElement, LegacyPopoverContentProps>(
	(
		{ className, align = 'center', sideOffset = 4, testId, children, arrow = false, ...props },
		ref,
	) => {
		return (
			<LegacyPopoverPortal>
				<PopoverPrimitive.Content
					ref={ref}
					data-slot="date-picker-popover-content"
					data-testid={testId}
					align={align}
					sideOffset={sideOffset}
					className={cn(styles.popover__content, className)}
					{...props}
				>
					{arrow && <LegacyPopoverArrow />}
					{children}
				</PopoverPrimitive.Content>
			</LegacyPopoverPortal>
		);
	},
);
LegacyPopoverContent.displayName = 'LegacyPopoverContent';
