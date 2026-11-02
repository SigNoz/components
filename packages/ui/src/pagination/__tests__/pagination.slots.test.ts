import { describe, expect, it } from 'vitest';
import { getPageSlots, type PaginationSlot } from '../utils.js';

function format(slots: PaginationSlot[]): string {
	return slots.map((slot) => (slot.type === 'page' ? String(slot.page) : '-')).join(' ');
}

describe('getPageSlots', () => {
	it.each([
		[1, '1 2 3 4 5 - 20'],
		[2, '1 2 3 4 5 - 20'],
		[3, '1 2 3 4 5 - 20'],
		[4, '1 2 3 4 5 - 20'],
		[5, '1 - 4 5 6 - 20'],
		[10, '1 - 9 10 11 - 20'],
		[16, '1 - 15 16 17 - 20'],
		[17, '1 - 16 17 18 19 20'],
		[18, '1 - 16 17 18 19 20'],
		[19, '1 - 16 17 18 19 20'],
		[20, '1 - 16 17 18 19 20'],
	])('lists the spec slots for 20 pages at page %i', (current, expected) => {
		expect(format(getPageSlots(20, current))).toBe(expected);
	});

	it.each([
		[0, '1'],
		[1, '1'],
		[2, '1 2'],
		[3, '1 2 3'],
		[4, '1 2 3 4'],
		[5, '1 2 3 4 5'],
		[6, '1 2 3 4 5 6'],
		[7, '1 2 3 4 5 6 7'],
	])('renders every page and no separator for %i pages', (count, expected) => {
		for (let current = 1; current <= Math.max(count, 1); current += 1) {
			expect(format(getPageSlots(count, current))).toBe(expected);
		}
	});

	it('has seven slots from eight pages, the first one gap on either side', () => {
		for (let current = 1; current <= 4; current += 1) {
			expect(format(getPageSlots(8, current))).toBe('1 2 3 4 5 - 8');
		}

		for (let current = 5; current <= 8; current += 1) {
			expect(format(getPageSlots(8, current))).toBe('1 - 4 5 6 7 8');
		}
	});

	it('renders the page and not a separator when the gap is one page', () => {
		expect(format(getPageSlots(9, 1))).toBe('1 2 3 4 5 - 9');
		expect(format(getPageSlots(9, 5))).toBe('1 - 4 5 6 - 9');
		expect(format(getPageSlots(9, 9))).toBe('1 - 5 6 7 8 9');
	});

	it.each([8, 9, 10, 11, 20, 21, 100, 101])(
		'has exactly seven slots at every page of %i pages',
		(count) => {
			for (let current = 1; current <= count; current += 1) {
				const slots = getPageSlots(count, current);
				const pages = slots.flatMap((slot) => (slot.type === 'page' ? [slot.page] : []));

				expect(slots, `page ${current} of ${count}`).toHaveLength(7);
				expect(slots[0]).toEqual({ type: 'page', page: 1 });
				expect(slots[6]).toEqual({ type: 'page', page: count });
				expect(pages).toContain(current);
				expect(pages).toContain(Math.max(current - 1, 1));
				expect(pages).toContain(Math.min(current + 1, count));
			}
		},
	);

	it('never lets a separator stand in for a single page', () => {
		for (const count of [8, 9, 10, 20, 100]) {
			for (let current = 1; current <= count; current += 1) {
				const slots = getPageSlots(count, current);

				slots.forEach((slot, index) => {
					if (slot.type !== 'separator') {
						return;
					}

					const before = slots[index - 1];
					const after = slots[index + 1];

					if (before?.type !== 'page' || after?.type !== 'page') {
						throw new Error('A separator sits between two pages');
					}

					expect(
						after.page - before.page - 1,
						`page ${current} of ${count}`,
					).toBeGreaterThanOrEqual(2);
				});
			}
		}
	});

	it('only hides pages behind a separator, so the pages read in order', () => {
		for (const count of [20, 100]) {
			for (let current = 1; current <= count; current += 1) {
				const slots = getPageSlots(count, current);

				slots.forEach((slot, index) => {
					const before = slots[index - 1];

					if (slot.type === 'page' && before?.type === 'page') {
						expect(slot.page - before.page).toBe(1);
					}
				});
			}
		}
	});
});
