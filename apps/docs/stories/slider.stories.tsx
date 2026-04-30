import { Slider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Design System/Slider',
	component: Slider,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		defaultValue: {
			control: 'object',
			description: 'The value of the slider when initially rendered.',
		},
		value: {
			control: 'object',
			description: 'The controlled value of the slider.',
		},
		min: {
			control: 'number',
			description: 'The minimum value for the range.',
		},
		max: {
			control: 'number',
			description: 'The maximum value for the range.',
		},
		step: {
			control: 'number',
			description: 'The stepping interval.',
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the slider.',
		},
		orientation: {
			control: 'radio',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the slider.',
		},
	},
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		defaultValue: [50],
		max: 100,
		step: 1,
	},
	render: (args) => (
		<div className="w-[300px]">
			<Slider {...args} />
		</div>
	),
};

export const StepSize: Story = {
	args: {
		defaultValue: [50],
		max: 100,
		step: 10,
	},
	render: (args) => (
		<div className="w-[300px]">
			<Slider {...args} />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		defaultValue: [50],
		max: 100,
		step: 1,
		disabled: true,
	},
	render: (args) => (
		<div className="w-[300px]">
			<Slider {...args} />
		</div>
	),
};

export const MultipleThumbs: Story = {
	args: {
		defaultValue: [25, 75],
		max: 100,
		step: 1,
	},
	render: (args) => (
		<div className="w-[300px]">
			<Slider {...args} />
		</div>
	),
};
