import { Button, Progress, ProgressColor, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, useState } from 'react';
import { allModes } from '../.storybook/modes.js';
import styles from './progress.stories.module.css';

const COLORS = Object.values(ProgressColor);

const meta: Meta<typeof Progress> = {
	title: 'Primitive Components/Progress',
	component: Progress,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A determinate bar that shows a percent: a metric in a table cell or a card, or a task with a known end.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=5835-8650&m=dev',
		},
	},
	argTypes: {
		percent: {
			control: { type: 'range', min: 0, max: 150, step: 0.5 },
			description:
				'The completion, from 0 to 100. The fill stops at 0 and 100, the value text does not. A value that is not a finite number renders the empty track and the text `-`.',
			table: { category: 'Content', type: { summary: 'number' } },
		},
		showInfo: {
			control: 'boolean',
			description:
				'Shows the percent as text to the right of the bar, rounded to at most 2 decimals. The text never truncates, the bar shrinks first.',
			table: {
				category: 'Content',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		color: {
			control: 'select',
			options: COLORS,
			description:
				'The status of the bar, picked from a threshold on the metric. Required, with no default. The color is never the only signal: the value text, or the number next to the bar, carries the data.',
			table: { category: 'Appearance', type: { summary: 'ProgressColorType' } },
		},
		steps: {
			control: { type: 'number', min: 0, max: 20, step: 1 },
			description:
				'Splits the bar into equal segments with a transparent gap between them. The fill stays continuous across the segments. Below 2 renders the continuous bar.',
			table: { category: 'Appearance', type: { summary: 'number' } },
		},
		active: {
			control: 'boolean',
			description:
				'Marks a task that is running: the fill shows moving stripes and eases to each new `percent`. The stripes stop at 100. Not for a metric bar.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		width: {
			control: 'text',
			description:
				'The width of the progress. It fills its parent when omitted. Numbers are written as `px`. A narrow width shrinks the bar first, never the value text.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description: 'The max-width of the progress. Numbers are written as `px`.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["maxWidth"]' },
				defaultValue: { summary: '100%' },
			},
		},
		'aria-label': {
			control: 'text',
			description:
				'What the bar measures. The bar has no visible label of its own, so give it a name here or through `aria-labelledby`.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'The id of the element that names the bar, in place of `aria-label`.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the root, the `role="progressbar"` element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root as `data-testid`, and the prefix of the parts: `${testId}-track`, `${testId}-indicator` and `${testId}-value`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		percent: 64,
		showInfo: true,
		color: 'primary',
		'aria-label': 'CPU usage',
	},
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// Every state it can be driven into is covered by `ProgressShowcase`.
		chromatic: { disableSnapshot: true },
	},
};

function Row({ label, children }: { label: string; children: ReactElement }): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.rowLabel}>
				{label}
			</Typography>
			{children}
		</>
	);
}

// One column per state, so a change to one fill, or to the segments or stripes over it, shows in the
// row of that color.
const COLOR_STATES: Array<{ label: string; steps?: number; active?: boolean }> = [
	{ label: 'continuous' },
	{ label: '5 steps', steps: 5 },
	{ label: 'active', active: true },
];

function matrixStyle(columns: number): CSSProperties {
	return { '--matrix-columns': columns } as CSSProperties;
}

const VALUE_TEXTS: Array<{ label: string; percent: number }> = [
	{ label: 'whole', percent: 5 },
	{ label: 'rounded to 2 decimals', percent: 33.333 },
	{ label: 'complete', percent: 100 },
	{ label: 'over 100', percent: 140 },
	{ label: 'below 0', percent: -5 },
	{ label: 'no data', percent: Number.NaN },
];

const STEPS: Array<{ label: string; percent: number; steps: number }> = [
	{ label: '5 steps, empty', percent: 0, steps: 5 },
	{ label: '5 steps, 50%', percent: 50, steps: 5 },
	{ label: '5 steps, full', percent: 100, steps: 5 },
	{ label: '10 steps, 70%', percent: 70, steps: 10 },
	{ label: '1 step', percent: 50, steps: 1 },
];

const SURFACES = ['surface-1', 'surface-2', 'surface-3'] as const;

const CELLS = [
	{ label: '12rem', className: styles.cellWide },
	{ label: '6rem', className: styles.cellMedium },
	{ label: '3rem', className: styles.cellNarrow },
];

/**
 * Each click moves the task forward by a fifth, so the fill eases to the next value. It is a button
 * rather than a timer, which keeps the snapshot of the showcase still.
 */
function RunningTask(): ReactElement {
	const [percent, setPercent] = useState(20);
	const isDone = percent >= 100;

	return (
		<div className={styles.task}>
			<Progress color="primary" percent={percent} active showInfo aria-label="Trace download" />
			<Button
				size="md"
				variant="outlined"
				color="secondary"
				onClick={() => setPercent(isDone ? 0 : percent + 20)}
			>
				{isDone ? 'Restart' : 'Advance'}
			</Button>
		</div>
	);
}

/**
 * Every color in each state, the value text in each of its cases, the segments, the running task, the bar on
 * each surface and in a narrow cell, all in one snapshot. The stripes of `active` only move with
 * the Motion toolbar item on live.
 */
export const ProgressShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	argTypes: {
		percent: { control: false },
		color: { control: false },
		steps: { control: false },
		active: { control: false },
		showInfo: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Colors
				</Typography>
				<Typography size="sm">
					The same hues as Badge. Pick the color from a threshold on the metric, and keep the
					thresholds of one metric in one helper so the same value reads the same in every column.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(COLOR_STATES.length)}
				>
					<span />
					{COLOR_STATES.map(({ label }) => (
						<Typography key={label} size="sm" weight="medium" className={styles.rowLabel}>
							{label}
						</Typography>
					))}
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.rowLabel}>
								{color}
							</Typography>
							{COLOR_STATES.map(({ label, steps, active }) => (
								<Progress
									key={label}
									percent={64}
									color={color}
									steps={steps}
									active={active}
									showInfo
									aria-label={`${color} ${label}`}
								/>
							))}
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Value text
				</Typography>
				<Typography size="sm">
					Rounded to at most 2 decimals, with no trailing zeros. The fill clamps to the track and
					the text does not, so 140 reads 140% over a full bar. A value that is not a finite number
					keeps the empty track and shows a dash.
				</Typography>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					{VALUE_TEXTS.map(({ label, percent }) => (
						<Row key={label} label={label}>
							<Progress color="primary" percent={percent} showInfo aria-label={label} />
						</Row>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Steps
				</Typography>
				<Typography size="sm">
					Equal segments with a transparent gap. The fill runs on across them, so 50% of 5 fills two
					and a half. Below 2 is the continuous bar.
				</Typography>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					{STEPS.map(({ label, percent, steps }) => (
						<Row key={label} label={label}>
							<Progress
								color="primary"
								percent={percent}
								steps={steps}
								showInfo
								aria-label={label}
							/>
						</Row>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Running task
				</Typography>
				<Typography size="sm">
					Only <code>active</code> moves: the fill eases to each new value and stripes cross it,
					until the task reaches 100. A metric bar jumps to its new value.
				</Typography>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					<Row label="advancing">
						<RunningTask />
					</Row>
					<Row label="running">
						<Progress color="primary" percent={35} active showInfo aria-label="Running" />
					</Row>
					<Row label="steps">
						<Progress
							color="primary"
							percent={60}
							steps={5}
							active
							showInfo
							aria-label="Checklist"
						/>
					</Row>
					<Row label="done">
						<Progress color="primary" percent={100} active showInfo aria-label="Done" />
					</Row>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Surfaces
				</Typography>
				<Typography size="sm">
					The track keeps its contrast on every surface, and the gaps between segments show the
					surface behind them.
				</Typography>
				<div className={`${styles.surfaces} ${styles.marginTopMedium}`}>
					{SURFACES.map((surface) => (
						<div key={surface} className={styles.surface} data-surface={surface}>
							<Typography size="sm" weight="medium">
								{surface}
							</Typography>
							<Progress color="primary" percent={45} showInfo aria-label={`${surface} usage`} />
							<Progress
								color="primary"
								percent={45}
								steps={5}
								showInfo
								aria-label={`${surface} checklist`}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Narrow cell
				</Typography>
				<Typography size="sm">
					The root fills its parent. When space runs out the bar shrinks, down to nothing, and the
					value text never truncates.
				</Typography>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					{CELLS.map(({ label, className }) => (
						<Row key={label} label={label}>
							<div className={className}>
								<Progress percent={87.25} color="warning" showInfo aria-label="Memory usage" />
							</div>
						</Row>
					))}
				</div>
			</div>
		</div>
	),
};
