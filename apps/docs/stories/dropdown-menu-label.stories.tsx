import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuLabel> = {
	title: 'Primitive Components/DropdownMenu/DropdownMenuLabel',
	component: DropdownMenuLabel,
	argTypes: {
		inset: {
			control: 'boolean',
			description: 'When true, adds additional left padding.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the label.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to the label.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		children: {
			control: 'text',
			description: 'The label text for the group.',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuLabel>;

export const Default: Story = {
	args: {
		children: 'My Account',
		inset: false,
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
					<DropdownMenuLabel {...args} />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem>New Team</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
