import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@signozhq/badge';

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: 16 }}>
			<Badge variant="default">Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	),
};

export const CustomColors: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">BETA</Badge>
			<Badge className="bg-blue-600 text-white hover:bg-blue-700">BETA</Badge>
			<Badge className="bg-green-500 text-white hover:bg-green-600">BETA</Badge>
			<Badge className="bg-yellow-300 text-black hover:bg-yellow-400">BETA</Badge>
			<Badge className="bg-amber-400 text-white hover:bg-amber-500">BETA</Badge>
			<Badge className="bg-amber-700 text-white hover:bg-amber-800">BETA</Badge>
			<Badge className="bg-red-500 text-white hover:bg-red-600">BETA</Badge>
			<Badge className="bg-pink-400 text-white hover:bg-pink-500">BETA</Badge>
			<Badge className="bg-sky-400 text-white hover:bg-sky-500">BETA</Badge>
		</div>
	),
};
