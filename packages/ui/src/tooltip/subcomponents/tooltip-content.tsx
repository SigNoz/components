import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../tooltip.module.css';

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
	 * Whether to render in a portal. Set to false when inside modals/dialogs.
	 * @default true
	 */
	withPortal?: boolean;
	/**
	 * The test id of the tooltip content.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'div'>, 'id' | 'className' | 'style' | 'children'>;

function TooltipContentInner({
	className,
	sideOffset = 4,
	testId,
	children,
	arrow = false,
	...props
}: Omit<TooltipContentProps, 'withPortal'>) {
	return (
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
	);
}

/**
 * The content of the tooltip. Supports positioning via `side`, `align`,
 * and collision detection. Use with `TooltipTrigger` when composing a custom tooltip.
 *
 * Set `withPortal={false}` when inside modals/dialogs to avoid z-index issues.
 */
export function TooltipContent({ withPortal = true, ...props }: TooltipContentProps) {
	if (withPortal) {
		return (
			<TooltipPrimitive.Portal>
				<TooltipContentInner {...props} />
			</TooltipPrimitive.Portal>
		);
	}

	return <TooltipContentInner {...props} />;
}
