import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogTitleProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the dialog title.
	 */
	testId?: string;
	/**
	 * The icon of the dialog title.
	 */
	icon?: React.ReactNode;
};

/**
 * Accessible title for a dialog. Renders text (and optional icon) and
 * labels the dialog content for screen readers.
 *
 * @example
 * ```tsx
 * <DialogContent width="base">
 *   <DialogHeader>
 *     <DialogTitle>Edit report details</DialogTitle>
 *   </DialogHeader>
 *   <DialogDescription>
 *     Dialog content goes here.
 *   </DialogDescription>
 * </DialogContent>
 * ```
 *
 * @example
 * ```tsx
 * // With icon
 * <DialogContent width="base">
 *   <DialogHeader>
 *     <DialogTitle icon={<Code size={16} />}>
 *       Primitive composition
 *     </DialogTitle>
 *   </DialogHeader>
 *   <DialogDescription>
 *     Use the primitive dialog components for full control.
 *   </DialogDescription>
 * </DialogContent>
 * ```
 */
export const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	DialogTitleProps
>(({ className, icon, children, testId, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		data-slot="dialog-title"
		data-testId={testId}
		className={cn(styles.dialog__title, className)}
		{...props}
	>
		{icon}
		{children}
	</DialogPrimitive.Title>
));
