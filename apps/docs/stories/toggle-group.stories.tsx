import { ChevronDown, LayoutGrid, List } from '@signozhq/icons';
import {
	ToggleGroup,
	ToggleGroupColor,
	type ToggleGroupItemProps,
	ToggleGroupSize,
	type ToggleGroupSizeType,
	ToggleGroupVariant,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, type ReactElement, useState } from 'react';
import { fn } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './toggle-group.stories.module.css';

const meta: Meta<typeof ToggleGroup> = {
	title: 'Primitive Components/ToggleGroup',
	component: ToggleGroup,
	args: {
		onChange: fn(),
		type: 'single',
		variant: ToggleGroupVariant.Outlined,
		color: ToggleGroupColor.Secondary,
		size: ToggleGroupSize.MD,
		disabled: false,
		readOnly: false,
		allowClear: false,
	},
	argTypes: {
		items: {
			control: false,
			description:
				'The buttons, in render order. Each is `{ value, label }` plus optional `prefix`, `suffix`, `testId` and the `disabled` + `disabledTooltip` pair. An icon goes in `prefix` or `suffix`, never in `label`.',
			table: { category: 'Content', type: { summary: 'ToggleGroupItemProps[]' } },
		},
		type: {
			control: 'radio',
			options: ['single', 'multiple'],
			description:
				'How many buttons can be pressed at once. `single` reports a string, `multiple` an array.',
			table: { category: 'Behavior', type: { summary: "'single' | 'multiple'" } },
		},
		variant: {
			control: 'select',
			options: ['outlined'],
			description: 'The visual treatment of the bar. `outlined` is the only value.',
			table: { category: 'Appearance', type: { summary: "'outlined'" } },
		},
		color: {
			control: 'select',
			options: ['secondary'],
			description: 'The colour treatment of the bar. `secondary` is the only value drawn today.',
			table: { category: 'Appearance', type: { summary: "'secondary'" } },
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
			description:
				'Height + padding token. Both sizes are 32px tall and differ in horizontal padding alone.',
			table: { category: 'Appearance', type: { summary: "'sm' | 'md'" } },
		},
		value: {
			control: 'text',
			description: 'The controlled pressed value(s). Use with `onChange`.',
			table: { category: 'State', type: { summary: 'string | string[]' } },
		},
		defaultValue: {
			control: 'text',
			description: 'The pressed value(s) on the first render, for a bar that keeps its own state.',
			table: { category: 'State', type: { summary: 'string | string[]' } },
		},
		onChange: {
			control: false,
			description:
				'Called with the pressed value: a string for `single`, an array for `multiple`. Not called for a press the bar cancels, which is what blocks clearing.',
			table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Whether the whole bar ignores user interaction. Requires `disabledTooltip`. Every button carries `aria-disabled` rather than the native attribute, so the reason stays reachable.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the bar cannot be used, shown on every button. Only allowed alongside `disabled`.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		readOnly: {
			control: 'boolean',
			description:
				'Locks the pressed value while the bar keeps its tab stop and its label colours. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set. Announced through `aria-disabled`, because `aria-readonly` is not allowed on `role="button"`.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		readOnlyTooltip: {
			control: 'text',
			description:
				'Why the value is locked, shown on every button. Only renders while `readOnly` is true, and it is then the only reason shown: the bar and item `disabledTooltip`s are suppressed.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		allowClear: {
			control: 'boolean',
			description:
				'Whether the last pressed button can be released. Off by default: once something is pressed the bar keeps reporting a value.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		width: {
			control: 'text',
			description: 'Width of the bar. Sizes to its content when omitted.',
			table: {
				category: 'Layout',
				type: { summary: 'CSSProperties["width"]' },
				defaultValue: { summary: 'fit-content' },
			},
		},
		maxWidth: {
			control: 'text',
			description:
				'Max-width of the bar. Past it the bar scrolls instead of shrinking its buttons.',
			table: {
				category: 'Layout',
				type: { summary: 'CSSProperties["maxWidth"]' },
				defaultValue: { summary: '100%' },
			},
		},
		id: { control: 'text', table: { category: 'Styling' } },
		testId: { control: 'text', table: { category: 'Testing' } },
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A segmented button bar built from an `items` array. It scrolls once it holds more options than it has room for.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=6365-10017&p=f&m=dev',
		},
	},
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

const LAYOUT_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

const ICON_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List', prefix: <List /> },
	{ value: 'grid', label: 'Grid', prefix: <LayoutGrid /> },
	{ value: 'table', label: 'Table', suffix: <ChevronDown /> },
];

const DISABLED_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'logs', label: 'Logs' },
	{ value: 'traces', label: 'Traces' },
	{
		value: 'profiles',
		label: 'Profiles',
		disabled: true,
		disabledTooltip: 'Profiling is not enabled for this workspace',
	},
];

const OVERFLOW_ITEMS: ToggleGroupItemProps[] = [
	{ value: '5m', label: 'Last 5 minutes' },
	{ value: '15m', label: 'Last 15 minutes' },
	{ value: '1h', label: 'Last hour' },
	{ value: '1d', label: 'Last day' },
	{ value: '1w', label: 'Last week' },
];

// Every label here is past the 120px cap, so each one ellipsises and carries the full text in a
// tooltip. Labels short enough to fit would show the cap doing nothing.
const TRUNCATED_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'day', label: 'Everything that happened in the last twenty four hours' },
	{ value: 'week', label: 'Everything that happened in the last seven days' },
	{ value: 'month', label: 'Everything that happened since the start of the month' },
];

const SIZES: ToggleGroupSizeType[] = [ToggleGroupSize.SM, ToggleGroupSize.MD];

// One option blocked inside a live bar, which is the disabled path a call site reaches for.
const ONE_DISABLED_ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{
		value: 'grid',
		label: 'Grid',
		disabled: true,
		disabledTooltip: 'The grid needs a wider screen',
	},
	{ value: 'table', label: 'Table' },
];

/**
 * The columns of the matrix below. `hover` and `focus` cannot be reached by a snapshot on their own,
 * `storybook-addon-pseudo-states` forces them through the `[data-state-cell]` selectors in the story
 * parameters.
 *
 * The last three columns are three mechanisms, not three looks at one: `disabled bar` is the bar's
 * own prop, `disabled option` is one item's, and `read-only bar` locks the value without disabling
 * anything. Every one of them carries `aria-disabled` on the button rather than the native
 * attribute, so each reason stays reachable.
 */
const STATES = [
	'default',
	'hover',
	'focus',
	'disabled bar',
	'disabled option',
	'read-only bar',
] as const;

type State = (typeof STATES)[number];

/**
 * The props one column overrides. Both pairings are optional here, which is what keeps the spread
 * valid: `ValidateToggleGroupProps` reads the props a call site writes, and an optional one is not
 * written.
 */
type StateProps = {
	items: ToggleGroupItemProps[];
	disabled?: boolean;
	disabledTooltip?: string;
	readOnly?: boolean;
	readOnlyTooltip?: string;
};

function stateProps(state: State): StateProps {
	switch (state) {
		case 'disabled bar':
			return {
				disabled: true,
				disabledTooltip: 'This workspace is read only',
				items: LAYOUT_ITEMS,
			};
		case 'disabled option':
			return { items: ONE_DISABLED_ITEMS };
		case 'read-only bar':
			return {
				readOnly: true,
				readOnlyTooltip: 'Saving your changes',
				items: LAYOUT_ITEMS,
			};
		default:
			return { items: LAYOUT_ITEMS };
	}
}

function ShowcaseSection({
	title,
	note,
	children,
}: {
	title: string;
	note: string;
	children: React.ReactNode;
}): ReactElement {
	return (
		<div className="story-section">
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm" className={styles.sectionNote}>
				{note}
			</Typography>
			{children}
		</div>
	);
}

/**
 * Holds the pressed value of a `multiple` bar, so the showcase shows two buttons filled at once.
 */
function MultipleBar(): ReactElement {
	const [value, setValue] = useState<string[]>(['list', 'table']);

	return (
		<ToggleGroup
			type="multiple"
			variant={ToggleGroupVariant.Outlined}
			color={ToggleGroupColor.Secondary}
			size={ToggleGroupSize.SM}
			value={value}
			onChange={setValue}
			items={LAYOUT_ITEMS}
		/>
	);
}

/**
 * Every size, state, composition and overflow case in one snapshot, with the hover and focus cells
 * held by `storybook-addon-pseudo-states`.
 */
function ToggleGroupShowcaseLayout(): ReactElement {
	return (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				<ShowcaseSection
					title="Sizes and states"
					note="One row per size, one column per state. Both sizes are 32px tall: md triples the horizontal padding, so it is for two- or three-option bars rather than a toolbar. The last three columns are the blocked paths: the bar's own disabled prop, one option blocked inside a live bar, then a read-only bar, which fades less and keeps its label colours because its value is still there to be read."
				>
					<div className={styles.matrix}>
						<span />
						{STATES.map((state) => (
							<Typography key={state} size="sm" weight="medium" className={styles.matrixLabel}>
								{state}
							</Typography>
						))}
						{SIZES.map((size) => (
							<Fragment key={size}>
								<Typography size="sm" weight="medium" className={styles.matrixLabel}>
									{size}
								</Typography>
								{STATES.map((state) => (
									<div key={state} data-state-cell={state}>
										<ToggleGroup
											type="single"
											variant={ToggleGroupVariant.Outlined}
											color={ToggleGroupColor.Secondary}
											size={size}
											defaultValue="list"
											{...stateProps(state)}
										/>
									</div>
								))}
							</Fragment>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Selection"
					note="A single bar reports one string, a multiple bar reports every pressed value, so more than one button carries the fill. Neither can be emptied once something is pressed: the third bar passes allowClear, which hands that press back."
				>
					<div className={styles.exampleStack}>
						<ToggleGroup
							type="single"
							variant={ToggleGroupVariant.Outlined}
							color={ToggleGroupColor.Secondary}
							size={ToggleGroupSize.SM}
							defaultValue="grid"
							items={LAYOUT_ITEMS}
						/>
						<MultipleBar />
						<ToggleGroup
							type="single"
							variant={ToggleGroupVariant.Outlined}
							color={ToggleGroupColor.Secondary}
							size={ToggleGroupSize.SM}
							defaultValue="grid"
							allowClear
							items={LAYOUT_ITEMS}
						/>
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Icons and disabled options"
					note="An icon goes in the item's prefix or suffix, never in the label: those slots sit outside the 120px cap, so the icon keeps its size while the text ellipsises. A blocked option carries aria-disabled rather than the native attribute, so it stays hoverable and its reason stays reachable."
				>
					<div className={styles.exampleStack}>
						<ToggleGroup
							type="single"
							variant={ToggleGroupVariant.Outlined}
							color={ToggleGroupColor.Secondary}
							size={ToggleGroupSize.SM}
							defaultValue="grid"
							items={ICON_ITEMS}
						/>
						<ToggleGroup
							type="single"
							variant={ToggleGroupVariant.Outlined}
							color={ToggleGroupColor.Secondary}
							size={ToggleGroupSize.SM}
							defaultValue="logs"
							testId="signal-picker"
							items={DISABLED_ITEMS}
						/>
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Truncation and overflow"
					note="A label is capped at 120px and truncates past it, with the full text in a tooltip. A bar narrower than its buttons scrolls instead of shrinking them, and an arrow appears at each end. An arrow is chrome rather than an option: it takes an opaque surface of its own and casts a shadow the options scroll under."
				>
					<div className={styles.exampleStack}>
						<ToggleGroup
							type="single"
							variant={ToggleGroupVariant.Outlined}
							color={ToggleGroupColor.Secondary}
							size={ToggleGroupSize.SM}
							defaultValue="day"
							items={TRUNCATED_ITEMS}
						/>
						<div className={styles.overflowFrame}>
							<ToggleGroup
								type="single"
								variant={ToggleGroupVariant.Outlined}
								color={ToggleGroupColor.Secondary}
								size={ToggleGroupSize.SM}
								defaultValue="5m"
								width="100%"
								items={OVERFLOW_ITEMS}
							/>
						</div>
					</div>
				</ShowcaseSection>
			</div>
		</div>
	);
}

export const Default: Story = {
	args: {
		items: LAYOUT_ITEMS,
		defaultValue: 'list',
	},
	parameters: {
		layout: 'padded',
		// Playground: every state it can be driven into is covered by `ToggleGroupShowcase`.
		chromatic: { disableSnapshot: true },
	},
};

export const ToggleGroupShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		// The second option alone, so each cell shows the state beside a pressed option and a plain
		// one. Forcing all three is a bar no pointer can produce.
		pseudo: {
			hover: '[data-state-cell="hover"] [data-slot="toggle-group-button"]:nth-child(2)',
			focusVisible: '[data-state-cell="focus"] [data-slot="toggle-group-button"]:nth-child(2)',
		},
	},
	render: () => <ToggleGroupShowcaseLayout />,
};
