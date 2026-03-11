import * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';

export type DialogProps = {
	/**
	 * The content of the dialog.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the dialog. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the dialog changes.
	 */
	onOpenChange?(open: boolean): void;
	/**
	 * The modality of the dialog. When set to true, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
	 * @default true
	 */
	modal?: boolean;
};

/**
 * Root component that manages the open state and accessibility wiring
 * for a dialog. Compose it with `DialogTrigger`, `DialogContent`,
 * `DialogHeader`, `DialogTitle`, `DialogDescription` and `DialogFooter`.
 *
 * @example
 * ```tsx
 * // Uncontrolled dialog with trigger
 * <Dialog defaultOpen={false}>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogContent width="base">
 *     <DialogHeader>
 *       <DialogTitle>Edit report details</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       Dialog content goes here.
 *     </DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled dialog
 * const [open, setOpen] = React.useState(false);
 *
 * return (
 *   <Dialog open={open} onOpenChange={setOpen}>
 *     <DialogTrigger asChild>
 *       <Button variant="solid" color="primary">
 *         Open controlled dialog
 *       </Button>
 *     </DialogTrigger>
 *     <DialogContent width="base">
 *       <DialogHeader>
 *         <DialogTitle>Controlled dialog</DialogTitle>
 *       </DialogHeader>
 *       <DialogDescription>
 *         <p>Dialog content goes here.</p>
 *         <div className="flex justify-end">
 *           <Button variant="solid" color="primary" onClick={() => setOpen(false)}>
 *             Close
 *           </Button>
 *         </div>
 *       </DialogDescription>
 *     </DialogContent>
 *   </Dialog>
 * );
 * ```
 */
export function Dialog({ ...props }: DialogProps) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
