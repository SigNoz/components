import type { ReactNode } from 'react';
import { ToastVariant } from './constants.js';
import type { ToastOptions, ToastVariantType } from './types.js';

/**
 * What the toast manager is given to add or update a toast of `variant`, without the `id`.
 *
 * @access private
 */
export function managerOptions(
	variant: ToastVariantType,
	title: ReactNode,
	options?: ToastOptions,
) {
	const isDanger = variant === ToastVariant.Danger;
	const stays = isDanger || variant === ToastVariant.Loading || options?.action !== undefined;

	return {
		type: variant,
		title,
		description: options?.description,
		// `undefined` falls back to the `timeout` of the `Toaster`. It is set even then, so an update
		// from `loading` restarts the timer.
		timeout: stays ? 0 : undefined,
		priority: isDanger ? ('high' as const) : ('low' as const),
		data: {
			testId: options?.testId,
			action: options?.action,
		},
	};
}
