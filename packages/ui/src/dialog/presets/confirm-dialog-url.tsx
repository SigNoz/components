import { parseAsBoolean, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { ConfirmDialog, type ConfirmDialogProps } from './confirm-dialog.js';

export type ConfirmDialogUrlProps = {
	urlKey: string;
} & Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>;

/**
 * URL-driven confirm dialog preset that synchronizes its open state
 * with a boolean query parameter using `nuqs`. Useful for deep-linking
 * to a confirm dialog or coordinating dialog state with navigation.
 *
 * @example
 * ```tsx
 * // Story-style usage
 * const [, setOpen] = useQueryState('dialog-delete-step', parseAsBoolean.withDefault(false));
 *
 * <>
 *   <Button
 *     variant="solid"
 *     color="primary"
 *     onClick={() => setOpen(true)}
 *   >
 *     Open confirm dialog (URL)
 *   </Button>
 *   <ConfirmDialogUrl
 *     urlKey="dialog-delete-step"
 *     title="Delete from URL param"
 *     confirmText="Delete"
 *     cancelText="Cancel"
 *     confirmColor="destructive"
 *     onConfirm={async () => {
 *       await api.deleteSomething();
 *       return true; // close dialog and clear query param
 *     }}
 *     width="narrow"
 *   >
 *     This confirm dialog is controlled via a URL query parameter using nuqs.
 *   </ConfirmDialogUrl>
 * </>
 * ```
 */
export function ConfirmDialogUrl({ urlKey, onConfirm, onCancel, ...props }: ConfirmDialogUrlProps) {
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
		<ConfirmDialog
			open={open || false}
			onConfirm={onConfirmProxy}
			onCancel={onCancelProxy}
			{...props}
		/>
	);
}
