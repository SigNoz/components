import { CircleAlert, Filter, History, Plus, Settings2 } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonVariant,
	Tabs,
	TabsAlignment,
	type TabsAlignmentType,
	type TabsItemProps,
	TabsOrientation,
	type TabsOrientationType,
	TabsVariant,
	type TabsVariantType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type MouseEventHandler, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { allModes } from '../.storybook/modes.js';
import styles from './tabs.stories.module.css';

const meta: Meta<typeof Tabs> = {
	title: 'Composed Components/Tabs',
	component: Tabs,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A tab bar and its panels, built from an `items` array. Horizontal or a vertical rail, and it scrolls once it holds more tabs than it has room for.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-744&p=f&m=dev',
		},
	},
	argTypes: {
		items: {
			control: false,
			description: 'Array of tab items to render.',
			table: { category: 'Content', type: { summary: 'TabsItemProps[]' } },
		},
		children: {
			control: false,
			description:
				'The one panel shown for whichever tab is active, for items that carry `render`. A router `Outlet` in practice.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary'],
			description: 'The visual style of the tab bar.',
			table: { category: 'Appearance', type: { summary: "'primary' | 'secondary'" } },
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description:
				'`vertical` turns the bar into a rail beside the panel, and every side-named prop follows it.',
			table: { category: 'Layout', type: { summary: "'horizontal' | 'vertical'" } },
		},
		alignment: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description:
				"Where the tab list sits along the bar's own axis. `start` is the left edge horizontally, the top edge vertically.",
			table: { category: 'Layout', type: { summary: "'start' | 'center' | 'end'" } },
		},
		defaultValue: {
			control: 'text',
			description: 'The active item key on the first render. Falls back to the first item.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description: 'The controlled active item key. Use with onChange.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		onChange: {
			control: false,
			description: 'Called with the newly active item key.',
			table: { category: 'Events', type: { summary: '(key: string) => void' } },
		},
		tabBarStartContent: {
			control: false,
			description: 'Rendered before the tab list. Keeps its size while the list scrolls.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		tabBarEndContent: {
			control: false,
			description: 'Rendered after the tab list. Keeps its size while the list scrolls.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		noTabContentPadding: {
			control: 'boolean',
			description: 'Removes the padding around the active panel.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the tab bar.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for the root.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the root as `data-testid`. Also names every tab.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const defaultItems: TabsItemProps[] = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{
		key: 'issues',
		label: 'Issues',
		children: 'Issues content panel',
		disabled: true,
		disabledTooltip: 'Issues are temporarily unavailable',
		prefixIcon: <CircleAlert className="icon-md" />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content panel',
		suffixIcon: <History className="icon-md" />,
	},
];

/**
 * More tabs than any frame below can hold. Icons and a disabled tab are kept, so the scrolling
 * strip carries what a real bar carries.
 */
const manyItems: TabsItemProps[] = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{ key: 'logs', label: 'Logs', children: 'Logs content panel' },
	{ key: 'traces', label: 'Traces', children: 'Traces content panel' },
	{ key: 'metrics', label: 'Metrics', children: 'Metrics content panel' },
	{ key: 'alerts', label: 'Alerts', children: 'Alerts content panel' },
	{ key: 'dashboards', label: 'Dashboards', children: 'Dashboards content panel' },
	{
		key: 'exceptions',
		label: 'Exceptions',
		children: 'Exceptions content panel',
		prefixIcon: <CircleAlert className="icon-md" />,
	},
	{ key: 'service-map', label: 'Service map', children: 'Service map content panel' },
	{ key: 'integrations', label: 'Integrations', children: 'Integrations content panel' },
	{ key: 'api-keys', label: 'API keys', children: 'API keys content panel' },
	{
		key: 'billing',
		label: 'Billing',
		children: 'Billing content panel',
		disabled: true,
		disabledTooltip: 'Ask an admin for access',
	},
	{
		key: 'settings',
		label: 'Settings',
		children: 'Settings content panel',
		suffixIcon: <History className="icon-md" />,
	},
];

/** Labels past the 120px cap, so the truncation and its tooltip are shown rather than described. */
const longLabelItems: TabsItemProps[] = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{
		key: 'deployments',
		label: 'kubernetes-deployment-production-east-us-2',
		children: 'Deployments content panel',
	},
	{
		key: 'exceptions',
		label: 'Unhandled exceptions by service',
		children: 'Exceptions content panel',
		suffixIcon: <History className="icon-md" />,
	},
];

const alignments: TabsAlignmentType[] = [
	TabsAlignment.Start,
	TabsAlignment.Center,
	TabsAlignment.End,
];

const variants: TabsVariantType[] = [TabsVariant.Primary, TabsVariant.Secondary];

/**
 * The columns of the state matrix. `hover` and `focus` cannot be reached by a snapshot on their
 * own, `storybook-addon-pseudo-states` forces them through the `[data-state-cell]` selectors in
 * the showcase parameters. `disabled` is an item prop, so it needs no pseudo.
 */
const states = ['default', 'hover', 'focus', 'disabled'] as const;

type State = (typeof states)[number];

/**
 * Two tabs per cell, one active and one not, because half the trigger rules only apply to one of
 * the two: secondary tints on hover only while the tab is inactive. No item carries `children`, so
 * the cell is the bar alone, which is what the matrix is about.
 */
const stateItems: TabsItemProps[] = [
	{
		key: 'active',
		label: 'Active',
		children: undefined,
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{ key: 'idle', label: 'Idle', children: undefined, suffixIcon: <History className="icon-md" /> },
];

const disabledStateItems: TabsItemProps[] = [
	{
		key: 'active',
		label: 'Active',
		children: undefined,
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{
		key: 'idle',
		label: 'Idle',
		children: undefined,
		disabled: true,
		disabledTooltip: 'Ask an admin for access',
	},
];

function MatrixHeader({ columns }: { columns: string[] }): ReactElement {
	return (
		<>
			<span />
			{columns.map((column) => (
				<Typography key={column} size="sm" weight="medium" className={styles.matrixLabel}>
					{column}
				</Typography>
			))}
		</>
	);
}

function matrixStyle(columns: number): CSSProperties {
	return { '--matrix-columns': columns } as CSSProperties;
}

/**
 * One bar per variant in a single state. The wrapper is what the pseudo selectors match, so every
 * tab in the cell carries the state at once.
 */
function StateCell({
	variant,
	orientation,
	state,
}: {
	variant: TabsVariantType;
	orientation: TabsOrientationType;
	state: State;
}): ReactElement {
	return (
		<div data-state-cell={state}>
			<Tabs
				items={state === 'disabled' ? disabledStateItems : stateItems}
				variant={variant}
				orientation={orientation}
				alignment="start"
				defaultValue="active"
			/>
		</div>
	);
}

function StateMatrix({ orientation }: { orientation: TabsOrientationType }): ReactElement {
	return (
		<div className={styles.matrix} style={matrixStyle(states.length)}>
			<MatrixHeader columns={[...states]} />
			{variants.map((variant) => (
				<Fragment key={variant}>
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						{variant}
					</Typography>
					{states.map((state) => (
						<StateCell key={state} variant={variant} orientation={orientation} state={state} />
					))}
				</Fragment>
			))}
		</div>
	);
}

const filterButton = (
	<Button
		variant={ButtonVariant.Outlined}
		size={ButtonSize.SM}
		color={ButtonColor.Secondary}
		prefix={<Filter className="icon-md" />}
	>
		Filter
	</Button>
);

const addViewButton = (
	<Button
		variant={ButtonVariant.Outlined}
		size={ButtonSize.SM}
		color={ButtonColor.Secondary}
		prefix={<Plus className="icon-md" />}
	>
		Add view
	</Button>
);

function isVertical(orientation: TabsOrientationType): boolean {
	return orientation === TabsOrientation.Vertical;
}

/**
 * A frame with its start and end edges drawn, so the bar moving inside its container is visible.
 * Horizontal constrains the width, vertical the height.
 */
function AxisFrame({
	orientation,
	overflow = false,
	children,
}: {
	orientation: TabsOrientationType;
	overflow?: boolean;
	children: ReactNode;
}): ReactElement {
	const base = isVertical(orientation) ? styles.heightFrame : styles.widthFrame;

	return <div className={overflow ? `${base} ${styles.overflowFrame}` : base}>{children}</div>;
}

function LabelledTabs({
	label,
	variant,
	orientation,
	alignment,
	className,
	items = defaultItems,
	overflow = false,
	tabBarStartContent,
	tabBarEndContent,
}: {
	label: string;
	variant: TabsVariantType;
	orientation: TabsOrientationType;
	alignment: TabsAlignmentType;
	className?: string;
	items?: TabsItemProps[];
	overflow?: boolean;
	tabBarStartContent?: ReactNode;
	tabBarEndContent?: ReactNode;
}): ReactElement {
	return (
		<div>
			<Typography size="sm" weight="medium" className={styles.exampleLabel}>
				{label}
			</Typography>
			<AxisFrame orientation={orientation} overflow={overflow}>
				<Tabs
					items={items}
					variant={variant}
					orientation={orientation}
					alignment={alignment}
					defaultValue={items[0]?.key}
					className={className}
					tabBarStartContent={tabBarStartContent}
					tabBarEndContent={tabBarEndContent}
				/>
			</AxisFrame>
		</div>
	);
}

function AlignmentGroup({
	title,
	variant,
	orientation,
	tabBarStartContent,
	tabBarEndContent,
}: {
	title: string;
	variant: TabsVariantType;
	orientation: TabsOrientationType;
	tabBarStartContent?: ReactNode;
	tabBarEndContent?: ReactNode;
}): ReactElement {
	return (
		<div>
			<Typography size="base" weight="medium" className={styles.subsectionTitle}>
				{title}
			</Typography>
			<div className={styles.exampleStack}>
				{alignments.map((alignment) => (
					<LabelledTabs
						key={alignment}
						label={`alignment="${alignment}"`}
						variant={variant}
						orientation={orientation}
						alignment={alignment}
						tabBarStartContent={tabBarStartContent}
						tabBarEndContent={tabBarEndContent}
					/>
				))}
			</div>
		</div>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }): ReactElement {
	return (
		<div>
			<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
				{title}
			</Typography>
			{children}
		</div>
	);
}

/**
 * Every state the bar has, at one orientation. Both showcase stories render this and nothing else,
 * so a rule that holds on one axis is shown holding on the other.
 */
function TabsShowcase({ orientation }: { orientation: TabsOrientationType }): ReactElement {
	return (
		// Freezing is the toolbar's live/still toggle, never a class baked into a story.
		<div className={`story-section ${styles.sectionGap}`}>
			<Section title="States">
				<Typography size="sm" display="block" className={styles.sectionNote}>
					One row per variant, one column per state. Both tabs in a cell are forced together, so
					each state is shown on the active tab and an inactive one at once. Primary's hover slider
					tracks a real pointer, so a forced hover paints the trigger's own background and nothing
					slides.
				</Typography>
				<StateMatrix orientation={orientation} />
			</Section>

			<Section title="Primary">
				<AxisFrame orientation={orientation}>
					<Tabs
						items={defaultItems}
						variant="primary"
						orientation={orientation}
						alignment="start"
						defaultValue="overview"
					/>
				</AxisFrame>
			</Section>

			<Section title="Secondary">
				<AxisFrame orientation={orientation}>
					<Tabs
						items={defaultItems}
						variant="secondary"
						orientation={orientation}
						alignment="start"
						defaultValue="overview"
					/>
				</AxisFrame>
			</Section>

			<Section title="No content padding">
				<AxisFrame orientation={orientation}>
					<Tabs
						items={defaultItems}
						variant="primary"
						orientation={orientation}
						alignment="start"
						defaultValue="overview"
						noTabContentPadding
					/>
				</AxisFrame>
			</Section>

			<Section title="Alignment">
				<div className={styles.exampleStack}>
					<AlignmentGroup title="Primary" variant="primary" orientation={orientation} />
					<AlignmentGroup title="Secondary" variant="secondary" orientation={orientation} />
				</div>
			</Section>

			<Section title="Start content, every alignment">
				<div className={styles.exampleStack}>
					<AlignmentGroup
						title="Primary"
						variant="primary"
						orientation={orientation}
						tabBarStartContent={filterButton}
					/>
					<AlignmentGroup
						title="Secondary"
						variant="secondary"
						orientation={orientation}
						tabBarStartContent={filterButton}
					/>
				</div>
			</Section>

			<Section title="End content, every alignment">
				<div className={styles.exampleStack}>
					<AlignmentGroup
						title="Primary"
						variant="primary"
						orientation={orientation}
						tabBarEndContent={addViewButton}
					/>
					<AlignmentGroup
						title="Secondary"
						variant="secondary"
						orientation={orientation}
						tabBarEndContent={addViewButton}
					/>
				</div>
			</Section>

			<Section title="Content beside the list">
				<div className={styles.exampleStack}>
					<LabelledTabs
						label="Primary, default: content on the bar's edges"
						variant="primary"
						orientation={orientation}
						alignment="start"
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
					<LabelledTabs
						label="Primary, both bar-content order vars: 2"
						variant="primary"
						orientation={orientation}
						alignment="start"
						className={styles.contentNearList}
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
					<LabelledTabs
						label="Secondary, both bar-content order vars: 2"
						variant="secondary"
						orientation={orientation}
						alignment="start"
						className={styles.contentNearList}
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
				</div>
			</Section>

			<Section title="Content that takes the free space">
				<div className={styles.exampleStack}>
					<LabelledTabs
						label="Primary, --tabs-extra-content-end-flex-grow: 1, spacer grow: 0"
						variant="primary"
						orientation={orientation}
						alignment="start"
						className={styles.contentGrows}
						tabBarEndContent={addViewButton}
					/>
					<LabelledTabs
						label="Secondary, the same two vars"
						variant="secondary"
						orientation={orientation}
						alignment="start"
						className={styles.contentGrows}
						tabBarEndContent={addViewButton}
					/>
				</div>
			</Section>

			<Section title="Start and end content, every alignment">
				<div className={styles.exampleStack}>
					<AlignmentGroup
						title="Primary"
						variant="primary"
						orientation={orientation}
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
					<AlignmentGroup
						title="Secondary"
						variant="secondary"
						orientation={orientation}
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
				</div>
			</Section>

			{/* No prop drives any of this. The third example is the one to read: the bar content
			    keeps its size and the strip is what gives way. */}
			<Section title="Label width">
				<div className={styles.exampleStack}>
					<LabelledTabs
						label="Primary, default cap of 120px"
						variant="primary"
						orientation={orientation}
						alignment="start"
						items={longLabelItems}
					/>
					<LabelledTabs
						label="Primary, --tabs-label-max-inline-size: 240px"
						variant="primary"
						orientation={orientation}
						alignment="start"
						items={longLabelItems}
						className={styles.wideLabels}
					/>
					<LabelledTabs
						label="Secondary, default cap of 120px"
						variant="secondary"
						orientation={orientation}
						alignment="start"
						items={longLabelItems}
					/>
				</div>
			</Section>

			<Section title="Overflow">
				<div className={styles.exampleStack}>
					<LabelledTabs
						label="Primary, more tabs than the frame holds"
						variant="primary"
						orientation={orientation}
						alignment="start"
						items={manyItems}
						overflow
					/>
					<LabelledTabs
						label="Secondary, more tabs than the frame holds"
						variant="secondary"
						orientation={orientation}
						alignment="start"
						items={manyItems}
						overflow
					/>
					<LabelledTabs
						label="Primary, overflowing with start and end content"
						variant="primary"
						orientation={orientation}
						alignment="start"
						items={manyItems}
						overflow
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
				</div>
			</Section>
		</div>
	);
}

/**
 * Stands in for the router. Real tabs read `value` off `useLocation()` and need no `onChange`, but
 * Storybook has no router, so the hash is mirrored into state here.
 */
function RoutedTabs(): ReactElement {
	const [route, setRoute] = useState('overview');
	const avoidNavigateOnClick: MouseEventHandler = (e) => e.preventDefault();

	return (
		<Tabs
			variant="primary"
			orientation="horizontal"
			alignment="start"
			value={route}
			onChange={setRoute}
			items={[
				{
					key: 'overview',
					label: 'Overview',
					render: <a href="#overview" onClick={avoidNavigateOnClick} aria-label="overview" />,
				},
				{
					key: 'logs',
					label: 'Logs',
					render: <a href="#logs" onClick={avoidNavigateOnClick} aria-label="logs" />,
				},
				{
					key: 'billing',
					label: 'Billing',
					render: <a href="#billing" onClick={avoidNavigateOnClick} aria-label="billing" />,
					disabled: true,
					disabledTooltip: 'Ask an admin for access',
				},
			]}
		>
			<Typography size="base">
				{`Routed content for /${route}. In an app this is a single <Outlet />.`}
			</Typography>
		</Tabs>
	);
}

export const Default: Story = {
	args: {
		items: defaultItems,
		variant: 'primary',
		orientation: 'horizontal',
		alignment: 'start',
		defaultValue: 'overview',
	},
};

/**
 * Shared by both showcases, so a state forced on one axis is forced on the other.
 */
const showcaseParameters = {
	chromatic: { disableSnapshot: false, modes: allModes },
	pseudo: {
		hover: '[data-state-cell="hover"] [data-slot="tabs-item"]',
		focusVisible: '[data-state-cell="focus"] [data-slot="tabs-item"]',
	},
};

export const HorizontalShowcase: Story = {
	parameters: showcaseParameters,
	render: () => <TabsShowcase orientation="horizontal" />,
};

export const VerticalShowcase: Story = {
	parameters: showcaseParameters,
	render: () => <TabsShowcase orientation="vertical" />,
};

/**
 * Each item carries `render` instead of `children`, so the tab is a real anchor: middle click and
 * "open in new tab" work. The panel is the bar's own children, and a disabled item falls back to a
 * `<button>` that cannot be followed.
 */
export const Navigation: Story = {
	render: () => <RoutedTabs />,
	parameters: {
		layout: 'padded',
	},
};
