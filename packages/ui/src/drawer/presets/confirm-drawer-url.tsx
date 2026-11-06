import { parseAsBoolean, useQueryState } from 'nuqs';
import * as React from 'react';
import { useCallback } from 'react';
import { ConfirmDrawer, type ConfirmDrawerProps } from './confirm-drawer.js';

export type ConfirmDrawerUrlProps = {
	/**
	 * The query parameter that holds the open state.
	 */
	urlKey: string;
} & Omit<ConfirmDrawerProps, 'open' | 'onOpenChange' | 'heightMode'>;

/**
 * URL-driven confirm drawer preset that synchronizes its open state
 * with a boolean query parameter using `nuqs`. Useful for deep-linking
 * to a confirm drawer or coordinating drawer state with navigation.
 *
 * @example
 * ```tsx
 * <ConfirmDrawerUrl
 *   urlKey="drawer-delete-step"
 *   title="Delete from URL param"
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   confirmColor="danger"
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
	({ urlKey, onConfirm, onCancel, ...props }, ref) => {
		const [open, setOpen] = useQueryState(urlKey, parseAsBoolean);
		const onCancelProxy = useCallback(async () => {
			await setOpen(false);
			onCancel?.();
		}, [setOpen, onCancel]);
		const onConfirmProxy = useCallback(async () => {
			const canClose = await onConfirm();

			if (canClose === true || canClose === undefined) {
				await setOpen(false);
			}

			return canClose;
		}, [setOpen, onConfirm]);

		return (
			<ConfirmDrawer
				ref={ref}
				open={open || false}
				onOpenChange={(next) => setOpen(next)}
				onConfirm={onConfirmProxy}
				onCancel={onCancelProxy}
				{...props}
			/>
		);
	},
);
ConfirmDrawerUrl.displayName = 'ConfirmDrawerUrl';
