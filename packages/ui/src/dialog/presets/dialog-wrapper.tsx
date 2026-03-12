import { AnimatePresence } from 'motion/react';
import type React from 'react';
import { useCallback, useState } from 'react';
import {
	Dialog,
	DialogCloseButton,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogSubtitle,
	DialogTitle,
	DialogTrigger,
} from '../index.js';

export interface DialogWrapperProps {
	/**
	 * The title of the dialog.
	 */
	title?: string;
	/**
	 * The subtitle of the dialog.
	 */
	subTitle?: string;
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
	/**
	 * Whether to render the overlay behind the dialog.
	 * @default true
	 */
	showOverlay?: boolean;
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
	subTitle,
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
	showOverlay = true,
}: DialogWrapperProps) {
	const isControlled = open !== undefined && onOpenChange !== undefined;
	const [internalOpen, setInternalOpen] = useState(false);
	const resolvedOpen = isControlled ? open : internalOpen;
	const resolvedOnOpenChange = useCallback(
		(next: boolean) => {
			if (!isControlled) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange]
	);
	const onClickClose = useCallback(() => {
		if (!isControlled) setInternalOpen(false);
		onOpenChange?.(false);
	}, [isControlled, onOpenChange]);

	const content = (
		<DialogContent
			key="dialog-wrapper"
			className={className}
			forceMount
			onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
			width={width}
			showOverlay={showOverlay}
		>
			{(title || subTitle) && (
				<DialogHeader>
					{title && <DialogTitle icon={titleIcon}>{title}</DialogTitle>}
					{subTitle && <DialogSubtitle>{subTitle}</DialogSubtitle>}
				</DialogHeader>
			)}
			{children && <DialogDescription>{children}</DialogDescription>}
			{footer && <DialogFooter>{footer}</DialogFooter>}
			{showCloseButton && <DialogCloseButton onClick={onClickClose} />}
		</DialogContent>
	);

	return (
		<Dialog open={resolvedOpen} onOpenChange={resolvedOnOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<AnimatePresence>{resolvedOpen ? content : null}</AnimatePresence>
		</Dialog>
	);
}
