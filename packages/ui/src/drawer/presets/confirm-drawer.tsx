import * as React from 'react';
import { ConfirmDialog, type ConfirmDialogProps } from '../../dialog/index.js';
import type { DrawerDirection } from '../index.js';

export type ConfirmDrawerProps = Omit<ConfirmDialogProps, 'position'> & {
	/**
	 * The side of the viewport from which the drawer appears.
	 * @default right
	 */
	direction?: DrawerDirection;
};

/**
 * Opinionated confirm drawer preset. Reuses ConfirmDialog with
 * direction mapped to position for slide-in behavior.
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
 *   confirmColor="destructive"
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
	({ direction = 'right', ...props }, ref) => {
		return <ConfirmDialog ref={ref} {...props} position={direction} heightMode="full" />;
	}
);
ConfirmDrawer.displayName = 'ConfirmDrawer';
