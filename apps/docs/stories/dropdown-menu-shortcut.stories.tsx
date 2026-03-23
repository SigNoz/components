import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuShortcut> = {
	title: 'Components/DropdownMenu/DropdownMenuShortcut',
	component: DropdownMenuShortcut,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes for the shortcut.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The shortcut text (e.g. ⌘T, ⇧⌘P).',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuShortcut>;

export const Default: Story = {
	args: {
		children: '⌘T',
	},
	render: (args) => (
		<div className="p-8">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						New Tab
						<DropdownMenuShortcut {...args} />
					</DropdownMenuItem>
					<DropdownMenuItem>
						Save
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Profile
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
