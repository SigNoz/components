import { Select, SelectContent, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectTrigger> = {
	title: 'Primitive Components/Select/SelectTrigger',
	component: SelectTrigger,
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Text shown when no value is selected.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		children: {
			control: false,
			description: 'Custom trigger content. Overrides the default value/placeholder display.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		renderValue: {
			control: false,
			description: 'Custom render function for the selected value(s).',
			table: { category: 'Content', type: { summary: '(values: string[]) => React.ReactNode' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, disables the trigger.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles for custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectTrigger>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

function SelectTriggerCustomRenderValueExample() {
	const [value, setValue] = useState('');
	const selectedLabel = frameworks.find((f) => f.value === value)?.label;

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger
					placeholder="Select a framework..."
					renderValue={() =>
						selectedLabel ? (
							<span style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedLabel}</span>
						) : null
					}
				/>
				<SelectContent>
					{frameworks.map((f) => (
						<SelectItem key={f.value} value={f.value}>
							{f.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export const Default: Story = {
	args: {
		placeholder: 'Select a framework...',
		disabled: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger {...args} />
					<SelectContent>
						{frameworks.map((f) => (
							<SelectItem key={f.value} value={f.value}>
								{f.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const Preview: Story = {
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
					With Value
				</h3>
				<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
					<Select defaultValue="react">
						<SelectTrigger placeholder="Select a framework..." />
						<SelectContent>
							{frameworks.map((f) => (
								<SelectItem key={f.value} value={f.value}>
									{f.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
				<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
					<Select>
						<SelectTrigger placeholder="Select a framework..." disabled />
						<SelectContent>
							{frameworks.map((f) => (
								<SelectItem key={f.value} value={f.value}>
									{f.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
					With Custom Render Value
				</h3>
				<SelectTriggerCustomRenderValueExample />
			</section>
		</div>
	),
};
