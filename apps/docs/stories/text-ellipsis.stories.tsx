import { TextEllipsis, Typography, useTextEllipsisWidth } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './text-ellipsis.stories.module.css';

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
		<div className={styles.playgroundContainer}>
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
		<div className={styles.positionsContainer}>
			<div className="story-row">
				<Typography size="xs" color="muted" className={styles.positionLabel}>
					Center:
				</Typography>
				<div className={styles.ellipsisContainer}>
					<TextEllipsis position="center">
						This is a very long text that will be truncated in the center
					</TextEllipsis>
				</div>
			</div>
			<div className="story-row">
				<Typography size="xs" color="muted" className={styles.positionLabel}>
					Start:
				</Typography>
				<div className={styles.ellipsisContainer}>
					<TextEllipsis position="start">
						path/to/very/long/filename/that/needs/truncation.tsx
					</TextEllipsis>
				</div>
			</div>
			<div className="story-row">
				<Typography size="xs" color="muted" className={styles.positionLabel}>
					End:
				</Typography>
				<div className={styles.ellipsisContainer}>
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
		<div className={styles.positionsContainer}>
			<div>
				<Typography size="sm" weight="medium" className={styles.filePathSection}>
					Start Truncation (shows filename)
				</Typography>
				<div className={styles.filePathList}>
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
				<Typography size="sm" weight="medium" className={styles.filePathSection}>
					Center Truncation (shows root and filename)
				</Typography>
				<div className={styles.filePathList}>
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
		<div className={styles.customEllipsisContainer}>
			<div>
				<Typography size="xs" color="muted">
					Default (...)
				</Typography>
				<TextEllipsis ellipsis="...">
					This is a very long text that will be truncated with default ellipsis
				</TextEllipsis>
			</div>
			<div>
				<Typography size="xs" color="muted">
					Unicode (…)
				</Typography>
				<TextEllipsis ellipsis="…">
					This is a very long text that will be truncated with unicode ellipsis
				</TextEllipsis>
			</div>
			<div>
				<Typography size="xs" color="muted">
					Tilde (~)
				</Typography>
				<TextEllipsis ellipsis="~" position="start">
					/home/user/projects/my-app/src/components/Button/index.tsx
				</TextEllipsis>
			</div>
			<div>
				<Typography size="xs" color="muted">
					More (›)
				</Typography>
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
		<div className={styles.positionsContainer}>
			<Typography size="xs" color="muted">
				Resize the browser window to see the text adapt automatically.
			</Typography>
			<div className={`story-panel ${styles.responsivePanel}`}>
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
			<div className={styles.positionsContainer}>
				<Typography size="xs" color="muted">
					Using <code>useTextEllipsisWidth</code> hook to measure the container and pass width
					externally. Current width: {width}px
				</Typography>
				<div ref={ref as any} className={`story-panel ${styles.externalWidthPanel}`}>
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
		<div className={styles.positionsContainer}>
			<Typography size="xs" color="muted">
				Hover over the truncated text to see the full content as a tooltip.
			</Typography>
			<div className={styles.tooltipList}>
				<div>
					<Typography size="xs" color="muted" className={styles.tooltipLabel}>
						Auto title (full text):
					</Typography>
					<TextEllipsis position="center">
						This is a very long text that will be truncated — hover to see all
					</TextEllipsis>
				</div>
				<div>
					<Typography size="xs" color="muted" className={styles.tooltipLabel}>
						Custom title override:
					</Typography>
					<TextEllipsis
						position="end"
						title="Custom tooltip: /home/user/projects/my-app/src/components/Button/index.tsx"
					>
						/home/user/projects/my-app/src/components/Button/index.tsx
					</TextEllipsis>
				</div>
				<div>
					<Typography size="xs" color="muted" className={styles.tooltipLabel}>
						Short text (no tooltip):
					</Typography>
					<TextEllipsis position="center">Short text</TextEllipsis>
				</div>
			</div>
		</div>
	),
};
