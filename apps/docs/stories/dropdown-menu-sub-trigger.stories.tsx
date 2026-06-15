import { Link, Settings } from '@signozhq/icons';
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

const meta: Meta<typeof DropdownMenuSubTrigger> = {
	title: 'Primitive Components/DropdownMenu/DropdownMenuSubTrigger',
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
		style: {
			control: false,
			description: 'Inline styles applied to the sub trigger.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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
		<div style={{ padding: '2rem' }}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger {...args} leftIcon={<Settings size={16} />} />
						<DropdownMenuSubContent>
							<DropdownMenuItem leftIcon={<Link size={16} />}>Sub Item 1</DropdownMenuItem>
							<DropdownMenuItem>Sub Item 2</DropdownMenuItem>
							<DropdownMenuItem>Sub Item 3</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
