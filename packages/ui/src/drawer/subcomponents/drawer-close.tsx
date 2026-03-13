import { DialogClose, type DialogCloseProps } from '../../dialog/index.js';

export type DrawerCloseProps = DialogCloseProps;

/**
 * Element that closes the drawer when activated. Often used to wrap
 * a `Button` inside the drawer footer or to render a custom close
 * control in the header.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Drawer with footer close</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Use the footer button to close.</p>
 *     </DrawerDescription>
 *     <DrawerFooter>
 *       <DrawerClose asChild>
 *         <Button variant="solid" color="primary">Close</Button>
 *       </DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function DrawerClose(props: DrawerCloseProps) {
	return <DialogClose data-slot="drawer-close" {...props} />;
}
