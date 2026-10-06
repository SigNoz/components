import {
	Activity,
	Bot,
	BellRing,
	Bug,
	ChartLine,
	Compass,
	CreditCard,
	FileText,
	Gauge,
	House,
	KeyRound,
	Keyboard,
	Layers,
	LayoutDashboard,
	ListFilter,
	Logs,
	Moon,
	Plug,
	Plus,
	Route,
	Save,
	ScrollText,
	Settings,
	Share,
	Terminal,
	Trash2,
	UserPlus,
	Users,
} from '@signozhq/icons';
import {
	Button,
	Command,
	type CommandActionItemType,
	type CommandItemType,
	type CommandProps,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useEffect, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Command> = {
	title: 'Composed Components/Command',
	component: Command,
	argTypes: {
		items: {
			control: false,
			description:
				'The rows, in the order they render while the query is empty. Two kinds, told apart by a required `type`: `item` and `group`. A row takes `label`, `value`, `onClick`, `searchMetadata`, `prefix`, and `shortcut` or `suffix`. `disabled` + `disabledTooltip` block a row, `loading` + `loadingTooltip` say it is waiting.',
			table: { category: 'Content', type: { summary: 'CommandItemType[]' } },
		},
		noContent: {
			control: 'text',
			description:
				'What the list shows when no row matches the query. With `searchInputProps.filter: false`, only while `items` is empty and `searchInputProps.loading` is false.',
			table: {
				category: 'Content',
				type: { summary: 'ReactNode' },
				defaultValue: { summary: "'No results found :/'" },
			},
		},
		label: {
			control: 'text',
			description:
				'The accessible name of the palette and of its search field. Not shown. Required, since the placeholder is not a name.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		open: {
			control: false,
			description:
				'Whether the palette is open. The palette has no trigger, so the app holds this and binds `⌘K` or `Ctrl+K` itself.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onOpenChange: {
			control: false,
			description:
				'Called with `false` when the palette closes itself: after `Esc`, a click outside, or a picked row.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
		searchInputProps: {
			control: 'object',
			description:
				'The search row: `placeholder`, which is required, `prefix`, `suffix`, `loading`, `filter` and `onChange`. `filter: false` stops the ranking and filtering for rows a server already filtered.',
			table: { category: 'Behavior', type: { summary: 'CommandSearchInputProps' } },
		},
		contentMaxWidth: {
			control: 'text',
			description:
				'How wide the palette may get. A number is read as pixels. A narrower viewport wins.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '32rem' },
			},
		},
		contentMaxHeight: {
			control: 'text',
			description:
				'How tall the rows may get before they scroll. A number is read as pixels. The search row stays pinned, and the palette still stops short of the bottom of the viewport.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '20rem' },
			},
		},
		id: {
			control: 'text',
			description: 'Forwarded to the dialog panel.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the dialog panel as `data-testid`, and the stem every part is named from.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		label: 'Command palette',
		searchInputProps: { placeholder: 'Search…' },
		onOpenChange: fn(),
		testId: 'command',
	},
	parameters: {
		layout: 'fullscreen',
		chromatic: { disableSnapshot: false, modes: allModes },
	},
};

export default meta;
type Story = StoryObj<typeof Command>;

function action(
	value: string,
	label: string,
	prefix: ReactElement,
	extra?: Partial<CommandActionItemType>,
): CommandActionItemType {
	return { type: 'item', value, label, prefix, onClick: fn(), ...extra } as CommandActionItemType;
}

/**
 * The shape of the SigNoz palette: 25 actions in 8 sections.
 */
const PALETTE: CommandItemType[] = [
	{
		type: 'group',
		value: 'navigation',
		label: 'Navigation',
		items: [
			action('home', 'Go to Home', <House />, { shortcut: 'Shift+H', searchMetadata: 'landing' }),
			action('dashboards', 'Go to Dashboards', <LayoutDashboard />, { shortcut: 'Shift+D' }),
			action('services', 'Go to Services', <Layers />, { shortcut: 'Shift+S' }),
			action('traces', 'Go to Traces', <Route />, { shortcut: 'Shift+T' }),
			action('logs', 'Go to Logs', <Logs />, { shortcut: 'Shift+L' }),
			action('alerts', 'Go to Alerts', <BellRing />, { shortcut: 'Shift+A' }),
		],
	},
	{
		type: 'group',
		value: 'settings',
		label: 'Settings',
		items: [
			action('general', 'General settings', <Settings />),
			action('members', 'Members', <Users />, { searchMetadata: 'team users invite' }),
			action('api-keys', 'API keys', <KeyRound />, { searchMetadata: 'tokens' }),
			action('integrations', 'Integrations', <Plug />),
			action('billing', 'Billing', <CreditCard />),
			action('shortcuts', 'Keyboard shortcuts', <Keyboard />),
		],
	},
	{
		type: 'group',
		value: 'common',
		label: 'Common',
		items: [
			action('new-dashboard', 'Create dashboard', <Plus />),
			action('invite', 'Invite a team member', <UserPlus />),
			action('theme', 'Toggle dark mode', <Moon />, { searchMetadata: 'theme light' }),
		],
	},
	{
		type: 'group',
		value: 'logs',
		label: 'Logs',
		items: [
			action('logs-explorer', 'Logs Explorer', <ScrollText />),
			action('logs-pipelines', 'Logs pipelines', <ListFilter />),
			action('logs-views', 'Saved logs views', <Save />),
		],
	},
	{
		type: 'group',
		value: 'metrics',
		label: 'Metrics',
		items: [
			action('metrics-explorer', 'Metrics Explorer', <ChartLine />),
			action('metrics-summary', 'Metrics summary', <Gauge />),
			action('metrics-views', 'Saved metrics views', <FileText />),
		],
	},
	{
		type: 'group',
		value: 'traces',
		label: 'Traces',
		items: [
			action('traces-explorer', 'Traces Explorer', <Activity />),
			action('exceptions', 'Exceptions', <Bug />),
		],
	},
	{
		type: 'group',
		value: 'dev',
		label: 'Dev',
		items: [action('api-monitoring', 'API monitoring', <Terminal />)],
	},
	{
		type: 'group',
		value: 'noz',
		label: 'Noz',
		items: [action('assistant', 'Ask the AI assistant', <Bot />)],
	},
];

/**
 * The palette as an app holds it: `open` in state, opened from a button or with `⌘K` / `Ctrl+K`.
 */
function PaletteStory(args: CommandProps): ReactElement {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		function toggle(event: KeyboardEvent): void {
			// Inside the palette `Ctrl+K` moves the highlight up and marks the event handled.
			if (
				event.key.toLowerCase() === 'k' &&
				(event.metaKey || event.ctrlKey) &&
				!event.defaultPrevented
			) {
				event.preventDefault();
				setOpen((current) => !current);
			}
		}

		document.addEventListener('keydown', toggle);

		return () => document.removeEventListener('keydown', toggle);
	}, []);

	return (
		<div className="story-container story-row">
			<Button variant="solid" color="secondary" size="md" onClick={() => setOpen(true)}>
				Open palette
			</Button>
			<Typography size="sm" color="muted">
				or press ⌘K / Ctrl+K
			</Typography>
			<Command
				{...args}
				open={open}
				onOpenChange={(next) => {
					args.onOpenChange(next);
					setOpen(next);
				}}
			/>
		</div>
	);
}

async function openPalette(canvasElement: HTMLElement, query?: string): Promise<void> {
	await waitForEffects();
	await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open palette' }));

	const body = within(canvasElement.ownerDocument.body);
	const field = await body.findByRole('combobox', { name: 'Command palette' });

	await waitFor(() => expect(field).toHaveFocus());

	if (query !== undefined) {
		await userEvent.type(field, query);
	}
}

/**
 * The playground the Controls table drives, with the shape of the SigNoz palette.
 */
export const Default: Story = {
	args: { items: PALETTE },
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement);
	},
	render: (args) => <PaletteStory {...args} />,
};

/**
 * The query may skip letters: `dshb` finds `Create dashboard` and `Go to Dashboards`, and every
 * section with no match disappears.
 */
export const Search: Story = {
	args: { items: PALETTE },
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement, 'dshb');
		await waitFor(() =>
			expect(
				canvasElement.ownerDocument.querySelector('[data-slot="command-item"][data-highlighted]'),
			).toHaveTextContent('Create dashboard'),
		);
	},
	render: (args) => <PaletteStory {...args} />,
};

/**
 * `searchMetadata` is searched too: `team` ranks `Members` first through its metadata, next to
 * `Invite a team member`.
 */
export const SearchMetadata: Story = {
	args: { items: PALETTE },
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement, 'team');
	},
	render: (args) => <PaletteStory {...args} />,
};

/**
 * No row matches the query, so the list shows `noContent`.
 */
export const NoMatch: Story = {
	args: { items: PALETTE, noContent: 'No action matches this search' },
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement, 'xyzzy');
		await waitFor(() =>
			expect(
				canvasElement.ownerDocument.querySelector('[data-slot="command-empty"]'),
			).not.toBeNull(),
		);
	},
	render: (args) => <PaletteStory {...args} />,
};

/**
 * Rows a server filters: `filter: false` keeps `items` in order, `loading` shows the wait in the
 * field, and `onChange` reports the query.
 */
export const ServerSearch: Story = {
	args: {
		items: PALETTE.slice(0, 2),
		searchInputProps: { placeholder: 'Search everything…', filter: false, loading: true },
	},
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement, 'dash');
	},
	render: (args) => (
		<PaletteStory {...args} searchInputProps={{ ...args.searchInputProps, onChange: fn() }} />
	),
};

/**
 * Rows outside any group, a label too long for one line, and a row whose label renders nothing.
 */
export const LooseRowsAndLongLabels: Story = {
	args: {
		items: [
			action(
				'wrap',
				'Open the saved view for checkout latency in the production environment',
				<Compass />,
				{
					shortcut: 'Shift+V',
				},
			),
			action('blank', '', <FileText />),
			{
				type: 'group',
				value: 'recent',
				label: 'Recent',
				items: [action('recent-logs', 'Logs Explorer', <ScrollText />)],
			},
		],
	},
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement);
	},
	render: (args) => <PaletteStory {...args} />,
};

/**
 * A row blocks itself with `disabled` + `disabledTooltip`, and says it is waiting with `loading` +
 * `loadingTooltip`. Neither runs nor closes the palette, the arrow keys still land on both, and the
 * reason opens with the highlight.
 */
export const BlockedAndWaitingRows: Story = {
	args: {
		items: [
			action('delete', 'Delete dashboard', <Trash2 />, {
				shortcut: 'Shift+Backspace',
				disabled: true,
				disabledTooltip: 'Only the owner can delete this dashboard',
			}),
			action('share', 'Share dashboard', <Share />, {
				loading: true,
				loadingTooltip: 'Creating the public link',
			}),
			{
				type: 'item',
				value: 'export',
				label: 'Export as JSON',
				shortcut: 'Shift+E',
				loading: true,
				loadingTooltip: 'Preparing the export',
				onClick: fn(),
			},
			action('rename', 'Rename dashboard', <FileText />),
		],
	},
	play: async ({ canvasElement }) => {
		await openPalette(canvasElement);
		await waitFor(() =>
			expect(
				canvasElement.ownerDocument.querySelector('[data-slot="tooltip-content"][data-open]'),
			).toHaveTextContent('Only the owner can delete this dashboard'),
		);
	},
	render: (args) => <PaletteStory {...args} />,
};
