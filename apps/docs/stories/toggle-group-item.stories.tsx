import { ToggleGroup, ToggleGroupItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlignCenter, AlignLeft, AlignRight, Bold } from 'lucide-react';

const meta: Meta<typeof ToggleGroupItem> = {
	title: 'Components/ToggleGroup/ToggleGroupItem',
	component: ToggleGroupItem,
	argTypes: {
		value: {
			control: 'text',
			description: 'The value of the toggle group item.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the item.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply.',
			table: { category: 'Styling' },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the item.',
			table: { category: 'Accessibility' },
		},
		testId: {
			control: 'text',
			description: 'The testId for testing purposes.',
			table: { category: 'Testing' },
		},
		children: {
			control: 'text',
			description: 'The content inside the toggle item (icon, label, or both).',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToggleGroupItem>;

export const Default: Story = {
	args: {
		value: 'center',
		disabled: false,
		children: <AlignCenter className="h-3 w-3" />,
	},
	render: (args) => (
		<ToggleGroup type="single" defaultValue="center">
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem {...args} aria-label="Align center" />
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const IconOnly: Story = {
	args: {
		value: 'bold',
		disabled: false,
	},
	render: (args) => (
		<ToggleGroup type="multiple" defaultValue={['bold']}>
			<ToggleGroupItem {...args} aria-label="Bold">
				<Bold className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const Disabled: Story = {
	args: {
		value: 'center',
		disabled: true,
		children: <AlignCenter className="h-3 w-3" />,
	},
	render: (args) => (
		<ToggleGroup type="single" defaultValue="left">
			<ToggleGroupItem value="left" aria-label="Align left">
				<AlignLeft className="h-3 w-3" />
			</ToggleGroupItem>
			<ToggleGroupItem {...args} aria-label="Align center" />
			<ToggleGroupItem value="right" aria-label="Align right">
				<AlignRight className="h-3 w-3" />
			</ToggleGroupItem>
		</ToggleGroup>
	),
};
