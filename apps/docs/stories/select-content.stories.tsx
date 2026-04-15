import {
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectContent> = {
	title: 'Components/Select/SelectContent',
	component: SelectContent,
	argTypes: {
		position: {
			control: 'select',
			options: ['item-aligned', 'popper'],
			description: 'Positioning strategy for the dropdown content.',
			table: {
				category: 'Layout',
				type: { summary: "'item-aligned' | 'popper'" },
				defaultValue: { summary: "'popper'" },
			},
		},
		side: {
			control: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			description: 'Which side of the trigger to render the content on.',
			table: { category: 'Layout', type: { summary: "'top' | 'right' | 'bottom' | 'left'" } },
		},
		sideOffset: {
			control: 'number',
			description: 'Distance in pixels from the trigger.',
			table: { category: 'Layout', type: { summary: 'number' }, defaultValue: { summary: '4' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'Alignment of the content relative to the trigger.',
			table: { category: 'Layout', type: { summary: "'start' | 'center' | 'end'" } },
		},
		withPortal: {
			control: 'boolean',
			description: 'Whether to render the content in a portal.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
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
type Story = StoryObj<typeof SelectContent>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent {...args}>
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

export const AlignedTop: Story = {
	args: {
		side: 'top',
		sideOffset: 4,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 pt-32 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent {...args}>
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

export const WithoutPortal: Story = {
	args: {
		withPortal: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent {...args}>
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

/**
 * When placing a Select inside a Popover (e.g., a filter panel or form), set
 * `withPortal={false}` so the dropdown content stays within the popover DOM
 * instead of portaling to `document.body`. This avoids z-index and stacking issues.
 */
export const InsidePopover: Story = {
	args: {
		withPortal: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outlined">Open filters</Button>
					</PopoverTrigger>
					<PopoverContent className="w-64">
						<div className="space-y-4">
							<p className="text-sm font-medium">Filter by framework</p>
							<Select value={value} onChange={(v) => setValue(v as string)}>
								<SelectTrigger placeholder="Select a framework..." />
								<SelectContent {...args}>
									{frameworks.map((f) => (
										<SelectItem key={f.value} value={f.value}>
											{f.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		);
	},
};
