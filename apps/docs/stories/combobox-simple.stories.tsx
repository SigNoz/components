import { Code, Database, GitBranch, Terminal } from '@signozhq/icons';
import { ComboboxSimple } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

const meta: Meta<typeof ComboboxSimple> = {
	title: 'Composed Components/ComboboxSimple',
	component: ComboboxSimple,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the combobox.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the combobox.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
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
			description: 'Placeholder text when no value is selected.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		inputPlaceholder: {
			control: 'text',
			description:
				'Placeholder text for the search input inside the popover. Falls back to placeholder.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		emptyPlaceholder: {
			control: 'text',
			description: 'Text shown when there are no results (e.g. after filtering).',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description: 'Controlled selected value. Array when `multiple` is true.',
			table: { category: 'State', type: { summary: 'string | string[]' } },
		},
		defaultValue: {
			control: 'text',
			description: 'Initial value when uncontrolled. Array when `multiple` is true.',
			table: { category: 'State', type: { summary: 'string | string[]' } },
		},
		onChange: {
			control: false,
			description: 'Callback when selection changes.',
			table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
		},
		multiple: {
			control: 'boolean',
			description: 'Enable multi-select mode. Values shown as removable pills.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		allowCreate: {
			control: 'boolean',
			description:
				'Allow creating new items by typing. Pass a function to customize the create option text.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean | ((inputValue: string) => ReactNode)' },
				defaultValue: { summary: 'false' },
			},
		},
		maxDisplayedPills: {
			control: 'number',
			description:
				'Maximum number of pills to display in multi-select mode. Overflow shown as "+N".',
			table: { category: 'Display', type: { summary: 'number' } },
		},
		withPortal: {
			control: 'boolean',
			description: 'Set to false when inside a popover to avoid z-index issues.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		disableTooltipProvider: {
			control: 'boolean',
			description: 'Disable internal TooltipProvider when already inside one.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loading: {
			control: 'boolean',
			description: 'Show loading state instead of items.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loadingPlaceholder: {
			control: 'text',
			description: 'Content shown while loading. Can be string or ReactNode.',
			table: {
				category: 'Content',
				type: { summary: 'ReactNode' },
				defaultValue: { summary: "'Loading...'" },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the combobox is disabled.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		virtualized: {
			control: 'object',
			description:
				'Enable virtualization for large lists. Pass `true` for defaults or an object with { estimatedItemHeight, virtualizedHeight }.',
			table: {
				category: 'Performance',
				type: { summary: 'boolean | { estimatedItemHeight?: number; virtualizedHeight?: number }' },
				defaultValue: { summary: 'false' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
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
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v?.toString())} />
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
				<Code className="mr-2 h-4 w-4" />
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
								<Code className="mr-2 h-4 w-4" />
								React
							</>
						),
					},
					{
						value: 'vue',
						label: (
							<>
								<Code className="mr-2 h-4 w-4" />
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

export const Disabled: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select a framework...',
		disabled: true,
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

export const MultiSelect: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select frameworks...',
		multiple: true,
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={values} onChange={(v) => setValues(v as string[])} />
				<p className="mt-4 text-sm text-muted-foreground">
					Selected: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
			</div>
		);
	},
};

export const MultiSelectWithDefaultValues: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select frameworks...',
		multiple: true,
		defaultValue: ['react', 'vue'],
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

export const MultiSelectWithMaxPills: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select frameworks...',
		multiple: true,
		defaultValue: ['react', 'vue', 'angular', 'svelte'],
		maxDisplayedPills: 2,
	},
	render: (args) => (
		<div className="p-8 w-full max-w-sm">
			<ComboboxSimple {...args} />
		</div>
	),
};

export const AllowCreate: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select or create tags...',
		multiple: true,
		allowCreate: true,
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={values} onChange={(v) => setValues(v as string[])} />
				<p className="mt-4 text-sm text-muted-foreground">
					Tags: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
				<p className="mt-2 text-xs text-muted-foreground">
					Type to filter, then click "Create" option to add new tags
				</p>
			</div>
		);
	},
};

export const AllowCreateWithCustomRender: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select or create tags...',
		multiple: true,
		allowCreate: (inputValue: string) => (
			<span>
				Add <strong>"{inputValue}"</strong> as new tag
			</span>
		),
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={values} onChange={(v) => setValues(v as string[])} />
				<p className="mt-4 text-sm text-muted-foreground">
					Tags: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
			</div>
		);
	},
};

export const TagsMode: Story = {
	args: {
		items: [],
		placeholder: 'Type to add tags...',
		multiple: true,
		allowCreate: true,
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>(['initial-tag']);

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={values} onChange={(v) => setValues(v as string[])} />
				<p className="mt-4 text-sm text-muted-foreground">
					Tags: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
				<p className="mt-2 text-xs text-muted-foreground">
					Free-form tag input - no predefined options
				</p>
			</div>
		);
	},
};

export const AllowCreateSingle: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select or create...',
		allowCreate: true,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v as string)} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const AllowCreateSingleCustomText: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select or create...',
		allowCreate: (inputValue: string) => (
			<span>
				Add <strong>"{inputValue}"</strong> as new option
			</span>
		),
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v as string)} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const WithHints: Story = {
	args: {
		groups: [
			{
				heading: 'Suggestions',
				items: [
					{ value: 'hint:status', label: 'status:', insertValue: 'status:' },
					{ value: 'hint:priority', label: 'priority:', insertValue: 'priority:' },
				],
			},
			{
				heading: 'Status',
				items: [
					{ value: 'status:active', label: 'Status: Active' },
					{ value: 'status:pending', label: 'Status: Pending' },
					{ value: 'status:closed', label: 'Status: Closed' },
				],
			},
			{
				heading: 'Priority',
				items: [
					{ value: 'priority:high', label: 'Priority: High' },
					{ value: 'priority:medium', label: 'Priority: Medium' },
					{ value: 'priority:low', label: 'Priority: Low' },
				],
			},
		],
		placeholder: 'Filter by...',
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v as string)} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const WithHintsAndCreate: Story = {
	args: {
		groups: [
			{
				heading: 'Suggestions',
				items: [{ value: 'hint:tag', label: 'tag:', insertValue: 'tag:' }],
			},
			{
				heading: 'Tags',
				items: [
					{ value: 'tag:bug', label: 'tag:bug' },
					{ value: 'tag:feature', label: 'tag:feature' },
					{ value: 'tag:docs', label: 'tag:docs' },
				],
			},
		],
		placeholder: 'Add tag...',
		allowCreate: true,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v as string)} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
				<p className="mt-2 text-xs text-muted-foreground">
					Try typing "tag:" to see filtered options, or create a new tag like "tag:mynewtag"
				</p>
			</div>
		);
	},
};

export const MultiSelectWithHints: Story = {
	args: {
		groups: [
			{
				heading: 'Suggestions',
				items: [
					{ value: 'hint:status', label: 'status:', insertValue: 'status:' },
					{ value: 'hint:priority', label: 'priority:', insertValue: 'priority:' },
				],
			},
			{
				heading: 'Status',
				items: [
					{ value: 'status:active', label: 'Status: Active' },
					{ value: 'status:pending', label: 'Status: Pending' },
					{ value: 'status:closed', label: 'Status: Closed' },
				],
			},
			{
				heading: 'Priority',
				items: [
					{ value: 'priority:high', label: 'Priority: High' },
					{ value: 'priority:medium', label: 'Priority: Medium' },
					{ value: 'priority:low', label: 'Priority: Low' },
				],
			},
		],
		placeholder: 'Add filters...',
		multiple: true,
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={values} onChange={(v) => setValues(v as string[])} />
				<p className="mt-4 text-sm text-muted-foreground">
					Filters: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
			</div>
		);
	},
};

export const MultiSelectWithHintsAndCreate: Story = {
	args: {
		groups: [
			{
				heading: 'Suggestions',
				items: [{ value: 'hint:tag', label: 'tag:', insertValue: 'tag:' }],
			},
			{
				heading: 'Tags',
				items: [
					{ value: 'tag:bug', label: 'tag:bug' },
					{ value: 'tag:feature', label: 'tag:feature' },
					{ value: 'tag:docs', label: 'tag:docs' },
				],
			},
		],
		placeholder: 'Add tags...',
		multiple: true,
		allowCreate: true,
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={values} onChange={(v) => setValues(v as string[])} />
				<p className="mt-4 text-sm text-muted-foreground">
					Tags: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
				<p className="mt-2 text-xs text-muted-foreground">
					Type "tag:" to filter, or create custom tags like "tag:mynewtag"
				</p>
			</div>
		);
	},
};

export const Loading: Story = {
	render: () => (
		<div className="p-8 w-full max-w-2xl space-y-8">
			<div>
				<h3 className="text-sm font-medium mb-2">Infinite Loading</h3>
				<ComboboxSimple
					items={[]}
					placeholder="Select a framework..."
					loading={true}
					loadingPlaceholder="Fetching options..."
				/>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2">Loading with Delay (5s)</h3>
				<ComboboxLoadingWithDelay />
			</div>
		</div>
	),
};

function ComboboxLoadingWithDelay() {
	const [isLoading, setIsLoading] = useState(true);
	const [items, setItems] = useState<typeof defaultItems>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setItems(defaultItems);
			setIsLoading(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<ComboboxSimple
			items={items}
			placeholder="Select a framework..."
			loading={isLoading}
			loadingPlaceholder="Loading options..."
		/>
	);
}

export const WithKeywords: Story = {
	args: {
		items: [
			{ value: '15', label: '15 minutes', keywords: ['quarter hour', '15m', '900 seconds'] },
			{ value: '30', label: '30 minutes', keywords: ['half hour', '30m', '1800 seconds'] },
			{ value: '60', label: '1 hour', keywords: ['60 minutes', '1h', '3600 seconds'] },
			{ value: '1440', label: '1 day', keywords: ['24 hours', '1d', 'daily'] },
		],
		placeholder: 'Select duration...',
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v as string)} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
				<p className="mt-2 text-xs text-muted-foreground">
					Try searching: "minute", "hour", "quarter", "half", "daily"
				</p>
			</div>
		);
	},
};

export const WithStringLabelsFilter: Story = {
	args: {
		items: [
			{ value: 'us-east-1', label: 'US East (N. Virginia)' },
			{ value: 'us-west-2', label: 'US West (Oregon)' },
			{ value: 'eu-west-1', label: 'EU (Ireland)' },
			{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
		],
		placeholder: 'Select region...',
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<ComboboxSimple {...args} value={value} onChange={(v) => setValue(v as string)} />
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
				<p className="mt-2 text-xs text-muted-foreground">
					Search by value ("us-east") or label ("Virginia", "Oregon", "Ireland")
				</p>
			</div>
		);
	},
};
