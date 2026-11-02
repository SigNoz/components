import { forwardRef } from 'react';
import type { RejectedProps } from '../../lib/utils.js';
import type { PaginationCursorProps } from '../types.js';
import { usePageSizeOptions } from '../use-page-size-options.js';
import { usePaginationState } from '../use-pagination-state.js';
import { formatCursorPage } from '../utils.js';
import { PaginationFrame } from './pagination-frame.js';

/**
 * The bar for a list that pages forward without knowing its total: a cursor from the API, or an
 * offset where a full page means there may be more. Reached as `Pagination.Cursor`, not imported
 * on its own.
 *
 * It always renders the compact controls, since there is no last page to number, and the position
 * label shows the page number, `Page 3`. Next hides while `hasNextPage` is `false` and Previous
 * hides on page 1. Both keep their space, so the other button does not move.
 *
 * It takes the page and page size props, the page size selector, `align`, `disabled` and
 * `disabledTooltip` from `Pagination` with the same behavior. It has no `total`,
 * `showTotalLabel` or `variant`. There is no `className` or `style`.
 *
 * ### Asserting on it
 *
 * The root carries `data-variant="compact"`. The parts, slots and test IDs are the ones of
 * `Pagination` that the compact controls use: `pagination`, `pagination-total`,
 * `pagination-previous`, `pagination-divider`, `pagination-next` and `pagination-page-size`.
 * The rows of the page size list are `{testId}-page-size-select-item-{value}`, unless a
 * `pageSizeOptions.items` object sets its own `testId`.
 *
 * @example
 * ```tsx
 * <Pagination.Cursor
 *   current={page}
 *   onPageChange={setPage}
 *   hasNextPage={nextCursor !== undefined}
 * />
 * ```
 */
export const PaginationCursor = forwardRef<HTMLElement, PaginationCursorProps>(
	function PaginationCursor(
		{
			hasNextPage,
			current,
			defaultCurrent,
			onPageChange,
			pageSize: pageSizeProp,
			defaultPageSize,
			onPageSizeChange,
			pageSizeOptions,
			showTotal = true,
			align = 'end',
			disabled = false,
			disabledTooltip,
			testId,
			'aria-label': ariaLabel,
			className: _className,
			style: _style,
			...rootProps
		}: PaginationCursorProps & RejectedProps,
		ref,
	) {
		const { page, pageSize, setPage, setPageSize } = usePaginationState({
			total: null,
			current,
			defaultCurrent,
			onPageChange,
			pageSize: pageSizeProp,
			defaultPageSize,
			onPageSizeChange,
		});
		const selector = usePageSizeOptions(pageSizeOptions, pageSize);

		const text = formatCursorPage(page);

		return (
			<PaginationFrame
				ref={ref}
				rootProps={rootProps}
				ariaLabel={ariaLabel}
				testId={testId}
				variant="compact"
				align={align}
				disabled={disabled}
				disabledTooltip={disabledTooltip}
				page={page}
				pageCount={null}
				hasNext={hasNextPage}
				showTotal={showTotal}
				totalText={text}
				totalSizerText={text}
				enablePageSize={selector.enabled}
				pageSize={pageSize}
				pageSizeOptions={selector.options}
				pageSizeLabel={selector.label}
				pageSizePosition={selector.position}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>
		);
	},
);
PaginationCursor.displayName = 'Pagination.Cursor';
