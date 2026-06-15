import { Code, Database, GitBranch, Terminal } from '@signozhq/icons';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectItem> = {
	title: 'Primitive Components/Select/SelectItem',
	component: SelectItem,
	argTypes: {
		value: {
			control: 'text',
			description: 'The unique value for this item.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		children: {
			control: false,
			description: 'The content to display in the item.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		textValue: {
			control: 'text',
			description:
				'Optional plain text value for the item. Use when children is a ReactNode (e.g. icon + text) to ensure correct display in the trigger.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the item from being selected.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
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
type Story = StoryObj<typeof SelectItem>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

function SelectItemWithIconsExample() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select a tool..." />
				<SelectContent>
					<SelectItem value="react" textValue="React">
						<Code size={16} style={{ marginRight: '0.5rem' }} />
						React
					</SelectItem>
					<SelectItem value="nodejs" textValue="Node.js">
						<Terminal size={16} style={{ marginRight: '0.5rem' }} />
						Node.js
					</SelectItem>
					<SelectItem value="postgres" textValue="PostgreSQL">
						<Database size={16} style={{ marginRight: '0.5rem' }} />
						PostgreSQL
					</SelectItem>
					<SelectItem value="git" textValue="Git">
						<GitBranch size={16} style={{ marginRight: '0.5rem' }} />
						Git
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function SelectItemDisabledExample() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select a framework..." />
				<SelectContent>
					<SelectItem value="react">React</SelectItem>
					<SelectItem value="vue" disabled>
						Vue (disabled)
					</SelectItem>
					<SelectItem value="angular">Angular</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function SelectItemMultiSelectExample() {
	const [values, setValues] = useState<string[]>([]);

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select multiple value={values} onChange={(v) => setValues(v as string[])}>
				<SelectTrigger placeholder="Select frameworks..." />
				<SelectContent>
					{frameworks.map((f) => (
						<SelectItem key={f.value} value={f.value}>
							{f.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {values.length > 0 ? values.join(', ') : 'none'}
			</p>
		</div>
	);
}

export const Default: Story = {
	args: {
		children: 'React',
		value: 'react',
		disabled: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		const { value: _itemValue, ...itemArgs } = args;

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent>
						{frameworks.map((f) => (
							<SelectItem key={f.value} value={f.value} {...(f.value === 'react' ? itemArgs : {})}>
								{f.value === 'react' ? args.children : f.label}
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
					With Icons
				</h3>
				<SelectItemWithIconsExample />
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
				<SelectItemDisabledExample />
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
					In Multi Select
				</h3>
				<SelectItemMultiSelectExample />
			</section>
		</div>
	),
};
