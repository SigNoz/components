import { parseAsInteger, useQueryState } from 'nuqs';
import { useCallback, useEffect } from 'react';
import { Pagination, type PaginationProps } from '../pagination.js';

export type PaginationUrlProps = {
	/**
	 * The key of the query state to synchronize the current page with.
	 * Change this to avoid conflicts with other query states.
	 * @default 'page'
	 */
	urlKey?: string;
	/**
	 * The key of the query state to synchronize the page size with.
	 * Change this to avoid conflicts with other query states.
	 * @default 'pageSize'
	 */
	pageSizeUrlKey?: string;
} & Omit<PaginationProps, 'current' | 'defaultCurrent' | 'onPageChange'>;

/**
 * URL-driven pagination preset that synchronizes the current page with a query
 * parameter using `nuqs`. Useful for deep-linking to a specific page or
 * coordinating pagination state with navigation (e.g. browser back/forward).
 *
 * @example
 * ```tsx
 * <PaginationUrl
 *   urlKey="page"
 *   total={100}
 *   pageSize={10}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom urlKey to avoid conflicts
 * <PaginationUrl
 *   urlKey="logs-page"
 *   total={500}
 *   pageSize={25}
 *   align="center"
 * />
 * ```
 */
export function PaginationUrl({
	urlKey = 'page',
	pageSizeUrlKey = 'pageSize',
	total,
	pageSize = 10,
	onPageSizeChange,
	...props
}: PaginationUrlProps) {
	const [page, setPage] = useQueryState(urlKey, parseAsInteger.withDefault(1));
	const [urlPageSize, setUrlPageSize] = useQueryState(
		pageSizeUrlKey,
		parseAsInteger.withDefault(pageSize)
	);

	const activePageSize = props.enablePageSize ? (urlPageSize ?? pageSize) : pageSize;
	const totalPages = Math.ceil(total / activePageSize);
	const clampedPage = Math.max(1, Math.min(page ?? 1, totalPages));

	useEffect(() => {
		if ((page ?? 1) !== clampedPage) {
			setPage(clampedPage);
		}
	}, [clampedPage, page, setPage]);

	const onPageChange = useCallback(
		(newPage: number) => {
			setPage(newPage);
		},
		[setPage]
	);

	const handlePageSizeChange = useCallback(
		(newSize: number) => {
			if (props.enablePageSize) {
				setUrlPageSize(newSize);
			}
			onPageSizeChange?.(newSize);
		},
		[props.enablePageSize, setUrlPageSize, onPageSizeChange]
	);

	return (
		<Pagination
			{...props}
			total={total}
			pageSize={activePageSize}
			current={clampedPage}
			onPageChange={onPageChange}
			onPageSizeChange={handlePageSizeChange}
		/>
	);
}
