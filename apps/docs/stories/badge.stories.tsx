import { Badge, type BadgeColor } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

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
			<div
				style={{
					display: 'flex',
					gap: '0.5rem',
					maxWidth: '50%',
					flexWrap: 'wrap',
				}}
			>
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
			<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					System Status
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					User Status
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Message Notifications
				</h3>
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<BellIcon />
						<span style={{ color: 'var(--foreground)' }}>Messages</span>
						<Badge color="cherry">12</Badge>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<BellIcon />
						<span style={{ color: 'var(--foreground)' }}>Alerts</span>
						<Badge color="amber">3</Badge>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<BellIcon />
						<span style={{ color: 'var(--foreground)' }}>Updates</span>
						<Badge color="aqua">99+</Badge>
					</div>
				</div>
			</div>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Outline Variant
				</h3>
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<span style={{ color: 'var(--foreground)' }}>Inbox</span>
						<Badge color="robin" variant="outline">
							5
						</Badge>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<span style={{ color: 'var(--foreground)' }}>Drafts</span>
						<Badge color="vanilla" variant="outline">
							2
						</Badge>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
						<span style={{ color: 'var(--foreground)' }}>Archive</span>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Success & Verification
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Alerts & Warnings
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Notifications
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Priority Levels
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Status Codes
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Comparison: Normal vs Capitalized
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
						<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Normal</span>
						<Badge color="robin">Active User</Badge>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
						<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Ellipsis Positions
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
						<span
							style={{
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
								width: '4rem',
							}}
						>
							Center:
						</span>
						<div style={{ '--badge-width': '180px' } as React.CSSProperties}>
							<Badge color="robin" textEllipsis="center">
								This is a very long badge text that will be truncated in the center
							</Badge>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
						<span
							style={{
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
								width: '4rem',
							}}
						>
							Start:
						</span>
						<div style={{ '--badge-width': '180px' } as React.CSSProperties}>
							<Badge color="forest" textEllipsis="start">
								path/to/very/long/filename/that/needs/truncation.tsx
							</Badge>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
						<span
							style={{
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
								width: '4rem',
							}}
						>
							End:
						</span>
						<div style={{ '--badge-width': '180px' } as React.CSSProperties}>
							<Badge color="amber" textEllipsis="end">
								A long description that should be truncated at the end
							</Badge>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Boolean Shorthand (defaults to center)
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
					<div style={{ '--badge-width': '200px' } as React.CSSProperties}>
						<Badge color="aqua" textEllipsis>
							Using textEllipsis=true defaults to center truncation
						</Badge>
					</div>
				</div>
			</div>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Outline Variant
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
					<div style={{ '--badge-width': '160px' } as React.CSSProperties}>
						<Badge color="cherry" variant="outline" textEllipsis="center">
							Error: Connection timeout after 30 seconds of inactivity
						</Badge>
					</div>
					<div style={{ '--badge-width': '160px' } as React.CSSProperties}>
						<Badge color="sakura" variant="outline" textEllipsis="end">
							User: very.long.email.address@example.domain.com
						</Badge>
					</div>
				</div>
			</div>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Container Constrained
				</h3>
				<p
					style={{
						fontSize: '0.75rem',
						color: 'var(--muted-foreground)',
						marginBottom: '0.5rem',
					}}
				>
					Badges inside a narrow container will truncate automatically with textEllipsis
				</p>
				<div
					style={
						{
							display: 'flex',
							flexDirection: 'column',
							gap: '0.5rem',
							padding: '0.5rem',
							border: '1px solid var(--border)',
							borderRadius: '0.25rem',
							width: '220px',
							'--badge-width': '100%',
						} as React.CSSProperties
					}
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
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Regular Badge vs asChild Badge
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
					<div>
						<p
							style={{
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
								marginBottom: '0.5rem',
							}}
						>
							Regular Badge (non-interactive span)
						</p>
						<Badge color="robin">Static Badge</Badge>
					</div>
					<div>
						<p
							style={{
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
								marginBottom: '0.5rem',
							}}
						>
							asChild Badge (interactive button)
						</p>
						<Badge asChild color="robin">
							<button
								type="button"
								onClick={() => alert('Button badge clicked!')}
								style={{ cursor: 'pointer' }}
							>
								Interactive Badge
							</button>
						</Badge>
					</div>
				</div>
			</div>

			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Filter & Action Badges
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
					<Badge asChild color="robin" variant="outline">
						<button type="button" onClick={() => alert('All filter')} style={{ cursor: 'pointer' }}>
							All
						</button>
					</Badge>
					<Badge asChild color="forest" variant="outline">
						<button
							type="button"
							onClick={() => alert('Active filter')}
							style={{ cursor: 'pointer' }}
						>
							<CheckIcon />
							Active
						</button>
					</Badge>
					<Badge asChild color="amber" variant="outline">
						<button
							type="button"
							onClick={() => alert('Pending filter')}
							style={{ cursor: 'pointer' }}
						>
							Pending
						</button>
					</Badge>
					<Badge asChild color="cherry" variant="outline">
						<button
							type="button"
							onClick={() => alert('Remove filter')}
							style={{ cursor: 'pointer' }}
						>
							<XIcon />
							Clear
						</button>
					</Badge>
				</div>
			</div>

			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Navigation Links
				</h3>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
					<Badge asChild color="aqua" variant="outline">
						<a
							href="#docs"
							onClick={(e) => e.preventDefault()}
							style={{ cursor: 'pointer', textDecoration: 'none' }}
						>
							Documentation
						</a>
					</Badge>
					<Badge asChild color="robin">
						<a
							href="#guide"
							onClick={(e) => e.preventDefault()}
							style={{ cursor: 'pointer', textDecoration: 'none' }}
						>
							<InfoIcon />
							Getting Started
						</a>
					</Badge>
					<Badge asChild color="sakura" variant="outline">
						<a
							href="#examples"
							onClick={(e) => e.preventDefault()}
							style={{ cursor: 'pointer', textDecoration: 'none' }}
						>
							Examples
						</a>
					</Badge>
				</div>
			</div>
		</div>
	),
};
