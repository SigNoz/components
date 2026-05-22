import { Slider, TooltipProvider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Slider> = {
	title: 'Components/Slider',
	component: Slider,
	parameters: {
		layout: 'centered',
	},
	args: {
		min: 0,
		max: 100,
		step: 1,
		disabled: false,
	},
	argTypes: {
		value: {
			control: 'object',
			description: 'Controlled value. Use number for single slider, number[] for range slider.',
			table: {
				type: { summary: 'number | number[]' },
			},
		},
		defaultValue: {
			control: 'object',
			description:
				'Initial value when uncontrolled. Use number for single slider, number[] for range slider.',
			table: {
				type: { summary: 'number | number[]' },
			},
		},
		min: {
			control: { type: 'number' },
			description: 'Minimum value of the slider.',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '0' },
			},
		},
		max: {
			control: { type: 'number' },
			description: 'Maximum value of the slider.',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '100' },
			},
		},
		step: {
			control: { type: 'number' },
			description: 'Step increment between values.',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '1' },
			},
		},
		range: {
			control: 'boolean',
			description: 'If true, renders a dual-thumb slider for range selection.',
			table: {
				type: { summary: 'boolean' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'If true, the slider is disabled.',
			table: {
				type: { summary: 'boolean' },
			},
		},
		marks: {
			control: 'object',
			description:
				'Tick marks along the track. Keys are values, values are labels or { style, label } objects.',
			table: {
				type: {
					summary: 'Record<number, ReactNode | { style?: CSSProperties; label: ReactNode }>',
				},
			},
		},
		tooltip: {
			control: 'object',
			description: 'Tooltip configuration with formatter function.',
			table: {
				type: { summary: '{ formatter?: (value: number) => ReactNode }' },
			},
		},
		onChange: {
			action: 'changed',
			description: 'Callback fired when the value changes during dragging.',
			table: {
				type: { summary: '(value: number | number[]) => void' },
			},
		},
		onAfterChange: {
			action: 'committed',
			description: 'Callback fired when mouseup or keyup happens (value committed).',
			table: {
				type: { summary: '(value: number | number[]) => void' },
			},
		},
		styles: {
			control: 'object',
			description: 'Custom inline styles for track, range, and thumb elements.',
			table: {
				type: {
					summary: '{ track?: CSSProperties; range?: CSSProperties; thumb?: CSSProperties }',
				},
			},
		},
		classNames: {
			control: 'object',
			description: 'Custom CSS class names for track, range, and thumb elements.',
			table: {
				type: { summary: '{ track?: string; range?: string; thumb?: string }' },
			},
		},
		testId: {
			control: 'text',
			description: 'Test ID for testing purposes (mapped to data-testid).',
			table: {
				type: { summary: 'string' },
			},
		},
		id: {
			control: 'text',
			description: 'Unique identifier for the slider root element.',
			table: {
				type: { summary: 'string' },
			},
		},
		className: {
			control: 'text',
			description: 'CSS class name for the slider root element.',
			table: {
				type: { summary: 'string' },
			},
		},
		style: {
			control: 'object',
			description: 'Inline style for the slider root element.',
			table: {
				type: { summary: 'CSSProperties' },
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof Slider>;

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
		step: 1,
		marks: {
			0: `1 GB`,
			25: `10 GB`,
			50: `100 GB`,
			75: `1,000 GB`,
			100: {
				style: { color: '#f50' },
				label: <strong>10,000 GB</strong>,
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

export const CustomClassNames: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		step: 1,
		classNames: {
			track: 'bg-slate-200',
			range: 'bg-emerald-500',
			thumb: 'border-emerald-500',
		},
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
		</div>
	),
};

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = React.useState(30);
		return (
			<div className="w-[300px] my-6 space-y-4">
				<Slider value={value} onChange={(v) => setValue(v as number)} max={100} />
				<p className="text-sm text-gray-500">Value: {value}</p>
			</div>
		);
	},
};

export const ControlledRange: Story = {
	render: () => {
		const [value, setValue] = React.useState([20, 80]);
		return (
			<div className="w-[300px] my-6 space-y-4">
				<Slider value={value} onChange={(v) => setValue(v as number[])} max={100} range />
				<p className="text-sm text-gray-500">
					Range: {value[0]} - {value[1]}
				</p>
			</div>
		);
	},
};

export const WithOnAfterChange: Story = {
	render: () => {
		const [committed, setCommitted] = React.useState(50);
		return (
			<div className="w-[300px] my-6 space-y-4">
				<Slider defaultValue={50} max={100} onAfterChange={(v) => setCommitted(v as number)} />
				<p className="text-sm text-gray-500">Committed on release: {committed}</p>
			</div>
		);
	},
};

export const MinMax: Story = {
	args: {
		defaultValue: 50,
		min: 20,
		max: 80,
		step: 1,
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<p className="text-sm text-gray-500 mb-2">min=20, max=80</p>
			<Slider {...args} />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		disabled: true,
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
		</div>
	),
};

export const WithTestId: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		testId: 'my-slider',
		id: 'slider-id',
	},
	render: (args) => (
		<div className="w-[300px] my-6">
			<Slider {...args} />
			<p className="text-sm text-gray-500 mt-2">testId="my-slider", id="slider-id"</p>
		</div>
	),
};
