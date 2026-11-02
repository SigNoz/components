import { AnimatePresence } from 'motion/react';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';
import { Drawer } from '../subcomponents/drawer.js';
import {
	DrawerCloseButton,
	type DrawerCloseButtonProps,
} from '../subcomponents/drawer-close-button.js';
import { DrawerContent, type DrawerContentProps } from '../subcomponents/drawer-content.js';
import {
	DrawerDescription,
	type DrawerDescriptionProps,
} from '../subcomponents/drawer-description.js';
import { DrawerFooter, type DrawerFooterProps } from '../subcomponents/drawer-footer.js';
import { DrawerHeader, type DrawerHeaderProps } from '../subcomponents/drawer-header.js';
import { DrawerSubtitle, type DrawerSubtitleProps } from '../subcomponents/drawer-subtitle.js';
import { DrawerTitle, type DrawerTitleProps } from '../subcomponents/drawer-title.js';
import { DrawerTrigger } from '../subcomponents/drawer-trigger.js';
import type { DrawerDirection, DrawerSize } from '../types.js';

export interface DrawerWrapperProps {
	/**
	 * The testId associated with the drawer.
	 */
	testId?: string;
	/**
	 * The id of the drawer.
	 */
	id?: string;
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
	 * Inline styles applied to the drawer content surface.
	 */
	style?: React.CSSProperties;
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
	/**
	 * The maximum width of the drawer when it slides in from the left or the right.
	 * @default 'base'
	 */
	width?: DrawerSize;
	/**
	 * The props you can pass to drawer content
	 */
	drawerContentProps?: Omit<
		DrawerContentProps,
		| 'className'
		| 'style'
		| 'direction'
		| 'showOverlay'
		| 'forceMount'
		| 'onPointerDownOutside'
		| 'testId'
		| 'id'
		| 'key'
		| 'width'
	>;
	/**
	 * The props you can pass to drawer header
	 */
	drawerHeaderProps?: Omit<DrawerHeaderProps, 'children'>;
	/**
	 * The props you can pass to drawer title
	 */
	drawerTitleProps?: Omit<DrawerTitleProps, 'children'>;
	/**
	 * The props you can pass to drawer subtitle
	 */
	drawerSubtitleProps?: Omit<DrawerSubtitleProps, 'children'>;
	/**
	 * The props you can pass to drawer description
	 */
	drawerDescriptionProps?: Omit<DrawerDescriptionProps, 'children'>;
	/**
	 * The props you can pass to drawer footer
	 */
	drawerFooterProps?: Omit<DrawerFooterProps, 'children'>;
	/**
	 * The props you can pass to close button
	 */
	closeButtonProps?: Omit<DrawerCloseButtonProps, 'onClick'>;
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
 *   <div className="flex flex-col gap-4">
 *     <p>Drawer content goes here.</p>
 *     <div className="flex justify-end">
 *       <DrawerClose asChild>
 *         <Button variant="solid" color="primary">
 *           Save Changes
 *         </Button>
 *       </DrawerClose>
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
 *   <div className="flex flex-col gap-4">
 *     <p>Drawer content goes here.</p>
 *     <Button variant="solid" color="primary" onClick={() => setOpen(false)}>
 *       Close Drawer
 *     </Button>
 *   </div>
 * </DrawerWrapper>
 * ```
 */
export const DrawerWrapper = React.forwardRef<HTMLDivElement, DrawerWrapperProps>(
	(
		{
			title,
			subTitle,
			children,
			open,
			onOpenChange,
			trigger,
			className,
			style,
			disableOutsideClick = false,
			showCloseButton = true,
			direction = 'right',
			showOverlay = true,
			footer,
			testId,
			id,
			drawerContentProps,
			drawerHeaderProps,
			drawerTitleProps,
			drawerSubtitleProps,
			drawerDescriptionProps,
			drawerFooterProps,
			closeButtonProps,
			width = 'base',
		},
		ref,
	) => {
		const isControlled = open !== undefined && onOpenChange !== undefined;
		const [internalOpen, setInternalOpen] = useState(false);
		const resolvedOpen = isControlled ? open : internalOpen;
		const resolvedOnOpenChange = useCallback(
			(next: boolean) => {
				if (!isControlled) setInternalOpen(next);
				onOpenChange?.(next);
			},
			[isControlled, onOpenChange],
		);
		const onClickClose = useCallback(() => {
			if (!isControlled) setInternalOpen(false);
			onOpenChange?.(false);
		}, [isControlled, onOpenChange]);

		const content = (
			<DrawerContent
				ref={ref}
				key="drawer-wrapper"
				className={className}
				style={style}
				direction={direction}
				showOverlay={showOverlay}
				forceMount
				onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
				testId={testId}
				id={id}
				width={width}
				{...drawerContentProps}
			>
				{(title || subTitle) && (
					<DrawerHeader
						{...drawerHeaderProps}
						className={cn(
							showCloseButton && styles['drawer__header--with-close'],
							drawerHeaderProps?.className,
						)}
					>
						{title && <DrawerTitle {...drawerTitleProps}>{title}</DrawerTitle>}
						{subTitle && <DrawerSubtitle {...drawerSubtitleProps}>{subTitle}</DrawerSubtitle>}
					</DrawerHeader>
				)}
				{children && <DrawerDescription {...drawerDescriptionProps}>{children}</DrawerDescription>}
				{footer && <DrawerFooter {...drawerFooterProps}>{footer}</DrawerFooter>}
				{showCloseButton && <DrawerCloseButton onClick={onClickClose} {...closeButtonProps} />}
			</DrawerContent>
		);

		return (
			<Drawer open={resolvedOpen} onOpenChange={resolvedOnOpenChange}>
				{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
				<AnimatePresence>{resolvedOpen ? content : null}</AnimatePresence>
			</Drawer>
		);
	},
);
DrawerWrapper.displayName = 'DrawerWrapper';
