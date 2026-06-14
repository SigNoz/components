import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TabsList> = {
	title: 'Primitive Components/Tabs/TabsList',
	component: TabsList,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the tabs list.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary'],
			description: 'The visual style variant of the tabs list.',
			table: {
				category: 'Appearance',
				type: { summary: "'primary' | 'secondary'" },
				defaultValue: { summary: "'primary'" },
			},
		},
		loop: {
			control: 'boolean',
			description:
				'When true, keyboard navigation will loop from last tab to first, and vice versa.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
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
		leftContent: {
			control: false,
			description: 'Content rendered to the left of the tab list, in the same horizontal row.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		rightContent: {
			control: false,
			description: 'Content rendered to the right of the tab list, in the same horizontal row.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the tabs list.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the tabs list.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabsList>;

export const Default: Story = {
	args: {
		variant: 'primary',
		loop: false,
	},
	render: (args) => (
		<TabsRoot defaultValue="tab1">
			<TabsList {...args}>
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
