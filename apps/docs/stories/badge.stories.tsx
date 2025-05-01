import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@signozhq/badge';

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		children: 'Badge',
		color: 'primary',
	},
};

export const Colors: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge color="primary">Primary</Badge>
			<Badge color="secondary">Secondary</Badge>
			<Badge color="destructive">Destructive</Badge>
			<Badge color="warning">Warning</Badge>
		</div>
	),
};

export const Outline: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge variant="outline" color="primary">
				Primary
			</Badge>
			<Badge variant="outline" color="secondary">
				Secondary
			</Badge>
			<Badge variant="outline" color="destructive">
				Destructive
			</Badge>
			<Badge variant="outline" color="warning">
				Warning
			</Badge>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge color="primary">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
				</svg>
				With Icon
			</Badge>
			<Badge variant="outline" color="secondary">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
				</svg>
				With Icon
			</Badge>
		</div>
	),
};
