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
		style: {
			control: false,
			description: 'Inline styles applied to the item.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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
		<div style={{ padding: '2rem' }}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem {...args} leftIcon={<User size={16} />} />
					<DropdownMenuItem leftIcon={<Settings size={16} />}>Settings</DropdownMenuItem>
					<DropdownMenuItem destructive leftIcon={<LogOut size={16} />} onSelect={() => {}}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};

export const Preview: Story = {
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Shortcut
				</h3>
				<div style={{ padding: '2rem' }}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="solid" color="secondary">
								Open menu
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem leftIcon={<User size={16} />}>
								Profile
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem leftIcon={<Settings size={16} />}>
								Settings
								<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem leftIcon={<Check size={16} />}>
								With checkmark
								<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>
		</div>
	),
};
