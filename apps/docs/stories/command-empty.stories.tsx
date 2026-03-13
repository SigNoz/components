import { Command, CommandEmpty, CommandInput, CommandList } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CommandEmpty> = {
	title: 'Components/Command/CommandEmpty',
	component: CommandEmpty,
	argTypes: {
		children: {
			control: 'text',
			description: 'Content shown when there are no matching results.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the empty state.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
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
