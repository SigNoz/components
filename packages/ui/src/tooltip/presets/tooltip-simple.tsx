import type * as React from 'react';
import { TooltipContent, type TooltipContentProps } from '../subcomponents/tooltip-content.js';
import { TooltipRoot, type TooltipRootProps } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';

export type TooltipSimpleProps = {
	/**
	 * The content of the tooltip.
	 */
	title: React.ReactNode;
	/**
	 * Whether to show the arrow.
	 * @default false
	 */
	arrow?: boolean;
	/**
	 * The preferred side of the trigger to render against when open.
	 * @default 'top'
	 */
	side?: TooltipContentProps['side'];
	/**
	 * The preferred alignment against the trigger.
	 * @default 'center'
	 */
	align?: TooltipContentProps['align'];
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 */
	alignOffset?: number;
	/**
	 * When true, overrides the side and align preferences to prevent collisions with boundary edges.
	 * @default true
	 */
	avoidCollisions?: boolean;
	/**
	 * Whether to render in a portal. Set to false when inside modals/dialogs.
	 * @default true
	 */
	withPortal?: boolean;
	/**
	 * Additional props to pass to TooltipContent.
	 */
	tooltipContentProps?: Omit<
		TooltipContentProps,
		| 'side'
		| 'align'
		| 'sideOffset'
		| 'alignOffset'
		| 'avoidCollisions'
		| 'arrow'
		| 'withPortal'
		| 'children'
	>;
	/**
	 * The test id of the tooltip.
	 */
	testId?: string;
	/**
	 * The trigger element.
	 */
	children: React.ReactNode;
} & Omit<TooltipRootProps, 'children'>;

/**
 * Simple tooltip preset. Wraps a trigger element and shows a tooltip on hover.
 *
 * @example Basic usage
 * ```tsx
 * <TooltipProvider>
 *   <TooltipSimple title="Helpful information" arrow>
 *     <Button>Hover me</Button>
 *   </TooltipSimple>
 * </TooltipProvider>
 * ```
 *
 * @example With positioning
 * ```tsx
 * <TooltipProvider>
 *   <TooltipSimple title="On the right" side="right" align="start">
 *     <Button>Hover me</Button>
 *   </TooltipSimple>
 * </TooltipProvider>
 * ```
 *
 * @example Inside a modal (no portal)
 * ```tsx
 * <Dialog>
 *   <DialogContent>
 *     <TooltipSimple title="Inside modal" withPortal={false}>
 *       <Button>Hover me</Button>
 *     </TooltipSimple>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @example With extra content props
 * ```tsx
 * <TooltipSimple
 *   title="Custom"
 *   tooltipContentProps={{ className: 'custom-class', arrowPadding: 8 }}
 * >
 *   <Button>Hover me</Button>
 * </TooltipSimple>
 * ```
 */
export function TooltipSimple({
	title,
	arrow = false,
	side,
	align,
	sideOffset,
	alignOffset,
	avoidCollisions,
	withPortal = true,
	tooltipContentProps,
	testId,
	children,
	...rootProps
}: TooltipSimpleProps) {
	return (
		<TooltipRoot data-testid={testId} {...rootProps}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				arrow={arrow}
				side={side}
				align={align}
				sideOffset={sideOffset}
				alignOffset={alignOffset}
				avoidCollisions={avoidCollisions}
				withPortal={withPortal}
				{...tooltipContentProps}
			>
				{title}
			</TooltipContent>
		</TooltipRoot>
	);
}
