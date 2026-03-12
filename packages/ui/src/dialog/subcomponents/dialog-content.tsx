import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@signozhq/icons';
import { motion, type Variants } from 'motion/react';
import * as React from 'react';
import { useMemo } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';
import { DialogOverlay } from './dialog-overlay.js';
import { DialogPortal } from './dialog-portal.js';

const getContentVariants = (position: DialogPosition): Variants => {
	const baseTransform =
		position === 'center'
			? 'translateX(-50%) translateY(-50%)'
			: position === 'top'
				? 'translateX(-50%)'
				: 'none';

	return {
		initial: {
			opacity: 0,
			transform: `${baseTransform} scale(0.95)`,
		},
		animate: {
			opacity: 1,
			transform: `${baseTransform} scale(1)`,
		},
		exit: {
			opacity: 0,
			transform: `${baseTransform} scale(0.95)`,
		},
	};
};

export type DialogPosition = 'top' | 'center' | 'custom';
export type DialogSize = 'narrow' | 'base' | 'wide' | 'extra-wide';
const dialogContentTransition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

export type DialogContentProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
	'id' | 'className' | 'style' | 'asChild' | 'children'
> & {
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: DialogPrimitive.DialogContentProps['onEscapeKeyDown'];
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onPointerDownOutside?: DialogPrimitive.DialogContentProps['onPointerDownOutside'];
	/**
	 * Event handler called when the focus moves outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onFocusOutside?: DialogPrimitive.DialogContentProps['onFocusOutside'];
	/**
	 * Event handler called when an interaction happens outside the `DismissableLayer`.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: DialogPrimitive.DialogContentProps['onInteractOutside'];
	/**
	 * Handler called when the `Content` should be dismissed
	 */
	onDismiss?: () => void;
	/**
	 * Event handler called when auto-focusing on open.
	 * Can be prevented.
	 */
	onOpenAutoFocus?: DialogPrimitive.DialogContentProps['onOpenAutoFocus'];
	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: DialogPrimitive.DialogContentProps['onCloseAutoFocus'];
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * Show the close button.
	 * @default true
	 */
	showCloseButton?: boolean;
	/**
	 * The width of the dialog.
	 * @default 'base'
	 */
	width?: DialogSize;
	/**
	 * The position of the dialog.
	 * @default 'center'
	 */
	position?: DialogPosition;
	/**
	 * The offset of the dialog.
	 * @default 100
	 */
	offset?: number;
	/**
	 * The on close callback.
	 */
	onClose?: () => void;
	/**
	 * Test ID for the dialog content.
	 */
	testId?: string;
};

/**
 * Animated dialog panel that renders the actual dialog surface inside a
 * portal with overlay. Controls width, position and optional built-in
 * close button.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogContent width="base">
 *     <DialogHeader>
 *       <DialogTitle>Primitive composition</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       <p className="text-sm">
 *         Use DialogContent, DialogHeader, DialogTitle, DialogDescription and DialogFooter for full control.
 *       </p>
 *     </DialogDescription>
 *     <DialogFooter>
 *       <Button variant="ghost" color="secondary">
 *         Cancel
 *       </Button>
 *       <Button variant="solid" color="primary">
 *         Confirm
 *       </Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Position variants
 * const [open, setOpen] = React.useState<'center' | 'top' | null>(null);
 *
 * <Dialog open={open === 'top'} onOpenChange={(v) => setOpen(v ? 'top' : null)}>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open top dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogContent position="top" width="base" onPointerDownOutside={() => setOpen(null)}>
 *     <DialogHeader>
 *       <DialogTitle>Top positioned dialog</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       This dialog is positioned from the top using the `position` and `offset` props.
 *     </DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps
>(
	(
		{
			className,
			children,
			showCloseButton = true,
			width = 'base',
			position = 'center',
			offset = 100,
			style: propStyle,
			testId,
			...props
		},
		ref
	) => {
		const style = useMemo(() => {
			const positionStyle = position === 'top' ? { top: `${offset}px` } : undefined;
			return { ...positionStyle, ...propStyle };
		}, [propStyle, position, offset]);

		const variants = useMemo(() => getContentVariants(position), [position]);

		return (
			<DialogPortal data-slot="dialog-portal">
				<DialogOverlay />
				<DialogPrimitive.Content
					ref={ref}
					data-slot="dialog-content"
					data-width={width}
					data-position={position}
					data-testid={testId}
					asChild
					{...props}
				>
					<motion.div
						className={cn(styles.dialog__content, className)}
						style={style}
						variants={variants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={dialogContentTransition}
					>
						{children}
						{showCloseButton && (
							<DialogPrimitive.Close
								data-slot="dialog-close"
								className={styles.dialog__close__button}
								onClick={props.onClose}
							>
								<X />
								<span className={styles.dialog__close__button_screenreader}>Close</span>
							</DialogPrimitive.Close>
						)}
					</motion.div>
				</DialogPrimitive.Content>
			</DialogPortal>
		);
	}
);
