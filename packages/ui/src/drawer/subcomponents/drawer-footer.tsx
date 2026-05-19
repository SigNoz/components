import * as React from 'react';
import { DialogFooter, type DialogFooterProps } from '../../dialog/index.js';

export type DrawerFooterProps = DialogFooterProps;

/**
 * Bottom action area of the drawer, typically used for primary and
 * secondary buttons like "Cancel" and "Confirm".
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
 *     <DrawerFooter>
 *       <Button variant="ghost" color="secondary">Cancel</Button>
 *       <Button variant="solid" color="destructive">Delete</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerFooter = React.forwardRef<
	React.ElementRef<typeof DialogFooter>,
	DrawerFooterProps
>((props, ref) => <DialogFooter ref={ref} data-slot="drawer-footer" {...props} />);
DrawerFooter.displayName = 'DrawerFooter';
