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
	type TabsVariantType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
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
		variant: {
			control: 'select',
			options: ['primary', 'secondary'],
			description: 'The visual style of the tab bar.',
			table: { category: 'Appearance', type: { summary: "'primary' | 'secondary'" } },
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The layout flow of the tab bar and its panels.',
			table: { category: 'Layout', type: { summary: "'horizontal' | 'vertical'" } },
		},
		alignment: {
			control: 'select',
			options: ['left', 'center', 'right'],
			description: 'How the tab bar positions itself within its container.',
			table: { category: 'Layout', type: { summary: "'left' | 'center' | 'right'" } },
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
		tabBarLeftContent: {
			control: false,
			description: 'Content rendered to the left of the tab list, in the same row.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		tabBarRightContent: {
			control: false,
			description: 'Content rendered to the right of the tab list, in the same row.',
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

const alignments: TabsAlignmentType[] = [
	TabsAlignment.Left,
	TabsAlignment.Center,
	TabsAlignment.Right,
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

/**
 * Half-page frame with its start and end edges drawn, so an alignment that
 * moves the bar inside its container is visible rather than implied.
 */
function WidthFrame({ children }: { children: ReactNode }): ReactElement {
	return <div className={styles.widthFrame}>{children}</div>;
}

function LabelledTabs({
	label,
	variant,
	alignment,
	className,
	tabBarLeftContent,
	tabBarRightContent,
}: {
	label: string;
	variant: TabsVariantType;
	alignment: TabsAlignmentType;
	className?: string;
	tabBarLeftContent?: ReactNode;
	tabBarRightContent?: ReactNode;
}): ReactElement {
	return (
		<div>
			<Typography size="sm" weight="medium" className={styles.exampleLabel}>
				{label}
			</Typography>
			<WidthFrame>
				<Tabs
					items={defaultItems}
					variant={variant}
					orientation="horizontal"
					alignment={alignment}
					defaultValue="overview"
					className={className}
					tabBarLeftContent={tabBarLeftContent}
					tabBarRightContent={tabBarRightContent}
				/>
			</WidthFrame>
		</div>
	);
}

function AlignmentGroup({
	title,
	variant,
	tabBarLeftContent,
	tabBarRightContent,
}: {
	title: string;
	variant: TabsVariantType;
	tabBarLeftContent?: ReactNode;
	tabBarRightContent?: ReactNode;
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
						alignment={alignment}
						tabBarLeftContent={tabBarLeftContent}
						tabBarRightContent={tabBarRightContent}
					/>
				))}
			</div>
		</div>
	);
}

export const Default: Story = {
	args: {
		items: defaultItems,
		variant: 'primary',
		orientation: 'horizontal',
		alignment: 'left',
		defaultValue: 'overview',
	},
};

export const Showcase: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionGap}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Primary
				</Typography>
				<WidthFrame>
					<Tabs
						items={defaultItems}
						variant="primary"
						orientation="horizontal"
						alignment="left"
						defaultValue="overview"
					/>
				</WidthFrame>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Secondary
				</Typography>
				<WidthFrame>
					<Tabs
						items={defaultItems}
						variant="secondary"
						orientation="horizontal"
						alignment="left"
						defaultValue="overview"
					/>
				</WidthFrame>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					No content padding
				</Typography>
				<WidthFrame>
					<Tabs
						items={defaultItems}
						variant="primary"
						orientation="horizontal"
						alignment="left"
						defaultValue="overview"
						noTabContentPadding
					/>
				</WidthFrame>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Alignment
				</Typography>
				<div className={styles.exampleStack}>
					<AlignmentGroup title="Primary" variant="primary" />
					<AlignmentGroup title="Secondary" variant="secondary" />
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Left content, every alignment
				</Typography>
				<div className={styles.exampleStack}>
					<AlignmentGroup title="Primary" variant="primary" tabBarLeftContent={filterButton} />
					<AlignmentGroup title="Secondary" variant="secondary" tabBarLeftContent={filterButton} />
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Right content, every alignment
				</Typography>
				<div className={styles.exampleStack}>
					<AlignmentGroup title="Primary" variant="primary" tabBarRightContent={addViewButton} />
					<AlignmentGroup
						title="Secondary"
						variant="secondary"
						tabBarRightContent={addViewButton}
					/>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Content beside the list
				</Typography>
				<div className={styles.exampleStack}>
					<LabelledTabs
						label="Primary, default: content on the bar's edges"
						variant="primary"
						alignment="left"
						tabBarLeftContent={filterButton}
						tabBarRightContent={addViewButton}
					/>
					<LabelledTabs
						label="Primary, --tabs-bar-content-left-order / --tabs-bar-content-right-order: 2"
						variant="primary"
						alignment="left"
						className={styles.contentNearList}
						tabBarLeftContent={filterButton}
						tabBarRightContent={addViewButton}
					/>
					<LabelledTabs
						label="Secondary, --tabs-bar-content-left-order / --tabs-bar-content-right-order: 2"
						variant="secondary"
						alignment="left"
						className={styles.contentNearList}
						tabBarLeftContent={filterButton}
						tabBarRightContent={addViewButton}
					/>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Content that takes the free space
				</Typography>
				<div className={styles.exampleStack}>
					<LabelledTabs
						label="Primary, --tabs-extra-content-right-flex-grow: 1 with --tabs-border-spacer-grow-flex-grow: 0"
						variant="primary"
						alignment="left"
						className={styles.contentGrows}
						tabBarRightContent={addViewButton}
					/>
					<LabelledTabs
						label="Secondary, same two vars"
						variant="secondary"
						alignment="left"
						className={styles.contentGrows}
						tabBarRightContent={addViewButton}
					/>
				</div>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Left and right content, every alignment
				</Typography>
				<div className={styles.exampleStack}>
					<AlignmentGroup
						title="Primary"
						variant="primary"
						tabBarLeftContent={filterButton}
						tabBarRightContent={addViewButton}
					/>
					<AlignmentGroup
						title="Secondary"
						variant="secondary"
						tabBarLeftContent={filterButton}
						tabBarRightContent={addViewButton}
					/>
				</div>
			</div>
		</div>
	),
};
