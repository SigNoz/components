import {
	Switch,
	SwitchColor,
	type SwitchColorType,
	SwitchTextOverflow,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement } from 'react';
import { fn } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { switchArgTypes, switchParameters } from './shared/switch-arg-types.js';
import styles from './switch.stories.module.css';

const COLORS = Object.values(SwitchColor);

const LONG_LABEL = 'Display every timestamp on the console in the 24-hour format';

const meta: Meta<typeof Switch> = {
	title: 'Primitive Components/Switch',
	component: Switch,
	args: {
		onChange: fn(),
	},
	parameters: switchParameters,
	argTypes: switchArgTypes,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	args: {
		color: 'primary',
		textPlacement: 'right',
		children: 'Wrap text',
		defaultValue: true,
	},
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them through the `[data-state-cell]` selectors in the
 * story parameters. `disabled` and `readonly` are real props, so they need no pseudo.
 *
 * Each cell holds one off and one on switch: off shows the neutral track every color shares, on is
 * where the palette actually lands.
 */
const STATES = ['default', 'hover', 'focus', 'disabled', 'readonly'] as const;

type State = (typeof STATES)[number];

function StateCell({ color, state }: { color: SwitchColorType; state: State }): ReactElement {
	const blocking =
		state === 'disabled'
			? ({ disabled: true, disabledTooltip: 'Ask an admin for access' } as const)
			: state === 'readonly'
				? ({ readOnly: true, readOnlyTooltip: 'Saving your changes' } as const)
				: {};

	return (
		<div data-state-cell={state} className={styles.stateCell}>
			<Switch
				color={color}
				textPlacement="right"
				aria-label={`${color} off, ${state}`}
				{...blocking}
			/>
			<Switch
				color={color}
				textPlacement="right"
				aria-label={`${color} on, ${state}`}
				defaultValue
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

export const SwitchShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			// The hover morph fires from the whole row, and the bare switch is its own row.
			hover: '[data-state-cell="hover"] [data-slot="switch"]',
			// The ring hugs the track and follows its pill radius.
			focusVisible: '[data-state-cell="focus"] [data-slot="switch"]',
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
					One row per color, one column per state, each cell off then on. The off track is the same
					neutral for every color, an unchecked switch has nothing to announce yet. Hover widens the
					knob into a pill. Disabled fades to 0.6, read-only to 0.8.
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
								<StateCell key={state} color={color as SwitchColorType} state={state} />
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
					Label
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The label is part of the hit target: clicking it toggles, hovering it morphs the knob.
					<code>textPlacement="right"</code> hugs its content; <code>textPlacement="left"</code>{' '}
					fills the row and parks the switch at the far edge.
				</Typography>
				<div className={`${styles.labelColumn} ${styles.marginTopMedium}`}>
					<Switch color="primary" textPlacement="right" defaultValue>
						Wrap text
					</Switch>
					<Switch color="primary" textPlacement="left">
						Wrap text
					</Switch>
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
					The settings row
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					<code>textPlacement="left"</code> on its own: the row fills its container and the switch
					sits at the far edge, the shape two dozen consumer stylesheets used to hand-roll.
				</Typography>
				<div className={`${styles.settingsRow} ${styles.marginTopMedium}`}>
					<Switch
						color="primary"
						textPlacement="left"
						description="Use the 24-hour convention while showing timestamps on the console."
						defaultValue
					>
						Display timestamp in 24-hour format
					</Switch>
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
					a tooltip on hover, <code>wrap</code> takes a second line, <code>hidden</code> clips, and
					<code>visible</code> paints past the cap.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					{Object.values(SwitchTextOverflow).map((textOverflow) => (
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
							<Switch
								color="primary"
								textPlacement="right"
								width={CONSTRAINED_WIDTH}
								textOverflow={textOverflow}
								defaultValue
							>
								{LONG_LABEL}
							</Switch>
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
					With no children there is no wrapper element at all, the switch is its own flex item. Name
					it with <code>aria-label</code>.
				</Typography>
				<div className={styles.marginTopMedium}>
					<Switch color="primary" textPlacement="right" aria-label="Wrap text" defaultValue />
				</div>
			</div>
		</div>
	),
};
