import { Check, LogOut, Settings, User } from '@signozhq/icons';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuItem> = {
	title: 'Primitive Components/DropdownMenu/DropdownMenuItem',
	component: DropdownMenuItem,
	argTypes: {
		inset: {
			control: 'boolean',
			description: 'When true, adds additional left padding.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the item.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		destructive: {
			control: 'boolean',
			description: 'When true, the item is styled as destructive (e.g. delete actions).',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the item.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		leftIcon: { control: false, table: { category: 'Content' } },
		rightIcon: { control: false, table: { category: 'Content' } },
		onSelect: { control: false, table: { category: 'Events' } },
		children: { control: 'text', table: { category: 'Content' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuItem>;

export const Default: Story = {
	args: {
		children: 'Profile',
		inset: false,
		disabled: false,
		destructive: false,
	},
	render: (args) => (
		<div className="story-container-full">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem {...args} leftIcon={<User className="icon-md" />} />
					<DropdownMenuItem leftIcon={<Settings className="icon-md" />}>Settings</DropdownMenuItem>
					<DropdownMenuItem
						destructive
						leftIcon={<LogOut className="icon-md" />}
						onSelect={() => {}}
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};

export const WithShortcut: Story = {
	args: {
		children: 'Profile',
		inset: false,
		disabled: false,
	},
	render: (args) => (
		<div className="story-container-full">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem {...args} leftIcon={<User className="icon-md" />}>
						{args.children}
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem leftIcon={<Settings className="icon-md" />}>
						Settings
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem leftIcon={<Check className="icon-md" />}>
						With checkmark
						<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
