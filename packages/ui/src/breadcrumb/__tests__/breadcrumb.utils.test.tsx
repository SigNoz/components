import { Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
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
	getPosition,
	getRowRender,
	getShrink,
	getTrailWidth,
	hasMenu,
	hasTitle,
	isLink,
	resolveItems,
	toCollapsedRow,
	toMenuRows,
} from '../utils.js';
import { noop, RouterLink } from './breadcrumb.test-utils.js';

/** Five 100px crumbs, 10px separators, a 30px `...` crumb and no gap. */
function measureOf(overrides: Partial<BreadcrumbTrailMeasure> = {}): BreadcrumbTrailMeasure {
	return {
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

	it('collapses nothing for a trail that is not wider than the room, measured with a gap', () => {
		const measure = measureOf({ gap: 5 });

		expect(countCollapsed({ ...measure, available: 580 }, 0, 0)).toBe(0);
		expect(countCollapsed({ ...measure, available: 579 }, 0, 0)).toBe(1);
	});
});

describe('toCollapsedRow', () => {
	it('builds a link row for a crumb with an href, rendered as an anchor', () => {
		const onClick = vi.fn();
		const { entry } = resolveOne({ title: 'Payments', href: '/payments', onClick });
		const row = toCollapsedRow(entry);

		expect(row).toMatchObject({
			type: 'link',
			value: '0',
			label: 'Payments',
			testId: 'bc-item-0',
		});

		const render = renderOf(row);
		expect(render.type).toBe('a');
		expect(render.props).toMatchObject({ href: '/payments', onClick });
		expect(row).not.toHaveProperty('onClick');
	});

	it('numbers the row after the crumb index in items, not its place in the trail', () => {
		const { entry } = resolveOne(
			{ title: 'C', href: '/c' },
			{ before: [{ title: 'A' }, { title: '' }, { title: 'B' }] },
		);

		expect(entry.index).toBe(3);
		expect(toCollapsedRow(entry)).toMatchObject({
			value: '3',
			testId: 'bc-item-3',
		});
	});

	it('builds an action row for a crumb with only an onClick', () => {
		const onClick = vi.fn();
		const { entry } = resolveOne({ title: 'Reports', onClick });

		expect(toCollapsedRow(entry)).toEqual({
			type: 'item',
			value: '0',
			label: 'Reports',
			testId: 'bc-item-0',
			onClick,
		});
	});

	it('builds a row with no handler for a crumb that does nothing', () => {
		const { entry } = resolveOne({ title: 'Reports' });
		const row = toCollapsedRow(entry);

		expect(row).toEqual({ type: 'item', value: '0', label: 'Reports', testId: 'bc-item-0' });
		expect(row).not.toHaveProperty('onClick');
	});

	it('names no test id without a testId', () => {
		const link = resolveOne({ title: 'Reports', href: '/r' }, { testId: null });
		const action = resolveOne({ title: 'Reports' }, { testId: null });

		expect(toCollapsedRow(link.entry)).not.toHaveProperty('testId');
		expect(toCollapsedRow(action.entry)).not.toHaveProperty('testId');
	});

	it('keeps a node title as the label', () => {
		const title = <b>Reports</b>;
		const { entry } = resolveOne({ title, href: '/r' });

		expect(toCollapsedRow(entry)).toMatchObject({ label: title });
	});

	describe('with a menu', () => {
		const MENU = [
			{ title: 'Checkout', href: '/services/checkout' },
			{ title: 'Rename', onClick: noop },
		];

		it('builds a submenu row of the entries of the menu', () => {
			const { entry } = resolveOne({ title: 'Services', menu: MENU });
			const row = toCollapsedRow(entry);

			expect(row).toMatchObject({
				type: 'submenu',
				value: '0',
				label: 'Services',
				testId: 'bc-item-0',
			});
			expect((row as { items: unknown[] }).items).toEqual(toMenuRows(MENU, 'bc-item-0-menu'));
		});

		it('names the entries after the menu the crumb has while it is visible', () => {
			const { entry } = resolveOne(
				{ title: 'Services', menu: MENU },
				{ before: [{ title: 'Home' }] },
			);
			const row = toCollapsedRow(entry) as {
				items: { type: string; label: ReactNode; testId?: string }[];
			};

			expect(row.items.map(({ type, label, testId }) => ({ type, label, testId }))).toEqual([
				{ type: 'link', label: 'Checkout', testId: 'bc-item-1-menu-item-0' },
				{ type: 'item', label: 'Rename', testId: 'bc-item-1-menu-item-1' },
			]);
		});

		it('gives two collapsed crumbs entries that do not share a test id', () => {
			const first = resolveOne({ title: 'A', menu: [{ title: 'One' }] });
			const second = resolveOne(
				{ title: 'B', menu: [{ title: 'One' }] },
				{ before: [{ title: 'A' }] },
			);
			const ids = [first, second].flatMap(({ entry }) =>
				(toCollapsedRow(entry) as { items: { testId?: string }[] }).items.map(
					({ testId }) => testId,
				),
			);

			expect(ids).toEqual(['bc-item-0-menu-item-0', 'bc-item-1-menu-item-0']);
		});

		it('lets the menu win over the href and the onClick of the crumb, as it does while visible', () => {
			const { entry } = resolveOne({
				title: 'Services',
				href: '/services',
				onClick: vi.fn(),
				menu: MENU,
			});
			const row = toCollapsedRow(entry);

			expect(row).toMatchObject({ type: 'submenu' });
			expect(row).not.toHaveProperty('render');
			expect(row).not.toHaveProperty('onClick');
		});

		it('names no test id without a testId', () => {
			const { entry } = resolveOne({ title: 'Services', menu: MENU }, { testId: null });
			const row = toCollapsedRow(entry) as { items: object[] };

			expect(row).not.toHaveProperty('testId');
			for (const entryRow of row.items) {
				expect(entryRow).not.toHaveProperty('testId');
			}
		});

		it('falls back to the href while the menu is empty, as the visible crumb does', () => {
			const { entry } = resolveOne({ title: 'Services', href: '/services', menu: [] });

			expect(toCollapsedRow(entry)).toMatchObject({ type: 'link' });
		});

		it('falls back to the render while the menu is empty, as the visible crumb does', () => {
			const { entry } = resolveOne({
				title: 'Services',
				render: <RouterLink to="/services" />,
				menu: [],
			});

			expect(toCollapsedRow(entry)).toMatchObject({ type: 'link' });
		});

		it('lets the menu win over the render of the crumb, as it does while visible', () => {
			const { entry } = resolveOne({
				title: 'Services',
				render: <RouterLink to="/services" />,
				menu: MENU,
			});

			expect(toCollapsedRow(entry)).toMatchObject({ type: 'submenu' });
			expect(toCollapsedRow(entry)).not.toHaveProperty('render');
		});

		it('builds the rows of a menu entry with a render as link rows', () => {
			const { entry } = resolveOne({
				title: 'Services',
				menu: [{ title: 'Checkout', render: <RouterLink to="/services/checkout" /> }],
			});
			const [checkout] = (toCollapsedRow(entry) as { items: unknown[] }).items;

			expect(checkout).toMatchObject({ type: 'link', label: 'Checkout' });
			expect(renderOf(checkout).type).toBe(RouterLink);
			expect(renderOf(checkout).props).toEqual({ to: '/services/checkout' });
		});
	});

	describe('with a render', () => {
		it('renders the row with the element, without its children', () => {
			const { entry } = resolveOne({
				title: 'Payments',
				render: <RouterLink to="/payments">Not the label</RouterLink>,
			});
			const row = toCollapsedRow(entry);
			const render = renderOf(row);

			expect(row).toMatchObject({ type: 'link', label: 'Payments', testId: 'bc-item-0' });
			expect(render.type).toBe(RouterLink);
			expect(render.props).toEqual({ to: '/payments' });
		});

		it('keeps every other prop and the key of the element', () => {
			const { entry } = resolveOne({
				title: 'Payments',
				render: <RouterLink key="stable" to="/real" data-extra="1" className="track" />,
			});
			const render = renderOf(toCollapsedRow(entry));

			expect(render.key).toBe('stable');
			expect(render.props).toEqual({ to: '/real', 'data-extra': '1', className: 'track' });
		});

		it('is a link row even when the crumb has no href', () => {
			const { entry } = resolveOne({ title: 'Payments', render: <RouterLink to="/payments" /> });

			expect(toCollapsedRow(entry)).toMatchObject({ type: 'link' });
			expect(toCollapsedRow(entry)).not.toHaveProperty('onClick');
		});

		it('takes the href and the target of the crumb the element leaves unset', () => {
			const { entry } = resolveOne({
				title: 'Payments',
				href: '/from-item',
				target: '_blank',
				render: <RouterLink href={undefined} />,
			});

			expect(renderOf(toCollapsedRow(entry)).props).toMatchObject({
				href: '/from-item',
				target: '_blank',
				rel: 'noopener noreferrer',
			});
		});

		it('prefers the href of the element to the one of the crumb', () => {
			const { entry } = resolveOne({
				title: 'Payments',
				href: '/from-item',
				render: <RouterLink href="/from-render" />,
			});

			expect(renderOf(toCollapsedRow(entry)).props).toMatchObject({ href: '/from-render' });
		});

		it('chains the onClick of the crumb after the one of the element', () => {
			const order: string[] = [];
			const { entry } = resolveOne({
				title: 'Payments',
				render: <RouterLink to="/payments" onClick={() => order.push('element')} />,
				onClick: () => order.push('crumb'),
			});
			const { onClick } = renderOf(toCollapsedRow(entry)).props as { onClick: () => void };

			onClick();

			expect(order).toEqual(['element', 'crumb']);
		});

		it('falls back to an action row for a crumb with only an onClick', () => {
			const onClick = vi.fn();
			const { entry } = resolveOne({ title: 'Payments', onClick });

			expect(toCollapsedRow(entry)).toEqual({
				type: 'item',
				value: '0',
				label: 'Payments',
				testId: 'bc-item-0',
				onClick,
			});
		});
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
});
