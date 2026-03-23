import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';

export type DropdownMenuProps = {
	/**
	 * The children of the dropdown menu.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the dropdown menu.
	 * Must be used in conjunction with `onOpenChange`.
	 */
	open?: boolean;
	/**
	 * The open state of the dropdown menu when it is initially rendered.
	 * Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the dropdown menu changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The modality of the dropdown menu. When set to `true`, interaction with
	 * outside elements will be disabled and only menu content will be visible
	 * to screen readers.
	 * @default true
	 */
	modal?: boolean;
	/**
	 * The reading direction of submenus when applicable.
	 * If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.
	 */
	dir?: 'ltr' | 'rtl';
};

/**
 * Root component that manages the open state and accessibility wiring for a dropdown menu.
 * Compose with `DropdownMenuTrigger` and `DropdownMenuContent` for the standard pattern.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button variant="outline">Open menu</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Profile</DropdownMenuItem>
 *     <DropdownMenuItem>Settings</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem>Logout</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled state
 * const [open, setOpen] = React.useState(false);
 *
 * <DropdownMenu open={open} onOpenChange={setOpen}>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Actions</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem onSelect={() => setOpen(false)}>
 *       Close after select
 *     </DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
export function DropdownMenu(props: DropdownMenuProps) {
	return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
