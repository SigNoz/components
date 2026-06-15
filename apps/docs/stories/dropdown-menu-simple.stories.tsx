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
import { Button, DropdownMenuSimple, type MenuItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

const searchMenuItems: MenuItem[] = [
	{ key: 'profile', label: 'Profile', icon: <User size={16} /> },
	{ key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
	{ key: 'billing', label: 'Billing', icon: <FileText size={16} /> },
	{ type: 'divider' },
	{ key: 'view', label: 'View dashboard', icon: <Grid3X3 size={16} /> },
	{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
	{ key: 'folder', label: 'Open folder', icon: <Folder size={16} /> },
	{ type: 'divider' },
	{
		key: 'logout',
		label: 'Log out',
		icon: <LogOut size={16} />,
		danger: true,
	},
];

function CheckableMenuPreview() {
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
		<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
			<DropdownMenuSimple menu={{ items: checkboxItems }}>
				<Button variant="solid" color="secondary">
					Checkbox Items
				</Button>
			</DropdownMenuSimple>
			<DropdownMenuSimple menu={{ items: radioItems }}>
				<Button variant="solid" color="secondary">
					Radio Group
				</Button>
			</DropdownMenuSimple>
		</div>
	);
}

function WithSearchMenuPreview() {
	const [query, setQuery] = useState('');
	const filteredItems = useMemo(() => {
		if (!query.trim()) return searchMenuItems;
		const q = query.toLowerCase();
		return searchMenuItems.filter((item) => {
			if ('type' in item && item.type === 'divider') return true;
			return 'label' in item && String(item.label).toLowerCase().includes(q);
		});
	}, [query]);

	return (
		<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
			<DropdownMenuSimple
				menu={{
					items: filteredItems,
					search: {
						placeholder: 'Search menu...',
						searchIcon: <Search size={16} />,
						onSearchChange: setQuery,
					},
				}}
			>
				<Button variant="solid" color="secondary">
					Search Menu
				</Button>
			</DropdownMenuSimple>
		</div>
	);
}

const meta: Meta<typeof DropdownMenuSimple> = {
	title: 'Composed Components/DropdownMenuSimple',
	component: DropdownMenuSimple,
	parameters: {
		layout: 'fullscreen',
		backgrounds: { default: 'dark' },
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
		style: {
			control: false,
			description: 'Inline styles applied to custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof DropdownMenuSimple>;

export const Default: Story = {
	args: {
		menu: {
			items: [
				{
					type: 'group',
					label: 'My Account',
					children: [
						{ key: 'view', label: 'View', icon: <Grid3X3 size={16} /> },
						{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
						{ type: 'divider' },
						{
							key: 'delete',
							label: 'Delete',
							icon: <Trash2 size={16} />,
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
		<div style={{ padding: '2rem' }}>
			<DropdownMenuSimple {...args}>
				<Button variant="solid" color="secondary">
					Open
				</Button>
			</DropdownMenuSimple>
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Basic
				</h3>
				<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
					<DropdownMenuSimple
						menu={{
							items: [
								{ key: 'profile', label: 'Profile' },
								{ key: 'settings', label: 'Settings' },
								{ key: 'billing', label: 'Billing' },
								{ type: 'divider' },
								{ key: 'logout', label: 'Logout' },
							],
						}}
					>
						<Button variant="solid" color="secondary">
							Open Menu
						</Button>
					</DropdownMenuSimple>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Icons
				</h3>
				<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
					<DropdownMenuSimple
						menu={{
							items: [
								{ key: 'view', label: 'View', icon: <Grid3X3 size={16} /> },
								{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
								{ key: 'open', label: 'Open', icon: <FileText size={16} /> },
								{ key: 'duplicate', label: 'Duplicate', icon: <Copy size={16} /> },
								{ key: 'archive', label: 'Archive', icon: <Folder size={16} /> },
								{ type: 'divider' },
								{
									key: 'delete',
									label: 'Delete dashboard',
									icon: <Trash2 size={16} />,
									danger: true,
								},
							],
						}}
					>
						<Button variant="solid" color="secondary">
							View Options
						</Button>
					</DropdownMenuSimple>
					<DropdownMenuSimple
						menu={{
							items: [
								{
									key: 'view',
									label: 'View',
									icon: <Grid3X3 size={16} />,
									rightIcon: <Check size={16} />,
								},
								{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
								{ key: 'open', label: 'Open', icon: <FileText size={16} /> },
								{ key: 'duplicate', label: 'Duplicate', icon: <Copy size={16} /> },
								{ key: 'archive', label: 'Archive', icon: <Folder size={16} /> },
							],
						}}
					>
						<Button variant="solid" color="secondary">
							With Checkmark
						</Button>
					</DropdownMenuSimple>
					<DropdownMenuSimple
						menu={{
							items: [
								{
									key: 'view',
									label: 'View',
									icon: <Grid3X3 size={16} />,
									rightIcon: <ChevronRight size={16} />,
								},
								{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
								{ key: 'open', label: 'Open', icon: <FileText size={16} /> },
								{ key: 'duplicate', label: 'Duplicate', icon: <Copy size={16} /> },
								{ key: 'archive', label: 'Archive', icon: <Folder size={16} /> },
								{ type: 'divider' },
								{
									key: 'delete',
									label: 'Delete dashboard',
									icon: <Trash2 size={16} />,
									danger: true,
								},
							],
						}}
					>
						<Button variant="solid" color="secondary">
							With Arrow
						</Button>
					</DropdownMenuSimple>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Destructive
				</h3>
				<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
					<DropdownMenuSimple
						menu={{
							items: [
								{ key: 'view', label: 'View', icon: <Grid3X3 size={16} /> },
								{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
								{ type: 'divider' },
								{
									key: 'delete',
									label: 'Delete dashboard',
									icon: <Trash2 size={16} />,
									danger: true,
								},
							],
						}}
					>
						<Button variant="solid" color="secondary">
							Delete dashboard
						</Button>
					</DropdownMenuSimple>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Section Labels
				</h3>
				<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
					<DropdownMenuSimple
						menu={{
							items: [
								{
									type: 'group',
									label: 'SECTION LABEL',
									children: [
										{
											key: 'view',
											label: 'View',
											icon: <Grid3X3 size={16} />,
											rightIcon: <Check size={16} />,
										},
										{ key: 'copy', label: 'Copy link', icon: <Link2 size={16} /> },
										{ key: 'open', label: 'Open', icon: <FileText size={16} /> },
										{ key: 'duplicate', label: 'Duplicate', icon: <Copy size={16} /> },
										{ key: 'archive', label: 'Archive', icon: <Folder size={16} /> },
										{ type: 'divider' },
										{
											key: 'delete',
											label: 'Delete dashboard',
											icon: <Trash2 size={16} />,
											danger: true,
										},
									],
								},
							],
						}}
					>
						<Button variant="solid" color="secondary">
							Menu with Sections
						</Button>
					</DropdownMenuSimple>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Checkable
				</h3>
				<CheckableMenuPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Nested Menus
				</h3>
				<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
					<DropdownMenuSimple
						menu={{
							items: [
								{
									type: 'group',
									label: 'SECTION LABEL',
									children: [
										{
											key: 'step2',
											label: 'Step 2',
											icon: <Grid3X3 size={16} />,
											children: [
												{
													key: 'another-link',
													label: 'Another link',
													icon: <Link2 size={16} />,
												},
												{
													key: 'one-link',
													label: 'One link',
													icon: <Grid3X3 size={16} />,
												},
												{
													key: 'another-activity',
													label: 'Another activity',
													icon: <Grid3X3 size={16} />,
												},
												{ type: 'divider' },
												{
													key: 'delete',
													label: 'Delete dashboard',
													icon: <Trash2 size={16} />,
													danger: true,
												},
											],
										},
										{
											key: 'another-link',
											label: 'Another link',
											icon: <Link2 size={16} />,
										},
										{
											key: 'one-link',
											label: 'One link',
											icon: <Grid3X3 size={16} />,
										},
										{
											key: 'another-activity',
											label: 'Another activity',
											icon: <Grid3X3 size={16} />,
										},
										{ type: 'divider' },
										{
											key: 'delete',
											label: 'Delete dashboard',
											icon: <Trash2 size={16} />,
											danger: true,
										},
									],
								},
							],
						}}
					>
						<Button variant="solid" color="secondary">
							Nested Menu
						</Button>
					</DropdownMenuSimple>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Loading
				</h3>
				<div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
					<DropdownMenuSimple menu={{ items: [], loading: true }}>
						<Button variant="solid" color="secondary">
							Loading Menu
						</Button>
					</DropdownMenuSimple>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Search
				</h3>
				<WithSearchMenuPreview />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					All States
				</h3>
				<div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Default States</h3>
						<div style={{ display: 'flex', gap: '1rem' }}>
							<DropdownMenuSimple
								menu={{
									items: [
										{ key: 'default', label: 'Default item' },
										{ key: 'hover', label: 'Hover me' },
										{ key: 'disabled', label: 'Disabled item', disabled: true },
									],
								}}
							>
								<Button variant="solid" color="secondary">
									Default
								</Button>
							</DropdownMenuSimple>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>With Shortcuts</h3>
						<div style={{ display: 'flex', gap: '1rem' }}>
							<DropdownMenuSimple
								menu={{
									items: [
										{ key: 'profile', label: 'Profile', shortcut: '⇧⌘P' },
										{ key: 'billing', label: 'Billing', shortcut: '⌘B' },
										{ key: 'settings', label: 'Settings', shortcut: '⌘S' },
									],
								}}
							>
								<Button variant="solid" color="secondary">
									Shortcuts
								</Button>
							</DropdownMenuSimple>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Complex Example</h3>
						<div style={{ display: 'flex', gap: '1rem' }}>
							<DropdownMenuSimple
								menu={{
									items: [
										{
											type: 'group',
											label: 'My Account',
											children: [
												{
													key: 'profile',
													label: 'Profile',
													icon: <User size={16} />,
													shortcut: '⇧⌘P',
												},
												{
													key: 'settings',
													label: 'Settings',
													icon: <Settings size={16} />,
													shortcut: '⌘S',
												},
												{
													key: 'keyboard',
													label: 'Keyboard shortcuts',
													icon: <FileText size={16} />,
													shortcut: '⌘K',
												},
											],
										},
										{ type: 'divider' },
										{ key: 'team', label: 'Team', icon: <Folder size={16} /> },
										{
											key: 'invite',
											label: 'Invite users',
											icon: <User size={16} />,
											children: [
												{ key: 'email', label: 'Email', icon: <Copy size={16} /> },
												{ key: 'message', label: 'Message', icon: <Link2 size={16} /> },
												{ type: 'divider' },
												{ key: 'more', label: 'More...' },
											],
										},
										{
											key: 'new-team',
											label: 'New Team',
											icon: <Folder size={16} />,
											shortcut: '⌘T',
										},
										{ type: 'divider' },
										{ key: 'github', label: 'GitHub', icon: <Link2 size={16} /> },
										{ key: 'support', label: 'Support' },
										{ key: 'api', label: 'API', disabled: true },
										{ type: 'divider' },
										{
											key: 'logout',
											label: 'Log out',
											icon: <LogOut size={16} />,
											danger: true,
											shortcut: '⇧⌘Q',
										},
									],
								}}
								align="end"
								style={{ width: '14rem' }}
							>
								<Button variant="solid" color="secondary">
									<Ellipsis />
								</Button>
							</DropdownMenuSimple>
						</div>
					</div>
				</div>
			</section>
		</div>
	),
};
