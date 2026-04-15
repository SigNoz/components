import { ChevronDown, ChevronsUpDown, ChevronUp } from '@signozhq/icons';
import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectIcon> = {
	title: 'Components/Select/SelectIcon',
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
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
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
			<div className="p-8 w-full max-w-sm space-y-6">
				<p className="text-sm text-muted-foreground">
					SelectIcon is primarily an internal component used by SelectTrigger. These examples show
					the icon styling when rendered standalone.
				</p>

				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<span className="text-sm w-32">ChevronDown:</span>
						<SelectIcon asChild>
							<ChevronDown className="h-4 w-4" />
						</SelectIcon>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm w-32">ChevronUp:</span>
						<SelectIcon asChild>
							<ChevronUp className="h-4 w-4" />
						</SelectIcon>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm w-32">ChevronsUpDown:</span>
						<SelectIcon asChild>
							<ChevronsUpDown className="h-4 w-4" />
						</SelectIcon>
					</div>
				</div>
			</div>
		);
	},
};
