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
	title: 'Primitive Components/Select/SelectContent',
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
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
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

function AlignedTopPreview() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', paddingTop: '8rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select a framework..." />
				<SelectContent side="top" sideOffset={4}>
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

function WithoutPortalPreview() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select a framework..." />
				<SelectContent withPortal={false}>
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

function InsidePopoverPreview() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outlined">Open filters</Button>
				</PopoverTrigger>
				<PopoverContent style={{ width: '16rem' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Filter by framework</p>
						<Select value={value} onChange={(v) => setValue(v as string)}>
							<SelectTrigger placeholder="Select a framework..." />
							<SelectContent withPortal={false}>
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
}

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
					Aligned Top
				</h3>
				<AlignedTopPreview />
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
					Without Portal
				</h3>
				<WithoutPortalPreview />
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
					Inside Popover
				</h3>
				<InsidePopoverPreview />
			</section>
		</div>
	),
};
