import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof DropdownMenuCheckboxItem> = {
	title: 'Components/DropdownMenu/DropdownMenuCheckboxItem',
	component: DropdownMenuCheckboxItem,
	argTypes: {
		checked: {
			control: 'select',
			options: [true, false, 'indeterminate'],
			description: 'The controlled checked state. Can be true, false, or "indeterminate".',
			table: {
				category: 'State',
				type: { summary: 'boolean | "indeterminate"' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the item.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the checkbox item.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onCheckedChange: { control: false, table: { category: 'Events' } },
		onSelect: { control: false, table: { category: 'Events' } },
		children: { control: 'text', table: { category: 'Content' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuCheckboxItem>;

export const Default: Story = {
	args: {
		children: 'Show Bookmarks',
		checked: true,
		disabled: false,
	},
	render: (args) => {
		const [showBookmarks, setShowBookmarks] = useState(args.checked ?? true);
		const [showUrls, setShowUrls] = useState(false);

		return (
			<div className="p-8">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="solid" color="secondary">
							Open menu
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Appearance</DropdownMenuLabel>
						<DropdownMenuCheckboxItem
							{...args}
							checked={showBookmarks}
							onCheckedChange={setShowBookmarks}
						/>
						<DropdownMenuCheckboxItem checked={showUrls} onCheckedChange={setShowUrls}>
							Show Full URLs
						</DropdownMenuCheckboxItem>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem disabled>Disabled option</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};
