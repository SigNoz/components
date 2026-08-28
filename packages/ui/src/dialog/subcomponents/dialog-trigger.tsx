import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

/**
 * Base UI intersects the trigger's own `RefAttributes` with the ref of the
 * `<button>` it renders, which no single `forwardRef` type satisfies. The
 * element is a button either way, so the forwarded ref is widened to that.
 */
type TriggerRef = React.ComponentProps<typeof DialogPrimitive.Trigger>['ref'];

export type DialogTriggerProps = {
	/**
	 * The children of the dialog trigger.
	 */
	children?: React.ReactNode;
	/**
	 * When true, merges props onto the child element instead of rendering a wrapper.
	 */
	asChild?: boolean;
	/**
	 * The id of the dialog trigger.
	 */
	id?: string;
	/**
	 * The class name of the dialog trigger.
	 */
	className?: string;
	/**
	 * Test ID for the dialog trigger.
	 */
	testId?: string;
} & Pick<React.ComponentProps<'button'>, 'onClick'>;

/**
 * Button-like element that toggles a `Dialog` open when interacted with.
 * Usually wraps a `Button` or icon button using `asChild`.
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
 *       <DialogTitle>Primitive dialog</DialogTitle>
 *     </DialogHeader>
 *     <DialogDescription>
 *       Dialog content goes here.
 *     </DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
	({ asChild, className, testId, children, ...props }, ref) => {
		const child = asChild && React.isValidElement(children) ? children : undefined;
		const elementProps = {
			'data-slot': 'dialog-trigger',
			'data-testid': testId,
			className: cn(styles.dialog__trigger, className),
			...props,
		};

		if (child !== undefined) {
			return <DialogPrimitive.Trigger ref={ref as TriggerRef} render={child} {...elementProps} />;
		}

		return (
			<DialogPrimitive.Trigger ref={ref as TriggerRef} {...elementProps}>
				{children}
			</DialogPrimitive.Trigger>
		);
	},
);
DialogTrigger.displayName = 'DialogTrigger';
