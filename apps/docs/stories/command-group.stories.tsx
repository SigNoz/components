import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { groupArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandGroup> = {
	title: 'Components/Command/CommandGroup',
	component: CommandGroup,
	argTypes: groupArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandGroup>;

export const Default: Story = {
	args: {
		heading: 'General',
	},
	render: (args) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList>
					<CommandGroup {...args}>
						<CommandItem onSelect={() => {}}>Open settings</CommandItem>
						<CommandItem onSelect={() => {}}>Toggle sidebar</CommandItem>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
