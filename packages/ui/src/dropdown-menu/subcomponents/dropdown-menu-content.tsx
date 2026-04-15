import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';
import { DropdownMenuPortal } from './dropdown-menu-portal.js';

type OriginalContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;

export type DropdownMenuContentProps = {
	/**
	 * The children of the content.
	 */
	children?: React.ReactNode;
	/**
	 * Additional CSS classes to apply to the content.
	 */
	className?: string;
	/**
	 * Inline styles to apply to the content.
	 */
	style?: OriginalContentProps['style'];
	/**
	 * The id of the content.
	 */
	id?: string;
	/**
	 * The testId associated with the content.
	 */
	testId?: string;
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * When `true`, keyboard navigation will loop from last item to first, and vice versa.
	 * @default false
	 */
	loop?: boolean;
	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: OriginalContentProps['onCloseAutoFocus'];
	/**
	 * Event handler called when auto-focusing on open.
	 * Can be prevented by calling `event.preventDefault()`.
	 */
	onOpenAutoFocus?: (event: Event) => void;
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	/**
	 * Event handler called when a `pointerdown` event happens outside of the content.
	 * Can be prevented.
	 */
	onPointerDownOutside?: OriginalContentProps['onPointerDownOutside'];
	/**
	 * Event handler called when the focus moves outside of the content.
	 * Can be prevented.
	 */
	onFocusOutside?: OriginalContentProps['onFocusOutside'];
	/**
	 * Event handler called when an interaction happens outside the content.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: OriginalContentProps['onInteractOutside'];
	/**
	 * The preferred side of the trigger to render against when open.
	 * Will be reversed when collisions occur and `avoidCollisions` is enabled.
	 * @default "bottom"
	 */
	side?: 'top' | 'right' | 'bottom' | 'left';
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * The preferred alignment against the trigger.
	 * May change when collisions occur.
	 * @default "center"
	 */
	align?: 'start' | 'center' | 'end';
	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 * @default 0
	 */
	alignOffset?: number;
	/**
	 * When `true`, overrides the `side` and `align` preferences to prevent
	 * collisions with boundary edges.
	 * @default true
	 */
	avoidCollisions?: boolean;
	/**
	 * The element used as the collision boundary.
	 * By default this is the viewport, though you can provide additional element(s)
	 * to be included in this check.
	 */
	collisionBoundary?: OriginalContentProps['collisionBoundary'];
	/**
	 * The distance in pixels from the boundary edges where collision detection should occur.
	 * Accepts a number (same for all sides), or a partial padding object.
	 * @default 0
	 */
	collisionPadding?: OriginalContentProps['collisionPadding'];
	/**
	 * The padding between the arrow and the edges of the content.
	 * If your content has border-radius, this will prevent it from overflowing the corners.
	 * @default 0
	 */
	arrowPadding?: number;
	/**
	 * The sticky behavior on the align axis.
	 * "partial" will keep the content in the boundary as long as the trigger is at least
	 * partially in the boundary whilst "always" will keep the content in the boundary regardless.
	 * @default "partial"
	 */
	sticky?: 'partial' | 'always';
	/**
	 * Whether to hide the content when the trigger becomes fully occluded.
	 * @default false
	 */
	hideWhenDetached?: boolean;
	/**
	 * Event handler called when a key is pressed within the content.
	 */
	onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

/**
 * The content that pops out when the dropdown menu is open.
 * Rendered in a portal by default.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Open</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent side="bottom" align="start">
 *     <DropdownMenuItem>Profile</DropdownMenuItem>
 *     <DropdownMenuItem>Settings</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 *
 * @example
 * ```tsx
 * // With positioning
 * <DropdownMenuContent side="right" sideOffset={8} align="end">
 *   <DropdownMenuItem>Action 1</DropdownMenuItem>
 *   <DropdownMenuItem>Action 2</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	DropdownMenuContentProps
>(({ className, sideOffset = 4, testId, id, ...props }, ref) => (
	<DropdownMenuPortal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			data-slot="dropdown-menu-content"
			data-testid={testId}
			id={id}
			sideOffset={sideOffset}
			className={cn(styles['dropdown-menu__content'], className)}
			{...props}
		/>
	</DropdownMenuPortal>
));

DropdownMenuContent.displayName = 'DropdownMenuContent';
