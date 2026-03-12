import { DialogHeader, type DialogHeaderProps } from '../../dialog/index.js';

export type DrawerHeaderProps = DialogHeaderProps;

/**
 * Layout wrapper for the top section of the drawer.
 * Typically contains `DrawerTitle` and optional close button or actions.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Delete this item</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>This action cannot be undone.</p>
 *     </DrawerDescription>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function DrawerHeader(props: DrawerHeaderProps) {
	return <DialogHeader data-slot="drawer-header" {...props} />;
}
