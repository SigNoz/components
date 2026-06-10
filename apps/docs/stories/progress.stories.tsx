import { Progress, type ProgressProps } from '@signozhq/ui';
import type { Meta, StoryFn } from '@storybook/react-vite';

const meta: Meta<typeof Progress> = {
	title: 'Primitive Components/Progress',
	component: Progress,
	argTypes: {
		percent: {
			control: { type: 'range', min: 0, max: 100 },
			description: 'The completion value of the progress bar, from 0 to 100.',
			table: { category: 'Data', type: { summary: 'number' }, defaultValue: { summary: '0' } },
		},
		steps: {
			control: 'number',
			description:
				'If provided, divides the progress bar into equal visual segments instead of a continuous bar.',
			table: { category: 'Appearance', type: { summary: 'number | undefined' } },
		},
		strokeLinecap: {
			control: 'select',
			options: ['butt', 'round'],
			description: 'Controls the edge styling of the progress indicator.',
			table: {
				category: 'Appearance',
				type: { summary: "'butt' | 'round'" },
				defaultValue: { summary: "'butt'" },
			},
		},
		strokeColor: {
			control: 'color',
			description: "A CSS color value to dynamically override the indicator's background color.",
			table: { category: 'Appearance', type: { summary: 'string' } },
		},
		size: {
			control: 'select',
			options: ['small', 'default'],
			description: 'The vertical thickness of the progress bar.',
			table: {
				category: 'Appearance',
				type: { summary: "'small' | 'default'" },
				defaultValue: { summary: "'default'" },
			},
		},
		showInfo: {
			control: 'boolean',
			description: 'If true, renders the percent value as text next to the progress bar.',
			table: {
				category: 'Content',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		status: {
			control: 'select',
			options: ['normal', 'active'],
			description: "If 'active', applies a subtle striped animation to the progress bar.",
			table: {
				category: 'State',
				type: { summary: "'normal' | 'active'" },
				defaultValue: { summary: "'normal'" },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: 'object',
			description: 'Inline styles applied to the progress wrapper.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the progress bar.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the progress bar.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'padded',
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#1a1a1a' }],
		},
	},
};

export default meta;

// Default Template
const Template: StoryFn<typeof Progress> = (args: ProgressProps) => (
	<div style={{ width: '100%', maxWidth: '28rem', padding: '1rem' }}>
		<Progress {...args} />
	</div>
);

// 1. Default: A basic continuous progress bar
export const Default = Template.bind({});
Default.args = {
	percent: 50,
};

// 2. Sizes: Show both default and small sizes
export const Sizes: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			width: '100%',
			maxWidth: '28rem',
			flexDirection: 'column',
			gap: '1.5rem',
			padding: '1rem',
			color: 'var(--text-vanilla-100)',
		}}
	>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Small Size</h3>
			<Progress percent={70} size="small" />
		</div>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Default Size
			</h3>
			<Progress percent={70} size="default" />
		</div>
	</div>
);

// 3. Dynamic Colors: custom hex values or design tokens
export const DynamicColors: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			width: '100%',
			maxWidth: '28rem',
			flexDirection: 'column',
			gap: '1.5rem',
			padding: '1rem',
			color: 'var(--text-vanilla-100)',
		}}
	>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Critical (Red)
			</h3>
			<Progress percent={80} strokeColor="#ef4444" />
		</div>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Warning (Yellow)
			</h3>
			<Progress percent={60} strokeColor="#eab308" />
		</div>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Success (Green)
			</h3>
			<Progress percent={100} strokeColor="#22c55e" />
		</div>
	</div>
);

// 4. Segmented (Steps)
export const Segmented: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			width: '100%',
			maxWidth: '28rem',
			flexDirection: 'column',
			gap: '1.5rem',
			padding: '1rem',
			color: 'var(--text-vanilla-100)',
		}}
	>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				5 Steps, 40%
			</h3>
			<Progress percent={40} steps={5} />
		</div>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				10 Steps, 70%
			</h3>
			<Progress percent={70} steps={10} strokeColor="#10b981" />
		</div>
	</div>
);

// 5. With Info
export const WithInfo: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			width: '100%',
			maxWidth: '28rem',
			flexDirection: 'column',
			gap: '1.5rem',
			padding: '1rem',
			color: 'var(--text-vanilla-100)',
		}}
	>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Showing Info Text
			</h3>
			<Progress percent={45} showInfo />
		</div>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Active Status with Info
			</h3>
			<Progress percent={85} showInfo status="active" />
		</div>
	</div>
);

// 6. Stroke Linecap (Extra)
export const StrokeLinecap: StoryFn = () => (
	<div
		style={{
			display: 'flex',
			width: '100%',
			maxWidth: '28rem',
			flexDirection: 'column',
			gap: '1.5rem',
			padding: '1rem',
			color: 'var(--text-vanilla-100)',
		}}
	>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
				Round (Default for track, butt for indicator usually, but let's test)
			</h3>
			<Progress percent={50} strokeLinecap="round" />
		</div>
		<div>
			<h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Butt</h3>
			<Progress percent={50} strokeLinecap="butt" />
		</div>
	</div>
);
