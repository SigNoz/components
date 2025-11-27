import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@signozhq/badge';

type BadgeColor =
	| 'vanilla'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

// Icon Components for examples
const CheckIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M20 6L9 17l-5-5" />
	</svg>
);

const XIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
);

const AlertIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

const InfoIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4M12 8h.01" />
	</svg>
);

const BellIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
	</svg>
);

const StarIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
	</svg>
);

// Meta Configuration
const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A versatile badge component for displaying status, counts, labels, and notifications. Supports multiple color themes, variants, and can include icons for enhanced visual communication. Perfect for status indicators, notification counts, tags, and user roles.',
			},
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description:
				'The content inside the badge. Can be text, numbers, or React elements like icons.',
			table: { category: 'Content' },
		},
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
			description:
				'The color theme of the badge. Each color has semantic meaning for different use cases.',
			table: { category: 'Appearance', defaultValue: { summary: 'robin' } },
		},
		variant: {
			control: 'inline-radio',
			options: ['default', 'outline'],
			description:
				'The visual style. Default is filled, outline provides a more subtle appearance.',
			table: { category: 'Appearance', defaultValue: { summary: 'default' } },
		},
		capitalize: {
			control: 'boolean',
			description:
				'Transforms text to uppercase with wider letter spacing for emphasis.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'Use Radix Slot to compose the badge as a different element (e.g., button, link).',
			table: { category: 'Composition', defaultValue: { summary: 'false' } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

// The "Playground" Story - This is the Primary story
export const Playground: Story = {
	args: {
		children: 'Badge',
		color: 'robin',
		variant: 'default',
		capitalize: false,
	},
};

// Variant Examples - These appear in the Examples section

export const AllColors: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The Badge component supports 8 semantic color themes. Each color is optimized for both light and dark modes, providing excellent contrast and readability.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => {
		const colors = (meta.argTypes?.color?.options as BadgeColor[]) || [];
		return (
			<div className="flex gap-2 flex-wrap">
				{colors.map((color) => (
					<Badge key={color} color={color}>
						{color.charAt(0).toUpperCase() + color.slice(1)}
					</Badge>
				))}
			</div>
		);
	},
};

export const OutlineVariant: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Outline variant provides a more subtle appearance with transparent background and colored border. Perfect for secondary information or when you want less visual weight.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => {
		const colors = (meta.argTypes?.color?.options as BadgeColor[]) || [];
		return (
			<div className="flex gap-2 flex-wrap">
				{colors.map((color) => (
					<Badge key={color} variant="outline" color={color}>
						{color.charAt(0).toUpperCase() + color.slice(1)}
					</Badge>
				))}
			</div>
		);
	},
};

export const StatusIndicators: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use badges to display system status, user status, or process states. Choose colors that match semantic meaning: green for success, red for errors, yellow for warnings, blue for info.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					System Status
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="forest">
						<CheckIcon />
						Online
					</Badge>
					<Badge color="cherry">
						<XIcon />
						Offline
					</Badge>
					<Badge color="amber">
						<AlertIcon />
						Maintenance
					</Badge>
					<Badge color="aqua">
						<InfoIcon />
						Pending
					</Badge>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					User Status
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="forest" variant="outline">
						<CheckIcon />
						Active
					</Badge>
					<Badge color="vanilla" variant="outline">
						Idle
					</Badge>
					<Badge color="cherry" variant="outline">
						<XIcon />
						Inactive
					</Badge>
					<Badge color="amber" variant="outline">
						<AlertIcon />
						Away
					</Badge>
				</div>
			</div>
		</div>
	),
};

export const NotificationCounts: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Perfect for displaying notification counts, unread messages, or item quantities. Works great in navigation bars, buttons, or inline with text.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Message Notifications
				</h3>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<BellIcon />
						<span className="text-vanilla-900 dark:text-vanilla-100">Messages</span>
						<Badge color="cherry">12</Badge>
					</div>
					<div className="flex items-center gap-2">
						<BellIcon />
						<span className="text-vanilla-900 dark:text-vanilla-100">Alerts</span>
						<Badge color="amber">3</Badge>
					</div>
					<div className="flex items-center gap-2">
						<BellIcon />
						<span className="text-vanilla-900 dark:text-vanilla-100">Updates</span>
						<Badge color="aqua">99+</Badge>
					</div>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					With Outline Variant
				</h3>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-vanilla-900 dark:text-vanilla-100">Inbox</span>
						<Badge color="robin" variant="outline">
							5
						</Badge>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-vanilla-900 dark:text-vanilla-100">Drafts</span>
						<Badge color="vanilla" variant="outline">
							2
						</Badge>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-vanilla-900 dark:text-vanilla-100">Archive</span>
						<Badge color="sakura" variant="outline">
							128
						</Badge>
					</div>
				</div>
			</div>
		</div>
	),
};

export const WithIcons: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Badges support icons for enhanced visual communication. Icons are automatically sized and styled. Use icons to make badges more informative and scannable.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Success & Verification
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="forest">
						<CheckIcon />
						Verified
					</Badge>
					<Badge color="forest" variant="outline">
						<CheckIcon />
						Approved
					</Badge>
					<Badge color="forest">
						<StarIcon />
						Featured
					</Badge>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Alerts & Warnings
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="amber">
						<AlertIcon />
						Warning
					</Badge>
					<Badge color="cherry">
						<XIcon />
						Error
					</Badge>
					<Badge color="aqua">
						<InfoIcon />
						Information
					</Badge>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Notifications
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="cherry">
						<BellIcon />
						New Alerts
					</Badge>
					<Badge color="robin" variant="outline">
						<BellIcon />
						Updates Available
					</Badge>
				</div>
			</div>
		</div>
	),
};

export const CapitalizedText: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use the capitalize prop to transform text to uppercase with wider letter spacing. Perfect for emphasizing important labels like status codes, priority levels, or role names.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Priority Levels
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="cherry" capitalize>
						Critical
					</Badge>
					<Badge color="amber" capitalize>
						High
					</Badge>
					<Badge color="aqua" capitalize>
						Medium
					</Badge>
					<Badge color="robin" capitalize>
						Low
					</Badge>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Status Codes
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="forest" variant="outline" capitalize>
						200 OK
					</Badge>
					<Badge color="amber" variant="outline" capitalize>
						404 Not Found
					</Badge>
					<Badge color="cherry" variant="outline" capitalize>
						500 Error
					</Badge>
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2 text-vanilla-800 dark:text-vanilla-300">
					Comparison: Normal vs Capitalized
				</h3>
				<div className="flex gap-4 flex-wrap">
					<div className="flex flex-col gap-2">
						<span className="text-xs text-vanilla-600 dark:text-vanilla-300">
							Normal
						</span>
						<Badge color="robin">Active User</Badge>
					</div>
					<div className="flex flex-col gap-2">
						<span className="text-xs text-vanilla-600 dark:text-vanilla-300">
							Capitalized
						</span>
						<Badge color="robin" capitalize>
							Active User
						</Badge>
					</div>
				</div>
			</div>
		</div>
	),
};

export const UsingAsChild: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The `asChild` prop uses Radix UI Slot to compose the badge as a different element. This allows you to create interactive badges that maintain all badge styling while functioning as buttons, links, or other interactive elements. The badge styling is applied to the child element instead of rendering a wrapper span.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
	},
	render: () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Regular Badge vs asChild Badge
				</h3>
				<div className="space-y-3">
					<div>
						<p className="text-xs text-vanilla-600 dark:text-vanilla-300 mb-2">
							Regular Badge (non-interactive span)
						</p>
						<Badge color="robin">Static Badge</Badge>
					</div>
					<div>
						<p className="text-xs text-vanilla-600 dark:text-vanilla-300 mb-2">
							asChild Badge (interactive button)
						</p>
						<Badge asChild color="robin">
							<button
								type="button"
								onClick={() => console.log('Button badge clicked!')}
								className="cursor-pointer"
							>
								Interactive Badge
							</button>
						</Badge>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Filter & Action Badges
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge asChild color="robin" variant="outline">
						<button
							type="button"
							onClick={() => alert('All filter')}
							className="cursor-pointer"
						>
							All
						</button>
					</Badge>
					<Badge asChild color="forest" variant="outline">
						<button
							type="button"
							onClick={() => alert('Active filter')}
							className="cursor-pointer"
						>
							<CheckIcon />
							Active
						</button>
					</Badge>
					<Badge asChild color="amber" variant="outline">
						<button
							type="button"
							onClick={() => alert('Pending filter')}
							className="cursor-pointer"
						>
							Pending
						</button>
					</Badge>
					<Badge asChild color="cherry" variant="outline">
						<button
							type="button"
							onClick={() => alert('Remove filter')}
							className="cursor-pointer"
						>
							<XIcon />
							Clear
						</button>
					</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Navigation Links
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge asChild color="aqua" variant="outline">
						<a
							href="#docs"
							onClick={(e) => e.preventDefault()}
							className="cursor-pointer no-underline"
						>
							Documentation
						</a>
					</Badge>
					<Badge asChild color="robin">
						<a
							href="#guide"
							onClick={(e) => e.preventDefault()}
							className="cursor-pointer no-underline"
						>
							<InfoIcon />
							Getting Started
						</a>
					</Badge>
					<Badge asChild color="sakura" variant="outline">
						<a
							href="#examples"
							onClick={(e) => e.preventDefault()}
							className="cursor-pointer no-underline"
						>
							Examples
						</a>
					</Badge>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium mb-3 text-vanilla-800 dark:text-vanilla-300">
					Tag Removal Pattern
				</h3>
				<div className="flex gap-2 flex-wrap">
					<Badge color="robin">
						React
						<Badge
							asChild
							color="robin"
							variant="outline"
							className="ml-1.5 !px-1 !py-0 hover:bg-robin-500/20"
						>
							<button
								type="button"
								onClick={() => alert('Remove React tag')}
								className="cursor-pointer border-0 bg-transparent p-0"
								aria-label="Remove React tag"
							>
								<XIcon />
							</button>
						</Badge>
					</Badge>
					<Badge color="aqua">
						TypeScript
						<Badge
							asChild
							color="aqua"
							variant="outline"
							className="ml-1.5 !px-1 !py-0 hover:bg-aqua-500/20"
						>
							<button
								type="button"
								onClick={() => alert('Remove TypeScript tag')}
								className="cursor-pointer border-0 bg-transparent p-0"
								aria-label="Remove TypeScript tag"
							>
								<XIcon />
							</button>
						</Badge>
					</Badge>
					<Badge color="forest">
						Next.js
						<Badge
							asChild
							color="forest"
							variant="outline"
							className="ml-1.5 !px-1 !py-0 hover:bg-forest-500/20"
						>
							<button
								type="button"
								onClick={() => alert('Remove Next.js tag')}
								className="cursor-pointer border-0 bg-transparent p-0"
								aria-label="Remove Next.js tag"
							>
								<XIcon />
							</button>
						</Badge>
					</Badge>
				</div>
			</div>
		</div>
	),
};
