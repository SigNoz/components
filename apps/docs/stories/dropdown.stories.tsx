import {
	BookOpen,
	Bookmark,
	Copy,
	Ellipsis,
	ExternalLink,
	FileDown,
	Pencil,
	Share2,
	Star,
	Trash,
} from '@signozhq/icons';
import {
	Badge,
	Button,
	ButtonColor,
	ButtonVariant,
	Dropdown,
	type DropdownItemType,
	toast,
	Toaster,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './dropdown.stories.module.css';

const meta: Meta<typeof Dropdown> = {
	title: 'Composed Components/Dropdown',
	component: Dropdown,
	args: {
		side: 'bottom',
		align: 'start',
		nativeButton: true,
		loading: false,
		disabled: false,
	},
	argTypes: {
		items: {
			control: false,
			description:
				'The rows, in render order. Seven kinds, told apart by a required `type`: `item`, `link`, `checkbox`, `radio-group`, `submenu`, `group` and `separator`. An empty list renders the `noContent` row, and warns when `noContent` is not set.',
			table: { category: 'Content', type: { summary: 'DropdownItemType[]' } },
		},
		children: {
			control: false,
			description:
				'The trigger. Rendered as the element you pass, with the menu props merged into it, so it keeps its own type, `disabled` and tooltip.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
			description:
				'Which side of the trigger the popup opens against. Required: placement is never incidental. The logical values mirror under RTL.',
			table: { category: 'Layout', type: { summary: 'Side' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description:
				'How the popup is aligned along that side. Required, for the same reason as `side`.',
			table: { category: 'Layout', type: { summary: 'Align' } },
		},
		contentMaxWidth: {
			control: 'text',
			description:
				'How wide the popup may get, written as `--dropdown-internal-max-inline-size`. A number is read as pixels.',
			table: {
				category: 'Layout',
				type: { summary: 'number | string' },
				defaultValue: { summary: '15.75rem' },
			},
		},
		contentMaxHeight: {
			control: 'text',
			description:
				'How tall the scrolling part may get. Caps the rows alone: the search row stays pinned above them.',
			table: {
				category: 'Layout',
				type: { summary: 'number | string' },
				defaultValue: { summary: '20rem' },
			},
		},
		container: {
			control: false,
			description:
				'The element the popup is portalled into. Pass the dialog or drawer element to keep the menu inside it.',
			table: { category: 'Layout', type: { summary: 'HTMLElement | RefObject' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Keeps the menu from opening, and marks the trigger `aria-disabled` and `data-disabled`. Not the native `disabled`, so the trigger stays hoverable and focusable and the reason stays reachable. Requires `disabledTooltip`.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the menu cannot be opened, shown in a tooltip on the trigger while `disabled` is true. Only allowed alongside `disabled`.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		loading: {
			control: 'boolean',
			description:
				'Replaces the rows with `loadingContent` or a spinner. The search row survives, so a query can still be typed.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loadingContent: {
			control: false,
			description: 'What to show in place of the rows while `loading`. Defaults to a spinner.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		noContent: {
			control: false,
			description:
				'What the non-interactive row shows when there is nothing to list: an empty `items`, or a query that matches nothing. Setting it silences the empty `items` warning. Submenus keep `<No content>`.',
			table: {
				category: 'State',
				type: { summary: 'ReactNode' },
				defaultValue: { summary: "'<No content>'" },
			},
		},
		searchInputProps: {
			control: false,
			description:
				'The pinned search row. Passing the object is what renders it, so `{}` is a search row with every default. Holds `placeholder`, `prefix`, `suffix`, `loading`, `filter` and `onChange`.',
			table: { category: 'Behavior', type: { summary: 'DropdownSearchInputProps' } },
		},
		onOpenChange: {
			control: false,
			description:
				'Called when the menu opens and when it closes. The menu owns its open state: this reports it, it does not drive it.',
			table: { category: 'Behavior', type: { summary: '(open: boolean) => void' } },
		},
		nativeButton: {
			control: false,
			description:
				'Required. Whether the trigger renders a native `<button>`. `true` for `Button` or a plain `<button>`, whose role and keyboard handling come from the browser. Set it to `false` for anything else, such as `Badge`, and Base UI adds `role="button"`, `tabIndex` and the `Enter` and `Space` handlers. The value has to match the element: Base UI logs an error on a mismatch in either direction.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		id: { control: 'text', table: { category: 'Styling' } },
		className: { control: 'text', table: { category: 'Styling' } },
		style: { control: false, table: { category: 'Styling' } },
		testId: { control: 'text', table: { category: 'Testing' } },
	},
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'A menu built from an `items` array, hung off a trigger you provide. It filters itself, truncates long labels into a tooltip, and decides when to close from what `onClick` returns.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-745',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/**
 * The trigger every story hangs its menu off.
 *
 * Spread onto a `Button` rather than wrapped in a component of its own: the menu merges its props
 * into the element it is given, and a function component in between would swallow them, `testId`
 * included.
 */
const TRIGGER_PROPS = {
	variant: ButtonVariant.Outlined,
	color: ButtonColor.Secondary,
	size: 'md',
} as const;

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

const DEFAULT_ITEMS: DropdownItemType[] = [
	{ type: 'item', value: 'rename', label: 'Rename', prefix: <Pencil />, shortcut: 'R' },
	{ type: 'item', value: 'pin', label: 'Pin to the top', prefix: <Bookmark /> },
	{
		type: 'item',
		value: 'copy',
		label: 'Copy link (returns false, so the menu stays open)',
		prefix: <Copy />,
		onClick: () => false,
	},
	{
		type: 'item',
		value: 'publish',
		label: 'Publish (rejects, so it raises a toast)',
		onClick: async () => {
			await wait(1200);
			throw new Error('The workspace is read only');
		},
	},
	{ type: 'separator', value: 'before-danger' },
	{
		type: 'item',
		value: 'delete',
		label: 'Delete',
		prefix: <Trash />,
		danger: true,
		onClick: () => wait(1200),
	},
];

/**
 * The playground the Controls table drives. Two rows are async, so the closing contract can be
 * watched: `Publish` rejects into a toast, and `Delete` holds the list until it resolves.
 */
export const Default: Story = {
	args: {
		items: DEFAULT_ITEMS,
		testId: 'dropdown-default',
		children: <Button {...TRIGGER_PROPS}>Actions</Button>,
		onOpenChange: fn(),
	},
	parameters: {
		// Every state the menu can be driven into is held open at once by `DropdownShowcase`.
		chromatic: { disableSnapshot: true },
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Toaster />
				<Story />
			</div>
		),
	],
};

/**
 * Every way an async `onClick` can end, on rows you can actually click.
 *
 * `DropdownShowcase` holds the in-flight frame still for the snapshot, so it can only ever show the
 * spinner. The contract is about what happens *after* that frame, which needs promises that settle:
 *
 * | The row | Its promise | What the menu does |
 * |---|---|---|
 * | Deploy | resolves `undefined` | closes |
 * | Deploy and stay | resolves `false` | stays open |
 * | Publish | rejects | stays open, and the component raises `toast.error` itself |
 *
 * Each row also raises a toast of its own as it starts and finishes, so the order is legible: the
 * whole list goes inert while any one of them is in flight. The error toast on `Publish` is the
 * component's, not this story's, which is why it needs the `<Toaster />` mounted below.
 */
export const AsyncOutcomes: Story = {
	parameters: {
		// Promises that settle on a timer cannot be snapshotted without racing the capture.
		chromatic: { disableSnapshot: true },
	},
	decorators: [
		(Story): ReactElement => (
			<div className={styles.roomBelow}>
				<Toaster />
				<Story />
			</div>
		),
	],
	args: {
		testId: 'dropdown-async',
		children: <Button {...TRIGGER_PROPS}>Run something</Button>,
		items: [
			{
				type: 'item',
				value: 'deploy',
				label: 'Deploy (resolves, so the menu closes)',
				onClick: async () => {
					toast.info('Deploying…');
					await wait(1200);
					toast.success('Deployed');
				},
			},
			{
				type: 'item',
				value: 'deploy-stay',
				label: 'Deploy and stay (resolves false, so the menu stays open)',
				onClick: async () => {
					toast.info('Deploying, keeping the menu open…');
					await wait(1200);
					toast.success('Deployed, and the menu is still here');

					return false;
				},
			},
			{
				type: 'item',
				value: 'publish',
				label: 'Publish (rejects, so the component raises a toast)',
				onClick: async () => {
					toast.info('Publishing…');
					await wait(1200);
					throw new Error('The workspace is read only');
				},
			},
			{ type: 'separator', value: 'before-sync' },
			{
				type: 'item',
				value: 'rollback',
				label: 'Roll back (synchronous, closes at once)',
				prefix: <Copy />,
			},
		],
	},
};

/**
 * Never settles, so the row it belongs to stays in `data-pending` and holds its menu inert for
 * the snapshot.
 */
const PENDING_FOREVER: Promise<void> = new Promise(() => {
	// The showcase wants the in-flight frame, so this deliberately never resolves.
});

const SERVICE_ITEMS: DropdownItemType[] = Array.from({ length: 24 }, (_, index) => ({
	type: 'item' as const,
	value: `service-${String(index).padStart(2, '0')}`,
	label: `checkout-service-${String(index).padStart(2, '0')}`,
}));

/**
 * The menus the showcase holds open, in the order they are opened.
 */
const SHOWCASE_MENUS = [
	'showcase-kinds',
	'showcase-states',
	'showcase-labels',
	'showcase-pending',
	'showcase-search',
	'showcase-server-search',
	'showcase-loading',
	'showcase-empty',
	'showcase-overflow',
	'showcase-icon-only',
];

/**
 * The disabled triggers. Pressed alongside the menus above, and none of them may open.
 */
const DISABLED_TRIGGERS = ['showcase-disabled-button', 'showcase-disabled-badge'];

/**
 * The row whose tooltip the `play` function holds open.
 *
 * One, not one per menu: hovering a row hands it the highlight and the focus, and the row that
 * just lost the focus closes its tooltip. The blocked row is the one worth holding, because its
 * reason is the only part of a row that is invisible until it opens.
 */
const FORCED_TOOLTIP_ROW = 'showcase-states-item-blocked';

function getShowcaseNode(testId: string): HTMLElement {
	// The popups are portalled to `document.body`, so none of this is inside the canvas element.
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);

	if (node === null) {
		throw new Error(`DropdownShowcase: no node named "${testId}".`);
	}

	return node;
}

function ShowcaseCell({
	title,
	note,
	className,
	children,
}: {
	title: string;
	note: string;
	className?: string;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={`story-section ${styles.cell} ${className ?? ''}`}>
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

function DropdownShowcaseLayout(): ReactElement {
	const [pinned, setPinned] = useState(true);
	const [sort, setSort] = useState('edited');

	return (
		<div className="story-container-full">
			<div className={styles.showcaseGrid}>
				<ShowcaseCell
					className={styles.cellWide}
					title="Every kind, in one menu"
					note="The seven kinds together: a group heading over an action with a shortcut, one with both slots filled, and a submenu; then a link, a checkbox, a radio group, and a danger row under a heading of its own. The submenu holds a group of its own, which is as deep as the type lets a menu go."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-kinds"
						contentMaxHeight={520}
						items={[
							{
								type: 'group',
								value: 'edit',
								label: 'Edit',
								items: [
									{
										type: 'item',
										value: 'rename',
										label: 'Rename',
										prefix: <Pencil />,
										shortcut: 'R',
									},
									{
										type: 'item',
										value: 'favourite',
										label: 'Add to favourites',
										prefix: <Bookmark />,
										suffix: <Star />,
									},
									{
										type: 'submenu',
										value: 'export',
										label: 'Export',
										prefix: <FileDown />,
										items: [
											{ type: 'item', value: 'csv', label: 'As CSV' },
											{ type: 'item', value: 'json', label: 'As JSON' },
											{ type: 'separator', value: 'before-share' },
											{
												type: 'group',
												value: 'share',
												label: 'Share',
												items: [
													{
														type: 'item',
														value: 'link',
														label: 'Copy a share link',
														prefix: <Share2 />,
													},
													{
														type: 'checkbox',
														name: 'public',
														label: 'Anyone with the link',
														defaultValue: true,
													},
												],
											},
										],
									},
								],
							},
							{ type: 'separator', value: 'after-edit' },
							{
								type: 'link',
								value: 'docs',
								label: 'Open the documentation',
								prefix: <BookOpen />,
								suffix: <ExternalLink />,
								render: (
									<a
										href="https://signoz.io/docs"
										target="_blank"
										rel="noreferrer"
										aria-label="Open the documentation"
									/>
								),
							},
							{
								type: 'checkbox',
								name: 'pinned',
								label: 'Pinned to the top',
								value: pinned,
								onChange: setPinned,
							},
							{
								type: 'radio-group',
								name: 'sort',
								value: sort,
								onChange: setSort,
								items: [
									{ label: 'Sort by name', value: 'name' },
									{ label: 'Sort by last edited', value: 'edited' },
								],
							},
							{ type: 'separator', value: 'before-danger' },
							{
								type: 'group',
								value: 'danger',
								label: 'Danger zone',
								items: [
									{
										type: 'item',
										value: 'delete',
										label: 'Delete',
										prefix: <Trash />,
										danger: true,
									},
								],
							},
						]}
					>
						<Button {...TRIGGER_PROPS}>Dashboard</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					title="Blocked, and waiting"
					note="A blocked row, a waiting one, and the row that says both: waiting outranks blocked, so the spinner shows and the blocked reason never does. Neither state leaves the keyboard walk, which is what keeps the reason reachable. The blocked row's reason is held open here; only one tooltip can be, because a hovered row takes the focus and the row losing it closes its own."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-states"
						items={[
							{ type: 'item', value: 'plain', label: 'A plain row', prefix: <Copy /> },
							{
								type: 'item',
								value: 'blocked',
								label: 'Blocked, with a reason',
								disabled: true,
								disabledTooltip: 'Ask an admin for write access',
							},
							{
								type: 'item',
								value: 'waiting',
								label: 'Waiting on something',
								loading: true,
								loadingTooltip: 'Fetching the latest version',
							},
							{
								type: 'item',
								value: 'both',
								label: 'Waiting outranks blocked',
								disabled: true,
								disabledTooltip: 'This reason never shows',
								loading: true,
								loadingTooltip: 'This one does',
							},
						]}
					>
						<Button {...TRIGGER_PROPS}>States</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					title="Labels that do not fit"
					note="Truncation is not a choice a call site makes: every label that outgrows the popup is cut and carries its full text in a tooltip, so the row pitch stays constant. A label that renders nothing falls back to `<No label>` rather than shipping a row with no name on it."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-labels"
						contentMaxWidth={240}
						items={[
							{ type: 'item', value: 'plain', label: 'A label that fits' },
							{ type: 'item', value: 'nameless', label: '' },
							{
								type: 'item',
								value: 'long',
								label: 'A label long enough that it truncates and shows in full on hover',
							},
						]}
					>
						<Button {...TRIGGER_PROPS}>Labels</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					title="An action in flight"
					note="`onClick` returned a promise, so its row carries `data-pending` and takes the spinner, and every other row in the menu goes inert until it settles. This one never settles, because the frame is the point. See the `AsyncOutcomes` story for what happens after it: resolving closes the menu, resolving `false` keeps it open, and a rejection keeps it open and raises a `toast.error`."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-pending"
						items={[
							{
								type: 'item',
								value: 'deploy',
								label: 'Deploy',
								onClick: () => PENDING_FOREVER,
							},
							{ type: 'item', value: 'rollback', label: 'Roll back', prefix: <Copy /> },
							{
								type: 'item',
								value: 'delete',
								label: 'Delete',
								prefix: <Trash />,
								danger: true,
							},
						]}
					>
						<Button {...TRIGGER_PROPS}>Run something</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					title="Search, filtered here"
					note="The query is `log`. A group survives when any of its rows match and renders with only those, so Resources is gone and Signals kept one row. A submenu survives on its own label and keeps every row under it: once you are inside, the query that got you there is behind you."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-search"
						searchInputProps={{ placeholder: 'Find a signal', onChange: fn() }}
						items={[
							{
								type: 'group',
								value: 'signals',
								label: 'Signals',
								items: [
									{ type: 'item', value: 'logs', label: 'Logs', searchMetadata: 'records lines' },
									{ type: 'item', value: 'traces', label: 'Traces', searchMetadata: 'spans' },
								],
							},
							{
								type: 'group',
								value: 'resources',
								label: 'Resources',
								items: [
									{ type: 'item', value: 'hosts', label: 'Hosts' },
									{ type: 'item', value: 'pods', label: 'Kubernetes pods' },
								],
							},
							{
								type: 'submenu',
								value: 'log-pipelines',
								label: 'Log pipelines',
								items: [
									{ type: 'item', value: 'parse', label: 'Parsing rules' },
									{ type: 'item', value: 'drop', label: 'Drop rules' },
								],
							},
						]}
					>
						<Button {...TRIGGER_PROPS}>Signals</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					title="Search, filtered elsewhere"
					note="`filter: false` with `loading: true` on the search row: the rows arrive already filtered from a server, the query only reaches `onChange`, and the field swaps its glyph for a spinner while the request is out. The rows stay usable, unlike the menu's own `loading`."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-server-search"
						searchInputProps={{
							placeholder: 'Find a service',
							filter: false,
							loading: true,
							onChange: fn(),
						}}
						items={SERVICE_ITEMS.slice(0, 3)}
					>
						<Button {...TRIGGER_PROPS}>Services</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					className={styles.cellShort}
					title="Loading"
					note="The menu's own `loading` replaces every row with `loadingContent`, a spinner by default. The search row survives it, so a query can be typed while the rows are on their way."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-loading"
						loading
						searchInputProps={{ placeholder: 'Find an action' }}
						items={DEFAULT_ITEMS}
					>
						<Button {...TRIGGER_PROPS}>Loading</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					className={styles.cellShort}
					title="Nothing matched"
					note="A query nothing matches renders one non-interactive `<No content>` row and logs nothing: that one is a state. An empty `items` renders the same row and warns, unless `noContent` replaces the text."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-empty"
						searchInputProps={{ placeholder: 'Find an action' }}
						items={DEFAULT_ITEMS}
					>
						<Button {...TRIGGER_PROPS}>Empty</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					title="Overflow"
					note="More rows than `contentMaxHeight` leaves room for, scrolled off both ends. Only the clipped edge fades: a list resting at its top has nothing above it to hint at. The search row is a sibling of the scrolling part, so it stays pinned while the rows travel under it."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="start"
						testId="showcase-overflow"
						contentMaxHeight={220}
						searchInputProps={{ placeholder: 'Find a service' }}
						items={SERVICE_ITEMS}
					>
						<Button {...TRIGGER_PROPS}>Services</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					className={styles.cellShort}
					title="An icon-only trigger"
					note="Base UI names the popup from its trigger, and an icon button has no text to name it with, so the menu carries an `aria-label` of its own. `align: 'end'` hangs it off the right edge of the trigger, which is what a row-actions button at the end of a table wants."
				>
					<Dropdown
						nativeButton
						side="bottom"
						align="end"
						testId="showcase-icon-only"
						aria-label="Row actions"
						items={DEFAULT_ITEMS.slice(0, 2)}
					>
						<Button
							icon
							variant={ButtonVariant.Ghost}
							color={ButtonColor.Secondary}
							size="md"
							aria-label="Row actions"
						>
							<Ellipsis />
						</Button>
					</Dropdown>
				</ShowcaseCell>

				<ShowcaseCell
					className={styles.cellShort}
					title="A trigger that cannot open"
					note="`disabled` gates the menu and marks the trigger `aria-disabled`, never the native attribute, so it stays hoverable and focusable and `disabledTooltip` stays reachable on hover. `Button` paints itself disabled from that attribute. The `Badge` is a `<span>`, so it takes `nativeButton={false}`."
				>
					<div className={styles.triggerRow}>
						<Dropdown
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-disabled-button"
							disabled
							disabledTooltip="You need edit access to change this dashboard"
							items={DEFAULT_ITEMS}
						>
							<Button {...TRIGGER_PROPS}>Actions</Button>
						</Dropdown>
						<Dropdown
							nativeButton={false}
							side="bottom"
							align="start"
							testId="showcase-disabled-badge"
							disabled
							disabledTooltip="Only admins can change the environment"
							items={DEFAULT_ITEMS}
						>
							<Badge variant="outlined" color="secondary">
								Production
							</Badge>
						</Dropdown>
					</div>
				</ShowcaseCell>
			</div>
		</div>
	);
}

/**
 * Every kind of row, every state one can be in, and every state the menu itself has, all held open
 * in one snapshot.
 */
export const DropdownShowcase: Story = {
	parameters: {
		layout: 'fullscreen',
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Base UI opens a menu on `mousedown`, and an open menu dismisses itself on a `mousedown`
		// or a `pointerdown` outside it, on a document listener it only registers once it has
		// settled. Opening every menu in one synchronous block beats that listener, which is what
		// leaves all of them open in the same snapshot. Nothing below dispatches either event
		// again: a plain `click` is ignored by the outside-press guard, and hovering is not a
		// press at all.
		for (const testId of [...SHOWCASE_MENUS, ...DISABLED_TRIGGERS]) {
			fireEvent.mouseDown(canvas.getByTestId(testId));
		}

		for (const testId of DISABLED_TRIGGERS) {
			await expect(canvas.getByTestId(testId)).toHaveAttribute('aria-disabled', 'true');
		}

		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="dropdown-popup"]')).toHaveLength(
				SHOWCASE_MENUS.length,
			),
		);

		// The submenu is opened by hover rather than by a press, which would dismiss the other
		// seven menus. Base UI only lets a submenu open on hover once the pointer has moved over
		// the menu holding it, so that move comes first.
		const submenuTrigger = getShowcaseNode('showcase-kinds-item-export');

		fireEvent.mouseMove(submenuTrigger.closest('[data-slot="dropdown-popup"]') ?? submenuTrigger);
		fireEvent.pointerEnter(submenuTrigger);
		fireEvent.mouseEnter(submenuTrigger);
		fireEvent.mouseMove(submenuTrigger);

		// One query the rows are filtered on, and one nothing matches.
		fireEvent.change(getShowcaseNode('showcase-search-search'), { target: { value: 'log' } });
		fireEvent.change(getShowcaseNode('showcase-empty-search'), {
			target: { value: 'nothing matches this' },
		});

		// The handler returns a promise that never settles, so the row stays in flight.
		fireEvent.click(getShowcaseNode('showcase-pending-item-deploy'));

		// Scrolled off both ends, the only position where both edges fade.
		const overflowViewport = getShowcaseNode(
			'showcase-overflow-item-service-00',
		).closest<HTMLElement>('[data-slot="dropdown-viewport"]');

		if (overflowViewport !== null) {
			overflowViewport.scrollTop = 120;
			fireEvent.scroll(overflowViewport);
		}

		// Base UI opens a tooltip when the pointer enters its trigger, so the reason on the blocked
		// row is held open for the snapshot. It goes last: a hovered row takes the focus, and the
		// row that loses it closes whatever tooltip it had open.
		const blockedRow = getShowcaseNode(FORCED_TOOLTIP_ROW);

		fireEvent.pointerEnter(blockedRow);
		fireEvent.mouseEnter(blockedRow);
		fireEvent.mouseMove(blockedRow);

		await waitFor(() => {
			expect(document.querySelectorAll('[data-slot="dropdown-popup"]')).toHaveLength(
				SHOWCASE_MENUS.length + 1,
			);
			expect(getShowcaseNode('showcase-pending-item-deploy')).toHaveAttribute('data-pending');
			expect(document.querySelectorAll('[data-slot="tooltip-content"]')).toHaveLength(1);
		});
	},
	render: () => <DropdownShowcaseLayout />,
};
