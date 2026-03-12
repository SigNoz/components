import { AnimatePresence } from 'motion/react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DialogCloseButton } from '../../dialog/index.js';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	type DrawerDirection,
	DrawerFooter,
	DrawerHeader,
	DrawerSubtitle,
	DrawerTitle,
	DrawerTrigger,
} from '../index.js';

export interface DrawerWrapperProps {
	/**
	 * The title of the drawer.
	 */
	title?: string;
	/**
	 * The subtitle of the drawer.
	 */
	subTitle?: string;
	/**
	 * The content of the drawer.
	 */
	children: React.ReactNode;
	/**
	 * The controlled open state of the drawer. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * Event handler called when the open state of the drawer changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The element that opens the drawer when clicked.
	 */
	trigger?: React.ReactNode;
	/**
	 * The footer of the drawer.
	 */
	footer?: React.ReactNode;
	/**
	 * The class name of the drawer.
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
	 * The side of the viewport from which the drawer appears.
	 * @default 'right'
	 */
	direction?: DrawerDirection;
	/**
	 * Whether to render the overlay behind the drawer.
	 * @default true
	 */
	showOverlay?: boolean;
}

/**
 * High-level drawer preset that composes the primitive drawer
 * components into a conventional layout with header, description and
 * optional footer. Used as the main `Drawer` story component.
 *
 * @example
 * ```tsx
 * <DrawerWrapper
 *   title="Edit settings"
 *   direction="right"
 *   trigger={
 *     <Button variant="solid" color="primary">
 *       Open Drawer
 *     </Button>
 *   }
 * >
 *   <div className="flex flex-col gap-4 text-sm leading-5">
 *     <p>Drawer content goes here.</p>
 *     <div className="flex justify-end">
 *       <DialogClose asChild>
 *         <Button variant="solid" color="primary">
 *           Save Changes
 *         </Button>
 *       </DialogClose>
 *     </div>
 *   </div>
 * </DrawerWrapper>
 * ```
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <DrawerWrapper
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Controlled Drawer"
 *   direction="right"
 *   trigger={
 *     <Button variant="solid" color="primary">
 *       Open Controlled Drawer
 *     </Button>
 *   }
 * >
 *   <div className="flex flex-col gap-4 text-sm leading-5">
 *     <p>Drawer content goes here.</p>
 *     <Button variant="solid" color="primary" onClick={() => setOpen(false)}>
 *       Close Drawer
 *     </Button>
 *   </div>
 * </DrawerWrapper>
 * ```
 */
export function DrawerWrapper({
	title,
	subTitle,
	children,
	open,
	onOpenChange,
	trigger,
	className,
	disableOutsideClick = false,
	showCloseButton = true,
	direction = 'right',
	showOverlay = true,
	footer,
}: DrawerWrapperProps) {
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
		<DrawerContent
			key="drawer-wrapper"
			className={className}
			direction={direction}
			showOverlay={showOverlay}
			forceMount
			onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
		>
			{(title || subTitle) && (
				<DrawerHeader>
					{title && <DrawerTitle>{title}</DrawerTitle>}
					{subTitle && <DrawerSubtitle>{subTitle}</DrawerSubtitle>}
				</DrawerHeader>
			)}
			{children && <DrawerDescription>{children}</DrawerDescription>}
			{footer && <DrawerFooter>{footer}</DrawerFooter>}
			{showCloseButton && <DialogCloseButton onClick={onClickClose} />}
		</DrawerContent>
	);

	return (
		<Drawer open={resolvedOpen} onOpenChange={resolvedOnOpenChange}>
			{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
			<AnimatePresence>{resolvedOpen ? content : null}</AnimatePresence>
		</Drawer>
	);
}
