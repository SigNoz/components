import { RadioGroup, RadioGroupItem } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RadioGroupItem> = {
	title: 'Components/RadioGroup/RadioGroupItem',
	component: RadioGroupItem,
	argTypes: {
		value: {
			control: 'text',
			description: 'The value given as data when submitted with a name.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description:
				'A unique identifier for the radio item. Links the radio with its label for accessibility.',
			table: { category: 'Accessibility' },
		},
		required: {
			control: 'boolean',
			description:
				'When true, indicates that the user must check the radio item before the owning form can be submitted.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the radio item.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the radio item for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the radio item.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description:
				'The content inside the radio item. Typically used for adding text or other elements as an inline label.',
			table: { category: 'Content' },
		},
		onCheck: {
			control: false,
			description: 'The callback invoked when the value state of the radio item changes.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroupItem>;

export const Default: Story = {
	args: {
		value: 'option1',
		id: 'radio-item-default',
		children: 'Option 1',
		disabled: false,
	},
	render: (args) => (
		<RadioGroup defaultValue="option1">
			<RadioGroupItem {...args} />
		</RadioGroup>
	),
};

export const Checked: Story = {
	args: {
		value: 'checked',
		id: 'radio-item-checked',
		children: 'Checked option',
		disabled: false,
	},
	render: (args) => (
		<RadioGroup defaultValue="checked">
			<RadioGroupItem {...args} />
		</RadioGroup>
	),
};

export const Disabled: Story = {
	args: {
		value: 'disabled',
		id: 'radio-item-disabled',
		children: 'Disabled option',
		disabled: true,
	},
	render: (args) => (
		<RadioGroup>
			<RadioGroupItem {...args} />
		</RadioGroup>
	),
};

export const DisabledChecked: Story = {
	args: {
		value: 'disabled-checked',
		id: 'radio-item-disabled-checked',
		children: 'Disabled checked option',
		disabled: true,
	},
	render: (args) => (
		<RadioGroup defaultValue="disabled-checked">
			<RadioGroupItem {...args} />
		</RadioGroup>
	),
};
