import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { forwardRef, type ReactNode, useMemo, useState } from 'react';
import { mergeRefs } from '../../lib/merge-refs.js';
import { useIsModalLayerOpen } from '../../lib/modal-layer.js';
import { useRightEdgeCover } from '../../lib/right-edge-cover.js';
import { useElementWidth } from '../../lib/use-element-width.js';
import { cn } from '../../lib/utils.js';
import { usePersistToasts } from '../persist-toasts.js';
import { useContainingBlockRightInset } from '../use-containing-block-right-inset.js';
import styles from '../toast.module.scss';
import type { ToasterProps, ToastPositionType } from '../types.js';
import { viewportOffsetStyle, viewportPageInsetStyle } from '../utils.js';

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
	{ position, isDefault, offset, pageInset, testId, ...props },
	ref,
) {
	const [element, setElement] = useState<HTMLDivElement | null>(null);
	const mergedRef = useMemo(() => mergeRefs(ref, setElement), [ref]);
	const spread = usePersistToasts();
	const windowCover = useRightEdgeCover();
	const isUnderModal = useIsModalLayerOpen();
	// A right stack moves beside an open `Drawer`, and stays in the window by its rendered width,
	// which a max size or a keyword size can make other than its `inline-size`.
	const measured = windowCover > 0 && position.endsWith('right') ? element : null;
	const width = useElementWidth(measured);
	// The cover counts from the window's edge, and `right` from the edge of the box the stack is
	// placed in, which a `container` with a transform can move away from the window's.
	const inset = useContainingBlockRightInset(measured);
	const rightEdgeCover = windowCover - inset;
	const isBesideDrawer = rightEdgeCover > 0 && width !== undefined;
	const { toasts } = ToastPrimitive.useToastManager();
	// One landmark per position would list six for one `Toaster`. The other stacks become one only
	// while they hold a toast. Each stays a live region either way, so its first toast is announced.
	const isLandmark = isDefault || toasts.length > 0;

	return (
		<ToastPrimitive.Viewport
			ref={mergedRef}
			aria-label="Notifications"
			className={cn(styles['toaster'], spread && styles['toaster--spread'])}
			style={{
				...viewportOffsetStyle(offset),
				...viewportPageInsetStyle(pageInset),
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
			data-under-modal={isUnderModal || undefined}
		/>
	);
});
