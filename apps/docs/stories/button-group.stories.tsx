import {
	Calendar,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Code,
	Copy,
	Eye,
	Function as FunctionIcon,
	Plus,
	Star,
} from '@signozhq/icons';
import {
	ButtonGroup,
	ButtonGroupColor,
	type ButtonGroupColorType,
	type ButtonGroupItemMenuType,
	type ButtonGroupItemType,
	type ButtonGroupProps,
	ButtonGroupSize,
	ButtonGroupTextOverflow,
	ButtonGroupVariant,
	type ButtonGroupVariantColorType,
	type ButtonGroupVariantType,
	Input,
	Select,
	type SelectOptionItemType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	type CSSProperties,
	Fragment,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './button-group.stories.module.css';
import { waitForEffects } from './shared/play.js';

const noop = (): void => {};

const RANGE_ITEMS: ButtonGroupItemType[] = [
	{ value: 'day', label: 'Day', prefix: <Clock />, onClick: noop },
	{ value: 'week', label: 'Week', prefix: <Calendar />, onClick: noop },
	{ value: 'month', label: 'Month', prefix: <Star />, onClick: noop },
];

const MANY_ITEMS: ButtonGroupItemType[] = [
	{ value: 'logs', label: 'Logs', onClick: noop },
	{ value: 'traces', label: 'Traces', onClick: noop },
	{ value: 'metrics', label: 'Metrics', onClick: noop },
	{ value: 'exceptions', label: 'Exceptions', onClick: noop },
	{ value: 'alerts', label: 'Alerts', onClick: noop },
	{ value: 'dashboards', label: 'Dashboards', onClick: noop },
];

const ICON_ITEMS: ButtonGroupItemType[] = [
	{ value: 'previous', icon: <ChevronLeft />, 'aria-label': 'Previous page', onClick: noop },
	{ value: 'code', icon: <Code />, 'aria-label': 'View source', onClick: noop },
	{ value: 'next', icon: <ChevronRight />, 'aria-label': 'Next page', onClick: noop },
];

const LOOK_OUTLINED = {
	variant: ButtonGroupVariant.Outlined,
	color: ButtonGroupColor.Secondary,
} as const satisfies ButtonGroupVariantColorType;
const LOOK_DASHED = {
	variant: ButtonGroupVariant.Dashed,
	color: ButtonGroupColor.Secondary,
} as const satisfies ButtonGroupVariantColorType;
const LOOK_GHOST = {
	variant: ButtonGroupVariant.Ghost,
	color: ButtonGroupColor.Secondary,
} as const satisfies ButtonGroupVariantColorType;
const LOOK_LINK = {
	variant: ButtonGroupVariant.Link,
	color: ButtonGroupColor.Primary,
} as const satisfies ButtonGroupVariantColorType;
const LOOK_SOLID_PRIMARY = {
	variant: ButtonGroupVariant.Solid,
	color: ButtonGroupColor.Primary,
} as const satisfies ButtonGroupVariantColorType;
const LOOK_SOLID_SECONDARY = {
	variant: ButtonGroupVariant.Solid,
	color: ButtonGroupColor.Secondary,
} as const satisfies ButtonGroupVariantColorType;
const LOOK_SOLID_DANGER = {
	variant: ButtonGroupVariant.Solid,
	color: ButtonGroupColor.Danger,
} as const satisfies ButtonGroupVariantColorType;

function actionItem(
	value: string,
	label: string,
	look?: ButtonGroupVariantColorType,
): ButtonGroupItemType {
	return { value, label, onClick: noop, ...look } as ButtonGroupItemType;
}

function linkItem(
	value: string,
	label: string,
	look?: ButtonGroupVariantColorType,
): ButtonGroupItemType {
	return {
		value,
		label,
		// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
		render: <a href={`#${value}`} />,
		...look,
	} as ButtonGroupItemType;
}

/**
 * The playground's free `variant` and `color` controls can land on a pair `Button` does not draw, so
 * the pair is clamped to one the types allow. Only `ghost` has a `noLoadingEffect` to take.
 */
function resolveLook(
	variant: ButtonGroupVariantType = ButtonGroupVariant.Outlined,
	color: ButtonGroupColorType = ButtonGroupColor.Secondary,
	noLoadingEffect?: boolean,
): ButtonGroupVariantColorType {
	switch (variant) {
		case ButtonGroupVariant.Ghost:
			return { ...LOOK_GHOST, noLoadingEffect };
		case ButtonGroupVariant.Outlined:
		case ButtonGroupVariant.Dashed:
			return { variant, color: ButtonGroupColor.Secondary };
		default:
			return { variant, color };
	}
}

const meta: Meta<typeof ButtonGroup> = {
	title: 'Primitive Components/ButtonGroup',
	component: ButtonGroup,
	parameters: {
		layout: 'padded',
		controls: { disable: false },
	},
	argTypes: {
		variant: {
			control: 'select',
			options: Object.values(ButtonGroupVariant),
			description:
				'The visual treatment of every member, the same five as `Button`. `solid` and `link` take every `color`, `outlined`, `dashed` and `ghost` only `secondary`. An item can set its own `variant` and `color`, both or neither.',
			table: { category: 'Appearance', type: { summary: 'ButtonGroupVariantType' } },
		},
		color: {
			control: 'select',
			options: Object.values(ButtonGroupColor),
			description:
				'The palette behind the variant, the same eight as `Button`. Only `solid` and `link` take every colour, `outlined`, `dashed` and `ghost` are restricted to `secondary`. The playground clamps the control to a pair the types allow.',
			table: { category: 'Appearance', type: { summary: 'ButtonGroupColorType' } },
		},
		noLoadingEffect: {
			control: 'boolean',
			description:
				'Turns off the glow a `ghost` group plays behind its labels while `loading`. The spinners, `aria-busy` and `loadingTooltip` stay. Only `variant="ghost"` accepts it.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		size: {
			control: 'select',
			options: Object.values(ButtonGroupSize),
			description: 'Shared by every member. `sm` is 24px tall, `md` is 32px.',
			table: { category: 'Appearance' },
		},
		items: {
			control: 'object',
			description:
				"The members, in order. A member takes the group's `variant` and `color` unless it sets its own pair, and any `Button` prop but `size`, `children`, `className` and `style`. A member runs `onClick`, renders a `render` link, or opens a `menu`. Members that do not fit collapse from the end.",
			table: { category: 'Content', type: { summary: 'ButtonGroupItemType[]' } },
		},
		prefix: {
			control: false,
			description:
				"Content rendered inside the group before the first member, a select or a status for instance. It never collapses: the members make room for it. It meets the first member as a member in the group's `variant` would, so the corners between them square off in an `outlined`, `dashed` or `solid` group. Its own corners and border are yours to style. `disabled` and `loading` do not reach it.",
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		suffix: {
			control: false,
			description:
				"Content rendered inside the group after the last member and the ellipsis, an inline editor for instance. It never collapses: the members make room for it. It meets the last segment as a member in the group's `variant` would, so the corners between them square off in an `outlined`, `dashed` or `solid` group. Its own corners and border are yours to style, and in an `outlined` or `dashed` group it drops its start border. `disabled` and `loading` do not reach it.",
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		textOverflow: {
			control: 'select',
			options: Object.values(ButtonGroupTextOverflow),
			description: 'What a label past its 120px cap does.',
			table: { category: 'Content', defaultValue: { summary: 'ellipsis' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Blocks every member. Requires `disabledTooltip`.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		disabledTooltip: {
			control: 'text',
			description: 'Why the group cannot be used, shown on every member while disabled.',
			table: { category: 'State' },
		},
		loading: {
			control: 'boolean',
			description: 'Spinner on every member, presses blocked, members stay focusable.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		loadingTooltip: {
			control: 'text',
			description: 'What the group is busy with, shown on every member while loading.',
			table: { category: 'State' },
		},
		width: {
			control: 'text',
			description: 'Written as `--button-group-internal-width`.',
			table: { category: 'Layout' },
		},
		maxWidth: {
			control: 'text',
			description: 'Written as `--button-group-internal-max-width`. Past it, members collapse.',
			table: { category: 'Layout', defaultValue: { summary: '100%' } },
		},
		testId: {
			control: 'text',
			description: 'The group `data-testid`, and the stem every member is named from.',
			table: { category: 'Testing' },
		},
	},
	args: {
		variant: ButtonGroupVariant.Outlined,
		color: ButtonGroupColor.Secondary,
		size: ButtonGroupSize.MD,
		items: RANGE_ITEMS,
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
	parameters: {
		// Playground: every state it can be driven into is covered by `ButtonGroupShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: ({ variant, color, noLoadingEffect, ...args }) => (
		<ButtonGroup
			{...(args as Omit<ButtonGroupProps, 'variant' | 'color' | 'noLoadingEffect'>)}
			{...resolveLook(variant, color, noLoadingEffect)}
		/>
	),
};

/**
 * The columns of the matrix below. `hover` and `focus` cannot be reached by a snapshot on their own,
 * `storybook-addon-pseudo-states` forces them through the `[data-state-cell]` selectors in the story
 * parameters.
 */
const STATES = [
	'default',
	'hover',
	'focus',
	'disabled group',
	'disabled member',
	'loading',
] as const;

type State = (typeof STATES)[number];

/**
 * The props one column overrides. Both pairings are optional here, which keeps the spread valid:
 * `ValidateButtonGroupProps` reads the props a call site writes, and an optional one is not written.
 */
type StateProps = {
	items: ButtonGroupItemType[];
	disabled?: boolean;
	disabledTooltip?: string;
	loading?: boolean;
	loadingTooltip?: string;
};

function stateProps(state: State): StateProps {
	switch (state) {
		case 'disabled group':
			return { disabled: true, disabledTooltip: 'This dashboard is locked', items: RANGE_ITEMS };
		case 'disabled member':
			return {
				items: RANGE_ITEMS.map((item) =>
					item.value === 'week'
						? ({
								...item,
								disabled: true,
								disabledTooltip: 'Weekly views need a paid plan',
							} as ButtonGroupItemType)
						: item,
				),
			};
		case 'loading':
			return { loading: true, loadingTooltip: 'Loading the range', items: RANGE_ITEMS };
		default:
			return { items: RANGE_ITEMS };
	}
}

/**
 * The member states a composition can be shown in. Each is set on every member of the group through
 * the item's own props, so the cell shows what one member looks like in that state.
 */
const COMPOSITION_STATES = ['default', 'disabled', 'loading'] as const;

type CompositionState = (typeof COMPOSITION_STATES)[number];

function withMemberState(item: ButtonGroupItemType, state: CompositionState): ButtonGroupItemType {
	switch (state) {
		case 'disabled':
			return {
				...item,
				disabled: true,
				disabledTooltip: 'Needs the editor role',
			} as ButtonGroupItemType;
		case 'loading':
			return { ...item, loading: true, loadingTooltip: 'Saving the view' } as ButtonGroupItemType;
		default:
			return item;
	}
}

const COMPOSITION_MEMBERS = [
	{ value: 'day', label: 'Day', icon: <Clock /> },
	{ value: 'week', label: 'Week', icon: <Calendar /> },
	{ value: 'month', label: 'Month', icon: <Star /> },
];

type Affix = 'none' | 'prefix' | 'suffix' | 'both';

const AFFIXES: { name: string; affix: Affix }[] = [
	{ name: 'label', affix: 'none' },
	{ name: 'prefix', affix: 'prefix' },
	{ name: 'suffix', affix: 'suffix' },
	{ name: 'prefix + suffix', affix: 'both' },
];

/**
 * Text members, as buttons or as links, with the icons `affix` asks for.
 */
function labelledItems(affix: Affix, link: boolean): ButtonGroupItemType[] {
	return COMPOSITION_MEMBERS.map(
		({ value, label, icon }) =>
			({
				value,
				label,
				...(affix === 'prefix' || affix === 'both' ? { prefix: icon } : {}),
				...(affix === 'suffix' || affix === 'both' ? { suffix: <ChevronDown /> } : {}),
				// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- a link member's own children are dropped, its text comes from `label`
				...(link ? { render: <a href={`#${value}`} /> } : { onClick: noop }),
			}) as ButtonGroupItemType,
	);
}

type CompositionRow = { name: string; items: ButtonGroupItemType[] };

const COMPOSITIONS: { title: string; note: string; rows: CompositionRow[] }[] = [
	{
		title: 'Text members',
		note: 'A label, optionally flanked by a prefix and a suffix. Loading swaps the prefix for a spinner, and opens a spinner slot when there is no prefix.',
		rows: AFFIXES.map(({ name, affix }) => ({ name, items: labelledItems(affix, false) })),
	},
	{
		title: 'Icon members',
		note: 'Square, with an accessible name instead of a label, so there is no prefix or suffix. Loading swaps the icon for a spinner.',
		rows: [{ name: 'icon', items: ICON_ITEMS }],
	},
	{
		title: 'Link members',
		note: 'Render the element they are given, so middle click and open in new tab work. They take a prefix and a suffix like a text member. A disabled link renders as a plain button, since an anchor stays reachable through middle click.',
		rows: AFFIXES.map(({ name, affix }) => ({ name, items: labelledItems(affix, true) })),
	},
];

function MatrixLabel({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			variant="label"
			size="small"
			weight="medium"
			color="inherit"
			as="span"
			textOverflow="visible"
		>
			{children}
		</Typography>
	);
}

function matrixColumns(columns: number): CSSProperties {
	return { gridTemplateColumns: `max-content repeat(${columns}, max-content)` };
}

/**
 * Every pair the types allow: any colour for `solid` and `link`, `secondary` for the other three.
 * The last one is the ghost pair with its loading glow off.
 */
const VARIANT_COLOR_PAIRS: ButtonGroupVariantColorType[] = [
	...[ButtonGroupVariant.Solid, ButtonGroupVariant.Link].flatMap((variant) =>
		Object.values(ButtonGroupColor).map((color) => ({ variant, color })),
	),
	LOOK_OUTLINED,
	LOOK_DASHED,
	LOOK_GHOST,
	{ ...LOOK_GHOST, noLoadingEffect: true },
];

const PAIR_COLUMNS = [
	{ label: 'sm', size: ButtonGroupSize.SM, loading: false },
	{ label: 'md', size: ButtonGroupSize.MD, loading: false },
	{ label: 'md loading', size: ButtonGroupSize.MD, loading: true },
] as const;

function pairLabel(look: ButtonGroupVariantColorType): string {
	return `${look.variant} / ${look.color}${look.noLoadingEffect ? ', no loading effect' : ''}`;
}

function PairMatrix(): ReactElement {
	return (
		<div className={styles.matrix} style={matrixColumns(PAIR_COLUMNS.length)}>
			<span />
			{PAIR_COLUMNS.map(({ label }) => (
				<MatrixLabel key={label}>{label}</MatrixLabel>
			))}
			{VARIANT_COLOR_PAIRS.map((look) => (
				<Fragment key={pairLabel(look)}>
					<MatrixLabel>{pairLabel(look)}</MatrixLabel>
					{PAIR_COLUMNS.map(({ label, size, loading }) => (
						<ButtonGroup
							key={label}
							{...look}
							size={size}
							items={RANGE_ITEMS}
							{...(loading ? { loading: true, loadingTooltip: 'Loading the range' } : {})}
						/>
					))}
				</Fragment>
			))}
		</div>
	);
}

const MIXED_ROW_TEST_ID = 'mixed-row';

type MixedRow = {
	name: string;
	meets: string;
	look: ButtonGroupVariantColorType;
	items: ButtonGroupItemType[];
	testId?: string;
};

const MIXED_ROWS: MixedRow[] = [
	{
		name: 'outlined + dashed',
		meets: 'one shared hairline',
		look: LOOK_OUTLINED,
		items: [
			actionItem('day', 'Day'),
			actionItem('week', 'Week', LOOK_DASHED),
			actionItem('month', 'Month'),
		],
	},
	{
		name: 'outlined + solid',
		meets: '1px seam',
		look: LOOK_OUTLINED,
		items: [
			actionItem('edit', 'Edit'),
			actionItem('duplicate', 'Duplicate'),
			actionItem('delete', 'Delete', LOOK_SOLID_DANGER),
		],
	},
	{
		name: 'solid + solid',
		meets: '1px seam',
		look: LOOK_SOLID_PRIMARY,
		items: [
			actionItem('save', 'Save'),
			actionItem('save-as', 'Save as', LOOK_SOLID_SECONDARY),
			actionItem('discard', 'Discard', LOOK_SOLID_DANGER),
		],
	},
	{
		name: 'ghost',
		meets: '4px gap',
		look: LOOK_GHOST,
		items: [actionItem('day', 'Day'), actionItem('week', 'Week'), actionItem('month', 'Month')],
	},
	{
		name: 'outlined + ghost',
		meets: '4px gap',
		look: LOOK_OUTLINED,
		items: [
			actionItem('day', 'Day'),
			actionItem('week', 'Week'),
			actionItem('reset', 'Reset', LOOK_GHOST),
		],
	},
	{
		name: 'outlined + link',
		meets: '8px gap',
		look: LOOK_OUTLINED,
		items: [
			actionItem('day', 'Day'),
			actionItem('week', 'Week'),
			linkItem('docs', 'Docs', LOOK_LINK),
		],
	},
	{
		name: 'all of them',
		meets: 'hairline, seam, 4px gap, 8px gap',
		look: LOOK_OUTLINED,
		testId: MIXED_ROW_TEST_ID,
		items: [
			actionItem('day', 'Day'),
			actionItem('week', 'Week'),
			actionItem('delete', 'Delete', LOOK_SOLID_DANGER),
			actionItem('archive', 'Archive', LOOK_GHOST),
			linkItem('docs', 'Docs', LOOK_LINK),
		],
	},
];

const MIXED_ROW_JOINS = [
	{ value: 'day', start: undefined, end: 'shared' },
	{ value: 'week', start: 'shared', end: 'seam' },
	{ value: 'delete', start: 'seam', end: 'gap' },
	{ value: 'archive', start: 'gap', end: 'wide-gap' },
	{ value: 'docs', start: 'wide-gap', end: undefined },
];

function MixedMatrix(): ReactElement {
	return (
		<div className={styles.matrix} style={matrixColumns(2)}>
			<span />
			<MatrixLabel>members</MatrixLabel>
			<MatrixLabel>neighbours meet by</MatrixLabel>
			{MIXED_ROWS.map(({ name, meets, look, items, testId }) => (
				<Fragment key={name}>
					<MatrixLabel>{name}</MatrixLabel>
					<ButtonGroup
						{...look}
						size="md"
						items={items}
						{...(testId === undefined ? {} : { testId })}
					/>
					<Typography
						variant="label"
						size="small"
						weight="regular"
						color="secondary"
						as="span"
						textOverflow="visible"
					>
						{meets}
					</Typography>
				</Fragment>
			))}
		</div>
	);
}

function CompositionMatrix({ rows }: { rows: CompositionRow[] }): ReactElement {
	return (
		<div className={`${styles.matrix} ${styles.compositionMatrix}`}>
			<span />
			{COMPOSITION_STATES.map((state) => (
				<MatrixLabel key={state}>{state}</MatrixLabel>
			))}
			{rows.map(({ name, items }) => (
				<Fragment key={name}>
					<MatrixLabel>{name}</MatrixLabel>
					{COMPOSITION_STATES.map((state) => (
						<ButtonGroup
							key={state}
							variant="outlined"
							color="secondary"
							size="md"
							items={items.map((item) => withMemberState(item, state))}
						/>
					))}
				</Fragment>
			))}
		</div>
	);
}

function CompositionGroup({
	title,
	note,
	children,
}: {
	title: string;
	note: string;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={styles.compositionGroup}>
			<Typography
				variant="paragraph"
				size="small"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				as="p"
				textOverflow="wrap"
				maxWidth="60rem"
				marginBottom={4}
			>
				{note}
			</Typography>
			{children}
		</div>
	);
}

function ShowcaseSection({
	title,
	note,
	children,
}: {
	title: string;
	note: string;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section">
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				as="p"
				textOverflow="wrap"
				maxWidth="60rem"
				marginBottom={8}
			>
				{note}
			</Typography>
			{children}
		</div>
	);
}

/**
 * The widths the overflow section walks through, widest first: room for everything, then one
 * member fewer each step, down to the ellipsis alone.
 */
const OVERFLOW_FRAMES = ['40rem', '24rem', '16rem', '10rem', '6rem', '2.5rem'];

const HELD_OPEN_TEST_ID = 'overflow-menu';

const HELD_OPEN_ITEMS = [...MANY_ITEMS, actionItem('delete', 'Delete', LOOK_SOLID_DANGER)].map(
	(item) => ({
		...item,
		onClick: fn(),
	}),
) as ButtonGroupItemType[];

/**
 * Members in all four variants, so the ellipsis meets a different neighbour in each frame of
 * `OVERFLOW_MIXED_FRAMES`: it takes the group's pair, and the last member left in the row decides
 * how they join.
 */
const OVERFLOW_MIXED_ITEMS: ButtonGroupItemType[] = [
	actionItem('day', 'Day'),
	actionItem('week', 'Week', LOOK_DASHED),
	actionItem('delete', 'Delete', LOOK_SOLID_DANGER),
	actionItem('archive', 'Archive', LOOK_GHOST),
	linkItem('docs', 'Docs', LOOK_LINK),
	actionItem('export', 'Export'),
];

const OVERFLOW_MIXED_FRAMES = ['28rem', '22rem', '20rem', '17rem', '12rem', '8rem'];

const PASS_THROUGH_TEST_ID = 'item-props';

const PASS_THROUGH_ITEMS: ButtonGroupItemType[] = [
	{
		value: 'rename',
		label: 'Rename',
		onClick: fn(),
		onDoubleClick: fn(),
		onFocus: fn(),
		'aria-keyshortcuts': 'F2',
		'data-analytics-id': 'rename-view',
	},
	{
		value: 'clipped',
		label: 'Export every panel as a CSV file',
		onClick: fn(),
		maxWidth: '9rem',
		textOverflow: ButtonGroupTextOverflow.Hidden,
	},
	{
		value: 'truncated',
		label: 'Share a link to this exact time range',
		onClick: fn(),
		maxWidth: '9rem',
	},
	{ value: 'wide', label: 'Wide', onClick: fn(), width: '8rem' },
];

/**
 * Opens the ellipsis menu on mount, and again when the frame is resized or a new ellipsis appears
 * after a resize had every member fit. `ButtonGroup` owns the menu's open state, so this presses
 * the trigger the way a user would.
 *
 * @note Never reopens after a dismissal (an outside press, Escape, a row being picked). Opening
 * moves focus into the popup, so reopening then would pull focus away from whatever the reader just
 * clicked, anywhere in the page.
 *
 * @note Holds off while any other menu is open. Pressing this trigger would dismiss that menu, and
 * a second held menu would dismiss this one in turn, forever.
 */
function useHeldOpenMenu(frameRef: RefObject<HTMLDivElement | null>): void {
	useEffect(() => {
		const frame = frameRef.current;

		if (frame == null) {
			return;
		}

		let lastTrigger: HTMLElement | null = null;
		let lastWidth: number | null = null;

		const reopen = (force: boolean): void => {
			const trigger = frame.querySelector<HTMLElement>(
				`[data-testid="${HELD_OPEN_TEST_ID}-overflow"]`,
			);

			if (trigger == null || (!force && trigger === lastTrigger)) {
				lastTrigger = trigger;
				return;
			}

			lastTrigger = trigger;

			if (
				trigger.hasAttribute('data-popup-open') ||
				document.querySelector('[data-slot="dropdown-popup"]') !== null
			) {
				return;
			}

			// Base UI opens a menu on `mousedown`, not on `click`.
			trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
		};

		// Catches the ellipsis mounting, on first render and when it comes back after a resize.
		const mutations = new MutationObserver(() => reopen(false));

		mutations.observe(frame, { subtree: true, childList: true });

		// Catches a drag on the frame's corner: the press that starts it dismisses the menu.
		const resizes = new ResizeObserver(([entry]) => {
			const width = entry?.contentRect.width ?? null;

			if (lastWidth !== null && width !== lastWidth) {
				reopen(true);
			}

			lastWidth = width;
		});

		resizes.observe(frame);
		reopen(false);

		return () => {
			mutations.disconnect();
			resizes.disconnect();
		};
	}, [frameRef]);
}

function HeldOpenOverflow(): ReactElement {
	const frameRef = useRef<HTMLDivElement>(null);

	useHeldOpenMenu(frameRef);

	return (
		<div ref={frameRef} className={`${styles.resizableFrame} ${styles.roomBelow}`}>
			<ButtonGroup
				variant="outlined"
				color="secondary"
				size="md"
				items={HELD_OPEN_ITEMS}
				testId={HELD_OPEN_TEST_ID}
			/>
		</div>
	);
}

function ButtonGroupShowcaseLayout(): ReactElement {
	return (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				<ShowcaseSection
					title="Sizes and states"
					note="One row per size, one column per state. Hover and focus are held on the middle member, so each cell shows the state beside two plain neighbours: the shared line is drawn once whatever the state, and the focus ring keeps the member's own square corners. Disabled members hatch both edges, loading ones swap their prefix for a spinner."
				>
					<div className={styles.matrix}>
						<span />
						{STATES.map((state) => (
							<MatrixLabel key={state}>{state}</MatrixLabel>
						))}
						{Object.values(ButtonGroupSize).map((size) => (
							<Row key={size} size={size} />
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Variants and colours"
					note="Every pair a member can be drawn in, the same ones Button takes: solid and link in each of the eight colours, outlined, dashed and ghost in secondary. Each pair at both sizes, and loading, where ghost plays a glow behind its labels unless noLoadingEffect turns it off."
				>
					<PairMatrix />
				</ShowcaseSection>

				<ShowcaseSection
					title="Compositions"
					note="Every kind of member, with the prefix and suffix it supports, in each member state. The state is set on the members themselves: hover a disabled or loading cell for the reason."
				>
					<div className={styles.exampleStack}>
						{COMPOSITIONS.map(({ title, note, rows }) => (
							<CompositionGroup key={title} title={title} note={note}>
								<CompositionMatrix rows={rows} />
							</CompositionGroup>
						))}
						<CompositionGroup
							title="Edge cases"
							note="A label past its 120px cap truncates and shows the full text in a tooltip, or with textOverflow hidden clips at the member's edge with no marker. An empty label falls back to <No label> rather than hiding the action. A single member keeps all four corners."
						>
							<ButtonGroup
								variant="outlined"
								color="secondary"
								size="md"
								items={[
									{
										value: 'long',
										label: 'Everything that happened in the last twenty four hours',
										onClick: noop,
									},
									{ value: 'empty', label: '', onClick: noop },
								]}
							/>
							<ButtonGroup
								variant="outlined"
								color="secondary"
								size="md"
								textOverflow={ButtonGroupTextOverflow.Hidden}
								items={[
									{
										value: 'long',
										label: 'Everything that happened in the last twenty four hours',
										onClick: noop,
									},
								]}
							/>
							<ButtonGroup
								variant="outlined"
								color="secondary"
								size="md"
								items={RANGE_ITEMS.slice(0, 1)}
							/>
						</CompositionGroup>
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Mixed variants"
					note="A member takes the group's variant and colour unless it names its own pair, and each pair of neighbours meets by its two variants. Outlined and dashed share one hairline, a solid member is split by a 1px seam, a ghost member sits 4px away and a link member 8px, and the members that sit apart keep all their corners. The last row has every join in one group."
				>
					<MixedMatrix />
				</ShowcaseSection>

				<ShowcaseSection
					title="Overflow"
					note="The same six members in narrower and narrower frames. Members collapse from the end behind an ellipsis that opens a menu listing exactly the collapsed ones. There is no ellipsis while everything fits, and below the width of one member plus the ellipsis only the ellipsis is left. Drag a frame's corner to watch members collapse and come back."
				>
					<div className={styles.exampleStack}>
						{OVERFLOW_FRAMES.map((frame) => (
							<div key={frame} className={styles.resizableFrame} style={{ width: frame }}>
								<ButtonGroup variant="outlined" color="secondary" size="md" items={MANY_ITEMS} />
							</div>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Overflow with mixed variants"
					note="Members in four variants, in narrower and narrower frames. The ellipsis takes the group's variant and colour, and meets the last member left in the row the way any two neighbours do: a shared hairline, a seam, a gap or a wide gap. A danger member that collapses becomes a danger row in the menu."
				>
					<div className={styles.exampleStack}>
						{OVERFLOW_MIXED_FRAMES.map((frame) => (
							<div key={frame} className={styles.resizableFrame} style={{ width: frame }}>
								<ButtonGroup {...LOOK_OUTLINED} size="md" items={OVERFLOW_MIXED_ITEMS} />
							</div>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Overflow menu"
					note="The menu behind the ellipsis, held open: collapsed members only, label only, right-aligned to the ellipsis, and a danger member as a danger row. Drag the frame's corner and the rows follow the members that collapse. Click anywhere to close the menu. Resizing the frame opens it again."
				>
					<HeldOpenOverflow />
				</ShowcaseSection>

				<ShowcaseSection
					title="Button props on an item"
					note="An item takes every Button prop except size, children, className and style: handlers such as onDoubleClick and onFocus, id, type, aria-* and data-*, textOverflow, width and maxWidth. Double click Rename and focus it to see both in the Actions panel. The second member caps its width and clips its label, the third truncates and shows the full text in a tooltip, and the last sets a width of its own."
				>
					<ButtonGroup
						{...LOOK_OUTLINED}
						size="md"
						items={PASS_THROUGH_ITEMS}
						testId={PASS_THROUGH_TEST_ID}
					/>
				</ShowcaseSection>
			</div>
		</div>
	);
}

function Row({ size }: { size: ButtonGroupProps['size'] }): ReactElement {
	return (
		<>
			<MatrixLabel>{size}</MatrixLabel>
			{STATES.map((state) => (
				<div key={state} data-state-cell={state}>
					<ButtonGroup variant="outlined" color="secondary" size={size} {...stateProps(state)} />
				</div>
			))}
		</>
	);
}

/**
 * Every size, state, composition and overflow step in one snapshot, with the hover and focus cells
 * held by `storybook-addon-pseudo-states` and the overflow menu held open.
 */
export const ButtonGroupShowcase: Story = {
	parameters: {
		layout: 'fullscreen',
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: '[data-state-cell="hover"] [data-slot="button-group-item"][data-position="middle"]',
			focusVisible:
				'[data-state-cell="focus"] [data-slot="button-group-item"][data-position="middle"]',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		for (const { value, start, end } of MIXED_ROW_JOINS) {
			const member = canvas.getByTestId(`${MIXED_ROW_TEST_ID}-item-${value}`);

			await expect(member).toHaveAttribute('data-variant');

			for (const [attribute, join] of [
				['data-join-start', start],
				['data-join-end', end],
			] as const) {
				if (join === undefined) {
					await expect(member).not.toHaveAttribute(attribute);
				} else {
					await expect(member).toHaveAttribute(attribute, join);
				}
			}
		}

		const rename = canvas.getByTestId(`${PASS_THROUGH_TEST_ID}-item-rename`);

		await expect(rename).toHaveAttribute('aria-keyshortcuts', 'F2');
		await expect(rename).toHaveAttribute('data-analytics-id', 'rename-view');

		const menu = await within(document.body).findByRole('menu');

		await expect(within(menu).getAllByRole('menuitem').length).toBeGreaterThan(0);
		await expect(within(menu).getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
			'data-danger',
		);
	},
	render: () => <ButtonGroupShowcaseLayout />,
};

/**
 * Takes the focus ring off whatever the `play` touched last, so the snapshot shows the resting state.
 */
function blurActiveElement(): void {
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}
}

const SECTIONS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'latency', label: 'Latency' },
	{ value: 'errors', label: 'Errors' },
];

const SPLIT_TEST_ID = 'split-button';
const SPLIT_GROUP_LOCKED_TEST_ID = 'split-button-group-locked';
const SPLIT_MENU_LOCKED_TEST_ID = 'split-button-menu-locked';

const onAddPanel = fn();
const onSectionChange = fn();
const onNewSection = fn();

function SplitButton({ testId, lock }: { testId: string; lock?: 'group' | 'menu' }): ReactElement {
	const [section, setSection] = useState('overview');

	const menu: ButtonGroupItemMenuType = {
		side: 'top',
		align: 'end',
		contentMaxWidth: 320,
		items: [
			{
				type: 'group',
				value: 'add-to-section',
				label: 'Add to section',
				items: [
					{
						type: 'radio-group',
						name: 'section',
						value: section,
						onChange: (value) => {
							setSection(value);
							onSectionChange(value);
						},
						items: SECTIONS,
					},
				],
			},
			{ type: 'separator', value: 'before-new-section' },
			{
				type: 'item',
				value: 'new-section',
				label: 'New section',
				prefix: <Plus />,
				onClick: onNewSection,
			},
		],
	};

	const items = [
		{ value: 'add-panel', label: 'Add panel', onClick: onAddPanel },
		{
			value: 'section',
			icon: <ChevronUp />,
			'aria-label': 'Choose section',
			menu,
			...(lock === 'menu'
				? { disabled: true, disabledTooltip: 'Sections are managed by the dashboard owner' }
				: {}),
		},
	] as ButtonGroupItemType[];

	return (
		<ButtonGroup
			{...LOOK_SOLID_PRIMARY}
			size="md"
			items={items}
			testId={testId}
			{...(lock === 'group' ? { disabled: true, disabledTooltip: 'This dashboard is locked' } : {})}
		/>
	);
}

function SplitButtonLayout(): ReactElement {
	return (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				<ShowcaseSection
					title="Split button"
					note="An action and a member that opens a menu. The menu opens above the button, aligned to its end, and holds a radio group under a heading, a separator and one action. Picking a radio keeps the menu open, picking the action closes it."
				>
					<div className={styles.roomAbove}>
						<SplitButton testId={SPLIT_TEST_ID} />
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Blocked"
					note="The menu does not open while the member or the group is disabled. The member stays focusable and says why on hover, and the action beside it follows its own state."
				>
					<div className={styles.exampleStack}>
						<SplitButton testId={SPLIT_GROUP_LOCKED_TEST_ID} lock="group" />
						<SplitButton testId={SPLIT_MENU_LOCKED_TEST_ID} lock="menu" />
					</div>
				</ShowcaseSection>
			</div>
		</div>
	);
}

/**
 * The split button of a "New panel" drawer: an action and a chevron member that opens a menu. Its
 * own story because each `play` step opens a menu, which cannot share a canvas with the held-open
 * overflow menu of the showcase.
 */
export const SplitButtonMenu: Story = {
	parameters: {
		layout: 'fullscreen',
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await waitForEffects();

		onAddPanel.mockClear();
		onSectionChange.mockClear();
		onNewSection.mockClear();

		for (const testId of [SPLIT_GROUP_LOCKED_TEST_ID, SPLIT_MENU_LOCKED_TEST_ID]) {
			const blocked = canvas.getByTestId(`${testId}-item-section`);

			await expect(blocked).toHaveAttribute('aria-disabled', 'true');
			await userEvent.click(blocked);
			await userEvent.unhover(blocked);
		}

		await waitForEffects();
		await expect(body.queryByRole('menu')).not.toBeInTheDocument();

		const chevron = canvas.getByTestId(`${SPLIT_TEST_ID}-item-section`);

		await userEvent.click(chevron);

		const menu = await body.findByRole('menu');

		await expect(within(menu).getByText('Add to section')).toBeInTheDocument();
		await expect(
			within(menu)
				.getAllByRole('menuitemradio')
				.map((row) => row.textContent),
		).toEqual(['Overview', 'Latency', 'Errors']);
		await expect(within(menu).getByRole('menuitemradio', { name: 'Overview' })).toBeChecked();

		await userEvent.click(within(menu).getByRole('menuitemradio', { name: 'Latency' }));

		await waitFor(() =>
			expect(within(menu).getByRole('menuitemradio', { name: 'Latency' })).toBeChecked(),
		);
		await expect(onSectionChange).toHaveBeenCalledTimes(1);
		await expect(onSectionChange).toHaveBeenCalledWith('latency');
		await expect(body.getByRole('menu')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
		await expect(chevron).toHaveFocus();
		await expect(onNewSection).not.toHaveBeenCalled();

		await userEvent.keyboard('{Enter}');

		const reopened = await body.findByRole('menu');

		await userEvent.click(within(reopened).getByRole('menuitem', { name: 'New section' }));

		await expect(onNewSection).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());

		await userEvent.click(canvas.getByTestId(`${SPLIT_TEST_ID}-item-add-panel`));
		await expect(onAddPanel).toHaveBeenCalledTimes(1);
		await expect(body.queryByRole('menu')).not.toBeInTheDocument();

		// Left open, so the snapshot shows the menu with the picked section.
		await userEvent.click(chevron);
		await body.findByRole('menu');
	},
	render: () => <SplitButtonLayout />,
};

const DATA_SOURCES: SelectOptionItemType[] = [
	{ type: 'item', value: 'metrics', label: 'Metrics' },
	{ type: 'item', value: 'logs', label: 'Logs' },
	{ type: 'item', value: 'traces', label: 'Traces' },
];

const QUERY_ROW_TEST_ID = 'query-row';
const PREFIX_ROW_TEST_ID = 'prefix-row';
const BOTH_ROW_TEST_ID = 'both-row';
const BLOCKED_ROW_TEST_ID = 'blocked-row';

const QUERY_ITEMS: ButtonGroupItemType[] = [
	{ value: 'collapse', icon: <ChevronDown />, 'aria-label': 'Collapse query', onClick: noop },
	{ value: 'visibility', icon: <Eye />, 'aria-label': 'Toggle visibility', onClick: noop },
	{ value: 'clone', icon: <Copy />, 'aria-label': 'Clone query', onClick: noop },
	{ value: 'name', label: 'A', onClick: noop },
];

/**
 * The corners and the border of slot content are its own. `edge` names the side of the group the
 * select sits on, which is the side that meets a member.
 */
function DataSourceSelect({
	edge,
	value,
	onChange,
}: {
	edge: 'prefix' | 'suffix';
	value: string;
	onChange: (value: string) => void;
}): ReactElement {
	return (
		<div
			className={`${styles.slotSm} ${edge === 'prefix' ? styles.prefixSelect : styles.suffixSelect}`}
		>
			<Select
				items={DATA_SOURCES}
				value={value}
				onChange={onChange}
				placeholder="Data source"
				aria-label="Data source"
				width="7rem"
			/>
		</div>
	);
}

function FunctionEditor(): ReactElement {
	return (
		<div className={styles.suffixEditor}>
			<Input
				size="sm"
				aria-label="Function"
				placeholder="Add function"
				prefix={<FunctionIcon />}
				width="9rem"
			/>
		</div>
	);
}

function QueryGroup({
	testId,
	slots,
	blocked = false,
}: {
	testId: string;
	slots: 'suffix' | 'prefix' | 'both';
	blocked?: boolean;
}): ReactElement {
	const [source, setSource] = useState('metrics');

	const select = (
		<DataSourceSelect
			edge={slots === 'suffix' ? 'suffix' : 'prefix'}
			value={source}
			onChange={setSource}
		/>
	);
	const slotProps: Pick<ButtonGroupProps, 'prefix' | 'suffix'> =
		slots === 'suffix'
			? {
					suffix: (
						<div className={styles.suffixRow}>
							{select}
							<FunctionEditor />
						</div>
					),
				}
			: slots === 'prefix'
				? { prefix: select }
				: { prefix: select, suffix: <FunctionEditor /> };

	return (
		<ButtonGroup
			{...LOOK_OUTLINED}
			size="sm"
			items={QUERY_ITEMS}
			testId={testId}
			{...slotProps}
			{...(blocked ? { disabled: true, disabledTooltip: 'This query is locked' } : {})}
		/>
	);
}

function PrefixAndSuffixLayout(): ReactElement {
	return (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				<ShowcaseSection
					title="Suffix"
					note="A query builder row: the members first, then the content of the query. The suffix is a select and a small editor. It squares the corners it shares with the last member and drops its start border, since the member keeps its end border."
				>
					<QueryGroup testId={QUERY_ROW_TEST_ID} slots="suffix" />
				</ShowcaseSection>

				<ShowcaseSection
					title="Prefix"
					note="The prefix leads the group. The first member drops its start border, so the prefix draws the line they share: it keeps its own border and squares the end corners."
				>
					<QueryGroup testId={PREFIX_ROW_TEST_ID} slots="prefix" />
				</ShowcaseSection>

				<ShowcaseSection
					title="Prefix and suffix"
					note="Both slots on one group. They never collapse, so a narrow container takes members away and leaves them as they are."
				>
					<QueryGroup testId={BOTH_ROW_TEST_ID} slots="both" />
				</ShowcaseSection>

				<ShowcaseSection
					title="Blocked group"
					note="disabled and loading reach the members and not the slots: the select and the editor stay usable."
				>
					<QueryGroup testId={BLOCKED_ROW_TEST_ID} slots="suffix" blocked />
				</ShowcaseSection>
			</div>
		</div>
	);
}

/**
 * A query builder row with `prefix` and `suffix` content from the library, here a `Select` and an
 * `Input`. Their own corners and border come from the story's CSS module.
 */
export const PrefixAndSuffix: Story = {
	parameters: {
		layout: 'fullscreen',
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await waitForEffects();

		const suffix = canvas.getByTestId(`${QUERY_ROW_TEST_ID}-suffix`);

		await expect(suffix).toHaveAttribute('data-slot', 'button-group-suffix');
		await expect(suffix).toHaveAttribute('data-join-start', 'shared');
		await expect(suffix.previousElementSibling).toBe(
			canvas.getByTestId(`${QUERY_ROW_TEST_ID}-item-name`),
		);

		const dataSource = within(suffix).getByRole('combobox', { name: 'Data source' });

		await expect(dataSource).toHaveTextContent('Metrics');
		await userEvent.click(dataSource);
		await userEvent.click(await body.findByRole('option', { name: 'Logs' }));
		await waitFor(() => expect(dataSource).toHaveTextContent('Logs'));

		const editor = within(suffix).getByRole('textbox', { name: 'Function' });

		await userEvent.type(editor, 'rate');
		await expect(editor).toHaveValue('rate');

		const prefix = canvas.getByTestId(`${PREFIX_ROW_TEST_ID}-prefix`);

		await expect(prefix).toHaveAttribute('data-slot', 'button-group-prefix');
		await expect(prefix).toHaveAttribute('data-join-end', 'shared');
		await expect(prefix.nextElementSibling).toBe(
			canvas.getByTestId(`${PREFIX_ROW_TEST_ID}-item-collapse`),
		);

		const prefixSource = within(prefix).getByRole('combobox', { name: 'Data source' });

		await userEvent.click(prefixSource);
		await userEvent.click(await body.findByRole('option', { name: 'Traces' }));
		await waitFor(() => expect(prefixSource).toHaveTextContent('Traces'));

		await expect(canvas.getByTestId(`${BOTH_ROW_TEST_ID}-prefix`)).toBeInTheDocument();
		await expect(canvas.getByTestId(`${BOTH_ROW_TEST_ID}-suffix`)).toBeInTheDocument();

		const blocked = canvas.getByTestId(BLOCKED_ROW_TEST_ID);

		for (const member of within(blocked).getAllByRole('button')) {
			await expect(member).toHaveAttribute('aria-disabled', 'true');
		}

		const blockedSource = within(canvas.getByTestId(`${BLOCKED_ROW_TEST_ID}-suffix`)).getByRole(
			'combobox',
			{ name: 'Data source' },
		);

		await expect(blockedSource).not.toHaveAttribute('aria-disabled');
		await userEvent.click(blockedSource);
		await userEvent.click(await body.findByRole('option', { name: 'Traces' }));
		await waitFor(() => expect(blockedSource).toHaveTextContent('Traces'));

		blurActiveElement();
	},
	render: () => <PrefixAndSuffixLayout />,
};

const SLOTS_FRAMES = [
	{ width: '40rem', testId: 'slots-wide', title: 'Room for everything' },
	{ width: '24rem', testId: 'slots-narrow', title: 'Narrow' },
];

const onExportCsv = fn();
const onExportJson = fn();

const SLOTS_ITEMS: ButtonGroupItemType[] = [
	...QUERY_ITEMS,
	{
		value: 'export',
		label: 'Export',
		suffix: <ChevronDown />,
		menu: {
			side: 'bottom',
			align: 'end',
			items: [
				{ type: 'item', value: 'csv', label: 'Export as CSV', onClick: onExportCsv },
				{ type: 'item', value: 'json', label: 'Export as JSON', onClick: onExportJson },
			],
		},
	},
];

function SlotsWithOverflowLayout(): ReactElement {
	const [source, setSource] = useState('metrics');

	return (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				<ShowcaseSection
					title="Slots and overflow"
					note="The prefix and the suffix stay in the row while the members collapse from the end. The Export member opens a menu, and once it collapses it becomes a submenu row of the overflow menu, with the same rows. Drag a frame's corner to resize it."
				>
					<div className={`${styles.exampleStack} ${styles.roomBelow}`}>
						{SLOTS_FRAMES.map(({ width, testId, title }) => (
							<div key={testId} className={styles.slotsFrame}>
								<MatrixLabel>{title}</MatrixLabel>
								<div className={styles.resizableFrame} style={{ width }}>
									<ButtonGroup
										{...LOOK_OUTLINED}
										size="sm"
										items={SLOTS_ITEMS}
										testId={testId}
										prefix={<DataSourceSelect edge="prefix" value={source} onChange={setSource} />}
										suffix={<FunctionEditor />}
									/>
								</div>
							</div>
						))}
					</div>
				</ShowcaseSection>
			</div>
		</div>
	);
}

/**
 * Menu members and slots in a container too narrow for them. Its own story because the `play`
 * opens the overflow menu and a submenu.
 */
export const SlotsWithOverflow: Story = {
	parameters: {
		layout: 'fullscreen',
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await waitForEffects();
		onExportCsv.mockClear();
		onExportJson.mockClear();

		const narrow = canvas.getByTestId('slots-narrow');

		await waitFor(() => expect(narrow).toHaveAttribute('data-overflowing'));
		await expect(canvas.getByTestId('slots-wide')).not.toHaveAttribute('data-overflowing');

		await expect(canvas.getByTestId('slots-narrow-prefix')).toBeInTheDocument();
		await expect(canvas.getByTestId('slots-narrow-suffix')).toBeInTheDocument();

		// The members collapse from the end, so the menu member is the first to go.
		await expect(within(narrow).queryByRole('button', { name: 'Export' })).not.toBeInTheDocument();

		await userEvent.click(canvas.getByTestId('slots-narrow-overflow'));

		const menu = await body.findByRole('menu');
		const submenuRow = within(menu).getByRole('menuitem', { name: 'Export' });

		await expect(submenuRow).toHaveAttribute('data-testid', 'slots-narrow-item-export');
		await expect(submenuRow).toHaveAttribute('aria-haspopup', 'menu');
		await userEvent.click(submenuRow);

		await userEvent.click(await body.findByRole('menuitem', { name: 'Export as CSV' }));

		await expect(onExportCsv).toHaveBeenCalledTimes(1);
		await expect(onExportJson).not.toHaveBeenCalled();
		await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());

		const wideExport = canvas.getByTestId('slots-wide-item-export');

		await userEvent.click(wideExport);
		await userEvent.click(await body.findByRole('menuitem', { name: 'Export as JSON' }));

		await expect(onExportJson).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());

		blurActiveElement();
	},
	render: () => <SlotsWithOverflowLayout />,
};
