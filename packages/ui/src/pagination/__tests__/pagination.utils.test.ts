import { describe, expect, it } from 'vitest';
import {
	clampPage,
	digitsOf,
	formatCursorPage,
	formatNumber,
	formatRange,
	getPageCount,
	isValidPageSize,
	normalizePageSize,
	normalizeTotal,
	resolvePageSizeOptions,
} from '../utils.js';

describe('normalizeTotal', () => {
	it.each([
		[100, 100],
		[0, 0],
		[10.9, 10],
		[Number.NaN, 0],
		[Number.POSITIVE_INFINITY, 0],
		[Number.NEGATIVE_INFINITY, 0],
		[-1, 0],
		[-0.5, 0],
	])('turns %s into %s', (total, expected) => {
		expect(normalizeTotal(total)).toBe(expected);
	});

	it('counts a value that is not a number as 0', () => {
		expect(normalizeTotal(undefined as unknown as number)).toBe(0);
		expect(normalizeTotal('12' as unknown as number)).toBe(0);
	});
});

describe('normalizePageSize', () => {
	it.each([
		[25, 25],
		[1, 1],
		[0, 10],
		[-5, 10],
		[2.5, 10],
		[Number.NaN, 10],
		[Number.POSITIVE_INFINITY, 10],
		[undefined, 10],
	])('turns %s into %s', (pageSize, expected) => {
		expect(normalizePageSize(pageSize)).toBe(expected);
	});

	it('tells a valid page size from an invalid one', () => {
		expect(isValidPageSize(10)).toBe(true);
		expect(isValidPageSize(0)).toBe(false);
		expect(isValidPageSize('10')).toBe(false);
	});
});

describe('clampPage', () => {
	it.each([
		[1, 5, 1],
		[5, 5, 5],
		[6, 5, 5],
		[99, 5, 5],
		[0, 5, 1],
		[-3, 5, 1],
		[Number.NaN, 5, 1],
		[2.7, 5, 2],
		[Number.POSITIVE_INFINITY, 5, 5],
		[3, 0, 1],
		[3, Number.POSITIVE_INFINITY, 3],
	])('puts page %s of %s pages at %s', (page, count, expected) => {
		expect(clampPage(page, count)).toBe(expected);
	});

	it('counts the pages', () => {
		expect(getPageCount(95, 10)).toBe(10);
		expect(getPageCount(100, 10)).toBe(10);
		expect(getPageCount(101, 10)).toBe(11);
		expect(getPageCount(0, 10)).toBe(0);
	});
});

describe('formatRange', () => {
	it('writes the range with an em dash and a space on each side', () => {
		const text = formatRange(1, 20, 100);

		expect(text).toBe('1 \u2014 20 of 100');
		expect(text).toContain(' \u2014 ');
	});

	it('stops the last range at the total', () => {
		expect(formatRange(10, 10, 95)).toBe('91 \u2014 95 of 95');
	});

	it('groups numbers above 999 with a comma', () => {
		expect(formatRange(1, 10, 12345)).toBe('1 \u2014 10 of 12,345');
		expect(formatRange(1235, 10, 12345)).toBe('12,341 \u2014 12,345 of 12,345');
		expect(formatNumber(999)).toBe('999');
		expect(formatNumber(1000)).toBe('1,000');
	});

	it('writes the showTotalLabel after the total', () => {
		expect(formatRange(1, 20, 100, 'pods')).toBe('1 \u2014 20 of 100 pods');
	});

	it('writes nothing after the total for an empty showTotalLabel', () => {
		expect(formatRange(1, 20, 100, '')).toBe('1 \u2014 20 of 100');
	});

	it('writes an empty list as 0 of 0, with the em dash', () => {
		expect(formatRange(1, 10, 0)).toBe('0 \u2014 0 of 0');
		expect(formatRange(1, 10, 0, 'pods')).toBe('0 \u2014 0 of 0 pods');
	});

	it('writes the page of a cursor list', () => {
		expect(formatCursorPage(3)).toBe('Page 3');
		expect(formatCursorPage(1200)).toBe('Page 1,200');
	});
});

describe('resolvePageSizeOptions', () => {
	it("carries an object item's testId", () => {
		const { options } = resolvePageSizeOptions(
			[10, { value: 20, label: 'Twenty', testId: 'twenty' }],
			10,
		);

		expect(options).toStrictEqual([
			{ value: 10, label: undefined, testId: undefined },
			{ value: 20, label: 'Twenty', testId: 'twenty' },
		]);
	});

	it('keeps numbers and labelled options in order', () => {
		const { options, hasDuplicates } = resolvePageSizeOptions(
			[10, { value: 25, label: 'Auto (25)' }, 50],
			25,
		);

		expect(options).toEqual([
			{ value: 10, label: undefined },
			{ value: 25, label: 'Auto (25)' },
			{ value: 50, label: undefined },
		]);
		expect(hasDuplicates).toBe(false);
	});

	it.each([
		[5, [5, 10, 20, 30, 40, 50]],
		[15, [10, 15, 20, 30, 40, 50]],
		[35, [10, 20, 30, 35, 40, 50]],
		[100, [10, 20, 30, 40, 50, 100]],
	])('inserts a page size of %s in numeric order', (pageSize, expected) => {
		const { options } = resolvePageSizeOptions([10, 20, 30, 40, 50], pageSize);

		expect(options.map((option) => option.value)).toEqual(expected);
	});

	it('inserts before the first larger option and does not reorder the rest', () => {
		const { options } = resolvePageSizeOptions([10, 50, 25], 20);

		expect(options.map((option) => option.value)).toEqual([10, 20, 50, 25]);
	});

	it('inserts the page size into an empty list', () => {
		expect(resolvePageSizeOptions([], 10).options).toEqual([{ value: 10, label: undefined }]);
	});

	it('drops a repeated value and reports it', () => {
		const { options, hasDuplicates } = resolvePageSizeOptions(
			[10, { value: 10, label: 'Ten' }, 20],
			10,
		);

		expect(options).toEqual([
			{ value: 10, label: undefined },
			{ value: 20, label: undefined },
		]);
		expect(hasDuplicates).toBe(true);
	});

	it('drops a value that is not a positive integer and reports it', () => {
		const { options, hasDuplicates, hasInvalid } = resolvePageSizeOptions(
			[0, 10, -5, 2.5, Number.NaN, Number.NaN, { value: 0, label: 'None' }, 20],
			10,
		);

		expect(options).toEqual([
			{ value: 10, label: undefined },
			{ value: 20, label: undefined },
		]);
		expect(hasInvalid).toBe(true);
		expect(hasDuplicates).toBe(false);
	});

	it('reports nothing for a list of valid values', () => {
		const { hasDuplicates, hasInvalid } = resolvePageSizeOptions([10, 20], 10);

		expect(hasDuplicates).toBe(false);
		expect(hasInvalid).toBe(false);
	});
});

describe('digitsOf', () => {
	it.each([
		[0, 1],
		[1, 1],
		[9, 1],
		[10, 2],
		[99, 2],
		[100, 3],
		[12345, 5],
	])('counts the digits of %s as %s', (value, expected) => {
		expect(digitsOf(value)).toBe(expected);
	});
});
