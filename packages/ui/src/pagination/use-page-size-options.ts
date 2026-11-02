import { useEffect, useMemo } from 'react';
import {
	PAGINATION_DEFAULT_PAGE_SIZE_LABEL,
	PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS,
} from './constants.js';
import type { PaginationPageSizeOptions, PaginationPageSizePosition } from './types.js';
import {
	isPageSizeEnabled,
	type PaginationResolvedPageSizeOption,
	resolvePageSizeOptions,
} from './utils.js';

const NO_OPTIONS: PaginationResolvedPageSizeOption[] = [];

/**
 * @access private
 */
export type PaginationPageSizeSelector = {
	/**
	 * Whether the selector renders, from `pageSizeOptions` being `true` or an object.
	 */
	enabled: boolean;
	/**
	 * The options the selector lists. Empty while the selector is off.
	 */
	options: PaginationResolvedPageSizeOption[];
	label: string;
	position: PaginationPageSizePosition;
};

/**
 * Reads the `pageSizeOptions` prop for the selector and warns about the items it drops. The
 * options keep their identity while `items` and `pageSize` do, so the selector does not rebuild
 * its list on every render, and nothing is resolved while the selector is off.
 *
 * @access private
 */
export function usePageSizeOptions(
	pageSizeOptions: boolean | PaginationPageSizeOptions | undefined,
	pageSize: number,
): PaginationPageSizeSelector {
	const enabled = isPageSizeEnabled(pageSizeOptions);
	const config = typeof pageSizeOptions === 'object' ? pageSizeOptions : undefined;
	const items = config?.items ?? PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS;

	const resolved = useMemo(
		() => (enabled ? resolvePageSizeOptions(items, pageSize) : null),
		[enabled, items, pageSize],
	);
	const options = resolved?.options ?? NO_OPTIONS;
	const hasDuplicates = resolved?.hasDuplicates ?? false;
	const hasInvalid = resolved?.hasInvalid ?? false;

	useEffect(() => {
		if (hasDuplicates) {
			console.warn(
				'Pagination: two `pageSizeOptions.items` share a `value`, so only the first of them is listed.',
			);
		}
	}, [hasDuplicates]);

	useEffect(() => {
		if (hasInvalid) {
			console.warn(
				'Pagination: a `pageSizeOptions.items` value is not a positive integer, so it is not listed.',
			);
		}
	}, [hasInvalid]);

	return {
		enabled,
		options,
		label: config?.label ?? PAGINATION_DEFAULT_PAGE_SIZE_LABEL,
		position: config?.position ?? 'end',
	};
}
