import { Select, SelectContent, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectTrigger> = {
	title: 'Components/Select/SelectTrigger',
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

export const Default: Story = {
	args: {
		placeholder: 'Select a framework...',
		disabled: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
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

export const WithValue: Story = {
	args: {
		placeholder: 'Select a framework...',
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<Select defaultValue="react">
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
	),
};

export const Disabled: Story = {
	args: {
		placeholder: 'Select a framework...',
		disabled: true,
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<Select>
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
	),
};

export const WithCustomRenderValue: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const selectedLabel = frameworks.find((f) => f.value === value)?.label;

		return (
			<div className="p-8 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger
						placeholder="Select a framework..."
						renderValue={() =>
							selectedLabel ? (
								<span className="font-semibold text-primary">{selectedLabel}</span>
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
	},
};
