import type * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogDescriptionProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the dialog description.
	 */
	testId?: string;
};

/**
 * Secondary text region that provides additional context for a dialog.
 * Place body copy or explanatory text here to complement `DialogTitle`.
 *
 * @example
 * ```tsx
 * <DialogContent width="base">
 *   <DialogHeader>
 *     <DialogTitle>Confirm action</DialogTitle>
 *   </DialogHeader>
 *   <DialogDescription>
 *     Are you sure you want to proceed? This action cannot be undone.
 *   </DialogDescription>
 * </DialogContent>
 * ```
 */
export const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	DialogDescriptionProps
>(({ className, testId, ...props }, ref) => (
	<div
		ref={ref}
		data-slot="dialog-description"
		data-testId={testId}
		className={cn(styles.dialog__description, className)}
		{...props}
	/>
));
