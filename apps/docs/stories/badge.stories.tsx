import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@signozhq/badge';
import { generateDocs } from '../utils/generateDocs';

const badgeExamples = [
	`import { Badge } from '@signozhq/badge';

export default function MyComponent() {
	return (
		<div className="flex gap-2">
			<Badge color="primary">Primary</Badge>
			<Badge color="secondary">Secondary</Badge>
			<Badge variant="outline" color="destructive">Destructive</Badge>
		</div>
	);
}`,
];

const badgeDocs = generateDocs({
	packageName: '@signozhq/badge',
	description:
		'A versatile badge component for displaying status, counts, or labels with various colors and styles.',
	examples: badgeExamples,
});

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
	parameters: {
		docs: {
			description: {
				component: badgeDocs,
			},
		},
	},
	tags: ['autodocs'],
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
	render: (args: Story['args']) => (
		<div className="flex gap-2">
			<Badge {...args} color="vanilla">
				Vanilla
			</Badge>
			<Badge {...args} color="robin">
				Robin
			</Badge>
			<Badge {...args} color="forest">
				Forest
			</Badge>
			<Badge {...args} color="amber">
				Amber
			</Badge>
			<Badge {...args} color="sienna">
				Sienna
			</Badge>
			<Badge {...args} color="cherry">
				Cherry
			</Badge>
			<Badge {...args} color="sakura">
				Sakura
			</Badge>
			<Badge {...args} color="aqua">
				Aqua
			</Badge>
		</div>
	),
};

export const Outline: Story = {
	render: (args: Story['args']) => (
		<div className="flex gap-2">
			<Badge {...args} variant="outline" color="robin">
				Robin
			</Badge>
			<Badge {...args} variant="outline" color="forest">
				Forest
			</Badge>
			<Badge {...args} variant="outline" color="amber">
				Amber
			</Badge>
			<Badge {...args} variant="outline" color="sienna">
				Sienna
			</Badge>
			<Badge {...args} variant="outline" color="cherry">
				Cherry
			</Badge>
			<Badge {...args} variant="outline" color="sakura">
				Sakura
			</Badge>
			<Badge {...args} variant="outline" color="aqua">
				Aqua
			</Badge>
		</div>
	),
};

export const WithIcons: Story = {
	render: (args: Story['args']) => (
		<div className="flex gap-2">
			<Badge {...args} color="robin">
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
			<Badge {...args} variant="outline" color="robin">
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
	render: (args: Story['args']) => (
		<div className="flex gap-2">
			<Badge {...args} color="robin" capitalize>
				Capitalized Badge
			</Badge>
			<Badge {...args} variant="outline" color="robin" capitalize>
				Capitalized Outline
			</Badge>
		</div>
	),
};
