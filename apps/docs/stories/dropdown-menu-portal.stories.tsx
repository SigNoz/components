import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuPortal> = {
	title: 'Components/DropdownMenu/DropdownMenuPortal',
	component: DropdownMenuPortal,
	argTypes: {
		container: {
			control: false,
			description:
				'Optional DOM element to portal the dropdown content into. Defaults to document.body when not provided.',
			table: { category: 'Behavior', type: { summary: 'HTMLElement | null | undefined' } },
		},
		forceMount: {
			control: 'boolean',
			description:
				'When true, keeps the portal mounted even when the dropdown is closed. Useful for controlling animations.',
			table: { category: 'Behavior', type: { summary: 'true | undefined' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuPortal>;

export const Default: Story = {
	render: (args) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="solid" color="secondary">
					Open menu
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal {...args}>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	),
};
