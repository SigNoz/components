import * as React from 'react';
import { ConfirmDialogUrl, type ConfirmDialogUrlProps } from '../../dialog/index.js';
import type { DrawerDirection } from '../index.js';

export type ConfirmDrawerUrlProps = Omit<ConfirmDialogUrlProps, 'position' | 'heightMode'> & {
	/**
	 * The side of the viewport from which the drawer appears.
	 * @default right
	 */
	direction?: DrawerDirection;
};

/**
 * URL-driven confirm drawer preset. Reuses ConfirmDialogUrl with
 * direction mapped to position for slide-in behavior.
 *
 * @example
 * ```tsx
 * <ConfirmDrawerUrl
 *   urlKey="drawer-delete-step"
 *   title="Delete from URL param"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   confirmColor="destructive"
 *   onConfirm={async () => {
 *     await api.deleteSomething();
 *     return true;
 *   }}
 *   direction="right"
 * >
 *   This confirm drawer is controlled via a URL query parameter using nuqs.
 * </ConfirmDrawerUrl>
 * ```
 */
export const ConfirmDrawerUrl = React.forwardRef<HTMLDivElement, ConfirmDrawerUrlProps>(
	({ direction = 'right', ...props }, ref) => {
		return <ConfirmDialogUrl ref={ref} {...props} position={direction} heightMode="full" />;
	}
);
ConfirmDrawerUrl.displayName = 'ConfirmDrawerUrl';
