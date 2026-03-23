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
import { Link, Settings } from 'lucide-react';

const meta: Meta<typeof DropdownMenuSubTrigger> = {
	title: 'Components/DropdownMenu/DropdownMenuSubTrigger',
	component: DropdownMenuSubTrigger,
	argTypes: {
		inset: {
			control: 'boolean',
			description: 'When true, adds additional left padding.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the sub trigger.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the sub trigger.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		leftIcon: { control: false, table: { category: 'Content' } },
		children: { control: 'text', table: { category: 'Content' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuSubTrigger>;

export const Default: Story = {
	args: {
		children: 'More Options',
		inset: false,
		disabled: false,
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
						<DropdownMenuSubTrigger {...args} leftIcon={<Settings className="h-4 w-4" />} />
						<DropdownMenuSubContent>
							<DropdownMenuItem leftIcon={<Link className="h-4 w-4" />}>
								Sub Item 1
							</DropdownMenuItem>
							<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
							<DropdownMenuItem>Sub Item 3</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
