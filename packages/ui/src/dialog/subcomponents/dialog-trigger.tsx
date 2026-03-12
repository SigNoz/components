import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogTriggerProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
	'id' | 'className' | 'onClick' | 'asChild' | 'children'
> & {
	/**
	 * Test ID for the dialog trigger.
	 */
	testId?: string;
};

/**
 * Button-like element that toggles a `Dialog` open when interacted with.
 * Usually wraps a `Button` or icon button using `asChild`.
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
 *       <DialogTitle>Primitive dialog</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       Dialog content goes here.
 *     </DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const DialogTrigger = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Trigger>,
	DialogTriggerProps
>(({ className, testId, ...props }, ref) => (
	<DialogPrimitive.Trigger
		ref={ref}
		data-slot="dialog-trigger"
		data-testid={testId}
		className={cn(styles.dialog__trigger, className)}
		{...props}
	/>
));
