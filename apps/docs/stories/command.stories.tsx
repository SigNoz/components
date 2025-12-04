/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
} from '@signozhq/command';

import { generateDocs } from '../utils/generateDocs';

const examples = [
	`import { Command, CommandInput, CommandList, CommandItem } from '@signozhq/command';

export default function MyComponent() {
  return (
    <Command>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandItem>Open settings</CommandItem>
      </CommandList>
    </Command>
  );
}`,
];

const docs = generateDocs({
	packageName: '@signozhq/command',
	description:
		'Fast, composable, unstyled command menu for React. Use CommandDialog to mount in a modal/portal.',
	examples,
});

const meta: Meta<any> = {
	title: 'Components/Command',
	component: Command,
	tags: ['autodocs'],
	parameters: {
		docs: { description: { component: docs } },
		controls: { expanded: true },
	},
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text shown in the command input box',
			table: { category: 'Playground' },
		},
		dialogOpen: {
			control: 'boolean',
			description:
				'Boolean. When true, opens the <CommandDialog />. Used to control the dialog visibility externally.',
			table: { category: 'Playground' },
		},
		onOpenChange: {
			action: 'onOpenChange',
			description:
				'Event handler called when the command dialog open/close state changes (e.g. user closes via backdrop or ESC).',
			table: { category: 'Events' },
			control: { disable: true },
		},
		onSelect: {
			action: 'onSelect',
			description:
				'Event handler invoked when a command item is selected (via click or keyboard). Receives the selected item value or label.',
			table: { category: 'Events' },
			control: { disable: true },
		},
	},
};

export default meta;
type Story = StoryObj<any>;

/* Utility: shared items used across stories */
const ITEMS = [
	{ id: '1', label: 'Open settings', shortcut: '⌘S' },
	{ id: '2', label: 'Toggle sidebar', shortcut: 'T' },
	{ id: '3', label: 'Create report', shortcut: 'N' },
	{ id: '4', label: 'Switch workspace' },
];

/* Stories */

/* Default — minimal, renders inline Command for visual inspection */
export const Default: Story = {
	args: {
		placeholder: 'Search commands…',
	},
	render: (args: any) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandGroup heading="General">
						{ITEMS.slice(0, 2).map((it) => (
							<CommandItem
								key={it.id}
								onSelect={() => {
									action('select')(it.label);
									args.onSelect?.(it);
								}}
							>
								{it.label}
								{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="More">
						{ITEMS.slice(2).map((it) => (
							<CommandItem
								key={it.id}
								onSelect={() => {
									action('select')(it.label);
									args.onSelect?.(it);
								}}
							>
								{it.label}
								{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};

/** SelectWithAlert — shows an alert when an item is selected */
export const SelectWithAlert: Story = {
	args: {
		placeholder: 'Select an item…',
	},
	render: (args: any) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandGroup heading="Selectable items">
						{ITEMS.map((it) => (
							<CommandItem
								key={it.id}
								onSelect={() => {
									action('select')(it.label);
									args.onSelect?.(it);
									window.alert(`You selected: ${it.label}`);
								}}
							>
								{it.label}
								{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};

/** Dialog — demonstrates Command mounted inside CommandDialog */
export const Dialog: Story = {
	args: {
		dialogOpen: false,
		placeholder: 'Search or run a command…',
	},
	render: (args: any) => {
		const [open, setOpen] = useState<boolean>(args.dialogOpen);

		const handleOpenChange = (v: boolean) => {
			setOpen(v);
			args.onOpenChange?.(v);
		};

		return (
			<>
				<div style={{ margin: 12 }}>
					<button onClick={() => handleOpenChange(true)}>Open Command Dialog</button>
				</div>

				<CommandDialog
					open={open}
					onOpenChange={handleOpenChange}
					position="top"
					offset={110}
				>
					<div style={{ width: 520 }}>
						<CommandInput placeholder={args.placeholder} autoFocus={false} />
						<CommandList>
							<CommandGroup heading="Quick actions">
								{ITEMS.map((it) => (
									<CommandItem
										key={it.id}
										onSelect={() => {
											action('select')(it.label);
											args.onSelect?.(it);
											handleOpenChange(false);
										}}
									>
										{it.label}
										{it.shortcut && <CommandShortcut>{it.shortcut}</CommandShortcut>}
									</CommandItem>
								))}
							</CommandGroup>

							<CommandSeparator />

							<CommandEmpty>Try searching for &quot;report&quot;.</CommandEmpty>
						</CommandList>
					</div>
				</CommandDialog>
			</>
		);
	},
};

/** CreateOrSearch — auto-create new item on Enter when no results */
export const CreateOrSearch: Story = {
	args: {
		placeholder: 'Search or press Enter to create',
	},
	render: (args: any) => {
		const [query, setQuery] = useState('');
		const [items, setItems] = useState(ITEMS);

		const results = items.filter((it) =>
			it.label.toLowerCase().includes(query.toLowerCase()),
		);

		const handleCreate = (name: string) => {
			const label = name.trim() || `untitled-${Date.now()}`;
			const newItem = { id: String(Date.now()), label };
			setItems((prev) => [newItem, ...prev]);
			action('create')(label);
			args.onSelect?.(newItem);
		};

		return (
			<div style={{ width: 520 }}>
				<Command>
					<CommandInput
						placeholder={args.placeholder}
						onValueChange={(v: string) => setQuery(v)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && results.length === 0) {
								handleCreate(query);
							}
						}}
					/>

					<CommandList>
						{results.length === 0 ? (
							<CommandEmpty>
								No results. Press <strong>Enter</strong> to create &quot;{query}&quot;
							</CommandEmpty>
						) : (
							<CommandGroup heading="Results">
								{results.map((it) => (
									<CommandItem
										key={it.id}
										onSelect={() => {
											action('select')(it.label);
											args.onSelect?.(it);
										}}
									>
										{it.label}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</div>
		);
	},
};

/** Suggestions — shows CommandGroup with heading="Suggestions" */
export const Suggestions: Story = {
	args: {
		placeholder: 'Try: calendar, emoji, calc',
	},
	render: (args: any) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandEmpty>No results.</CommandEmpty>

					<CommandGroup heading="Suggestions">
						{['Calendar', 'Search Emoji', 'Calculator'].map((label) => (
							<CommandItem
								key={label}
								onSelect={() => {
									action('select')(label);
									args.onSelect?.({ label });
								}}
							>
								{label}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
};

/** Separators — demonstrates multiple CommandSeparator sections */
export const Separators: Story = {
	args: {
		placeholder: 'Sections with separators',
	},
	render: (args: any) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandGroup heading="Top picks">
						<CommandItem
							onSelect={() => {
								action('select')('Alpha');
								args.onSelect?.({ label: 'Alpha' });
							}}
						>
							Alpha
						</CommandItem>
						<CommandItem
							onSelect={() => {
								action('select')('Beta');
								args.onSelect?.({ label: 'Beta' });
							}}
						>
							Beta
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="More suggestions">
						<CommandItem
							onSelect={() => {
								action('select')('Gamma');
								args.onSelect?.({ label: 'Gamma' });
							}}
						>
							Gamma
						</CommandItem>
						<CommandItem
							onSelect={() => {
								action('select')('Delta');
								args.onSelect?.({ label: 'Delta' });
							}}
						>
							Delta
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Utilities">
						<CommandItem
							onSelect={() => {
								action('select')('Profile');
								args.onSelect?.({ label: 'Profile' });
							}}
						>
							Profile
						</CommandItem>
						<CommandItem
							onSelect={() => {
								action('select')('Settings');
								args.onSelect?.({ label: 'Settings' });
							}}
						>
							Settings
						</CommandItem>
					</CommandGroup>

					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};

/** Shortcuts — shows CommandShortcut usage next to items */
export const ShortcutsDemo: Story = {
	args: {
		placeholder: 'Shortcut examples',
	},
	render: (args: any) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandGroup heading="Keyboard">
						<CommandItem
							onSelect={() => {
								action('select')('Open settings');
								args.onSelect?.({ label: 'Open settings' });
							}}
						>
							Open settings
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>

						<CommandItem
							onSelect={() => {
								action('select')('Toggle sidebar');
								args.onSelect?.({ label: 'Toggle sidebar' });
							}}
						>
							Toggle sidebar
							<CommandShortcut>Ctrl+K</CommandShortcut>
						</CommandItem>

						<CommandItem
							onSelect={() => {
								action('select')('New report');
								args.onSelect?.({ label: 'New report' });
							}}
						>
							Create report
							<CommandShortcut>⌘N</CommandShortcut>
						</CommandItem>
					</CommandGroup>

					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};

/** EmptyState: show how Component looks with no results */
export const EmptyState: Story = {
	args: {
		placeholder: 'Search (no results)',
	},
	render: (args: any) => (
		<div style={{ width: 420 }}>
			<Command>
				<CommandInput placeholder={args.placeholder} />
				<CommandList>
					<CommandEmpty>
						Nothing matched your search. Try different keywords or create a new
						command.
					</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
