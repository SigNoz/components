import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@signozhq/badge';

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
	argTypes: {
		color: {
			control: 'select',
			options: [
				'vanilla',
				'robin',
				'forest',
				'amber',
				'sienna',
				'cherry',
				'sakura',
				'aqua',
			],
			description: 'The color variant of the badge',
		},
		variant: {
			control: 'select',
			options: ['default', 'outline'],
			description: 'The visual style of the badge',
		},
		capitalize: {
			control: 'boolean',
			description: 'Whether to capitalize the badge text',
		},
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		children: 'Badge',
	},
};

export const Colors: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge color="vanilla">Vanilla</Badge>
			<Badge color="robin">Robin</Badge>
			<Badge color="forest">Forest</Badge>
			<Badge color="amber">Amber</Badge>
			<Badge color="sienna">Sienna</Badge>
			<Badge color="cherry">Cherry</Badge>
			<Badge color="sakura">Sakura</Badge>
			<Badge color="aqua">Aqua</Badge>
		</div>
	),
};

export const Outline: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge variant="outline" color="robin">
				Robin
			</Badge>
			<Badge variant="outline" color="forest">
				Forest
			</Badge>
			<Badge variant="outline" color="amber">
				Amber
			</Badge>
			<Badge variant="outline" color="sienna">
				Sienna
			</Badge>
			<Badge variant="outline" color="cherry">
				Cherry
			</Badge>
			<Badge variant="outline" color="sakura">
				Sakura
			</Badge>
			<Badge variant="outline" color="aqua">
				Aqua
			</Badge>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge color="robin">
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
			<Badge variant="outline" color="robin">
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

export const Capitalized: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge color="robin" capitalize>
				Capitalized Badge
			</Badge>
			<Badge variant="outline" color="robin" capitalize>
				Capitalized Outline
			</Badge>
		</div>
	),
};
