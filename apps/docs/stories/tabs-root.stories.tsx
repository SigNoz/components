import { CircleAlert, History, Settings } from '@signozhq/icons';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TabsRoot> = {
	title: 'Primitive Components/Tabs/Tabs',
	component: TabsRoot,
	argTypes: {
		defaultValue: {
			control: 'text',
			description:
				'The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description:
				'The controlled value of the tab to activate. Should be used in conjunction with onValueChange.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		onValueChange: {
			control: false,
			description: 'Event handler called when the active tab changes.',
			table: { category: 'Events', type: { summary: '(value: string) => void' } },
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
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabsRoot>;

export const Default: Story = {
	args: {
		defaultValue: 'tab1',
	},
	render: (args) => (
		<TabsRoot
			{...args}
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.5rem',
				alignItems: 'flex-start',
				textAlign: 'left',
			}}
		>
			<TabsList variant="primary">
				<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				<TabsTrigger value="tab3">Tab 3</TabsTrigger>
			</TabsList>
			<TabsContent value="tab1">Tab 1 content</TabsContent>
			<TabsContent value="tab2">Tab 2 content</TabsContent>
			<TabsContent value="tab3">Tab 3 content</TabsContent>
		</TabsRoot>
	),
};

export const Preview: Story = {
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Primary Variant
				</h3>
				<TabsRoot
					defaultValue="overview"
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '0.5rem',
						alignItems: 'flex-start',
						textAlign: 'left',
					}}
				>
					<TabsList variant="primary">
						<TabsTrigger value="overview" variant="primary">
							<Settings size={16} />
							Overview
						</TabsTrigger>
						<TabsTrigger value="issues" variant="primary">
							<CircleAlert size={16} />
							Issues
						</TabsTrigger>
						<TabsTrigger value="history" variant="primary">
							History
							<History size={16} />
						</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">Overview content panel</TabsContent>
					<TabsContent value="issues">Issues content panel</TabsContent>
					<TabsContent value="history">History content panel</TabsContent>
				</TabsRoot>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Secondary Variant
				</h3>
				<TabsRoot
					defaultValue="all"
					style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
				>
					<TabsList variant="secondary">
						<TabsTrigger value="all" variant="secondary">
							All Endpoints
						</TabsTrigger>
						<TabsTrigger value="details" variant="secondary">
							Endpoint Details
						</TabsTrigger>
						<TabsTrigger value="advanced" variant="secondary">
							Advanced
						</TabsTrigger>
					</TabsList>
					<TabsContent value="all">All endpoints content</TabsContent>
					<TabsContent value="details">Endpoint details content</TabsContent>
					<TabsContent value="advanced">Advanced settings content</TabsContent>
				</TabsRoot>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					With Disabled Tabs
				</h3>
				<TabsRoot
					defaultValue="active"
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '0.5rem',
						alignItems: 'flex-start',
						textAlign: 'left',
					}}
				>
					<TabsList variant="primary">
						<TabsTrigger value="active" variant="primary">
							Active Tab
						</TabsTrigger>
						<TabsTrigger value="disabled" variant="primary" disabled>
							Disabled Tab
						</TabsTrigger>
						<TabsTrigger value="another" variant="primary">
							Another Tab
						</TabsTrigger>
					</TabsList>
					<TabsContent value="active">Active tab content</TabsContent>
					<TabsContent value="disabled">Disabled tab content</TabsContent>
					<TabsContent value="another">Another tab content</TabsContent>
				</TabsRoot>
			</section>
		</div>
	),
};
