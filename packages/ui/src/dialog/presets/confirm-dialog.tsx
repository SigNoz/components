import { AnimatePresence } from 'motion/react';
import React, { useCallback } from 'react';
import { Button, type ButtonProps } from '../../button/index.js';
import {
	Dialog,
	DialogCloseButton,
	DialogContent,
	type DialogContentProps,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../index.js';

export type ConfirmDialogProps = {
	/**
	 * The testId associated with the dialog.
	 */
	testId?: string;
	/**
	 * The id of the dialog.
	 */
	id?: string;
	/**
	 * The controlled open state of the dialog. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * Event handler called when the open state of the dialog changes.
	 */
	onOpenChange?: (open: boolean) => void;

	/**
	 * The title of the dialog.
	 */
	title: string;
	/**
	 * The icon of the dialog title.
	 */
	titleIcon?: React.ReactNode;
	/**
	 * The content of the dialog.
	 */
	children: React.ReactNode;

	/**
	 * The class name of the dialog.
	 */
	className?: string;
	/**
	 * Inline styles applied to the dialog content surface.
	 */
	style?: React.CSSProperties;

	/**
	 * The text of the cancel button.
	 * @default Cancel
	 */
	cancelText?: string;
	/**
	 * The event handler called when the cancel button is clicked.
	 */
	onCancel?: () => void;
	/**
	 * The event handler called when the confirm button is clicked.
	 *
	 * @returns A promise that resolves to a boolean or undefined. If the value is true or undefined, the dialog will be closed. If the value is false, the dialog will not be closed. Use this to prevent closing the dialog when an error occurs.
	 */
	onConfirm: () => Promise<boolean | undefined | void> | boolean | undefined | void;
	/**
	 * The icon of the cancel button.
	 */
	cancelIcon?: React.ReactElement;
	/**
	 * The text of the confirm button.
	 */
	confirmText: string;
	/**
	 * The color of the confirm button.
	 * @default destructive
	 */
	confirmColor?: ButtonProps['color'];
	/**
	 * The icon of the confirm button.
	 */
	confirmIcon?: React.ReactElement;
	/**
	 * Whether to disable outside clicks.
	 * @default false
	 */
	disableOutsideClick?: boolean;
	/**
	 * The width of the dialog.
	 * @default base
	 */
	width?: DialogContentProps['width'];
	/**
	 * The position of the dialog.
	 * @default center
	 */
	position?: DialogContentProps['position'];
	/**
	 * The height mode of the dialog.
	 * @default content
	 */
	heightMode?: DialogContentProps['heightMode'];
};

/**
 * Opinionated confirm dialog preset built on top of the primitive
 * dialog components. Handles async confirmation, loading state and
 * conditional closing based on the `onConfirm` return value.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Confirm action"
 *   confirmText="Confirm"
 *   cancelText="Cancel"
 *   confirmColor="destructive"
 *   onConfirm={async () => {
 *     await api.doSomething();
 *     return true; // close dialog
 *   }}
 *   onCancel={() => setOpen(false)}
 *   width="narrow"
 * >
 *   Are you sure you want to proceed? This action cannot be undone.
 * </ConfirmDialog>
 * ```
 *
 * @example
 * ```tsx
 * // Prevent closing while confirm is running
 * <ConfirmDialog
 *   title="Delete item"
 *   confirmText="Delete"
 *   confirmColor="destructive"
 *   disableOutsideClick
 *   onConfirm={async () => {
 *     const ok = await deleteItem();
 *     return ok; // only close when the operation succeeded
 *   }}
 * >
 *   This action cannot be undone.
 * </ConfirmDialog>
 * ```
 */
export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	titleIcon,
	children,
	className,
	style,
	testId,
	id,

	cancelText = 'Cancel',
	onCancel,
	cancelIcon,

	confirmText,
	onConfirm,
	confirmColor = 'destructive',
	confirmIcon,

	disableOutsideClick = false,
	width = 'base',
	position = 'center',

	heightMode = 'content',
}: ConfirmDialogProps) {
	const animation = position === 'center' ? 'fade' : 'slide';
	const [onConfirming, setOnConfirming] = React.useState(false);
	const onConfirmProxy = useCallback(async () => {
		setOnConfirming(true);
		const canClose = await onConfirm();
		setOnConfirming(false);

		if (canClose === true || canClose === undefined) {
			onOpenChange?.(false);
		}
	}, [onConfirm, onOpenChange]);

	const isControlled = open !== undefined && onOpenChange !== undefined;

	const content = (
		<DialogContent
			key="confirm-dialog"
			className={className}
			style={style}
			testId={testId}
			id={id}
			forceMount={isControlled ? (true as const) : undefined}
			onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
			width={width}
			position={position}
			animation={animation}
			heightMode={heightMode}
		>
			{title && (
				<DialogHeader>{title && <DialogTitle icon={titleIcon}>{title}</DialogTitle>}</DialogHeader>
			)}
			{children && <DialogDescription>{children}</DialogDescription>}
			<DialogFooter>
				<Button
					type="button"
					variant="ghost"
					color="secondary"
					onClick={onCancel}
					prefix={cancelIcon}
				>
					{cancelText}
				</Button>

				<Button
					type="button"
					variant="solid"
					color={confirmColor}
					loading={onConfirming}
					onClick={onConfirmProxy}
					prefix={confirmIcon}
				>
					{confirmText}
				</Button>
			</DialogFooter>
			<DialogCloseButton onClick={onCancel} />
		</DialogContent>
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{isControlled ? <AnimatePresence>{open ? content : null}</AnimatePresence> : content}
		</Dialog>
	);
}
