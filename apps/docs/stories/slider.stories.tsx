import { Slider, TooltipProvider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
	title: 'Primitive Components/Slider',
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

const sliderWrapperStyle = {
	width: '300px',
	marginTop: '1.5rem',
	marginBottom: '1.5rem',
} as const;

function ControlledSliderExample() {
	const [value, setValue] = useState(30);

	return (
		<div
			style={{
				...sliderWrapperStyle,
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<Slider value={value} onChange={(v) => setValue(v as number)} max={100} />
			<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Value: {value}</p>
		</div>
	);
}

function ControlledRangeSliderExample() {
	const [value, setValue] = useState([20, 80]);

	return (
		<div
			style={{
				...sliderWrapperStyle,
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<Slider value={value} onChange={(v) => setValue(v as number[])} max={100} range />
			<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
				Range: {value[0]} - {value[1]}
			</p>
		</div>
	);
}

function OnAfterChangeSliderExample() {
	const [committed, setCommitted] = useState(50);

	return (
		<div
			style={{
				...sliderWrapperStyle,
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			<Slider defaultValue={50} max={100} onAfterChange={(v) => setCommitted(v as number)} />
			<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Committed on release: {committed}</p>
		</div>
	);
}

export const Default: Story = {
	args: {
		defaultValue: 50,
		max: 100,
		step: 1,
	},
	render: (args) => (
		<div style={sliderWrapperStyle}>
			<Slider {...args} />
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
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
					Range
				</h3>
				<div style={sliderWrapperStyle}>
					<Slider defaultValue={[25, 75]} max={100} step={1} range />
				</div>
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
					With Marks
				</h3>
				<div style={{ ...sliderWrapperStyle, paddingBottom: '1.5rem' }}>
					<Slider
						defaultValue={50}
						max={100}
						step={1}
						marks={{
							0: `1 GB`,
							25: `10 GB`,
							50: `100 GB`,
							75: `1,000 GB`,
							100: {
								style: { color: '#f50' },
								label: <strong>10,000 GB</strong>,
							},
						}}
					/>
				</div>
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
					With Tooltip
				</h3>
				<TooltipProvider>
					<div style={sliderWrapperStyle}>
						<Slider
							defaultValue={25}
							max={100}
							step={1}
							tooltip={{ formatter: (val) => `${val}%` }}
						/>
					</div>
				</TooltipProvider>
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
					Custom Styles
				</h3>
				<div style={sliderWrapperStyle}>
					<Slider
						defaultValue={50}
						max={100}
						step={1}
						styles={{
							track: { backgroundColor: '#ffe4e6' },
							range: { backgroundColor: '#e11d48' },
							thumb: { borderColor: '#e11d48' },
						}}
					/>
				</div>
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
					Custom Class Names
				</h3>
				<div style={sliderWrapperStyle}>
					<Slider
						defaultValue={50}
						max={100}
						step={1}
						classNames={{
							track: 'bg-slate-200',
							range: 'bg-emerald-500',
							thumb: 'border-emerald-500',
						}}
					/>
				</div>
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
					Controlled
				</h3>
				<ControlledSliderExample />
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
					Controlled Range
				</h3>
				<ControlledRangeSliderExample />
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
					With On After Change
				</h3>
				<OnAfterChangeSliderExample />
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
					Min Max
				</h3>
				<div style={sliderWrapperStyle}>
					<p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#6b7280' }}>
						min=20, max=80
					</p>
					<Slider defaultValue={50} min={20} max={80} step={1} />
				</div>
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
					Disabled
				</h3>
				<div style={sliderWrapperStyle}>
					<Slider defaultValue={50} max={100} disabled />
				</div>
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
					With Test Id
				</h3>
				<div style={sliderWrapperStyle}>
					<Slider defaultValue={50} max={100} testId="my-slider" id="slider-id" />
					<p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#6b7280' }}>
						testId="my-slider", id="slider-id"
					</p>
				</div>
			</section>
		</div>
	),
};
