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
import styles from './switch.stories.module.css';

const COLORS = Object.values(SwitchColor);

const LONG_LABEL = 'Display every timestamp on the console in the 24-hour format';

const meta: Meta<typeof Switch> = {
	title: 'Primitive Components/Switch',
	component: Switch,
	args: {
		onChange: fn(),
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'An on/off toggle that commits immediately. Label and description ride along in a `<label>` wrapper; without them the switch renders bare.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-742&m=dev',
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description:
				'The label, and the accessible name. Clicking it toggles. Without it the switch renders bare, with no wrapper element at all: name it with `aria-label` instead. Children that render nothing count as not passed.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		description: {
			control: 'text',
			description:
				'A muted second line under the label, announced through `aria-describedby`. The label steps up to medium weight beside it, reading as the row title.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		color: {
			control: 'select',
			options: COLORS,
			description:
				"Same palette as Badge's `color`. Tints the track while the switch is on; the knob keeps one color across the palette.",
			table: {
				category: 'Appearance',
				type: { summary: 'SwitchColorType' },
				defaultValue: { summary: 'primary' },
			},
		},
		textPlacement: {
			control: 'inline-radio',
			options: ['right', 'left'],
			description:
				'Which side of the switch the text sits on. `right` is the plain toggle row, sized to its content. `left` is the settings row: text first, the row fills its container, and the switch sits at the far edge.',
			table: { category: 'Appearance', type: { summary: 'SwitchTextPlacementType' } },
		},
		textOverflow: {
			control: 'inline-radio',
			options: Object.values(SwitchTextOverflow),
			description:
				'`ellipsis` (default) truncates the label and shows it in full in a tooltip. `wrap` lets it take another line, `hidden` clips it, `visible` clips nothing. None of the last three shows a tooltip.',
			table: {
				category: 'Behavior',
				type: { summary: 'SwitchTextOverflowType' },
				defaultValue: { summary: 'ellipsis' },
			},
		},
		value: {
			control: 'boolean',
			description: 'The controlled checked state. Use with `onChange`, never with `defaultValue`.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultValue: {
			control: 'boolean',
			description: 'The checked state on first render, for a switch that keeps its own state.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Blocks the switch. Announced through `aria-disabled`, so it stays hoverable and keeps its tab stop and the reason stays reachable. Requires `disabledTooltip`. Suppressed entirely while `readOnly` is true.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the switch cannot be used. Only renders while `disabled` is true, and never while `readOnly` is.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		readOnly: {
			control: 'boolean',
			description:
				'Locks the value while the switch stays focusable. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		readOnlyTooltip: {
			control: 'text',
			description: 'Why the value is locked. Only renders while `readOnly` is true.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		name: {
			control: 'text',
			description:
				'Identifies the field when the owning form is submitted; the hidden input submits `"on"` while checked, like a native checkbox.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		required: {
			control: 'boolean',
			description: 'The owning form cannot be submitted until the switch is on.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		width: {
			control: 'text',
			description:
				'The width of the labelled row, written as the `--switch-internal-width` custom property. Numbers are px. Sizes the row, never the 28px track.',
			table: { category: 'Behavior', type: { summary: "CSSProperties['width']" } },
		},
		maxWidth: {
			control: 'text',
			description:
				'The max-width of the labelled row, written as `--switch-internal-max-width`. Defaults to `100%` of the container.',
			table: { category: 'Behavior', type: { summary: "CSSProperties['maxWidth']" } },
		},
		onChange: {
			control: false,
			description:
				'Called with the new checked state, and with nothing else. Never fires while `disabled` or `readOnly`.',
			table: { category: 'Events', type: { summary: '(checked: boolean) => void' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the switch itself as `data-testid`. The wrapper is named by `containerTestId` instead.',
			table: { category: 'Testing' },
		},
		containerTestId: {
			control: 'text',
			description: 'Forwarded to the `<label>` wrapper as `data-testid`.',
			table: { category: 'Testing' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the switch itself.',
			table: { category: 'Styling' },
		},
		containerClassName: {
			control: 'text',
			description:
				'Additional CSS classes for the wrapper. Any `container*` prop forces the wrapper to render even with no label.',
			table: { category: 'Styling' },
		},
		id: {
			control: 'text',
			description:
				'Lands on the hidden checkbox input, which is the element an external `htmlFor` points at.',
			table: { category: 'Accessibility' },
		},
		'aria-label': {
			control: 'text',
			description:
				'The accessible name for a bare switch. With a label as `children` the name comes from it instead.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	args: {
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
			<Switch color={color} aria-label={`${color} off, ${state}`} {...blocking} />
			<Switch color={color} aria-label={`${color} on, ${state}`} defaultValue {...blocking} />
		</div>
	);
}

function MatrixHeader({ columns }: { columns: string[] }): ReactElement {
	return (
		<>
			<span />
			{columns.map((column) => (
				<Typography size="sm" weight="medium" key={column} className={styles.matrixLabel}>
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
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
					One row per color, one column per state, each cell off then on. The off track is the same
					neutral for every color, an unchecked switch has nothing to announce yet. Hover widens the
					knob into a pill, pressing squishes it. Disabled fades to 0.6, read-only to 0.8.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(STATES.length)}
				>
					<MatrixHeader columns={[...STATES]} />
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
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
				<Typography size="base" weight="semibold">
					Label
				</Typography>
				<Typography size="sm">
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
				<Typography size="base" weight="semibold">
					The settings row
				</Typography>
				<Typography size="sm">
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
				<Typography size="base" weight="semibold">
					Overflow
				</Typography>
				<Typography size="sm">
					Capped at <code>{CONSTRAINED_WIDTH}</code>. <code>ellipsis</code> shows the full label in
					a tooltip on hover, <code>wrap</code> takes a second line, <code>hidden</code> clips, and
					<code>visible</code> paints past the cap.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					{Object.values(SwitchTextOverflow).map((textOverflow) => (
						<Fragment key={textOverflow}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{textOverflow}
							</Typography>
							<Switch width={CONSTRAINED_WIDTH} textOverflow={textOverflow} defaultValue>
								{LONG_LABEL}
							</Switch>
							<span />
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Bare
				</Typography>
				<Typography size="sm">
					With no children there is no wrapper element at all, the switch is its own flex item. Name
					it with <code>aria-label</code>.
				</Typography>
				<div className={styles.marginTopMedium}>
					<Switch aria-label="Wrap text" defaultValue />
				</div>
			</div>
		</div>
	),
};
