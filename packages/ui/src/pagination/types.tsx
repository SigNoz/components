import type { AriaAttributes, ReactNode } from 'react';

export type PaginationAlign = 'start' | 'center' | 'end';

export type PaginationVariant = 'numbered' | 'compact';

export type PaginationPageSizePosition = 'start' | 'end';

/**
 * A page size the selector offers: the number, or the number with a label of its own.
 *
 * @note With a `testId` on the pagination, the row of each item is
 * `{testId}-page-size-select-item-{value}`. An object item's own `testId` replaces that name, and
 * works without a `testId` on the pagination.
 */
export type PaginationPageSizeOption = number | { value: number; label: string; testId?: string };

/**
 * The page size selector, as `pageSizeOptions` configures it. A field left out takes its default.
 */
export type PaginationPageSizeOptions = {
	/**
	 * The page sizes the selector offers.
	 *
	 * @note An object item shows its `label` in the list and its `value` once picked. Each `value`
	 * appears once: a duplicate is dropped and logs a warning. So is a `value` that is not a
	 * positive integer.
	 *
	 * @note A `pageSize` that is not in the list is added to it in numeric order, so the selector
	 * never shows an empty value.
	 *
	 * @default [10, 20, 30, 40, 50]
	 */
	items?: PaginationPageSizeOption[];
	/**
	 * The visible label of the selector, which also names it.
	 *
	 * @default 'Rows per page'
	 */
	label?: string;
	/**
	 * Where the selector sits, before or after the page controls.
	 *
	 * @default 'end'
	 */
	position?: PaginationPageSizePosition;
};

type PaginationSharedProps = AriaAttributes & {
	/**
	 * Forwarded to the `nav`.
	 */
	id?: string;
	/**
	 * Forwarded to the `nav` as `data-testid`. The parts derive theirs from it, as
	 * `{testId}-total`, `{testId}-previous`, `{testId}-page-{n}`, `{testId}-separator-start`,
	 * `{testId}-separator-end`, `{testId}-divider`, `{testId}-next` and `{testId}-page-size`.
	 */
	testId?: string;
	/**
	 * The current page, starting at 1. Writing the prop makes the page controlled.
	 *
	 * @note A page outside the range renders the nearest page in range, and `onPageChange` is
	 * called once with it. A `total` of 0 leaves the page as it is.
	 */
	current?: number;
	/**
	 * The page on the first render, for a pagination that keeps its own page.
	 *
	 * @default 1
	 */
	defaultCurrent?: number;
	/**
	 * Called with the new page when the user picks a page, and when the component moves an
	 * out-of-range page back into range.
	 *
	 * @note A new page size calls it with `1`, after `onPageSizeChange`.
	 */
	onPageChange?: (page: number) => void;
	/**
	 * The number of items per page. Writing the prop makes the page size controlled.
	 *
	 * @note A value that is not a positive integer falls back to `10`, with a warning on the
	 * console.
	 */
	pageSize?: number;
	/**
	 * The page size on the first render, for a pagination that keeps its own page size.
	 *
	 * @default 10
	 */
	defaultPageSize?: number;
	/**
	 * Called with the new page size when the user picks one in the page size selector.
	 */
	onPageSizeChange?: (pageSize: number) => void;
	/**
	 * Renders the page size selector. `true` renders it with the defaults, and an object renders
	 * it with the fields it sets: `items`, `label` and `position`.
	 *
	 * @default false
	 */
	pageSizeOptions?: boolean | PaginationPageSizeOptions;
	/**
	 * Renders the position label at the start of the bar.
	 *
	 * @default true
	 */
	showTotal?: boolean;
	/**
	 * Where the page controls sit when the position label is hidden.
	 *
	 * @note It has no effect while `showTotal` is true: the label takes the start and the controls
	 * the end.
	 *
	 * @default 'end'
	 */
	align?: PaginationAlign;
	/**
	 * Blocks every page change and the page size selector.
	 *
	 * @note Every control keeps its slot and stays focusable, so `disabledTooltip` is reachable.
	 * The position label still shows the current range.
	 *
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * What to tell the user while `disabled` is true, shown in a tooltip on hover or focus of any
	 * control. A value that renders nothing shows no tooltip.
	 *
	 * @note Previous and Next at the ends of the range show it too: while `disabled` is true they
	 * are focusable like every other control. While it is false they are disabled with no tooltip,
	 * since an end of the range is the shape of the data and not a blocker.
	 */
	disabledTooltip?: ReactNode;
	/**
	 * Any `data-*` prop is accepted and forwarded to the `nav`, alongside `aria-*`.
	 */
	[key: `data-${string}`]: unknown;
};

export type PaginationProps = PaginationSharedProps & {
	/**
	 * The number of items across all pages.
	 *
	 * @note A value that is not a finite number, or is negative, counts as 0.
	 */
	total: number;
	/**
	 * A noun written after the total in the position label, as in `1 \u2014 20 of 100 pods`.
	 *
	 * @note Pass the plural form, the component does not change it.
	 */
	showTotalLabel?: string;
	/**
	 * The page controls: the numbered page list, or a Previous and a Next button for narrow
	 * containers.
	 *
	 * @note The component does not switch on its own. A container too narrow for the numbered
	 * list should use `compact`.
	 *
	 * @default 'numbered'
	 */
	variant?: PaginationVariant;
};

export type PaginationCursorProps = PaginationSharedProps & {
	/**
	 * Whether a page exists after the current one. The consumer knows it from the cursor of the
	 * API, or from a full page.
	 *
	 * @note Next hides, and keeps its space, while it is `false`.
	 */
	hasNextPage: boolean;
};
