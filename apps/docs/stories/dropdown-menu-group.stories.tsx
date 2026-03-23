import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuGroup> = {
	title: 'Components/DropdownMenu/DropdownMenuGroup',
	component: DropdownMenuGroup,
	argTypes: {
		children: {
			control: false,
			description: 'The content of the group (usually DropdownMenuLabel and DropdownMenuItems).',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuGroup>;

export const Default: Story = {
	render: () => (
		<div className="p-8">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<DropdownMenuLabel>Account</DropdownMenuLabel>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>New Team</DropdownMenuItem>
						<DropdownMenuItem>Invite users</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
