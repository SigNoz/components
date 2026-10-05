import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { forwardRef, type ReactNode } from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { cn } from '../../lib/utils.js';
import { usePersistToasts } from '../persist-toasts.js';
import styles from '../toast.module.scss';
import type { ToasterProps, ToastPositionType } from '../types.js';

/**
 * @access private
 */
export type ToastViewportProps = Omit<
	ToasterProps,
	'position' | 'limit' | 'timeout' | 'container'
> & {
	position: ToastPositionType;
	/**
	 * The stack of the `position` of the `Toaster`, the one that stays a landmark while empty.
	 */
	isDefault: boolean;
	children: ReactNode;
};

/**
 * @access private
 */
export const ToastViewport = forwardRef<HTMLDivElement, ToastViewportProps>(function ToastViewport(
	{ className, style, position, isDefault, offset, testId, ...props },
	ref,
) {
	const spread = usePersistToasts();
	const { toasts } = ToastPrimitive.useToastManager();
	// One landmark per position would list six for one `Toaster`. The other stacks become one only
	// while they hold a toast. Each stays a live region either way, so its first toast is announced.
	const isLandmark = isDefault || toasts.length > 0;

	return (
		<ToastPrimitive.Viewport
			ref={ref}
			aria-label="Notifications"
			className={cn(styles['toaster'], spread && styles['toaster--spread'], className)}
			style={{
				...style,
				...(offset != null && { '--toast-internal-viewport-offset': toCssLength(offset) }),
			}}
			data-testid={testId}
			{...props}
			{...(!isLandmark && { role: undefined, 'aria-label': undefined })}
			// After the spread, so a `data-slot` or `data-position` from the call site cannot replace the
			// ones the component and its styles are found by.
			data-slot="toaster"
			data-position={position}
		/>
	);
});
