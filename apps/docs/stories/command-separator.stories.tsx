import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { separatorArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandSeparator> = {
	title: 'Components/Command/CommandSeparator',
	component: CommandSeparator,
	argTypes: separatorArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandSeparator>;

export const Default: Story = {
	render: (args) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder="Search sections…" />
				<CommandList>
					<CommandGroup heading="Top picks">
						<CommandItem onSelect={() => {}}>Alpha</CommandItem>
						<CommandItem onSelect={() => {}}>Beta</CommandItem>
					</CommandGroup>

					<CommandSeparator {...args} />

					<CommandGroup heading="More suggestions">
						<CommandItem onSelect={() => {}}>Gamma</CommandItem>
						<CommandItem onSelect={() => {}}>Delta</CommandItem>
					</CommandGroup>

					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
