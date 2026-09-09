import {
	Badge,
	BadgeColor,
	type BadgeColorType,
	BadgeTextOverflow,
	BadgeTextTransform,
	BadgeVariant,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, type ReactElement } from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import styles from './badge.stories.module.css';

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

const COLORS = Object.values(BadgeColor);

const meta: Meta<typeof Badge> = {
	title: 'Primitive Components/Badge',
	component: Badge,
	args: {
		variant: 'solid',
		color: 'primary',
		textTransform: 'uppercase',
		textOverflow: 'ellipsis',
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'A badge for status, counts, and labels, in the same color palette as `Button`.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-739&p=f&m=dev',
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description: 'The content of the badge. Can be text, numbers, or an icon plus text.',
			table: { category: 'Content' },
		},
		variant: {
			control: 'inline-radio',
			options: Object.values(BadgeVariant),
			description: '`outlined` only tints the border and text, no fill.',
			table: { category: 'Appearance', type: { summary: 'BadgeVariantType' } },
		},
		color: {
			control: 'select',
			options: COLORS,
			description: "Same palette as Button's `color`.",
			table: { category: 'Appearance', type: { summary: 'BadgeColorType' } },
		},
		textTransform: {
			control: 'inline-radio',
			options: Object.values(BadgeTextTransform),
			description: 'CSS text transform applied to the content.',
			table: {
				category: 'Appearance',
				type: { summary: 'BadgeTextTransformType' },
				defaultValue: { summary: 'uppercase' },
			},
		},
		textOverflow: {
			control: 'inline-radio',
			options: Object.values(BadgeTextOverflow),
			description:
				'`ellipsis` truncates once something constrains the width and shows the full content in a tooltip while truncated. `none` clips with no tooltip.',
			table: {
				category: 'Behavior',
				type: { summary: 'BadgeTextOverflowType' },
				defaultValue: { summary: 'ellipsis' },
			},
		},
		prefix: {
			control: false,
			description: 'Element rendered before the label, vertically centered with a gap.',
			table: { category: 'Content', type: { summary: 'React.ReactElement' } },
		},
		suffix: {
			control: false,
			description: 'Element rendered after the label, vertically centered with a gap.',
			table: { category: 'Content', type: { summary: 'React.ReactElement' } },
		},
		width: {
			control: 'text',
			description: 'Width of the badge, sizes to content when omitted.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description: 'Max-width of the badge, capped at 100% of its container when omitted.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["maxWidth"]' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the rendered element as `data-testid`.',
			table: { category: 'Testing' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling' },
		},
		id: {
			control: 'text',
			table: { category: 'Accessibility' },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
	parameters: {
		// Every state it can be driven into is covered by `BadgeShowcase`.
		chromatic: { disableSnapshot: true },
	},
	args: {
		children: 'Hello',
	},
};

/**
 * One row per color, one column per variant.
 */
function ColorRow({ color }: { color: BadgeColorType }): ReactElement {
	return (
		<Fragment key={color}>
			<Typography size="sm" weight="medium" className={styles.matrixLabel}>
				{color}
			</Typography>
			<Badge variant="solid" color={color}>
				BADGE
			</Badge>
			<Badge variant="outlined" color={color}>
				BADGE
			</Badge>
		</Fragment>
	);
}

const LONG_LABEL = 'kubernetes-deployment-production-east-us-2';
const CONSTRAINED_WIDTH = '10rem';

/**
 * Every color/variant pair, the text transforms, a couple of real-world usages, and the two
 * overflow modes, all in one snapshot. The truncated badge's tooltip is forced open by `play` so
 * the snapshot carries it.
 */
export const BadgeShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByTestId('truncated-badge');

		// Base UI opens the tooltip when the pointer enters the trigger. Synthetic events keep
		// it open for the snapshot instead of `userEvent.hover`, which moves a real pointer.
		fireEvent.pointerEnter(trigger);
		fireEvent.mouseEnter(trigger);
		fireEvent.mouseMove(trigger);

		// The tooltip portals to `document.body`, outside `canvasElement`, so it has to be
		// queried on `document` rather than `canvas` (see `ButtonShowcase` in
		// button.stories.tsx for the same pattern).
		await waitFor(() =>
			expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveTextContent(LONG_LABEL),
		);
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
		textTransform: { control: false },
		textOverflow: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Colors
				</Typography>
				<Typography size="sm">One row per color, solid and outlined side by side.</Typography>
				<div className={`${styles.matrix} ${styles.marginTopMedium}`}>
					<span />
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						solid
					</Typography>
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						outlined
					</Typography>
					{COLORS.map((color) => (
						<ColorRow key={color} color={color} />
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Text transform
				</Typography>
				<Typography size="sm">Applied to the content regardless of variant or color.</Typography>
				<div className="story-grid">
					{Object.values(BadgeTextTransform).map((textTransform) => (
						<Badge
							key={textTransform}
							variant="solid"
							color="primary"
							textTransform={textTransform}
						>
							{textTransform}
						</Badge>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Usage examples
				</Typography>
				<Typography size="sm">System status, user status, and notification counts.</Typography>
				<div className={`story-section ${styles.marginTopMedium}`}>
					<div className="story-grid">
						<Badge variant="solid" color="success" prefix={<CheckIcon />}>
							Online
						</Badge>
						<Badge variant="solid" color="danger" prefix={<AlertIcon />}>
							Offline
						</Badge>
						<Badge variant="outlined" color="success" prefix={<CheckIcon />}>
							Active
						</Badge>
						<Badge variant="outlined" color="secondary">
							Idle
						</Badge>
					</div>
					<div className="story-row-lg">
						<div className="story-row">
							<BellIcon />
							<Typography>Messages</Typography>
							<Badge variant="solid" color="danger">
								12
							</Badge>
						</div>
						<div className="story-row">
							<Typography>Inbox</Typography>
							<Badge variant="outlined" color="primary">
								5
							</Badge>
						</div>
						<div className="story-row">
							<Typography>Archive</Typography>
							<Badge variant="outlined" color="archive">
								128
							</Badge>
						</div>
					</div>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Overflow and tooltip
				</Typography>
				<Typography size="sm">
					Both are capped at <code>{CONSTRAINED_WIDTH}</code>.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					<Typography size="sm" weight="medium">
						ellipsis (default)
					</Typography>
					<Badge
						variant="solid"
						color="primary"
						testId="truncated-badge"
						textTransform="capitalize"
						maxWidth={CONSTRAINED_WIDTH}
					>
						{LONG_LABEL}
					</Badge>
					<Typography size="sm">Truncates, full content on hover or focus.</Typography>

					<Typography size="sm" weight="medium">
						none
					</Typography>
					<Badge
						variant="solid"
						color="primary"
						textOverflow="none"
						textTransform="capitalize"
						maxWidth={CONSTRAINED_WIDTH}
					>
						{LONG_LABEL}
					</Badge>
					<Typography size="sm">Clips at the badge's edge, no tooltip.</Typography>
				</div>
			</div>
		</div>
	),
};
