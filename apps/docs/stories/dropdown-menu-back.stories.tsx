import {
	Button,
	DropdownMenu,
	DropdownMenuBack,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof DropdownMenuBack> = {
	title: 'Components/DropdownMenu/DropdownMenuBack',
	component: DropdownMenuBack,
	argTypes: {
		label: {
			control: 'text',
			description: 'The label displayed next to the back icon.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the back button.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onBack: { control: false, table: { category: 'Events' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuBack>;

export const Default: Story = {
	args: {
		label: 'Settings',
	},
	render: (args) => {
		const [step, setStep] = useState<'main' | 'settings'>('main');

		return (
			<div className="p-8">
				<DropdownMenu onOpenChange={(open) => !open && setStep('main')}>
					<DropdownMenuTrigger asChild>
						<Button variant="solid" color="secondary">
							Open menu
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{step === 'main' ? (
							<>
								<DropdownMenuItem onSelect={() => setStep('settings')}>Settings</DropdownMenuItem>
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>Account</DropdownMenuItem>
							</>
						) : (
							<>
								<DropdownMenuBack {...args} onBack={() => setStep('main')} />
								<DropdownMenuSeparator />
								<DropdownMenuItem>General</DropdownMenuItem>
								<DropdownMenuItem>Privacy</DropdownMenuItem>
								<DropdownMenuItem>Notifications</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};
