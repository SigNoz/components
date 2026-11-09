import { render as renderInDom } from '@testing-library/react';
import { createRef, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
	BREADCRUMB_COLLAPSE_HYSTERESIS_PX,
	BreadcrumbItemKind,
	BreadcrumbPosition,
	BreadcrumbShrink,
} from '../constants.js';
import type { BreadcrumbItemType, BreadcrumbTrailMeasure } from '../types.js';
import {
	countCollapsed,
	getCollapseOrder,
	getItemsKey,
	getKind,
	getMinCollapsed,
	getNextRowIndex,
	getPosition,
	getRowRender,
	getShrink,
	getTrailWidth,
	hasMenu,
	hasPreview,
	hasTitle,
	isLink,
	resolveItems,
	toMenuRows,
} from '../utils.js';
import { noop, RouterLink } from './breadcrumb.test-utils.js';

/** Five 100px crumbs, 10px separators, a 30px `...` crumb and no gap. */
function measureOf(overrides: Partial<BreadcrumbTrailMeasure> = {}): BreadcrumbTrailMeasure {
	return {
		collapseFrom: 'center',
		widths: [100, 100, 100, 100, 100],
		separatorWidth: 10,
		ellipsisWidth: 30,
		gap: 0,
		available: 0,
		...overrides,
	};
}

function resolveOne(
	item: BreadcrumbItemType,
	{ testId = 'bc', before = [] }: { testId?: string | null; before?: BreadcrumbItemType[] } = {},
) {
	const resolved = resolveItems([...before, item], testId ?? undefined);
	const entry = resolved.at(-1);

	if (entry === undefined) {
		throw new Error('the crumb was left out of the trail');
	}

	return { entry, items: resolved.map(({ item: kept }) => kept) };
}

function renderOf(row: unknown): ReactElement {
	const { render } = row as { render: ReactElement };

	if (!isValidElement(render)) {
		throw new Error('the row has no render element');
	}

	return render;
}

describe('hasTitle', () => {
	it.each<[string, ReactNode, boolean]>([
		['a word', 'Home', true],
		['a number', 7, true],
		['zero', 0, true],
		['an element', <span key="a">Home</span>, true],
		['an array holding text', [null, 'Home'], true],
		['a fragment holding text', <Fragment key="f">Home</Fragment>, true],
		['an empty string', '', false],
		['spaces', '   ', false],
		['tabs and line breaks', '\t\n ', false],
		['null', null, false],
		['undefined', undefined, false],
		['false', false, false],
		['true', true, false],
		['an empty array', [], false],
		['an array of nothing', [null, false, ''], false],
		['an empty fragment', <Fragment key="f">{null}</Fragment>, false],
	])('says %s is %s', (_, title, expected) => {
		expect(hasTitle(title)).toBe(expected);
	});
});

describe('resolveItems', () => {
	it('keeps every crumb with a title, in order', () => {
		const items = [{ title: 'A' }, { title: 'B' }, { title: 'C' }];

		expect(resolveItems(items, undefined).map(({ item }) => item)).toEqual(items);
	});

	it('leaves out the crumbs whose title renders nothing', () => {
		const resolved = resolveItems(
			[
				{ title: 'A' },
				{ title: null },
				{ title: '' },
				{ title: '  ' },
				{ title: false },
				{ title: 'B' },
			],
			undefined,
		);

		expect(resolved.map(({ item }) => item.title)).toEqual(['A', 'B']);
	});

	it('keeps the index every crumb had in items, so an id does not move when a title empties', () => {
		const resolved = resolveItems([{ title: 'A' }, { title: '' }, { title: 'C' }], 'bc');

		expect(resolved.map(({ index }) => index)).toEqual([0, 2]);
		expect(resolved.map(({ testId }) => testId)).toEqual(['bc-item-0', 'bc-item-2']);
	});

	it('gives no test id without a testId', () => {
		expect(resolveItems([{ title: 'A' }], undefined)[0]?.testId).toBeUndefined();
	});

	it('reads the kind of every crumb off the crumb', () => {
		const resolved = resolveItems(
			[
				{ title: 'A', href: '/a' },
				{ title: 'B', menu: [{ title: 'C' }] },
				{ title: 'D', onClick: noop },
				{ title: 'E', render: <RouterLink to="/e" /> },
				{ title: 'F' },
			],
			undefined,
		);

		expect(resolved.map(({ kind }) => kind)).toEqual([
			BreadcrumbItemKind.Link,
			BreadcrumbItemKind.Menu,
			BreadcrumbItemKind.Button,
			BreadcrumbItemKind.Link,
			BreadcrumbItemKind.Text,
		]);
	});

	it('returns nothing for no crumbs', () => {
		expect(resolveItems([], 'bc')).toEqual([]);
	});
});

describe('getItemsKey', () => {
	it('joins the index and the title of every crumb', () => {
		const resolved = resolveItems([{ title: 'a' }, { title: 'b' }], undefined);

		expect(getItemsKey(resolved)).toBe('0:a\u00001:b');
	});

	it('counts a node title as one character, whatever it holds', () => {
		const first = resolveItems([{ title: <b>One</b> }], undefined);
		const second = resolveItems([{ title: <i>Two</i> }], undefined);

		expect(getItemsKey(first)).toBe('0:\u0001');
		expect(getItemsKey(first)).toBe(getItemsKey(second));
	});

	it('changes with a title', () => {
		const before = getItemsKey(resolveItems([{ title: 'a' }, { title: 'b' }], undefined));
		const after = getItemsKey(resolveItems([{ title: 'a' }, { title: 'c' }], undefined));

		expect(before).not.toBe(after);
	});

	it('changes when a crumb empties, though the titles left are the same', () => {
		const before = getItemsKey(resolveItems([{ title: 'a' }, { title: 'b' }], undefined));
		const after = getItemsKey(
			resolveItems([{ title: '' }, { title: 'a' }, { title: 'b' }], undefined),
		);

		expect(before).not.toBe(after);
	});

	it('keeps two different trails apart', () => {
		const joined = getItemsKey(resolveItems([{ title: 'a1:b' }], undefined));
		const split = getItemsKey(resolveItems([{ title: 'a1' }, { title: 'b' }], undefined));

		expect(joined).not.toBe(split);
	});

	it('is empty for an empty trail', () => {
		expect(getItemsKey([])).toBe('');
	});
});

describe('getKind', () => {
	it.each<[string, BreadcrumbItemType, string]>([
		['plain text', { title: 'A' }, BreadcrumbItemKind.Text],
		['an href', { title: 'A', href: '/a' }, BreadcrumbItemKind.Link],
		['a render', { title: 'A', render: <RouterLink to="/a" /> }, BreadcrumbItemKind.Link],
		['an onClick', { title: 'A', onClick: noop }, BreadcrumbItemKind.Button],
		['an href and an onClick', { title: 'A', href: '/a', onClick: noop }, BreadcrumbItemKind.Link],
		[
			'a render and an onClick',
			{ title: 'A', render: <RouterLink to="/a" />, onClick: noop },
			BreadcrumbItemKind.Link,
		],
		['only a target', { title: 'A', target: '_blank' }, BreadcrumbItemKind.Text],
		['a menu', { title: 'A', menu: [{ title: 'B' }] }, BreadcrumbItemKind.Menu],
		[
			'a menu and an href',
			{ title: 'A', href: '/a', menu: [{ title: 'B' }] },
			BreadcrumbItemKind.Menu,
		],
		[
			'a menu and a render',
			{ title: 'A', render: <RouterLink to="/a" />, menu: [{ title: 'B' }] },
			BreadcrumbItemKind.Menu,
		],
		[
			'a menu and an onClick',
			{ title: 'A', onClick: noop, menu: [{ title: 'B' }] },
			BreadcrumbItemKind.Menu,
		],
		['an empty menu', { title: 'A', menu: [] }, BreadcrumbItemKind.Text],
		['an empty menu and an href', { title: 'A', href: '/a', menu: [] }, BreadcrumbItemKind.Link],
		[
			'an empty menu and a render',
			{ title: 'A', render: <RouterLink to="/a" />, menu: [] },
			BreadcrumbItemKind.Link,
		],
		[
			'an empty menu and an onClick',
			{ title: 'A', onClick: noop, menu: [] },
			BreadcrumbItemKind.Button,
		],
	])('reads %s as the %s kind', (_, item, kind) => {
		expect(getKind(item)).toBe(kind);
	});
});

describe('isLink', () => {
	it.each<[string, Parameters<typeof isLink>[0], boolean]>([
		['an href', { href: '/a' }, true],
		['an empty href', { href: '' }, true],
		['a render', { render: <RouterLink to="/a" /> }, true],
		['an href and a render', { href: '/a', render: <RouterLink to="/a" /> }, true],
		['nothing', {}, false],
		['only an onClick', { onClick: noop }, false],
		['only a target', { target: '_blank' }, false],
		['an href that is undefined', { href: undefined }, false],
	])('says %s is %s', (_, link, expected) => {
		expect(isLink(link)).toBe(expected);
	});
});

describe('hasMenu', () => {
	it.each<[string, BreadcrumbItemType, boolean]>([
		['entries', { title: 'A', menu: [{ title: 'B' }] }, true],
		['an empty menu', { title: 'A', menu: [] }, false],
		['no menu', { title: 'A' }, false],
	])('says %s is %s', (_, item, expected) => {
		expect(hasMenu(item)).toBe(expected);
	});
});

describe('getPosition', () => {
	it.each<[number, number, string]>([
		[0, 1, BreadcrumbPosition.End],
		[0, 2, BreadcrumbPosition.Start],
		[1, 2, BreadcrumbPosition.End],
		[0, 3, BreadcrumbPosition.Start],
		[1, 3, BreadcrumbPosition.Middle],
		[2, 3, BreadcrumbPosition.End],
		[3, 6, BreadcrumbPosition.Middle],
		[5, 6, BreadcrumbPosition.End],
	])('puts position %i of %i at the %s', (position, count, expected) => {
		expect(getPosition(position, count)).toBe(expected);
	});
});

describe('getCollapseOrder', () => {
	it.each([0, 1, 2])(
		'is empty for %i crumbs, nothing sits between the first and the last',
		(count) => {
			expect(getCollapseOrder(count)).toEqual([]);
		},
	);

	it.each<[number, number[]]>([
		[3, [1]],
		[4, [1, 2]],
		[5, [2, 1, 3]],
		[6, [2, 3, 1, 4]],
		[7, [3, 2, 4, 1, 5]],
		[8, [3, 4, 2, 5, 1, 6]],
	])('collapses %i crumbs from the centre outward, in this order: %j', (count, expected) => {
		expect(getCollapseOrder(count)).toEqual(expected);
	});

	it('takes the side of the first crumb on a tie, so the crumbs next to the current one stay longest', () => {
		// Four crumbs have no centre crumb: 1 and 2 are equally close, and 1 goes first.
		expect(getCollapseOrder(4)[0]).toBe(1);
		// Six crumbs: 2 and 3 tie, then 1 and 4 tie.
		expect(getCollapseOrder(6)).toEqual([2, 3, 1, 4]);
	});

	describe.each(Array.from({ length: 18 }, (_, offset) => offset + 3))(
		'with %i crumbs',
		(count) => {
			const order = getCollapseOrder(count);

			it('holds every middle crumb once, and never the first or the last', () => {
				expect([...order].sort((a, b) => a - b)).toEqual(
					Array.from({ length: count - 2 }, (_, index) => index + 1),
				);
				expect(order).not.toContain(0);
				expect(order).not.toContain(count - 1);
			});

			it('leaves a contiguous run after every step, so one `...` crumb stands for all of it', () => {
				for (let length = 1; length <= order.length; length++) {
					const prefix = order.slice(0, length);

					expect(Math.max(...prefix) - Math.min(...prefix) + 1).toBe(length);
				}
			});

			it('moves away from the centre one step at a time', () => {
				const centre = (count - 1) / 2;
				const distances = order.map((position) => Math.abs(position - centre));

				expect(distances).toEqual([...distances].sort((a, b) => a - b));
			});
		},
	);

	it('hands out a new array every time', () => {
		expect(getCollapseOrder(5)).not.toBe(getCollapseOrder(5));
	});

	it('collapses from the centre unless it is told otherwise', () => {
		for (const count of [3, 4, 5, 6, 9]) {
			expect(getCollapseOrder(count)).toEqual(getCollapseOrder(count, 'center'));
		}
	});

	describe('from the start', () => {
		it.each([0, 1, 2])(
			'is empty for %i crumbs, nothing sits between the first and the last',
			(count) => {
				expect(getCollapseOrder(count, 'start')).toEqual([]);
			},
		);

		it.each<[number, number[]]>([
			[3, [1]],
			[4, [1, 2]],
			[5, [1, 2, 3]],
			[6, [1, 2, 3, 4]],
			[8, [1, 2, 3, 4, 5, 6]],
		])('collapses %i crumbs from the one after the first, in this order: %j', (count, expected) => {
			expect(getCollapseOrder(count, 'start')).toEqual(expected);
		});

		it.each(Array.from({ length: 18 }, (_, offset) => offset + 3))(
			'holds every middle crumb once and leaves a contiguous run after every step, with %i crumbs',
			(count) => {
				const order = getCollapseOrder(count, 'start');

				expect([...order].sort((a, b) => a - b)).toEqual(
					Array.from({ length: count - 2 }, (_, index) => index + 1),
				);
				expect(order).not.toContain(0);
				expect(order).not.toContain(count - 1);

				for (let length = 1; length <= order.length; length++) {
					const prefix = order.slice(0, length);

					expect(Math.max(...prefix) - Math.min(...prefix) + 1).toBe(length);
				}
			},
		);

		it('keeps the crumbs next to the last one for the end, so the nearest steps stay longest', () => {
			expect(getCollapseOrder(7, 'start').slice(0, 3)).toEqual([1, 2, 3]);
			expect(getCollapseOrder(7, 'start').at(-1)).toBe(5);
		});

		it('hands out a new array every time', () => {
			expect(getCollapseOrder(5, 'start')).not.toBe(getCollapseOrder(5, 'start'));
		});
	});
});

describe('getMinCollapsed', () => {
	it('collapses nothing without a maxVisible', () => {
		expect(getMinCollapsed(8, undefined)).toBe(0);
	});

	it.each<[number, number, number]>([
		[5, 5, 0],
		[5, 6, 0],
		[5, 100, 0],
		[5, 4, 1],
		[5, 3, 2],
		[5, 2, 3],
		[8, 4, 4],
	])('with %i crumbs and a maxVisible of %i, collapses %i', (count, maxVisible, expected) => {
		expect(getMinCollapsed(count, maxVisible)).toBe(expected);
	});

	it.each([1, 0, -4])('never shows fewer than two crumbs, so %i acts as 2', (maxVisible) => {
		expect(getMinCollapsed(5, maxVisible)).toBe(3);
	});

	it('rounds a fraction down', () => {
		expect(getMinCollapsed(6, 3.9)).toBe(3);
	});

	it('does not count Infinity as a limit', () => {
		expect(getMinCollapsed(5, Number.POSITIVE_INFINITY)).toBe(0);
	});

	it.each([0, 1, 2])('collapses nothing in a trail of %i crumbs', (count) => {
		expect(getMinCollapsed(count, 2)).toBe(0);
	});

	it('collapses the one crumb of a trail of three when maxVisible is 2', () => {
		expect(getMinCollapsed(3, 2)).toBe(1);
	});

	it('treats a NaN maxVisible as unset, instead of collapsing every middle crumb', () => {
		expect(getMinCollapsed(5, Number.NaN)).toBe(0);
	});
});

describe('getShrink', () => {
	// Five 100px crumbs with three collapsed: the first, the `...` crumb and the last, 250px.
	const FLOOR = 40;

	it('is undefined while more than the first and the last crumb show', () => {
		expect(getShrink(measureOf({ available: 10 }), 2, FLOOR)).toBeUndefined();
	});

	it('is undefined while the trail fits at the widths the crumbs have', () => {
		expect(getShrink(measureOf({ available: 250 }), 3, FLOOR)).toBeUndefined();
		expect(getShrink(measureOf({ available: 800 }), 3, FLOOR)).toBeUndefined();
		// Two crumbs and a single one, nothing collapsed.
		expect(getShrink(measureOf({ widths: [100, 100], available: 210 }), 0, FLOOR)).toBeUndefined();
		expect(getShrink(measureOf({ widths: [100], available: 100 }), 0, FLOOR)).toBeUndefined();
	});

	it('lets a sliver of overflow count as fitting, as the collapse planner does', () => {
		expect(getShrink(measureOf({ available: 249.5 }), 3, FLOOR)).toBeUndefined();
		expect(getShrink(measureOf({ available: 249.4 }), 3, FLOOR)).toBe(BreadcrumbShrink.End);
	});

	it('shortens the last crumb while that is enough', () => {
		// One pixel short of the 250px the trail needs.
		expect(getShrink(measureOf({ available: 249 }), 3, FLOOR)).toBe(BreadcrumbShrink.End);
		// The last crumb at the floor gives 190px.
		expect(getShrink(measureOf({ available: 190 }), 3, FLOOR)).toBe(BreadcrumbShrink.End);
	});

	it('shortens the first crumb once the last one sits at the floor', () => {
		expect(getShrink(measureOf({ available: 189 }), 3, FLOOR)).toBe(BreadcrumbShrink.Start);
		// Both at the floor give 130px.
		expect(getShrink(measureOf({ available: 130 }), 3, FLOOR)).toBe(BreadcrumbShrink.Start);
	});

	it('gives up below the floor of both', () => {
		expect(getShrink(measureOf({ available: 129 }), 3, FLOOR)).toBe(BreadcrumbShrink.Floor);
	});

	it('never takes a crumb narrower than the floor as wider than it is', () => {
		const widths = [100, 100, 100, 100, 20];

		// 100 + 30 + 20 and two separators fit exactly. Below that the last crumb has nothing left to
		// give, so the first one is next.
		expect(getShrink(measureOf({ widths, available: 170 }), 3, FLOOR)).toBeUndefined();
		expect(getShrink(measureOf({ widths, available: 169 }), 3, FLOOR)).toBe(BreadcrumbShrink.Start);
	});

	it('handles two crumbs and a single one with nothing collapsed', () => {
		expect(getShrink(measureOf({ widths: [100, 100], available: 150 }), 0, FLOOR)).toBe(
			BreadcrumbShrink.End,
		);
		expect(getShrink(measureOf({ widths: [100], available: 50 }), 0, FLOOR)).toBe(
			BreadcrumbShrink.End,
		);
		expect(getShrink(measureOf({ widths: [100], available: 30 }), 0, FLOOR)).toBe(
			BreadcrumbShrink.Floor,
		);
	});
});

describe('getTrailWidth', () => {
	it('adds the crumbs and one separator between every two', () => {
		expect(getTrailWidth(measureOf(), 0)).toBe(5 * 100 + 4 * 10);
	});

	it('swaps the collapsed crumbs for one `...` crumb, centre first', () => {
		// 4 crumbs and the `...` crumb, 5 segments.
		expect(getTrailWidth(measureOf(), 1)).toBe(4 * 100 + 30 + 4 * 10);
		// 3 crumbs and the `...` crumb.
		expect(getTrailWidth(measureOf(), 2)).toBe(3 * 100 + 30 + 3 * 10);
		// The first, the last and the `...` crumb.
		expect(getTrailWidth(measureOf(), 3)).toBe(2 * 100 + 30 + 2 * 10);
	});

	it('hides the centre crumb first, whatever its width', () => {
		const measure = measureOf({
			widths: [10, 20, 30, 40, 50],
			separatorWidth: 0,
			ellipsisWidth: 5,
		});

		expect(getTrailWidth(measure, 0)).toBe(150);
		expect(getTrailWidth(measure, 1)).toBe(150 - 30 + 5);
		expect(getTrailWidth(measure, 2)).toBe(150 - 30 - 20 + 5);
		expect(getTrailWidth(measure, 3)).toBe(150 - 30 - 20 - 40 + 5);
	});

	it('hides the crumb after the first one first when it collapses from the start', () => {
		const measure = measureOf({
			collapseFrom: 'start',
			widths: [10, 20, 30, 40, 50],
			separatorWidth: 0,
			ellipsisWidth: 5,
		});

		expect(getTrailWidth(measure, 0)).toBe(150);
		expect(getTrailWidth(measure, 1)).toBe(150 - 20 + 5);
		expect(getTrailWidth(measure, 2)).toBe(150 - 20 - 30 + 5);
		expect(getTrailWidth(measure, 3)).toBe(150 - 20 - 30 - 40 + 5);
	});

	it('counts the gap on both sides of every separator', () => {
		const measure = measureOf({ gap: 5 });

		expect(getTrailWidth(measure, 0)).toBe(5 * 100 + 4 * (10 + 2 * 5));
		expect(getTrailWidth(measure, 3)).toBe(2 * 100 + 30 + 2 * (10 + 2 * 5));
	});

	it('stops collapsing once every middle crumb is collapsed', () => {
		expect(getTrailWidth(measureOf(), 10)).toBe(getTrailWidth(measureOf(), 3));
	});

	it('adds no `...` crumb while nothing is collapsed', () => {
		expect(getTrailWidth(measureOf({ ellipsisWidth: 999 }), 0)).toBe(540);
	});

	it('has no separator for a single crumb', () => {
		expect(getTrailWidth(measureOf({ widths: [100] }), 0)).toBe(100);
	});

	it('has no width for an empty trail', () => {
		expect(getTrailWidth(measureOf({ widths: [] }), 0)).toBe(0);
	});

	it('does not collapse a trail of two, which has no middle', () => {
		expect(getTrailWidth(measureOf({ widths: [100, 100] }), 1)).toBe(210);
	});
});

describe('countCollapsed', () => {
	const FULL = 540;
	const ONE = 470;
	const TWO = 360;
	const THREE = 250;

	it('collapses nothing when the trail fits', () => {
		expect(countCollapsed(measureOf({ available: 1000 }), 0, 0)).toBe(0);
		expect(countCollapsed(measureOf({ available: FULL }), 0, 0)).toBe(0);
	});

	it('forgives half a pixel, since rects are fractional and round either way', () => {
		expect(countCollapsed(measureOf({ available: FULL - 0.5 }), 0, 0)).toBe(0);
		expect(countCollapsed(measureOf({ available: FULL - 0.6 }), 0, 0)).toBe(1);
	});

	it.each<[number, number]>([
		[FULL - 1, 1],
		[ONE, 1],
		[ONE - 1, 2],
		[TWO, 2],
		[TWO - 1, 3],
		[THREE, 3],
	])('collapses the fewest crumbs that fit in %ipx: %i', (available, expected) => {
		expect(countCollapsed(measureOf({ available }), 0, 0)).toBe(expected);
	});

	it('collapses every middle crumb, and no more, when even that does not fit', () => {
		expect(countCollapsed(measureOf({ available: 0 }), 0, 0)).toBe(3);
		expect(countCollapsed(measureOf({ available: THREE - 1 }), 0, 0)).toBe(3);
		expect(countCollapsed(measureOf({ available: 10, widths: [100, 100, 100] }), 0, 0)).toBe(1);
		expect(countCollapsed(measureOf({ available: 10, widths: [100, 100, 100, 100] }), 0, 0)).toBe(
			2,
		);
	});

	it.each([0, 1, 2])('collapses nothing in a trail of %i crumbs, whatever the room', (length) => {
		const widths = Array.from({ length }, () => 100);

		expect(countCollapsed(measureOf({ widths, available: 0 }), 0, 5)).toBe(0);
	});

	it('collapses at least minCollapsed, however much room there is', () => {
		expect(countCollapsed(measureOf({ available: 1000 }), 0, 2)).toBe(2);
		expect(countCollapsed(measureOf({ available: 1000 }), 0, 1)).toBe(1);
	});

	it('lets the width collapse more than minCollapsed asks', () => {
		expect(countCollapsed(measureOf({ available: TWO }), 0, 1)).toBe(2);
	});

	it('caps minCollapsed at the middle crumbs, so the first and the last stay', () => {
		expect(countCollapsed(measureOf({ available: 1000 }), 0, 99)).toBe(3);
	});

	describe('hysteresis', () => {
		it('asks for the extra room only to expand', () => {
			expect(BREADCRUMB_COLLAPSE_HYSTERESIS_PX).toBe(4);
			expect(countCollapsed(measureOf({ available: TWO }), 3, 0)).toBe(3);
			expect(countCollapsed(measureOf({ available: TWO + 3 }), 3, 0)).toBe(3);
			expect(countCollapsed(measureOf({ available: TWO + 4 }), 3, 0)).toBe(2);
		});

		it('does not ask for it to stay where it is', () => {
			expect(countCollapsed(measureOf({ available: TWO }), 2, 0)).toBe(2);
		});

		it('does not hold a trail back from collapsing more', () => {
			expect(countCollapsed(measureOf({ available: TWO - 1 }), 2, 0)).toBe(3);
			expect(countCollapsed(measureOf({ available: FULL - 1 }), 0, 0)).toBe(1);
		});

		it('asks for it on every step back, not only the first', () => {
			expect(countCollapsed(measureOf({ available: ONE }), 2, 0)).toBe(2);
			expect(countCollapsed(measureOf({ available: ONE + 4 }), 2, 0)).toBe(1);
			expect(countCollapsed(measureOf({ available: FULL }), 1, 0)).toBe(1);
			expect(countCollapsed(measureOf({ available: FULL + 4 }), 1, 0)).toBe(0);
		});

		it('can skip several steps in one go when there is room for them', () => {
			expect(countCollapsed(measureOf({ available: 1000 }), 3, 0)).toBe(0);
		});

		it('does not apply to a crumb count of minCollapsed, which never expands past it', () => {
			expect(countCollapsed(measureOf({ available: 1000 }), 3, 2)).toBe(2);
		});

		it('stays out of the way of a trail that never collapsed', () => {
			expect(countCollapsed(measureOf({ available: FULL }), 0, 0)).toBe(0);
		});
	});

	describe('from the start', () => {
		// The crumb after the first one is the wide one, so the start order frees the room sooner
		// than the centre order does.
		const widths = [100, 200, 50, 10, 100];
		const measure = (available: number, collapseFrom: 'center' | 'start') =>
			measureOf({ collapseFrom, widths, available });

		it('stops at the step the order frees the room at', () => {
			// 460 of crumbs and 4 separators of 10 is 500. Collapsing adds the 30px `...` crumb.
			// Start order, crumb 1 (200) first: 260 + 30 + 4 * 10 = 330.
			expect(countCollapsed(measure(330, 'start'), 0, 0)).toBe(1);
			expect(countCollapsed(measure(329, 'start'), 0, 0)).toBe(2);
			// Centre order, crumb 2 (50) first: 410 + 30 + 4 * 10 = 480.
			expect(countCollapsed(measure(480, 'center'), 0, 0)).toBe(1);
			expect(countCollapsed(measure(479, 'center'), 0, 0)).toBe(2);
		});

		it('keeps the same bounds: never the first or the last crumb', () => {
			expect(countCollapsed(measure(0, 'start'), 0, 0)).toBe(3);
			expect(countCollapsed(measure(1000, 'start'), 0, 99)).toBe(3);
		});
	});

	it('collapses nothing for a trail that is not wider than the room, measured with a gap', () => {
		const measure = measureOf({ gap: 5 });

		expect(countCollapsed({ ...measure, available: 580 }, 0, 0)).toBe(0);
		expect(countCollapsed({ ...measure, available: 579 }, 0, 0)).toBe(1);
	});
});

describe('getRowRender', () => {
	it.each<[string, Parameters<typeof getRowRender>[0]]>([
		['nothing', {}],
		['only an onClick', { onClick: noop }],
		['only a target', { target: '_blank' }],
	])('is undefined for a link with %s, which is an action', (_, link) => {
		expect(getRowRender(link)).toBeUndefined();
	});

	it('renders an anchor for an href, with the href and nothing else', () => {
		const render = getRowRender({ href: '/logs' });

		expect(render?.type).toBe('a');
		expect(render?.props).toEqual({ href: '/logs' });
	});

	it('renders an anchor with the target and a safe rel for a _blank target', () => {
		const render = getRowRender({ href: '/logs', target: '_blank' });

		expect(render?.props).toEqual({
			href: '/logs',
			target: '_blank',
			rel: 'noopener noreferrer',
		});
	});

	it('sets no rel for a target that is not _blank', () => {
		expect(getRowRender({ href: '/logs', target: '_self' })?.props).toEqual({
			href: '/logs',
			target: '_self',
		});
	});

	it('renders the element of a render, without its children', () => {
		const render = getRowRender({ render: <RouterLink to="/logs">Not the label</RouterLink> });

		expect(render?.type).toBe(RouterLink);
		expect(render?.props).toEqual({ to: '/logs' });
	});

	it('sets no href on an element that has its own destination, nor any key that is unset', () => {
		const props = getRowRender({ render: <RouterLink to="/logs" /> })?.props ?? {};

		expect(props).toEqual({ to: '/logs' });
		expect(Object.keys(props)).toEqual(['to']);
	});

	it('takes the href of the link where the element leaves it undefined', () => {
		const render = getRowRender({ href: '/logs', render: <RouterLink href={undefined} /> });

		expect(render?.props).toEqual({ href: '/logs' });
	});

	it('keeps the href and the target of the element over the ones of the link', () => {
		const render = getRowRender({
			href: '/from-link',
			target: '_blank',
			render: <RouterLink href="/from-render" target="_self" />,
		});

		expect(render?.props).toEqual({ href: '/from-render', target: '_self' });
	});

	it('adds noopener and noreferrer next to the rel the element has', () => {
		const render = getRowRender({
			target: '_blank',
			render: <RouterLink to="/logs" rel="nofollow noopener" />,
		});

		expect(render?.props).toMatchObject({ target: '_blank', rel: 'nofollow noopener noreferrer' });
	});

	it('keeps the key of the element', () => {
		expect(getRowRender({ render: <RouterLink key="stable" to="/logs" /> })?.key).toBe('stable');
	});

	it('leaves the element it was given as it was', () => {
		const onClick = vi.fn();
		const element = <RouterLink to="/logs">Label</RouterLink>;

		getRowRender({ href: '/logs', target: '_blank', onClick, render: element });

		expect(element.props).toEqual({ to: '/logs', children: 'Label' });
	});

	describe('onClick', () => {
		it('is the one of the link when the element has none', () => {
			const onClick = vi.fn();

			expect(getRowRender({ href: '/logs', onClick })?.props).toMatchObject({ onClick });
			expect(getRowRender({ render: <RouterLink to="/logs" />, onClick })?.props).toMatchObject({
				onClick,
			});
		});

		it('is the one of the element when the link has none', () => {
			const onClick = vi.fn();

			expect(
				getRowRender({ render: <RouterLink to="/logs" onClick={onClick} /> })?.props,
			).toMatchObject({ onClick });
		});

		it('runs the one of the element first, then the one of the link, with the same event', () => {
			const order: string[] = [];
			const event = new MouseEvent('click');
			const onElement = vi.fn(() => order.push('element'));
			const onLink = vi.fn(() => order.push('link'));
			const render = getRowRender({
				render: <RouterLink to="/logs" onClick={onElement} />,
				onClick: onLink,
			}) as ReactElement<{ onClick: (event: MouseEvent) => void }>;

			render.props.onClick(event);

			expect(order).toEqual(['element', 'link']);
			expect(onElement).toHaveBeenCalledExactlyOnceWith(event);
			expect(onLink).toHaveBeenCalledExactlyOnceWith(event);
		});

		it('is not set when neither has one', () => {
			expect(getRowRender({ href: '/logs' })?.props).not.toHaveProperty('onClick');
		});
	});

	describe('dropRef', () => {
		it('keeps the ref of the element by default', () => {
			const ref = createRef<HTMLAnchorElement>();

			renderInDom(getRowRender({ render: <RouterLink ref={ref} to="/logs" /> }) as ReactElement);

			expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
		});

		it('leaves the ref to the other copy of the element, which is the one still mounted', () => {
			const ref = createRef<HTMLAnchorElement>();

			renderInDom(
				getRowRender(
					{ render: <RouterLink ref={ref} to="/logs" /> },
					{ dropRef: true },
				) as ReactElement,
			);

			expect(ref.current).toBeNull();
		});

		it('keeps every other prop of the element', () => {
			const render = getRowRender(
				{ href: '/logs', render: <RouterLink to="/other" data-extra="1" /> },
				{ dropRef: true },
			);

			expect(render?.props).toMatchObject({ to: '/other', 'data-extra': '1' });
		});
	});
});

describe('getNextRowIndex', () => {
	it.each<[string, number, number, number]>([
		['ArrowDown', 0, 3, 1],
		['ArrowDown', 1, 3, 2],
		['ArrowDown', 2, 3, 0],
		['ArrowUp', 2, 3, 1],
		['ArrowUp', 1, 3, 0],
		['ArrowUp', 0, 3, 2],
		['Home', 2, 3, 0],
		['Home', 0, 3, 0],
		['End', 0, 3, 2],
		['End', 2, 3, 2],
		['ArrowDown', 0, 1, 0],
		['ArrowUp', 0, 1, 0],
	])('goes %s from the row %i of %i to the row %i', (key, current, count, expected) => {
		expect(getNextRowIndex(key, current, count)).toBe(expected);
	});

	it.each(['Enter', ' ', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'PageDown', 'a'])(
		'leaves %j to the browser',
		(key) => {
			expect(getNextRowIndex(key, 1, 3)).toBeUndefined();
		},
	);

	it.each(['ArrowDown', 'ArrowUp', 'Home', 'End'])(
		'has nowhere to go for %s without a row',
		(key) => {
			expect(getNextRowIndex(key, 0, 0)).toBeUndefined();
		},
	);
});

describe('hasPreview', () => {
	it('is true for a crumb with a preview that renders something, whatever it is', () => {
		for (const item of [
			{ title: 'A', href: '/a', preview: <p>Card</p> },
			{ title: 'A', onClick: noop, preview: 'Card' },
			{ title: 'A', preview: 3 },
		]) {
			expect(hasPreview(resolveOne(item).entry)).toBe(true);
		}
	});

	it('is false without a preview, and when it renders nothing', () => {
		for (const preview of [undefined, null, false, true, '', <></>, [null, false]]) {
			expect(hasPreview(resolveOne({ title: 'A', href: '/a', preview }).entry)).toBe(false);
		}
	});

	it('is false for a crumb with a menu, which is already the trigger of that menu', () => {
		const { entry } = resolveOne({
			title: 'A',
			menu: [{ title: 'B', href: '/b' }],
			preview: <p>Card</p>,
		});

		expect(hasPreview(entry)).toBe(false);
	});

	it('counts an empty menu as no menu, so the card stays', () => {
		const { entry } = resolveOne({ title: 'A', href: '/a', menu: [], preview: <p>Card</p> });

		expect(hasPreview(entry)).toBe(true);
	});
});

describe('toMenuRows', () => {
	it('is empty for an empty menu', () => {
		expect(toMenuRows([])).toEqual([]);
	});

	it('numbers the rows by their place in the menu', () => {
		const rows = toMenuRows([{ title: 'A' }, { title: 'B' }, { title: 'C' }]);

		expect(rows.map((row) => row.type === 'item' && row.value)).toEqual(['0', '1', '2']);
	});

	it('builds a link row for an entry with an href, rendered as an anchor', () => {
		const onClick = vi.fn();
		const [row] = toMenuRows([{ title: 'Logs', href: '/logs', onClick }]);

		expect(row).toMatchObject({ type: 'link', value: '0', label: 'Logs' });
		expect(renderOf(row).type).toBe('a');
		expect(renderOf(row).props).toEqual({ href: '/logs', onClick });
		expect(row).not.toHaveProperty('onClick');
	});

	it('builds a link row for an entry with a render, rendered as the element without children', () => {
		const [row] = toMenuRows([
			{ title: 'Logs', render: <RouterLink to="/logs">Not the label</RouterLink> },
		]);

		expect(row).toMatchObject({ type: 'link', value: '0', label: 'Logs' });
		expect(renderOf(row).type).toBe(RouterLink);
		expect(renderOf(row).props).toEqual({ to: '/logs' });
		expect(row).not.toHaveProperty('onClick');
	});

	it('chains the onClick of an entry after the one of its element', () => {
		const order: string[] = [];
		const [row] = toMenuRows([
			{
				title: 'Logs',
				render: <RouterLink to="/logs" onClick={() => order.push('element')} />,
				onClick: () => order.push('entry'),
			},
		]);

		(renderOf(row).props as { onClick: () => void }).onClick();

		expect(order).toEqual(['element', 'entry']);
	});

	it('fills the href and the target of an entry into the element, with a safe rel', () => {
		const [row] = toMenuRows([
			{ title: 'Docs', href: '/docs', target: '_blank', render: <RouterLink href={undefined} /> },
		]);

		expect(renderOf(row).props).toEqual({
			href: '/docs',
			target: '_blank',
			rel: 'noopener noreferrer',
		});
	});

	it('builds an action row for an entry without an href or a render', () => {
		const onClick = vi.fn();
		const [row] = toMenuRows([{ title: 'Rename', onClick }]);

		expect(row).toEqual({ type: 'item', value: '0', label: 'Rename', onClick });
	});

	it('builds a row with no handler for an entry that has neither', () => {
		const [row] = toMenuRows([{ title: 'Nothing' }]);

		expect(row).toEqual({ type: 'item', value: '0', label: 'Nothing' });
		expect(row).not.toHaveProperty('onClick');
	});

	it('keeps the order of the entries and mixes both kinds', () => {
		const rows = toMenuRows([
			{ title: 'Logs', href: '/logs' },
			{ title: 'Rename', onClick: noop },
			{ title: 'Traces', href: '/traces' },
		]);

		expect(rows.map((row) => row.type)).toEqual(['link', 'item', 'link']);
		expect(rows.map((row) => (row as { label: ReactNode }).label)).toEqual([
			'Logs',
			'Rename',
			'Traces',
		]);
	});

	it('names no test id, the dropdown names the rows after its own', () => {
		const rows = toMenuRows([{ title: 'Logs', href: '/logs' }, { title: 'Rename' }]);

		for (const row of rows) {
			expect(row).not.toHaveProperty('testId');
		}
	});

	it('names each row after the test id it is given and its place in the menu', () => {
		const rows = toMenuRows(
			[{ title: 'Logs', href: '/logs' }, { title: 'Rename' }],
			'bc-item-1-menu',
		);

		expect(rows.map((row) => (row as { testId?: string }).testId)).toEqual([
			'bc-item-1-menu-item-0',
			'bc-item-1-menu-item-1',
		]);
	});

	describe('with onPick', () => {
		type Clickable = { onClick: (event: MouseEvent) => void };

		it('runs it after the onClick of an action entry, with the event the entry gets', () => {
			const order: string[] = [];
			const event = new MouseEvent('click');
			const onClick = vi.fn(() => order.push('entry'));
			const onPick = vi.fn(() => order.push('pick'));
			const [row] = toMenuRows([{ title: 'Rename', onClick }], undefined, onPick);

			(row as unknown as Clickable).onClick(event);

			expect(order).toEqual(['entry', 'pick']);
			expect(onClick).toHaveBeenCalledExactlyOnceWith(event);
		});

		it('gives an entry with no onClick a handler that only picks', () => {
			const onPick = vi.fn();
			const [row] = toMenuRows([{ title: 'Nothing' }], undefined, onPick);

			expect(row).toMatchObject({ type: 'item', value: '0', label: 'Nothing' });
			(row as unknown as Clickable).onClick(new MouseEvent('click'));

			expect(onPick).toHaveBeenCalledOnce();
		});

		it('runs it after the onClick of the element and the one of the entry for a link entry', () => {
			const order: string[] = [];
			const [row] = toMenuRows(
				[
					{
						title: 'Logs',
						render: <RouterLink to="/logs" onClick={() => order.push('element')} />,
						onClick: () => order.push('entry'),
					},
				],
				undefined,
				() => order.push('pick'),
			);

			(renderOf(row).props as Clickable).onClick(new MouseEvent('click'));

			expect(row).toMatchObject({ type: 'link' });
			expect(row).not.toHaveProperty('onClick');
			expect(order).toEqual(['element', 'entry', 'pick']);
		});

		it('picks for a link entry that has no onClick of its own or on its element', () => {
			const onPick = vi.fn();
			const [row] = toMenuRows([{ title: 'Logs', href: '/logs' }], undefined, onPick);

			expect(renderOf(row).type).toBe('a');
			expect(renderOf(row).props).toMatchObject({ href: '/logs' });
			(renderOf(row).props as Clickable).onClick(new MouseEvent('click'));

			expect(onPick).toHaveBeenCalledOnce();
		});

		it('runs it after the onClick of the element when the entry has none', () => {
			const order: string[] = [];
			const [row] = toMenuRows(
				[
					{
						title: 'Logs',
						render: <RouterLink to="/logs" onClick={() => order.push('element')} />,
					},
				],
				undefined,
				() => order.push('pick'),
			);

			(renderOf(row).props as Clickable).onClick(new MouseEvent('click'));

			expect(order).toEqual(['element', 'pick']);
		});

		it('hands every row its own handler, so a pick on one runs no onClick of another', () => {
			const onFirst = vi.fn();
			const onSecond = vi.fn();
			const onPick = vi.fn();
			const [first, second] = toMenuRows(
				[
					{ title: 'First', onClick: onFirst },
					{ title: 'Second', onClick: onSecond },
				],
				undefined,
				onPick,
			);

			(second as unknown as Clickable).onClick(new MouseEvent('click'));

			expect(onSecond).toHaveBeenCalledOnce();
			expect(onFirst).not.toHaveBeenCalled();
			expect(onPick).toHaveBeenCalledOnce();
			expect(first).not.toBe(second);
		});

		it('keeps the labels, the values and the test ids of the rows', () => {
			const rows = toMenuRows(
				[{ title: 'Logs', href: '/logs' }, { title: 'Rename' }],
				'bc-item-1-menu',
				vi.fn(),
			);

			expect(rows).toMatchObject([
				{ type: 'link', value: '0', label: 'Logs', testId: 'bc-item-1-menu-item-0' },
				{ type: 'item', value: '1', label: 'Rename', testId: 'bc-item-1-menu-item-1' },
			]);
		});
	});
});
