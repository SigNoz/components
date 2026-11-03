import { useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { PAGINATION_DEFAULT_PAGE_SIZE } from './constants.js';
import {
	clampPage,
	getPageCount,
	isValidPageSize,
	normalizePageSize,
	normalizeTotal,
} from './utils.js';

type UsePaginationStateOptions = {
	/**
	 * `null` for a list that does not know its total, which has no last page.
	 */
	total: number | null;
	current: number | undefined;
	defaultCurrent: number | undefined;
	onPageChange: ((page: number) => void) | undefined;
	pageSize: number | undefined;
	defaultPageSize: number | undefined;
	onPageSizeChange: ((pageSize: number) => void) | undefined;
};

/**
 * @access private
 */
export type PaginationState = {
	page: number;
	pageSize: number;
	total: number;
	pageCount: number;
	setPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
};

/**
 * @access private
 */
export function usePaginationState({
	total: rawTotal,
	current,
	defaultCurrent,
	onPageChange,
	pageSize: controlledPageSize,
	defaultPageSize,
	onPageSizeChange,
}: UsePaginationStateOptions): PaginationState {
	const [internalPage, setInternalPage] = useState(defaultCurrent ?? 1);
	const [internalPageSize, setInternalPageSize] = useState(
		defaultPageSize ?? PAGINATION_DEFAULT_PAGE_SIZE,
	);

	const isPageControlled = current !== undefined;
	const isPageSizeControlled = controlledPageSize !== undefined;

	const requestedPageSize = isPageSizeControlled ? controlledPageSize : internalPageSize;
	const pageSize = normalizePageSize(requestedPageSize);
	const hasInvalidPageSize = !isValidPageSize(requestedPageSize);

	const total = rawTotal === null ? 0 : normalizeTotal(rawTotal);
	const pageCount = rawTotal === null ? Number.POSITIVE_INFINITY : getPageCount(total, pageSize);

	const requestedPage = current ?? internalPage;
	// A total of 0 is often the total of a list that is still loading, so the page waits for a
	// total instead of going back to 1. The bar shows page 1 meanwhile.
	const pageLimit = total === 0 ? Number.POSITIVE_INFINITY : pageCount;
	const page = clampPage(requestedPage, pageLimit);

	const onPageChangeRef = useRef(onPageChange);
	useIsomorphicLayoutEffect(() => {
		onPageChangeRef.current = onPageChange;
	});

	useEffect(() => {
		if (hasInvalidPageSize) {
			console.warn(
				`Pagination: \`pageSize\` must be a positive integer, using ${PAGINATION_DEFAULT_PAGE_SIZE}.`,
			);
		}
	}, [hasInvalidPageSize]);

	// A pagination that keeps its own page moves it into range while rendering, which re-renders
	// before the commit, so the effect below has to be told through state.
	const [correction, setCorrection] = useState<{ page: number } | null>(null);

	if (!isPageControlled && page !== internalPage) {
		setInternalPage(page);
		setCorrection({ page });
	}

	useEffect(() => {
		if (correction !== null) {
			onPageChangeRef.current?.(correction.page);
		}
	}, [correction]);

	// The page last asked of a consumer that controls `current`. A consumer that waits for a fetch
	// before it moves `current` still renders the old page, which a new page size can put out of
	// range, and correcting it would ask for a second page on top of the one already asked for.
	const pendingPageRef = useRef<number | null>(null);

	useEffect(() => {
		pendingPageRef.current = null;
	}, [requestedPage]);

	useEffect(() => {
		if (!isPageControlled || page === requestedPage) {
			return;
		}

		const pendingPage = pendingPageRef.current;

		if (pendingPage !== null && clampPage(pendingPage, pageLimit) === pendingPage) {
			return;
		}

		onPageChangeRef.current?.(page);
	}, [isPageControlled, page, requestedPage, pageLimit]);

	function setPage(next: number): void {
		if (isPageControlled) {
			pendingPageRef.current = next;
		} else {
			setInternalPage(next);
		}

		onPageChange?.(next);
	}

	function setPageSize(next: number): void {
		if (next === pageSize) {
			return;
		}

		if (!isPageSizeControlled) {
			setInternalPageSize(next);
		}

		onPageSizeChange?.(next);

		if (isPageControlled) {
			pendingPageRef.current = 1;
		} else {
			setInternalPage(1);
		}

		onPageChange?.(1);
	}

	return { page, pageSize, total, pageCount, setPage, setPageSize };
}
