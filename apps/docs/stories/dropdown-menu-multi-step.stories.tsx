import { Settings, User } from '@signozhq/icons';
import {
	Button,
	DropdownMenuItem,
	DropdownMenuMultiStep,
	DropdownMenuMultiStepContent,
	DropdownMenuMultiStepTrigger,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DropdownMenuMultiStep> = {
	title: 'Primitive Components/DropdownMenu/DropdownMenuMultiStep',
	component: DropdownMenuMultiStep,
	argTypes: {
		defaultOpen: {
			control: 'boolean',
			description: 'The open state when initially rendered.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		modal: {
			control: 'boolean',
			description:
				'When true, interaction with outside elements is disabled when the menu is open.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuMultiStep>;

export const Default: Story = {
	args: {
		defaultOpen: false,
		modal: true,
	},
	render: (args) => (
		<div style={{ padding: '2rem' }}>
			<DropdownMenuMultiStep {...args}>
				<DropdownMenuTrigger asChild>
					<Button variant="solid" color="secondary">
						Options
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuMultiStepContent
					secondaryLabel="Settings"
					primaryContent={
						<>
							<DropdownMenuItem leftIcon={<User size={16} />}>Profile</DropdownMenuItem>
							<DropdownMenuMultiStepTrigger leftIcon={<Settings size={16} />}>
								Settings
							</DropdownMenuMultiStepTrigger>
						</>
					}
					secondaryContent={
						<>
							<DropdownMenuItem>General</DropdownMenuItem>
							<DropdownMenuItem>Privacy</DropdownMenuItem>
							<DropdownMenuItem>Notifications</DropdownMenuItem>
						</>
					}
				/>
			</DropdownMenuMultiStep>
		</div>
	),
};
