import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof DropdownMenuRadioGroup> = {
	title: 'Components/DropdownMenu/DropdownMenuRadioGroup',
	component: DropdownMenuRadioGroup,
	argTypes: {
		value: {
			control: 'text',
			description: 'The controlled value of the selected radio item.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		onValueChange: {
			control: false,
			description: 'Event handler called when the selected value changes.',
			table: { category: 'Events', type: { summary: '(value: string) => void' } },
		},
		children: { control: false, table: { category: 'Content' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuRadioGroup>;

export const Default: Story = {
	args: {
		value: 'system',
	},
	render: (args) => {
		const [theme, setTheme] = useState(args.value ?? 'system');

		return (
			<div className="p-8">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="solid" color="secondary">
							Open menu
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Theme</DropdownMenuLabel>
						<DropdownMenuRadioGroup {...args} value={theme} onValueChange={setTheme}>
							<DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};
