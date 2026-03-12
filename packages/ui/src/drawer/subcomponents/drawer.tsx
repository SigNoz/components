import { Dialog, type DialogProps } from '../../dialog/index.js';

export type DrawerProps = DialogProps;

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
	return <Dialog {...props} />;
}
