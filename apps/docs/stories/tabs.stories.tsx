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
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';

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
		prefixIcon: <Settings2 size={16} />,
	},
	{
		key: 'issues',
		label: 'Issues (Disabled)',
		children: 'Issues content panel',
		disabled: true,
		disabledReason: 'Issues are temporarily unavailable',
		prefixIcon: <CircleAlert size={16} />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content panel',
		suffixIcon: <History size={16} />,
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
		prefixIcon: <Settings size={16} />,
		disabled: true,
		disabledReason: 'You need admin privileges to access settings',
	},
];

const defaultItems: TabItemProps[] = [
	{
		key: 'overview',
		label: 'Overview',
		children: 'Overview content panel',
		prefixIcon: <Settings2 size={16} />,
	},
	{
		key: 'issues',
		label: 'Issues (Disabled)',
		children: 'Issues content panel',
		disabled: true,
		disabledReason: 'Issues are temporarily unavailable',
		prefixIcon: <CircleAlert size={16} />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content panel',
		suffixIcon: <History size={16} />,
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Primary Variant
				</h2>
				<Tabs
					items={playgroundItems.filter((i) => i.variant !== 'secondary')}
					variant="primary"
					defaultValue="overview"
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Secondary Variant
				</h2>
				<Tabs
					items={playgroundItems
						.filter((i) => i.variant === 'secondary')
						.map((i) => ({ ...i, variant: undefined }))}
					variant="secondary"
					defaultValue="all-endpoints"
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>With Icons</h2>
				<Tabs
					items={[
						{
							key: 'apps',
							label: 'Applications',
							children: 'Applications list',
							prefixIcon: <LayoutGrid size={16} />,
							suffixIcon: <List size={16} />,
						},
						{
							key: 'modules',
							label: 'Modules',
							children: 'Modules content',
							prefixIcon: <Component size={16} />,
						},
					]}
					variant="primary"
					defaultValue="apps"
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Dashboard Navigation
				</h2>
				<Tabs
					items={[
						{
							key: 'overview',
							label: 'Overview',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Overview</h1>
								</div>
							),
						},
						{
							key: 'integrations',
							label: 'Integrations',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Integrations</h1>
								</div>
							),
						},
						{
							key: 'activity',
							label: 'Activity',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Activity</h1>
								</div>
							),
						},
						{
							key: 'domains',
							label: 'Domains',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Domains</h1>
								</div>
							),
						},
						{
							key: 'usage',
							label: 'Usage',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Usage</h1>
								</div>
							),
						},
						{
							key: 'monitoring',
							label: 'Monitoring',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Monitoring</h1>
								</div>
							),
						},
						{
							key: 'observability',
							label: 'Observability',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Observability</h1>
								</div>
							),
						},
						{
							key: 'storage',
							label: 'Storage',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Storage</h1>
								</div>
							),
						},
						{
							key: 'ai',
							label: 'AI',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>AI</h1>
								</div>
							),
						},
						{
							key: 'support',
							label: 'Support',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Support</h1>
								</div>
							),
						},
						{
							key: 'settings',
							label: 'Settings',
							children: (
								<div style={{ paddingTop: '1rem' }}>
									<h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Settings</h1>
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
		prefixIcon: <Settings size={16} />,
	},
	{
		key: 'issues',
		label: 'Issues',
		children: 'Issues content',
		disabled: true,
		disabledReason: 'Issues feature is currently under maintenance',
		prefixIcon: <CircleAlert size={16} />,
	},
	{
		key: 'history',
		label: 'History',
		children: 'History content',
		suffixIcon: <History size={16} />,
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem' }}>
			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Primary — right-only (Add view button)
				</h2>
				<Tabs
					items={primaryItems}
					variant="primary"
					defaultValue="overview"
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Plus size={16} />}
						>
							Add view
						</Button>
					}
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Primary — both left and right content
				</h2>
				<Tabs
					items={primaryItems}
					variant="primary"
					defaultValue="overview"
					tabBarLeftContent={
						<span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Service: frontend</span>
					}
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Settings size={16} />}
						>
							Configure
						</Button>
					}
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Secondary — right-only
				</h2>
				<Tabs
					items={secondaryItems}
					variant="secondary"
					defaultValue="all"
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Plus size={16} />}
						>
							New endpoint
						</Button>
					}
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Secondary — left and right content
				</h2>
				<Tabs
					items={secondaryItems}
					variant="secondary"
					defaultValue="all"
					tabBarLeftContent={<span style={{ fontSize: '0.75rem', opacity: 0.5 }}>v2 API</span>}
					tabBarRightContent={
						<Button
							variant={ButtonVariant.Outlined}
							size={ButtonSize.SM}
							color={ButtonColor.Secondary}
							prefix={<Plus size={16} />}
						>
							New endpoint
						</Button>
					}
				/>
			</div>

			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Primitive TabsList — rightContent prop directly
				</h2>
				<TabsRoot defaultValue="tab1">
					<TabsList
						variant="primary"
						rightContent={
							<Button
								variant={ButtonVariant.Outlined}
								size={ButtonSize.SM}
								color={ButtonColor.Secondary}
								prefix={<Plus size={16} />}
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

const leftExtra = <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>v2 API</span>;
const rightExtra = (
	<Button
		variant={ButtonVariant.Outlined}
		size={ButtonSize.SM}
		color={ButtonColor.Secondary}
		prefix={<Plus size={16} />}
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '1.5rem' }}>
			{(['primary', 'secondary'] as TabVariants[]).map((variant) => (
				<section key={variant}>
					<h1
						style={{
							marginBottom: '1.5rem',
							borderBottom: '1px solid var(--border)',
							paddingBottom: '0.5rem',
							fontSize: '1.25rem',
							fontWeight: 700,
							textTransform: 'capitalize',
						}}
					>
						{variant} variant
					</h1>
					{(['left', 'center', 'right'] as TabsAlignment[]).map((alignment) => (
						<div key={alignment} style={{ marginBottom: '2.5rem' }}>
							<h2
								style={{
									marginBottom: '1rem',
									fontSize: '1rem',
									fontWeight: 600,
									textTransform: 'capitalize',
								}}
							>
								{alignment} alignment
							</h2>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
								{(Object.keys(extraConfigs) as ExtraVariant[]).map((extraVariant) => {
									const { label, tabBarLeftContent, tabBarRightContent } =
										extraConfigs[extraVariant];
									return (
										<div key={extraVariant}>
											<p
												style={{
													marginBottom: '0.5rem',
													fontFamily: 'monospace',
													fontSize: '0.75rem',
													opacity: 0.5,
												}}
											>
												{label}
											</p>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<div>
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Disabled Tabs with Custom Reasons
				</h2>
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
							prefixIcon: <Lock size={16} />,
						},
						{
							key: 'maintenance',
							label: 'Under Maintenance',
							children: 'Maintenance content',
							disabled: true,
							disabledReason: 'This section is under maintenance',
							prefixIcon: <Clock size={16} />,
						},
						{
							key: 'permissions',
							label: 'Insufficient Permissions',
							children: 'Permissions content',
							disabled: true,
							disabledReason: 'You do not have permission to access this area',
							prefixIcon: <ShieldAlert size={16} />,
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
				<h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
					Secondary Variant Disabled States
				</h2>
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
				prefixIcon: <Settings2 size={16} />,
			},
			{
				key: 'suffix',
				label: 'Suffix Icon',
				children: 'Tab with a trailing icon',
				suffixIcon: <History size={16} />,
			},
			{
				key: 'both',
				label: 'Both Icons',
				children: 'Tab with leading and trailing icons',
				prefixIcon: <LayoutGrid size={16} />,
				suffixIcon: <Component size={16} />,
			},
		],
	},
};
