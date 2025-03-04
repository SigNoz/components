import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '@signozhq/tabs';
import { Home, Code, Settings, Zap, BarChart3, History } from 'lucide-react';

const meta: Meta<typeof Tabs> = {
	title: 'Components/Tabs',
	component: Tabs,
	parameters: {
		layout: 'centered',
		backgrounds: {
			default: 'dark',
		},
		controls: {
			disable: true,
		},
	},
	decorators: [
		(Story) => (
			<div className="dark p-4">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
	args: {
		defaultValue: 'overview',
		items: [
			{
				key: 'overview',
				label: <span>Overview</span>,
				prefixIcon: <Home size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Overview</div>
						<p>Overview content goes here.</p>
					</div>
				),
			},
			{
				key: 'issues',
				label: <span>Issues</span>,
				prefixIcon: <Code size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Issues</div>
						<p>Issues content goes here.</p>
					</div>
				),
			},
			{
				key: 'settings',
				label: <span>Settings</span>,
				prefixIcon: <Settings size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Settings</div>
						<p>Settings content goes here.</p>
					</div>
				),
			},
		],
	},
};

export const WithCustomColors: Story = {
	args: {
		defaultValue: 'overview',
		slideColor: 'sienna-500',
		tabColor: 'sienna-500',
		hoverColor: 'sienna-500',
		items: [
			{
				key: 'overview',
				label: <span>Overview</span>,
				prefixIcon: <Home size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Overview</div>
						<p>Overview content goes here.</p>
					</div>
				),
			},
			{
				key: 'issues',
				label: <span>Issues</span>,
				prefixIcon: <Code size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Issues</div>
						<p>Issues content goes here.</p>
					</div>
				),
			},
			{
				key: 'autofix',
				label: <span>Autofix</span>,
				prefixIcon: <Zap size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Autofix</div>
						<p>Autofix content goes here.</p>
					</div>
				),
			},
			{
				key: 'metrics',
				label: <span>Metrics</span>,
				prefixIcon: <BarChart3 size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Metrics</div>
						<p>Metrics content goes here.</p>
					</div>
				),
			},
		],
	},
};

export const WithIconsAndDisabled: Story = {
	args: {
		defaultValue: 'overview',
		items: [
			{
				key: 'overview',
				label: <span>Overview</span>,
				prefixIcon: <Home size={16} />,
				suffixIcon: <Code size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Overview</div>
						<p>Overview content goes here.</p>
					</div>
				),
			},
			{
				key: 'issues',
				label: <span>Issues</span>,
				prefixIcon: <Code size={16} />,
				disabled: true,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">Issues</div>
						<p>Issues content goes here.</p>
					</div>
				),
			},
			{
				key: 'history',
				label: <span>History</span>,
				prefixIcon: <History size={16} />,
				children: (
					<div className="text-vanilla-400">
						<div className="text-xl font-semibold">History</div>
						<p>History content goes here.</p>
					</div>
				),
			},
		],
	},
};
