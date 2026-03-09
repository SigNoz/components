import { RadioGroup, RadioGroupItem, RadioGroupLabel } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RadioGroupLabel> = {
	title: 'Components/RadioGroup/RadioGroupLabel',
	component: RadioGroupLabel,
	argTypes: {
		htmlFor: {
			control: 'text',
			description:
				'The id of the radio item this label is associated with. Links the label to its radio button.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the label element.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the label.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The label text or content to display.',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroupLabel>;

export const Default: Story = {
	args: {
		htmlFor: 'radio-label-example',
		children: 'Option Label',
	},
	render: (args) => (
		<RadioGroup defaultValue="option1">
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="option1" id="radio-label-example" />
				<RadioGroupLabel {...args} />
			</div>
		</RadioGroup>
	),
};

export const WithDisabledRadio: Story = {
	args: {
		htmlFor: 'disabled-radio-label',
		children: 'Disabled Option',
	},
	render: (args) => (
		<RadioGroup>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="disabled" id="disabled-radio-label" disabled />
				<RadioGroupLabel {...args} aria-disabled="true" />
			</div>
		</RadioGroup>
	),
};

export const MultipleLabels: Story = {
	render: () => (
		<RadioGroup defaultValue="option1">
			<div className="flex flex-col space-y-3">
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option1" id="opt1" />
					<RadioGroupLabel htmlFor="opt1">First Option</RadioGroupLabel>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option2" id="opt2" />
					<RadioGroupLabel htmlFor="opt2">Second Option</RadioGroupLabel>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option3" id="opt3" disabled />
					<RadioGroupLabel htmlFor="opt3" aria-disabled="true">
						Disabled Option
					</RadioGroupLabel>
				</div>
			</div>
		</RadioGroup>
	),
};
