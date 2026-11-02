import { forwardRef } from 'react';
import type { RejectedProps } from '../lib/utils.js';
import { PaginationCursor } from './subcomponents/pagination-cursor.js';
import { PaginationFrame } from './subcomponents/pagination-frame.js';
import type { PaginationProps } from './types.js';
import { usePageSizeOptions } from './use-page-size-options.js';
import { usePaginationState } from './use-pagination-state.js';
import { formatRange } from './utils.js';

/**
 * The bar at the bottom of a table, a list or a stack of cards: a position label at the start and
 * the page controls at the end, for a known `total`. Use `Pagination.Cursor` for a list that does
 * not know its total.
 *
 * Renders a `nav`. Every `aria-*` and any `data-*` are forwarded to it, with `id` and the `ref`.
 * There is no `className` or `style`: the padding of the bar is set with
 * `--pagination-padding-block`, `--pagination-padding-inline-start` and
 * `--pagination-padding-inline-end`.
 *
 * Visual values are `--pagination-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Accessibility
 *
 * The `nav` is named `Pagination`. A screen with two paginations passes its own `aria-label` to
 * each, so the two landmarks differ.
 *
 * Page buttons are named `Page 3` and the current one carries `aria-current="page"`. The arrows
 * are named `Previous page` and `Next page`, and in `compact` the visible `Previous` and `Next`
 * are the names. The separator is `aria-hidden`. The page size selector is named by its
 * `label`, `Rows per page` by default.
 *
 * The position label is a polite live region, so a screen reader reads the new range after a page
 * change while focus stays on the control.
 *
 * ### Page list
 *
 * `numbered` renders every page up to seven pages. Above that it renders exactly seven slots: the
 * first page, the last page, the current page with one page on each side, and a separator for
 * each gap. A separator never stands in for a single page, that page renders in its place.
 *
 * Every slot, separator included, has the width of the longest page number, with tabular
 * numerals, and the position label keeps the width of its longest value. The bar keeps its
 * width and the position of every control while the user moves between pages.
 *
 * ### Single page
 *
 * The bar always renders. With a single page, or a `total` of 0, the page list shows `1` and both
 * arrows are disabled. A `total` of 0 reads `0 \u2014 0 of 0`.
 *
 * ### Out-of-range page
 *
 * A `current` outside the range renders the nearest page, and `onPageChange` is called once with
 * it so the data follows the control. That happens when the total shrinks under the current page.
 * A `total` of 0 shows page `1` and leaves the page as it is, so a page read from the URL survives
 * a list that loads with a total of 0.
 *
 * ### Page size
 *
 * A new page size calls `onPageSizeChange` with the size, then `onPageChange` with `1`.
 *
 * ### Disabled
 *
 * `disabled` blocks every page change and the page size selector. Each control keeps its slot
 * and stays focusable, and `disabledTooltip` shows on hover or focus of any control. The
 * position label is not a control and never shows `disabledTooltip`.
 *
 * ### Focus
 *
 * Every control is in the tab order, in visual order. Focus follows the page change, so the same
 * key can be pressed again: after a page button, focus is on the button of that page in its new
 * slot. After Previous or Next, focus stays on the arrow. When the arrow disables, focus moves
 * to the current page. When it hides, in `compact` and `Pagination.Cursor`, focus moves to the
 * other arrow.
 *
 * ### Overflow
 *
 * The bar fills the width of its parent. The page controls and the page size selector never shrink
 * or wrap. The position label shrinks first and truncates at the end, with a tooltip holding the
 * full text. While it is cut, the label is a tab stop, so the tooltip opens on keyboard focus too.
 * A container too narrow for the numbered list should use `variant="compact"`.
 *
 * ### Asserting on it
 *
 * `testId` becomes `data-testid` on the `nav`, and it names the parts: `{testId}-total`,
 * `{testId}-previous`, `{testId}-page-{n}`, `{testId}-separator-start`,
 * `{testId}-separator-end`, `{testId}-divider`, `{testId}-next` and `{testId}-page-size`. The
 * Select inside the page size selector is `{testId}-page-size-select`, and each row of its list
 * is `{testId}-page-size-select-item-{value}`. A `pageSizeOptions.items` object with a `testId`
 * names its row with that instead. Use those or the data attributes, never the hashed class
 * names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"pagination"` |
 * | `data-variant`, `data-align` | mirrors the prop |
 * | `data-disabled` | present only while `disabled` is true |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `pagination-total` | with `showTotal`, the position label |
 * | `pagination-previous`, `pagination-next` | always, hidden in `compact` at the ends |
 * | `pagination-page` | one per page slot in `numbered`, `data-current` on the current page |
 * | `pagination-separator` | in `numbered`, for each gap, `aria-hidden` |
 * | `pagination-divider` | in `compact`, between Previous and Next, `aria-hidden` |
 * | `pagination-page-size` | with `pageSizeOptions` |
 *
 * @example
 * ```tsx
 * <Pagination total={1240} current={page} onPageChange={setPage} showTotalLabel="pods" />
 * ```
 *
 * @example
 * ```tsx
 * // A page size selector, with an option that carries its own label
 * <Pagination
 *   total={1240}
 *   pageSizeOptions={{ items: [10, 20, { value: 25, label: 'Auto (25)' }, 50] }}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Previous and Next for a narrow container
 * <Pagination total={1240} variant="compact" aria-label="Logs pagination" />
 * ```
 */
const PaginationRoot = forwardRef<HTMLElement, PaginationProps>(function Pagination(
	{
		total: rawTotal,
		showTotalLabel,
		variant = 'numbered',
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
	}: PaginationProps & RejectedProps,
	ref,
) {
	const { page, pageSize, total, pageCount, setPage, setPageSize } = usePaginationState({
		total: rawTotal,
		current,
		defaultCurrent,
		onPageChange,
		pageSize: pageSizeProp,
		defaultPageSize,
		onPageSizeChange,
	});
	const selector = usePageSizeOptions(pageSizeOptions, pageSize);
	const shownPage = total === 0 ? 1 : page;

	return (
		<PaginationFrame
			ref={ref}
			rootProps={rootProps}
			ariaLabel={ariaLabel}
			testId={testId}
			variant={variant}
			align={align}
			disabled={disabled}
			disabledTooltip={disabledTooltip}
			page={shownPage}
			pageCount={pageCount}
			hasNext={shownPage < pageCount}
			showTotal={showTotal}
			totalText={formatRange(shownPage, pageSize, total, showTotalLabel)}
			totalSizerText={formatRange(Math.max(pageCount, 1), pageSize, total, showTotalLabel)}
			enablePageSize={selector.enabled}
			pageSize={pageSize}
			pageSizeOptions={selector.options}
			pageSizeLabel={selector.label}
			pageSizePosition={selector.position}
			onPageChange={setPage}
			onPageSizeChange={setPageSize}
		/>
	);
});

export const Pagination = Object.assign(PaginationRoot, { Cursor: PaginationCursor });
