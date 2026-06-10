import { ChevronDown, ChevronsUpDown, ChevronUp } from '@signozhq/icons';
import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectIcon> = {
	title: 'Primitive Components/Select/SelectIcon',
	component: SelectIcon,
	argTypes: {
		asChild: {
			control: 'boolean',
			description: 'Render as child element instead of default.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectIcon>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					SelectIcon is typically used internally by SelectTrigger. This example shows the default
					chevron icon.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
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
		);
	},
};

export const StandaloneUsage: Story = {
	render: () => {
		return (
			<div
				style={{
					padding: '2rem',
					width: '100%',
					maxWidth: '24rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1.5rem',
				}}
			>
				<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					SelectIcon is primarily an internal component used by SelectTrigger. These examples show
					the icon styling when rendered standalone.
				</p>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
						<span style={{ fontSize: '0.875rem', width: '8rem' }}>ChevronDown:</span>
						<SelectIcon asChild>
							<ChevronDown size={16} />
						</SelectIcon>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
						<span style={{ fontSize: '0.875rem', width: '8rem' }}>ChevronUp:</span>
						<SelectIcon asChild>
							<ChevronUp size={16} />
						</SelectIcon>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
						<span style={{ fontSize: '0.875rem', width: '8rem' }}>ChevronsUpDown:</span>
						<SelectIcon asChild>
							<ChevronsUpDown size={16} />
						</SelectIcon>
					</div>
				</div>
			</div>
		);
	},
};
