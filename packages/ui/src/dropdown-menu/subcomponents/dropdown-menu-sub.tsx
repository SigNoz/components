import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';

export type DropdownMenuSubProps = {
	/**
	 * The children of the submenu.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the submenu.
	 * Must be used in conjunction with `onOpenChange`.
	 */
	open?: boolean;
	/**
	 * The open state of the submenu when it is initially rendered.
	 * Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the submenu changes.
	 */
	onOpenChange?: (open: boolean) => void;
};

/**
 * Contains all the parts of a submenu.
 * Compose with `DropdownMenuSubTrigger` and `DropdownMenuSubContent`.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   <DropdownMenuSub>
 *     <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *     <DropdownMenuSubContent>
 *       <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *       <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 *     </DropdownMenuSubContent>
 *   </DropdownMenuSub>
 * </DropdownMenuContent>
 * ```
 */
export function DropdownMenuSub(props: DropdownMenuSubProps) {
	return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}
