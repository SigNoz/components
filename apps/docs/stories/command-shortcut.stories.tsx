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

const meta: Meta<typeof CommandShortcut> = {
	title: 'Components/Command/CommandShortcut',
	component: CommandShortcut,
	argTypes: {
		children: {
			control: 'text',
			description: 'Shortcut text shown to the right of the item label.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the shortcut span.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
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
