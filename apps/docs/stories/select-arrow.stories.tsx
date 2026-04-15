import { Select, SelectArrow, SelectContent, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectArrow> = {
	title: 'Components/Select/SelectArrow',
	component: SelectArrow,
	argTypes: {
		width: {
			control: 'number',
			description: 'Width of the arrow in pixels.',
			table: {
				category: 'Dimensions',
				type: { summary: 'number' },
				defaultValue: { summary: '10' },
			},
		},
		height: {
			control: 'number',
			description: 'Height of the arrow in pixels.',
			table: {
				category: 'Dimensions',
				type: { summary: 'number' },
				defaultValue: { summary: '5' },
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
type Story = StoryObj<typeof SelectArrow>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
					SelectArrow renders an arrow element that visually connects the trigger to the content.
					Must be rendered inside SelectContent.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent>
						{frameworks.map((f) => (
							<SelectItem key={f.value} value={f.value}>
								{f.label}
							</SelectItem>
						))}
						<SelectArrow />
					</SelectContent>
				</Select>
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};
