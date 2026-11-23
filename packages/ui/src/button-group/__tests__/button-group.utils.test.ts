import { createElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import type { DropdownSubmenuChildType } from '../../dropdown/types.js';
import { BUTTON_GROUP_EMPTY_LABEL } from '../constants.js';
import type {
	ButtonGroupItemMenuType,
	ButtonGroupItemType,
	ButtonGroupJoinType,
	ButtonGroupResolvedItem,
	ButtonGroupState,
	ButtonGroupVariantColorType,
	ButtonGroupVariantType,
} from '../types.js';
import {
	countVisibleMembers,
	getJoin,
	getMemberJoins,
	getPosition,
	isFlushJoin,
	resolveItem,
	toMenuRow,
} from '../utils.js';

const noop = (): void => {};

function svg(): ReactElement {
	return createElement('svg');
}

function anchor(props: Record<string, unknown>, ...children: string[]): ReactElement {
	return createElement('a', props, ...children);
}

const GROUP_LOOK: ButtonGroupVariantColorType = { variant: 'outlined', color: 'secondary' };

function state(overrides: Partial<ButtonGroupState> = {}): ButtonGroupState {
	return {
		look: GROUP_LOOK,
		size: 'md',
		textOverflow: 'ellipsis',
		disabled: false,
		loading: false,
		testId: undefined,
		disabledTooltip: undefined,
		loadingTooltip: undefined,
		...overrides,
	};
}

const DAY = { value: 'day', label: 'Day', onClick: noop } as const satisfies ButtonGroupItemType;

describe('getJoin', () => {
	it.each<[ButtonGroupVariantType, ButtonGroupVariantType, ButtonGroupJoinType]>([
		['outlined', 'outlined', 'shared'],
		['outlined', 'dashed', 'shared'],
		['dashed', 'dashed', 'shared'],
		['solid', 'solid', 'seam'],
		['solid', 'outlined', 'seam'],
		['solid', 'dashed', 'seam'],
		['ghost', 'solid', 'gap'],
		['ghost', 'outlined', 'gap'],
		['ghost', 'dashed', 'gap'],
		['ghost', 'ghost', 'gap'],
		['link', 'solid', 'wide-gap'],
		['link', 'outlined', 'wide-gap'],
		['link', 'dashed', 'wide-gap'],
		['link', 'ghost', 'wide-gap'],
		['link', 'link', 'wide-gap'],
	])('joins %s and %s with a %s, in either order', (first, second, join) => {
		expect(getJoin(first, second)).toBe(join);
		expect(getJoin(second, first)).toBe(join);
	});
});

describe('isFlushJoin', () => {
	it('squares the corners of a shared border and a seam only', () => {
		expect(isFlushJoin('shared')).toBe(true);
		expect(isFlushJoin('seam')).toBe(true);
		expect(isFlushJoin('gap')).toBe(false);
		expect(isFlushJoin('wide-gap')).toBe(false);
		expect(isFlushJoin(undefined)).toBe(false);
	});
});

describe('getPosition', () => {
	it('names where a member sits in the row', () => {
		expect(getPosition(0, 1)).toBe('only');
		expect(getPosition(0, 3)).toBe('start');
		expect(getPosition(1, 3)).toBe('middle');
		expect(getPosition(2, 3)).toBe('end');
	});
});

describe('resolveItem', () => {
	it('drops the props the group owns from the ones forwarded to the button', () => {
		const item = {
			...DAY,
			size: 'sm',
			children: 'Other',
			className: 'x',
			style: { color: 'red' },
			id: 'day',
		} as unknown as ButtonGroupItemType;

		expect(resolveItem(item, state()).buttonProps).toEqual({ id: 'day' });
	});

	it('takes the group look when the item sets no pair', () => {
		expect(resolveItem(DAY, state()).look).toBe(GROUP_LOOK);
	});

	it('takes the pair of an item that sets one, and nothing else of the item', () => {
		const resolved = resolveItem(
			{
				...DAY,
				variant: 'solid',
				color: 'danger',
				prefix: svg(),
				testId: 'own',
				'data-owner': 'alerts',
			},
			state(),
		);

		expect(resolved.look).toEqual({ variant: 'solid', color: 'danger' });
		expect(Object.keys(resolved.look).sort()).toEqual(['color', 'variant']);
	});

	it('keeps noLoadingEffect with the pair of a ghost item, and only when it is set', () => {
		const set = resolveItem(
			{ ...DAY, variant: 'ghost', color: 'secondary', noLoadingEffect: true },
			state(),
		);
		const unset = resolveItem({ ...DAY, variant: 'ghost', color: 'secondary' }, state());

		expect(set.look).toEqual({ variant: 'ghost', color: 'secondary', noLoadingEffect: true });
		expect(unset.look).toEqual({ variant: 'ghost', color: 'secondary' });
	});

	it('hands the button the props the group does not read, and keeps the rest back', () => {
		const onDoubleClick = noop;
		const resolved = resolveItem(
			{
				...DAY,
				prefix: svg(),
				suffix: svg(),
				testId: 'own',
				variant: 'solid',
				color: 'primary',
				onDoubleClick,
				type: 'submit',
				textOverflow: 'hidden',
				width: 120,
				'aria-describedby': 'hint',
				'data-owner': 'alerts',
			},
			state(),
		);

		expect(resolved.buttonProps).toEqual({
			onDoubleClick,
			type: 'submit',
			textOverflow: 'hidden',
			width: 120,
			'aria-describedby': 'hint',
			'data-owner': 'alerts',
		});
	});

	it('names the member after the group and its value, unless it has a testId', () => {
		expect(resolveItem(DAY, state()).testId).toBeUndefined();
		expect(resolveItem(DAY, state({ testId: 'range' })).testId).toBe('range-item-day');
		expect(resolveItem({ ...DAY, testId: 'own' }, state({ testId: 'range' })).testId).toBe('own');
	});

	it('falls back to <No label> for a label that renders nothing, and an icon has none', () => {
		const empty = resolveItem({ ...DAY, label: '' }, state());
		expect(empty.emptyLabel).toBe(true);
		expect(empty.label).toBe(BUTTON_GROUP_EMPTY_LABEL);
		expect(empty.menuLabel).toBe(BUTTON_GROUP_EMPTY_LABEL);

		const icon = resolveItem(
			{ value: 'next', icon: svg(), 'aria-label': 'Next', onClick: noop },
			state(),
		);
		expect(icon.emptyLabel).toBe(false);
		expect(icon.label).toBeUndefined();
		expect(icon.menuLabel).toBe('Next');
	});

	it('blocks the member for the group, for itself and while loading', () => {
		expect(resolveItem(DAY, state()).disabled).toBe(false);
		expect(resolveItem(DAY, state({ disabled: true })).disabled).toBe(true);
		expect(resolveItem({ ...DAY, disabled: true, disabledTooltip: 'Nope' }, state()).disabled).toBe(
			true,
		);

		const loading = resolveItem({ ...DAY, loading: true, loadingTooltip: undefined }, state());
		expect(loading.loading).toBe(true);
		expect(loading.disabled).toBe(true);
		expect(resolveItem(DAY, state({ loading: true })).loading).toBe(true);
	});

	it('stacks the group reason above the member reason, and the loading ones when loading', () => {
		const group = state({
			disabled: true,
			disabledTooltip: 'Read only',
			loadingTooltip: 'Saving',
		});
		const item = { ...DAY, disabled: true, disabledTooltip: 'Nope' } as const;

		expect(resolveItem(item, group).reasons.map((reason) => reason.id)).toEqual([
			'group-disabled-tooltip',
			'disabled-tooltip',
		]);

		// The disabled reasons give way to the loading ones.
		expect(
			resolveItem(item, { ...group, loading: true }).reasons.map((reason) => reason.id),
		).toEqual(['group-loading-tooltip']);
	});

	it('drops the children of the element it renders', () => {
		const resolved = resolveItem(
			{ value: 'docs', label: 'Docs', render: anchor({ href: '/docs' }, 'Docs') },
			state(),
		);

		expect(resolved.render?.props).toEqual({ href: '/docs' });
	});
});

describe('resolveItem with a menu', () => {
	const rows: DropdownSubmenuChildType[] = [
		{ type: 'item', value: 'overview', label: 'Overview', onClick: noop },
	];
	const menu: ButtonGroupItemMenuType = { side: 'bottom', align: 'end', items: rows };
	const section: ButtonGroupItemType = {
		value: 'section',
		icon: svg(),
		'aria-label': 'Choose section',
		menu,
	};

	it('hands the menu over as it is, and keeps it out of the props forwarded to the button', () => {
		const resolved = resolveItem(section, state());

		expect(resolved.menu).toBe(menu);
		expect(resolved.buttonProps).toEqual({ 'aria-label': 'Choose section' });
		expect(resolveItem(DAY, state()).menu).toBeUndefined();
	});
});

function resolveAll(variants: ButtonGroupVariantType[]): ButtonGroupResolvedItem[] {
	return variants.map((variant, index) =>
		resolveItem(
			{
				value: `m${index}`,
				label: `M${index}`,
				onClick: noop,
				variant,
				color: variant === 'solid' || variant === 'link' ? 'primary' : 'secondary',
			} as ButtonGroupItemType,
			state(),
		),
	);
}

describe('getMemberJoins', () => {
	it('joins every member with the one before it and the one after it', () => {
		const { members, overflow } = getMemberJoins(
			resolveAll(['outlined', 'solid', 'ghost', 'link']),
			4,
			'outlined',
		);

		expect(members.map(({ start, end }) => [start, end])).toEqual([
			[undefined, 'seam'],
			['seam', 'gap'],
			['gap', 'wide-gap'],
			['wide-gap', undefined],
		]);
		expect(overflow).toBeUndefined();
	});

	it('ends the last visible member against the ellipsis, in the group variant', () => {
		const { members, overflow } = getMemberJoins(
			resolveAll(['outlined', 'solid', 'ghost', 'link']),
			2,
			'outlined',
		);

		// The solid member meets an outlined ellipsis at a seam, not the ghost member after it.
		expect(members[1]?.end).toBe('seam');
		expect(overflow).toBe('seam');
	});

	it('keeps the margin a collapsed member would have in the row', () => {
		const { members } = getMemberJoins(
			resolveAll(['outlined', 'solid', 'ghost', 'link']),
			2,
			'outlined',
		);

		expect(members[2]?.start).toBe('gap');
		expect(members[3]?.start).toBe('wide-gap');
	});

	it('tells how the ellipsis would meet every member', () => {
		const { members } = getMemberJoins(
			resolveAll(['outlined', 'solid', 'ghost', 'link']),
			4,
			'outlined',
		);

		expect(members.map(({ overflow }) => overflow)).toEqual(['shared', 'seam', 'gap', 'wide-gap']);
	});

	it('has no join for the ellipsis when no member is visible', () => {
		const { members, overflow } = getMemberJoins(resolveAll(['outlined', 'solid']), 0, 'outlined');

		expect(overflow).toBeUndefined();
		expect(members.map(({ start }) => start)).toEqual([undefined, 'seam']);
	});
});

describe('getMemberJoins with a prefix and a suffix', () => {
	const BOTH = { prefix: true, suffix: true };

	it('has no slot join, and no suffix join on a member, without slots', () => {
		const joins = getMemberJoins(resolveAll(['outlined', 'solid']), 2, 'outlined');

		expect(joins.prefix).toBeUndefined();
		expect(joins.suffix).toBeUndefined();
		expect(joins.overflowEnd).toBeUndefined();
		expect(joins.members.map(({ suffix }) => suffix)).toEqual([undefined, undefined]);
		expect(joins.members[0]?.start).toBeUndefined();
		expect(joins.members[1]?.end).toBeUndefined();
	});

	it('meets the prefix at the start of the first member and the suffix at the end of the last', () => {
		const { members, prefix, suffix, overflow, overflowEnd } = getMemberJoins(
			resolveAll(['outlined', 'outlined', 'outlined']),
			3,
			'outlined',
			BOTH,
		);

		expect(members.map(({ start, end }) => [start, end])).toEqual([
			['shared', 'shared'],
			['shared', 'shared'],
			['shared', 'shared'],
		]);
		expect(prefix).toBe('shared');
		expect(suffix).toBe('shared');
		expect(overflow).toBeUndefined();
		expect(overflowEnd).toBeUndefined();
	});

	it.each<[ButtonGroupVariantType, ButtonGroupJoinType]>([
		['outlined', 'shared'],
		['dashed', 'shared'],
		['solid', 'seam'],
		['ghost', 'gap'],
		['link', 'wide-gap'],
	])('%s group: the slots meet the members with a %s join', (variant, join) => {
		const joins = getMemberJoins(resolveAll([variant, variant]), 2, variant, BOTH);

		expect(joins.prefix).toBe(join);
		expect(joins.suffix).toBe(join);
		expect(joins.members[0]?.start).toBe(join);
		expect(joins.members[1]?.end).toBe(join);
	});

	it('joins a slot to the variant of the member next to it, not to the group', () => {
		const { members, prefix, suffix } = getMemberJoins(
			resolveAll(['solid', 'outlined', 'ghost']),
			3,
			'outlined',
			BOTH,
		);

		// The group is outlined, so an outlined slot meets a solid member at a seam and a ghost one
		// at a gap.
		expect(prefix).toBe('seam');
		expect(members[0]?.start).toBe('seam');
		expect(suffix).toBe('gap');
		expect(members[2]?.end).toBe('gap');
	});

	it('takes only the slot there is', () => {
		const prefixOnly = getMemberJoins(resolveAll(['solid', 'solid']), 2, 'solid', {
			prefix: true,
			suffix: false,
		});

		expect(prefixOnly.prefix).toBe('seam');
		expect(prefixOnly.suffix).toBeUndefined();
		expect(prefixOnly.members[0]?.start).toBe('seam');
		expect(prefixOnly.members[1]?.end).toBeUndefined();

		const suffixOnly = getMemberJoins(resolveAll(['solid', 'solid']), 2, 'solid', {
			prefix: false,
			suffix: true,
		});

		expect(suffixOnly.prefix).toBeUndefined();
		expect(suffixOnly.suffix).toBe('seam');
		expect(suffixOnly.members[0]?.start).toBeUndefined();
		expect(suffixOnly.members[1]?.end).toBe('seam');
	});

	it('tells how the suffix would meet every member, whichever of them ends the row', () => {
		const { members } = getMemberJoins(
			resolveAll(['outlined', 'solid', 'ghost', 'link']),
			1,
			'outlined',
			{ prefix: false, suffix: true },
		);

		expect(members.map(({ suffix }) => suffix)).toEqual(['shared', 'seam', 'gap', 'wide-gap']);
	});

	it('ends the last visible member against the ellipsis, and the ellipsis against the suffix', () => {
		const { members, overflow, overflowEnd, suffix } = getMemberJoins(
			resolveAll(['solid', 'solid', 'ghost', 'link']),
			2,
			'outlined',
			BOTH,
		);

		// The ellipsis is outlined: a seam against the solid member before it, shared with an outlined
		// suffix. The ghost member that would have followed is collapsed, and has no say.
		expect(members[1]?.end).toBe('seam');
		expect(overflow).toBe('seam');
		expect(overflowEnd).toBe('shared');
		expect(suffix).toBe('shared');
	});

	it.each<[ButtonGroupVariantType, ButtonGroupJoinType]>([
		['outlined', 'shared'],
		['solid', 'seam'],
		['ghost', 'gap'],
		['link', 'wide-gap'],
	])('%s group: the ellipsis meets the suffix with a %s join', (variant, join) => {
		const { overflowEnd, suffix } = getMemberJoins(
			resolveAll([variant, variant, variant]),
			1,
			variant,
			{ prefix: false, suffix: true },
		);

		expect(overflowEnd).toBe(join);
		expect(suffix).toBe(join);
	});

	it('has no join between the ellipsis and the end of the row without a suffix', () => {
		const { overflowEnd, suffix, members } = getMemberJoins(
			resolveAll(['outlined', 'outlined', 'outlined']),
			1,
			'outlined',
			{ prefix: true, suffix: false },
		);

		expect(overflowEnd).toBeUndefined();
		expect(suffix).toBeUndefined();
		expect(members[0]?.end).toBe('shared');
	});

	it('puts the ellipsis between the slots when no member is visible', () => {
		const joins = getMemberJoins(resolveAll(['solid', 'solid']), 0, 'solid', BOTH);

		expect(joins.prefix).toBe('seam');
		expect(joins.overflow).toBe('seam');
		expect(joins.overflowEnd).toBe('seam');
		expect(joins.suffix).toBe('seam');
	});

	it('puts the ellipsis against the prefix alone when no member is visible and there is no suffix', () => {
		const joins = getMemberJoins(resolveAll(['solid', 'solid']), 0, 'ghost', {
			prefix: true,
			suffix: false,
		});

		expect(joins.prefix).toBe('gap');
		expect(joins.overflow).toBe('gap');
		expect(joins.overflowEnd).toBeUndefined();
		expect(joins.suffix).toBeUndefined();
	});

	it('puts the ellipsis against the suffix alone when no member is visible and there is no prefix', () => {
		const joins = getMemberJoins(resolveAll(['solid', 'solid']), 0, 'link', {
			prefix: false,
			suffix: true,
		});

		expect(joins.prefix).toBeUndefined();
		expect(joins.overflow).toBeUndefined();
		expect(joins.overflowEnd).toBe('wide-gap');
		expect(joins.suffix).toBe('wide-gap');
	});

	it('keeps the margin a collapsed first member would have against the prefix', () => {
		const { members } = getMemberJoins(resolveAll(['ghost', 'solid']), 0, 'outlined', BOTH);

		expect(members[0]?.start).toBe('gap');
		expect(members[1]?.start).toBe('gap');
	});
});

describe('toMenuRow', () => {
	it('turns a member into an action row with its label and onClick', () => {
		const onClick = noop;
		const row = toMenuRow(
			resolveItem({ value: 'day', label: 'Day', onClick }, state({ testId: 'g' })),
		);

		expect(row).toEqual({
			type: 'item',
			value: 'day',
			label: 'Day',
			testId: 'g-item-day',
			onClick,
		});
	});

	it.each(['danger', 'highlight-danger'] as const)('marks a %s member as a danger row', (color) => {
		const row = toMenuRow(resolveItem(DAY, state({ look: { variant: 'solid', color } })));

		expect(row).toMatchObject({ type: 'item', danger: true });
	});

	it('keeps a danger link member a plain link row, a link row has no danger treatment', () => {
		const row = toMenuRow(
			resolveItem(
				{ value: 'docs', label: 'Docs', render: createElement('a', { href: '/docs' }) },
				state({ look: { variant: 'solid', color: 'danger' } }),
			),
		);

		expect(row).toMatchObject({ type: 'link' });
		expect(row).not.toHaveProperty('danger');
	});

	it('marks the row after the pair of the member, not of the group', () => {
		const inDangerGroup = toMenuRow(
			resolveItem(DAY, state({ look: { variant: 'solid', color: 'danger' } })),
		);
		const ownPair = toMenuRow(
			resolveItem(
				{ ...DAY, variant: 'solid', color: 'primary' },
				state({ look: { variant: 'solid', color: 'danger' } }),
			),
		);

		expect(inDangerGroup).toMatchObject({ danger: true });
		expect(ownPair).not.toHaveProperty('danger');
	});

	it('leaves the danger flag off for every other color', () => {
		for (const color of [
			'primary',
			'secondary',
			'warning',
			'success',
			'info',
			'archive',
		] as const) {
			const row = toMenuRow(resolveItem(DAY, state({ look: { variant: 'solid', color } })));

			expect(row, color).not.toHaveProperty('danger');
		}
	});

	it('turns a link member into a link row', () => {
		const row = toMenuRow(
			resolveItem({ value: 'docs', label: 'Docs', render: anchor({ href: '/docs' }) }, state()),
		);

		expect(row).toMatchObject({ type: 'link', value: 'docs', label: 'Docs' });
		expect(row).not.toHaveProperty('onClick');
	});

	it('shows a blocked member as a disabled row, and a loading one as a loading row', () => {
		const disabled = toMenuRow(resolveItem(DAY, state({ disabled: true })));
		expect(disabled).toMatchObject({ disabled: true });
		expect(disabled).not.toHaveProperty('loading');

		const loading = toMenuRow(resolveItem(DAY, state({ loading: true })));
		expect(loading).toMatchObject({ loading: true });
		expect(loading).not.toHaveProperty('disabled');
	});

	it('names the row of an icon member after its aria-label', () => {
		const row = toMenuRow(
			resolveItem(
				{ value: 'next', icon: svg(), 'aria-label': 'Next page', onClick: noop },
				state(),
			),
		);

		expect(row).toMatchObject({ label: 'Next page' });
	});
});

describe('toMenuRow for a member with a menu', () => {
	const items = [
		{ type: 'item', value: 'overview', label: 'Overview', onClick: noop },
	] satisfies DropdownSubmenuChildType[];
	const menu = { side: 'bottom', align: 'end', items } as const;

	it('turns a member with a menu into a submenu row holding the same rows', () => {
		const row = toMenuRow(
			resolveItem({ value: 'section', label: 'Sections', menu }, state({ testId: 'g' })),
		);

		expect(row).toEqual({
			type: 'submenu',
			value: 'section',
			label: 'Sections',
			testId: 'g-item-section',
			items,
		});
		expect((row as { items: unknown }).items).toBe(items);
	});

	it('names the row of an icon member after its aria-label', () => {
		const row = toMenuRow(
			resolveItem({ value: 'section', icon: svg(), 'aria-label': 'Choose section', menu }, state()),
		);

		expect(row).toMatchObject({ type: 'submenu', label: 'Choose section' });
	});

	it('takes the testId of the member over the one the group names it with', () => {
		const row = toMenuRow(
			resolveItem(
				{ value: 'section', label: 'Sections', menu, testId: 'own' },
				state({ testId: 'g' }),
			),
		);

		expect(row).toMatchObject({ testId: 'own' });
	});

	it('leaves the testId off while the member and the group have none', () => {
		expect(
			toMenuRow(resolveItem({ value: 'section', label: 'Sections', menu }, state())),
		).not.toHaveProperty('testId');
	});

	it('carries the disabled state and its reason, and no onClick or danger flag', () => {
		const row = toMenuRow(
			resolveItem(
				{
					value: 'section',
					label: 'Sections',
					menu,
					disabled: true,
					disabledTooltip: 'No sections yet',
				},
				state({ look: { variant: 'solid', color: 'danger' } }),
			),
		);

		expect(row).toMatchObject({ type: 'submenu', disabled: true });
		expect(row).toHaveProperty('disabledTooltip');
		expect(row).not.toHaveProperty('loading');
		expect(row).not.toHaveProperty('onClick');
		expect(row).not.toHaveProperty('danger');
	});

	it('carries the loading state of the group, and drops the disabled one', () => {
		const row = toMenuRow(
			resolveItem(
				{ value: 'section', label: 'Sections', menu },
				state({ loading: true, disabled: true }),
			),
		);

		expect(row).toMatchObject({ type: 'submenu', loading: true });
		expect(row).not.toHaveProperty('disabled');
	});
});

describe('countVisibleMembers with a margin per member', () => {
	// Three 85px members, a 32px ellipsis.
	const ends = [85, 169, 253];

	it('reads the margin of the ellipsis after the member it would follow', () => {
		// After the second member the ellipsis sits 4px away, after the others it pulls back 1px.
		const margins = [-1, 4, -1];

		expect(countVisibleMembers(ends, 32, margins, 204)).toBe(1);
		expect(countVisibleMembers(ends, 32, margins, 205)).toBe(2);
		expect(countVisibleMembers([85, 169, 253], 32, [-1, -1, -1], 200)).toBe(2);
	});

	it('treats a missing margin as none', () => {
		expect(countVisibleMembers(ends, 32, [], 201)).toBe(2);
	});
});

describe('countVisibleMembers with a suffix', () => {
	// Three 85px members, a 32px ellipsis pulling back 1px after each.
	const ends = [85, 169, 253];
	const pullBack = [-1, -1, -1];

	it('counts the margin of the suffix after the last member towards the full row', () => {
		const margins = [0, 0, 4];

		expect(countVisibleMembers(ends, 32, pullBack, 257, margins)).toBe(3);
		expect(countVisibleMembers(ends, 32, pullBack, 256, margins)).toBe(2);
	});

	it('reads the margin of the member that ends the row, not the others', () => {
		// The suffix sits 8px from the first two members and 1px from the last.
		expect(countVisibleMembers(ends, 32, pullBack, 254, [8, 8, 1])).toBe(3);
		expect(countVisibleMembers(ends, 32, pullBack, 253, [8, 8, 1])).toBe(2);
	});

	it('counts the margin between the ellipsis and the suffix once members collapse', () => {
		// Two members, the ellipsis and 4px: 169 - 1 + 32 + 4.
		expect(countVisibleMembers(ends, 32, pullBack, 204, [], 4)).toBe(2);
		expect(countVisibleMembers(ends, 32, pullBack, 203, [], 4)).toBe(1);
		// One member: 85 - 1 + 32 + 4.
		expect(countVisibleMembers(ends, 32, pullBack, 120, [], 4)).toBe(1);
		expect(countVisibleMembers(ends, 32, pullBack, 119, [], 4)).toBe(0);
	});

	it('keeps the two suffix margins apart: one for the full row, one for the ellipsis', () => {
		// The members' own margins do not matter once the ellipsis takes the end of the row.
		expect(countVisibleMembers(ends, 32, pullBack, 200, [100, 100, 100])).toBe(2);
		// And the ellipsis margin does not matter while the whole row fits.
		expect(countVisibleMembers(ends, 32, pullBack, 253, [], 100)).toBe(3);
	});

	it('treats a missing suffix margin as none', () => {
		expect(countVisibleMembers(ends, 32, pullBack, 253, [])).toBe(3);
		expect(countVisibleMembers(ends, 32, pullBack, 253, undefined, 0)).toBe(3);
		expect(countVisibleMembers(ends, 32, pullBack, 252)).toBe(2);
	});

	it('takes the suffix margin of a lone member', () => {
		expect(countVisibleMembers([85], 32, [-1], 89, [4])).toBe(1);
		expect(countVisibleMembers([85], 32, [-1], 88, [4])).toBe(0);
	});
});
