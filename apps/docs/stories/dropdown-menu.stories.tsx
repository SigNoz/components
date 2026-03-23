import {
	Check,
	ChevronRight,
	Copy,
	Ellipsis,
	FileText,
	Folder,
	Grid3X3,
	Link2,
	LogOut,
	Search,
	Settings,
	Trash2,
	User,
} from '@signozhq/icons';
import { Button, Dropdown, type MenuItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

const meta: Meta<typeof Dropdown> = {
	title: 'Components/DropdownMenu',
	component: Dropdown,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			disable: true,
		},
	},
	argTypes: {
		menu: {
			control: 'object',
			description: 'Menu configuration object containing items, search, and loading options.',
			table: { category: 'Content' },
		},
		children: {
			control: false,
			description: 'The trigger element that opens the dropdown menu.',
			table: { category: 'Content' },
		},
		align: {
			control: 'inline-radio',
			options: ['start', 'center', 'end'],
			description: 'Horizontal alignment of the dropdown relative to the trigger.',
			table: { category: 'Positioning', defaultValue: { summary: 'start' } },
		},
		side: {
			control: 'inline-radio',
			options: ['top', 'right', 'bottom', 'left'],
			description: 'Side of the trigger where the dropdown appears.',
			table: { category: 'Positioning', defaultValue: { summary: 'bottom' } },
		},
		sideOffset: {
			control: 'number',
			description: 'Distance in pixels from the trigger.',
			table: { category: 'Positioning', defaultValue: { summary: '4' } },
		},
		alignOffset: {
			control: 'number',
			description: 'Offset in pixels along the alignment axis. Useful for fine-tuning position.',
			table: { category: 'Positioning', defaultValue: { summary: '0' } },
		},
		avoidCollisions: {
			control: 'boolean',
			description:
				'When true, the dropdown will reposition to avoid collisions with viewport edges.',
			table: { category: 'Positioning', defaultValue: { summary: 'true' } },
		},
		collisionPadding: {
			control: 'number',
			description: 'Padding in pixels from viewport edges when avoiding collisions.',
			table: { category: 'Positioning', defaultValue: { summary: '8' } },
		},
		loop: {
			control: 'boolean',
			description:
				'When true, keyboard navigation will loop from last to first item and vice versa.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Appearance' },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
	args: {
		menu: {
			items: [
				{
					type: 'group',
					label: 'My Account',
					children: [
						{ key: 'view', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
						{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
						{ type: 'divider' },
						{
							key: 'delete',
							label: 'Delete',
							icon: <Trash2 className="h-4 w-4" />,
							danger: true,
						},
					],
				},
			],
		},
		align: 'start',
		side: 'bottom',
		sideOffset: 4,
	},
	render: (args) => (
		<div className="p-8">
			<Dropdown {...args}>
				<Button variant="solid" color="secondary">
					Open
				</Button>
			</Dropdown>
		</div>
	),
};

export const Playground: Story = {
	args: {
		menu: {
			items: [
				{
					type: 'group',
					label: 'My Account',
					children: [
						{ key: 'view', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
						{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
						{ type: 'divider' },
						{
							key: 'delete',
							label: 'Delete',
							icon: <Trash2 className="h-4 w-4" />,
							danger: true,
						},
					],
				},
			],
		},
		align: 'start',
		side: 'bottom',
		sideOffset: 4,
	},
	render: (args) => (
		<div className="p-8">
			<Dropdown {...args}>
				<Button variant="solid" color="secondary">
					Open
				</Button>
			</Dropdown>
		</div>
	),
};

// Basic Dropdown
export const Basic: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A simple dropdown menu with basic items and a divider. Perfect for user account menus or simple action lists.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
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
					<Button variant="solid" color="secondary">
						Open Menu
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// With Icons
export const WithIcons: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Dropdown menus support icons for enhanced visual communication. Icons can be placed on the left, right, or both sides of menu items. Use icons to make menus more scannable and intuitive.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
	render: () => {
		const items1: MenuItem[] = [
			{ key: 'view', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
			{ key: 'view2', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'view3', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'view4', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
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
				icon: <Grid3X3 className="h-4 w-4" />,
				rightIcon: <Check className="h-4 w-4" />,
			},
			{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
			{ key: 'view2', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'view3', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'view4', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
		];

		const items3: MenuItem[] = [
			{
				key: 'view',
				label: 'View',
				icon: <Grid3X3 className="h-4 w-4" />,
				rightIcon: <ChevronRight className="h-4 w-4" />,
			},
			{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
			{ key: 'view2', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'view3', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'view4', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
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
					<Button variant="solid" color="secondary">
						View Options
					</Button>
				</Dropdown>

				<Dropdown menu={{ items: items2 }}>
					<Button variant="solid" color="secondary">
						With Checkmark
					</Button>
				</Dropdown>

				<Dropdown menu={{ items: items3 }}>
					<Button variant="solid" color="secondary">
						With Arrow
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// Destructive Items
export const Destructive: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use the danger prop to highlight destructive actions like delete or remove. Destructive items are styled in red to warn users about irreversible actions.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
	render: () => {
		const items: MenuItem[] = [
			{ key: 'view', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
			{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
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
					<Button variant="solid" color="secondary">
						Delete dashboard
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// Section Labels
export const WithSectionLabels: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Organize menu items into logical groups with section labels. Groups help users navigate complex menus by categorizing related actions together.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
	render: () => {
		const items: MenuItem[] = [
			{
				type: 'group',
				label: 'SECTION LABEL',
				children: [
					{
						key: 'view',
						label: 'View',
						icon: <Grid3X3 className="h-4 w-4" />,
						rightIcon: <Check className="h-4 w-4" />,
					},
					{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
					{ key: 'view2', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
					{ key: 'view3', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
					{ key: 'view4', label: 'View', icon: <Grid3X3 className="h-4 w-4" /> },
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
					<Button variant="solid" color="secondary">
						Menu with Sections
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// Checkable Items
export const Checkable: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Dropdown menus support checkbox items for toggling options and radio groups for selecting one option from a set. Perfect for settings menus and filter controls.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
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
					<Button variant="solid" color="secondary">
						Checkbox Items
					</Button>
				</Dropdown>

				<Dropdown menu={{ items: radioItems }}>
					<Button variant="solid" color="secondary">
						Radio Group
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// Nested Menus (2-Step) - Standard Radix SubMenu
export const NestedMenus: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Create hierarchical navigation with nested submenus. Submenus automatically open on hover and display a chevron indicator. Perfect for complex action hierarchies.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
	render: () => {
		const items: MenuItem[] = [
			{
				type: 'group',
				label: 'SECTION LABEL',
				children: [
					{
						key: 'step2',
						label: 'Step 2',
						icon: <Grid3X3 className="h-4 w-4" />,
						children: [
							{
								key: 'another-link',
								label: 'Another link',
								icon: <Link2 className="h-4 w-4" />,
							},
							{
								key: 'one-link',
								label: 'One link',
								icon: <Grid3X3 className="h-4 w-4" />,
							},
							{
								key: 'another-activity',
								label: 'Another activity',
								icon: <Grid3X3 className="h-4 w-4" />,
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
						icon: <Link2 className="h-4 w-4" />,
					},
					{
						key: 'one-link',
						label: 'One link',
						icon: <Grid3X3 className="h-4 w-4" />,
					},
					{
						key: 'another-activity',
						label: 'Another activity',
						icon: <Grid3X3 className="h-4 w-4" />,
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
					<Button variant="solid" color="secondary">
						Nested Menu
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// Loading State
export const Loading: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Display a loading state while menu items are being fetched. Useful for dynamic menus that load data from an API.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 flex gap-4">
			<Dropdown menu={{ items: [], loading: true }}>
				<Button variant="solid" color="secondary">
					Loading Menu
				</Button>
			</Dropdown>
		</div>
	),
};

const searchMenuItems: MenuItem[] = [
	{ key: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
	{ key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
	{ key: 'billing', label: 'Billing', icon: <FileText className="h-4 w-4" /> },
	{ type: 'divider' },
	{ key: 'view', label: 'View dashboard', icon: <Grid3X3 className="h-4 w-4" /> },
	{ key: 'copy', label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
	{ key: 'folder', label: 'Open folder', icon: <Folder className="h-4 w-4" /> },
	{ type: 'divider' },
	{
		key: 'logout',
		label: 'Log out',
		icon: <LogOut className="h-4 w-4" />,
		danger: true,
	},
];

// With Search
export const WithSearch: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Add a search input at the top of the dropdown to filter menu items. Use onSearchChange to filter items based on the query. Great for long menus or when users need to find a specific option quickly.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
	render: () => {
		const [query, setQuery] = useState('');
		const filteredItems = useMemo(() => {
			if (!query.trim()) return searchMenuItems;
			const q = query.toLowerCase();
			return searchMenuItems.filter((item) => {
				// Dividers are kept but will be cleaned up by Dropdown's cleanupMenuItems
				if ('type' in item && item.type === 'divider') return true;
				return 'label' in item && String(item.label).toLowerCase().includes(q);
			});
		}, [query]);

		return (
			<div className="p-8 flex gap-4">
				<Dropdown
					menu={{
						items: filteredItems,
						search: {
							placeholder: 'Search menu...',
							searchIcon: <Search className="h-4 w-4" />,
							onSearchChange: setQuery,
						},
					}}
				>
					<Button variant="solid" color="secondary">
						Search Menu
					</Button>
				</Dropdown>
			</div>
		);
	},
};

// All States Showcase
export const AllStates: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A comprehensive showcase of all dropdown menu features including default states, shortcuts, icons, groups, nested menus, and various item types. This example demonstrates the full capabilities of the component.',
			},
		},
	},
	argTypes: {
		menu: { control: false },
		children: { control: false },
		align: { control: false },
		side: { control: false },
		sideOffset: { control: false },
		className: { control: false },
	},
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
					{ key: 'message', label: 'Message', icon: <Link2 className="h-4 w-4" /> },
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
			{ key: 'github', label: 'GitHub', icon: <Link2 className="h-4 w-4" /> },
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
							<Button variant="solid" color="secondary">
								Default
							</Button>
						</Dropdown>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-semibold">With Shortcuts</h3>
					<div className="flex gap-4">
						<Dropdown menu={{ items: shortcutItems }}>
							<Button variant="solid" color="secondary">
								Shortcuts
							</Button>
						</Dropdown>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Complex Example</h3>
					<div className="flex gap-4">
						<Dropdown menu={{ items: complexItems }} align="end" className="w-56">
							<Button variant="solid" color="secondary">
								<Ellipsis />
							</Button>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	},
};
