import { Code, Database, GitBranch, Plus, Terminal } from '@signozhq/icons';
import {
	Combobox,
	type ComboboxItemType,
	type ComboboxOptionItemType,
	type ComboboxProps,
	Typography,
} from '@signozhq/ui';
import { ForceOpenProvider } from '@signozhq/ui/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { expect, fireEvent, fn, waitFor } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './combobox.stories.module.css';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Combobox> = {
	title: 'Composed Components/Combobox',
	component: Combobox,
	argTypes: {
		items: {
			control: false,
			description:
				'The rows, in render order. Four kinds, told apart by a required `type`: `item`, `hint`, `group` and `separator`. An empty list renders the `noContent` row, and warns unless `noContent` or `allowCreate` is set.',
			table: { category: 'Content', type: { summary: 'ComboboxItemType[]' } },
		},
		placeholder: {
			control: 'text',
			description:
				'What the trigger shows while nothing is selected. Also its accessible name when no `aria-label` or `aria-labelledby` is given.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		displayValue: {
			control: false,
			description:
				"Decides what the trigger shows for the selected row, in place of the row's `prefix`, `displayValue` and label. Single only. Also runs while nothing is selected, with `undefined`.",
			table: {
				category: 'Content',
				type: { summary: '(item: ComboboxOptionItemType | undefined) => ReactNode' },
			},
		},
		noContent: {
			control: 'text',
			description:
				'What the non-interactive row shows when there is nothing to list: an empty `items`, or a query that matches nothing. Setting it silences the empty `items` warning.',
			table: {
				category: 'Content',
				type: { summary: 'ReactNode' },
				defaultValue: { summary: "'No results found :/'" },
			},
		},
		footerAction: {
			control: false,
			description:
				'A row pinned under the list for an action that is not a value. Holds `label`, `prefix`, `onClick` and `testId`. The popup closes after `onClick`.',
			table: { category: 'Content', type: { summary: 'ComboboxFooterActionType' } },
		},
		value: {
			control: false,
			description:
				'The selected value, a `string`, or a `string[]` with `multiple`. Writing it makes the combobox controlled, even with `undefined`.',
			table: { category: 'Behavior', type: { summary: 'string | string[]' } },
		},
		defaultValue: {
			control: false,
			description:
				'The value selected on the first render, for a combobox that keeps its own state.',
			table: { category: 'Behavior', type: { summary: 'string | string[]' } },
		},
		multiple: {
			control: 'boolean',
			description:
				'Picks several values, shown as chips in the trigger. A pick keeps the popup open and clears the query.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		maxDisplayedPills: {
			control: 'number',
			description:
				'How many chips the trigger shows. The rest collapse into a `+N` chip whose tooltip lists them. Multiple only.',
			table: { category: 'Behavior', type: { summary: 'number' } },
		},
		allowClear: {
			control: 'boolean',
			description:
				'Shows a clear button over the chevron while the pointer is over a combobox with a value. `Delete` and `Backspace` on the trigger clear it too.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		allowCreate: {
			control: 'boolean',
			description:
				'Adds a `Create "<query>"` row while the query matches no row and is not selected. A function renders the row label from the query.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean | ((query: string) => ReactNode)' },
				defaultValue: { summary: 'false' },
			},
		},
		searchInputProps: {
			control: 'object',
			description:
				'The search row: `placeholder`, which is required and names the field, `prefix`, `suffix`, `loading`, `filter` and `onChange`. `filter: false` stops the built-in filtering for rows a server already filtered.',
			table: { category: 'Behavior', type: { summary: 'ComboboxSearchInputProps' } },
		},
		virtualized: {
			control: 'boolean',
			description:
				'Mounts only the rows in view, for lists of thousands of rows. Group headings become plain rows.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		onChange: {
			control: false,
			description:
				'Called with the new value: `string | undefined`, or `string[]` with `multiple`.',
			table: { category: 'Events', type: { summary: '(value) => void' } },
		},
		loading: {
			control: 'boolean',
			description:
				'Swaps the chevron for a spinner and the rows for `loadingContent`. The popup still opens and takes a query.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loadingContent: {
			control: 'text',
			description: 'What to show in place of the rows while `loading`. Defaults to a spinner.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Keeps the popup closed and hides the clear and chip remove buttons. The trigger carries `aria-disabled`, not the native `disabled`, so the reason stays reachable. Requires `disabledTooltip`. Outranks `readOnly`.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the combobox cannot be used, in a tooltip on the trigger while `disabled` is true.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		readOnly: {
			control: 'boolean',
			description:
				'Keeps the popup closed and the selection as it is, with the trigger colours unchanged, faded a little and without its chevron. The trigger carries `aria-readonly`. Requires `readOnlyTooltip`.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		readOnlyTooltip: {
			control: 'text',
			description:
				'Why the combobox cannot be changed, in a tooltip on the trigger while `readOnly` is true and `disabled` is not.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		width: {
			control: 'text',
			description: 'The width of the combobox. A number is read as pixels.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '100%' },
			},
		},
		maxWidth: {
			control: 'text',
			description: 'The max-width of the combobox. A number is read as pixels.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '100%' },
			},
		},
		contentMaxWidth: {
			control: 'text',
			description:
				'How wide the popup may get. The popup is never narrower than the trigger, so a wider trigger wins.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '15.75rem' },
			},
		},
		contentMaxHeight: {
			control: 'text',
			description:
				'How tall the rows may get before they scroll. The search row and the footer action stay pinned.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '20rem' },
			},
		},
		container: {
			control: false,
			description:
				'The element the popup is portalled into. Defaults to `document.body`, or to the panel of the `Dialog` or `Drawer` the combobox sits in.',
			table: { category: 'Behavior', type: { summary: 'HTMLElement | RefObject' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the trigger, so a `<label htmlFor>` can name it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-label': {
			control: 'text',
			description:
				'Names the trigger, and the popup with it. Without it or `aria-labelledby`, the `placeholder` names the trigger, which is not a label.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'The id of a visible label that names the trigger and the popup.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-invalid': {
			control: 'boolean',
			description:
				'Marks the value as invalid. The trigger border turns destructive, hovered or not.',
			table: { category: 'Accessibility', type: { summary: 'boolean' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the trigger as `data-testid`, and the stem every part is named from.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof Combobox>;

function option(
	value: string,
	label: string,
	extra?: Partial<ComboboxOptionItemType>,
): ComboboxOptionItemType {
	return { type: 'item', value, label, ...extra } as ComboboxOptionItemType;
}

const FRAMEWORKS: ComboboxOptionItemType[] = [
	option('react', 'React'),
	option('vue', 'Vue'),
	option('angular', 'Angular'),
	option('svelte', 'Svelte'),
];

/**
 * The playground the Controls table drives.
 */
export const Default: Story = {
	args: {
		items: FRAMEWORKS,
		placeholder: 'Select a framework...',
		'aria-label': 'Framework',
		searchInputProps: { placeholder: 'Search frameworks' },
		onChange: fn(),
	},
	parameters: {
		// Playground: every state the trigger and the popup can be driven into is held at once by
		// `ComboboxShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className={styles.playground}>
			<Combobox {...args} />
		</div>
	),
};

const TECHNOLOGIES: ComboboxItemType[] = [
	{ type: 'group', value: 'frameworks', label: 'Frameworks', items: FRAMEWORKS },
	{ type: 'separator', value: 'after-frameworks' },
	{
		type: 'group',
		value: 'languages',
		label: 'Languages',
		items: [
			option('javascript', 'JavaScript'),
			option('typescript', 'TypeScript'),
			option('python', 'Python'),
			option('go', 'Go'),
			option('rust', 'Rust'),
		],
	},
];

const TOOLS: ComboboxOptionItemType[] = [
	option('react', 'React', {
		prefix: <Code />,
		suffix: (
			<Typography size="xs" color="muted">
				UI
			</Typography>
		),
	}),
	option('nodejs', 'Node.js', { prefix: <Terminal /> }),
	option('postgres', 'PostgreSQL', { prefix: <Database /> }),
	option('git', 'Git', { prefix: <GitBranch /> }),
];

const TOOLS_WITH_DISPLAY_VALUE: ComboboxOptionItemType[] = [
	option('postgres', 'PostgreSQL (primary)', { prefix: <Database />, displayValue: 'PostgreSQL' }),
];

const FILTERS: ComboboxItemType[] = [
	{
		type: 'group',
		value: 'suggestions',
		label: 'Suggestions',
		items: [
			{ type: 'hint', value: 'hint-status', label: 'status:', insertValue: 'status:' },
			{ type: 'hint', value: 'hint-priority', label: 'priority:', insertValue: 'priority:' },
		],
	},
	{
		type: 'group',
		value: 'status',
		label: 'Status',
		items: [
			option('status:active', 'Status: Active'),
			option('status:pending', 'Status: Pending'),
			option('status:closed', 'Status: Closed'),
		],
	},
	{
		type: 'group',
		value: 'priority',
		label: 'Priority',
		items: [
			option('priority:high', 'Priority: High'),
			option('priority:medium', 'Priority: Medium'),
			option('priority:low', 'Priority: Low'),
		],
	},
];

const DURATIONS: ComboboxOptionItemType[] = [
	option('15', '15 minutes', { searchMetadata: 'quarter hour 15m 900 seconds' }),
	option('30', '30 minutes', { searchMetadata: 'half hour 30m 1800 seconds' }),
	option('60', '1 hour', { searchMetadata: '60 minutes 1h 3600 seconds' }),
	option('1440', '1 day', { searchMetadata: '24 hours 1d daily' }),
];

const SERVICES_WITH_REASONS: ComboboxOptionItemType[] = [
	option('checkout', 'checkout-service'),
	option('payments', 'payments-service', {
		disabled: true,
		disabledTooltip: 'No data in the last 24 hours',
	}),
	option('long', 'frontend-proxy-edge-gateway-europe-west-1-production-canary'),
];

function names(prefix: string, count: number): ComboboxOptionItemType[] {
	return Array.from({ length: count }, (_, index) => {
		const name = `${prefix}-${String(index + 1).padStart(3, '0')}`;

		return option(name, name);
	});
}

const SERVICES = names('checkout-service', 200);

const HOSTS: ComboboxItemType[] = [
	{
		type: 'group',
		value: 'us-east-1',
		label: 'us-east-1 (100 hosts)',
		items: names('host-us-east-1', 100),
	},
	{
		type: 'group',
		value: 'eu-west-1',
		label: 'eu-west-1 (100 hosts)',
		items: names('host-eu-west-1', 100),
	},
];

type TriggerRow = {
	id: string;
	label: string;
	note: ReactNode;
	props: ComboboxProps;
	/**
	 * Forced by `storybook-addon-pseudo-states`, for the states a snapshot cannot reach.
	 */
	pseudo?: 'hover' | 'focus';
};

/**
 * Closed triggers, one per thing the trigger can show.
 */
const TRIGGER_ROWS: TriggerRow[] = [
	{
		id: 'trigger-placeholder',
		label: 'placeholder',
		note: (
			<>
				Nothing selected, so the trigger shows <code>placeholder</code>.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
		},
	},
	{
		id: 'trigger-selected',
		label: 'selected',
		note: 'A string label goes into the trigger as it is.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			defaultValue: 'react',
		},
	},
	{
		id: 'trigger-prefix',
		label: 'prefix',
		note: (
			<>
				The selected row&apos;s <code>prefix</code> shows before the value, as it does in the list.
			</>
		),
		props: {
			items: TOOLS,
			placeholder: 'Select a tool...',
			searchInputProps: { placeholder: 'Search tools' },
			defaultValue: 'postgres',
		},
	},
	{
		id: 'trigger-display-value',
		label: 'item displayValue',
		note: (
			<>
				The row&apos;s <code>displayValue</code> takes the label&apos;s place in the trigger and in
				a chip.
			</>
		),
		props: {
			items: TOOLS_WITH_DISPLAY_VALUE,
			placeholder: 'Select a tool...',
			searchInputProps: { placeholder: 'Search tools' },
			defaultValue: 'postgres',
		},
	},
	{
		id: 'trigger-display-value-callback',
		label: 'displayValue callback',
		note: (
			<>
				The <code>displayValue</code> prop decides the trigger on its own, and runs while nothing is
				selected as well.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			defaultValue: 'vue',
			displayValue: (item) => (item ? `Framework: ${item.value}` : 'Any framework'),
		},
	},
	{
		id: 'trigger-truncated',
		label: 'long value',
		note: 'The value ends in an ellipsis, and the full text shows in a tooltip on hover.',
		props: {
			items: SERVICES_WITH_REASONS,
			placeholder: 'Select a service...',
			searchInputProps: { placeholder: 'Search services' },
			defaultValue: 'long',
		},
	},
	{
		id: 'trigger-multiple',
		label: 'multiple',
		note: 'One chip per selected value, each with a remove button of its own.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select frameworks...',
			searchInputProps: { placeholder: 'Search frameworks' },
			multiple: true,
			defaultValue: ['react', 'vue'],
		},
	},
	{
		id: 'trigger-max-pills',
		label: 'maxDisplayedPills',
		note: (
			<>
				<code>maxDisplayedPills=&#123;2&#125;</code> shows two chips and folds the rest into{' '}
				<code>+N</code>, whose tooltip lists them.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select frameworks...',
			searchInputProps: { placeholder: 'Search frameworks' },
			multiple: true,
			defaultValue: ['react', 'vue', 'angular', 'svelte'],
			maxDisplayedPills: 2,
		},
	},
	{
		id: 'trigger-wrapped',
		label: 'chips that wrap',
		note: 'Chips that do not fit wrap, and the trigger grows to hold them.',
		props: {
			items: TECHNOLOGIES,
			placeholder: 'Select technologies...',
			searchInputProps: { placeholder: 'Search technologies' },
			multiple: true,
			defaultValue: ['react', 'vue', 'angular', 'svelte', 'typescript', 'python', 'rust'],
		},
	},
	{
		id: 'trigger-clear',
		label: 'allowClear, hovered',
		note: (
			<>
				The chevron turns into a clear button while the pointer is over a combobox that has a value.{' '}
				<code>Delete</code> and <code>Backspace</code> on the focused trigger clear it too.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			defaultValue: 'react',
			allowClear: true,
		},
		pseudo: 'hover',
	},
	{
		id: 'trigger-clear-multiple',
		label: 'allowClear, multiple, hovered',
		note: 'The same button, clearing every chip at once.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select frameworks...',
			searchInputProps: { placeholder: 'Search frameworks' },
			multiple: true,
			defaultValue: ['react', 'vue'],
			allowClear: true,
		},
		pseudo: 'hover',
	},
	{
		id: 'trigger-focus',
		label: 'focus-visible',
		note: 'The keyboard focus ring.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			defaultValue: 'react',
		},
		pseudo: 'focus',
	},
	{
		id: 'trigger-invalid',
		label: 'aria-invalid',
		note: 'The border turns destructive, hovered or not.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			defaultValue: 'react',
			'aria-invalid': true,
		},
	},
	{
		id: 'trigger-loading',
		label: 'loading',
		note: "A spinner takes the chevron's place, and the clear button never shows.",
		props: {
			items: [],
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			loading: true,
		},
	},
	{
		id: 'trigger-disabled',
		label: 'disabled',
		note: (
			<>
				Never opens. The trigger keeps the focus and shows <code>disabledTooltip</code> on hover.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			defaultValue: 'react',
			disabled: true,
			disabledTooltip: 'Pick a project first',
		},
	},
	{
		id: 'trigger-disabled-multiple',
		label: 'disabled, multiple',
		note: 'The chips lose their remove buttons.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select frameworks...',
			searchInputProps: { placeholder: 'Search frameworks' },
			multiple: true,
			defaultValue: ['react', 'vue'],
			disabled: true,
			disabledTooltip: undefined,
		},
	},
	{
		id: 'trigger-read-only',
		label: 'readOnly',
		note: (
			<>
				Keeps its colours, fades a little, hides its chevron, never opens, and shows{' '}
				<code>readOnlyTooltip</code> on hover.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select frameworks...',
			searchInputProps: { placeholder: 'Search frameworks' },
			multiple: true,
			defaultValue: ['react', 'vue'],
			readOnly: true,
			readOnlyTooltip: 'Managed by your admin',
		},
	},
];

type PopupCell = {
	id: string;
	title: string;
	note: ReactNode;
	props: ComboboxProps;
	/**
	 * Typed into the search row by `play`, for the states only a query reaches.
	 */
	query?: string;
};

/**
 * The popups the showcase holds open with `ForceOpenProvider`.
 */
const POPUP_CELLS: PopupCell[] = [
	{
		id: 'popup-single',
		title: 'Single select',
		note: 'The selected row carries the check. Picking a row selects it and closes the popup.',
		props: {
			items: FRAMEWORKS,
			defaultValue: 'vue',
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
		},
	},
	{
		id: 'popup-groups',
		title: 'Groups',
		note: (
			<>
				A <code>group</code> row heads its rows, and a <code>separator</code> row draws a rule. A
				group the query empties goes away with its heading.
			</>
		),
		props: {
			items: TECHNOLOGIES,
			defaultValue: 'typescript',
			placeholder: 'Select a technology...',
			searchInputProps: { placeholder: 'Search technologies' },
		},
	},
	{
		id: 'popup-affixes',
		title: 'Prefix and suffix',
		note: (
			<>
				A row takes a <code>prefix</code> and a <code>suffix</code>, around the label. The selection
				indicator always comes last.
			</>
		),
		props: {
			items: TOOLS,
			defaultValue: 'postgres',
			placeholder: 'Select a tool...',
			searchInputProps: { placeholder: 'Search tools' },
		},
	},
	{
		id: 'popup-multiple',
		title: 'Multiple',
		note: 'Every row carries a checkbox. Picking a row toggles it and leaves the popup open.',
		props: {
			items: FRAMEWORKS,
			multiple: true,
			defaultValue: ['react', 'svelte'],
			placeholder: 'Select frameworks...',
			searchInputProps: { placeholder: 'Search frameworks' },
		},
	},
	{
		id: 'popup-search-metadata',
		title: 'searchMetadata',
		note: (
			<>
				The query <code>half</code> finds <code>30 minutes</code> through its{' '}
				<code>searchMetadata</code>. The search also reads the label text, the <code>value</code>{' '}
				and the <code>displayValue</code>.
			</>
		),
		props: {
			items: DURATIONS,
			placeholder: 'Select a duration...',
			searchInputProps: { placeholder: 'Search durations' },
		},
		query: 'half',
	},
	{
		id: 'popup-empty',
		title: 'Nothing matched',
		note: (
			<>
				A query nothing matches shows <code>noContent</code>, <code>No results found :/</code> when
				it is left out.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks' },
			noContent: 'No framework matches that.',
		},
		query: 'ember',
	},
	{
		id: 'popup-create',
		title: 'Create',
		note: (
			<>
				<code>allowCreate</code> leads the list with a row for a query no row matches. Pressing it,
				or <code>Enter</code>, selects the query.
			</>
		),
		props: {
			items: FRAMEWORKS,
			multiple: true,
			allowCreate: true,
			defaultValue: ['react'],
			placeholder: 'Select or create tags...',
			searchInputProps: { placeholder: 'Search tags' },
		},
		query: 'solid',
	},
	{
		id: 'popup-create-custom',
		title: 'Create, worded by you',
		note: (
			<>
				A function passed to <code>allowCreate</code> words the row. It gets the query.
			</>
		),
		props: {
			items: FRAMEWORKS,
			allowCreate: (query) => (
				<span>
					Add <strong>&quot;{query}&quot;</strong> as a framework
				</span>
			),
			placeholder: 'Select or create...',
			searchInputProps: { placeholder: 'Search frameworks' },
		},
		query: 'qwik',
	},
	{
		id: 'popup-tags',
		title: 'Custom values',
		note: (
			<>
				No <code>items</code> at all, every value was typed. A selected value <code>items</code>{' '}
				does not have sits under <code>Custom</code>, checked, and is unpicked like any other row.
			</>
		),
		props: {
			items: [],
			noContent: 'Type to add a tag',
			multiple: true,
			allowCreate: true,
			defaultValue: ['production', 'eu-west-1'],
			placeholder: 'Type to add tags...',
			searchInputProps: { placeholder: 'Search tags' },
		},
	},
	{
		id: 'popup-hints',
		title: 'Hints',
		note: (
			<>
				A <code>hint</code> row writes its <code>insertValue</code> into the search row instead of
				selecting, and the user carries on typing from there.
			</>
		),
		props: {
			items: FILTERS,
			placeholder: 'Filter by...',
			searchInputProps: { placeholder: 'Search filters' },
		},
	},
	{
		id: 'popup-hints-typed',
		title: 'After a hint',
		note: (
			<>
				Once the query starts with a hint&apos;s <code>insertValue</code>, the hints step aside and
				the rows narrow down to what follows it.
			</>
		),
		props: {
			items: FILTERS,
			placeholder: 'Filter by...',
			searchInputProps: { placeholder: 'Search filters' },
		},
		query: 'status:',
	},
	{
		id: 'popup-reasons',
		title: 'Disabled row, long label',
		note: (
			<>
				A <code>disabled</code> row cannot be picked and shows its <code>disabledTooltip</code> on
				hover. A long label ends in an ellipsis, with the full text in a tooltip.
			</>
		),
		props: {
			items: SERVICES_WITH_REASONS,
			placeholder: 'Select a service...',
			searchInputProps: { placeholder: 'Search services' },
		},
	},
	{
		id: 'popup-loading',
		title: 'Loading',
		note: (
			<>
				<code>loading</code> replaces the rows with <code>loadingContent</code> and puts a spinner
				in the trigger.
			</>
		),
		props: {
			items: [],
			loading: true,
			loadingContent: 'Fetching services...',
			placeholder: 'Select a service...',
			searchInputProps: { placeholder: 'Search services' },
		},
	},
	{
		id: 'popup-server',
		title: 'Filtered on a server',
		note: (
			<>
				<code>searchInputProps.filter: false</code> keeps every row the server sent, and{' '}
				<code>searchInputProps.loading</code> swaps the search glyph for a spinner while a request
				is out.
			</>
		),
		props: {
			items: FRAMEWORKS.slice(0, 2),
			placeholder: 'Select a framework...',
			searchInputProps: { placeholder: 'Search frameworks', filter: false, loading: true },
		},
		query: 're',
	},
	{
		id: 'popup-footer',
		title: 'Footer action',
		note: (
			<>
				<code>footerAction</code> pins a row under the list for an action that is not a value. It
				stays put while the rows scroll.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a billing model...',
			searchInputProps: { placeholder: 'Search billing models' },
			footerAction: { label: 'Create a billing model', prefix: <Plus />, onClick: fn() },
		},
	},
	{
		id: 'popup-virtualized',
		title: 'Virtualized',
		note: (
			<>
				With <code>virtualized</code> only the rows in view are mounted: 200 services here.
			</>
		),
		props: {
			items: SERVICES,
			virtualized: true,
			defaultValue: 'checkout-service-002',
			placeholder: 'Select a service...',
			searchInputProps: { placeholder: 'Search services' },
		},
	},
	{
		id: 'popup-virtualized-groups',
		title: 'Virtualized groups, multiple',
		note: (
			<>
				Groups, <code>multiple</code>, <code>allowCreate</code> and hints all work in a virtualized
				list. <code>contentMaxHeight</code> sets its height.
			</>
		),
		props: {
			items: HOSTS,
			multiple: true,
			virtualized: true,
			contentMaxHeight: 240,
			defaultValue: ['host-us-east-1-001', 'host-eu-west-1-002'],
			maxDisplayedPills: 1,
			placeholder: 'Select hosts...',
			searchInputProps: { placeholder: 'Search hosts' },
		},
	},
];

function findPopupInput(trigger: Element | null | undefined): HTMLInputElement | null {
	// The popup is portalled to `document.body`. Base UI points the trigger at it through
	// `aria-controls`, which is how a cell finds its own search row.
	const popupId = trigger?.getAttribute('aria-controls');

	return popupId ? (document.getElementById(popupId)?.querySelector('input') ?? null) : null;
}

/**
 * The window height, so the popup grid can remount when a snapshot tool grows the viewport.
 *
 * Base UI flips a popup whose trigger is below the fold to open upwards, and keeps it flipped
 * while it stays open. The tools shoot a tall page by growing the viewport after the story has
 * rendered, so the popups have to open again once it has grown.
 */
function useWindowHeight(): number {
	const [height, setHeight] = useState(() => window.innerHeight);

	useEffect(() => {
		const onResize = (): void => setHeight(window.innerHeight);

		window.addEventListener('resize', onResize);

		return () => window.removeEventListener('resize', onResize);
	}, []);

	return height;
}

/**
 * A combobox held open, with its query typed in once the popup is there. In the cell rather than
 * in `play`, so the query comes back when the grid remounts.
 */
function HeldOpenCombobox({ id, title, props, query }: PopupCell): ReactElement {
	useEffect(() => {
		if (query === undefined) {
			return;
		}

		let frame = 0;

		const typeQuery = (): void => {
			const input = findPopupInput(document.querySelector(`[data-testid="${id}"]`));

			if (input === null) {
				frame = requestAnimationFrame(typeQuery);
				return;
			}

			fireEvent.change(input, { target: { value: query } });
		};

		frame = requestAnimationFrame(typeQuery);

		return () => cancelAnimationFrame(frame);
	}, [id, query]);

	return <Combobox aria-label={title} {...props} testId={id} />;
}

function ShowcaseCell({
	title,
	note,
	children,
}: {
	title: string;
	note: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={`story-section ${styles.cell}`}>
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm" color="muted">
				{note}
			</Typography>
			{children}
		</div>
	);
}

function TriggerRowView({ id, label, note, props, pseudo }: TriggerRow): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.matrixLabel}>
				{label}
			</Typography>
			<div data-pseudo={pseudo}>
				<Combobox aria-label={label} {...props} testId={id} />
			</div>
			<Typography size="sm" color="muted">
				{note}
			</Typography>
		</>
	);
}

/**
 * Every state the trigger can show, and every popup held open at once in one snapshot, with the
 * queries some of them need typed in.
 */
export const ComboboxShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: '[data-pseudo="hover"] [data-slot="combobox"]',
			focusVisible: '[data-pseudo="focus"] [data-slot="combobox-trigger"]',
		},
	},
	play: async () => {
		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="combobox-popup"]')).toHaveLength(
				POPUP_CELLS.length,
			),
		);
		await waitForEffects();
		await waitFor(() =>
			expect(document.querySelectorAll('[data-kind="create"]')).toHaveLength(
				POPUP_CELLS.filter(({ props, query }) => query !== undefined && Boolean(props.allowCreate))
					.length,
			),
		);
	},
	render: () => <ComboboxShowcaseView />,
};

function ComboboxShowcaseView(): ReactElement {
	const windowHeight = useWindowHeight();

	return (
		<div className="story-container-full">
			<div className={styles.columnLayout}>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Trigger
					</Typography>
					<Typography size="sm">
						What the closed trigger shows, one row per case. The <code>hovered</code> and{' '}
						<code>focus-visible</code> rows are forced by <code>storybook-addon-pseudo-states</code>
						.
					</Typography>
					<div className={`${styles.triggerGrid} ${styles.marginTopMedium}`}>
						{TRIGGER_ROWS.map((row) => (
							<TriggerRowView key={row.id} {...row} />
						))}
					</div>
				</div>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Popup
					</Typography>
					<Typography size="sm">
						Every popup below is held open by <code>ForceOpenProvider</code>, so they all fit in one
						snapshot. Without it, the popup that opens last takes the focus and closes the rest.
						Each query is typed in once its popup is on screen.
					</Typography>
					<ForceOpenProvider>
						<div key={windowHeight} className={`${styles.showcaseGrid} ${styles.marginTopMedium}`}>
							{POPUP_CELLS.map((cell) => (
								<ShowcaseCell key={cell.id} title={cell.title} note={cell.note}>
									<HeldOpenCombobox {...cell} />
								</ShowcaseCell>
							))}
						</div>
					</ForceOpenProvider>
				</div>
			</div>
		</div>
	);
}
