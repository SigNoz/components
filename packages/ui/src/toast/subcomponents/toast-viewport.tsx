import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { forwardRef, type ReactNode } from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { cn } from '../../lib/utils.js';
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
	children: ReactNode;
};

/**
 * @access private
 */
export const ToastViewport = forwardRef<HTMLDivElement, ToastViewportProps>(function ToastViewport(
	{ className, style, position, offset, testId, ...props },
	ref,
) {
	return (
		<ToastPrimitive.Viewport
			ref={ref}
			aria-label="Notifications"
			className={cn(styles['toaster'], className)}
			style={{
				...style,
				...(offset != null && { '--toast-internal-viewport-offset': toCssLength(offset) }),
			}}
			data-testid={testId}
			{...props}
			// After the spread, so a `data-slot` or `data-position` from the call site cannot replace the
			// ones the component and its styles are found by.
			data-slot="toaster"
			data-position={position}
		/>
	);
});
