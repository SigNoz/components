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

const meta: Meta<typeof DropdownMenuRadioItem> = {
	title: 'Components/DropdownMenu/DropdownMenuRadioItem',
	component: DropdownMenuRadioItem,
	argTypes: {
		value: {
			control: 'text',
			description: 'The unique value of the radio item.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the item.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the radio item.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onSelect: { control: false, table: { category: 'Events' } },
		children: { control: 'text', table: { category: 'Content' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuRadioItem>;

export const Default: Story = {
	args: {
		value: 'light',
		children: 'Light',
		disabled: false,
	},
	render: (args) => {
		const [theme, setTheme] = useState('light');

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
						<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
							<DropdownMenuRadioItem {...args} />
							<DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};
