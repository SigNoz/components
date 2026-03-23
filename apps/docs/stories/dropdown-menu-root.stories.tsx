import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenu> = {
	title: 'Components/DropdownMenu/DropdownMenu',
	component: DropdownMenu,
	argTypes: {
		open: {
			control: 'boolean',
			description: 'The controlled open state. Must be used together with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultOpen: {
			control: 'boolean',
			description:
				'The open state when initially rendered. Use when you do not need to control its open state.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		modal: {
			control: 'boolean',
			description:
				'When true, interaction with outside elements is disabled and only menu content is visible to screen readers.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		dir: {
			control: 'select',
			options: ['ltr', 'rtl'],
			description: 'The reading direction of submenus when applicable.',
			table: { category: 'Behavior', type: { summary: "'ltr' | 'rtl'" } },
		},
		children: {
			control: false,
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state changes.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
	args: {
		defaultOpen: false,
		modal: true,
	},
	render: (args) => (
		<div className="p-8">
			<DropdownMenu {...args}>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
