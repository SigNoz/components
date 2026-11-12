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
import { selectArgTypes } from './shared/select-arg-types.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Select> = {
	title: 'Composed Components/Select',
	component: Select,
	argTypes: selectArgTypes,
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
			<Typography
				as="span"
				variant="label"
				size="small"
				weight="regular"
				color="secondary"
				textOverflow="visible"
			>
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
			<Typography
				as="p"
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				as="p"
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				textOverflow="wrap"
			>
				{note}
			</Typography>
			{children}
		</div>
	);
}

function TriggerRowView({ id, label, note, props, pseudo }: TriggerRow): ReactElement {
	return (
		<>
			<Typography
				as="span"
				variant="label"
				size="small"
				weight="medium"
				color="inherit"
				textOverflow="visible"
			>
				{label}
			</Typography>
			<div data-pseudo={pseudo}>
				<Select aria-label={label} {...props} testId={id} />
			</div>
			<Typography
				as="p"
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				textOverflow="wrap"
			>
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
					<Typography
						as="p"
						variant="paragraph"
						size="base"
						weight="bold"
						color="inherit"
						textOverflow="wrap"
					>
						Trigger
					</Typography>
					<Typography
						as="p"
						variant="paragraph"
						size="small"
						weight="regular"
						color="inherit"
						textOverflow="wrap"
					>
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
					<Typography
						as="p"
						variant="paragraph"
						size="base"
						weight="bold"
						color="inherit"
						textOverflow="wrap"
					>
						Popup
					</Typography>
					<Typography
						as="p"
						variant="paragraph"
						size="small"
						weight="regular"
						color="inherit"
						textOverflow="wrap"
					>
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
