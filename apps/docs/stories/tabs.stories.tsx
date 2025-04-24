import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '@signozhq/tabs'; // Corrected import path
import {
	AlertCircle,
	Component,
	History,
	LayoutGrid,
	List,
	Settings,
	Settings2,
} from 'lucide-react';

const meta: Meta<typeof Tabs> = {
	title: 'Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
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
];

export const Primary: Story = {
	args: {
		items: primaryItems,
		variant: 'primary',
		defaultValue: 'overview', // Added defaultValue for clarity
	},
};

export const Secondary: Story = {
	args: {
		items: secondaryItems,
		variant: 'secondary',
		defaultValue: 'all', // Added defaultValue for clarity
	},
};

export const DisabledState: Story = {
	args: {
		items: [
			...primaryItems.slice(0, 2), // Keep first two items
			{
				key: 'disabled',
				label: 'Disabled Tab',
				children: 'Disabled content',
				disabled: true,
			},
			primaryItems[2], // Add history back
		],
		variant: 'primary',
		defaultValue: 'overview', // Added defaultValue for clarity
	},
};
