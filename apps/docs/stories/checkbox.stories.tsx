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
import styles from './checkbox.stories.module.css';

const COLORS = Object.values(CheckboxColor);

const LONG_LABEL = 'Display every timestamp on the console in the 24-hour format';

const meta: Meta<typeof Checkbox> = {
	title: 'Primitive Components/Checkbox',
	component: Checkbox,
	args: {
		onChange: fn(),
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'One independent yes/no choice that something else commits — a form, an apply button. Label rides along in a `<label>` wrapper; without it the checkbox renders bare.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=4628-34798',
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description:
				'The label, and the accessible name. Clicking it toggles. Without it the checkbox renders bare, with no wrapper element at all: name it with `aria-label` instead. Children that render nothing count as not passed.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		color: {
			control: 'select',
			options: COLORS,
			description:
				"Same palette as Badge's `color`. Fills the box while checked or indeterminate; the unchecked box keeps a neutral border for every color. Required: the checked fill is a semantic statement, so the call site has to make it.",
			table: {
				category: 'Appearance',
				type: { summary: 'CheckboxColorType' },
			},
		},
		textOverflow: {
			control: 'inline-radio',
			options: Object.values(CheckboxTextOverflow),
			description:
				'`ellipsis` (default) truncates the label and shows it in full in a tooltip. `wrap` lets it take more lines, `hidden` clips it, `visible` clips nothing. None of the last three shows a tooltip.',
			table: {
				category: 'Behavior',
				type: { summary: 'CheckboxTextOverflowType' },
				defaultValue: { summary: 'ellipsis' },
			},
		},
		value: {
			control: 'inline-radio',
			options: [true, false, 'indeterminate'],
			description:
				'The controlled checked state. `"indeterminate"` shows the mixed state: a dash instead of the check mark, announced as `aria-checked="mixed"`; clicking it reports `true` through `onChange`, and deriving it from a tree\'s children is the call site\'s job. Use with `onChange`, never with `defaultValue`.',
			table: { category: 'State', type: { summary: "boolean | 'indeterminate'" } },
		},
		defaultValue: {
			control: 'inline-radio',
			options: [true, false, 'indeterminate'],
			description:
				'The checked state on first render, for a checkbox that keeps its own state. `"indeterminate"` shows the dash until the first toggle.',
			table: { category: 'State', type: { summary: "boolean | 'indeterminate'" } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Blocks the checkbox. Announced through `aria-disabled`, so it stays hoverable and keeps its tab stop and the reason stays reachable. Requires `disabledTooltip`. Suppressed entirely while `readOnly` is true.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the checkbox cannot be used. Only renders while `disabled` is true, and never while `readOnly` is.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		readOnly: {
			control: 'boolean',
			description:
				'Locks the value while the checkbox stays focusable. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set.',
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
			description: 'The owning form cannot be submitted until the checkbox is checked.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		width: {
			control: 'text',
			description:
				'The width of the labelled row, written as the `--checkbox-internal-width` custom property. Numbers are px. Sizes the row, never the 16px box.',
			table: { category: 'Behavior', type: { summary: "CSSProperties['width']" } },
		},
		maxWidth: {
			control: 'text',
			description:
				'The max-width of the labelled row, written as `--checkbox-internal-max-width`. Defaults to `100%` of the container.',
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
				'Forwarded to the checkbox itself as `data-testid`. The wrapper is named by `containerTestId` instead.',
			table: { category: 'Testing' },
		},
		containerTestId: {
			control: 'text',
			description: 'Forwarded to the `<label>` wrapper as `data-testid`.',
			table: { category: 'Testing' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the checkbox itself.',
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
		tabIndex: {
			control: 'number',
			description:
				'Forwarded to the checkbox. A disabled checkbox keeps its tab stop by default, so `disabledTooltip` stays reachable without a pointer.',
			table: { category: 'Accessibility', type: { summary: 'number' } },
		},
		'aria-label': {
			control: 'text',
			description:
				'The accessible name for a bare checkbox. With a label as `children` the name comes from it instead.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
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
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
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
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
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
				<Typography size="base" weight="semibold">
					Labels
				</Typography>
				<Typography size="sm">
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
				<Typography size="base" weight="semibold">
					Indeterminate
				</Typography>
				<Typography size="sm">
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
				<Typography size="base" weight="semibold">
					Overflow
				</Typography>
				<Typography size="sm">
					Capped at <code>{CONSTRAINED_WIDTH}</code>. <code>ellipsis</code> shows the full label in
					a tooltip on hover, <code>wrap</code> takes more lines, <code>hidden</code> clips, and
					<code>visible</code> paints past the cap.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					{Object.values(CheckboxTextOverflow).map((textOverflow) => (
						<Fragment key={textOverflow}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
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
				<Typography size="base" weight="semibold">
					Bare
				</Typography>
				<Typography size="sm">
					With no children there is no wrapper element at all, the checkbox is its own flex item.
					Name it with <code>aria-label</code>.
				</Typography>
				<div className={styles.marginTopMedium}>
					<Checkbox color="primary" aria-label="Wrap text" defaultValue />
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Hit area
				</Typography>
				<Typography size="sm">
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
