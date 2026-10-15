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
import { type ReactElement, useRef, useState } from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './popover.stories.module.css';
import { waitForEffects } from './shared/play.js';

const VIEWS = [
	{ name: 'Checkout latency', owner: 'You' },
	{ name: 'Error budget', owner: 'Platform' },
	{ name: 'Deploy markers', owner: 'You' },
];

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
				{views.map((view) => (
					<li key={view.name} className={styles.row}>
						<Typography size="sm">{view.name}</Typography>
						<Typography size="sm" className={styles.rowMeta}>
							{view.owner}
						</Typography>
					</li>
				))}
			</ul>
			<div className={styles.footer}>
				<Button variant={ButtonVariant.Ghost} color={ButtonColor.Secondary} size="md">
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

		return (
			<div className={styles.roomBelow}>
				<Popover
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
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('popover-save-view'));

		const panel = await waitFor(() => popup('popover-save-view'));
		fireEvent.click(within(panel).getByRole('button', { name: 'Save' }));

		await waitFor(() =>
			expect(document.querySelector('[data-testid="popover-save-view-popup"]')).toBeNull(),
		);
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

		return (
			<div className={styles.roomBelow}>
				<Button
					variant={ButtonVariant.Ghost}
					color={ButtonColor.Secondary}
					size="md"
					type="button"
					onClick={(event) => handle.showAt(event.currentTarget)}
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
					trigger={<Button {...TRIGGER}>Details</Button>}
				>
					<p className={styles.row}>Shown against whichever button asked for it.</p>
				</Popover>
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
	render: () => (
		<div className={styles.roomBelow}>
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
					<Button variant={ButtonVariant.Ghost} color={ButtonColor.Secondary} size="md">
						Open in traces
					</Button>
				</div>
			</Popover>
		</div>
	),
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
					nativeButton
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
		const menu = usePopoverHandle<{ x: number; y: number }>();

		return (
			<div className={styles.roomBelow}>
				<button
					type="button"
					data-testid="plot"
					className={styles.plot}
					onClick={(event) => menu.showAt({ x: event.clientX, y: event.clientY }, { x: 1, y: 2 })}
					aria-label="Latency chart"
				/>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					handle={menu}
					aria-label="Drilldown"
					testId="popover-drilldown"
				>
					<ul className={styles.list}>
						<li className={styles.row}>
							<Typography size="sm">View traces</Typography>
						</li>
						<li className={styles.row}>
							<Typography size="sm">View logs</Typography>
						</li>
					</ul>
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('plot'), { clientX: 180, clientY: 120 });

		await waitFor(() => expect(popup('popover-drilldown')).toBeVisible());
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

		return (
			<div className={styles.roomBelow}>
				<div className={styles.inputRow}>
					<Input
						aria-label="Query"
						placeholder="Type {{ to insert a variable"
						testId="query"
						onFocus={(event) => suggestions.showAt(event.currentTarget)}
						onBlur={() => suggestions.close()}
					/>
				</div>
				<Popover
					nativeButton
					side="bottom"
					align="start"
					handle={suggestions}
					initialFocus={false}
					width={360}
					aria-label="Variables"
					testId="popover-suggestions"
				>
					<ul className={styles.list}>
						{VARIABLES.map((variable) => (
							<li key={variable} className={styles.row}>
								<Typography size="sm">{variable}</Typography>
							</li>
						))}
					</ul>
				</Popover>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		const field = canvas.getByRole('textbox', { name: 'Query' });
		field.focus();

		await waitFor(() => expect(popup('popover-suggestions')).toBeVisible());
		// The caret stays in the field: it anchors the popup, it does not hand over focus.
		expect(field).toHaveFocus();
	},
};

/**
 * Inside a dialog the popup portals into the panel, so the dialog's focus trap can reach it.
 */
export const InsideDialog: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => (
		<Dialog defaultOpen>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle>Panel settings</DialogTitle>
				</DialogHeader>
				<div className={styles.dialogBody}>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						aria-label="Threshold"
						testId="popover-in-dialog"
						trigger={<Button {...TRIGGER}>Set threshold</Button>}
					>
						<p className={styles.row}>The popup is portalled into the dialog panel.</p>
					</Popover>
				</div>
			</DialogContent>
		</Dialog>
	),
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
	render: () => (
		<div className={styles.roomBelow}>
			<Popover
				nativeButton
				side="bottom"
				align="start"
				maxHeight={160}
				aria-label="Services"
				testId="popover-scroll"
				trigger={<Button {...TRIGGER}>Services</Button>}
			>
				<ul className={styles.list}>
					{SERVICES.map((service) => (
						<li key={service} className={styles.row}>
							<Typography size="sm">{service}</Typography>
						</li>
					))}
				</ul>
			</Popover>
		</div>
	),
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

		return (
			<div className={styles.roomBelow}>
				<div ref={row} className={styles.inputRow}>
					<Input aria-label="Query" placeholder="service.name" />
					<Popover
						nativeButton
						side="bottom"
						align="start"
						anchor={row}
						initialFocus={false}
						width={360}
						aria-label="Variables"
						testId="popover-typeahead"
						trigger={<Button {...TRIGGER}>Variables</Button>}
					>
						<ul className={styles.list}>
							{VARIABLES.map((variable) => (
								<li key={variable} className={styles.row}>
									<Typography size="sm">{variable}</Typography>
								</li>
							))}
						</ul>
					</Popover>
				</div>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		expect(canvas.getByRole('textbox', { name: 'Query' })).not.toHaveFocus();
		fireEvent.click(canvas.getByTestId('popover-typeahead'));

		await waitFor(() => expect(popup('popover-typeahead')).toBeVisible());
		expect(canvas.getByRole('textbox', { name: 'Query' })).not.toHaveFocus();
	},
};
