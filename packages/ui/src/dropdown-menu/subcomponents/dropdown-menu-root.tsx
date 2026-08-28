import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import * as React from 'react';
import {
	DismissRegistryProvider,
	runDismissHandlers,
	useDismissRegistry,
} from '../../lib/dismiss-handlers.js';

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
export function DropdownMenu({
	children,
	open,
	defaultOpen,
	onOpenChange,
	modal,
	dir,
}: DropdownMenuProps) {
	const registry = useDismissRegistry();

	const handleOpenChange = React.useCallback(
		(nextOpen: boolean, eventDetails: MenuPrimitive.Root.ChangeEventDetails) => {
			runDismissHandlers(registry, nextOpen, eventDetails);
			if (eventDetails.isCanceled) {
				return;
			}
			onOpenChange?.(nextOpen);
		},
		[onOpenChange, registry],
	);

	const menu = (
		<MenuPrimitive.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={handleOpenChange}
			modal={modal}
		>
			<DismissRegistryProvider registry={registry}>{children}</DismissRegistryProvider>
		</MenuPrimitive.Root>
	);

	// Radix took the reading direction on the root; Base UI reads it from a
	// provider, so one is introduced only when the prop is actually set.
	return dir === undefined ? menu : <DirectionProvider direction={dir}>{menu}</DirectionProvider>;
}
