import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { useMemo } from 'react';
import { PopupContainer } from '../../lib/popup-container.js';
import { cn } from '../../lib/utils.js';
import styles from '../drawer.module.scss';
import type { DrawerAnimation, DrawerDirection, DrawerSize } from '../types.js';
import { getContentVariants, ignoreToasts } from '../utils.js';
import { DrawerMotionContent } from './drawer-motion-content.js';
import { DrawerOverlay } from './drawer-overlay.js';
import { DrawerPortal } from './drawer-portal.js';

export type DrawerContentProps = Pick<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
	'id' | 'className' | 'style' | 'asChild' | 'children'
> & {
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: DialogPrimitive.DialogContentProps['onEscapeKeyDown'];
	/**
	 * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onPointerDownOutside?: DialogPrimitive.DialogContentProps['onPointerDownOutside'];
	/**
	 * Event handler called when the focus moves outside of the `DismissableLayer`.
	 * Can be prevented.
	 */
	onFocusOutside?: DialogPrimitive.DialogContentProps['onFocusOutside'];
	/**
	 * Event handler called when an interaction happens outside the `DismissableLayer`.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: DialogPrimitive.DialogContentProps['onInteractOutside'];
	/**
	 * Handler called when the `Content` should be dismissed
	 */
	onDismiss?: () => void;
	/**
	 * Event handler called when auto-focusing on open.
	 * Can be prevented.
	 */
	onOpenAutoFocus?: DialogPrimitive.DialogContentProps['onOpenAutoFocus'];
	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: DialogPrimitive.DialogContentProps['onCloseAutoFocus'];
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with React animation libraries.
	 */
	forceMount?: true;
	/**
	 * The maximum width of the drawer when it slides in from the left or the right.
	 * @default 'base'
	 */
	width?: DrawerSize;
	/**
	 * Has no effect: a drawer always sits against its edge of the viewport. Kept so existing call
	 * sites keep compiling.
	 */
	offset?: number;
	/**
	 * Test ID for the drawer content.
	 */
	testId?: string;
	/**
	 * Side from which the drawer appears.
	 * @default 'right'
	 */
	direction?: DrawerDirection;
	/**
	 * Whether to render the overlay behind the drawer.
	 * @default true
	 */
	showOverlay?: boolean;
	/**
	 * Controls the enter/exit animation of the drawer panel.
	 * - `slide` moves the panel in from its `direction`.
	 * - `fade` and `zoom` scale it up from a lower opacity, `zoom` starting smaller.
	 * @default 'slide'
	 */
	animation?: DrawerAnimation;
};

/**
 * Animated drawer panel that renders the actual drawer surface inside a
 * portal with overlay. Slides in from the specified direction (top, right,
 * bottom, left).
 *
 * A `Tooltip` or `Dropdown` inside, without a `container` of its own, is portalled into the
 * panel rather than the body. The modal traps focus in the panel and turns pointer events off
 * outside it, so a popup in the body could be neither clicked nor reached with the keyboard.
 *
 * A toast stays where the `Toaster` put it. Pressing its button does not close the drawer,
 * but the focus trap keeps `F6` and Tab from reaching it until the drawer closes.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button variant="solid" color="primary">Open drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent direction="right">
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *     </DrawerHeader>
 *     <DrawerDescription>
 *       <p>Drawer content goes here.</p>
 *     </DrawerDescription>
 *     <DrawerFooter>
 *       <Button variant="ghost" color="secondary">Cancel</Button>
 *       <Button variant="solid" color="primary">Confirm</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DrawerContentProps
>(
	(
		{
			className,
			children,
			direction = 'right',
			width = 'base',
			offset: _offset,
			style,
			testId,
			showOverlay = true,
			animation = 'slide',
			forceMount,
			onPointerDownOutside,
			onFocusOutside,
			onInteractOutside,
			...props
		},
		ref,
	) => {
		const variants = useMemo(
			() => getContentVariants(direction, animation),
			[direction, animation],
		);

		return (
			<DrawerPortal forceMount={forceMount}>
				{showOverlay && <DrawerOverlay forceMount={forceMount} />}
				<DialogPrimitive.Content
					ref={ref}
					data-slot="drawer-content"
					data-width={width}
					data-position={direction}
					data-height-mode="full"
					data-animation={animation}
					data-testid={testId}
					asChild
					forceMount={forceMount}
					onPointerDownOutside={ignoreToasts(onPointerDownOutside)}
					onFocusOutside={ignoreToasts(onFocusOutside)}
					onInteractOutside={ignoreToasts(onInteractOutside)}
					{...props}
				>
					<DrawerMotionContent
						className={cn(styles.drawer__content, className)}
						style={style}
						variants={variants}
					>
						<PopupContainer>{children}</PopupContainer>
					</DrawerMotionContent>
				</DialogPrimitive.Content>
			</DrawerPortal>
		);
	},
);
DrawerContent.displayName = 'DrawerContent';
