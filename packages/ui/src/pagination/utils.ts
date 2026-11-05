import { PAGINATION_DEFAULT_PAGE_SIZE, PAGINATION_SLOT_COUNT } from './constants.js';
import type { PaginationPageSizeOption, PaginationPageSizeOptions } from './types.js';

/**
 * @access private
 */
export type PaginationSlot =
	| { type: 'page'; page: number }
	| { type: 'separator'; position: 'start' | 'end' };

/**
 * @access private
 */
export type PaginationResolvedPageSizeOption = {
	value: number;
	label: string | undefined;
	testId: string | undefined;
};

const numberFormat = new Intl.NumberFormat('en-US');

/**
 * @access private
 */
export function formatNumber(value: number): string {
	return numberFormat.format(value);
}

/**
 * @access private
 */
export function normalizeTotal(total: number): number {
	return Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
}

/**
 * @access private
 */
export function isValidPageSize(pageSize: unknown): pageSize is number {
	return typeof pageSize === 'number' && Number.isInteger(pageSize) && pageSize > 0;
}

/**
 * @access private
 */
export function normalizePageSize(pageSize: number | undefined): number {
	return isValidPageSize(pageSize) ? pageSize : PAGINATION_DEFAULT_PAGE_SIZE;
}

/**
 * @access private
 */
export function getPageCount(total: number, pageSize: number): number {
	return Math.ceil(total / pageSize);
}

/**
 * The page in range nearest to `page`. A page count of 0 has the one page `1`, and `Infinity` is
 * a list with no last page.
 *
 * @access private
 */
export function clampPage(page: number, pageCount: number): number {
	if (Number.isNaN(page)) {
		return 1;
	}

	return Math.min(Math.max(Math.trunc(page), 1), Math.max(pageCount, 1));
}

function range(start: number, end: number): number[] {
	return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * The slots of the numbered list: every page up to seven pages, and exactly seven slots above
 * that. A separator never stands in for a single page.
 *
 * @access private
 */
export function getPageSlots(pageCount: number, current: number): PaginationSlot[] {
	if (pageCount <= PAGINATION_SLOT_COUNT) {
		return range(1, Math.max(pageCount, 1)).map((page) => ({ type: 'page', page }));
	}

	const start = Math.min(Math.max(current - 1, 3), pageCount - 4);
	const end = start + 2;
	const slots: PaginationSlot[] = [{ type: 'page', page: 1 }];

	slots.push(start === 3 ? { type: 'page', page: 2 } : { type: 'separator', position: 'start' });

	for (const page of range(start, end)) {
		slots.push({ type: 'page', page });
	}

	slots.push(
		end === pageCount - 2
			? { type: 'page', page: pageCount - 1 }
			: { type: 'separator', position: 'end' },
	);
	slots.push({ type: 'page', page: pageCount });

	return slots;
}

/**
 * @access private
 */
export function formatRange(
	page: number,
	pageSize: number,
	total: number,
	showTotalLabel?: string,
) {
	const start = Math.min((page - 1) * pageSize + 1, total);
	const end = Math.min(page * pageSize, total);
	const label = showTotalLabel ? ` ${showTotalLabel}` : '';

	return `${formatNumber(start)} \u2014 ${formatNumber(end)} of ${formatNumber(total)}${label}`;
}

/**
 * @access private
 */
export function formatCursorPage(page: number): string {
	return `Page ${formatNumber(page)}`;
}

/**
 * The options as the selector lists them: each `value` that is a valid page size, once, and
 * `pageSize` inserted in numeric order when the list does not have it.
 *
 * @access private
 */
export function resolvePageSizeOptions(
	options: PaginationPageSizeOption[],
	pageSize: number,
): { options: PaginationResolvedPageSizeOption[]; hasDuplicates: boolean; hasInvalid: boolean } {
	const resolved: PaginationResolvedPageSizeOption[] = [];
	let hasDuplicates = false;
	let hasInvalid = false;

	for (const option of options) {
		const value = typeof option === 'number' ? option : option.value;
		const label = typeof option === 'number' ? undefined : option.label;
		const testId = typeof option === 'number' ? undefined : option.testId;

		if (!isValidPageSize(value)) {
			hasInvalid = true;
		} else if (resolved.some((entry) => entry.value === value)) {
			hasDuplicates = true;
		} else {
			resolved.push({ value, label, testId });
		}
	}

	if (!resolved.some((entry) => entry.value === pageSize)) {
		const index = resolved.findIndex((entry) => entry.value > pageSize);

		resolved.splice(index === -1 ? resolved.length : index, 0, {
			value: pageSize,
			label: undefined,
			testId: undefined,
		});
	}

	return { options: resolved, hasDuplicates, hasInvalid };
}

/**
 * Whether `pageSizeOptions` turns the page size selector on: `true` or an object.
 *
 * @access private
 */
export function isPageSizeEnabled(
	pageSizeOptions: boolean | PaginationPageSizeOptions | undefined,
): pageSizeOptions is true | PaginationPageSizeOptions {
	return (
		pageSizeOptions === true || (typeof pageSizeOptions === 'object' && pageSizeOptions !== null)
	);
}

/**
 * @access private
 */
export function digitsOf(value: number): number {
	return String(Math.max(Math.trunc(value), 1)).length;
}
