import { Slider, SliderColor, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, type ReactElement, type ReactNode, useState } from 'react';
import { fn } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { sliderArgTypes, sliderParameters, VOLUME_MARKS } from './shared/slider-arg-types.js';
import styles from './slider.stories.module.css';

const meta: Meta<typeof Slider> = {
	title: 'Primitive Components/Slider',
	component: Slider,
	parameters: sliderParameters,
	argTypes: sliderArgTypes,
	args: {
		color: 'primary',
		defaultValue: 40,
		tooltip: true,
		'aria-label': 'Volume',
		onChange: fn(),
		onAfterChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// Every state it can be driven into is covered by `SliderShowcase`.
		chromatic: { disableSnapshot: true },
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <Slider key={String(args.defaultValue)} {...args} />,
};

function Row({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.rowLabel}>
				{label}
			</Typography>
			{children}
		</>
	);
}

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section">
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm">{description}</Typography>
			<div className={`${styles.rows} ${styles.marginTopMedium}`}>{children}</div>
		</div>
	);
}

const LONG_MARKS = {
	0: 'No retention',
	25: 'One week of hot storage',
	50: 'One month of hot storage',
	75: 'Six months in cold storage',
	100: 'Forever, archived',
};

/**
 * The onboarding scale questions: the slider runs from 0 to 100 and stands for a log scale. The
 * marks are keyed by the slider value, and `formatValue` computes the label from it.
 */
function formatVolume(position: number): string {
	const gigabytes = 10 ** (position / 25);

	return gigabytes >= 1000
		? `${(gigabytes / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })} TB`
		: `${gigabytes.toLocaleString('en-US', { maximumFractionDigits: 0 })} GB`;
}

/**
 * The `ConfigSlider` row of the panel editor: the label, the slider, and the value it prints in
 * its own wrapper.
 */
function OpacityRow(): ReactElement {
	const [opacity, setOpacity] = useState(0.7);

	return (
		<div className={styles.configRow}>
			<Typography size="sm" id="opacity-label">
				Fill opacity
			</Typography>
			<div className={styles.configSlider}>
				<Slider
					color="primary"
					min={0}
					max={1}
					step={0.01}
					value={opacity}
					onChange={setOpacity}
					aria-labelledby="opacity-label"
				/>
			</div>
			<Typography size="sm" className={styles.configValue}>
				{opacity.toFixed(2)}
			</Typography>
		</div>
	);
}

/**
 * Owns the value, as a consumer does, and prints what each callback received.
 */
function DurationFilter(): ReactElement {
	const [value, setValue] = useState<[number, number]>([200, 8000]);
	const [applied, setApplied] = useState<[number, number]>(value);

	return (
		<div className={styles.stack}>
			<Slider.Range
				color="primary"
				min={0}
				max={10000}
				step={100}
				value={value}
				onChange={setValue}
				onAfterChange={setApplied}
				tooltip
				formatValue={(duration) => `${duration} ms`}
				aria-label="Duration"
			/>
			<Typography size="sm">
				Dragging {value[0]} to {value[1]} ms, filter applied at {applied[0]} to {applied[1]} ms
			</Typography>
		</div>
	);
}

const COLORS = Object.values(SliderColor);

/**
 * Every shape and state in one snapshot: each color with and without marks, one thumb and two,
 * marks and their alignment, a value out of the scale, disabled and read-only, and the slider in
 * a narrow parent.
 */
export const SliderShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Colors
				</Typography>
				<Typography size="sm">
					The same hues as Badge. The color paints the fill, the thumb border and the dots inside
					the fill. The track and the other dots are tints of it.
				</Typography>
				<div className={`${styles.matrix} ${styles.marginTopMedium}`}>
					<span />
					<Typography size="sm" weight="medium" className={styles.rowLabel}>
						normal
					</Typography>
					<Typography size="sm" weight="medium" className={styles.rowLabel}>
						marks
					</Typography>
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.rowLabel}>
								{color}
							</Typography>
							<Slider color={color} defaultValue={40} aria-label={`${color} normal`} />
							<Slider
								color={color}
								defaultValue={50}
								marks={VOLUME_MARKS}
								aria-label={`${color} marks`}
							/>
						</Fragment>
					))}
				</div>
			</div>

			<Section
				title="One thumb and two"
				description="The fill runs from the start of the track to the thumb, or between the two thumbs of a range. A thumb at either end stays inside the track."
			>
				<Row label="at min">
					<Slider color="primary" defaultValue={0} aria-label="At min" />
				</Row>
				<Row label="at 40">
					<Slider color="primary" defaultValue={40} aria-label="At 40" />
				</Row>
				<Row label="at max">
					<Slider color="primary" defaultValue={100} aria-label="At max" />
				</Row>
				<Row label="range">
					<Slider.Range color="primary" defaultValue={[20, 70]} aria-label="Range" />
				</Row>
				<Row label="range, same value">
					<Slider.Range color="primary" defaultValue={[50, 50]} aria-label="Same value" />
				</Row>
				<Row label="range, both ends">
					<Slider.Range color="primary" aria-label="Both ends" />
				</Row>
			</Section>

			<Section
				title="Marks"
				description="A dot on the track and a label under it. The label at min aligns with the start of the track, the one at max with its end, every other one is centred on its value. The dots inside the fill are active."
			>
				<Row label="log scale">
					<Slider
						color="primary"
						defaultValue={50}
						marks={VOLUME_MARKS}
						tooltip
						formatValue={formatVolume}
						aria-label="Logs volume"
					/>
				</Row>
				<Row label="range">
					<Slider.Range
						color="primary"
						defaultValue={[25, 75]}
						marks={VOLUME_MARKS}
						aria-label="Volume range"
					/>
				</Row>
				<Row label="inside the scale">
					<Slider
						color="primary"
						defaultValue={30}
						min={10}
						max={90}
						marks={{ 0: 'dropped', 10: '10', 30: '30', 90: '90', 95: 'dropped' }}
						aria-label="Inside the scale"
					/>
				</Row>
			</Section>

			<Section
				title="Value out of the scale"
				description="A value that is not a finite number renders the thumb at min. One outside the scale renders it at the nearest end. The slider never corrects the value."
			>
				<Row label="NaN">
					<Slider color="primary" value={Number.NaN} aria-label="NaN" />
				</Row>
				<Row label="below min">
					<Slider color="primary" value={-20} aria-label="Below min" />
				</Row>
				<Row label="above max">
					<Slider color="primary" value={140} aria-label="Above max" />
				</Row>
			</Section>

			<Section
				title="Disabled and read-only"
				description="Disabled fades the whole slider and takes the thumbs out of the tab order. Read-only fades it less, keeps the thumbs focusable, and blocks every change. Hover opens the reason."
			>
				<Row label="disabled">
					<Slider
						color="primary"
						defaultValue={40}
						marks={VOLUME_MARKS}
						disabled
						disabledTooltip="Pick a data source first"
						aria-label="Disabled"
					/>
				</Row>
				<Row label="read-only">
					<Slider
						color="primary"
						defaultValue={40}
						marks={VOLUME_MARKS}
						readOnly
						readOnlyTooltip="Set by the workspace admin"
						aria-label="Read-only"
					/>
				</Row>
				<Row label="range, read-only">
					<Slider.Range
						color="primary"
						defaultValue={[20, 70]}
						readOnly
						readOnlyTooltip="Set by the workspace admin"
						aria-label="Read-only range"
					/>
				</Row>
			</Section>

			<Section
				title="Layout"
				description="The root fills its parent, with no margin, and the track runs edge to edge. The row that prints a value next to the slider owns that layout."
			>
				<Row label="panel editor">
					<OpacityRow />
				</Row>
				<Row label="width 160">
					<Slider color="primary" defaultValue={40} width={160} aria-label="Width 160" />
				</Row>
				<Row label="narrow parent">
					<div className={styles.narrow}>
						<Slider
							color="primary"
							defaultValue={40}
							marks={{ 0: '0', 100: '100' }}
							aria-label="Narrow"
						/>
					</div>
				</Row>
				<Row label="duration filter">
					<DurationFilter />
				</Row>
			</Section>

			<Section
				title="Not enough space"
				description="The dashed outline is the parent the slider fills. Each label has the room up to halfway to the mark on each side, or up to the end of the slider. A longer label truncates and shows in full in a tooltip under it on hover, or wraps with textOverflow wrap. The slider is never narrower than two thumbs. Drag the corner of the last frame to try any width."
			>
				<Row label="long labels">
					<div className={styles.bounds}>
						<Slider color="primary" defaultValue={40} marks={LONG_MARKS} aria-label="Long labels" />
					</div>
				</Row>
				<Row label="long labels, wrap">
					<div className={styles.bounds}>
						<Slider
							color="primary"
							defaultValue={40}
							marks={LONG_MARKS}
							textOverflow="wrap"
							aria-label="Long labels, wrap"
						/>
					</div>
				</Row>
				<Row label="long label near an end">
					<div className={styles.bounds}>
						<Slider
							color="primary"
							defaultValue={40}
							marks={{ 5: 'Five percent of the quota', 95: 'Ninety-five percent of the quota' }}
							aria-label="Long label near an end"
						/>
					</div>
				</Row>
				<Row label="labels wider than the track">
					<div className={`${styles.bounds} ${styles.narrow}`}>
						<Slider
							color="primary"
							defaultValue={40}
							marks={{ 0: 'One gigabyte a day', 100: 'Ten terabytes a day' }}
							aria-label="Labels wider than the track"
						/>
					</div>
				</Row>
				<Row label="beside a long label">
					<div className={styles.squeezedRow}>
						<Typography size="sm">Retention for the logs of every environment</Typography>
						<Slider
							color="primary"
							defaultValue={40}
							marks={{ 0: '0', 100: '100' }}
							aria-label="Squeezed"
						/>
					</div>
				</Row>
				<Row label="width 2rem, range">
					<div className={`${styles.bounds} ${styles.tiny}`}>
						<Slider.Range color="primary" defaultValue={[20, 70]} aria-label="Width 2rem" />
					</div>
				</Row>
				<Row label="narrower than the thumb">
					<div className={`${styles.bounds} ${styles.thinnerThanThumb}`}>
						<Slider color="primary" defaultValue={40} aria-label="Narrower than the thumb" />
					</div>
				</Row>
				<Row label="width 0">
					<div className={`${styles.bounds} ${styles.zero}`}>
						<Slider
							color="primary"
							defaultValue={40}
							marks={{ 0: '0', 100: '100' }}
							aria-label="Width 0"
						/>
					</div>
				</Row>
				<Row label="resizable">
					<div className={styles.resizable}>
						<div className={styles.bounds}>
							<Slider.Range
								color="primary"
								defaultValue={[25, 75]}
								marks={LONG_MARKS}
								tooltip
								aria-label="Resizable"
							/>
						</div>
					</div>
				</Row>
			</Section>
		</div>
	),
};
