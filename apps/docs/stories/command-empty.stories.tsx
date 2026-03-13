import { Command, CommandEmpty, CommandInput, CommandList } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { emptyArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandEmpty> = {
	title: 'Components/Command/CommandEmpty',
	component: CommandEmpty,
	argTypes: emptyArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandEmpty>;

export const Default: Story = {
	args: {
		children: 'No results. Try a different search.',
	},
	render: (args) => (
		<div style={{ width: 420 }}>
			<Command>
				<CommandInput placeholder="Search…" />
				<CommandList>
					<CommandEmpty {...args} />
				</CommandList>
			</Command>
		</div>
	),
};
