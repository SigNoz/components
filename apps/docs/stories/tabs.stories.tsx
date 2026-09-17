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
	type TabsVariantType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type MouseEventHandler, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { allModes } from '../.storybook/modes.js';
import styles from './tabs.stories.module.css';

const meta: Meta<typeof Tabs> = {
	title: 'Composed Components/Tabs',
	component: Tabs,
	argTypes: {
		items: {
			control: false,
			description: 'Array of tab items to render.',
			table: { category: 'Content', type: { summary: 'TabsItemProps[]' } },
		},
		children: {
			control: false,
			description:
				'The one panel shown for whichever tab is active, for items that carry `render` rather than their own `children`. A router `Outlet` in practice.',
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
				'The layout flow of the tab bar and its panels. `vertical` turns the bar into a rail beside the panel, and every side-named prop follows it.',
			table: { category: 'Layout', type: { summary: "'horizontal' | 'vertical'" } },
		},
		alignment: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description:
				'How the tab bar positions itself along its own axis within its container. `start` is the left edge of a horizontal bar and the top edge of a vertical one.',
			table: { category: 'Layout', type: { summary: "'start' | 'center' | 'end'" } },
		},
		defaultValue: {
			control: 'text',
			description:
				'The active item key on the first render. Falls back to the first item when omitted.',
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
			description:
				"Content rendered before the tab list, along the bar's own axis. Keeps its size while the list scrolls.",
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		tabBarEndContent: {
			control: false,
			description:
				"Content rendered after the tab list, along the bar's own axis. Keeps its size while the list scrolls.",
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
			description: 'Additional CSS classes to apply to the root.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID applied to the root. Also names every tab.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
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
 * More tabs than any of the frames below can hold, which is what the overflow examples need. The
 * icons and the disabled tab are kept so the scrolling strip is shown carrying everything a normal
 * bar carries, not a row of bare labels.
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

const alignments: TabsAlignmentType[] = [
	TabsAlignment.Start,
	TabsAlignment.Center,
	TabsAlignment.End,
];

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
 * A frame with its start and end edges drawn, so an alignment that moves the bar inside its
 * container is visible rather than implied. Horizontally that means constraining the width; a
 * vertical rail only has room to move, or to overflow, once its height is constrained instead.
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
 * Every state the bar has, rendered at one orientation. The two showcase stories are this component
 * and nothing else, so a rule that holds on one axis is shown holding on the other rather than
 * being claimed to.
 */
function TabsShowcase({ orientation }: { orientation: TabsOrientationType }): ReactElement {
	return (
		// Freezing is the toolbar's live/still toggle, never a class baked into a story. The
		// bar's one animation, `tabs-dot-in`, is an entry, so pausing it holds the selected
		// tab's dot at `scale(0.2)` and `opacity: 0` and the mark disappears. Worth knowing
		// before reaching for `still` here.
		<div className={`story-section ${styles.sectionGap}`}>
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
						label="Primary, --tabs-bar-content-start-order / --tabs-bar-content-end-order: 2"
						variant="primary"
						orientation={orientation}
						alignment="start"
						className={styles.contentNearList}
						tabBarStartContent={filterButton}
						tabBarEndContent={addViewButton}
					/>
					<LabelledTabs
						label="Secondary, --tabs-bar-content-start-order / --tabs-bar-content-end-order: 2"
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
						label="Primary, --tabs-extra-content-end-flex-grow: 1 with --tabs-border-spacer-grow-flex-grow: 0"
						variant="primary"
						orientation={orientation}
						alignment="start"
						className={styles.contentGrows}
						tabBarEndContent={addViewButton}
					/>
					<LabelledTabs
						label="Secondary, same two vars"
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

			{/*
			 * There is no prop for any of this. A strip too long for its frame scrolls, and the two
			 * arrows appear at its ends; every tab stays a real tab, so the arrow keys still reach all
			 * of them. The third example is the one worth reading: the bar content keeps its size and it
			 * is the strip that gives way, rather than the button being pushed off the end.
			 */}
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
 * Stands in for the router: real tabs read `value` off `useLocation()` and never need `onChange`,
 * but Storybook has no router, so the hash the anchors navigate to is mirrored into state here.
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

export const HorizontalShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => <TabsShowcase orientation="horizontal" />,
};

export const VerticalShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => <TabsShowcase orientation="vertical" />,
};

/**
 * Tabs that navigate. Each item carries `render` instead of `children`, so the tab is a real
 * anchor: middle click, "open in new tab" and the URL in the status bar all work. The panel is the
 * bar's own children, and a disabled item falls back to a `<button>` that cannot be followed.
 */
export const Navigation: Story = {
	render: () => <RoutedTabs />,
	parameters: {
		layout: 'padded',
	},
};
