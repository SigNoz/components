import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, type Variants } from 'motion/react';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';
import { drawerTransition, syncMotionStyle } from '../utils.js';

const overlayVariants: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export type DrawerOverlayProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
	'id' | 'className' | 'style'
> & {
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * Test ID for the drawer overlay.
	 */
	testId?: string;
};

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
export const DrawerOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	DrawerOverlayProps
>(({ className, style, testId, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		data-slot="drawer-overlay"
		data-testid={testId}
		asChild
		{...props}
	>
		<motion.div
			className={cn(styles.drawer__overlay, className)}
			style={style}
			variants={overlayVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			onUpdate={syncMotionStyle}
			transition={drawerTransition}
		/>
	</DialogPrimitive.Overlay>
));
DrawerOverlay.displayName = 'DrawerOverlay';
