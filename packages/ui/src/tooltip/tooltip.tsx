import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './tooltip.module.css';

export type TooltipProps = {
	/**
	 * The controlled open state of the tooltip. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the tooltip changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The duration from when the pointer enters the trigger until the tooltip gets opened. This will
	 * override the prop with the same name passed to Provider.
	 * @defaultValue 700
	 */
	delayDuration?: number;
	/**
	 * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;
	/**
	 * The content of the tooltip. Otherwise, the children will be used as the tooltip content.
	 */
	title?: React.ReactNode;
	/**
	 * Whether to show the arrow.
	 */
	arrow?: boolean;
	/**
	 * The test id of the tooltip.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'div'>, 'id' | 'className' | 'style' | 'children'>;

type OriginalTooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>;

export type TooltipContentProps = {
	/**
	 * The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.
	 */
	side?: OriginalTooltipContentProps['side'];
	/**
	 * The distance in pixels from the trigger.
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger. May change when collisions occur.
	 */
	align?: OriginalTooltipContentProps['align'];
	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 */
	alignOffset?: number;
	/**
	 * The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners.
	 */
	arrowPadding?: number;
	/**
	 * When true, overrides the side and align preferences to prevent collisions with boundary edges.
	 */
	avoidCollisions?: boolean;
	/**
	 * The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check.
	 */
	collisionBoundary?: OriginalTooltipContentProps['collisionBoundary'];
	/**
	 * The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }.
	 */
	collisionPadding?: OriginalTooltipContentProps['collisionPadding'];
	/**
	 * The sticky behavior on the align axis. "partial" will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless.
	 */
	sticky?: 'partial' | 'always';
	/**
	 * Whether to hide the content when the trigger becomes fully occluded.
	 */
	hideWhenDetached?: boolean;
	/**
	 * The strategy used to update the position of the content. "optimized" will use ResizeObserver to
	 * only update when necessary; "always" will update on every frame.
	 * @defaultValue 'optimized'
	 */
	updatePositionStrategy?: 'optimized' | 'always';
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;

	/**
	 * A more descriptive label for accessibility purpose
	 */
	'aria-label'?: string;
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: OriginalTooltipContentProps['onEscapeKeyDown'];
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the `Tooltip`.
	 * Can be prevented.
	 */
	onPointerDownOutside?: OriginalTooltipContentProps['onPointerDownOutside'];
	/**
	 * Whether to show the arrow.
	 */
	arrow?: boolean;
	/**
	 * The test id of the tooltip content.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'div'>, 'id' | 'className' | 'style' | 'children'>;

export type TooltipProviderProps = {
	/**
	 * The children of the tooltip provider.
	 */
	children: React.ReactNode;
	/**
	 * The duration from when the pointer enters the trigger until the tooltip gets opened.
	 * @defaultValue 700
	 */
	delayDuration?: number;
	/**
	 * How much time a user has to enter another trigger without incurring a delay again.
	 * @defaultValue 300
	 */
	skipDelayDuration?: number;
	/**
	 * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;
};

/**
 * Wraps your app (or a section of it) to provide shared configuration for all tooltips.
 * Use delayDuration to control the hover delay; set to 0 in Storybook for instant feedback.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={700}>
 *   <Tooltip title="Helpful information">
 *     <Button>Hover me</Button>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
export function TooltipProvider({ delayDuration = 0, ...props }: TooltipProviderProps) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

/**
 * Root component that manages the open state and accessibility wiring for a tooltip.
 * Use with `title` for a simple tooltip, or compose with `TooltipTrigger` and `TooltipContent`
 * for custom content and positioning.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip title="Helpful information" arrow>
 *     <Button variant="solid" color="secondary">
 *       Hover me
 *     </Button>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip title="I appear after 500ms" delayDuration={500}>
 *     <Button>Display tooltip after 500ms delay</Button>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger asChild>
 *       <Button>Custom content</Button>
 *     </TooltipTrigger>
 *     <TooltipContent side="bottom" arrow>
 *       <span>Rich tooltip content</span>
 *     </TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
export function Tooltip({ title, arrow, open, children, testId, ...props }: TooltipProps) {
	return (
		<TooltipPrimitive.Root data-slot="tooltip" data-testid={testId} open={open} {...props}>
			{title ? (
				<>
					<TooltipTrigger asChild>{children}</TooltipTrigger>
					<TooltipContent arrow={arrow}>{title}</TooltipContent>
				</>
			) : (
				children
			)}
		</TooltipPrimitive.Root>
	);
}

/**
 * The element that triggers the tooltip to open on hover. Use with `asChild` to delegate
 * to a child element (e.g. a Button).
 */
export function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * The content of the tooltip, rendered in a portal. Supports positioning via `side`, `align`,
 * and collision detection. Use with `TooltipTrigger` when composing a custom tooltip.
 */
export function TooltipContent({
	className,
	sideOffset = 4,
	testId,
	children,
	arrow = false,
	...props
}: TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				data-testid={testId}
				sideOffset={arrow ? 0 : sideOffset}
				className={cn(styles.tooltip__content, className)}
				{...props}
			>
				{children}
				{arrow && (
					<TooltipPrimitive.Arrow asChild className={styles.tooltip__arrow}>
						<svg width={10} height={5} viewBox="0 0 30 10" preserveAspectRatio="none">
							<path d="M 0,0 L 15,10 L 30,0" className={styles.tooltip__arrowPath} />
						</svg>
					</TooltipPrimitive.Arrow>
				)}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}
