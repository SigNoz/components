import { render, screen, waitFor } from '@testing-library/react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import type {
	ButtonGroupItemType,
	ButtonGroupJoinType,
	ButtonGroupVariantColorType,
	ButtonGroupVariantType,
} from '../types.js';
import { BASE, noop, renderInFrame, TOKENS, visibleMembers } from './button-group.test-utils.js';

/**
 * Real layout, so the margins and the corners are the ones the stylesheet draws. The frame holds
 * the tokens the members read, `--spacing-2` (4px) and `--spacing-4` (8px) for the gaps and
 * `--radius-1` (6px) for the corners.
 */
const RADIUS = '6px';

const PAIR_OF: Record<ButtonGroupVariantType, ButtonGroupVariantColorType> = {
	solid: { variant: 'solid', color: 'primary' },
	link: { variant: 'link', color: 'primary' },
	outlined: { variant: 'outlined', color: 'secondary' },
	dashed: { variant: 'dashed', color: 'secondary' },
	ghost: { variant: 'ghost', color: 'secondary' },
};

const MARGIN_OF: Record<ButtonGroupJoinType, string> = {
	shared: '0px',
	seam: '1px',
	gap: '4px',
	'wide-gap': '8px',
};

/**
 * The frame tokens plus a translucent outlined border, the way the dark theme draws it. Without the
 * token an outlined member has no border at all, and a border drawn once could not be told from two.
 */
const JOIN_TOKENS = {
	...TOKENS,
	'--button-secondary-outlined-border': 'rgb(255 255 255 / 13%)',
} as CSSProperties;

/** A text member drawn in the pair of `variant`. */
function member(value: string, variant: ButtonGroupVariantType): ButtonGroupItemType {
	return { value, label: value, onClick: noop, ...PAIR_OF[variant] };
}

function byValue(value: string): HTMLElement {
	return screen.getByTestId(`group-item-${value}`);
}

function corners(element: HTMLElement): {
	startStart: string;
	startEnd: string;
	endStart: string;
	endEnd: string;
} {
	const style = getComputedStyle(element);

	return {
		startStart: style.borderTopLeftRadius,
		endStart: style.borderBottomLeftRadius,
		startEnd: style.borderTopRightRadius,
		endEnd: style.borderBottomRightRadius,
	};
}

function renderRow(items: ButtonGroupItemType[], group: ButtonGroupVariantColorType = BASE): void {
	renderInFrame(<ButtonGroup {...group} size="md" items={items} testId="group" />, {
		size: 1200,
		style: JOIN_TOKENS,
	});
}

describe('ButtonGroup joins', () => {
	it('marks how every member meets its neighbours, none at the ends of the row', () => {
		renderRow([
			member('a', 'outlined'),
			member('b', 'outlined'),
			member('c', 'solid'),
			member('d', 'ghost'),
			member('e', 'link'),
		]);

		const joins = ['a', 'b', 'c', 'd', 'e'].map((value) => ({
			value,
			start: byValue(value).getAttribute('data-join-start'),
			end: byValue(value).getAttribute('data-join-end'),
			overflow: byValue(value).getAttribute('data-overflow-join'),
		}));

		expect(joins).toEqual([
			{ value: 'a', start: null, end: 'shared', overflow: 'shared' },
			{ value: 'b', start: 'shared', end: 'seam', overflow: 'shared' },
			// The ellipsis is outlined, like the group, so it meets a solid member at a seam.
			{ value: 'c', start: 'seam', end: 'gap', overflow: 'seam' },
			{ value: 'd', start: 'gap', end: 'wide-gap', overflow: 'gap' },
			{ value: 'e', start: 'wide-gap', end: null, overflow: 'wide-gap' },
		]);
	});

	it('spaces the members by the margin of their join', () => {
		renderRow([
			member('a', 'outlined'),
			member('b', 'outlined'),
			member('c', 'solid'),
			member('d', 'ghost'),
			member('e', 'link'),
		]);

		const values = ['a', 'b', 'c', 'd', 'e'];
		const margins = values.map((value) => getComputedStyle(byValue(value)).marginInlineStart);
		expect(margins).toEqual(['0px', '0px', '1px', '4px', '8px']);

		// The margin is what the layout shows: the gap between each member and the one before it.
		const gaps = values.slice(1).map((value, index) => {
			const previous = byValue(values[index] ?? '').getBoundingClientRect();
			return byValue(value).getBoundingClientRect().left - previous.right;
		});
		expect(gaps).toEqual([0, 1, 4, 8]);
	});

	it('squares the corners two flush members meet at and keeps every other corner', () => {
		renderRow([
			member('a', 'outlined'),
			member('b', 'outlined'),
			member('c', 'solid'),
			member('d', 'ghost'),
			member('e', 'link'),
		]);

		const round = {
			startStart: RADIUS,
			endStart: RADIUS,
			startEnd: RADIUS,
			endEnd: RADIUS,
		};
		const flushStart = { startStart: '0px', endStart: '0px' };
		const flushEnd = { startEnd: '0px', endEnd: '0px' };

		expect(corners(byValue('a'))).toEqual({ ...round, ...flushEnd });
		expect(corners(byValue('b'))).toEqual({ ...round, ...flushStart, ...flushEnd });
		expect(corners(byValue('c'))).toEqual({ ...round, ...flushStart });
		expect(corners(byValue('d'))).toEqual(round);
		expect(corners(byValue('e'))).toEqual(round);
	});

	it.each<[ButtonGroupVariantType, ButtonGroupVariantType, ButtonGroupJoinType]>([
		['outlined', 'outlined', 'shared'],
		['outlined', 'dashed', 'shared'],
		['dashed', 'outlined', 'shared'],
		['dashed', 'dashed', 'shared'],
		['solid', 'solid', 'seam'],
		['solid', 'outlined', 'seam'],
		['dashed', 'solid', 'seam'],
		['ghost', 'outlined', 'gap'],
		['solid', 'ghost', 'gap'],
		['ghost', 'dashed', 'gap'],
		['ghost', 'ghost', 'gap'],
		['link', 'solid', 'wide-gap'],
		['outlined', 'link', 'wide-gap'],
		['ghost', 'link', 'wide-gap'],
		['link', 'ghost', 'wide-gap'],
		['link', 'link', 'wide-gap'],
	])('joins %s then %s with a %s', (start, end, join) => {
		renderRow([member('first', start), member('second', end)]);

		const first = byValue('first');
		const second = byValue('second');
		expect(first).toHaveAttribute('data-join-end', join);
		expect(second).toHaveAttribute('data-join-start', join);
		expect(getComputedStyle(second).marginInlineStart).toBe(MARGIN_OF[join]);

		// The border is translucent, so a shared line is drawn by the first member alone: two borders
		// on top of each other paint it brighter than the outer edges.
		if (join === 'shared') {
			expect(getComputedStyle(first).borderInlineEndWidth).toBe('1px');
			expect(getComputedStyle(second).borderInlineStartWidth).toBe('0px');
			expect(getComputedStyle(second).borderInlineEndWidth).toBe('1px');
		}

		const flush = join === 'shared' || join === 'seam';
		expect(corners(first).startEnd).toBe(flush ? '0px' : RADIUS);
		expect(corners(first).endEnd).toBe(flush ? '0px' : RADIUS);
		expect(corners(second).startStart).toBe(flush ? '0px' : RADIUS);
		expect(corners(second).endStart).toBe(flush ? '0px' : RADIUS);
	});

	it('joins members the same way whatever their group pair is', () => {
		renderRow([{ value: 'a', label: 'a', onClick: noop }, member('b', 'ghost')], PAIR_OF.solid);

		expect(byValue('a')).toHaveAttribute('data-join-end', 'gap');
		expect(byValue('b')).toHaveAttribute('data-join-start', 'gap');
	});

	it('leaves a lone member with no join at all', () => {
		renderRow([member('only', 'outlined')]);

		const only = byValue('only');
		expect(only).not.toHaveAttribute('data-join-start');
		expect(only).not.toHaveAttribute('data-join-end');
		expect(getComputedStyle(only).marginInlineStart).toBe('0px');
		expect(corners(only)).toEqual({
			startStart: RADIUS,
			endStart: RADIUS,
			startEnd: RADIUS,
			endEnd: RADIUS,
		});
	});
});

describe('ButtonGroup vertical alignment', () => {
	it('centres a link member against its taller neighbours at md', () => {
		renderRow([member('before', 'outlined'), member('link', 'link'), member('after', 'solid')]);

		const before = byValue('before').getBoundingClientRect();
		const link = byValue('link').getBoundingClientRect();
		const after = byValue('after').getBoundingClientRect();

		// A link has no padding, so at md it keeps the height of sm and the row stays as tall as the
		// other members.
		expect(before.height).toBe(32);
		expect(after.height).toBe(32);
		expect(link.height).toBe(24);
		expect(link.top - before.top).toBe(4);
		expect(before.bottom - link.bottom).toBe(4);
		expect(after.top).toBe(before.top);
		expect(screen.getByTestId('group').getBoundingClientRect().height).toBe(32);
	});

	it('centres a link icon member too', () => {
		renderRow([
			member('before', 'outlined'),
			{
				value: 'docs',
				icon: <svg width={16} height={16} />,
				'aria-label': 'Docs',
				onClick: noop,
				...PAIR_OF.link,
			},
		]);

		const before = byValue('before').getBoundingClientRect();
		const link = byValue('docs').getBoundingClientRect();

		expect(link.top + link.height / 2).toBeCloseTo(before.top + before.height / 2, 1);
	});

	it('leaves members of one height level with each other', () => {
		renderRow([member('a', 'outlined'), member('b', 'ghost'), member('c', 'dashed')]);

		const tops = ['a', 'b', 'c'].map((value) => byValue(value).getBoundingClientRect().top);
		expect(new Set(tops).size).toBe(1);
	});

	it('keeps a link member level with the others at sm, where every member is 24px', () => {
		renderInFrame(
			<ButtonGroup
				{...BASE}
				size="sm"
				items={[member('before', 'outlined'), member('link', 'link')]}
				testId="group"
			/>,
			{ size: 1200, style: TOKENS },
		);

		const before = byValue('before').getBoundingClientRect();
		const link = byValue('link').getBoundingClientRect();

		expect(link.height).toBe(24);
		expect(link.top).toBe(before.top);
	});
});

describe('ButtonGroup dashed members', () => {
	function dashedBorder(element: HTMLElement): HTMLElement {
		const border = element.querySelector<HTMLElement>('[data-slot="button-dashed-border"]');

		if (!border) {
			throw new Error('No dashed border rendered');
		}

		return border;
	}

	it('draws a dashed CSS border, not the SVG outline, when joined flush', () => {
		renderRow([member('a', 'dashed'), member('b', 'dashed')], PAIR_OF.dashed);

		for (const value of ['a', 'b']) {
			expect(getComputedStyle(byValue(value)).borderTopStyle).toBe('dashed');
			expect(getComputedStyle(dashedBorder(byValue(value))).display).toBe('none');
		}
	});

	it('draws it for a dashed member that is flush on one side only', () => {
		renderRow([member('a', 'ghost'), member('b', 'dashed'), member('c', 'dashed')]);

		// `b` is 4px away from the ghost member and shares a hairline with `c`.
		expect(byValue('b')).toHaveAttribute('data-join-start', 'gap');
		expect(byValue('b')).toHaveAttribute('data-join-end', 'shared');
		expect(getComputedStyle(byValue('b')).borderTopStyle).toBe('dashed');
		expect(getComputedStyle(dashedBorder(byValue('b'))).display).toBe('none');
	});

	it('draws it next to a solid member, which meets it at a seam', () => {
		renderRow([member('a', 'solid'), member('b', 'dashed')]);

		expect(getComputedStyle(byValue('b')).borderTopStyle).toBe('dashed');
		expect(getComputedStyle(dashedBorder(byValue('b'))).display).toBe('none');
	});

	it.each<ButtonGroupVariantType>(['ghost', 'link'])(
		'keeps the SVG outline of a dashed member next to a %s one',
		(neighbour) => {
			renderRow([member('a', 'dashed'), member('b', neighbour), member('c', 'dashed')]);

			for (const value of ['a', 'c']) {
				expect(getComputedStyle(byValue(value)).borderTopStyle).toBe('solid');
				expect(getComputedStyle(dashedBorder(byValue(value))).display).not.toBe('none');
			}
		},
	);

	it('keeps the SVG outline of a lone dashed member', () => {
		renderRow([member('only', 'dashed')], PAIR_OF.dashed);

		expect(getComputedStyle(byValue('only')).borderTopStyle).toBe('solid');
		expect(getComputedStyle(dashedBorder(byValue('only'))).display).not.toBe('none');
	});
});

function Frame({ width, children }: { width: number; children: ReactNode }): ReactElement {
	return <div style={{ width, ...JOIN_TOKENS }}>{children}</div>;
}

/**
 * The row at the width where `count` members and the ellipsis fit exactly, and one pixel short of
 * it, for every count. `joins[count - 1]` is how the ellipsis is expected to meet the last of those
 * members.
 */
async function expectCollapseAt(
	items: ButtonGroupItemType[],
	group: ButtonGroupVariantColorType,
	joins: ButtonGroupJoinType[],
): Promise<void> {
	const ui = <ButtonGroup {...group} size="md" items={items} testId="group" />;
	const view = render(<Frame width={2000}>{ui}</Frame>);

	await waitFor(() => expect(visibleMembers()).toHaveLength(items.length));

	const root = screen.getByTestId('group');
	const left = root.getBoundingClientRect().left;
	const rights = visibleMembers().map((button) => button.getBoundingClientRect().right - left);
	const ellipsis = root.querySelector<HTMLElement>('[data-slot="button-group-measure-overflow"]');
	const ellipsisWidth = ellipsis?.getBoundingClientRect().width ?? 0;
	expect(ellipsisWidth).toBeGreaterThan(0);

	for (let count = items.length - 1; count > 0; count--) {
		const join = joins[count - 1] ?? 'seam';
		const fits = (rights[count - 1] ?? 0) + Number.parseFloat(MARGIN_OF[join]) + ellipsisWidth;

		view.rerender(<Frame width={fits}>{ui}</Frame>);
		await waitFor(() => expect(visibleMembers()).toHaveLength(count));

		const overflow = screen.getByTestId('group-overflow');
		const last = visibleMembers().at(-1) as HTMLElement;
		const flush = join === 'shared' || join === 'seam';
		expect(overflow).toHaveAttribute('data-join-start', join);
		expect(getComputedStyle(overflow).marginInlineStart).toBe(MARGIN_OF[join]);
		if (join === 'shared') {
			expect(getComputedStyle(overflow).borderInlineStartWidth).toBe('0px');
		}
		expect(corners(overflow).startStart).toBe(flush ? '0px' : RADIUS);
		expect(corners(last).startEnd).toBe(flush ? '0px' : RADIUS);
		expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(fits + 0.5);

		view.rerender(<Frame width={fits - 1}>{ui}</Frame>);
		await waitFor(() => expect(visibleMembers()).toHaveLength(count - 1));
	}
}

describe('ButtonGroup overflow with mixed variants', () => {
	const labels = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];

	it('takes the margin of the ellipsis after a ghost member, and after an outlined one', async () => {
		await expectCollapseAt(
			labels.map((value, index) => member(value, index === 1 ? 'ghost' : 'outlined')),
			BASE,
			// The ellipsis is outlined: it shares the border of an outlined member and sits 4px from a
			// ghost one.
			['shared', 'gap', 'shared', 'shared'],
		);
	});

	it('takes the margin of the ellipsis after a link member, and after a solid one', async () => {
		await expectCollapseAt(
			labels.map((value, index) => member(value, index === 1 ? 'link' : 'solid')),
			PAIR_OF.solid,
			// A solid ellipsis meets a solid member at a seam and sits 8px from a link one.
			['seam', 'wide-gap', 'seam', 'seam'],
		);
	});

	it('sits 4px from every member of a ghost group, and shares a hairline after an outlined one', async () => {
		await expectCollapseAt(
			labels.map((value, index) => member(value, index === 2 ? 'outlined' : 'ghost')),
			PAIR_OF.ghost,
			['gap', 'gap', 'gap', 'gap'],
		);
	});
});
