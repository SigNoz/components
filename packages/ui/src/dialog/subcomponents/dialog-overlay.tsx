import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { motion, type Variants } from 'motion/react';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

const overlayVariants: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export type DialogOverlayProps = {
	/**
	 * The id of the dialog overlay.
	 */
	id?: string;
	/**
	 * The class name of the dialog overlay.
	 */
	className?: string;
	/**
	 * Inline styles for the dialog overlay.
	 */
	style?: React.CSSProperties;
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
export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
	({ className, style, testId, forceMount, ...props }, ref) => (
		<DialogPrimitive.Backdrop
			ref={ref}
			data-slot="dialog-overlay"
			data-testid={testId}
			// Base UI hides a kept-mounted backdrop as soon as it considers the dialog
			// unmounted, which would cut off the JS-driven exit animation. With
			// `forceMount` the caller owns the exit, so visibility stays ours.
			{...(forceMount === true ? { hidden: false } : {})}
			{...props}
			render={
				<motion.div
					className={cn(styles.dialog__overlay, className)}
					style={style}
					variants={overlayVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
				/>
			}
		/>
	),
);
DialogOverlay.displayName = 'DialogOverlay';
