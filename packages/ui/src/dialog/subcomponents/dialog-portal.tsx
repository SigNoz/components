import * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';

export type DialogPortalProps = {
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
	 * Test ID for the dialog portal.
	 */
	testId?: string;
};

/**
 * Portals dialog content outside of the normal DOM tree, usually to
 * the end of `document.body`. Useful when you need to control the
 * portal `container` or force mounting behavior.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogPortal container={document.getElementById('dialog-root')}>
 *     <DialogOverlay />
 *     <DialogContent width="base">
 *       dialog content here
 *     </DialogContent>
 *   </DialogPortal>
 * </Dialog>
 * ```
 */
export function DialogPortal({ testId, ...props }: DialogPortalProps) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" data-testId={testId} {...props} />;
}
