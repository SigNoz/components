import { Button, Divider, DividerOrientation, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { allModes } from '../.storybook/modes.js';
import styles from './divider.stories.module.css';

const meta: Meta<typeof Divider> = {
	title: 'Primitive Components/Divider',
	component: Divider,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A 1px line that separates two blocks of content (horizontal) or two items in a row (vertical). A horizontal divider can carry a short label in the middle.',
			},
		},
	},
	argTypes: {
		orientation: {
			control: 'inline-radio',
			options: Object.values(DividerOrientation),
			description:
				'The direction of the line. Also sets `aria-orientation` on a divider without a label.',
			table: {
				category: 'Appearance',
				type: { summary: 'DividerOrientationType' },
				defaultValue: { summary: 'horizontal' },
			},
		},
		dashed: {
			control: 'boolean',
			description:
				'Draws the line dashed instead of solid. On a divider with a label, both lines are dashed.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		width: {
			control: 'text',
			description:
				'The length of a horizontal divider. Without it the divider fills its parent. Numbers are written as `px`. The types reject it on a vertical divider.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description:
				'The max-width of a horizontal divider. Numbers are written as `px`. The types reject it on a vertical divider.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["maxWidth"]' },
				defaultValue: { summary: '100%' },
			},
		},
		height: {
			control: 'text',
			description:
				'The length of a vertical divider. Without it the divider is `0.9em` tall, so it follows the font size of the text around it. Numbers are written as `px`. The types reject it on a horizontal divider.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["height"]' },
				defaultValue: { summary: '0.9em' },
			},
		},
		maxHeight: {
			control: 'text',
			description:
				'The max-height of a vertical divider. Numbers are written as `px`. The types reject it on a horizontal divider.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["maxHeight"]' },
				defaultValue: { summary: '100%' },
			},
		},
		spacing: {
			control: 'text',
			description:
				'The space on each side of the line: above and below a horizontal divider, left and right of a vertical one. Numbers are written as `px`. In a row that already has a `gap`, set it to `0` on a vertical divider.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["margin"]' },
				defaultValue: { summary: '0 (horizontal), 8 (vertical)' },
			},
		},
		children: {
			control: 'text',
			description:
				'A short label in the middle of a horizontal divider. It stays on one line and is never truncated, the lines beside it shrink first. It sets no font or colour, so pass a `Typography` to style it. With a label the divider has no `role`, so a screen reader reads the label as text. The types reject it on a vertical divider.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the divider.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the divider as `data-testid`. The label takes `${testId}-label`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		orientation: 'horizontal',
		dashed: false,
	},
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `DividerShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: ({ orientation, children, width, maxWidth, height, maxHeight, ...args }) =>
		orientation === 'vertical' ? (
			<div className="story-container">
				<Typography size="sm">
					Back
					<Divider {...args} orientation="vertical" height={height} maxHeight={maxHeight} />
					checkout-service
				</Typography>
			</div>
		) : (
			<div className={`story-container ${styles.stack}`}>
				<Typography size="sm">Content above</Typography>
				<Divider {...args} width={width} maxWidth={maxWidth}>
					{children ? (
						<Typography.Text color="muted" weight="medium">
							{children}
						</Typography.Text>
					) : undefined}
				</Divider>
				<Typography size="sm">Content below</Typography>
			</div>
		),
};

/**
 * Both orientations, solid and dashed, the length and spacing props, the label at its common and its
 * longest, and the vertical divider at three font sizes and in a flex row, all in one snapshot.
 */
export const DividerShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Horizontal
				</Typography>
				<Typography size="sm">
					Fills the width of its parent and adds no space around it. The parent sets the space with
					a gap, or spacing sets it on the divider. width and maxWidth set a shorter line.
				</Typography>
				<div className={styles.panel}>
					<Typography size="sm">Section A</Typography>
					<Divider />
					<Typography size="sm">Section B</Typography>
					<Divider dashed />
					<Typography size="sm">Section C, after a dashed divider</Typography>
					<Divider spacing={16} />
					<Typography size="sm">Section D, after spacing 16 (plus the 1rem gap)</Typography>
					<Divider width={160} />
					<Typography size="sm">Section E, after width 160</Typography>
					<Divider maxWidth="50%" />
					<Typography size="sm">Section F, after maxWidth 50%</Typography>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Vertical
				</Typography>
				<Typography size="sm">
					0.9em tall, so it follows the text around it, with 8px on each side. In a flex row that
					has a gap, spacing 0 drops the side space. height sets a fixed length.
				</Typography>
				<div className={styles.panel}>
					<Typography size="xs">
						Back
						<Divider orientation="vertical" />
						checkout-service
					</Typography>
					<Typography size="sm">
						Back
						<Divider orientation="vertical" />
						checkout-service
						<Divider orientation="vertical" dashed />
						dashed
					</Typography>
					<Typography size="lg">
						Back
						<Divider orientation="vertical" />
						checkout-service
					</Typography>
					<div className={styles.toolbar}>
						<Button variant="ghost" color="secondary" size="sm">
							Edit
						</Button>
						<Divider orientation="vertical" spacing={0} />
						<Button variant="ghost" color="secondary" size="sm">
							Copy
						</Button>
						<Divider orientation="vertical" spacing={0} height={16} />
						<Button variant="ghost" color="secondary" size="sm">
							Delete
						</Button>
					</div>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Label
				</Typography>
				<Typography size="sm">
					Centred, on one line. The two lines shrink first and the label is never truncated. The
					label sets no font or colour, so each one is a Typography.
				</Typography>
				<div className={styles.panel}>
					<Divider>
						<Typography.Text color="muted" weight="medium">
							OR
						</Typography.Text>
					</Divider>
					<Divider dashed>
						<Typography.Text color="muted" weight="medium">
							OR
						</Typography.Text>
					</Divider>
					<Divider>
						<Typography.Text color="muted" weight="medium">
							Or get started with these sample alerts
						</Typography.Text>
					</Divider>
					<div className={styles.narrow}>
						<Divider>
							<Typography.Text color="muted" weight="medium">
								Or get started with these sample alerts
							</Typography.Text>
						</Divider>
					</div>
				</div>
			</div>
		</div>
	),
};
