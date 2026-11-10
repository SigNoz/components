import type { CSSProperties, ReactNode } from 'react';
import { toCssLength } from '../lib/css-length.js';
import { ToastVariant } from './constants.js';
import type { ToasterProps, ToastOptions, ToastVariantType } from './types.js';

const EDGES = ['top', 'right', 'bottom', 'left'] as const;

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
		// from `loading` restarts the timer. A danger toast never closes on its own, whatever the call
		// says, which is why it requires a button.
		timeout: isDanger ? 0 : (options?.timeout ?? (stays ? 0 : undefined)),
		priority: isDanger ? ('high' as const) : ('low' as const),
		data: {
			testId: options?.testId,
			action: options?.action,
		},
	};
}

/**
 * Writes `offset` as the `--toast-internal-viewport-offset*` properties the stylesheet reads. A
 * number or a string sets every edge, an object only the edges it names.
 *
 * @access private
 */
export function viewportOffsetStyle(offset: ToasterProps['offset']): CSSProperties {
	if (offset == null) {
		return {};
	}
	if (typeof offset !== 'object') {
		return { '--toast-internal-viewport-offset': toCssLength(offset) } as CSSProperties;
	}

	// `0` is a distance, so only `null` and `undefined` leave an edge out.
	return Object.fromEntries(
		EDGES.filter((edge) => offset[edge] != null).map((edge) => [
			`--toast-internal-viewport-offset-${edge}`,
			toCssLength(offset[edge] as number | string),
		]),
	) as CSSProperties;
}
