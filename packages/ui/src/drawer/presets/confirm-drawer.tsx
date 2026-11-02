import { AnimatePresence } from 'motion/react';
import * as React from 'react';
import { useCallback } from 'react';
import { Button, type ButtonProps } from '../../button/index.js';
import styles from '../drawer.module.scss';
import { DrawerCloseButton } from '../subcomponents/drawer-close-button.js';
import { Drawer } from '../subcomponents/drawer.js';
import { DrawerContent } from '../subcomponents/drawer-content.js';
import { DrawerDescription } from '../subcomponents/drawer-description.js';
import { DrawerFooter } from '../subcomponents/drawer-footer.js';
import { DrawerHeader } from '../subcomponents/drawer-header.js';
import { DrawerOverlay } from '../subcomponents/drawer-overlay.js';
import { DrawerPortal } from '../subcomponents/drawer-portal.js';
import { DrawerTitle } from '../subcomponents/drawer-title.js';
import type { DrawerDirection, DrawerSize } from '../types.js';

export type ConfirmDrawerProps = {
	/**
	 * The testId associated with the drawer.
	 */
	testId?: string;
	/**
	 * The id of the drawer.
	 */
	id?: string;
	/**
	 * The controlled open state of the drawer. Must be used in conjunction with onOpenChange.
	 */
	open?: boolean;
	/**
	 * Event handler called when the open state of the drawer changes.
	 */
	onOpenChange?: (open: boolean) => void;

	/**
	 * The title of the drawer.
	 */
	title: string;
	/**
	 * The icon of the drawer title.
	 */
	titleIcon?: React.ReactNode;
	/**
	 * The content of the drawer.
	 */
	children: React.ReactNode;

	/**
	 * The class name of the drawer.
	 */
	className?: string;
	/**
	 * Inline styles applied to the drawer content surface.
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
	 * @returns A promise that resolves to a boolean or undefined. If the value is true or undefined, the drawer will be closed. If the value is false, the drawer will not be closed. Use this to prevent closing the drawer when an error occurs.
	 * @note If it throws or rejects, the drawer stays open, the confirm button leaves its loading
	 * state, and the error is rethrown unhandled. Catch it and return `false` to handle it.
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
	 * @default danger
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
	 * The maximum width of the drawer when it slides in from the left or the right.
	 * @default base
	 */
	width?: DrawerSize;
	/**
	 * Has no effect: a drawer always fills its side of the viewport. Kept so existing call sites
	 * keep compiling.
	 */
	heightMode?: 'content' | 'full';
	/**
	 * The side of the viewport from which the drawer appears.
	 * @default right
	 */
	direction?: DrawerDirection;
};

/**
 * Opinionated confirm drawer preset built on top of the primitive
 * drawer components. Handles async confirmation, loading state and
 * conditional closing based on the `onConfirm` return value.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <ConfirmDrawer
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Confirm action"
 *   confirmText="Confirm"
 *   cancelText="Cancel"
 *   confirmColor="danger"
 *   onConfirm={async () => {
 *     await api.doSomething();
 *     return true;
 *   }}
 *   direction="right"
 * >
 *   Are you sure you want to proceed? This action cannot be undone.
 * </ConfirmDrawer>
 * ```
 */
export const ConfirmDrawer = React.forwardRef<HTMLDivElement, ConfirmDrawerProps>(
	(
		{
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
			confirmColor = 'danger',
			confirmIcon,

			disableOutsideClick = false,
			width = 'base',
			heightMode: _heightMode,
			direction = 'right',
		},
		ref,
	) => {
		const [onConfirming, setOnConfirming] = React.useState(false);
		const onConfirmProxy = useCallback(async () => {
			setOnConfirming(true);
			let canClose: Awaited<ReturnType<typeof onConfirm>>;
			try {
				canClose = await onConfirm();
			} catch (error) {
				setOnConfirming(false);
				throw error;
			}
			setOnConfirming(false);

			if (canClose === true || canClose === undefined) {
				onOpenChange?.(false);
			}
		}, [onConfirm, onOpenChange]);

		const isControlled = open !== undefined && onOpenChange !== undefined;
		const forceMount = isControlled ? (true as const) : undefined;

		// Apps select on the `dialog-*` slot values this preset rendered when it was built on
		// `ConfirmDialog`, so they stay, unlike the `drawer-*` ones of the primitives.
		const content = (
			<DrawerPortal key="confirm-drawer" forceMount={forceMount}>
				<DrawerOverlay data-slot="dialog-overlay" forceMount={forceMount} />
				<DrawerContent
					ref={ref}
					data-slot="dialog-content"
					className={className}
					style={style}
					testId={testId}
					id={id}
					forceMount={forceMount}
					onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
					width={width}
					direction={direction}
					showOverlay={false}
				>
					{title && (
						<DrawerHeader
							data-slot="dialog-header"
							className={styles['drawer__header--with-close']}
						>
							<DrawerTitle data-slot="dialog-title" icon={titleIcon}>
								{title}
							</DrawerTitle>
						</DrawerHeader>
					)}
					{children && (
						<DrawerDescription data-slot="dialog-description">{children}</DrawerDescription>
					)}
					<DrawerFooter data-slot="dialog-footer">
						<Button
							type="button"
							variant="ghost"
							color="secondary"
							size="md"
							onClick={onCancel}
							prefix={cancelIcon}
						>
							{cancelText}
						</Button>

						<Button
							type="button"
							variant="solid"
							color={confirmColor}
							size="md"
							loading={onConfirming}
							onClick={onConfirmProxy}
							prefix={confirmIcon}
						>
							{confirmText}
						</Button>
					</DrawerFooter>
					<DrawerCloseButton onClick={onCancel} />
				</DrawerContent>
			</DrawerPortal>
		);

		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				{isControlled ? <AnimatePresence>{open ? content : null}</AnimatePresence> : content}
			</Drawer>
		);
	},
);
ConfirmDrawer.displayName = 'ConfirmDrawer';
