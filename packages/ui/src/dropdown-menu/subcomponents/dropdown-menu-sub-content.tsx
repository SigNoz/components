import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';
import { DropdownMenuPortal } from './dropdown-menu-portal.js';

type OriginalSubContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>;

export type DropdownMenuSubContentProps = {
	/**
	 * The children of the sub content.
	 */
	children?: React.ReactNode;
	/**
	 * Additional CSS classes to apply to the sub content.
	 */
	className?: string;
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
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	/**
	 * Event handler called when a `pointerdown` event happens outside of the sub content.
	 * Can be prevented.
	 */
	onPointerDownOutside?: OriginalSubContentProps['onPointerDownOutside'];
	/**
	 * Event handler called when the focus moves outside of the sub content.
	 * Can be prevented.
	 */
	onFocusOutside?: OriginalSubContentProps['onFocusOutside'];
	/**
	 * Event handler called when an interaction happens outside the sub content.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: OriginalSubContentProps['onInteractOutside'];
	/**
	 * The distance in pixels from the trigger.
	 * @default 0
	 */
	sideOffset?: number;
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
	 * By default this is the viewport.
	 */
	collisionBoundary?: OriginalSubContentProps['collisionBoundary'];
	/**
	 * The distance in pixels from the boundary edges where collision detection should occur.
	 * @default 0
	 */
	collisionPadding?: OriginalSubContentProps['collisionPadding'];
	/**
	 * The padding between the arrow and the edges of the content.
	 * @default 0
	 */
	arrowPadding?: number;
	/**
	 * The sticky behavior on the align axis.
	 * @default "partial"
	 */
	sticky?: 'partial' | 'always';
	/**
	 * Whether to hide the content when the trigger becomes fully occluded.
	 * @default false
	 */
	hideWhenDetached?: boolean;
};

/**
 * The content that pops out when a submenu is open.
 * Must be rendered inside `DropdownMenuSub`.
 *
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 */
export const DropdownMenuSubContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
	<DropdownMenuPortal>
		<DropdownMenuPrimitive.SubContent
			ref={ref}
			data-slot="dropdown-menu-sub-content"
			className={cn(styles['dropdown-menu__sub-content'], className)}
			{...props}
		/>
	</DropdownMenuPortal>
));

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';
