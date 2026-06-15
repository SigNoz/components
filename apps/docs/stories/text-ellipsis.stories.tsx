import { TextEllipsis, useTextEllipsisWidth } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TextEllipsis> = {
	title: 'Primitive Components/TextEllipsis',
	component: TextEllipsis,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A text component that truncates content with ellipsis at start, center, or end position. Uses canvas-based text measurement for accurate truncation without DOM reflows. Supports ResizeObserver for responsive containers.',
			},
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description: 'The text content to display with ellipsis truncation.',
			table: { category: 'Content' },
		},
		position: {
			control: 'inline-radio',
			options: ['start', 'center', 'end'],
			description: 'Where to place the ellipsis when text overflows.',
			table: { category: 'Behavior', defaultValue: { summary: 'center' } },
		},
		ellipsis: {
			control: 'text',
			description: 'The ellipsis string to use.',
			table: { category: 'Behavior', defaultValue: { summary: '...' } },
		},
		width: {
			control: 'number',
			description:
				'The width of the container in pixels. If not provided, the component measures its own width.',
			table: { category: 'Layout' },
		},
		className: {
			control: 'text',
			description: 'Optional className for the container.',
			table: { category: 'Appearance' },
		},
		title: {
			control: 'text',
			description: 'Optional title attribute. Defaults to the full text when truncated.',
			table: { category: 'Accessibility' },
		},
	},
};

export default meta;

type Story = StoryObj<typeof TextEllipsis>;

export const Playground: Story = {
	args: {
		children: 'This is a very long text that will be truncated based on the container width',
		position: 'center',
		ellipsis: '...',
	},
	render: (props) => (
		<div style={{ width: '300px', padding: '16px' }}>
			<TextEllipsis {...props} />
		</div>
	),
};

export const EllipsisPositions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The three truncation positions: `center` keeps both the start and end visible, `start` preserves the end (great for file paths), and `end` preserves the start (classic truncation behavior).',
			},
		},
	},
	argTypes: {
		children: { control: false },
		position: { control: false },
		ellipsis: { control: false },
		width: { control: false },
	},
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
				<span
					style={{
						fontSize: '0.75rem',
						color: 'var(--muted-foreground)',
						width: '3rem',
						flexShrink: 0,
					}}
				>
					Center:
				</span>
				<div style={{ width: '240px' }}>
					<TextEllipsis position="center">
						This is a very long text that will be truncated in the center
					</TextEllipsis>
				</div>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
				<span
					style={{
						fontSize: '0.75rem',
						color: 'var(--muted-foreground)',
						width: '3rem',
						flexShrink: 0,
					}}
				>
					Start:
				</span>
				<div style={{ width: '240px' }}>
					<TextEllipsis position="start">
						path/to/very/long/filename/that/needs/truncation.tsx
					</TextEllipsis>
				</div>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
				<span
					style={{
						fontSize: '0.75rem',
						color: 'var(--muted-foreground)',
						width: '3rem',
						flexShrink: 0,
					}}
				>
					End:
				</span>
				<div style={{ width: '240px' }}>
					<TextEllipsis position="end">
						A long description that should be truncated at the end of the text
					</TextEllipsis>
				</div>
			</div>
		</div>
	),
};

export const FilePaths: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use `position="start"` to truncate file paths from the beginning, keeping the filename visible. Use `position="center"` to show both the root and the filename.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		position: { control: false },
		ellipsis: { control: false },
		width: { control: false },
	},
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
			<div>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.5rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Start Truncation (shows filename)
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '280px' }}>
					<TextEllipsis position="start">
						/var/log/application/server/debug/2024-01-15.log
					</TextEllipsis>
					<TextEllipsis position="start">
						/home/user/projects/my-app/src/components/Button/index.tsx
					</TextEllipsis>
					<TextEllipsis position="start">
						C:\Users\John\Documents\Projects\MyApp\src\utils\helpers.ts
					</TextEllipsis>
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
					Center Truncation (shows root and filename)
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '280px' }}>
					<TextEllipsis position="center">
						/var/log/application/server/debug/2024-01-15.log
					</TextEllipsis>
					<TextEllipsis position="center">
						/home/user/projects/my-app/src/components/Button/index.tsx
					</TextEllipsis>
				</div>
			</div>
		</div>
	),
};

export const CustomEllipsis: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The `ellipsis` prop lets you customize the truncation indicator. Use any string: a single character, Unicode symbol, or longer phrase.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		position: { control: false },
		ellipsis: { control: false },
		width: { control: false },
	},
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.75rem',
				padding: '1rem',
				width: '280px',
			}}
		>
			<div>
				<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Default (...)</span>
				<TextEllipsis ellipsis="...">
					This is a very long text that will be truncated with default ellipsis
				</TextEllipsis>
			</div>
			<div>
				<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Unicode (…)</span>
				<TextEllipsis ellipsis="…">
					This is a very long text that will be truncated with unicode ellipsis
				</TextEllipsis>
			</div>
			<div>
				<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Tilde (~)</span>
				<TextEllipsis ellipsis="~" position="start">
					/home/user/projects/my-app/src/components/Button/index.tsx
				</TextEllipsis>
			</div>
			<div>
				<span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>More (›)</span>
				<TextEllipsis ellipsis=" ›" position="end">
					Read more about this very long topic with lots of details
				</TextEllipsis>
			</div>
		</div>
	),
};

export const ResponsiveContainer: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'When no `width` prop is provided, `TextEllipsis` measures its own container width using ResizeObserver. It will re-truncate automatically when the container resizes.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		position: { control: false },
		ellipsis: { control: false },
		width: { control: false },
	},
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
			<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
				Resize the browser window to see the text adapt automatically.
			</p>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '0.5rem',
					padding: '0.75rem',
					borderWidth: '1px',
					borderStyle: 'solid',
					borderColor: 'var(--border)',
					borderRadius: '0.25rem',
					width: '100%',
					maxWidth: '400px',
				}}
			>
				<TextEllipsis position="center">
					kubernetes-deployment-production-east-us-2-replica-set
				</TextEllipsis>
				<TextEllipsis position="start">
					/var/log/application/server/debug/2024-01-15.log
				</TextEllipsis>
				<TextEllipsis position="end">
					Successfully processed 1,234 items in the background batch job
				</TextEllipsis>
			</div>
		</div>
	),
};

export const WithExternalWidth: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use the `width` prop to control truncation externally. Pair with the `useTextEllipsisWidth` hook to measure a parent container and pass the width down — useful when `TextEllipsis` is used inside complex layout components.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		position: { control: false },
		ellipsis: { control: false },
		width: { control: false },
	},
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const { ref, width } = useTextEllipsisWidth<HTMLDivElement>();

		return (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
				<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
					Using <code>useTextEllipsisWidth</code> hook to measure the container and pass width
					externally. Current width: {width}px
				</p>
				<div
					ref={ref as any}
					style={{
						padding: '0.75rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'var(--border)',
						borderRadius: '0.25rem',
						width: '320px',
					}}
				>
					<TextEllipsis position="center" width={width}>
						kubernetes-deployment-production-east-us-2
					</TextEllipsis>
				</div>
			</div>
		);
	},
};

export const TooltipOnTruncation: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'When text is truncated, the full text is automatically set as the `title` attribute, giving users a native tooltip on hover. You can override this with a custom `title` prop.',
			},
		},
	},
	argTypes: {
		children: { control: false },
		position: { control: false },
		ellipsis: { control: false },
		width: { control: false },
		title: { control: false },
	},
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
			<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
				Hover over the truncated text to see the full content as a tooltip.
			</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '240px' }}>
				<div>
					<span
						style={{
							fontSize: '0.75rem',
							color: 'var(--muted-foreground)',
							display: 'block',
							marginBottom: '0.25rem',
						}}
					>
						Auto title (full text):
					</span>
					<TextEllipsis position="center">
						This is a very long text that will be truncated — hover to see all
					</TextEllipsis>
				</div>
				<div>
					<span
						style={{
							fontSize: '0.75rem',
							color: 'var(--muted-foreground)',
							display: 'block',
							marginBottom: '0.25rem',
						}}
					>
						Custom title override:
					</span>
					<TextEllipsis
						position="end"
						title="Custom tooltip: /home/user/projects/my-app/src/components/Button/index.tsx"
					>
						/home/user/projects/my-app/src/components/Button/index.tsx
					</TextEllipsis>
				</div>
				<div>
					<span
						style={{
							fontSize: '0.75rem',
							color: 'var(--muted-foreground)',
							display: 'block',
							marginBottom: '0.25rem',
						}}
					>
						Short text (no tooltip):
					</span>
					<TextEllipsis position="center">Short text</TextEllipsis>
				</div>
			</div>
		</div>
	),
};
