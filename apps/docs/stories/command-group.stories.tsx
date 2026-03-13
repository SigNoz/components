import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CommandGroup> = {
	title: 'Components/Command/CommandGroup',
	component: CommandGroup,
	argTypes: {
		heading: {
			control: 'text',
			description: 'Optional visual heading displayed above the group items.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the group wrapper.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: false,
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
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
