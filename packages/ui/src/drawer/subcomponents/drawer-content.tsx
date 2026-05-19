import * as React from 'react';

import { DialogContent as BaseDialogContent, type DialogContentProps } from '../../dialog/index.js';
import { DrawerOverlay } from './drawer-overlay.js';
import { DrawerPortal } from './drawer-portal.js';

export type DrawerDirection = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerContentProps extends Omit<DialogContentProps, 'position' | 'heightMode'> {
	/**
	 * Side from which the drawer appears. Defaults to the value set on `Drawer`.
	 */
	direction?: DrawerDirection;
	/**
	 * Whether to render the overlay behind the drawer.
	 * @default true
	 */
	showOverlay?: boolean;
}

/**
 * Animated drawer panel that renders the actual drawer surface inside a
 * portal with overlay. Slides in from the specified direction (top, right,
 * bottom, left).
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent direction="right">
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *     <DrawerFooter>
 *       <Button variant="ghost" color="secondary">Cancel</Button>
 *       <Button variant="solid" color="primary">Confirm</Button>
 *     </DrawerFooter>
 *     </DrawerCloseButton />
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerContent = React.forwardRef<
	React.ElementRef<typeof BaseDialogContent>,
	DrawerContentProps
>(({ children, direction, showOverlay = true, forceMount, ...props }, ref) => (
	<DrawerPortal forceMount={forceMount}>
		{showOverlay && <DrawerOverlay forceMount={forceMount} />}
		<BaseDialogContent
			ref={ref}
			animation="slide"
			data-slot="drawer-content"
			position={direction ?? 'right'}
			heightMode="full"
			showOverlay={false}
			forceMount={forceMount}
			{...props}
		>
			{children}
		</BaseDialogContent>
	</DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';
