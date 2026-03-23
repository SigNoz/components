import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TabsContent> = {
	title: 'Components/Tabs/TabsContent',
	component: TabsContent,
	argTypes: {
		value: {
			control: 'text',
			description: 'The unique value that associates the content with a trigger.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		forceMount: {
			control: 'boolean',
			description: 'When true, content is kept mounted in the DOM when inactive.',
			table: { category: 'Behavior', type: { summary: 'true | undefined' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the content panel.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the content panel.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The content displayed in the panel when the tab is active.',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabsContent>;

export const Default: Story = {
	args: {
		value: 'profile',
		children: 'Profile settings content',
		forceMount: undefined,
	},
	render: (args) => (
		<TabsRoot defaultValue="profile">
			<TabsList>
				<TabsTrigger value="profile">Profile</TabsTrigger>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="security">Security</TabsTrigger>
			</TabsList>
			<TabsContent {...args} />
			<TabsContent value="account">Account content</TabsContent>
			<TabsContent value="security">Security content</TabsContent>
		</TabsRoot>
	),
};
