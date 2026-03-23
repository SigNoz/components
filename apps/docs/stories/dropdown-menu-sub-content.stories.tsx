import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuSubContent> = {
	title: 'Components/DropdownMenu/DropdownMenuSubContent',
	component: DropdownMenuSubContent,
	argTypes: {
		sideOffset: {
			control: 'number',
			description: 'Distance in pixels from the sub trigger.',
			table: { category: 'Positioning', defaultValue: { summary: '0' } },
		},
		alignOffset: {
			control: 'number',
			description: 'Offset in pixels from the alignment options.',
			table: { category: 'Positioning', defaultValue: { summary: '0' } },
		},
		avoidCollisions: {
			control: 'boolean',
			description: 'When true, repositions to avoid collisions with viewport edges.',
			table: { category: 'Positioning', defaultValue: { summary: 'true' } },
		},
		loop: {
			control: 'boolean',
			description: 'When true, keyboard navigation loops from last to first item.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the sub content.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onEscapeKeyDown: { control: false, table: { category: 'Events' } },
		onPointerDownOutside: { control: false, table: { category: 'Events' } },
		onFocusOutside: { control: false, table: { category: 'Events' } },
		onInteractOutside: { control: false, table: { category: 'Events' } },
		children: { control: false, table: { category: 'Content' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuSubContent>;

export const Default: Story = {
	args: {
		sideOffset: 0,
		avoidCollisions: true,
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
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
						<DropdownMenuSubContent {...args}>
							<DropdownMenuItem>Sub Item 1</DropdownMenuItem>
							<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
							<DropdownMenuItem>Sub Item 3</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
