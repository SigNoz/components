import {
	Calendar,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Code,
	Star,
} from '@signozhq/icons';
import {
	ButtonGroup,
	ButtonGroupColor,
	type ButtonGroupItemType,
	type ButtonGroupProps,
	ButtonGroupSize,
	ButtonGroupTextOverflow,
	ButtonGroupVariant,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	Fragment,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
} from 'react';
import { expect, fn, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './button-group.stories.module.css';

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
	{ value: 'previous', icon: <ChevronLeft />, ariaLabel: 'Previous page', onClick: noop },
	{ value: 'code', icon: <Code />, ariaLabel: 'View source', onClick: noop },
	{ value: 'next', icon: <ChevronRight />, ariaLabel: 'Next page', onClick: noop },
];

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
			description: '`outlined` is the only variant a group is built from.',
			table: { category: 'Appearance' },
		},
		color: {
			control: 'select',
			options: Object.values(ButtonGroupColor),
			description: '`secondary` is the only colour drawn today.',
			table: { category: 'Appearance' },
		},
		size: {
			control: 'select',
			options: Object.values(ButtonGroupSize),
			description: 'Shared by every member. `sm` is 24px tall, `md` is 32px.',
			table: { category: 'Appearance' },
		},
		items: {
			control: 'object',
			description: 'The members, in order. Members that do not fit collapse from the end.',
			table: { category: 'Content', type: { summary: 'ButtonGroupItemType[]' } },
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
	render: (args) => <ButtonGroup {...(args as ButtonGroupProps)} />,
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

function CompositionMatrix({ rows }: { rows: CompositionRow[] }): ReactElement {
	return (
		<div className={`${styles.matrix} ${styles.compositionMatrix}`}>
			<span />
			{COMPOSITION_STATES.map((state) => (
				<Typography key={state} size="sm" weight="medium" className={styles.matrixLabel}>
					{state}
				</Typography>
			))}
			{rows.map(({ name, items }) => (
				<Fragment key={name}>
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						{name}
					</Typography>
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
			<Typography size="sm" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm" className={styles.compositionNote}>
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
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm" className={styles.sectionNote}>
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

const HELD_OPEN_ITEMS = MANY_ITEMS.map((item) => ({
	...item,
	onClick: fn(),
})) as ButtonGroupItemType[];

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
					note="One row per size, one column per state. Hover and focus are held on the middle member, so each cell shows the state beside two plain neighbours: the raised member owns the shared hairline, and its ring keeps its own square corners. Disabled members hatch both edges, loading ones swap their prefix for a spinner."
				>
					<div className={styles.matrix}>
						<span />
						{STATES.map((state) => (
							<Typography key={state} size="sm" weight="medium" className={styles.matrixLabel}>
								{state}
							</Typography>
						))}
						{Object.values(ButtonGroupSize).map((size) => (
							<Row key={size} size={size} />
						))}
					</div>
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
							note="A label past its 120px cap truncates and shows the full text in a tooltip. An empty label falls back to <No label> rather than hiding the action. A single member keeps all four corners."
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
								items={RANGE_ITEMS.slice(0, 1)}
							/>
						</CompositionGroup>
					</div>
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
					title="Overflow menu"
					note="The menu behind the ellipsis, held open: collapsed members only, label only, right-aligned to the ellipsis. Drag the frame's corner and the rows follow the members that collapse. Click anywhere to close the menu. Resizing the frame opens it again."
				>
					<HeldOpenOverflow />
				</ShowcaseSection>
			</div>
		</div>
	);
}

function Row({ size }: { size: ButtonGroupProps['size'] }): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.matrixLabel}>
				{size}
			</Typography>
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
	play: async () => {
		const menu = await within(document.body).findByRole('menu');

		await expect(within(menu).getAllByRole('menuitem').length).toBeGreaterThan(0);
	},
	render: () => <ButtonGroupShowcaseLayout />,
};
