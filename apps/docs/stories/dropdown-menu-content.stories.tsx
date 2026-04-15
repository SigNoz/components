import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuContent> = {
	title: 'Components/DropdownMenu/DropdownMenuContent',
	component: DropdownMenuContent,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the dropdown menu content.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the dropdown menu content.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		side: {
			control: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			description: 'The preferred side of the trigger to render against when open.',
			table: {
				category: 'Positioning',
				type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
				defaultValue: { summary: 'bottom' },
			},
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'The preferred alignment against the trigger.',
			table: {
				category: 'Positioning',
				type: { summary: "'start' | 'center' | 'end'" },
				defaultValue: { summary: 'center' },
			},
		},
		sideOffset: {
			control: 'number',
			description: 'Distance in pixels from the trigger.',
			table: { category: 'Positioning', defaultValue: { summary: '4' } },
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
			description: 'Additional CSS classes for the content.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		forceMount: {
			control: 'boolean',
			description: 'When true, keeps the content mounted when closed (e.g. for animations).',
			table: { category: 'Behavior', type: { summary: 'true | undefined' } },
		},
		onCloseAutoFocus: { control: false, table: { category: 'Events' } },
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
type Story = StoryObj<typeof DropdownMenuContent>;

export const Default: Story = {
	args: {
		side: 'bottom',
		align: 'start',
		sideOffset: 4,
	},
	render: (args) => (
		<div className="p-8">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent {...args}>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
