import { Search } from '@signozhq/icons';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSearch,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

const meta: Meta<typeof DropdownMenuSearch> = {
	title: 'Components/DropdownMenu/DropdownMenuSearch',
	component: DropdownMenuSearch,
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text for the search input.',
			table: { category: 'Content', defaultValue: { summary: 'Search...' } },
		},
		searchIcon: { control: false, table: { category: 'Content' } },
		onSearchChange: { control: false, table: { category: 'Events' } },
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenuSearch>;

const searchItems = [
	{ key: 'profile', label: 'Profile' },
	{ key: 'settings', label: 'Settings' },
	{ key: 'billing', label: 'Billing' },
	{ key: 'team', label: 'Team' },
	{ key: 'help', label: 'Help' },
];

export const Default: Story = {
	args: {
		placeholder: 'Search menu...',
	},
	render: (args) => {
		const [query, setQuery] = useState('');
		const filteredItems = useMemo(() => {
			if (!query.trim()) return searchItems;
			const q = query.toLowerCase();
			return searchItems.filter((item) => item.label.toLowerCase().includes(q));
		}, [query]);

		return (
			<div className="p-8">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="solid" color="secondary">
							Search menu
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuSearch
							{...args}
							searchIcon={<Search className="h-4 w-4" />}
							onSearchChange={setQuery}
						/>
						<DropdownMenuSeparator />
						{filteredItems.map((item) => (
							<DropdownMenuItem key={item.key}>{item.label}</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	},
};
