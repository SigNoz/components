import { Search } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	Popover,
	Typography,
	usePopoverHandle,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './popover.stories.module.css';
import { waitForEffects } from './shared/play.js';

const VIEWS = [
	{ name: 'Checkout latency', owner: 'You' },
	{ name: 'Error budget', owner: 'Platform' },
	{ name: 'Deploy markers', owner: 'You' },
];

const SOURCED_VARIABLES = [
	{ name: 'service.name', source: 'Query variable' },
	{ name: 'deployment.environment', source: 'Dashboard variable' },
	{ name: 'timestamp_start', source: 'Global timestamp' },
	{ name: 'timestamp_end', source: 'Global timestamp' },
];

/**
 * Puts `{{name}}` where the caret was, which is the whole point of tracking it: appending to the
 * end would land the token in the wrong half of a URL.
 */
function insertAtCursor(value: string, token: string, cursor: number): string {
	return `${value.slice(0, cursor)}${token}${value.slice(cursor)}`;
}

const VARIABLES = [
	'service.name',
	'deployment.environment',
	'http.status_code',
	'k8s.namespace.name',
];

const TRIGGER = {
	variant: ButtonVariant.Outlined,
	color: ButtonColor.Secondary,
	size: 'md',
} as const;

const meta: Meta<typeof Popover> = {
	title: 'Composed Components/Popover',
	component: Popover,
	args: {
		side: 'bottom',
		align: 'start',
		nativeButton: true,
	},
	argTypes: {
		children: {
			control: false,
			description:
				'The popup content. The shell has no padding, so the content owns all of it, edge to edge.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		trigger: {
			control: false,
			description:
				'The trigger. Rendered as the element you pass, with the popover props merged into it. Required unless a `handle` is passed, since otherwise nothing could open the popup.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
			description:
				'Which side of the anchor the popup opens against. Required. May change on its own to avoid the edges of the viewport.',
			table: { category: 'Appearance', type: { summary: 'top | bottom | left | right' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description:
				'How the popup is aligned along that side. Required, for the same reason as `side`.',
			table: { category: 'Appearance', type: { summary: 'start | center | end' } },
		},
		nativeButton: {
			control: 'boolean',
			description:
				'Whether the trigger renders a native `<button>`. Required: the value has to match the element, and a default of `true` is silently wrong for anything that is not a button.',
			table: { category: 'Content', type: { summary: 'boolean' } },
		},
		handle: {
			control: false,
			description:
				'A handle from `usePopoverHandle()`, for showing the popup from application state: `showAt(target, payload)` places it against an element, a rect or a point, and `close()` dismisses it. There is no `open` prop.',
			table: { category: 'State', type: { summary: 'PopoverHandle<Payload>' } },
		},
		openOnHover: {
			control: 'boolean',
			description:
				'Also opens while the pointer rests on the trigger. The popup stays interactive, so the pointer can travel into it.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		delay: {
			control: 'number',
			description: 'How long the pointer has to rest before a hover popover opens, in ms.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '300' },
			},
		},
		closeDelay: {
			control: 'number',
			description: 'How long a hover popover waits before closing once the pointer leaves, in ms.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '0' },
			},
		},
		width: {
			control: 'text',
			description:
				'The popup width, written as `--popover-internal-inline-size`. A number is read as pixels.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: 'fit-content' },
			},
		},
		maxWidth: {
			control: 'text',
			description: 'How wide the popup may get.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '25rem' },
			},
		},
		maxHeight: {
			control: 'text',
			description: 'How tall the popup may get. Past it, the content scrolls.',
			table: { category: 'Appearance', type: { summary: 'number | string' } },
		},
		anchor: { control: false, table: { category: 'Behavior' } },
		container: { control: false, table: { category: 'Behavior' } },
		initialFocus: { control: false, table: { category: 'Behavior' } },
		finalFocus: { control: false, table: { category: 'Behavior' } },
		onOpenChange: { control: false, table: { category: 'Events' } },
		testId: { control: 'text', table: { category: 'Testing' } },
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'A floating panel hung off a trigger. It opens on a click; the popup is a `role="dialog"` that moves focus in, traps nothing, and closes on Escape. The shell carries zero padding: the content owns all of it, edge to edge.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=7067-6&m=dev',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Popover>;

/**
 * A line of instruction above a story, so what to do with it is not a guess.
 */
function Hint({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography size="sm" className={styles.hint}>
			{children}
		</Typography>
	);
}

/**
 * What the last interaction did. A showcase that swallows every click reads as a broken popover.
 */
function Result({ children }: { children?: string }): ReactElement {
	return (
		<Typography size="sm" className={children === undefined ? styles.resultEmpty : styles.result}>
			{children ?? 'Nothing picked yet.'}
		</Typography>
	);
}

function popup(testId: string): HTMLElement {
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}-popup"]`);

	if (node === null) {
		throw new Error(`Popover: no popup named "${testId}-popup".`);
	}

	return node;
}

/**
 * The click panel from the Figma example: a pinned search, rows, and an action, in a shell that
 * has no padding of its own.
 */
function ClickPanel(): ReactElement {
	const [query, setQuery] = useState('');
	// Kept here rather than in the story, because the Playground's content is a static arg.
	const [picked, setPicked] = useState<string>();
	const views = VIEWS.filter((view) => view.name.toLowerCase().includes(query.toLowerCase()));

	return (
		<div className={styles.panel}>
			<div className={styles.search}>
				<Input
					aria-label="Find a view"
					placeholder="Find a view"
					prefix={<Search />}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
			</div>
			<ul className={styles.list}>
				{views.length === 0 && (
					<li className={styles.empty}>
						<Typography size="sm">No view matches “{query}”</Typography>
					</li>
				)}
				{views.map((view) => (
					<li key={view.name} className={styles.pickRow}>
						<Button
							variant={ButtonVariant.Ghost}
							color={ButtonColor.Secondary}
							size="md"
							width="100%"
							type="button"
							onClick={() => setPicked(view.name)}
						>
							<div className={styles.pickRowBody}>
								<Typography size="sm" className={styles.pickRowName}>
									{view.name}
								</Typography>
								<Typography size="sm" className={styles.rowMeta}>
									{picked === view.name ? 'Showing' : view.owner}
								</Typography>
							</div>
						</Button>
					</li>
				))}
			</ul>
			<div className={styles.footer}>
				<Button
					variant={ButtonVariant.Ghost}
					color={ButtonColor.Secondary}
					size="md"
					type="button"
					onClick={() => setPicked('Untitled view')}
				>
					Create view
				</Button>
			</div>
		</div>
	);
}

/**
 * The playground the Controls table drives.
 */
export const Playground: Story = {
	args: {
		testId: 'popover-playground',
		'aria-label': 'Saved views',
		trigger: (
			<Button {...TRIGGER} prefix={<Search />}>
				Saved views
			</Button>
		),
		children: <ClickPanel />,
	},
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Hint>
					Press “Saved views”. The search filters the rows, the shell has no padding of its own, and
					Escape closes it and puts focus back on the trigger.
				</Hint>
				<Story />
			</div>
		),
	],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('popover-playground'));

		await waitFor(() => expect(popup('popover-playground')).toBeVisible());
		expect(
			within(popup('popover-playground')).getByRole('textbox', { name: 'Find a view' }),
		).toBeVisible();

		// The shell resolves its tokens: an unstyled transparent popup means the
		// `--popover-*` hooks are missing from the loaded theme.
		const shell = getComputedStyle(popup('popover-playground'));
		expect(shell.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(shell.boxShadow).not.toBe('none');
		expect(shell.borderBottomWidth).toBe('1px');
		expect(shell.paddingTop).toBe('0px');
	},
};

/**
 * A form that closes only when the save succeeds. The popover cannot know that on its own, so the
 * form calls `handle.close()` once it does.
 */
export const SaveViewForm: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function SaveViewFormStory() {
		const handle = usePopoverHandle();
		const [name, setName] = useState('Checkout latency');
		const [saved, setSaved] = useState<string>();
		// The form is the subject, so the story lands with it open rather than on a button.
		const triggerRef = useRef<HTMLButtonElement>(null);

		useEffect(() => {
			if (triggerRef.current !== null) {
				handle.showAt(triggerRef.current);
			}
		}, [handle]);

		return (
			<div className={styles.roomBelow}>
				<Hint>
					The form closes itself once the save succeeds, which the popover cannot know on its own:
					it calls <code>handle.close()</code>. Cancel closes it the same way.
				</Hint>
				<Popover
					ref={triggerRef}
					nativeButton
					side="bottom"
					align="end"
					handle={handle}
					aria-label="Save view"
					testId="popover-save-view"
					trigger={<Button {...TRIGGER}>Save view</Button>}
				>
					<form
						className={styles.form}
						onSubmit={(event) => {
							event.preventDefault();
							setSaved(name);
							handle.close();
						}}
					>
						<label className={styles.field}>
							<Typography size="sm">Name</Typography>
							<Input
								aria-label="View name"
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</label>
						<div className={styles.actions}>
							<Button
								variant={ButtonVariant.Ghost}
								color={ButtonColor.Secondary}
								size="md"
								type="button"
								onClick={() => handle.close()}
							>
								Cancel
							</Button>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Primary}
								size="md"
								type="submit"
							>
								Save
							</Button>
						</div>
					</form>
				</Popover>
				<Result>{saved === undefined ? undefined : `Saved the view “${saved}”.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		const panel = await waitFor(() => popup('popover-save-view'));
		fireEvent.click(within(panel).getByRole('button', { name: 'Save' }));

		await waitFor(() =>
			expect(document.querySelector('[data-testid="popover-save-view-popup"]')).toBeNull(),
		);

		// Left open: the form is what the story is for, and what the snapshot should show.
		fireEvent.click(canvas.getByTestId('popover-save-view'));
		await waitFor(() => expect(popup('popover-save-view')).toBeVisible());
	},
};

/**
 * Opened from somewhere other than its own trigger, with `handle.showAt`. Escape still closes it,
 * and `close()` works whichever of the two opened it.
 */
export const ShownFromElsewhere: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: function ShownFromElsewhereStory() {
		const handle = usePopoverHandle();
		const [openedBy, setOpenedBy] = useState<string>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Two ways into one popup. Press either button: the handle owns the open state, so a press
					and a <code>showAt</code> cannot disagree, and the popup moves to whichever asked for it.
				</Hint>
				<div className={styles.inlineRow}>
					<Button
						variant={ButtonVariant.Ghost}
						color={ButtonColor.Secondary}
						size="md"
						type="button"
						onClick={(event) => {
							handle.showAt(event.currentTarget);
							setOpenedBy('showAt, from the button beside it');
						}}
					>
						Show from outside
					</Button>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						handle={handle}
						aria-label="Notice"
						testId="popover-shown"
						onOpenChange={(open, details) => {
							if (open && details.reason === 'trigger-press') {
								setOpenedBy('a press on its own trigger');
							}
						}}
						trigger={<Button {...TRIGGER}>Details</Button>}
					>
						<p className={styles.note}>
							Opened by {openedBy ?? 'nothing yet'}, and anchored to whatever asked for it. Escape
							closes it either way.
						</p>
					</Popover>
				</div>
				<Result>{openedBy === undefined ? undefined : `Opened by ${openedBy}.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByRole('button', { name: 'Show from outside' }));

		await waitFor(() => expect(popup('popover-shown')).toBeVisible());
	},
};

const BREAKDOWN = [
	{ key: 'p50', value: '112 ms' },
	{ key: 'p90', value: '318 ms' },
	{ key: 'p99', value: '1.42 s' },
];

/**
 * The hover panel from the Figma example. Unlike a Tooltip the popup stays interactive: the
 * pointer can travel into it to read, select or follow a link.
 */
export const HoverBreakdown: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function HoverBreakdownStory() {
		const [opened, setOpened] = useState<string>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Rest the pointer on the service name. Unlike a tooltip the popup is reachable: move the
					pointer into it and press the button at the bottom.
				</Hint>
				<Popover
					nativeButton
					openOnHover
					side="bottom"
					align="start"
					aria-label="Latency breakdown"
					testId="popover-hover"
					trigger={<Button {...TRIGGER}>checkout-service</Button>}
				>
					<div className={styles.breakdown}>
						{BREAKDOWN.map((entry) => (
							<div key={entry.key} className={styles.pair}>
								<Typography size="sm">{entry.key}</Typography>
								<Typography size="sm" className={styles.pairValue}>
									{entry.value}
								</Typography>
							</div>
						))}
						<Button
							variant={ButtonVariant.Ghost}
							color={ButtonColor.Secondary}
							size="md"
							type="button"
							onClick={() => setOpened('checkout-service')}
						>
							Open in traces
						</Button>
					</div>
				</Popover>
				<Result>{opened === undefined ? undefined : `Opened traces for ${opened}.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		// Base UI opens on a real pointer entering: the three events together stand in for one.
		const trigger = canvas.getByTestId('popover-hover');
		fireEvent.pointerEnter(trigger);
		fireEvent.mouseEnter(trigger);
		fireEvent.mouseMove(trigger);

		const panel = await waitFor(() => popup('popover-hover'), { timeout: 2000 });
		expect(panel).toBeVisible();
		// A hover popover is reachable, which is the whole reason it is not a Tooltip.
		expect(getComputedStyle(panel).pointerEvents).not.toBe('none');
		expect(within(panel).getByRole('button', { name: 'Open in traces' })).toBeVisible();
	},
};

const LATENCY = [
	{ time: '14:00', value: 0.42 },
	{ time: '14:05', value: 0.58 },
	{ time: '14:10', value: 0.51 },
	{ time: '14:15', value: 0.94 },
	{ time: '14:20', value: 0.86 },
	{ time: '14:25', value: 1.24 },
	{ time: '14:30', value: 1.05 },
	{ time: '14:35', value: 1.42 },
	{ time: '14:40', value: 1.31 },
];

const PLOT = { width: 400, height: 160, pad: 14, ceiling: 1.6 };

function plotX(index: number): number {
	return PLOT.pad + index * ((PLOT.width - PLOT.pad * 2) / (LATENCY.length - 1));
}

function plotY(value: number): number {
	return PLOT.height - PLOT.pad - (value / PLOT.ceiling) * (PLOT.height - PLOT.pad * 2);
}

const PLOT_LINE = LATENCY.map((p, i) => `${plotX(i)},${plotY(p.value)}`).join(' ');
const PLOT_AREA = `${plotX(0)},${PLOT.height} ${PLOT_LINE} ${plotX(LATENCY.length - 1)},${PLOT.height}`;

const SPANS = [
	{ id: 'a1', name: 'POST /checkout', duration: '1.42 s', width: '100%' },
	{ id: 'b2', name: 'cart.validate', duration: '318 ms', width: '22%' },
	{ id: 'c3', name: 'payments.charge', duration: '902 ms', width: '63%' },
];

/**
 * One popover serving many rows, which is what a hover card over a waterfall needs. The rows have
 * no triggers of their own: `showAt` names the row and the payload says what to render. Hundreds
 * of rows still render one popup.
 */
export const RowHoverCard: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: function RowHoverCardStory() {
		const card = usePopoverHandle<(typeof SPANS)[number]>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Move the pointer down the rows. One declared popover follows it, swapping its content,
					instead of a popup per row.
				</Hint>
				<div className={styles.rows}>
					{SPANS.map((span) => (
						<div
							key={span.id}
							data-testid={`span-${span.id}`}
							className={styles.spanRow}
							onPointerEnter={(event) => card.showAt(event.currentTarget, span)}
							onPointerLeave={() => card.close()}
						>
							<Typography size="sm">{span.name}</Typography>
							<span className={styles.bar} style={{ inlineSize: span.width }} />
						</div>
					))}
				</div>
				<Popover
					side="right"
					align="start"
					handle={card}
					initialFocus={false}
					aria-label="Span details"
					testId="popover-span-card"
				>
					{(span) => (
						<div className={styles.breakdown}>
							<Typography size="sm">{span?.name}</Typography>
							<div className={styles.pair}>
								<Typography size="sm">Duration</Typography>
								<Typography size="sm" className={styles.pairValue}>
									{span?.duration}
								</Typography>
							</div>
						</div>
					)}
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.pointerOver(canvas.getByTestId('span-b2'));

		await waitFor(() => expect(popup('popover-span-card')).toHaveTextContent('cart.validate'));

		// The same popup moves to the next row rather than a second one opening.
		fireEvent.pointerOver(canvas.getByTestId('span-c3'));
		await waitFor(() => expect(popup('popover-span-card')).toHaveTextContent('payments.charge'));
		expect(document.querySelectorAll('[data-testid="popover-span-card-popup"]')).toHaveLength(1);
	},
};

/**
 * A drilldown menu at the point of a chart click. There is no element under the pointer to hang a
 * trigger off, so `showAt` is given the coordinates the chart reported.
 */
export const ChartDrilldown: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: function ChartDrilldownStory() {
		const menu = usePopoverHandle<(typeof LATENCY)[number]>();
		const [drilled, setDrilled] = useState<string>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					p99 latency, last hour. Click anywhere on the chart: there is no element under the pointer
					to hang a trigger off, so the menu is shown at the coordinates the chart reported, for the
					point nearest to them.
				</Hint>
				<button
					type="button"
					data-testid="plot"
					className={styles.plot}
					onClick={(event) => {
						// The chart reports the point under the pointer; the popup is placed at the
						// pointer itself, where there is no element to hang a trigger off.
						const box = event.currentTarget.getBoundingClientRect();
						const ratio = (event.clientX - box.left) / box.width;
						const index = Math.min(
							LATENCY.length - 1,
							Math.max(0, Math.round(ratio * (LATENCY.length - 1))),
						);

						menu.showAt({ x: event.clientX, y: event.clientY }, LATENCY[index]);
					}}
					aria-label="p99 latency chart, click to drill down"
				>
					<svg className={styles.plotSvg} viewBox="0 0 400 160" aria-hidden="true">
						<title>p99 latency</title>
						<polygon className={styles.plotArea} points={PLOT_AREA} />
						<polyline className={styles.plotLine} points={PLOT_LINE} />
						{LATENCY.map((point, index) => (
							<circle
								key={point.time}
								className={styles.plotPoint}
								cx={plotX(index)}
								cy={plotY(point.value)}
								r="3.5"
							/>
						))}
					</svg>
				</button>
				<Popover
					side="bottom"
					align="start"
					handle={menu}
					aria-label="Drilldown"
					testId="popover-drilldown"
				>
					{(point) => (
						<ul className={styles.list}>
							<li className={styles.drilldownHeader}>
								<Typography size="sm">{point?.time}</Typography>
								<Typography size="sm" className={styles.pairValue}>
									{point === undefined ? '' : `${point.value.toFixed(2)} s`}
								</Typography>
							</li>
							{['View traces', 'View logs'].map((action) => (
								<li key={action} className={styles.suggestion}>
									<Button
										variant={ButtonVariant.Ghost}
										color={ButtonColor.Secondary}
										size="md"
										width="100%"
										type="button"
										onClick={() => {
											setDrilled(point === undefined ? undefined : `${action} at ${point.time}`);
											menu.close();
										}}
									>
										{action}
									</Button>
								</li>
							))}
						</ul>
					)}
				</Popover>
				<Result>{drilled === undefined ? undefined : `${drilled}.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		const plot = canvas.getByTestId('plot');
		const box = plot.getBoundingClientRect();
		// The last point, so the menu has to name that one rather than a fixed string.
		fireEvent.click(plot, { clientX: box.right - 2, clientY: box.top + 20 });

		await waitFor(() => expect(popup('popover-drilldown')).toBeVisible());
		expect(popup('popover-drilldown')).toHaveTextContent('14:40');
		expect(popup('popover-drilldown')).toHaveTextContent('1.31 s');
	},
};

/**
 * Suggestions opened by the field taking focus, the shape a variables typeahead needs. The popup
 * is anchored to the field and `initialFocus` stays false, so the caret never leaves it.
 */
export const SuggestionsOnFocus: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: function SuggestionsOnFocusStory() {
		const suggestions = usePopoverHandle();
		const [query, setQuery] = useState('');
		const field = useRef<HTMLInputElement>(null);

		// Braces are the token syntax, not part of the name being searched for.
		const needle = query.replace(/[{}]/g, '').toLowerCase();
		const matches = VARIABLES.filter((variable) => variable.toLowerCase().includes(needle));

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Click the field. The list opens on focus and narrows as you type, the caret never leaves
					the field, and picking one inserts it. Click anywhere outside to dismiss.
				</Hint>
				<div className={styles.inputRow}>
					<Input
						ref={field}
						aria-label="Query"
						placeholder="Type to filter variables"
						testId="query"
						value={query}
						// Focus is the way in, but a field that is already focused fires no focus
						// event, so a press and a keystroke have to reopen it too. Otherwise the
						// list is gone for good once it has been dismissed.
						onFocus={(event) => suggestions.showAt(event.currentTarget)}
						onClick={(event) => suggestions.showAt(event.currentTarget)}
						onChange={(event) => {
							setQuery(event.target.value);
							suggestions.showAt(event.currentTarget);
						}}
					/>
				</div>
				<Popover
					side="bottom"
					align="start"
					handle={suggestions}
					// Both: on close Base UI restores focus to the field, and a focus event there
					// is what opens the list, so without `finalFocus` it reopens itself the moment
					// an outside press dismisses it.
					initialFocus={false}
					finalFocus={false}
					width={360}
					aria-label="Variables"
					testId="popover-suggestions"
				>
					<ul className={styles.list}>
						{matches.length === 0 && (
							<li className={styles.empty}>
								<Typography size="sm">No variable matches “{needle}”</Typography>
							</li>
						)}
						{matches.map((variable) => (
							<li key={variable} className={styles.suggestion}>
								<Button
									variant={ButtonVariant.Ghost}
									color={ButtonColor.Secondary}
									size="md"
									width="100%"
									type="button"
									onClick={() => {
										setQuery(`{{${variable}}}`);
										suggestions.close();
										field.current?.focus();
									}}
								>
									{variable}
								</Button>
							</li>
						))}
					</ul>
				</Popover>
				<Result>{query === '' ? undefined : `Query is now “${query}”.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		const field = canvas.getByRole('textbox', { name: 'Query' });
		fireEvent.pointerDown(field);
		field.focus();
		fireEvent.click(field);

		await waitFor(() => expect(popup('popover-suggestions')).toBeVisible());
		// The caret stays in the field: it anchors the popup, it does not hand over focus. The
		// press that opened it lands on that same field, and does not dismiss it.
		expect(field).toHaveFocus();
		expect(within(popup('popover-suggestions')).getAllByRole('button')).toHaveLength(4);

		// The list narrows while the popup stays open and the caret stays put.
		fireEvent.change(field, { target: { value: 'k8s' } });
		await waitFor(() =>
			expect(within(popup('popover-suggestions')).getAllByRole('button')).toHaveLength(1),
		);
		expect(field).toHaveFocus();

		fireEvent.click(
			within(popup('popover-suggestions')).getByRole('button', { name: 'k8s.namespace.name' }),
		);
		await waitFor(() => expect(field).toHaveValue('{{k8s.namespace.name}}'));

		// Left open on the full list, so the story lands on what it is for. The field keeps
		// focus after the pick, and a press on an already-focused field fires no focus event.
		fireEvent.change(field, { target: { value: '' } });
		fireEvent.click(field);
		await waitFor(() =>
			expect(within(popup('popover-suggestions')).getAllByRole('button')).toHaveLength(4),
		);
	},
};

/**
 * Inside a dialog the popup portals into the panel, so the dialog's focus trap can reach it.
 */
export const InsideDialog: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function InsideDialogStory() {
		const [open, setOpen] = useState(true);
		const threshold = usePopoverHandle();
		const [picked, setPicked] = useState<string>();

		return (
			<div className={styles.roomBelow}>
				{/* Dismissing the dialog otherwise leaves the story with nothing on it. */}
				<Button {...TRIGGER} onClick={() => setOpen(true)}>
					Open panel settings
				</Button>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent width="base">
						<DialogHeader>
							<DialogTitle>Panel settings</DialogTitle>
						</DialogHeader>
						<div className={styles.dialogBody}>
							<Hint>
								A modal dialog traps focus and turns off pointer events on the body. The popup is
								portalled into the panel instead, so it stays clickable and the keyboard can reach
								it. Pick a threshold.
							</Hint>
							<Popover
								nativeButton
								side="bottom"
								align="start"
								handle={threshold}
								aria-label="Threshold"
								testId="popover-in-dialog"
								trigger={<Button {...TRIGGER}>Set threshold</Button>}
							>
								<ul className={styles.list}>
									{['200 ms', '500 ms', '1 s'].map((value) => (
										<li key={value} className={styles.suggestion}>
											<Button
												variant={ButtonVariant.Ghost}
												color={ButtonColor.Secondary}
												size="md"
												width="100%"
												type="button"
												onClick={() => {
													setPicked(value);
													threshold.close();
												}}
											>
												{value}
											</Button>
										</li>
									))}
								</ul>
							</Popover>
							<Result>{picked === undefined ? undefined : `Threshold set to ${picked}.`}</Result>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	},
	play: async () => {
		await waitForEffects();
		// The dialog portals out of the story canvas and marks that canvas aria-hidden.
		const trigger = document.querySelector<HTMLElement>('[data-testid="popover-in-dialog"]');

		if (trigger === null) {
			throw new Error('Popover: no trigger named "popover-in-dialog".');
		}

		fireEvent.click(trigger);

		await waitFor(() => expect(popup('popover-in-dialog')).toBeVisible());
	},
};

const SERVICES = Array.from(
	{ length: 24 },
	(_, index) => `checkout-service-${String(index).padStart(2, '0')}`,
);

/**
 * Past `maxHeight` the shell scrolls. The content does not have to know the cap.
 */
export const MaxHeightScrolling: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function MaxHeightScrollingStory() {
		const list = usePopoverHandle();
		const [picked, setPicked] = useState<string>();

		return (
			<div className={styles.roomBelow}>
				<Hint>
					Twenty-four services in a popup capped at 160px by <code>maxHeight</code>. The cap is on
					the shell and the list inside it scrolls, so the content never has to know the number.
					Scroll down and pick one to close it.
				</Hint>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					maxHeight={160}
					handle={list}
					aria-label="Services"
					testId="popover-scroll"
					trigger={<Button {...TRIGGER}>Services</Button>}
				>
					<ul className={styles.list}>
						{SERVICES.map((service) => (
							<li key={service} className={styles.pickRow}>
								<Button
									variant={ButtonVariant.Ghost}
									color={ButtonColor.Secondary}
									size="md"
									width="100%"
									type="button"
									onClick={() => {
										setPicked(service);
										list.close();
									}}
								>
									{service}
								</Button>
							</li>
						))}
					</ul>
				</Popover>
				<Result>{picked === undefined ? undefined : `Picked ${picked}.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('popover-scroll'));

		const panel = await waitFor(() => popup('popover-scroll'));
		expect(panel).toBeVisible();
		expect(getComputedStyle(panel).maxBlockSize).not.toBe('none');
	},
};

/**
 * The popup is positioned against the whole input row, while the button stays the thing you click.
 * `initialFocus` stays false so the caret in the field is not stolen.
 */
export const AnchoredTypeahead: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: function AnchoredTypeaheadStory() {
		const row = useRef<HTMLDivElement>(null);
		const field = useRef<HTMLInputElement>(null);
		const variables = usePopoverHandle();
		const [url, setUrl] = useState('/traces?service=&env=prod');
		// Where the token goes. Tracked on every way the caret can move.
		const [cursor, setCursor] = useState(0);
		const trackCursor = (event: { currentTarget: HTMLInputElement }): void =>
			setCursor(event.currentTarget.selectionStart ?? 0);

		return (
			<div className={styles.roomBelow}>
				<Hint>
					The dashboard editor's URL field. The popup hangs off the whole row rather than the field,
					so <code>var(--anchor-width)</code> sizes it to match. Put the caret after
					<code>service=</code>, then pick a variable: the token lands at the caret, not at the end.
				</Hint>
				<div ref={row} data-testid="anchored-row" className={styles.inputRow}>
					<span className={styles.inputRowField}>
						<Input
							ref={field}
							aria-label="Query"
							placeholder="https://… or /path?var={{variable}}"
							value={url}
							onChange={(event) => {
								setCursor(event.target.selectionStart ?? 0);
								setUrl(event.target.value);
							}}
							onFocus={() => row.current !== null && variables.showAt(row.current)}
							onClick={(event) => {
								trackCursor(event);
								if (row.current !== null) {
									variables.showAt(row.current);
								}
							}}
							onKeyUp={trackCursor}
						/>
					</span>
				</div>
				<Popover
					side="bottom"
					align="start"
					handle={variables}
					// The caret belongs to the field the suggestions are for, on the way in and out.
					initialFocus={false}
					finalFocus={false}
					// Both, or the default max width would clamp a wide field's suggestions.
					width="var(--anchor-width)"
					maxWidth="var(--anchor-width)"
					maxHeight={300}
					aria-label="Insert a variable"
					testId="popover-typeahead"
				>
					<ul className={styles.list}>
						{SOURCED_VARIABLES.map((variable) => (
							<li
								key={variable.name}
								className={styles.pickRow}
								// Keeps the caret: without this the press blurs the field first.
								onMouseDown={(event) => event.preventDefault()}
							>
								<Button
									variant={ButtonVariant.Ghost}
									color={ButtonColor.Secondary}
									size="md"
									width="100%"
									type="button"
									onClick={() => {
										const token = `{{${variable.name}}}`;
										setUrl((current) => insertAtCursor(current, token, cursor));
										setCursor((at) => at + token.length);
										variables.close();
										field.current?.focus();
									}}
								>
									<div className={styles.pickRowBody}>
										<Typography size="sm" className={styles.pickRowName}>
											{`{{${variable.name}}}`}
										</Typography>
										<Typography size="sm" className={styles.rowMeta}>
											{variable.source}
										</Typography>
									</div>
								</Button>
							</li>
						))}
					</ul>
				</Popover>
				<Result>{`URL is now “${url}”.`}</Result>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		const field = canvas.getByRole<HTMLInputElement>('textbox', { name: 'Query' });

		// The caret goes right after `service=`, which is where the token has to land.
		const at = '/traces?service='.length;
		field.focus();
		field.setSelectionRange(at, at);
		fireEvent.keyUp(field);

		const panel = await waitFor(() => popup('popover-typeahead'));
		// The caret stays in the field: the popup is anchored to the row, not focused.
		expect(field).toHaveFocus();
		// `var(--anchor-width)` sizes the popup to the row it hangs off.
		expect(Math.round(panel.getBoundingClientRect().width)).toBe(
			Math.round(canvas.getByTestId('anchored-row').getBoundingClientRect().width),
		);

		fireEvent.click(within(panel).getByRole('button', { name: /service\.name/ }));

		// Inserted at the caret, not appended: the `env=prod` half survives.
		await waitFor(() => expect(field).toHaveValue('/traces?service={{service.name}}&env=prod'));
	},
};
