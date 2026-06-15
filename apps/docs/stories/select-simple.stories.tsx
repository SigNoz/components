import { Code, Database, GitBranch, Terminal } from '@signozhq/icons';
import { SelectSimple } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectSimple> = {
	title: 'Composed Components/SelectSimple',
	component: SelectSimple,
	argTypes: {
		items: {
			control: 'object',
			description: 'List of items to display (flat). Ignored when groups is provided.',
			table: { category: 'Content', type: { summary: 'SelectSimpleItem[]' } },
		},
		groups: {
			control: false,
			description: 'Grouped items with optional headings. When provided, items is ignored.',
			table: { category: 'Content', type: { summary: 'SelectSimpleGroup[]' } },
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text when no value is selected.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description: 'Controlled selected value.',
			table: { category: 'State', type: { summary: 'string | string[]' } },
		},
		defaultValue: {
			control: 'text',
			description: 'Initial value when uncontrolled.',
			table: { category: 'State', type: { summary: 'string | string[]' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the select is disabled.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		multiple: {
			control: 'boolean',
			description: 'Enable multi-select mode.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		withPortal: {
			control: 'boolean',
			description: 'Whether to render dropdown in a portal.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		defaultOpen: {
			control: 'boolean',
			description: 'Initial open state when uncontrolled.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		onChange: {
			control: false,
			description: 'Callback when selection changes.',
			table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
		},
		displayValue: {
			control: false,
			description: 'Customize what is shown in the trigger for selected items.',
			table: {
				category: 'Styling',
				type: { summary: '(selectedItems: SelectSimpleItem[]) => React.ReactNode' },
			},
		},
		loading: {
			control: 'boolean',
			description: 'Show loading spinner on trigger.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loadingPlaceholder: {
			control: 'text',
			description: 'Content shown in dropdown while loading. Can be string or ReactNode.',
			table: {
				category: 'Content',
				type: { summary: 'ReactNode' },
				defaultValue: { summary: "'Loading...'" },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectSimple>;

const defaultItems = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
];

const groups = [
	{
		heading: 'Frameworks',
		items: [
			{ value: 'react', label: 'React' },
			{ value: 'vue', label: 'Vue' },
			{ value: 'angular', label: 'Angular' },
			{ value: 'svelte', label: 'Svelte' },
		],
	},
	{
		heading: 'Languages',
		items: [
			{ value: 'javascript', label: 'JavaScript' },
			{ value: 'typescript', label: 'TypeScript' },
			{ value: 'python', label: 'Python' },
			{ value: 'go', label: 'Go' },
			{ value: 'rust', label: 'Rust' },
		],
	},
];

const itemsWithIcons = [
	{
		value: 'react',
		label: (
			<>
				<Code size={16} style={{ marginRight: '0.5rem' }} />
				React
			</>
		),
		displayValue: 'React',
	},
	{
		value: 'nodejs',
		label: (
			<>
				<Terminal size={16} style={{ marginRight: '0.5rem' }} />
				Node.js
			</>
		),
		displayValue: 'Node.js',
	},
	{
		value: 'postgres',
		label: (
			<>
				<Database size={16} style={{ marginRight: '0.5rem' }} />
				PostgreSQL
			</>
		),
		displayValue: 'PostgreSQL',
	},
	{
		value: 'git',
		label: (
			<>
				<GitBranch size={16} style={{ marginRight: '0.5rem' }} />
				Git
			</>
		),
		displayValue: 'Git',
	},
];

function ControlledExample() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<SelectSimple
				items={defaultItems}
				placeholder="Select a framework..."
				value={value}
				onChange={(v) => setValue(v as string)}
			/>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {value || 'none'}
			</p>
		</div>
	);
}

function MultiSelectExample() {
	const [values, setValues] = useState<string[]>([]);

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<SelectSimple
				items={defaultItems}
				placeholder="Select frameworks..."
				multiple
				value={values}
				onChange={(v) => setValues(v as string[])}
			/>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {values.length > 0 ? values.join(', ') : 'none'}
			</p>
		</div>
	);
}

function MultiSelectWithIconsExample() {
	const [values, setValues] = useState<string[]>([]);

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<SelectSimple
				items={itemsWithIcons}
				placeholder="Select tools..."
				multiple
				value={values}
				onChange={(v) => setValues(v as string[])}
			/>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {values.length > 0 ? values.join(', ') : 'none'}
			</p>
		</div>
	);
}

export const Default: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select a framework...',
	},
	render: (args) => (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<SelectSimple {...args} />
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
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
					Controlled
				</h3>
				<ControlledExample />
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
					With Default Value
				</h3>
				<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
					<SelectSimple
						items={defaultItems}
						placeholder="Select a framework..."
						defaultValue="react"
					/>
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
					With Groups
				</h3>
				<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
					<SelectSimple groups={groups} placeholder="Select a technology..." />
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
					With Icons
				</h3>
				<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
					<SelectSimple items={itemsWithIcons} placeholder="Select a tool..." />
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
					Multi Select
				</h3>
				<MultiSelectExample />
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
					Multi Select With Icons
				</h3>
				<MultiSelectWithIconsExample />
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
					<SelectSimple items={defaultItems} placeholder="Select a framework..." disabled />
				</div>
			</section>
		</div>
	),
};
