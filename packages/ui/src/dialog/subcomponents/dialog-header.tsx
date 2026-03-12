import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogHeaderProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the dialog header.
	 */
	testId?: string;
};

/**
 * Layout wrapper for the top section of the dialog.
 * Typically contains `DialogTitle` and optional close button or actions.
 *
 * @example
 * ```tsx
 * <DialogContent width="base">
 *   <DialogHeader>
 *     <DialogTitle>Delete this step</DialogTitle>
 *   </DialogHeader>
 *   <DialogDescription>
 *     Deleting this step would stop further analytics using this step of the funnel.
 *   </DialogDescription>
 * </DialogContent>
 * ```
 */
export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
	({ className, testId, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="dialog-header"
			data-testid={testId}
			className={cn(styles.dialog__header, className)}
			{...props}
		/>
	)
);
