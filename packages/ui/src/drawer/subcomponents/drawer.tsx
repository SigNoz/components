import * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';

export type DrawerProps = {
	/**
	 * The content of the drawer.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the drawer. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * The open state of the drawer when it is initially rendered. Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the drawer changes.
	 */
	onOpenChange?(open: boolean): void;
	/**
	 * The modality of the drawer. When set to true, interaction with outside elements will be disabled and only drawer content will be visible to screen readers.
	 * @default true
	 */
	modal?: boolean;
};

/**
 * Root component that manages the open state and accessibility wiring
 * for a drawer. Compose it with `DrawerTrigger`, `DrawerContent`,
 * `DrawerHeader`, `DrawerTitle`, `DrawerDescription` and `DrawerFooter`.
 * Drawers slide in from the specified direction (top, right, bottom, left).
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Edit settings</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled drawer
 * const [open, setOpen] = React.useState(false);
 *
 * <Drawer open={open} onOpenChange={setOpen}>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open controlled drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent direction="right">
 *     <DrawerHeader>
 *       <DrawerTitle>Controlled drawer</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <Button variant="solid" color="primary" onClick={() => setOpen(false)}>
 *         Close
 *       </Button>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function Drawer(props: DrawerProps) {
	return <DialogPrimitive.Root {...props} />;
}
