import { Info } from '@signozhq/icons';
import type { TooltipProps } from '@signozhq/ui';
import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonVariant,
	Tooltip,
	TooltipProvider,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, type ReactElement, type ReactNode, useState } from 'react';
import styles from './tooltip.stories.module.css';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;

const meta: Meta<typeof Tooltip> = {
	title: 'Composed Components/Tooltip',
	component: Tooltip,
	argTypes: {
		title: {
			control: 'text',
			description:
				'The content of the tooltip. No tooltip is rendered while it is empty, and the trigger stays the element it already was.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		children: {
			control: false,
			description: 'The trigger element.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		side: {
			control: 'select',
			options: SIDES,
			description:
				'Which side of the trigger the tooltip opens against. May change on its own to avoid the edges of the viewport.',
			table: {
				category: 'Appearance',
				type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
				defaultValue: { summary: "'top'" },
			},
		},
		align: {
			control: 'select',
			options: ALIGNS,
			description: 'How the tooltip is aligned along the side it opens against.',
			table: {
				category: 'Appearance',
				type: { summary: "'start' | 'center' | 'end'" },
				defaultValue: { summary: "'center'" },
			},
		},
		sideOffset: {
			control: 'number',
			description: 'The distance in pixels between the tooltip and the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'number' },
				defaultValue: { summary: '4' },
			},
		},
		alignOffset: {
			control: 'number',
			description: 'An offset in pixels from the `start` or `end` alignment.',
			table: {
				category: 'Appearance',
				type: { summary: 'number' },
				defaultValue: { summary: '0' },
			},
		},
		open: {
			control: 'boolean',
			description:
				'Whether the tooltip is open, for a story or a test that needs a popup on screen rather than for app code. Set, neither hover nor focus changes it.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		container: {
			control: false,
			description:
				'The element this tooltip is portalled into. Defaults to the one the surrounding TooltipProvider set, and to `document.body` without one.',
			table: { category: 'Behavior', type: { summary: 'HTMLElement | ShadowRoot | RefObject' } },
		},
		className: {
			control: 'text',
			description:
				'Class name of the tooltip content. Merges with the styles of the component instead of replacing them.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles of the tooltip content.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		id: {
			control: 'text',
			description: 'Id of the tooltip content. One is generated when it is left out.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Alias for `data-testid`, set on the tooltip content.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-746&p=f&m=dev',
		},
	},
	decorators: [
		// One provider per app is the pattern; in Storybook that is one per story tree.
		(Story): ReactElement => (
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		),
	],
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
	args: {
		title: "I'm a basic tooltip",
		side: 'top',
		align: 'center',
	},
	parameters: {
		// Playground: every placement, content shape and stack it can be driven into is covered
		// by `TooltipShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args: Partial<TooltipProps>) => (
		<div className={`story-center ${styles.playground}`}>
			<Tooltip {...(args as TooltipProps)}>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size={ButtonSize.MD}>
					Hover me
				</Button>
			</Tooltip>
		</div>
	),
};

const TRIGGER_WIDTH = '8rem';

const PLACEMENTS = ALIGNS.flatMap((align) => SIDES.map((side) => ({ side, align })));

const OFFSETS: { label: string; props: Partial<TooltipProps> }[] = [
	{ label: 'defaults', props: {} },
	{ label: 'sideOffset 24', props: { sideOffset: 24 } },
	{ label: 'alignOffset 40', props: { align: 'start', alignOffset: 40 } },
];

const WRAPPING_TITLE =
	'A title long enough to run into the 26.25rem the tooltip caps its width at, so it wraps onto a second line instead of stretching across the page.';

const CLAMPED_TITLE =
	'Past six lines the content belongs in a popover, because a tooltip has nowhere to defer the rest of the string to. So the seventh line and everything under it is clipped, and this title is here to prove it: line one, line two, line three, line four, line five, line six, and the tail nobody gets to read no matter how long it goes on for. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id velit ut justo convallis interdum. Integer egestas elit sagittis erat tempus, non convallis elit ultrices. Aliquam suscipit est rutrum est tempus, nec rhoncus nisl vehicula. Pellentesque a felis non nisl aliquet dictum. Pellentesque vulputate elit diam, ac gravida est auctor id. Pellentesque gravida erat sed porttitor efficitur. Proin et elit vitae lorem efficitur dictum eu ac mauris. Phasellus dignissim pretium elit. Phasellus felis urna, auctor ut risus et, gravida dignissim enim.';

const CONTENT: { label: string; title: ReactNode }[] = [
	{ label: 'Plain text', title: 'Helpful information' },
	{
		label: 'Rich content',
		title: (
			<>
				<Typography as="span" weight="medium">
					Custom tooltip
				</Typography>
				<br />
				<Typography as="span" size="sm">
					With multiple lines
				</Typography>
			</>
		),
	},
	{ label: 'Wraps at the max width', title: WRAPPING_TITLE },
	{ label: 'Clamped past six lines', title: CLAMPED_TITLE },
	{ label: 'Empty title, no popup', title: undefined },
];

const METRICS: [label: string, value: string][] = [
	['p99 latency', '1.42 s'],
	['p50 latency', '184 ms'],
	['error rate', '2.3 %'],
	['throughput', '4.1k rpm'],
	['apdex', '0.82'],
	['saturation', '61 %'],
	['last deploy', '12 min ago'],
];

/**
 * Element content rather than a string: eight rows, so it is past the six lines the popup clamps
 * text at, and the `wide` variant is past the width it caps itself at.
 */
function MetricCard({ wide = false }: { wide?: boolean }): ReactElement {
	return (
		<div className={`${styles.metricCard} ${wide ? styles.wideCard : ''}`}>
			<Typography as="span" weight="medium">
				checkout-api
			</Typography>
			{METRICS.map(([label, value]) => (
				<div key={label} className={styles.metricRow}>
					<Typography as="span" size="sm">
						{label}
					</Typography>
					<Typography as="span" size="sm">
						{value}
					</Typography>
				</div>
			))}
		</div>
	);
}

// The popup sizes itself off its text, so element content wider than the cap is cut instead of
// scrolled. Both variables have to move: `--tooltip-max-width` lifts the cap, `--tooltip-width`
// makes the popup measure the card instead of shrinking to the width of a text line.
const LIFTED_CAPS = {
	'--tooltip-width': 'max-content',
	'--tooltip-max-width': 'none',
} as CSSProperties;

/**
 * The tooltip is portalled into the panel instead of `document.body`, which is what keeps one
 * inside a dialog or a drawer. The element only exists after the first render, so it is held in
 * state rather than a ref.
 */
function ContainerDemo(): ReactElement {
	const [panel, setPanel] = useState<HTMLDivElement | null>(null);

	return (
		<div ref={setPanel} className={`story-panel ${styles.containerPanel}`}>
			<Tooltip
				title="Portalled into the panel, not into document.body"
				align="start"
				container={panel}
				open
			>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size={ButtonSize.MD}>
					Inside a container
				</Button>
			</Tooltip>
		</div>
	);
}

/**
 * Every placement, offset, content shape, stack and trigger in one snapshot, with each tooltip
 * held open by `open`. Hover could never do this: Base UI groups the
 * tooltips under one provider and closes the open one as the next opens, and one pointer can
 * only sit on one trigger anyway.
 */
export const TooltipShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, disableAnimations: true },
	},
	render: () => (
		<div className="story-container-full">
			<div className={styles.showcase}>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Placement
					</Typography>
					<Typography size="sm">
						<code>side</code> picks which side of the trigger the tooltip opens against,{' '}
						<code>align</code> where it sits along that side. Both are preferences: a tooltip flips
						to the opposite side and shifts along it on its own rather than running off the
						viewport.
					</Typography>
					<div className={styles.placementGrid}>
						{PLACEMENTS.map(({ side, align }) => (
							<Tooltip
								key={`${side}-${align}`}
								open
								title={`${side} / ${align}`}
								side={side}
								align={align}
							>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Secondary}
									size={ButtonSize.MD}
									style={{ width: TRIGGER_WIDTH }}
								>
									{side} / {align}
								</Button>
							</Tooltip>
						))}
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Offsets
					</Typography>
					<Typography size="sm">
						<code>sideOffset</code> is the gap between the tooltip and the trigger, 4px by default.{' '}
						<code>alignOffset</code> slides the tooltip along the side it opens against, and only
						does anything for <code>align=&quot;start&quot;</code> or{' '}
						<code>align=&quot;end&quot;</code>.
					</Typography>
					<div className={styles.offsetRow}>
						{OFFSETS.map(({ label, props }) => (
							<Tooltip key={label} open title={label} side="bottom" {...props}>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Secondary}
									size={ButtonSize.MD}
									style={{ width: TRIGGER_WIDTH }}
								>
									{label}
								</Button>
							</Tooltip>
						))}
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Content
					</Typography>
					<Typography size="sm">
						<code>title</code> takes any node. The popup caps its width at <code>26.25rem</code> and
						clamps itself at six lines, and an empty title (<code>undefined</code>,{' '}
						<code>null</code>, <code>false</code> or <code>&apos;&apos;</code>) renders no popup at
						all while leaving the trigger the element it already was.
					</Typography>
					<div className={styles.contentColumn}>
						{CONTENT.map(({ label, title }) => (
							<Tooltip key={label} open title={title} align="start">
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Secondary}
									size={ButtonSize.MD}
								>
									{label}
								</Button>
							</Tooltip>
						))}
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Element content
					</Typography>
					<Typography size="sm">
						The six-line clamp counts lines of text, so a card of rows is never cut short by it and
						the popup grows as tall as the card. Width is the cap that still bites: past{' '}
						<code>26.25rem</code> the popup clips the card, and it has no scrollbar to reach the
						rest with. Lift both <code>--tooltip-width</code> and <code>--tooltip-max-width</code>{' '}
						to let the popup measure the card, or move the content to a popover once it is large
						enough to read rather than glance at.
					</Typography>
					<div className={styles.elementColumn}>
						<Tooltip open title={<MetricCard />} side="bottom" align="start">
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Secondary}
								size={ButtonSize.MD}
							>
								Card inside the caps
							</Button>
						</Tooltip>
						<Tooltip open title={<MetricCard wide />} side="bottom" align="start">
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Secondary}
								size={ButtonSize.MD}
							>
								Card wider than the cap
							</Button>
						</Tooltip>
						<Tooltip
							open
							title={<MetricCard wide />}
							side="bottom"
							align="start"
							style={LIFTED_CAPS}
						>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Secondary}
								size={ButtonSize.MD}
							>
								Same card, caps lifted
							</Button>
						</Tooltip>
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Stacking
					</Typography>
					<Typography size="sm">
						Two tooltips anchored to the same element would open on the same hover and render on top
						of each other, so a tooltip inside the trigger of another one adds its title to that
						popup instead: the outer title first, a divider, then everything below it. An empty
						title adds nothing, and only the outer tooltip carries the placement props.
					</Typography>
					<div className={styles.stackColumn}>
						<Tooltip open title="Outer title" align="start">
							<Tooltip title="Inner title">
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Secondary}
									size={ButtonSize.MD}
								>
									Two entries
								</Button>
							</Tooltip>
						</Tooltip>
						<Tooltip open title="Outer title" align="start">
							<Tooltip title="Middle title">
								<Tooltip title="Inner title">
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Secondary}
										size={ButtonSize.MD}
									>
										Three entries
									</Button>
								</Tooltip>
							</Tooltip>
						</Tooltip>
						<Tooltip open title="Outer title" align="start">
							<Tooltip title={undefined}>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Secondary}
									size={ButtonSize.MD}
								>
									Empty inner title
								</Button>
							</Tooltip>
						</Tooltip>
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Triggers
					</Typography>
					<Typography size="sm">
						The trigger is the element it was given, not a wrapper around it, so the tooltip adds
						nothing to the layout. Children that are not an element get a plain <code>button</code>{' '}
						to hang off.
					</Typography>
					<div className={styles.triggerColumn}>
						<Tooltip open title="Trigger: a Button" align="start">
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Secondary}
								size={ButtonSize.MD}
							>
								Button
							</Button>
						</Tooltip>
						<Tooltip open title="Trigger: the span itself" align="start">
							<span className={styles.textTrigger}>Inline text</span>
						</Tooltip>
						<Tooltip open title="Trigger: an icon button" align="start">
							<Button
								variant={ButtonVariant.Ghost}
								color={ButtonColor.Secondary}
								size={ButtonSize.Icon}
								aria-label="What this metric means"
							>
								<Info />
							</Button>
						</Tooltip>
						<Tooltip open title="Trigger: a button the tooltip rendered itself" align="start">
							A bare string child
						</Tooltip>
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Container
					</Typography>
					<Typography size="sm">
						<code>container</code> is the element the popup is portalled into,{' '}
						<code>document.body</code> by default. Pass the dialog or drawer element to keep the
						tooltip inside it and out of a stacking context it would otherwise sit behind.
					</Typography>
					<ContainerDemo />
				</div>
			</div>
		</div>
	),
};
