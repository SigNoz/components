import {
	CircleAlert,
	Clock,
	Component,
	History,
	LayoutGrid,
	List,
	Lock,
	Plus,
	Settings,
	Settings2,
	ShieldAlert,
} from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonVariant,
	type TabItemProps,
	Tabs,
	type TabsAlignment,
	TabsList,
	TabsRoot,
	TabsTrigger,
	type TabVariants,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';
import styles from './tabs.stories.module.css';

const meta: Meta<typeof Tabs> = {
	title: 'Composed Components/TabsSimple',
	component: Tabs,
	argTypes: {
		items: {
			control: false,
			description: 'Array of tab items to render.',
			table: { category: 'Content', type: { summary: 'TabItemProps[]' } },
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary'],
			description: 'The visual style variant of the tabs.',
			table: {
				category: 'Appearance',
				type: { summary: "'primary' | 'secondary'" },
				defaultValue: { summary: "'primary'" },
			},
		},
		defaultValue: {
			control: 'text',
			description:
				'The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description:
				'The controlled value of the tab to activate. Should be used in conjunction with onChange.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		onChange: {
			control: false,
			description: 'Event handler called when the active tab changes.',
			table: { category: 'Events', type: { summary: '(key: string) => void' } },
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the tabs.',
			table: { category: 'Layout', type: { summary: "'horizontal' | 'vertical'" } },
		},
		dir: {
			control: 'select',
			options: ['ltr', 'rtl'],
			description: 'The direction of navigation when using keyboard.',
			table: { category: 'Behavior', type: { summary: "'ltr' | 'rtl'" } },
		},
		activationMode: {
			control: 'select',
			options: ['automatic', 'manual'],
			description:
				'When automatic, tabs are activated when receiving focus. When manual, tabs are activated when clicked.',
			table: {
				category: 'Behavior',
				type: { summary: "'automatic' | 'manual'" },
				defaultValue: { summary: "'automatic'" },
			},
		},
		alignment: {
			control: 'select',
			options: ['left', 'center', 'right'],
			description: 'Controls the alignment of the tab list within its container.',
			table: {
				category: 'Layout',
				type: { summary: "'left' | 'center' | 'right'" },
				defaultValue: { summary: "'left'" },
			},
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the tabs.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the tabs root.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		tabBarLeftContent: {
			control: false,
			description: 'Content rendered to the left of the tab list, in the same horizontal row.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		tabBarRightContent: {
			control: false,
			description: 'Content rendered to the right of the tab list, in the same horizontal row.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID applied to the tabs root element.',
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

const playgroundItems: (TabItemProps & { variant?: TabVariants })[] = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{
		key: 'issues',
		label: 'Issues (Disabled)',
		children: 'Issues content panel',
		disabled: true,
		disabledReason: 'Issues are temporarily unavailable',
		prefixIcon: <CircleAlert className="icon-md" />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content panel',
		suffixIcon: <History className="icon-md" />,
	},
	{
		key: 'another',
		label: 'Another Tab',
		children: 'Another content panel',
	},
	{
		key: 'all-endpoints',
		label: 'All Endpoints',
		children: 'Endpoints list panel',
		variant: 'secondary',
	},
	{
		key: 'details',
		label: 'Endpoint Details',
		children: 'Details content panel',
		variant: 'secondary',
	},
	{
		key: 'settings',
		label: 'Settings',
		children: 'Settings content panel',
		variant: 'secondary',
		prefixIcon: <Settings className="icon-md" />,
		disabled: true,
		disabledReason: 'You need admin privileges to access settings',
	},
];

const defaultItems: TabItemProps[] = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 className="icon-md" />,
	},
	{
		key: 'issues',
		label: 'Issues (Disabled)',
		children: 'Issues content panel',
		disabled: true,
		disabledReason: 'Issues are temporarily unavailable',
		prefixIcon: <CircleAlert className="icon-md" />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content panel',
		suffixIcon: <History className="icon-md" />,
	},
	{
		key: 'another',
		label: 'Another Tab',
		children: 'Another content panel',
	},
];

export const Default: Story = {
	args: {
		items: defaultItems,
		variant: 'primary',
		defaultValue: 'overview',
	},
	render: (args) => <Tabs {...args} items={args.items} />,
};

export const AllVariants: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionGap}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Primary Variant
				</Typography>
				<Tabs
					items={playgroundItems.filter((i) => i.variant !== 'secondary')}
					variant="primary"
					defaultValue="overview"
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Secondary Variant
				</Typography>
				<Tabs
					items={playgroundItems
						.filter((i) => i.variant === 'secondary')
						.map((i) => ({ ...i, variant: undefined }))}
					variant="secondary"
					defaultValue="all-endpoints"
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					With Icons
				</Typography>
				<Tabs
					items={[
						{
							key: 'apps',
							label: 'Applications',
							children: 'Applications list',
							prefixIcon: <LayoutGrid className="icon-md" />,
							suffixIcon: <List className="icon-md" />,
						},
						{
							key: 'modules',
							label: 'Modules',
							children: 'Modules content',
							prefixIcon: <Component className="icon-md" />,
						},
					]}
					variant="primary"
					defaultValue="apps"
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Dashboard Navigation
				</Typography>
				<Tabs
					items={[
						{
							key: 'overview',
							label: 'Overview',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Overview
									</Typography>
								</div>
							),
						},
						{
							key: 'integrations',
							label: 'Integrations',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Integrations
									</Typography>
								</div>
							),
						},
						{
							key: 'activity',
							label: 'Activity',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Activity
									</Typography>
								</div>
							),
						},
						{
							key: 'domains',
							label: 'Domains',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Domains
									</Typography>
								</div>
							),
						},
						{
							key: 'usage',
							label: 'Usage',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Usage
									</Typography>
								</div>
							),
						},
						{
							key: 'monitoring',
							label: 'Monitoring',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Monitoring
									</Typography>
								</div>
							),
						},
						{
							key: 'observability',
							label: 'Observability',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Observability
									</Typography>
								</div>
							),
						},
						{
							key: 'storage',
							label: 'Storage',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Storage
									</Typography>
								</div>
							),
						},
						{
							key: 'ai',
							label: 'AI',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										AI
									</Typography>
								</div>
							),
						},
						{
							key: 'support',
							label: 'Support',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Support
									</Typography>
								</div>
							),
						},
						{
							key: 'settings',
							label: 'Settings',
							children: (
								<div className={styles.contentPanel}>
									<Typography size="2xl" weight="semibold">
										Settings
									</Typography>
								</div>
							),
						},
					]}
					variant="primary"
					defaultValue="observability"
				/>
			</div>
		</div>
	),
};

const primaryItems = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content',
		prefixIcon: <Settings className="icon-md" />,
	},
	{
		key: 'issues',
		label: 'Issues',
		children: 'Issues content',
		disabled: true,
		disabledReason: 'Issues feature is currently under maintenance',
		prefixIcon: <CircleAlert className="icon-md" />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content',
		suffixIcon: <History className="icon-md" />,
	},
];

const secondaryItems = [
	{ key: 'all', label: 'All Endpoints', children: 'All endpoints content' },
	{
		key: 'details',
		label: 'Endpoint Details',
		children: 'Endpoint details content',
	},
	{
		key: 'advanced',
		label: 'Advanced Settings',
		children: 'Advanced settings content',
		disabled: true,
		disabledReason: 'Requires premium subscription',
	},
];

export const Primary: Story = {
	args: {
		items: primaryItems,
		variant: 'primary',
		defaultValue: 'overview',
	},
};

export const Secondary: Story = {
	args: {
		items: secondaryItems,
		variant: 'secondary',
		defaultValue: 'all',
	},
};

export const TabBarExtraContent: Story = {
	render: () => (
		<div className={styles.extraContentContainer}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Primary — right-only (Add view button)
				</Typography>
				<Tabs
					items={primaryItems}
					variant="primary"
					defaultValue="overview"
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Plus className="icon-md" />}
						>
							Add view
						</Button>
					}
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Primary — both left and right content
				</Typography>
				<Tabs
					items={primaryItems}
					variant="primary"
					defaultValue="overview"
					tabBarLeftContent={
						<Typography size="xs" color="muted">
							Service: frontend
						</Typography>
					}
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Settings className="icon-md" />}
						>
							Configure
						</Button>
					}
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Secondary — right-only
				</Typography>
				<Tabs
					items={secondaryItems}
					variant="secondary"
					defaultValue="all"
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Plus className="icon-md" />}
						>
							New endpoint
						</Button>
					}
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Secondary — left and right content
				</Typography>
				<Tabs
					items={secondaryItems}
					variant="secondary"
					defaultValue="all"
					tabBarLeftContent={
						<Typography size="xs" color="muted">
							v2 API
						</Typography>
					}
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Plus className="icon-md" />}
						>
							New endpoint
						</Button>
					}
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Primitive TabsList — rightContent prop directly
				</Typography>
				<TabsRoot defaultValue="tab1">
					<TabsList
						variant="primary"
						rightContent={
							<Button
								variant={ButtonVariant.Outlined}
								size={ButtonSize.SM}
								color={ButtonColor.Secondary}
								prefix={<Plus className="icon-md" />}
							>
								Add
							</Button>
						}
					>
						<TabsTrigger value="tab1">Tab One</TabsTrigger>
						<TabsTrigger value="tab2">Tab Two</TabsTrigger>
						<TabsTrigger value="tab3">Tab Three</TabsTrigger>
					</TabsList>
				</TabsRoot>
			</div>
		</div>
	),
};

const alignmentItems: TabItemProps[] = [
	{ key: 'overview', label: 'Overview', children: 'Overview content' },
	{ key: 'analytics', label: 'Analytics', children: 'Analytics content' },
	{ key: 'settings', label: 'Settings', children: 'Settings content' },
];

const leftExtra = (
	<Typography size="xs" color="muted">
		v2 API
	</Typography>
);
const rightExtra = (
	<Button
		variant={ButtonVariant.Outlined}
		size={ButtonSize.SM}
		color={ButtonColor.Secondary}
		prefix={<Plus className="icon-md" />}
	>
		Add view
	</Button>
);

type ExtraVariant = 'empty' | 'left' | 'right' | 'both';

const extraConfigs: Record<
	ExtraVariant,
	{ label: string; tabBarLeftContent?: React.ReactNode; tabBarRightContent?: React.ReactNode }
> = {
	empty: { label: 'No extra content' },
	left: { label: 'Left content only', tabBarLeftContent: leftExtra },
	right: { label: 'Right content only', tabBarRightContent: rightExtra },
	both: {
		label: 'Left + right content',
		tabBarLeftContent: leftExtra,
		tabBarRightContent: rightExtra,
	},
};

export const Alignment: Story = {
	render: () => (
		<div className={styles.alignmentContainer}>
			{(['primary', 'secondary'] as TabVariants[]).map((variant) => (
				<section key={variant}>
					<Typography size="xl" weight="bold" className={styles.variantSection}>
						{variant} variant
					</Typography>
					{(['left', 'center', 'right'] as TabsAlignment[]).map((alignment) => (
						<div key={alignment} className={styles.alignmentSection}>
							<Typography size="base" weight="semibold" className={styles.alignmentTitle}>
								{alignment} alignment
							</Typography>
							<div className={styles.extraVariantsContainer}>
								{(Object.keys(extraConfigs) as ExtraVariant[]).map((extraVariant) => {
									const { label, tabBarLeftContent, tabBarRightContent } =
										extraConfigs[extraVariant];
									return (
										<div key={extraVariant}>
											<Typography size="xs" color="muted" className={styles.extraVariantLabel}>
												{label}
											</Typography>
											<Tabs
												items={alignmentItems}
												variant={variant}
												alignment={alignment}
												defaultValue="overview"
												tabBarLeftContent={tabBarLeftContent}
												tabBarRightContent={tabBarRightContent}
											/>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</section>
			))}
		</div>
	),
};

export const DisabledStates: Story = {
	render: () => (
		<div className={`story-section ${styles.sectionGap}`}>
			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Disabled Tabs with Custom Reasons
				</Typography>
				<Tabs
					items={[
						{
							key: 'active',
							label: 'Active Tab',
							children: 'This tab is active and can be clicked',
						},
						{
							key: 'locked',
							label: 'Locked',
							children: 'Locked content',
							disabled: true,
							disabledReason: 'This feature is locked',
							prefixIcon: <Lock className="icon-md" />,
						},
						{
							key: 'maintenance',
							label: 'Under Maintenance',
							children: 'Maintenance content',
							disabled: true,
							disabledReason: 'This section is under maintenance',
							prefixIcon: <Clock className="icon-md" />,
						},
						{
							key: 'permissions',
							label: 'Insufficient Permissions',
							children: 'Permissions content',
							disabled: true,
							disabledReason: 'You do not have permission to access this area',
							prefixIcon: <ShieldAlert className="icon-md" />,
						},
						{
							key: 'default',
							label: 'Default Disabled',
							children: 'Default disabled content',
							disabled: true,
							// No disabledReason provided, will show default message
						},
					]}
					variant="primary"
					defaultValue="active"
				/>
			</div>

			<div>
				<Typography size="lg" weight="semibold" className={styles.sectionTitle}>
					Secondary Variant Disabled States
				</Typography>
				<Tabs
					items={[
						{
							key: 'active',
							label: 'Active Tab',
							children: 'This tab is active and can be clicked',
						},
						{
							key: 'premium',
							label: 'Premium Features',
							children: 'Premium content',
							disabled: true,
							disabledReason: 'Available only in premium tier',
						},
						{
							key: 'beta',
							label: 'Beta Features',
							children: 'Beta content',
							disabled: true,
							disabledReason: 'Coming soon - currently in beta testing',
						},
					]}
					variant="secondary"
					defaultValue="active"
				/>
			</div>
		</div>
	),
};

/**
 * Visual-regression anchor for prefix/suffix icon alignment.
 *
 * Icons passed via `prefixIcon` / `suffixIcon` are wrapped in a `.tabs__icon`
 * element. This story isolates that wrapper so Chromatic captures the icon
 * staying vertically centered against the label (rather than sitting on the
 * text baseline). Includes prefix-only, suffix-only, and both-icon triggers.
 */
export const IconAlignment: Story = {
	args: {
		variant: 'primary',
		defaultValue: 'prefix',
		items: [
			{
				key: 'prefix',
				label: 'Prefix Icon',
				children: 'Tab with a leading icon',
				prefixIcon: <Settings2 className="icon-md" />,
			},
			{
				key: 'suffix',
				label: 'Suffix Icon',
				children: 'Tab with a trailing icon',
				suffixIcon: <History className="icon-md" />,
			},
			{
				key: 'both',
				label: 'Both Icons',
				children: 'Tab with leading and trailing icons',
				prefixIcon: <LayoutGrid className="icon-md" />,
				suffixIcon: <Component className="icon-md" />,
			},
		],
	},
};
