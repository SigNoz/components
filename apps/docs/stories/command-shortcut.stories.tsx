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

import { shortcutArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandShortcut> = {
	title: 'Components/Command/CommandShortcut',
	component: CommandShortcut,
	argTypes: shortcutArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandShortcut>;

export const Default: Story = {
	args: {
		children: '⌘K',
	},
	render: (args) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList>
					<CommandGroup heading="Keyboard">
						<CommandItem onSelect={() => {}}>
							Open command palette
							<CommandShortcut {...args} />
						</CommandItem>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
