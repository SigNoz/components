import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogCloseProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>,
	'id' | 'className' | 'style' | 'onClick' | 'asChild' | 'children'
> & {
	/**
	 * Test ID for the dialog close.
	 */
	testId?: string;
};

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
export const DialogClose = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Close>,
	DialogCloseProps
>(({ className, testId, ...props }, ref) => (
	<DialogPrimitive.Close
		ref={ref}
		data-slot="dialog-close"
		data-testId={testId}
		className={cn(styles.dialog__close, className)}
		{...props}
	/>
));
