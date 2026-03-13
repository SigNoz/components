import { ComboboxSimple } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code2, Database, GitBranch, Terminal } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof ComboboxSimple> = {
	title: 'Components/Combobox/ComboboxSimple',
	component: ComboboxSimple,
	argTypes: {
		items: {
			control: 'object',
			description: 'List of items to display (flat). Ignored when groups is provided.',
			table: { category: 'Content', type: { summary: 'ComboboxSimpleItem[]' } },
		},
		groups: {
			control: false,
			description: 'Grouped items with optional headings. When provided, items is ignored.',
			table: { category: 'Content', type: { summary: 'ComboboxSimpleGroup[]' } },
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text when no value is selected and in the search input.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		emptyPlaceholder: {
			control: 'text',
			description: 'Text shown when there are no results (e.g. after filtering).',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description: 'Controlled selected value.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		defaultValue: {
			control: 'text',
			description: 'Initial value when uncontrolled.',
			table: { category: 'State', type: { summary: 'string' } },
		},
		onChange: {
			control: false,
			description: 'Callback when selection changes.',
			table: { category: 'Events', type: { summary: '(value: string) => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxSimple>;

const defaultItems = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
];

export const Default: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select a framework...',
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

export const Controlled: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select a framework...',
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={setValue} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const WithDefaultValue: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select a framework...',
		defaultValue: 'react',
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

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

export const WithGroups: Story = {
	args: {
		groups,
		placeholder: 'Select a technology...',
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

const itemsWithIcons = [
	{
		value: 'react',
		label: (
			<>
				<Code2 className="mr-2 h-4 w-4" />
				React
			</>
		),
	},
	{
		value: 'nodejs',
		label: (
			<>
				<Terminal className="mr-2 h-4 w-4" />
				Node.js
			</>
		),
	},
	{
		value: 'postgres',
		label: (
			<>
				<Database className="mr-2 h-4 w-4" />
				PostgreSQL
			</>
		),
	},
	{
		value: 'git',
		label: (
			<>
				<GitBranch className="mr-2 h-4 w-4" />
				Git
			</>
		),
	},
];

export const WithIcons: Story = {
	args: {
		items: itemsWithIcons,
		placeholder: 'Select a tool...',
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

export const WithGroupsAndIcons: Story = {
	args: {
		groups: [
			{
				heading: 'Frameworks',
				items: [
					{
						value: 'react',
						label: (
							<>
								<Code2 className="mr-2 h-4 w-4" />
								React
							</>
						),
					},
					{
						value: 'vue',
						label: (
							<>
								<Code2 className="mr-2 h-4 w-4" />
								Vue
							</>
						),
					},
				],
			},
			{
				heading: 'Databases',
				items: [
					{
						value: 'postgres',
						label: (
							<>
								<Database className="mr-2 h-4 w-4" />
								PostgreSQL
							</>
						),
					},
					{
						value: 'redis',
						label: (
							<>
								<Database className="mr-2 h-4 w-4" />
								Redis
							</>
						),
					},
				],
			},
		],
		placeholder: 'Select a technology...',
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};
