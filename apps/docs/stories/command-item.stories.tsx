import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CommandItem> = {
	title: 'Components/Command/CommandItem',
	component: CommandItem,
	argTypes: {
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the item from being selected.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onSelect: {
			control: false,
			description: 'Callback fired when the item is selected.',
			table: {
				category: 'Events',
				type: { summary: '(value: string) => void' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the item.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'Item label displayed in the list.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
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
