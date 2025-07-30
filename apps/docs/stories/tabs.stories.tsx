import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '@signozhq/tabs';
import { generateDocs } from '../utils/generateDocs';
import {
	AlertCircle,
	Component,
	History,
	LayoutGrid,
	List,
	Settings,
	Settings2,
	Lock,
	Clock,
	ShieldAlert,
} from 'lucide-react';

const tabsExamples = [
	`import Tabs from '@signozhq/tabs';
import { Settings, AlertCircle } from '@signozhq/icons';

export default function MyComponent() {
	const items = [
		{
			key: 'overview',
			label: 'Overview',
			children: 'Overview content',
			prefixIcon: <Settings className="size-4" />,
		},
		{
			key: 'issues',
			label: 'Issues',
			children: 'Issues content',
			prefixIcon: <AlertCircle className="size-4" />,
		}
	];

	return (
		<Tabs
			items={items}
			variant="primary"
			defaultValue="overview"
		/>
	);
}`,
];

const tabsDocs = generateDocs({
	packageName: '@signozhq/tabs',
	description:
		'A flexible tabbed interface component with primary and secondary variants, supporting icons and disabled states.',
	examples: tabsExamples,
});

const meta: Meta<typeof Tabs> = {
	title: 'Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: tabsDocs,
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const playgroundItems = [
	// Primary variant items
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 className="size-4" />,
	},
	{
		key: 'issues',
		label: 'Issues (Disabled)',
		children: 'Issues content panel',
		disabled: true,
		disabledReason: 'Issues are temporarily unavailable',
		prefixIcon: <AlertCircle className="size-4" />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content panel',
		suffixIcon: <History className="size-4" />,
	},
	{
		key: 'another',
		label: 'Another Tab',
		children: 'Another content panel',
	},
	{
		key: 'all-endpoints',
		label: 'All Endpoints',
		children: 'Endpoints list panel',
		variant: 'secondary',
	},
	{
		key: 'details',
		label: 'Endpoint Details',
		children: 'Details content panel',
		variant: 'secondary',
	},
	{
		key: 'settings',
		label: 'Settings',
		children: 'Settings content panel',
		variant: 'secondary',
		prefixIcon: <Settings className="size-4" />,
		disabled: true,
		disabledReason: 'You need admin privileges to access settings',
	},
];

export const Default: Story = {
	render: () => (
		<div className="space-y-8">
			<div>
				<h2 className="mb-4 text-lg font-semibold">Primary Variant</h2>
				<Tabs
					items={playgroundItems.filter((i) => i.variant !== 'secondary')}
					variant="primary"
					defaultValue="overview"
				/>
			</div>

			<div>
				<h2 className="mb-4 text-lg font-semibold">Secondary Variant</h2>
				<Tabs
					items={playgroundItems
						.filter((i) => i.variant === 'secondary')
						.map((i) => ({ ...i, variant: undefined }))}
					variant="secondary"
					defaultValue="all-endpoints"
				/>
			</div>

			<div>
				<h2 className="mb-4 text-lg font-semibold">With Icons</h2>
				<Tabs
					items={[
						{
							key: 'apps',
							label: 'Applications',
							children: 'Applications list',
							prefixIcon: <LayoutGrid className="size-4" />,
							suffixIcon: <List className="size-4" />,
						},
						{
							key: 'modules',
							label: 'Modules',
							children: 'Modules content',
							prefixIcon: <Component className="size-4" />,
						},
					]}
					variant="primary"
					defaultValue="apps"
				/>
			</div>
		</div>
	),
};

const primaryItems = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content',
		prefixIcon: <Settings className="size-4" />,
	},
	{
		key: 'issues',
		label: 'Issues',
		children: 'Issues content',
		disabled: true,
		disabledReason: 'Issues feature is currently under maintenance',
		prefixIcon: <AlertCircle className="size-4" />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content',
		suffixIcon: <History className="size-4" />,
	},
];

const secondaryItems = [
	{ key: 'all', label: 'All Endpoints', children: 'All endpoints content' },
	{
		key: 'details',
		label: 'Endpoint Details',
		children: 'Endpoint details content',
	},
	{
		key: 'advanced',
		label: 'Advanced Settings',
		children: 'Advanced settings content',
		disabled: true,
		disabledReason: 'Requires premium subscription',
	},
];

export const Primary: Story = {
	args: {
		items: primaryItems,
		variant: 'primary',
		defaultValue: 'overview',
	},
};

export const Secondary: Story = {
	args: {
		items: secondaryItems,
		variant: 'secondary',
		defaultValue: 'all',
	},
};

export const DisabledStates: Story = {
	render: () => (
		<div className="space-y-8">
			<div>
				<h2 className="mb-4 text-lg font-semibold">
					Disabled Tabs with Custom Reasons
				</h2>
				<Tabs
					items={[
						{
							key: 'active',
							label: 'Active Tab',
							children: 'This tab is active and can be clicked',
						},
						{
							key: 'locked',
							label: 'Locked',
							children: 'Locked content',
							disabled: true,
							disabledReason: 'This feature is locked',
							prefixIcon: <Lock className="size-4" />,
						},
						{
							key: 'maintenance',
							label: 'Under Maintenance',
							children: 'Maintenance content',
							disabled: true,
							disabledReason: 'This section is under maintenance',
							prefixIcon: <Clock className="size-4" />,
						},
						{
							key: 'permissions',
							label: 'Insufficient Permissions',
							children: 'Permissions content',
							disabled: true,
							disabledReason: 'You do not have permission to access this area',
							prefixIcon: <ShieldAlert className="size-4" />,
						},
						{
							key: 'default',
							label: 'Default Disabled',
							children: 'Default disabled content',
							disabled: true,
							// No disabledReason provided, will show default message
						},
					]}
					variant="primary"
					defaultValue="active"
				/>
			</div>

			<div>
				<h2 className="mb-4 text-lg font-semibold">
					Secondary Variant Disabled States
				</h2>
				<Tabs
					items={[
						{
							key: 'active',
							label: 'Active Tab',
							children: 'This tab is active and can be clicked',
						},
						{
							key: 'premium',
							label: 'Premium Features',
							children: 'Premium content',
							disabled: true,
							disabledReason: 'Available only in premium tier',
						},
						{
							key: 'beta',
							label: 'Beta Features',
							children: 'Beta content',
							disabled: true,
							disabledReason: 'Coming soon - currently in beta testing',
						},
					]}
					variant="secondary"
					defaultValue="active"
				/>
			</div>
		</div>
	),
};
