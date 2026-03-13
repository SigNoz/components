import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { itemArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandItem> = {
	title: 'Components/Command/CommandItem',
	component: CommandItem,
	argTypes: itemArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandItem>;

export const Default: Story = {
	args: {
		children: 'Open settings',
		disabled: false,
	},
	render: (args) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList>
					<CommandGroup heading="Actions">
						<CommandItem
							{...args}
							onSelect={() => {
								args.onSelect?.('open-settings');
							}}
						/>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};

export const WithPrefixAndSuffix: Story = {
	render: () => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList>
					<CommandGroup heading="Actions">
						<CommandItem
							prefix={<span>📁</span>}
							suffix={<CommandShortcut>⌘S</CommandShortcut>}
							onSelect={() => {}}
						>
							Open settings
						</CommandItem>
						<CommandItem
							prefix={<span>📄</span>}
							suffix={<CommandShortcut>⌘N</CommandShortcut>}
							onSelect={() => {}}
						>
							Create report
						</CommandItem>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
