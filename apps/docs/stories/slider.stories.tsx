import { Slider, TooltipProvider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Components/Slider',
	component: Slider,
	parameters: {
		layout: 'centered',
	},
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		step: 1,
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
		</div>
	),
};

export const Range: Story = {
	args: {
		defaultValue: [25, 75],
		max: 100,
		step: 1,
		range: true,
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
		</div>
	),
};

export const WithMarks: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		step: 10,
		marks: {
			0: '0°C',
			26: '26°C',
			37: '37°C',
			100: {
				style: { color: '#f50' },
				label: <strong>100°C</strong>,
			},
		},
	},
	render: (args) => (
		<div className="w-[300px] my-6 pb-6">
			<Slider {...args} />
		</div>
	),
};

export const WithTooltip: Story = {
	args: {
		defaultValue: 25,
		max: 100,
		step: 1,
		tooltip: { formatter: (val) => `${val}%` },
	},
	decorators: [
		(Story) => (
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		),
	],
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
		</div>
	),
};

export const CustomStyles: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		step: 1,
		styles: {
			track: { backgroundColor: '#ffe4e6' },
			range: { backgroundColor: '#e11d48' },
			thumb: { borderColor: '#e11d48' },
		},
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
		</div>
	),
};
