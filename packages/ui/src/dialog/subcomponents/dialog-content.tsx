import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, type Variants } from 'motion/react';
import * as React from 'react';
import { useMemo } from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';
import { DialogOverlay } from './dialog-overlay.js';
import { DialogPortal } from './dialog-portal.js';

export type DialogPosition = 'top' | 'center' | 'left' | 'right' | 'bottom';
export type DialogSize = 'narrow' | 'base' | 'wide' | 'extra-wide';
export type DialogHeightMode = 'content' | 'full';
export type DialogAnimation = 'fade' | 'zoom' | 'slide';

export const DialogPositionValue: Record<Capitalize<DialogPosition>, DialogPosition> = {
	Top: 'top',
	Center: 'center',
	Left: 'left',
	Right: 'right',
	Bottom: 'bottom',
};

type MotionContentProps = React.ComponentProps<typeof motion.div> & {
	'data-state'?: 'open' | 'closed';
};

const dialogContentTransition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

const MotionContent = React.forwardRef<HTMLDivElement, MotionContentProps>(
	({ 'data-state': state, initial, animate, transition, exit, ...rest }, ref) => {
		const resolvedInitial = state === 'open' ? (initial ?? 'initial') : (initial ?? 'exit');
		const resolvedAnimate = state === 'open' ? (animate ?? 'animate') : (animate ?? 'exit');
		const resolvedExit = exit ?? 'exit';

		return (
			<motion.div
				ref={ref}
				initial={resolvedInitial}
				animate={resolvedAnimate}
				transition={transition ?? dialogContentTransition}
				exit={resolvedExit}
				{...rest}
			/>
		);
	}
);

const getContentVariants = (
	position: DialogPosition,
	heightMode: DialogHeightMode,
	animation: DialogAnimation
): Variants => {
	const baseTransform =
		position === 'center'
			? 'translateX(-50%) translateY(-50%)'
			: position === 'top' || position === 'bottom'
				? 'translateX(-50%)'
				: position === 'left' || position === 'right'
					? heightMode === 'content'
						? 'translateY(-50%)'
						: 'none'
					: 'none';

	if (animation === 'slide') {
		const transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };
		const yCenter = heightMode === 'content' ? ' translateY(-50%)' : '';

		if (position === 'left') {
			return {
				initial: { opacity: 0, transform: `translateX(-100%)${yCenter}` },
				animate: { opacity: 1, transform: `translateX(0%)${yCenter}`, transition },
				exit: { opacity: 0, transform: `translateX(-100%)${yCenter}` },
			};
		}

		if (position === 'right') {
			return {
				initial: { opacity: 0, transform: `translateX(100%)${yCenter}` },
				animate: { opacity: 1, transform: `translateX(0%)${yCenter}`, transition },
				exit: { opacity: 0, transform: `translateX(100%)${yCenter}` },
			};
		}

		if (position === 'top') {
			const initialTransform =
				heightMode === 'full' ? 'translateY(-100%)' : 'translate(-50%, -100%)';
			const animateTransform = heightMode === 'full' ? 'translateY(0%)' : 'translate(-50%, 0%)';

			return {
				initial: { opacity: 0, transform: initialTransform },
				animate: { opacity: 1, transform: animateTransform, transition },
				exit: { opacity: 0, transform: initialTransform },
			};
		}

		if (position === 'bottom') {
			const initialTransform = heightMode === 'full' ? 'translateY(100%)' : 'translate(-50%, 100%)';
			const animateTransform = heightMode === 'full' ? 'translateY(0%)' : 'translate(-50%, 0%)';

			return {
				initial: { opacity: 0, transform: initialTransform },
				animate: { opacity: 1, transform: animateTransform, transition },
				exit: { opacity: 0, transform: initialTransform },
			};
		}

		if (position === 'center') {
			return {
				initial: {
					opacity: 0,
					transform: 'translateX(-50%) translateY(-55%)',
				},
				animate: {
					opacity: 1,
					transform: 'translateX(-50%) translateY(-50%)',
				},
				exit: {
					opacity: 0,
					transform: 'translateX(-50%) translateY(-55%)',
				},
			};
		}

		return {
			initial: { opacity: 0, transform: 'translateY(-8px)' },
			animate: { opacity: 1, transform: 'translateY(0px)' },
			exit: { opacity: 0, transform: 'translateY(-8px)' },
		};
	}

	const scaleInitial = animation === 'zoom' ? 0.9 : 0.95;

	return {
		initial: {
			opacity: 0,
			transform: `${baseTransform} scale(${scaleInitial})`,
		},
		animate: {
			opacity: 1,
			transform: `${baseTransform} scale(1)`,
		},
		exit: {
			opacity: 0,
			transform: `${baseTransform} scale(${scaleInitial})`,
		},
	};
};

export type DialogContentProps = Pick<
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
	 * The width of the dialog.
	 * @default 'base'
	 */
	width?: DialogSize;
	/**
	 * The position of the dialog.
	 * @default 'center'
	 */
	position?: DialogPosition;
	/**
	 * The offset of the dialog.
	 * @default 100
	 */
	offset?: number;
	/**
	 * Test ID for the dialog content.
	 */
	testId?: string;
	/**
	 * Controls how the dialog content stretches in the viewport.
	 * - `content` keeps the panel sized to its content (current behavior).
	 * - `full` makes the panel take the full viewport height or width depending on position.
	 * @default 'content'
	 */
	heightMode?: DialogHeightMode;
	/**
	 * Whether to render the overlay behind the dialog content.
	 * @default true
	 */
	showOverlay?: boolean;
	/**
	 * Controls the enter/exit animation of the dialog panel.
	 * - `fade` keeps the current subtle fade + zoom behavior.
	 * - `zoom` uses a slightly stronger zoom effect.
	 * - `slide` animates directionally based on the `position` and `heightMode`.
	 * @default 'fade'
	 */
	animation?: DialogAnimation;
};

/**
 * Animated dialog panel that renders the actual dialog surface inside a
 * portal with overlay. Controls width and position.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogContent width="base">
 *     <DialogHeader>
 *       <DialogTitle>Primitive composition</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       <p className="text-sm">
 *         Use DialogContent, DialogHeader, DialogTitle, DialogDescription and DialogFooter for full control.
 *       </p>
 *     </DialogDescription>
 *     <DialogFooter>
 *       <Button variant="ghost" color="secondary">
 *         Cancel
 *       </Button>
 *       <Button variant="solid" color="primary">
 *         Confirm
 *       </Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @example
 * ```tsx
 * // Position variants
 * const [open, setOpen] = React.useState<'center' | 'top' | null>(null);
 *
 * <Dialog open={open === 'top'} onOpenChange={(v) => setOpen(v ? 'top' : null)}>
 *   <DialogTrigger asChild>
 *     <Button variant="solid" color="primary">
 *       Open top dialog
 *     </Button>
 *   </DialogTrigger>
 *   <DialogContent position="top" width="base" onPointerDownOutside={() => setOpen(null)}>
 *     <DialogHeader>
 *       <DialogTitle>Top positioned dialog</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       This dialog is positioned from the top using the `position` and `offset` props.
 *     </DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps
>(
	(
		{
			className,
			children,
			width = 'base',
			position = 'center',
			offset = 16,
			style: propStyle,
			testId,
			heightMode = 'content',
			showOverlay = true,
			animation = 'fade',
			...props
		},
		ref
	) => {
		const style = useMemo(() => {
			const offsetMap = {
				top: offset,
				bottom: offset,
				left: offset,
				right: offset,
			} as Record<DialogPosition, number>;

			const positionStyle =
				offsetMap[position] && heightMode === 'content'
					? { [position]: `${offsetMap[position]}px` }
					: undefined;
			return { ...positionStyle, ...propStyle };
		}, [propStyle, position, offset, heightMode]);

		const variants = useMemo(
			() => getContentVariants(position, heightMode, animation),
			[position, heightMode, animation]
		);

		return (
			<DialogPortal data-slot="dialog-portal" forceMount={props.forceMount}>
				{showOverlay && <DialogOverlay forceMount={props.forceMount} />}
				<DialogPrimitive.Content
					ref={ref}
					data-slot="dialog-content"
					data-width={width}
					data-position={position}
					data-height-mode={heightMode}
					data-animation={animation}
					data-testid={testId}
					asChild
					forceMount={props.forceMount}
					{...props}
				>
					<MotionContent
						className={cn(styles.dialog__content, className)}
						style={style}
						variants={variants}
					>
						{children}
					</MotionContent>
				</DialogPrimitive.Content>
			</DialogPortal>
		);
	}
);
