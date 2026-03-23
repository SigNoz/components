import {
	Button,
	DropdownMenuItem,
	DropdownMenuMultiStep,
	DropdownMenuMultiStepContent,
	DropdownMenuMultiStepTrigger,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, User } from 'lucide-react';

const meta: Meta<typeof DropdownMenuMultiStep> = {
	title: 'Components/DropdownMenu/DropdownMenuMultiStep',
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
		<div className="p-8">
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
							<DropdownMenuItem leftIcon={<User className="h-4 w-4" />}>Profile</DropdownMenuItem>
							<DropdownMenuMultiStepTrigger leftIcon={<Settings className="h-4 w-4" />}>
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
