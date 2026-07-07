import { Badge, type BadgeColor, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from './badge.stories.module.css';

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
	title: 'Primitive Components/Badge',
	component: Badge,
	args: {
		onClose: fn(),
	},
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
		testId: {
			control: 'text',
			description: 'Test ID for the badge.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the badge.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description:
				'The content inside the badge. Can be text, numbers, or React elements like icons.',
			table: { category: 'Content' },
		},
		color: {
			control: 'select',
			options: [
				'primary',
				'secondary',
				'success',
				'warning',
				'error',
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
			description: 'Transforms text to uppercase with wider letter spacing for emphasis.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'Use Radix Slot to compose the badge as a different element (e.g., button, link). The closable prop is intended for the default span-rendered Badge.',
			table: { category: 'Composition', defaultValue: { summary: 'false' } },
		},
		textEllipsis: {
			control: 'boolean',
			description:
				'Enable text truncation. Use true for center truncation, or pass start, center, or end in code.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean | "start" | "center" | "end"' },
			},
		},
		closable: {
			control: 'boolean',
			description:
				'Renders a trailing close button. The badge hides after close unless onClose prevents default.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		onClose: {
			control: false,
			description:
				'Callback fired from the close button. Call event.preventDefault() to keep the badge visible.',
			table: {
				category: 'Events',
				type: { summary: '(event: React.MouseEvent<HTMLButtonElement>) => void' },
			},
		},
		closeIcon: {
			control: false,
			description: 'Custom close icon. Defaults to X from @signozhq/icons.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		closeAriaLabel: {
			control: 'text',
			description: 'Accessible label for the close button.',
			table: { category: 'Accessibility', defaultValue: { summary: 'Close badge' } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
	args: {
		children: 'Hello',
		color: 'robin',
		variant: 'default',
		capitalize: false,
		asChild: false,
		closable: false,
		closeAriaLabel: 'Close badge',
	},
	render: (props) => {
		if (props.asChild) {
			return (
				<Badge {...props}>
					<a href="#hi" onClick={(e) => e.preventDefault()}>
						Random link
					</a>
				</Badge>
			);
		}

		return <Badge {...props} />;
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
			<div className={`story-grid ${styles.gridHalfWidth}`}>
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
			<div className="story-grid">
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
		<div className="story-section">
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					System Status
				</Typography>
				<div className="story-grid">
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
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					User Status
				</Typography>
				<div className="story-grid">
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
		<div className="story-section">
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Message Notifications
				</Typography>
				<div className="story-row-lg">
					<div className="story-row">
						<BellIcon />
						<Typography>Messages</Typography>
						<Badge color="cherry">12</Badge>
					</div>
					<div className="story-row">
						<BellIcon />
						<Typography>Alerts</Typography>
						<Badge color="amber">3</Badge>
					</div>
					<div className="story-row">
						<BellIcon />
						<Typography>Updates</Typography>
						<Badge color="aqua">99+</Badge>
					</div>
				</div>
			</div>
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					With Outline Variant
				</Typography>
				<div className="story-row-lg">
					<div className="story-row">
						<Typography>Inbox</Typography>
						<Badge color="robin" variant="outline">
							5
						</Badge>
					</div>
					<div className="story-row">
						<Typography>Drafts</Typography>
						<Badge color="vanilla" variant="outline">
							2
						</Badge>
					</div>
					<div className="story-row">
						<Typography>Archive</Typography>
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
		<div className="story-section">
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Success & Verification
				</Typography>
				<div className="story-grid">
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
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Alerts & Warnings
				</Typography>
				<div className="story-grid">
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
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Notifications
				</Typography>
				<div className="story-grid">
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
		<div className="story-section">
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Priority Levels
				</Typography>
				<div className="story-grid">
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
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Status Codes
				</Typography>
				<div className="story-grid">
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
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Comparison: Normal vs Capitalized
				</Typography>
				<div className="story-grid-lg">
					<div className="story-column">
						<Typography size="xs" color="muted">
							Normal
						</Typography>
						<Badge color="robin">Active User</Badge>
					</div>
					<div className="story-column">
						<Typography size="xs" color="muted">
							Capitalized
						</Typography>
						<Badge color="robin" capitalize>
							Active User
						</Badge>
					</div>
				</div>
			</div>
		</div>
	),
};

export const TextEllipsisPositions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The `textEllipsis` prop enables canvas-based text truncation with ellipsis at different positions. Use `true` or `"center"` for center truncation (default), `"start"` for start truncation, or `"end"` for end truncation. Only works with string children.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
		textEllipsis: { control: false },
	},
	render: () => (
		<div className={styles.columnLayout}>
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Ellipsis Positions
				</Typography>
				<div className="story-section-sm">
					<div className={`story-row ${styles.rowGapMedium}`}>
						<Typography size="xs" color="muted" className={styles.labelWidth}>
							Center:
						</Typography>
						<div className={styles.badgeWidthContainer}>
							<Badge color="robin" textEllipsis="center">
								This is a very long badge text that will be truncated in the center
							</Badge>
						</div>
					</div>
					<div className={`story-row ${styles.rowGapMedium}`}>
						<Typography size="xs" color="muted" className={styles.labelWidth}>
							Start:
						</Typography>
						<div className={styles.badgeWidthContainer}>
							<Badge color="forest" textEllipsis="start">
								path/to/very/long/filename/that/needs/truncation.tsx
							</Badge>
						</div>
					</div>
					<div className={`story-row ${styles.rowGapMedium}`}>
						<Typography size="xs" color="muted" className={styles.labelWidth}>
							End:
						</Typography>
						<div className={styles.badgeWidthContainer}>
							<Badge color="amber" textEllipsis="end">
								A long description that should be truncated at the end
							</Badge>
						</div>
					</div>
				</div>
			</div>
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Boolean Shorthand (defaults to center)
				</Typography>
				<div className="story-section-sm">
					<div className={styles.badgeWidthLarge}>
						<Badge color="aqua" textEllipsis>
							Using textEllipsis=true defaults to center truncation
						</Badge>
					</div>
				</div>
			</div>
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					With Outline Variant
				</Typography>
				<div className="story-section-sm">
					<div className={styles.badgeWidthMedium}>
						<Badge color="cherry" variant="outline" textEllipsis="center">
							Error: Connection timeout after 30 seconds of inactivity
						</Badge>
					</div>
					<div className={styles.badgeWidthMedium}>
						<Badge color="sakura" variant="outline" textEllipsis="end">
							User: very.long.email.address@example.domain.com
						</Badge>
					</div>
				</div>
			</div>
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomSmall}>
					Container Constrained
				</Typography>
				<Typography size="xs" color="muted" className={styles.marginBottomSmall}>
					Badges inside a narrow container will truncate automatically with textEllipsis
				</Typography>
				<div
					className={`story-panel story-section-sm ${styles.constrainedContainer} ${styles.badgeWidthFull}`}
				>
					<Badge color="robin" textEllipsis="center">
						kubernetes-deployment-production-east-us-2
					</Badge>
					<Badge color="forest" variant="outline" textEllipsis="start">
						/var/log/application/server/debug/2024-01-15.log
					</Badge>
					<Badge color="sienna" textEllipsis="end">
						Successfully processed 1,234 items in batch
					</Badge>
				</div>
			</div>
		</div>
	),
};

export const Closeable: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Set `closable` to render a trailing close button. The badge hides automatically after close unless `onClose` calls `event.preventDefault()`.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		capitalize: { control: false },
		asChild: { control: false },
		textEllipsis: { control: false },
		closable: { control: false },
		onClose: { control: false },
		closeIcon: { control: false },
		closeAriaLabel: { control: false },
	},
	render: () => (
		<div className="story-grid">
			<Badge closable color="robin" onClose={fn()} closeAriaLabel="Remove React tag">
				React
			</Badge>
			<Badge closable color="aqua" onClose={fn()} closeAriaLabel="Remove TypeScript tag">
				TypeScript
			</Badge>
			<Badge closable color="forest" onClose={fn()} closeAriaLabel="Remove Next.js tag">
				Next.js
			</Badge>
			<Badge
				closable
				color="amber"
				closeIcon={<XIcon />}
				onClose={(event) => event.preventDefault()}
				closeAriaLabel="Keep warning tag"
			>
				Persistent
			</Badge>
		</div>
	),
};

export const UsingAsChild: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The `asChild` prop uses Radix UI Slot to compose the badge as a different element. This allows you to create interactive badges that maintain all badge styling while functioning as buttons, links, or other interactive elements. The badge styling is applied to the child element instead of rendering a wrapper span. For removable tags, use `closable` with the default span-rendered Badge.',
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
		<div className={styles.columnLayout}>
			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomMedium}>
					Regular Badge vs asChild Badge
				</Typography>
				<div className={styles.columnGapMedium}>
					<div>
						<Typography size="xs" color="muted" className={styles.marginBottomSmall}>
							Regular Badge (non-interactive span)
						</Typography>
						<Badge color="robin">Static Badge</Badge>
					</div>
					<div>
						<Typography size="xs" color="muted" className={styles.marginBottomSmall}>
							asChild Badge (interactive button)
						</Typography>
						<Badge asChild color="robin">
							<button
								type="button"
								onClick={() => alert('Button badge clicked!')}
								className={styles.cursorPointer}
							>
								Interactive Badge
							</button>
						</Badge>
					</div>
				</div>
			</div>

			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomMedium}>
					Filter & Action Badges
				</Typography>
				<div className="story-grid">
					<Badge asChild color="robin" variant="outline">
						<button
							type="button"
							onClick={() => alert('All filter')}
							className={styles.cursorPointer}
						>
							All
						</button>
					</Badge>
					<Badge asChild color="forest" variant="outline">
						<button
							type="button"
							onClick={() => alert('Active filter')}
							className={styles.cursorPointer}
						>
							<CheckIcon />
							Active
						</button>
					</Badge>
					<Badge asChild color="amber" variant="outline">
						<button
							type="button"
							onClick={() => alert('Pending filter')}
							className={styles.cursorPointer}
						>
							Pending
						</button>
					</Badge>
					<Badge asChild color="cherry" variant="outline">
						<button
							type="button"
							onClick={() => alert('Remove filter')}
							className={styles.cursorPointer}
						>
							<XIcon />
							Clear
						</button>
					</Badge>
				</div>
			</div>

			<div>
				<Typography size="sm" weight="medium" className={styles.marginBottomMedium}>
					Navigation Links
				</Typography>
				<div className="story-grid">
					<Badge asChild color="aqua" variant="outline">
						<a href="#docs" onClick={(e) => e.preventDefault()} className={styles.linkStyle}>
							Documentation
						</a>
					</Badge>
					<Badge asChild color="robin">
						<a href="#guide" onClick={(e) => e.preventDefault()} className={styles.linkStyle}>
							<InfoIcon />
							Getting Started
						</a>
					</Badge>
					<Badge asChild color="sakura" variant="outline">
						<a href="#examples" onClick={(e) => e.preventDefault()} className={styles.linkStyle}>
							Examples
						</a>
					</Badge>
				</div>
			</div>
		</div>
	),
};
