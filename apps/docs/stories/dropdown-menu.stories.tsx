import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, type MenuItem } from '@signozhq/dropdown-menu';

import { Button, ButtonSize, ButtonVariant } from '@signozhq/button';
import {
	Grid3x3,
	Link,
	Trash2,
	Check,
	ChevronRight,
	MoreHorizontal,
	Search,
	Settings,
	User,
	LogOut,
	Copy,
	Edit,
	FileText,
	Folder,
} from 'lucide-react';
import { generateDocs } from '../utils/generateDocs';

const dropdownExamples = [
	`import { Dropdown, type MenuItem } from '@signozhq/dropdown-menu';
import { Button } from '@signozhq/button';
import { Grid3x3, Link, Trash2 } from 'lucide-react';

const items: MenuItem[] = [
  {
    type: 'group',
    label: 'My Account',
    children: [
      { key: 'view', label: 'View', icon: <Grid3x3 /> },
      { key: 'copy', label: 'Copy link', icon: <Link /> },
      { type: 'divider' },
      { key: 'delete', label: 'Delete', icon: <Trash2 />, danger: true },
    ],
  },
];

export default function MyComponent() {
  return (
    <Dropdown menu={{ items }}>
      <Button variant={ButtonVariant.Outlined}>Open</Button>
    </Dropdown>
  );
}`,
];

const dropdownDocs = generateDocs({
	packageName: '@signozhq/dropdown-menu',
	description:
		'A versatile dropdown menu component with support for icons, search, nested menus, selection states, and custom styling.',
	examples: dropdownExamples,
});

const meta: Meta<typeof Dropdown> = {
	title: 'Components/DropdownMenu',
	component: Dropdown,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: dropdownDocs,
			},
		},
		backgrounds: {
			disable: true,
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// Basic Dropdown
export const Basic: Story = {
	render: () => {
		const items: MenuItem[] = [
			{ key: 'profile', label: 'Profile' },
			{ key: 'settings', label: 'Settings' },
			{ key: 'billing', label: 'Billing' },
			{ type: 'divider' },
			{ key: 'logout', label: 'Logout' },
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items }}>
					<Button variant={ButtonVariant.Outlined}>Open Menu</Button>
				</Dropdown>
			</div>
		);
	},
};

// With Icons
export const WithIcons: Story = {
	render: () => {
		const items1: MenuItem[] = [
			{ key: 'view', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'copy', label: 'Copy link', icon: <Link className="h-4 w-4" /> },
			{ key: 'view2', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'view3', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'view4', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ type: 'divider' },
			{
				key: 'delete',
				label: 'Delete dashboard',
				icon: <Trash2 className="h-4 w-4" />,
				danger: true,
			},
		];

		const items2: MenuItem[] = [
			{
				key: 'view',
				label: 'View',
				icon: <Grid3x3 className="h-4 w-4" />,
				rightIcon: <Check className="h-4 w-4" />,
			},
			{ key: 'copy', label: 'Copy link', icon: <Link className="h-4 w-4" /> },
			{ key: 'view2', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'view3', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'view4', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
		];

		const items3: MenuItem[] = [
			{
				key: 'view',
				label: 'View',
				icon: <Grid3x3 className="h-4 w-4" />,
				rightIcon: <ChevronRight className="h-4 w-4" />,
			},
			{ key: 'copy', label: 'Copy link', icon: <Link className="h-4 w-4" /> },
			{ key: 'view2', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'view3', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'view4', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ type: 'divider' },
			{
				key: 'delete',
				label: 'Delete dashboard',
				icon: <Trash2 className="h-4 w-4" />,
				danger: true,
			},
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items: items1 }}>
					<Button variant={ButtonVariant.Outlined}>View Options</Button>
				</Dropdown>

				<Dropdown menu={{ items: items2 }}>
					<Button variant={ButtonVariant.Outlined}>With Checkmark</Button>
				</Dropdown>

				<Dropdown menu={{ items: items3 }}>
					<Button variant={ButtonVariant.Outlined}>With Arrow</Button>
				</Dropdown>
			</div>
		);
	},
};

// Destructive Items
export const Destructive: Story = {
	render: () => {
		const items: MenuItem[] = [
			{ key: 'view', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'copy', label: 'Copy link', icon: <Link className="h-4 w-4" /> },
			{ type: 'divider' },
			{
				key: 'delete',
				label: 'Delete dashboard',
				icon: <Trash2 className="h-4 w-4" />,
				danger: true,
			},
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items }}>
					<Button variant={ButtonVariant.Outlined} color="destructive">
						Delete dashboard
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// Section Labels
export const WithSectionLabels: Story = {
	render: () => {
		const items: MenuItem[] = [
			{
				type: 'group',
				label: 'SECTION LABEL',
				children: [
					{
						key: 'view',
						label: 'View',
						icon: <Grid3x3 className="h-4 w-4" />,
						rightIcon: <Check className="h-4 w-4" />,
					},
					{ key: 'copy', label: 'Copy link', icon: <Link className="h-4 w-4" /> },
					{ key: 'view2', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
					{ key: 'view3', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
					{ key: 'view4', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
					{ type: 'divider' },
					{
						key: 'delete',
						label: 'Delete dashboard',
						icon: <Trash2 className="h-4 w-4" />,
						danger: true,
					},
				],
			},
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items }}>
					<Button variant={ButtonVariant.Outlined}>Menu with Sections</Button>
				</Dropdown>
			</div>
		);
	},
};

// Checkable Items
export const Checkable: Story = {
	render: () => {
		const [showStatusBar, setShowStatusBar] = useState(true);
		const [showActivityBar, setShowActivityBar] = useState(false);
		const [showPanel, setShowPanel] = useState(false);
		const [panelPosition, setPanelPosition] = useState('bottom');

		const checkboxItems: MenuItem[] = [
			{
				type: 'group',
				label: 'Appearance',
				children: [
					{
						type: 'checkbox',
						key: 'status-bar',
						label: 'Status Bar',
						checked: showStatusBar,
						onCheckedChange: setShowStatusBar,
					},
					{
						type: 'checkbox',
						key: 'activity-bar',
						label: 'Activity Bar',
						checked: showActivityBar,
						onCheckedChange: setShowActivityBar,
						disabled: true,
					},
					{
						type: 'checkbox',
						key: 'panel',
						label: 'Panel',
						checked: showPanel,
						onCheckedChange: setShowPanel,
					},
				],
			},
		];

		const radioItems: MenuItem[] = [
			{
				type: 'group',
				label: 'Panel Position',
				children: [
					{
						type: 'radio-group',
						value: panelPosition,
						onChange: setPanelPosition,
						children: [
							{ type: 'radio', key: 'top', label: 'Top', value: 'top' },
							{ type: 'radio', key: 'bottom', label: 'Bottom', value: 'bottom' },
							{ type: 'radio', key: 'right', label: 'Right', value: 'right' },
						],
					},
				],
			},
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items: checkboxItems }}>
					<Button variant={ButtonVariant.Outlined}>Checkbox Items</Button>
				</Dropdown>

				<Dropdown menu={{ items: radioItems }}>
					<Button variant={ButtonVariant.Outlined}>Radio Group</Button>
				</Dropdown>
			</div>
		);
	},
};

// Nested Menus (2-Step) - Standard Radix SubMenu
export const NestedMenus: Story = {
	render: () => {
		const items: MenuItem[] = [
			{
				type: 'group',
				label: 'SECTION LABEL',
				children: [
					{
						key: 'step2',
						label: 'Step 2',
						icon: <Grid3x3 className="h-4 w-4" />,
						children: [
							{
								key: 'another-link',
								label: 'Another link',
								icon: <Link className="h-4 w-4" />,
							},
							{
								key: 'one-link',
								label: 'One link',
								icon: <Grid3x3 className="h-4 w-4" />,
							},
							{
								key: 'another-activity',
								label: 'Another activity',
								icon: <Grid3x3 className="h-4 w-4" />,
							},
							{ type: 'divider' },
							{
								key: 'delete',
								label: 'Delete dashboard',
								icon: <Trash2 className="h-4 w-4" />,
								danger: true,
							},
						],
					},
					{
						key: 'another-link',
						label: 'Another link',
						icon: <Link className="h-4 w-4" />,
					},
					{
						key: 'one-link',
						label: 'One link',
						icon: <Grid3x3 className="h-4 w-4" />,
					},
					{
						key: 'another-activity',
						label: 'Another activity',
						icon: <Grid3x3 className="h-4 w-4" />,
					},
					{ type: 'divider' },
					{
						key: 'delete',
						label: 'Delete dashboard',
						icon: <Trash2 className="h-4 w-4" />,
						danger: true,
					},
				],
			},
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items }}>
					<Button variant={ButtonVariant.Outlined}>Nested Menu</Button>
				</Dropdown>
			</div>
		);
	},
};

// Multi-Step Dropdown (Primary/Secondary switching)
// Note: Multi-step dropdowns are not supported in the simplified API.
// Use nested submenus instead for hierarchical navigation.
export const MultiStepDropdown: Story = {
	render: () => {
		// Using nested submenus as an alternative to multi-step
		const items: MenuItem[] = [
			{
				key: 'step2',
				label: 'Step 2',
				icon: <Grid3x3 className="h-4 w-4" />,
				children: [
					{
						key: 'another-link',
						label: 'Another link',
						icon: <Link className="h-4 w-4" />,
					},
					{
						key: 'one-link',
						label: 'One link',
						icon: <Grid3x3 className="h-4 w-4" />,
					},
					{
						key: 'another-activity',
						label: 'Another activity',
						icon: <Grid3x3 className="h-4 w-4" />,
					},
					{ type: 'divider' },
					{
						key: 'delete',
						label: 'Delete dashboard',
						icon: <Trash2 className="h-4 w-4" />,
						danger: true,
					},
				],
			},
		];

		const fontSizeItems: MenuItem[] = [
			{
				key: 'font-size',
				label: 'Font size',
				children: [
					{
						type: 'radio-group',
						value: 'medium',
						children: [
							{ type: 'radio', key: 'small', label: 'Small', value: 'small' },
							{ type: 'radio', key: 'medium', label: 'Medium', value: 'medium' },
							{ type: 'radio', key: 'large', label: 'Large', value: 'large' },
						],
					},
				],
			},
		];

		return (
			<div className="p-8 flex gap-4">
				<Dropdown menu={{ items }}>
					<Button variant={ButtonVariant.Outlined}>Multi-Step Menu (Nested)</Button>
				</Dropdown>

				<Dropdown menu={{ items: fontSizeItems }}>
					<Button variant={ButtonVariant.Outlined}>Font Size Selector</Button>
				</Dropdown>
			</div>
		);
	},
};

// Search Dropdown
export const WithSearch: Story = {
	render: () => {
		const [searchQuery, setSearchQuery] = useState('');
		const [isLoading, setIsLoading] = useState(false);

		const allItems: MenuItem[] = [
			{ key: 'view', label: 'View', icon: <Grid3x3 className="h-4 w-4" /> },
			{ key: 'copy', label: 'Copy link', icon: <Link className="h-4 w-4" /> },
			{ key: 'edit', label: 'Edit', icon: <Edit className="h-4 w-4" /> },
			{
				key: 'settings',
				label: 'Settings',
				icon: <Settings className="h-4 w-4" />,
			},
			{ key: 'delete', label: 'Delete', icon: <Trash2 className="h-4 w-4" /> },
		];

		const filteredItems = allItems.filter((item) => {
			if (
				item.type === 'divider' ||
				item.type === 'group' ||
				item.type === 'radio-group'
			) {
				return true;
			}
			// Type guard: exclude radio-group (already handled above) and check if label exists
			if (item.type === 'checkbox') {
				const label = typeof item.label === 'string' ? item.label : '';
				return label.toLowerCase().includes(searchQuery.toLowerCase());
			}
			// For other items (SubMenuItem, BaseMenuItem), check if label exists
			if ('label' in item) {
				const label = typeof item.label === 'string' ? item.label : '';
				if (label) {
					return label.toLowerCase().includes(searchQuery.toLowerCase());
				}
			}
			return false;
		});

		const handleSearchChange = (value: string) => {
			setSearchQuery(value);
			if (value) {
				setIsLoading(true);
				setTimeout(() => setIsLoading(false), 500);
			}
		};

		return (
			<div className="p-8 flex gap-4">
				<Dropdown
					menu={{
						items: isLoading ? [] : filteredItems,
						search: {
							placeholder: 'Search...',
							searchIcon: <Search className="h-4 w-4" />,
							onSearchChange: handleSearchChange,
						},
						loading: isLoading,
					}}
				>
					<Button variant={ButtonVariant.Outlined}>Search Menu</Button>
				</Dropdown>
			</div>
		);
	},
};

// Loading State
export const Loading: Story = {
	render: () => (
		<div className="p-8 flex gap-4">
			<Dropdown menu={{ items: [], loading: true }}>
				<Button variant={ButtonVariant.Outlined}>Loading Menu</Button>
			</Dropdown>
		</div>
	),
};

// All States Showcase
export const AllStates: Story = {
	render: () => {
		const defaultItems: MenuItem[] = [
			{ key: 'default', label: 'Default item' },
			{ key: 'hover', label: 'Hover me' },
			{ key: 'disabled', label: 'Disabled item', disabled: true },
		];

		const shortcutItems: MenuItem[] = [
			{ key: 'profile', label: 'Profile', shortcut: '⇧⌘P' },
			{ key: 'billing', label: 'Billing', shortcut: '⌘B' },
			{ key: 'settings', label: 'Settings', shortcut: '⌘S' },
		];

		const complexItems: MenuItem[] = [
			{
				type: 'group',
				label: 'My Account',
				children: [
					{
						key: 'profile',
						label: 'Profile',
						icon: <User className="h-4 w-4" />,
						shortcut: '⇧⌘P',
					},
					{
						key: 'settings',
						label: 'Settings',
						icon: <Settings className="h-4 w-4" />,
						shortcut: '⌘S',
					},
					{
						key: 'keyboard',
						label: 'Keyboard shortcuts',
						icon: <FileText className="h-4 w-4" />,
						shortcut: '⌘K',
					},
				],
			},
			{ type: 'divider' },
			{ key: 'team', label: 'Team', icon: <Folder className="h-4 w-4" /> },
			{
				key: 'invite',
				label: 'Invite users',
				icon: <User className="h-4 w-4" />,
				children: [
					{ key: 'email', label: 'Email', icon: <Copy className="h-4 w-4" /> },
					{ key: 'message', label: 'Message', icon: <Link className="h-4 w-4" /> },
					{ type: 'divider' },
					{ key: 'more', label: 'More...' },
				],
			},
			{
				key: 'new-team',
				label: 'New Team',
				icon: <Folder className="h-4 w-4" />,
				shortcut: '⌘+T',
			},
			{ type: 'divider' },
			{ key: 'github', label: 'GitHub', icon: <Link className="h-4 w-4" /> },
			{ key: 'support', label: 'Support' },
			{ key: 'api', label: 'API', disabled: true },
			{ type: 'divider' },
			{
				key: 'logout',
				label: 'Log out',
				icon: <LogOut className="h-4 w-4" />,
				danger: true,
				shortcut: '⇧⌘Q',
			},
		];

		return (
			<div className="p-8 space-y-8">
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Default States</h3>
					<div className="flex gap-4">
						<Dropdown menu={{ items: defaultItems }}>
							<Button variant={ButtonVariant.Outlined}>Default</Button>
						</Dropdown>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-semibold">With Shortcuts</h3>
					<div className="flex gap-4">
						<Dropdown menu={{ items: shortcutItems }}>
							<Button variant={ButtonVariant.Outlined}>Shortcuts</Button>
						</Dropdown>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Complex Example</h3>
					<div className="flex gap-4">
						<Dropdown menu={{ items: complexItems }} align="end" className="w-56">
							<Button variant={ButtonVariant.Outlined} size={ButtonSize.XS}>
								<MoreHorizontal />
							</Button>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	},
};
