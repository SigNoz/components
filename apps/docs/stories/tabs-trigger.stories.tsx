import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TabsTrigger> = {
	title: 'Components/Tabs/TabsTrigger',
	component: TabsTrigger,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the tab trigger.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description: 'The unique value that associates the trigger with a content panel.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the tab.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary'],
			description: 'The visual style variant of the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: "'primary' | 'secondary'" },
				defaultValue: { summary: "'primary'" },
			},
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the trigger.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the trigger.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The content displayed in the tab trigger.',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabsTrigger>;

export const Default: Story = {
	args: {
		value: 'settings',
		children: 'Settings',
		disabled: false,
		variant: 'primary',
	},
	render: (args) => (
		<TabsRoot defaultValue="overview">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger {...args} />
				<TabsTrigger value="analytics">Analytics</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">Overview content</TabsContent>
			<TabsContent value="settings">Settings content</TabsContent>
			<TabsContent value="analytics">Analytics content</TabsContent>
		</TabsRoot>
	),
};
