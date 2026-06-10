import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectPortal> = {
	title: 'Primitive Components/Select/SelectPortal',
	component: SelectPortal,
	argTypes: {
		container: {
			description: 'The container element to render the portal into.',
			table: {
				category: 'Behavior',
				type: { summary: 'HTMLElement' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectPortal>;

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
					SelectPortal renders the content in a portal (by default to document.body). This is useful
					when the select is inside an overflow:hidden container. SelectContent uses this internally
					via the withPortal prop.
				</p>
				<div
					style={{
						padding: '1rem',
						border: '1px solid var(--border)',
						borderRadius: '0.5rem',
						overflow: 'hidden',
					}}
				>
					<p
						style={{
							fontSize: '0.75rem',
							color: 'var(--muted-foreground)',
							marginBottom: '0.5rem',
						}}
					>
						This container has overflow:hidden, but the dropdown still shows outside.
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
			</div>
		);
	},
};
