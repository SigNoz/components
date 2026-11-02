import * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';

export type DrawerPortalProps = {
	children?: React.ReactNode;
	/**
	 * Specify a container element to portal the content into.
	 */
	container?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>['container'];
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * Test ID for the drawer portal.
	 */
	testId?: string;
};

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
export function DrawerPortal({ testId, ...props }: DrawerPortalProps) {
	return <DialogPrimitive.Portal data-slot="drawer-portal" data-testid={testId} {...props} />;
}
