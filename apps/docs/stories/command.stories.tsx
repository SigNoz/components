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

/* Basic playground template (non-dialog) */

const Template = ({ placeholder = 'Search commands…', onSelect }: any) => (
	<div style={{ width: 520, height: 360 }}>
		<Command>
			<CommandInput placeholder={placeholder} />
			<CommandList>
				<CommandGroup heading="General">
					{ITEMS.slice(0, 2).map((it) => (
						<CommandItem
							key={it.id}
							onSelect={() => {
								action('select')(it.label);
								onSelect?.(it);
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
								onSelect?.(it);
							}}
						>
							{it.label}
						</CommandItem>
					))}
				</CommandGroup>

				<CommandEmpty>No results.</CommandEmpty>
			</CommandList>
		</Command>
	</div>
);

/* Stories */

/** Default — minimal, renders inline Command for visual inspection */
export const Default: Story = {
	args: {
		placeholder: 'Search commands…',
	},
	render: (args) => <Template {...args} />,
};

/** Playground — interactive, exposes placeholder control and item selection action */
export const Playground: Story = {
	args: {
		placeholder: 'Try "Create report"...',
	},
	render: (args) => <Template {...args} onSelect={action('onSelect')} />,
};

/** Dialog — demonstrates Command mounted inside CommandDialog (uses fullscreen layout so Radix portal isn't clipped) */
export const DialogStory: Story = {
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		dialogOpen: true,
	},

	render: ({ dialogOpen = true, onOpenChange }: any) => {
		const [open, setOpen] = useState<boolean>(!!dialogOpen);
		const handleOpenChange = (v: boolean) => {
			setOpen(v);
			onOpenChange?.(v);
		};

		return (
			<>
				<div style={{ margin: 12 }}>
					<button onClick={() => handleOpenChange(true)}>Open Command Dialog</button>
				</div>

				<CommandDialog open={open} onOpenChange={handleOpenChange}>
					<div style={{ width: 520 }}>
						<CommandInput placeholder="Search or run a command…" />
						<CommandList>
							<CommandGroup heading="Quick actions">
								{ITEMS.map((it) => (
									<CommandItem
										key={it.id}
										onSelect={() => {
											action('select')(it.label);
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

/** EmptyState: show how Component looks with no results */
export const EmptyState: Story = {
	render: () => (
		<div style={{ width: 420 }}>
			<Command>
				<CommandInput placeholder="Search (no results)" />
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
