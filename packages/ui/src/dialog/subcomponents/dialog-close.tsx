import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

/**
 * Base UI intersects the part's own `RefAttributes` with the ref of the
 * `<button>` it renders, which no single `forwardRef` type satisfies. The
 * element is a button either way, so the forwarded ref is widened to that.
 */
type CloseRef = React.ComponentProps<typeof DialogPrimitive.Close>['ref'];

export type DialogCloseProps = {
	/**
	 * The children of the dialog close.
	 */
	children?: React.ReactNode;
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
	/**
	 * The id of the dialog close.
	 */
	id?: string;
	/**
	 * The class name of the dialog close.
	 */
	className?: string;
	/**
	 * Test ID for the dialog close.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'button'>, 'style' | 'onClick'>;

/**
 * Element that closes the dialog when activated. Often used to wrap
 * a `Button` inside the dialog footer or to render a custom close
 * control in the header.
 *
 * @example
 * ```tsx
 * <DialogContent width="base">
 *   <DialogHeader>
 *     <DialogTitle>Dialog without close button</DialogTitle>
 *   </DialogHeader>
 *   <DialogDescription>
 *     This dialog has no header close (X) button. Use the footer button to close.
 *   </DialogDescription>
 *   <DialogFooter>
 *     <DialogClose asChild>
 *       <Button variant="solid" color="primary">
 *         Close
 *       </Button>
 *     </DialogClose>
 *   </DialogFooter>
 * </DialogContent>
 * ```
 */
export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	({ asChild, className, testId, children, ...props }, ref) => {
		const child = asChild && React.isValidElement(children) ? children : undefined;
		const elementProps = {
			'data-slot': 'dialog-close',
			'data-testid': testId,
			className: cn(styles.dialog__close, className),
			...props,
		};

		if (child !== undefined) {
			return <DialogPrimitive.Close ref={ref as CloseRef} render={child} {...elementProps} />;
		}

		return (
			<DialogPrimitive.Close ref={ref as CloseRef} {...elementProps}>
				{children}
			</DialogPrimitive.Close>
		);
	},
);
DialogClose.displayName = 'DialogClose';
