import { Code, Database, GitBranch, Terminal } from '@signozhq/icons';
import {
	Select,
	type SelectItemType,
	type SelectOptionItemType,
	type SelectProps,
	Typography,
} from '@signozhq/ui';
import { ForceOpenProvider } from '@signozhq/ui/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './select.stories.module.css';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Select> = {
	title: 'Composed Components/Select',
	component: Select,
	argTypes: {
		items: {
			control: false,
			description:
				'The rows, in render order. Three kinds, told apart by a required `type`: `item`, `group` and `separator`. An empty list renders the `noContent` row, and warns unless `noContent` is set.',
			table: { category: 'Content', type: { summary: 'SelectItemType[]' } },
		},
		placeholder: {
			control: 'text',
			description:
				'What the trigger shows while nothing is selected. Also its accessible name when no `aria-label`, `aria-labelledby` or `<label>` names it.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		displayValue: {
			control: false,
			description:
				'Decides what the trigger shows. A single select gets the selected row and replaces its `prefix`, `displayValue` and label. A multiple select gets the selected rows and replaces the chips. Both also run while nothing is selected.',
			table: {
				category: 'Content',
				type: {
					summary:
						'(item: SelectOptionItemType | undefined) => ReactNode | (items: SelectOptionItemType[]) => ReactNode',
				},
			},
		},
		noContent: {
			control: 'text',
			description:
				'What the non-interactive row shows when `items` is empty. Setting it silences the empty `items` warning.',
			table: {
				category: 'Content',
				type: { summary: 'ReactNode' },
				defaultValue: { summary: "'No results found :/'" },
			},
		},
		value: {
			control: false,
			description:
				'The selected value, a `string`, or a `string[]` with `multiple`. Writing it makes the select controlled, even with `undefined`.',
			table: { category: 'Behavior', type: { summary: 'string | string[]' } },
		},
		defaultValue: {
			control: false,
			description: 'The value selected on the first render, for a select that keeps its own state.',
			table: { category: 'Behavior', type: { summary: 'string | string[]' } },
		},
		multiple: {
			control: 'boolean',
			description:
				'Picks several values, shown as chips in the trigger. A pick keeps the popup open.',
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
		container: {
			control: false,
			description:
				'The element the popup is portalled into. Defaults to `document.body`, or to the panel of the `Dialog` or `Drawer` the select sits in.',
			table: { category: 'Behavior', type: { summary: 'HTMLElement | RefObject' } },
		},
		onChange: {
			control: false,
			description: 'Called with the new value: a `string`, or a `string[]` with `multiple`.',
			table: { category: 'Events', type: { summary: '(value) => void' } },
		},
		loading: {
			control: 'boolean',
			description:
				'Swaps the chevron for a spinner and the rows for `loadingContent`. The popup still opens.',
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
				'Keeps the popup closed and hides the chip remove buttons. The trigger carries `aria-disabled`, not the native `disabled`, so the reason stays reachable. Requires `disabledTooltip`. Outranks `readOnly`.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabledTooltip: {
			control: 'text',
			description:
				'Why the select cannot be used, in a tooltip on the trigger while `disabled` is true.',
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
				'Why the select cannot be changed, in a tooltip on the trigger while `readOnly` is true and `disabled` is not.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		width: {
			control: 'text',
			description: 'The width of the select. A number is read as pixels.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '100%' },
			},
		},
		maxWidth: {
			control: 'text',
			description: 'The max-width of the select. A number is read as pixels.',
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
			description: 'How tall the rows may get before they scroll.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '20rem' },
			},
		},
		id: {
			control: 'text',
			description: 'Forwarded to the trigger, so a `<label htmlFor>` can name it.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-label': {
			control: 'text',
			description:
				'Names the trigger, and the list with it. Without a name, the `placeholder` names the trigger, which is not a label.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description: 'The id of a visible label that names the trigger and the list.',
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
type Story = StoryObj<typeof Select>;

function option(
	value: string,
	label: string,
	extra?: Partial<SelectOptionItemType>,
): SelectOptionItemType {
	return { type: 'item', value, label, ...extra } as SelectOptionItemType;
}

const FRAMEWORKS: SelectOptionItemType[] = [
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
		onChange: fn(),
	},
	parameters: {
		// Playground: every state the trigger and the popup can be driven into is held at once by
		// `SelectShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className={styles.playground}>
			<Select {...args} />
		</div>
	),
};

const TECHNOLOGIES: SelectItemType[] = [
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
		],
	},
];

const TOOLS: SelectOptionItemType[] = [
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

const TOOLS_WITH_DISPLAY_VALUE: SelectOptionItemType[] = [
	option('postgres', 'PostgreSQL (primary)', { prefix: <Database />, displayValue: 'PostgreSQL' }),
	option('replica', 'PostgreSQL (read replica)', {
		prefix: <Database />,
		displayValue: 'Replica',
	}),
];

const SERVICES_WITH_REASONS: SelectOptionItemType[] = [
	option('checkout', 'checkout-service'),
	option('payments', 'payments-service', {
		disabled: true,
		disabledTooltip: 'No data in the last 24 hours',
	}),
	option('long', 'frontend-proxy-edge-gateway-europe-west-1-production-canary'),
];

const DURATIONS: SelectOptionItemType[] = [
	option('5m', 'Last 5 minutes'),
	option('15m', 'Last 15 minutes'),
	option('30m', 'Last 30 minutes'),
	option('1h', 'Last 1 hour'),
	option('3h', 'Last 3 hours'),
	option('6h', 'Last 6 hours'),
	option('12h', 'Last 12 hours'),
	option('1d', 'Last 1 day'),
	option('3d', 'Last 3 days'),
	option('1w', 'Last 1 week'),
	option('2w', 'Last 2 weeks'),
	option('1mo', 'Last 1 month'),
];

type TriggerRow = {
	id: string;
	label: string;
	note: ReactNode;
	props: SelectProps;
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
		props: { items: FRAMEWORKS, placeholder: 'Select a framework...' },
	},
	{
		id: 'trigger-selected',
		label: 'selected',
		note: 'A string label goes into the trigger as it is.',
		props: { items: FRAMEWORKS, placeholder: 'Select a framework...', defaultValue: 'react' },
	},
	{
		id: 'trigger-prefix',
		label: 'prefix',
		note: (
			<>
				The selected row&apos;s <code>prefix</code> shows before the value, as it does in the list.
			</>
		),
		props: { items: TOOLS, placeholder: 'Select a tool...', defaultValue: 'postgres' },
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
			placeholder: 'Select a database...',
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
			defaultValue: 'vue',
			displayValue: (item) => (item ? `Framework: ${item.value}` : 'Any framework'),
		},
	},
	{
		id: 'trigger-display-value-multiple',
		label: 'displayValue, multiple',
		note: (
			<>
				With <code>multiple</code>, <code>displayValue</code> gets the selected rows and replaces
				the chips.
			</>
		),
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select frameworks...',
			multiple: true,
			defaultValue: ['react', 'vue', 'svelte'],
			displayValue: (items) =>
				items.length === 0 ? 'Any framework' : `${items.length} frameworks`,
		},
	},
	{
		id: 'trigger-truncated',
		label: 'long value',
		note: 'The value ends in an ellipsis, and the full text shows in a tooltip on hover.',
		props: {
			items: SERVICES_WITH_REASONS,
			placeholder: 'Select a service...',
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
			multiple: true,
			defaultValue: ['react', 'vue', 'angular', 'svelte', 'typescript', 'python', 'go'],
		},
	},
	{
		id: 'trigger-hover',
		label: 'hovered',
		note: 'The border darkens under the pointer.',
		props: { items: FRAMEWORKS, placeholder: 'Select a framework...', defaultValue: 'react' },
		pseudo: 'hover',
	},
	{
		id: 'trigger-focus',
		label: 'focus-visible',
		note: 'The keyboard focus ring.',
		props: { items: FRAMEWORKS, placeholder: 'Select a framework...', defaultValue: 'react' },
		pseudo: 'focus',
	},
	{
		id: 'trigger-invalid',
		label: 'aria-invalid',
		note: 'The border turns destructive, hovered or not.',
		props: {
			items: FRAMEWORKS,
			placeholder: 'Select a framework...',
			defaultValue: 'react',
			'aria-invalid': true,
		},
	},
	{
		id: 'trigger-loading',
		label: 'loading',
		note: "A spinner takes the chevron's place.",
		props: { items: [], placeholder: 'Select a framework...', loading: true },
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
	props: SelectProps;
};

/**
 * The popups the showcase holds open with `ForceOpenProvider`.
 */
const POPUP_CELLS: PopupCell[] = [
	{
		id: 'popup-single',
		title: 'Single select',
		note: 'The selected row carries the check. Picking a row selects it and closes the popup.',
		props: { items: FRAMEWORKS, defaultValue: 'vue', placeholder: 'Select a framework...' },
	},
	{
		id: 'popup-multiple',
		title: 'Multiple select',
		note: 'Each row carries a checkbox. Picking a row toggles it and keeps the popup open.',
		props: {
			items: FRAMEWORKS,
			multiple: true,
			defaultValue: ['react', 'angular'],
			placeholder: 'Select frameworks...',
		},
	},
	{
		id: 'popup-groups',
		title: 'Groups',
		note: (
			<>
				A <code>group</code> row heads its rows, and a <code>separator</code> row draws a rule.
			</>
		),
		props: {
			items: TECHNOLOGIES,
			defaultValue: 'typescript',
			placeholder: 'Select a technology...',
		},
	},
	{
		id: 'popup-affixes',
		title: 'Prefix and suffix',
		note: (
			<>
				<code>prefix</code> and <code>suffix</code> sit around the label.
			</>
		),
		props: { items: TOOLS, defaultValue: 'nodejs', placeholder: 'Select a tool...' },
	},
	{
		id: 'popup-disabled-row',
		title: 'Disabled row and long label',
		note: (
			<>
				A disabled row keeps its place and shows <code>disabledTooltip</code> on hover. A long label
				ends in an ellipsis and shows in full in a tooltip.
			</>
		),
		props: { items: SERVICES_WITH_REASONS, placeholder: 'Select a service...' },
	},
	{
		id: 'popup-scroll',
		title: 'Scrolling',
		note: (
			<>
				Past <code>contentMaxHeight</code> the rows scroll, and the edge that clips a row fades out.
			</>
		),
		props: {
			items: DURATIONS,
			defaultValue: '15m',
			placeholder: 'Select a time range...',
			contentMaxHeight: 200,
		},
	},
	{
		id: 'popup-loading',
		title: 'Loading',
		note: (
			<>
				<code>loading</code> replaces the rows with a spinner row.
			</>
		),
		props: { items: FRAMEWORKS, loading: true, placeholder: 'Select a framework...' },
	},
	{
		id: 'popup-loading-content',
		title: 'loadingContent',
		note: (
			<>
				<code>loadingContent</code> takes the spinner&apos;s place.
			</>
		),
		props: {
			items: [],
			loading: true,
			loadingContent: 'Fetching frameworks...',
			placeholder: 'Select a framework...',
		},
	},
	{
		id: 'popup-empty',
		title: 'Empty',
		note: (
			<>
				An empty <code>items</code> shows one row with <code>noContent</code>.
			</>
		),
		props: {
			items: [],
			noContent: 'No frameworks in this project yet',
			placeholder: 'Select a framework...',
		},
	},
	{
		id: 'popup-no-label',
		title: 'Empty label',
		note: (
			<>
				A row whose label renders nothing shows <code>&lt;No label&gt;</code>.
			</>
		),
		props: {
			items: [option('blank', ''), ...FRAMEWORKS.slice(0, 2)],
			placeholder: 'Select a framework...',
		},
	},
];

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
				<Select aria-label={label} {...props} testId={id} />
			</div>
			<Typography size="sm" color="muted">
				{note}
			</Typography>
		</>
	);
}

/**
 * Every state the trigger can show, and every popup held open at once in one snapshot.
 */
export const SelectShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: '[data-pseudo="hover"] [data-slot="select"]',
			focusVisible: '[data-pseudo="focus"] [data-slot="select-trigger"]',
		},
	},
	play: async () => {
		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="select-popup"]')).toHaveLength(
				POPUP_CELLS.length,
			),
		);
		await waitForEffects();
	},
	render: () => <SelectShowcaseView />,
};

function SelectShowcaseView(): ReactElement {
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
					</Typography>
					<ForceOpenProvider>
						<div key={windowHeight} className={`${styles.showcaseGrid} ${styles.marginTopMedium}`}>
							{POPUP_CELLS.map((cell) => (
								<ShowcaseCell key={cell.id} title={cell.title} note={cell.note}>
									<Select aria-label={cell.title} {...cell.props} testId={cell.id} />
								</ShowcaseCell>
							))}
						</div>
					</ForceOpenProvider>
				</div>
			</div>
		</div>
	);
}
