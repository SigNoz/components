import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogFooterProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the dialog footer.
	 */
	testId?: string;
};

/**
 * Bottom action area of the dialog, typically used for primary and
 * secondary buttons like "Cancel" and "Confirm".
 *
 * @example
 * ```tsx
 * <DialogContent width="narrow">
 *   <DialogHeader>
 *     <DialogTitle>Delete this step</DialogTitle>
 *   </DialogHeader>
 *   <DialogDescription>
 *     Deleting this step would stop further analytics using this step of the funnel.
 *   </DialogDescription>
 *   <DialogFooter>
 *     <Button variant="ghost" color="secondary" onClick={onCancel}>
 *       Cancel
 *     </Button>
 *     <Button variant="solid" color="destructive" onClick={onConfirm}>
 *       Delete Step
 *     </Button>
 *   </DialogFooter>
 * </DialogContent>
 * ```
 */
export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
	({ className, testId, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="dialog-footer"
			data-testId={testId}
			className={cn(styles.dialog__footer, className)}
			{...props}
		/>
	)
);
