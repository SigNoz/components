import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type CSSProperties, type ReactElement, type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import type {
	ButtonGroupItemType,
	ButtonGroupJoinType,
	ButtonGroupProps,
	ButtonGroupVariantColorType,
	ButtonGroupVariantType,
} from '../types.js';
import {
	BASE,
	ITEMS,
	MANY_ITEMS,
	noop,
	renderInFrame,
	TOKENS,
	visibleMembers,
} from './button-group.test-utils.js';

/**
 * Real layout, so the widths the group subtracts and the margins it reads are the ones the
 * stylesheet draws. The frame holds the tokens the members read, `--spacing-2` (4px) and
 * `--spacing-4` (8px) for the gaps and `--radius-1` (6px) for the corners, plus a translucent
 * outlined border, the way the dark theme draws it.
 */
const RADIUS = '6px';
const FRAME_TOKENS = {
	...TOKENS,
	'--button-secondary-outlined-border': 'rgb(255 255 255 / 13%)',
} as CSSProperties;

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

/** The join a group of each variant draws against a slot, and the margin that join takes. */
const GROUPS: Array<[ButtonGroupVariantType, ButtonGroupJoinType]> = [
	['outlined', 'shared'],
	['dashed', 'shared'],
	['solid', 'seam'],
	['ghost', 'gap'],
	['link', 'wide-gap'],
];

afterEach(() => {
	vi.unstubAllGlobals();
});

/** A slot's content with a width of its own, so the room it takes can be told. */
function Block({ width, label }: { width: number; label: string }): ReactElement {
	return (
		<span style={{ display: 'block', width, height: 20 }} data-testid={`block-${label}`}>
			{label}
		</span>
	);
}

function member(value: string, variant: ButtonGroupVariantType): ButtonGroupItemType {
	return { value, label: value, onClick: noop, ...PAIR_OF[variant] };
}

function byValue(value: string): HTMLElement {
	return screen.getByTestId(`group-item-${value}`);
}

function rowChildren(): HTMLElement[] {
	const row = screen
		.getByTestId('group')
		.querySelector<HTMLElement>(':scope > [data-slot="button-group-row"]');

	return Array.from(row?.children ?? []) as HTMLElement[];
}

function corners(element: HTMLElement): { start: string; end: string } {
	const style = getComputedStyle(element);

	return {
		start: `${style.borderTopLeftRadius} ${style.borderBottomLeftRadius}`,
		end: `${style.borderTopRightRadius} ${style.borderBottomRightRadius}`,
	};
}

type RowProps = Pick<
	ButtonGroupProps,
	'items' | 'prefix' | 'suffix' | 'disabled' | 'disabledTooltip' | 'loading'
> & {
	/** The group's own pair, `BASE` (outlined) when left out. */
	variant?: ButtonGroupVariantType;
};

/**
 * One group in a frame of `size`. The `variant` picks the group's pair from `PAIR_OF`, the rest is
 * the props the case is about.
 */
function renderRow({ variant, ...rest }: RowProps, size = 1200): ReturnType<typeof render> {
	const props = {
		...(variant === undefined ? BASE : PAIR_OF[variant]),
		size: 'md',
		...rest,
		testId: 'group',
	} as ButtonGroupProps;

	return renderInFrame(<ButtonGroup {...props} />, { size, style: FRAME_TOKENS });
}

function Frame({ width, children }: { width: number; children: ReactNode }): ReactElement {
	return <div style={{ width, ...FRAME_TOKENS }}>{children}</div>;
}

/**
 * A slot that changes its own width, so the group is not rendered again when it grows: only the size
 * of the slot itself tells the group.
 */
function Widener(): ReactElement {
	const [wide, setWide] = useState(false);

	return (
		<input
			type="checkbox"
			aria-label="Widen"
			checked={wide}
			style={{ width: wide ? 300 : 20, height: 20, margin: 0 }}
			onChange={() => setWide((current) => !current)}
		/>
	);
}

describe('ButtonGroup prefix and suffix rendering', () => {
	it('puts the prefix first and the suffix last, inside the group', () => {
		renderRow({
			items: ITEMS,
			prefix: <Block width={40} label="prefix" />,
			suffix: <Block width={40} label="suffix" />,
		});

		const group = screen.getByRole('group');
		expect(within(group).getByTestId('group-prefix')).toContainElement(
			screen.getByTestId('block-prefix'),
		);
		expect(within(group).getByTestId('group-suffix')).toContainElement(
			screen.getByTestId('block-suffix'),
		);
		expect(rowChildren().map((child) => child.dataset['testid'])).toEqual([
			'group-prefix',
			'group-item-day',
			'group-item-week',
			'group-item-month',
			'group-suffix',
		]);
	});

	it('lays the slots out on the row, one after the other, and the group grows to hold them', () => {
		renderRow({
			items: ITEMS,
			prefix: <Block width={40} label="prefix" />,
			suffix: <Block width={60} label="suffix" />,
		});

		const prefix = screen.getByTestId('group-prefix').getBoundingClientRect();
		const first = byValue('day').getBoundingClientRect();
		const last = byValue('month').getBoundingClientRect();
		const suffix = screen.getByTestId('group-suffix').getBoundingClientRect();
		const group = screen.getByTestId('group').getBoundingClientRect();

		expect(prefix.width).toBe(40);
		expect(suffix.width).toBe(60);
		expect(first.left).toBeGreaterThanOrEqual(prefix.right);
		expect(last.right).toBeLessThanOrEqual(suffix.left);
		expect(prefix.left).toBe(group.left);
		expect(suffix.right).toBe(group.right);
	});

	it('keeps every member, the ellipsis and then the suffix in that order when members collapse', async () => {
		renderRow(
			{
				items: MANY_ITEMS,
				prefix: <Block width={40} label="prefix" />,
				suffix: <Block width={40} label="suffix" />,
			},
			360,
		);

		await screen.findByTestId('group-overflow');

		// A collapsed member stays mounted, out of the flow, so every member is still between the two.
		const visible = visibleMembers().length;
		expect(visible).toBeGreaterThan(0);
		expect(visible).toBeLessThan(MANY_ITEMS.length);
		expect(
			rowChildren().map((child) =>
				child.dataset['overflow'] === 'true'
					? 'ellipsis'
					: child.dataset['collapsed'] === 'true'
						? 'collapsed member'
						: child.dataset['slot'] === 'button-group-item'
							? 'member'
							: child.dataset['slot'],
			),
		).toEqual([
			'button-group-prefix',
			...Array.from({ length: visible }, () => 'member'),
			...Array.from({ length: MANY_ITEMS.length - visible }, () => 'collapsed member'),
			'ellipsis',
			'button-group-suffix',
		]);

		const ellipsis = screen.getByTestId('group-overflow').getBoundingClientRect();
		const suffix = screen.getByTestId('group-suffix').getBoundingClientRect();
		const first = visibleMembers()[0]?.getBoundingClientRect();
		const prefix = screen.getByTestId('group-prefix').getBoundingClientRect();

		expect(first?.left).toBeGreaterThanOrEqual(prefix.right);
		expect(ellipsis.right).toBeLessThanOrEqual(suffix.left);
	});

	it('names the slots after the testId of the group', () => {
		renderRow({
			items: ITEMS,
			prefix: <Block width={10} label="prefix" />,
			suffix: <Block width={10} label="suffix" />,
		});

		expect(screen.getByTestId('group-prefix')).toHaveAttribute('data-slot', 'button-group-prefix');
		expect(screen.getByTestId('group-suffix')).toHaveAttribute('data-slot', 'button-group-suffix');
	});

	it('names no slot when the group has no testId', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={ITEMS}
				prefix={<Block width={10} label="prefix" />}
				suffix={<Block width={10} label="suffix" />}
			/>,
		);

		const prefix = document.querySelector('[data-slot="button-group-prefix"]');
		const suffix = document.querySelector('[data-slot="button-group-suffix"]');

		expect(prefix).not.toBeNull();
		expect(suffix).not.toBeNull();
		expect(prefix).not.toHaveAttribute('data-testid');
		expect(suffix).not.toHaveAttribute('data-testid');
	});

	it.each<[string, ReactNode]>([
		['null', null],
		['undefined', undefined],
		['false', false],
		['true', true],
		['an empty string', ''],
		['an empty array', []],
		['an array of nothing', [null, false]],
		['a fragment of nothing', <></>],
		['a fragment holding null', <>{null}</>],
	])('renders no slot for %s', (_name, content) => {
		renderRow({ items: ITEMS, prefix: content, suffix: content });

		expect(screen.queryByTestId('group-prefix')).not.toBeInTheDocument();
		expect(screen.queryByTestId('group-suffix')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="button-group-prefix"]')).toBeNull();
		expect(document.querySelector('[data-slot="button-group-suffix"]')).toBeNull();
		expect(byValue('day')).not.toHaveAttribute('data-join-start');
		expect(byValue('month')).not.toHaveAttribute('data-join-end');
	});

	it.each<[string, ReactNode]>([
		['zero', 0],
		['text', 'Source'],
		['an element', <span key="x">x</span>],
		['a fragment holding an element', <>{null}x</>],
	])('renders a slot for %s', (_name, content) => {
		renderRow({ items: ITEMS, prefix: content, suffix: content });

		expect(screen.getByTestId('group-prefix')).toBeInTheDocument();
		expect(screen.getByTestId('group-suffix')).toBeInTheDocument();
	});

	it('renders one slot when only one is given', () => {
		renderRow({ items: ITEMS, prefix: <Block width={10} label="prefix" /> });

		expect(screen.getByTestId('group-prefix')).toBeInTheDocument();
		expect(screen.queryByTestId('group-suffix')).not.toBeInTheDocument();
		expect(byValue('day')).toHaveAttribute('data-join-start', 'shared');
		expect(byValue('month')).not.toHaveAttribute('data-join-end');
	});

	it('adds and drops a slot as the content comes and goes', () => {
		const { rerender } = renderRow({ items: ITEMS });
		expect(screen.queryByTestId('group-suffix')).not.toBeInTheDocument();

		rerender(
			<ButtonGroup
				{...BASE}
				items={ITEMS}
				suffix={<Block width={10} label="suffix" />}
				testId="group"
			/>,
		);
		expect(screen.getByTestId('group-suffix')).toBeInTheDocument();
		expect(byValue('month')).toHaveAttribute('data-join-end', 'shared');

		rerender(<ButtonGroup {...BASE} items={ITEMS} suffix={null} testId="group" />);
		expect(screen.queryByTestId('group-suffix')).not.toBeInTheDocument();
		expect(byValue('month')).not.toHaveAttribute('data-join-end');
	});
});

describe('ButtonGroup prefix and suffix content', () => {
	it('hands the content over as it is, and keeps it interactive', async () => {
		const user = userEvent.setup();
		renderRow({
			items: ITEMS,
			prefix: <input aria-label="Source" />,
			suffix: <input aria-label="Filter" />,
		});

		await user.type(screen.getByRole('textbox', { name: 'Source' }), 'logs');
		await user.type(screen.getByRole('textbox', { name: 'Filter' }), 'error');

		expect(screen.getByRole('textbox', { name: 'Source' })).toHaveValue('logs');
		expect(screen.getByRole('textbox', { name: 'Filter' })).toHaveValue('error');
	});

	it('does not disable the content of a disabled group, only its members', async () => {
		const user = userEvent.setup();
		renderRow({
			items: ITEMS,
			disabled: true,
			disabledTooltip: 'This dashboard is locked',
			prefix: <input aria-label="Source" />,
			suffix: <input aria-label="Filter" />,
		});

		expect(screen.getByRole('textbox', { name: 'Source' })).toBeEnabled();
		expect(screen.getByRole('textbox', { name: 'Filter' })).toBeEnabled();
		expect(screen.getByTestId('group')).toHaveAttribute('data-disabled', 'true');
		expect(byValue('day')).toHaveAttribute('aria-disabled', 'true');

		await user.type(screen.getByRole('textbox', { name: 'Source' }), 'logs');
		expect(screen.getByRole('textbox', { name: 'Source' })).toHaveValue('logs');
	});

	it('does not disable the content of a loading group, only its members', async () => {
		const user = userEvent.setup();
		renderRow({
			items: ITEMS,
			loading: true,
			prefix: <input aria-label="Source" />,
			suffix: <input aria-label="Filter" />,
		});

		expect(screen.getByRole('textbox', { name: 'Source' })).toBeEnabled();
		expect(screen.getByRole('textbox', { name: 'Filter' })).toBeEnabled();
		expect(screen.getByTestId('group')).toHaveAttribute('data-loading', 'true');
		expect(byValue('day')).toHaveAttribute('aria-busy', 'true');

		await user.type(screen.getByRole('textbox', { name: 'Filter' }), 'error');
		expect(screen.getByRole('textbox', { name: 'Filter' })).toHaveValue('error');
	});
});

describe('ButtonGroup prefix and suffix joins', () => {
	it.each(GROUPS)('%s group: the slots meet the members with a %s join', (variant, join) => {
		renderRow({
			variant,
			items: [member('a', variant), member('b', variant), member('c', variant)],
			prefix: <Block width={40} label="prefix" />,
			suffix: <Block width={40} label="suffix" />,
		});

		expect(screen.getByTestId('group-prefix')).toHaveAttribute('data-join-end', join);
		expect(screen.getByTestId('group-prefix')).not.toHaveAttribute('data-join-start');
		expect(byValue('a')).toHaveAttribute('data-join-start', join);
		expect(byValue('c')).toHaveAttribute('data-join-end', join);
		expect(screen.getByTestId('group-suffix')).toHaveAttribute('data-join-start', join);
		expect(screen.getByTestId('group-suffix')).not.toHaveAttribute('data-join-end');

		// The members keep the joins they have with each other.
		expect(byValue('a')).toHaveAttribute('data-join-end', join);
		expect(byValue('b')).toHaveAttribute('data-join-start', join);
		expect(byValue('b')).toHaveAttribute('data-join-end', join);
		expect(byValue('c')).toHaveAttribute('data-join-start', join);
	});

	it.each(GROUPS)('%s group: the slots sit apart by the margin of a %s join', (variant, join) => {
		renderRow({
			variant,
			items: [member('a', variant), member('b', variant)],
			prefix: <Block width={40} label="prefix" />,
			suffix: <Block width={40} label="suffix" />,
		});

		const margin = Number.parseFloat(MARGIN_OF[join]);
		const prefix = screen.getByTestId('group-prefix').getBoundingClientRect();
		const first = byValue('a').getBoundingClientRect();
		const last = byValue('b').getBoundingClientRect();
		const suffix = screen.getByTestId('group-suffix').getBoundingClientRect();

		expect(getComputedStyle(byValue('a')).marginInlineStart).toBe(MARGIN_OF[join]);
		expect(getComputedStyle(screen.getByTestId('group-suffix')).marginInlineStart).toBe(
			MARGIN_OF[join],
		);
		expect(first.left - prefix.right).toBe(margin);
		expect(suffix.left - last.right).toBe(margin);
	});

	it.each(GROUPS)(
		'%s group: a %s join squares the corners where a member meets a slot, or leaves them',
		(variant, join) => {
			renderRow({
				variant,
				items: [member('a', variant), member('b', variant)],
				prefix: <Block width={40} label="prefix" />,
				suffix: <Block width={40} label="suffix" />,
			});

			// A flush join reads as one control, so the corners the two meet at are square.
			const flush = join === 'shared' || join === 'seam';
			const round = `${RADIUS} ${RADIUS}`;

			expect(corners(byValue('a')).start).toBe(flush ? '0px 0px' : round);
			expect(corners(byValue('b')).end).toBe(flush ? '0px 0px' : round);
			// The two members meet with the same join, so their corners follow it too.
			expect(corners(byValue('a')).end).toBe(flush ? '0px 0px' : round);
			expect(corners(byValue('b')).start).toBe(flush ? '0px 0px' : round);
		},
	);

	it('leaves the end of the row round where there is no slot to meet', () => {
		renderRow({
			items: [member('a', 'outlined'), member('b', 'outlined')],
			prefix: <Block width={40} label="prefix" />,
		});

		expect(corners(byValue('a')).start).toBe('0px 0px');
		expect(corners(byValue('b')).end).toBe(`${RADIUS} ${RADIUS}`);
	});

	it('lets the prefix draw the line it shares with the first member of an outlined group', () => {
		renderRow({
			items: [member('a', 'outlined'), member('b', 'outlined')],
			prefix: <Block width={40} label="prefix" />,
			suffix: <Block width={40} label="suffix" />,
		});

		// The member drops the border on the side it shares and keeps the one on the far side, so a
		// translucent hairline is drawn once.
		expect(getComputedStyle(byValue('a')).borderInlineStartWidth).toBe('0px');
		expect(getComputedStyle(byValue('b')).borderInlineEndWidth).toBe('1px');
	});

	it('keeps the start border of the first member without a prefix', () => {
		renderRow({
			items: [member('a', 'outlined'), member('b', 'outlined')],
			suffix: <Block width={40} label="suffix" />,
		});

		expect(getComputedStyle(byValue('a')).borderInlineStartWidth).toBe('1px');
	});

	it('joins a member in its own pair against the slot with the join of that pair', () => {
		renderRow({
			items: [member('a', 'solid'), member('b', 'outlined'), member('c', 'ghost')],
			prefix: <Block width={40} label="prefix" />,
			suffix: <Block width={40} label="suffix" />,
		});

		// The slot is meeting a solid member and a ghost member, not the group's outlined pair.
		expect(screen.getByTestId('group-prefix')).toHaveAttribute('data-join-end', 'seam');
		expect(byValue('a')).toHaveAttribute('data-join-start', 'seam');
		expect(byValue('c')).toHaveAttribute('data-join-end', 'gap');
		expect(screen.getByTestId('group-suffix')).toHaveAttribute('data-join-start', 'gap');
	});

	it('marks how the suffix would meet each member, and the measured ellipsis', () => {
		renderRow({
			items: [
				member('a', 'outlined'),
				member('b', 'solid'),
				member('c', 'ghost'),
				member('d', 'link'),
			],
			suffix: <Block width={40} label="suffix" />,
		});

		expect(
			['a', 'b', 'c', 'd'].map((value) => byValue(value).getAttribute('data-suffix-join')),
		).toEqual(['shared', 'seam', 'gap', 'wide-gap']);
		expect(document.querySelector('[data-slot="button-group-measure-overflow"]')).toHaveAttribute(
			'data-suffix-join',
			'shared',
		);
	});

	it('marks no suffix join without a suffix', () => {
		renderRow({ items: ITEMS, prefix: <Block width={40} label="prefix" /> });

		for (const item of ITEMS) {
			expect(byValue(item.value)).not.toHaveAttribute('data-suffix-join');
		}
		expect(
			document.querySelector('[data-slot="button-group-measure-overflow"]'),
		).not.toHaveAttribute('data-suffix-join');
	});

	it('ends the last visible member against the ellipsis, and the ellipsis against the suffix', async () => {
		renderRow(
			{
				items: MANY_ITEMS.map((item) => ({ ...item, ...PAIR_OF.solid }) as ButtonGroupItemType),
				prefix: <Block width={30} label="prefix" />,
				suffix: <Block width={30} label="suffix" />,
			},
			400,
		);

		const ellipsis = await screen.findByTestId('group-overflow');
		const visible = visibleMembers();
		expect(visible.length).toBeGreaterThan(0);

		// The ellipsis is outlined, like the group: a seam against the solid members, shared with the
		// suffix.
		expect(visible.at(-1)).toHaveAttribute('data-join-end', 'seam');
		expect(ellipsis).toHaveAttribute('data-join-start', 'seam');
		expect(ellipsis).toHaveAttribute('data-join-end', 'shared');
		expect(screen.getByTestId('group-suffix')).toHaveAttribute('data-join-start', 'shared');
		expect(visible[0]).toHaveAttribute('data-join-start', 'seam');
		expect(screen.getByTestId('group-prefix')).toHaveAttribute('data-join-end', 'seam');
		expect(getComputedStyle(screen.getByTestId('group-suffix')).marginInlineStart).toBe('0px');
	});

	it('leaves the ellipsis with no end join without a suffix', async () => {
		renderRow(
			{
				items: MANY_ITEMS,
				prefix: <Block width={30} label="prefix" />,
			},
			400,
		);

		const ellipsis = await screen.findByTestId('group-overflow');

		expect(ellipsis).not.toHaveAttribute('data-join-end');
	});

	it.each(['outlined', 'ghost'] as const)(
		'%s group: puts the ellipsis between the two slots when no member fits',
		async (variant) => {
			const join = variant === 'outlined' ? 'shared' : 'gap';

			renderRow(
				{
					variant,
					items: MANY_ITEMS,
					prefix: <Block width={60} label="prefix" />,
					suffix: <Block width={60} label="suffix" />,
				},
				150,
			);

			const ellipsis = await screen.findByTestId('group-overflow');
			await waitFor(() => expect(visibleMembers()).toHaveLength(0));

			expect(ellipsis).toHaveAttribute('data-position', 'only');
			expect(screen.getByTestId('group-prefix')).toHaveAttribute('data-join-end', join);
			expect(ellipsis).toHaveAttribute('data-join-start', join);
			expect(ellipsis).toHaveAttribute('data-join-end', join);
			expect(screen.getByTestId('group-suffix')).toHaveAttribute('data-join-start', join);
		},
	);

	it('meets the ellipsis against the prefix alone when no member fits and there is no suffix', async () => {
		renderRow({ items: MANY_ITEMS, prefix: <Block width={60} label="prefix" /> }, 120);

		const ellipsis = await screen.findByTestId('group-overflow');
		await waitFor(() => expect(visibleMembers()).toHaveLength(0));

		expect(screen.getByTestId('group-prefix')).toHaveAttribute('data-join-end', 'shared');
		expect(ellipsis).toHaveAttribute('data-join-start', 'shared');
		expect(ellipsis).not.toHaveAttribute('data-join-end');
	});

	it('meets the ellipsis against the suffix alone when no member fits and there is no prefix', async () => {
		renderRow({ items: MANY_ITEMS, suffix: <Block width={60} label="suffix" /> }, 120);

		const ellipsis = await screen.findByTestId('group-overflow');
		await waitFor(() => expect(visibleMembers()).toHaveLength(0));

		expect(ellipsis).not.toHaveAttribute('data-join-start');
		expect(ellipsis).toHaveAttribute('data-join-end', 'shared');
		expect(screen.getByTestId('group-suffix')).toHaveAttribute('data-join-start', 'shared');
	});
});

describe('ButtonGroup prefix and suffix room', () => {
	it('shows fewer members once a slot takes some of the room', async () => {
		// The width at which every member fits with no slot.
		const bare = renderRow({ items: MANY_ITEMS }, 1200);
		const fullWidth = screen.getByTestId('group').getBoundingClientRect().width;
		bare.unmount();

		const view = renderRow({ items: MANY_ITEMS }, fullWidth);
		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();
		view.unmount();

		for (const slot of ['prefix', 'suffix'] as const) {
			const withSlot = renderRow(
				{ items: MANY_ITEMS, [slot]: <Block width={100} label={slot} /> },
				fullWidth,
			);

			await screen.findByTestId('group-overflow');
			const count = visibleMembers().length;
			expect(count, slot).toBeLessThan(6);
			expect(screen.getByTestId('group').getBoundingClientRect().width, slot).toBeLessThanOrEqual(
				fullWidth,
			);
			withSlot.unmount();
		}
	});

	it('takes both slots off the room, and keeps the row inside the group', async () => {
		for (const size of [320, 380, 440, 500]) {
			const view = renderRow(
				{
					items: MANY_ITEMS,
					prefix: <Block width={70} label="prefix" />,
					suffix: <Block width={70} label="suffix" />,
				},
				size,
			);

			await screen.findByTestId('group-overflow');
			const group = screen.getByTestId('group').getBoundingClientRect();
			const suffix = screen.getByTestId('group-suffix').getBoundingClientRect();
			const prefix = screen.getByTestId('group-prefix').getBoundingClientRect();

			expect(suffix.right, `${size}px`).toBeLessThanOrEqual(group.right + 0.5);
			expect(group.width, `${size}px`).toBeLessThanOrEqual(size);
			expect(prefix.left, `${size}px`).toBeGreaterThanOrEqual(group.left);
			view.unmount();
		}
	});

	it('collapses a member at the exact width the slots, the margins and the ellipsis leave it', async () => {
		const slots = {
			prefix: <Block width={50} label="prefix" />,
			suffix: <Block width={70} label="suffix" />,
		};
		const items = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map(
			(value, index): ButtonGroupItemType => member(value, index === 1 ? 'link' : 'solid'),
		);
		const group = PAIR_OF.solid;
		const ui = (
			<ButtonGroup
				{...group}
				size="md"
				items={items}
				prefix={slots.prefix}
				suffix={slots.suffix}
				testId="group"
			/>
		);
		const view = render(<Frame width={2000}>{ui}</Frame>);

		await waitFor(() => expect(visibleMembers()).toHaveLength(items.length));

		const root = screen.getByTestId('group');
		const left = root.getBoundingClientRect().left;
		const rights = visibleMembers().map((button) => button.getBoundingClientRect().right - left);
		const ellipsis = root.querySelector<HTMLElement>('[data-slot="button-group-measure-overflow"]');
		const ellipsisWidth = ellipsis?.getBoundingClientRect().width ?? 0;
		const suffixWidth = screen.getByTestId('group-suffix').getBoundingClientRect().width;
		expect(ellipsisWidth).toBeGreaterThan(0);
		expect(suffixWidth).toBe(70);

		// The suffix meets the last member in its own pair, and the ellipsis in the group's.
		const suffixJoins = items.map((_, index) => (index === 1 ? 8 : 1));
		const overflowJoins = suffixJoins;
		const ellipsisToSuffix = 1;

		// All of them, with the margin of the suffix after the last.
		const all = (rights.at(-1) ?? 0) + (suffixJoins.at(-1) ?? 0) + suffixWidth;
		view.rerender(<Frame width={all}>{ui}</Frame>);
		await waitFor(() => expect(visibleMembers()).toHaveLength(items.length));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();

		view.rerender(<Frame width={all - 1}>{ui}</Frame>);
		await waitFor(() => expect(visibleMembers()).toHaveLength(items.length - 1));

		for (let count = items.length - 1; count > 0; count--) {
			const fits =
				(rights[count - 1] ?? 0) +
				(overflowJoins[count - 1] ?? 0) +
				ellipsisWidth +
				ellipsisToSuffix +
				suffixWidth;

			view.rerender(<Frame width={fits}>{ui}</Frame>);
			await waitFor(() => expect(visibleMembers()).toHaveLength(count));
			expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(fits + 0.5);

			view.rerender(<Frame width={fits - 1}>{ui}</Frame>);
			await waitFor(() => expect(visibleMembers()).toHaveLength(count - 1));
		}
	});

	it('never collapses a slot, however little room there is', async () => {
		renderRow(
			{
				items: MANY_ITEMS,
				prefix: <Block width={100} label="prefix" />,
				suffix: <Block width={100} label="suffix" />,
			},
			40,
		);

		await screen.findByTestId('group-overflow');
		await waitFor(() => expect(visibleMembers()).toHaveLength(0));

		for (const id of ['group-prefix', 'group-suffix']) {
			const slot = screen.getByTestId(id);
			expect(slot.getBoundingClientRect().width).toBe(100);
			expect(slot).not.toHaveAttribute('data-collapsed');
			expect(slot).toBeVisible();
		}
		expect(screen.getByTestId('block-prefix')).toBeVisible();
		expect(screen.getByTestId('block-suffix')).toBeVisible();
	});

	it('gives the members back their room when a slot goes away', async () => {
		const frame = (suffix: ReactNode): ReactElement => (
			<div style={{ width: 420, ...FRAME_TOKENS }}>
				<ButtonGroup {...BASE} items={MANY_ITEMS} suffix={suffix} testId="group" />
			</div>
		);
		const { rerender } = render(frame(<Block width={200} label="suffix" />));

		await screen.findByTestId('group-overflow');
		const crowded = visibleMembers().length;

		rerender(frame(null));

		await waitFor(() => expect(visibleMembers().length).toBeGreaterThan(crowded));
	});

	it('measures a slot that appears after the first render', async () => {
		const bare = renderRow({ items: MANY_ITEMS }, 1200);
		const fullWidth = screen.getByTestId('group').getBoundingClientRect().width;
		bare.unmount();

		// A group of its own width does not resize when a slot comes, so nothing but the slot being
		// there tells it to measure again.
		const frame = (suffix: ReactNode): ReactElement => (
			<div style={{ width: 1200, ...FRAME_TOKENS }}>
				<ButtonGroup
					{...BASE}
					width={fullWidth + 20}
					items={MANY_ITEMS}
					suffix={suffix}
					testId="group"
				/>
			</div>
		);
		const { rerender } = render(frame(null));
		await waitFor(() => expect(visibleMembers()).toHaveLength(6));

		rerender(frame(<Block width={120} label="suffix" />));

		await screen.findByTestId('group-overflow');
		expect(visibleMembers().length).toBeLessThan(6);
	});

	it('re-measures when the content of a slot changes size on its own', async () => {
		const user = userEvent.setup();

		const bare = renderRow({ items: MANY_ITEMS }, 1200);
		const fullWidth = screen.getByTestId('group').getBoundingClientRect().width;
		bare.unmount();

		renderRow({ items: MANY_ITEMS, suffix: <Widener /> }, fullWidth + 20);
		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();

		await user.click(screen.getByRole('checkbox', { name: 'Widen' }));
		await screen.findByTestId('group-overflow');
		expect(visibleMembers().length).toBeLessThan(6);

		await user.click(screen.getByRole('checkbox', { name: 'Widen' }));
		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();
	});

	it('watches the size of a slot that was added after the first render too', async () => {
		const user = userEvent.setup();

		const bare = renderRow({ items: MANY_ITEMS }, 1200);
		const fullWidth = screen.getByTestId('group').getBoundingClientRect().width;
		bare.unmount();

		const frame = (prefix: ReactNode): ReactElement => (
			<div style={{ width: 1200, ...FRAME_TOKENS }}>
				<ButtonGroup
					{...BASE}
					width={fullWidth + 20}
					items={MANY_ITEMS}
					prefix={prefix}
					testId="group"
				/>
			</div>
		);
		const observed = new Set<Element>();
		vi.stubGlobal(
			'ResizeObserver',
			class extends ResizeObserver {
				override observe(target: Element, options?: ResizeObserverOptions): void {
					observed.add(target);
					super.observe(target, options);
				}
			},
		);
		const { rerender } = render(frame(null));
		await waitFor(() => expect(visibleMembers()).toHaveLength(6));

		rerender(frame(<Widener />));
		await waitFor(() => expect(visibleMembers()).toHaveLength(6));
		expect(screen.queryByTestId('group-overflow')).not.toBeInTheDocument();
		expect(observed.has(screen.getByTestId('group-prefix'))).toBe(true);

		// The group is not rendered again and does not resize, so only the size of the slot itself
		// tells it.
		await user.click(screen.getByRole('checkbox', { name: 'Widen' }));

		await screen.findByTestId('group-overflow');
		expect(visibleMembers().length).toBeLessThan(6);
	});
});
