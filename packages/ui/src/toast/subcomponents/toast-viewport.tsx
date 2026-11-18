import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { forwardRef, type ReactNode, useMemo, useState } from 'react';
import { mergeRefs } from '../../lib/merge-refs.js';
import { useRightEdgeCover } from '../../lib/right-edge-cover.js';
import { useElementWidth } from '../../lib/use-element-width.js';
import { cn } from '../../lib/utils.js';
import { usePersistToasts } from '../persist-toasts.js';
import styles from '../toast.module.scss';
import type { ToasterProps, ToastPositionType } from '../types.js';
import { viewportOffsetStyle } from '../utils.js';

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
	const [element, setElement] = useState<HTMLDivElement | null>(null);
	const mergedRef = useMemo(() => mergeRefs(ref, setElement), [ref]);
	const spread = usePersistToasts();
	const rightEdgeCover = useRightEdgeCover();
	// A right stack moves beside an open `Drawer`, and stays in the window by its rendered width,
	// which a max size or a keyword size can make other than its `inline-size`.
	const width = useElementWidth(rightEdgeCover > 0 && position.endsWith('right') ? element : null);
	const isBesideDrawer = rightEdgeCover > 0 && width !== undefined;
	const { toasts } = ToastPrimitive.useToastManager();
	// One landmark per position would list six for one `Toaster`. The other stacks become one only
	// while they hold a toast. Each stays a live region either way, so its first toast is announced.
	const isLandmark = isDefault || toasts.length > 0;

	return (
		<ToastPrimitive.Viewport
			ref={mergedRef}
			aria-label="Notifications"
			className={cn(styles['toaster'], spread && styles['toaster--spread'], className)}
			style={{
				...style,
				...viewportOffsetStyle(offset),
				...(isBesideDrawer && {
					'--toast-internal-right-edge-cover': `${rightEdgeCover}px`,
					'--toast-internal-rendered-inline-size': `${width}px`,
				}),
			}}
			data-testid={testId}
			{...props}
			{...(!isLandmark && { role: undefined, 'aria-label': undefined })}
			// After the spread, so a `data-slot` or `data-position` from the call site cannot replace the
			// ones the component and its styles are found by.
			data-slot="toaster"
			data-position={position}
			data-beside-drawer={isBesideDrawer || undefined}
		/>
	);
});
