import type React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../index.js';

export interface DialogWrapperProps {
	/**
	 * The title of the dialog.
	 */
	title?: string;
	/**
	 * The content of the dialog.
	 */
	children: React.ReactNode;
	/**
	 * The controlled open state of the dialog. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * Event handler called when the open state of the dialog changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The element that opens the dialog when clicked.
	 */
	trigger?: React.ReactNode;
	/**
	 * The footer of the dialog.
	 */
	footer?: React.ReactNode;
	/**
	 * The class name of the dialog.
	 */
	className?: string;
	/**
	 * Whether to disable outside clicks.
	 * @default false
	 */
	disableOutsideClick?: boolean;
	/**
	 * Whether to show the close button.
	 * @default true
	 */
	showCloseButton?: boolean;
	/**
	 * The width of the dialog.
	 * @default base
	 */
	width?: 'narrow' | 'base' | 'wide' | 'extra-wide';
	/**
	 * The icon of the dialog title.
	 */
	titleIcon?: React.ReactNode;
}

/**
 * High-level dialog preset that composes the primitive dialog
 * components into a conventional layout with header, description and
 * optional footer. Used as the main `Dialog` story component.
 *
 * @example
 * ```tsx
 * // Uncontrolled dialog with trigger
 * <DialogWrapper
 *   title="Edit report details"
 *   width="base"
 *   trigger={
 *     <Button variant="solid" color="primary">
 *       Open Dialog
 *     </Button>
 *   }
 * >
 *   <div className="flex flex-col gap-4 text-sm leading-5">
 *     <p>Dialog content goes here.</p>
 *     <div className="flex justify-end">
 *       <Button variant="solid" color="primary">
 *         Save Changes
 *       </Button>
 *     </div>
 *   </div>
 * </DialogWrapper>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled dialog
 * const [open, setOpen] = React.useState(false);
 *
 * <DialogWrapper
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Controlled Dialog"
 *   titleIcon={<Code size={16} />}
 *   trigger={
 *     <Button variant="solid" color="primary">
 *       Open Controlled Dialog
 *     </Button>
 *   }
 * >
 *   <div className="flex flex-col gap-4 text-sm leading-5">
 *     <p>Dialog content goes here.</p>
 *     <div className="flex justify-end">
 *       <Button variant="solid" color="primary" onClick={() => setOpen(false)}>
 *         Close Dialog
 *       </Button>
 *     </div>
 *   </div>
 * </DialogWrapper>
 * ```
 */
export function DialogWrapper({
	title,
	children,
	open,
	onOpenChange,
	trigger,
	className,
	disableOutsideClick = false,
	showCloseButton = true,
	width = 'base',
	titleIcon,
	footer,
}: DialogWrapperProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent
				className={className}
				showCloseButton={showCloseButton}
				onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
				width={width}
			>
				{title && (
					<DialogHeader>
						{title && <DialogTitle icon={titleIcon}>{title}</DialogTitle>}
					</DialogHeader>
				)}
				{children && <DialogDescription>{children}</DialogDescription>}
				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}
