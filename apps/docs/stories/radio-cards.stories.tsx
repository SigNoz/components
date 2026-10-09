import {
	Button,
	Input,
	RadioCards,
	type RadioCardsItemType,
	RadioCardsTextOverflow,
	Typography,
} from '@signozhq/ui';
import {
	ChartBar,
	ChartLine,
	ChartPie,
	Hash,
	List,
	Logs,
	Table,
	Workflow,
	Gauge,
} from '@signozhq/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { waitForEffects } from './shared/play.js';
import { radioCardsArgTypes, radioCardsParameters } from './shared/radio-cards-arg-types.js';
import styles from './radio-cards.stories.module.css';

const TOOLS: RadioCardsItemType[] = [
	{ label: 'Datadog', value: 'datadog' },
	{ label: 'Grafana / Prometheus', value: 'grafana' },
	{ label: 'New Relic', value: 'newrelic' },
	{ label: 'Elastic', value: 'elastic' },
];

const SIGNALS: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs', prefix: <Logs /> },
	{ label: 'Traces', value: 'traces', prefix: <Workflow /> },
	{ label: 'Metrics', value: 'metrics', prefix: <Gauge /> },
];

const PANEL_TYPES: RadioCardsItemType[] = [
	{ label: 'Time series', value: 'graph', prefix: <ChartLine /> },
	{ label: 'Bar chart', value: 'bar', prefix: <ChartBar /> },
	{ label: 'Pie chart', value: 'pie', prefix: <ChartPie /> },
	{ label: 'Table', value: 'table', prefix: <Table /> },
	{ label: 'Value', value: 'value', prefix: <Hash /> },
	{ label: 'List', value: 'list', prefix: <List /> },
];

const LONG_LABEL = 'Grafana, Prometheus and every exporter that feeds them';

const meta: Meta<typeof RadioCards> = {
	title: 'Primitive Components/RadioCards',
	component: RadioCards,
	args: {
		onChange: fn(),
	},
	parameters: radioCardsParameters,
	argTypes: radioCardsArgTypes,
};

export default meta;
type Story = StoryObj<typeof RadioCards>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	args: {
		'aria-label': 'Panel type',
		items: PANEL_TYPES,
		columns: 2,
		defaultValue: 'graph',
		allowClear: false,
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <RadioCards key={String(args.defaultValue)} {...args} />,
};

/**
 * A click checks a card and reports its value. With `allowClear`, a second click on the checked
 * card unchecks it and reports `null`.
 */
export const CheckAndClear: Story = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	args: {
		'aria-label': 'Panel type',
		items: PANEL_TYPES,
		columns: 3,
		allowClear: true,
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const bar = canvas.getByRole('radio', { name: 'Bar chart' });

		await waitForEffects();

		await userEvent.click(bar);
		await expect(bar).toHaveAttribute('aria-checked', 'true');
		await expect(args.onChange).toHaveBeenLastCalledWith('bar');

		await userEvent.click(bar);
		await expect(bar).toHaveAttribute('aria-checked', 'false');
		await expect(args.onChange).toHaveBeenLastCalledWith(null);
		await expect(args.onChange).toHaveBeenCalledTimes(2);
	},
};

const STATES = ['default', 'hover', 'focus', 'readonly', 'disabled'] as const;

type State = (typeof STATES)[number];

function StateRow({ state }: { state: State }): ReactElement {
	const blocking =
		state === 'disabled'
			? ({ disabled: true, disabledTooltip: 'Ask an admin for access' } as const)
			: state === 'readonly'
				? ({ readOnly: true, readOnlyTooltip: 'Saving your answers' } as const)
				: {};

	return (
		<>
			<Typography size="sm" weight="medium" className={styles.stateLabel}>
				{state}
			</Typography>
			<div data-state-cell={state}>
				<RadioCards
					aria-label={`Signal, ${state}`}
					columns={3}
					defaultValue="logs"
					items={SIGNALS}
					{...blocking}
				/>
			</div>
		</>
	);
}

/**
 * `Others` needs a name the cards do not list. A card takes no control, so the field goes under the
 * group and shows while `Others` is checked.
 */
function OthersField(): ReactElement {
	const [tool, setTool] = useState<string | null>(null);

	return (
		<div className={styles.question}>
			<Typography.Text id="tool-question" weight="medium">
				Which observability tool do you use today?
			</Typography.Text>
			<RadioCards
				aria-labelledby="tool-question"
				columns={2}
				value={tool}
				onChange={setTool}
				items={[...TOOLS, { label: 'Others', value: 'others' }]}
			/>
			{tool === 'others' && <Input aria-label="Other tool" placeholder="Name of the tool" />}
			<div>
				<Button
					size="md"
					variant="solid"
					color="primary"
					disabled={tool === null}
					disabledTooltip="Pick a tool"
				>
					Next
				</Button>
			</div>
		</div>
	);
}

export const RadioCardsShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: '[data-state-cell="hover"] [data-slot="radio-cards-item"]',
			focusVisible: '[data-state-cell="focus"] [data-slot="radio-cards-item"]',
		},
	},
	argTypes: {
		items: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
					One row per state. The first card is checked in every row. A checked card is marked by its
					tint and a check after the label. Read-only fades less than disabled, since the checked
					card is a real value worth reading.
				</Typography>
				<div className={styles.stateMatrix}>
					{STATES.map((state) => (
						<StateRow key={state} state={state} />
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Columns
				</Typography>
				<Typography size="sm">
					<code>columns</code> caps the cards per row, and the cards share the row equally. Without
					it, a row holds as many cards as fit at their minimum width.
				</Typography>
				<div className={styles.layoutList}>
					{[1, 2, 3, undefined].map((columns) => (
						<div key={String(columns)} className={styles.layoutRow}>
							<Typography size="sm" weight="medium" className={styles.stateLabel}>
								{columns === undefined ? 'no columns' : `columns={${columns}}`}
							</Typography>
							<RadioCards
								aria-label={`Panel type, ${String(columns)} columns`}
								columns={columns}
								defaultValue="graph"
								items={PANEL_TYPES}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Overflow
				</Typography>
				<Typography size="sm">
					Two columns in a narrow parent. <code>ellipsis</code> shows the full label in a tooltip,{' '}
					<code>wrap</code> grows the card, and the cards of a row take the height of the tallest
					one. The icons stay on the first line.
				</Typography>
				<div className={styles.layoutList}>
					{Object.values(RadioCardsTextOverflow).map((textOverflow) => (
						<div key={textOverflow} className={`${styles.layoutRow} ${styles.narrow}`}>
							<Typography size="sm" weight="medium" className={styles.stateLabel}>
								{textOverflow}
							</Typography>
							<RadioCards
								aria-label={`Tool, ${textOverflow}`}
								columns={2}
								textOverflow={textOverflow}
								defaultValue="grafana"
								items={[
									{ label: LONG_LABEL, value: 'grafana', prefix: <ChartLine /> },
									{ label: 'Datadog', value: 'datadog', prefix: <ChartBar /> },
								]}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Blocking one card
				</Typography>
				<Typography size="sm">
					A card can disable itself. The arrow keys skip it, and its reason shows on hover.
				</Typography>
				<div className={styles.narrowWide}>
					<RadioCards
						aria-label="Signal"
						columns={3}
						defaultValue="logs"
						items={[
							SIGNALS[0],
							{ ...SIGNALS[1], disabled: true, disabledTooltip: 'Traces are not set up yet' },
							SIGNALS[2],
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					A field for one option
				</Typography>
				<Typography size="sm">
					The field goes under the group, and the action goes to a button: the arrow keys check each
					card they land on, so <code>onChange</code> only records the choice.
				</Typography>
				<OthersField />
			</div>
		</div>
	),
};
