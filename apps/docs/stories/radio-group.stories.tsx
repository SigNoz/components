import {
	Button,
	Input,
	RadioGroup,
	RadioGroupColor,
	type RadioGroupColorType,
	type RadioGroupItemType,
	RadioGroupTextOverflow,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, useState } from 'react';
import { fn } from 'storybook/test';
import styles from './radio-group.stories.module.css';

const COLORS = Object.values(RadioGroupColor);

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
	{ label: 'Local', value: 'local' },
];

const LONG_ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging, the one the release train lands on every Tuesday', value: 'staging' },
	{ label: 'Production, the one every customer is looking at right now', value: 'production' },
];

const meta: Meta<typeof RadioGroup> = {
	title: 'Primitive Components/RadioGroup',
	component: RadioGroup,
	args: {
		onChange: fn(),
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A single-choice control rendered from `items`. The group owns its markup, so there is nothing to compose inside it.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=4628-34799&p=f&m=dev',
		},
	},
	argTypes: {
		items: {
			control: false,
			description:
				'The options, in the order they are rendered. Each is `{ label, value }`, plus an optional `testId`, and an optional `disabled` + `disabledTooltip` pair that blocks that row alone. A `label` is a node: when it holds something that draws outside its own box, such as a field with a focus ring, pass `textOverflow="visible"`. A label that renders nothing falls back to `<No label>` rather than dropping the row.',
			table: { category: 'Content', type: { summary: 'RadioGroupItemType[]' } },
		},
		color: {
			control: 'select',
			options: COLORS,
			description: "Same palette as Button's `color`. Tints the checked item.",
			table: { category: 'Appearance', type: { summary: 'RadioGroupColorType' } },
		},
		textOverflow: {
			control: 'inline-radio',
			options: Object.values(RadioGroupTextOverflow),
			description:
				'`ellipsis` (default) truncates a label and shows it in full in a tooltip. `wrap` lets it take another line, `hidden` clips it, `visible` clips nothing. None of the last three shows a tooltip. Use `visible` for a label that holds a control, so its focus ring is not cut.',
			table: {
				category: 'Behavior',
				type: { summary: 'RadioGroupTextOverflowType' },
				defaultValue: { summary: 'ellipsis' },
			},
		},
		value: {
			control: 'text',
			description:
				'The controlled value. `null` is the empty group, and the only way to write one: `undefined` makes the group uncontrolled. Use with `onChange`.',
			table: { category: 'State', type: { summary: 'string | null' } },
		},
		defaultValue: {
			control: 'text',
			description: 'The value checked on the first render, for a group that keeps its own state.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Blocks the whole group. Announced through `aria-disabled`, so the group stays hoverable and keeps its tab stop and the reason stays reachable. Requires `disabledTooltip`. Suppressed entirely while `readOnly` is true.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the group cannot be used. Only renders while `disabled` is true, and never while `readOnly` is.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		readOnly: {
			control: 'boolean',
			description:
				'Locks the value while arrow keys keep moving focus. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set.',
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
			description: 'Identifies the field when the owning form is submitted.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		required: {
			control: 'boolean',
			description: 'The owning form cannot be submitted until one item is checked.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		onChange: {
			control: false,
			description:
				"Called with the newly checked item's `value`. Never fires with `null`: only a radio reports a change, and it reports its own value.",
			table: { category: 'Events', type: { summary: '(value: string) => void' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the rendered element as `data-testid`. Also names every row, as `${testId}-item-${value}`, unless the item carries a `testId` of its own.',
			table: { category: 'Testing' },
		},
		id: {
			control: 'text',
			table: { category: 'Accessibility' },
		},
		'aria-labelledby': {
			control: 'text',
			description:
				'The id of the element that asks the question. A radio group needs a name of its own on top of the per-option labels, otherwise a screen reader gets a list of answers to a question nobody asked.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
	args: {
		color: 'primary',
		items: ITEMS,
		defaultValue: 'staging',
	},
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them through the `[data-state-cell]` selectors in the
 * story parameters. `disabled` and `readonly` are real props, so they need no pseudo.
 *
 * Each cell holds one checked and one unchecked radio, which is what makes the two disabled
 * opacities (0.6 selected, 0.4 unselected) readable side by side.
 */
const STATES = ['default', 'hover', 'focus', 'disabled', 'readonly'] as const;

type State = (typeof STATES)[number];

const STATE_ITEMS: RadioGroupItemType[] = [
	{ label: 'Selected', value: 'selected' },
	{ label: 'Unselected', value: 'unselected' },
];

function StateCell({ color, state }: { color: RadioGroupColorType; state: State }): ReactElement {
	const blocking =
		state === 'disabled'
			? ({ disabled: true, disabledTooltip: 'Ask an admin for access' } as const)
			: state === 'readonly'
				? ({ readOnly: true, readOnlyTooltip: 'Saving your changes' } as const)
				: {};

	return (
		<div data-state-cell={state}>
			<RadioGroup color={color} items={STATE_ITEMS} defaultValue="selected" {...blocking} />
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

const OTHER_VALUE = 'other';

/**
 * An item's `label` is a `ReactNode`, so the option that has no fixed answer can ask for one.
 *
 * The field is mounted only while `other` is checked, which is why the group is controlled: the
 * label is built from the value the group reports back.
 *
 * Two details make it behave. The group is `textOverflow="visible"`: `ellipsis` would measure the
 * label and repeat it in a tooltip, which here is a second copy of the field in the popup, and
 * every other mode clips the label, which cuts the field's focus ring. And the field carries its
 * own `aria-label`, because the row's label element is the radio's accessible name, not the
 * field's.
 */
function OtherOptionGroup(): ReactElement {
	const [value, setValue] = useState<string | null>('staging');
	const [customName, setCustomName] = useState('');

	return (
		<RadioGroup
			color="primary"
			textOverflow="visible"
			value={value}
			onChange={setValue}
			items={[
				{ label: 'Staging', value: 'staging', testId: 'staging-radio' },
				{ label: 'Production', value: 'production', testId: 'production-radio' },
				{
					value: OTHER_VALUE,
					testId: 'other-radio',
					label: (
						<span className={styles.controlLabel}>
							Other
							{value === OTHER_VALUE && (
								<Input
									className={styles.otherInput}
									aria-label="Custom environment name"
									placeholder="staging-eu"
									value={customName}
									onChange={(event) => setCustomName(event.target.value)}
								/>
							)}
						</span>
					),
				},
			]}
		/>
	);
}

const CONSTRAINED_WIDTH = '14rem';

export const RadioGroupShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
		pseudo: {
			// The hover rules sit on the row, so the whole label is part of the hit target.
			hover: '[data-state-cell="hover"] [data-slot="radio-group-item"]',
			// The ring sits on the dial itself.
			focusVisible: '[data-state-cell="focus"] [data-slot="radio-group-control"]',
		},
	},
	argTypes: {
		items: { control: false },
		color: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
					One row per color, one column per state. Every cell holds a selected and an unselected
					radio. Hover tints the border and brightens the label, never the fill, so a hovered option
					cannot be mistaken for a chosen one.
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
								<StateCell key={state} color={color as RadioGroupColorType} state={state} />
							))}
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Blocking one option
				</Typography>
				<Typography size="sm">
					A single item can disable itself, which the arrow keys then skip. Read-only is never a
					property of one option: it locks the whole choice.
				</Typography>
				<div className={styles.marginTopMedium}>
					<RadioGroup
						color="primary"
						defaultValue="staging"
						items={[
							{ label: 'Staging', value: 'staging' },
							{
								label: 'Production',
								value: 'production',
								disabled: true,
								disabledTooltip: 'Ask an admin for production access',
							},
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					An option that asks for a value
				</Typography>
				<Typography size="sm">
					A label is a node, not a string, so <code>Other</code> can grow a field once it is picked.
					Clicking the field does not move the choice. The group is a composite, so it selects the
					field's text on focus, and holds the arrow keys inside it until the caret reaches an end
					of the text, where the next press moves to another option.
				</Typography>
				<div className={styles.marginTopMedium}>
					<OtherOptionGroup />
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					A label taller than the row
				</Typography>
				<Typography size="sm">
					An <code>Input</code> or a <code>Button</code> inside a label is taller than the line the
					label is set on. The dial is centred on that first line rather than on the row, so it
					holds its position: the row grows downwards and the control the user is about to click
					does not move.
				</Typography>
				<div className={styles.marginTopMedium}>
					<RadioGroup
						color="primary"
						textOverflow="visible"
						defaultValue="staging"
						items={[
							{ label: 'Staging', value: 'staging' },
							{
								value: 'custom',
								label: (
									<span className={styles.controlLabel}>
										Custom
										<Input aria-label="Custom environment name" placeholder="staging-eu" />
									</span>
								),
							},
							{
								value: 'request',
								label: (
									<span className={styles.controlLabel}>
										Request one
										<Button size="md" variant="outlined" color="secondary">
											Ask an admin
										</Button>
									</span>
								),
							},
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Overflow
				</Typography>
				<Typography size="sm">
					Capped at <code>{CONSTRAINED_WIDTH}</code>. <code>ellipsis</code> shows the full label in
					a tooltip on hover, <code>wrap</code> takes a second line, <code>none</code> clips, and
					<code>visible</code> paints past the cap, which is what keeps a control's focus ring in a
					label.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					{Object.values(RadioGroupTextOverflow).map((textOverflow) => (
						<Fragment key={textOverflow}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{textOverflow}
							</Typography>
							<div className={styles.narrow}>
								<RadioGroup
									color="primary"
									textOverflow={textOverflow}
									defaultValue="staging"
									items={LONG_ITEMS}
								/>
							</div>
							<span />
						</Fragment>
					))}
				</div>
			</div>
		</div>
	),
};
