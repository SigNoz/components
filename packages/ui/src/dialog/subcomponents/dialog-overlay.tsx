import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, type Variants } from 'motion/react';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

const overlayVariants: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export type DialogOverlayProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
	'id' | 'className' | 'style'
> & {
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * Test ID for the dialog overlay.
	 */
	testId?: string;
};

/**
 * Semi-transparent background that appears behind `DialogContent`.
 * Handles fade-in / fade-out animations and blocks interaction with
 * the underlying page while the dialog is open.
 *
 * This is usually composed for you by `DialogContent`, but can be
 * used directly for advanced custom layouts.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogPortal>
 *     <DialogOverlay />
 *     <DialogContent width="base">
 *       dialog content here
 *     </DialogContent>
 *   </DialogPortal>
 * </Dialog>
 * ```
 */
export const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	DialogOverlayProps
>(({ className, style, testId, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		data-slot="dialog-overlay"
		data-testId={testId}
		asChild
		{...props}
	>
		<motion.div
			className={cn(styles.dialog__overlay, className)}
			style={style}
			variants={overlayVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
		/>
	</DialogPrimitive.Overlay>
));
