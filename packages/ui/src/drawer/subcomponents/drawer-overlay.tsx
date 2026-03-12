import {
	DialogOverlay as BaseDialogOverlay,
	type DialogOverlayProps as BaseDialogOverlayProps,
} from '../../dialog/index.js';

export type DrawerOverlayProps = BaseDialogOverlayProps;

/**
 * Semi-transparent background that appears behind `DrawerContent`.
 * Handles fade-in / fade-out animations and blocks interaction with
 * the underlying page while the drawer is open.
 *
 * This is usually composed for you by `DrawerContent`. For most use
 * cases, prefer `DrawerWrapper` which handles overlay setup.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerPortal>
 *     <DrawerOverlay />
 *     <DrawerContent>
 *       Drawer content here
 *     </DrawerContent>
 *   </DrawerPortal>
 * </Drawer>
 * ```
 */
export function DrawerOverlay(props: DrawerOverlayProps) {
	return <BaseDialogOverlay data-slot="drawer-overlay" {...props} />;
}
