import {
	Checkbox,
	CheckboxColor,
	type CheckboxColorType,
	CheckboxTextOverflow,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, useState } from 'react';
import { fn } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { checkboxArgTypes, checkboxParameters } from './shared/checkbox-arg-types.js';
import styles from './checkbox.stories.module.css';

const COLORS = Object.values(CheckboxColor);

const LONG_LABEL = 'Display every timestamp on the console in the 24-hour format';

const meta: Meta<typeof Checkbox> = {
	title: 'Primitive Components/Checkbox',
	component: Checkbox,
	args: {
		onChange: fn(),
	},
	parameters: checkboxParameters,
	argTypes: checkboxArgTypes,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	args: {
		color: 'primary',
		children: 'Enable request tracing',
		defaultValue: true,
	},
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them through the `[data-state-cell]` selectors in the
 * story parameters. `disabled` and `readonly` are real props, so they need no pseudo.
 *
 * Each cell holds an unchecked, a checked and an indeterminate box: unchecked shows the neutral
 * border every color shares, the other two are where the palette actually lands.
 */
const STATES = ['default', 'hover', 'focus', 'disabled', 'readonly'] as const;

type State = (typeof STATES)[number];

function StateCell({ color, state }: { color: CheckboxColorType; state: State }): ReactElement {
	const blocking =
		state === 'disabled'
			? ({ disabled: true, disabledTooltip: 'Ask an admin for access' } as const)
			: state === 'readonly'
				? ({ readOnly: true, readOnlyTooltip: 'Saving your changes' } as const)
				: {};

	return (
		<div data-state-cell={state} className={styles.stateCell}>
			<Checkbox color={color} aria-label={`${color} unchecked, ${state}`} {...blocking} />
			<Checkbox
				color={color}
				aria-label={`${color} checked, ${state}`}
				defaultValue
				{...blocking}
			/>
			<Checkbox
				color={color}
				aria-label={`${color} indeterminate, ${state}`}
				defaultValue="indeterminate"
				{...blocking}
			/>
		</div>
	);
}

function MatrixHeader({ columns }: { columns: string[] }): ReactElement {
	return (
		<>
			<span />
			{columns.map((column) => (
				<Typography
					key={column}
					variant="label"
					size="small"
					weight="medium"
					color="inherit"
					as="span"
					textOverflow="visible"
				>
					{column}
				</Typography>
			))}
		</>
	);
}

function matrixStyle(columns: number): CSSProperties {
	return { '--matrix-columns': columns } as CSSProperties;
}

const CONSTRAINED_WIDTH = '14rem';

function SelectAllDemo(): ReactElement {
	const [traces, setTraces] = useState(true);
	const [logs, setLogs] = useState(false);

	const all = traces && logs;
	const some = traces || logs;

	const onSelectAll = (checked: boolean): void => {
		setTraces(checked);
		setLogs(checked);
	};

	return (
		<div className={styles.labelColumn}>
			<Checkbox
				color="primary"
				value={all ? true : some ? 'indeterminate' : false}
				onChange={onSelectAll}
			>
				Select all signals
			</Checkbox>
			<div className={styles.selectAllChildren}>
				<Checkbox color="primary" value={traces} onChange={setTraces}>
					Traces
				</Checkbox>
				<Checkbox color="primary" value={logs} onChange={setLogs}>
					Logs
				</Checkbox>
			</div>
		</div>
	);
}

export const CheckboxShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			// Hover only recolors the border of the unchecked box; a checked box already tells its
			// story with the fill.
			hover: '[data-state-cell="hover"] [data-slot="checkbox"]',
			// The ring wraps the box only, never the label.
			focusVisible: '[data-state-cell="focus"] [data-slot="checkbox"]',
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					States
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					One row per color, one column per state, each cell unchecked, checked, then indeterminate.
					The unchecked border is the same neutral for every color, an unchecked box has no status
					to report yet. Hover recolors the border of the unchecked box only. Disabled fades to 0.6,
					read-only to 0.8.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(STATES.length)}
				>
					<MatrixHeader columns={[...STATES]} />
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography
								variant="label"
								size="small"
								weight="medium"
								color="inherit"
								as="span"
								textOverflow="visible"
							>
								{color}
							</Typography>
							{STATES.map((state) => (
								<StateCell key={state} color={color as CheckboxColorType} state={state} />
							))}
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Labels
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The label is part of the hit target: clicking it toggles. Children that render nothing
					count as not passed, so the checkbox renders bare — name it with <code>aria-label</code>.
				</Typography>
				<div className={`${styles.labelColumn} ${styles.marginTopMedium}`}>
					<Checkbox color="primary" defaultValue>
						Wrap text
					</Checkbox>
					<Checkbox color="primary" aria-label="Wrap text">
						{''}
					</Checkbox>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Indeterminate
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The mixed state is one more value of <code>value</code>, derived by the call site from the
					children: the parent is checked while all children are,{' '}
					<code>&quot;indeterminate&quot;</code> while some are. Clicking it reports{' '}
					<code>true</code>.
				</Typography>
				<div className={styles.marginTopMedium}>
					<SelectAllDemo />
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Overflow
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Capped at <code>{CONSTRAINED_WIDTH}</code>. <code>ellipsis</code> shows the full label in
					a tooltip on hover, <code>wrap</code> takes more lines, <code>hidden</code> clips, and
					<code>visible</code> paints past the cap.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					{Object.values(CheckboxTextOverflow).map((textOverflow) => (
						<Fragment key={textOverflow}>
							<Typography
								variant="label"
								size="small"
								weight="medium"
								color="inherit"
								as="span"
								textOverflow="visible"
							>
								{textOverflow}
							</Typography>
							<Checkbox
								color="primary"
								width={CONSTRAINED_WIDTH}
								textOverflow={textOverflow}
								defaultValue
							>
								{LONG_LABEL}
							</Checkbox>
							<span />
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Bare
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					With no children there is no wrapper element at all, the checkbox is its own flex item.
					Name it with <code>aria-label</code>.
				</Typography>
				<div className={styles.marginTopMedium}>
					<Checkbox color="primary" aria-label="Wrap text" defaultValue />
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Hit area
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The 16px box carries a built-in 2px ring, dashed here: the pointer target is 20px while
					the layout footprint stays 16px. The ring never paints any state, only the box does.
				</Typography>
				<div className={styles.marginTopMedium}>
					<span className={styles.hitAreaCell}>
						<Checkbox color="primary" aria-label="Hit area demo" defaultValue />
					</span>
				</div>
			</div>
		</div>
	),
};
