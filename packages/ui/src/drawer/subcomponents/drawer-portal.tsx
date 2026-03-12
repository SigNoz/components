import {
	DialogPortal as BaseDialogPortal,
	type DialogPortalProps as BaseDialogPortalProps,
} from '../../dialog/index.js';

export type DrawerPortalProps = BaseDialogPortalProps;

/**
 * Portals drawer content outside of the normal DOM tree, usually to
 * the end of `document.body`. Useful when you need to control the
 * portal `container` or force mounting behavior.
 *
 * For most use cases, prefer `DrawerWrapper` which handles portal setup.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerPortal container={document.getElementById('drawer-root')}>
 *     <DrawerOverlay />
 *     <DrawerContent>
 *       Drawer content here
 *     </DrawerContent>
 *   </DrawerPortal>
 * </Drawer>
 * ```
 */
export function DrawerPortal(props: DrawerPortalProps) {
	return <BaseDialogPortal data-slot="drawer-portal" {...props} />;
}
