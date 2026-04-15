import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuTrigger> = {
	title: 'Components/DropdownMenu/DropdownMenuTrigger',
	component: DropdownMenuTrigger,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the dropdown menu trigger.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'When true, the child element will be treated as the trigger (no extra DOM wrapper).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
			},
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
type Story = StoryObj<typeof DropdownMenuTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<div className="p-8">
			<DropdownMenu>
				<DropdownMenuTrigger {...args}>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
