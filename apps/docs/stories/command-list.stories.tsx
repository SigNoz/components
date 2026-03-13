import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CommandList> = {
	title: 'Components/Command/CommandList',
	component: CommandList,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the list container.',
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
type Story = StoryObj<typeof CommandList>;

export const Default: Story = {
	render: (args) => (
		<div style={{ width: 520 }}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList {...args}>
					<CommandGroup heading="General">
						<CommandItem onSelect={() => {}}>Open settings</CommandItem>
						<CommandItem onSelect={() => {}}>Toggle sidebar</CommandItem>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
