import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLoading,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuLoading> = {
	title: 'Components/DropdownMenu/DropdownMenuLoading',
	component: DropdownMenuLoading,
	argTypes: {
		text: {
			control: 'text',
			description: 'The loading text to display.',
			table: { category: 'Content', defaultValue: { summary: 'Loading...' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the loading container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuLoading>;

export const Default: Story = {
	args: {
		text: 'Loading...',
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
					<DropdownMenuLoading {...args} />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};

export const CustomText: Story = {
	args: {
		text: 'Fetching options...',
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
					<DropdownMenuLoading {...args} />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
};
