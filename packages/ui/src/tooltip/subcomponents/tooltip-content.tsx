import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';
import { type DismissHandlers, useRegisterDismissHandlers } from '../../lib/dismiss-handlers.js';
import { InlinePortal } from '../../lib/inline-portal.js';
import { cn } from '../../lib/utils.js';
import type { CollisionBoundary, CollisionPadding } from '../../lib/positioning.js';
import styles from '../tooltip.module.css';

type PositionerProps = React.ComponentProps<typeof TooltipPrimitive.Positioner>;

export type TooltipContentProps = {
	/**
	 * The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.
	 */
	side?: PositionerProps['side'];
	/**
	 * The distance in pixels from the trigger.
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger. May change when collisions occur.
	 */
	align?: PositionerProps['align'];
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
	collisionBoundary?: CollisionBoundary;
	/**
	 * The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }.
	 */
	collisionPadding?: CollisionPadding;
	/**
	 * The sticky behavior on the align axis. "partial" will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless.
	 */
	sticky?: 'partial' | 'always';
	/**
	 * Whether to hide the content when the trigger becomes fully occluded.
	 */
	hideWhenDetached?: boolean;
	/**
	 * The strategy used to update the position of the content.
	 *
	 * @deprecated No longer configurable — the position is always tracked while the
	 * tooltip is open. Accepted for API compatibility and otherwise ignored.
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
	onEscapeKeyDown?: DismissHandlers['onEscapeKeyDown'];
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the `Tooltip`.
	 * Can be prevented.
	 */
	onPointerDownOutside?: DismissHandlers['onPointerDownOutside'];
	/**
	 * Whether to show the arrow.
	 */
	arrow?: boolean;
	/**
	 * Whether to render in a portal. Set to false when inside modals/dialogs.
	 * @default true
	 */
	withPortal?: boolean;
	/**
	 * The test id of the tooltip content.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'div'>, 'id' | 'className' | 'style' | 'children'>;

/**
 * Radix took a single `avoidCollisions` boolean; Base UI takes a per-axis
 * strategy. `flip`/`shift` reproduces Radix's behaviour of reversing the side
 * and nudging the alignment.
 */
const COLLISIONS_ON: PositionerProps['collisionAvoidance'] = { side: 'flip', align: 'shift' };
const COLLISIONS_OFF: PositionerProps['collisionAvoidance'] = { side: 'none', align: 'none' };

const TooltipContentInner = React.forwardRef<
	HTMLDivElement,
	Omit<TooltipContentProps, 'withPortal' | 'forceMount'>
>(
	(
		{
			side,
			sideOffset = 4,
			align,
			alignOffset,
			arrowPadding,
			avoidCollisions,
			collisionBoundary,
			collisionPadding,
			sticky,
			hideWhenDetached,
			updatePositionStrategy: _updatePositionStrategy,
			onEscapeKeyDown,
			onPointerDownOutside,
			arrow = false,
			testId,
			className,
			children,
			...popupProps
		},
		ref,
	) => {
		useRegisterDismissHandlers({ onEscapeKeyDown, onPointerDownOutside });

		return (
			<TooltipPrimitive.Positioner
				className={styles.tooltip__positioner}
				data-hide-when-detached={hideWhenDetached ? '' : undefined}
				side={side}
				sideOffset={arrow ? 0 : sideOffset}
				align={align}
				alignOffset={alignOffset}
				arrowPadding={arrowPadding}
				collisionBoundary={collisionBoundary ?? undefined}
				collisionPadding={collisionPadding}
				sticky={sticky === 'always'}
				collisionAvoidance={
					avoidCollisions === undefined
						? undefined
						: avoidCollisions
							? COLLISIONS_ON
							: COLLISIONS_OFF
				}
			>
				<TooltipPrimitive.Popup
					ref={ref}
					data-slot="tooltip-content"
					data-testid={testId}
					className={cn(styles.tooltip__content, className)}
					{...popupProps}
				>
					{children}
					{arrow && (
						<TooltipPrimitive.Arrow
							className={styles.tooltip__arrow}
							render={
								<svg width={10} height={5} viewBox="0 0 30 10" preserveAspectRatio="none">
									<path d="M 0,0 L 15,10 L 30,0" className={styles.tooltip__arrowPath} />
								</svg>
							}
						/>
					)}
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		);
	},
);
TooltipContentInner.displayName = 'TooltipContentInner';

/**
 * The content of the tooltip. Supports positioning via `side`, `align`,
 * and collision detection. Use with `TooltipTrigger` when composing a custom tooltip.
 *
 * Set `withPortal={false}` when inside modals/dialogs to avoid z-index issues.
 */
export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
	({ withPortal = true, forceMount, ...props }, ref) => {
		if (withPortal) {
			return (
				<TooltipPrimitive.Portal keepMounted={forceMount}>
					<TooltipContentInner ref={ref} {...props} />
				</TooltipPrimitive.Portal>
			);
		}

		return (
			<InlinePortal Portal={TooltipPrimitive.Portal} keepMounted={forceMount}>
				<TooltipContentInner ref={ref} {...props} />
			</InlinePortal>
		);
	},
);
TooltipContent.displayName = 'TooltipContent';
