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
		style: {
			control: false,
			description: 'Inline styles applied to custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
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
	},
	{
		value: 'nodejs',
		label: (
			<>
				<Terminal size={16} style={{ marginRight: '0.5rem' }} />
				Node.js
			</>
		),
	},
	{
		value: 'postgres',
		label: (
			<>
				<Database size={16} style={{ marginRight: '0.5rem' }} />
				PostgreSQL
			</>
		),
	},
	{
		value: 'git',
		label: (
			<>
				<GitBranch size={16} style={{ marginRight: '0.5rem' }} />
				Git
			</>
		),
	},
];

const groupsWithIcons = [
	{
		heading: 'Frameworks',
		items: [
			{
				value: 'react',
				label: (
					<>
						<Code size={16} style={{ marginRight: '0.5rem' }} />
						React
					</>
				),
			},
			{
				value: 'vue',
				label: (
					<>
						<Code size={16} style={{ marginRight: '0.5rem' }} />
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
						<Database size={16} style={{ marginRight: '0.5rem' }} />
						PostgreSQL
					</>
				),
			},
			{
				value: 'redis',
				label: (
					<>
						<Database size={16} style={{ marginRight: '0.5rem' }} />
						Redis
					</>
				),
			},
		],
	},
];

const hintGroups = [
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
];

const hintGroupsWithCreate = [
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
];

const keywordItems = [
	{ value: '15', label: '15 minutes', keywords: ['quarter hour', '15m', '900 seconds'] },
	{ value: '30', label: '30 minutes', keywords: ['half hour', '30m', '1800 seconds'] },
	{ value: '60', label: '1 hour', keywords: ['60 minutes', '1h', '3600 seconds'] },
	{ value: '1440', label: '1 day', keywords: ['24 hours', '1d', 'daily'] },
];

const regionItems = [
	{ value: 'us-east-1', label: 'US East (N. Virginia)' },
	{ value: 'us-west-2', label: 'US West (Oregon)' },
	{ value: 'eu-west-1', label: 'EU (Ireland)' },
	{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
];

const sectionTitleStyle = {
	fontSize: '0.875rem',
	fontWeight: 500,
	marginBottom: '0.75rem',
	color: 'var(--muted-foreground)',
} as const;

const comboboxWrapperStyle = { padding: '2rem', width: '100%', maxWidth: '24rem' } as const;

export const Default: Story = {
	args: {
		items: defaultItems,
		placeholder: 'Select a framework...',
	},
	render: (args) => (
		<div style={comboboxWrapperStyle}>
			<ComboboxSimple {...args} />
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: function ComboboxSimplePreview() {
		const [controlledValue, setControlledValue] = useState('');
		const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
		const [allowCreateValue, setAllowCreateValue] = useState<string[]>([]);
		const [allowCreateCustomValue, setAllowCreateCustomValue] = useState<string[]>([]);
		const [tagsModeValue, setTagsModeValue] = useState<string[]>(['initial-tag']);
		const [allowCreateSingleValue, setAllowCreateSingleValue] = useState('');
		const [allowCreateSingleCustomValue, setAllowCreateSingleCustomValue] = useState('');
		const [withHintsValue, setWithHintsValue] = useState('');
		const [withHintsAndCreateValue, setWithHintsAndCreateValue] = useState('');
		const [multiSelectHintsValue, setMultiSelectHintsValue] = useState<string[]>([]);
		const [multiSelectHintsCreateValue, setMultiSelectHintsCreateValue] = useState<string[]>([]);
		const [loadingDelayIsLoading, setLoadingDelayIsLoading] = useState(true);
		const [loadingDelayItems, setLoadingDelayItems] = useState<typeof defaultItems>([]);
		const [withKeywordsValue, setWithKeywordsValue] = useState('');
		const [stringLabelsFilterValue, setStringLabelsFilterValue] = useState('');

		useEffect(() => {
			const timer = setTimeout(() => {
				setLoadingDelayItems(defaultItems);
				setLoadingDelayIsLoading(false);
			}, 5000);
			return () => clearTimeout(timer);
		}, []);

		return (
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
					<h3 style={sectionTitleStyle}>Controlled</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select a framework..."
							value={controlledValue}
							onChange={(v) => setControlledValue(v?.toString())}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {controlledValue || 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Default Value</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select a framework..."
							defaultValue="react"
						/>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Groups</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple groups={groups} placeholder="Select a technology..." />
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Icons</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple items={itemsWithIcons} placeholder="Select a tool..." />
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Groups And Icons</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple groups={groupsWithIcons} placeholder="Select a technology..." />
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Disabled</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple items={defaultItems} placeholder="Select a framework..." disabled />
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Multi Select</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select frameworks..."
							multiple
							value={multiSelectValue}
							onChange={(v) => setMultiSelectValue(v as string[])}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {multiSelectValue.length > 0 ? multiSelectValue.join(', ') : 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Multi Select With Default Values</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select frameworks..."
							multiple
							defaultValue={['react', 'vue']}
						/>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Multi Select With Max Pills</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select frameworks..."
							multiple
							defaultValue={['react', 'vue', 'angular', 'svelte']}
							maxDisplayedPills={2}
						/>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Allow Create</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select or create tags..."
							multiple
							allowCreate
							value={allowCreateValue}
							onChange={(v) => setAllowCreateValue(v as string[])}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Tags: {allowCreateValue.length > 0 ? allowCreateValue.join(', ') : 'none'}
						</p>
						<p
							style={{
								marginTop: '0.5rem',
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Type to filter, then click "Create" option to add new tags
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Allow Create With Custom Render</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select or create tags..."
							multiple
							allowCreate={(inputValue: string) => (
								<span>
									Add <strong>"{inputValue}"</strong> as new tag
								</span>
							)}
							value={allowCreateCustomValue}
							onChange={(v) => setAllowCreateCustomValue(v as string[])}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Tags: {allowCreateCustomValue.length > 0 ? allowCreateCustomValue.join(', ') : 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Tags Mode</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={[]}
							placeholder="Type to add tags..."
							multiple
							allowCreate
							value={tagsModeValue}
							onChange={(v) => setTagsModeValue(v as string[])}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Tags: {tagsModeValue.length > 0 ? tagsModeValue.join(', ') : 'none'}
						</p>
						<p
							style={{
								marginTop: '0.5rem',
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Free-form tag input - no predefined options
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Allow Create Single</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select or create..."
							allowCreate
							value={allowCreateSingleValue}
							onChange={(v) => setAllowCreateSingleValue(v as string)}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {allowCreateSingleValue || 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Allow Create Single Custom Text</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={defaultItems}
							placeholder="Select or create..."
							allowCreate={(inputValue: string) => (
								<span>
									Add <strong>"{inputValue}"</strong> as new option
								</span>
							)}
							value={allowCreateSingleCustomValue}
							onChange={(v) => setAllowCreateSingleCustomValue(v as string)}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {allowCreateSingleCustomValue || 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Hints</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							groups={hintGroups}
							placeholder="Filter by..."
							value={withHintsValue}
							onChange={(v) => setWithHintsValue(v as string)}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {withHintsValue || 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Hints And Create</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							groups={hintGroupsWithCreate}
							placeholder="Add tag..."
							allowCreate
							value={withHintsAndCreateValue}
							onChange={(v) => setWithHintsAndCreateValue(v as string)}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {withHintsAndCreateValue || 'none'}
						</p>
						<p
							style={{
								marginTop: '0.5rem',
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Try typing "tag:" to see filtered options, or create a new tag like "tag:mynewtag"
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Multi Select With Hints</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							groups={hintGroups}
							placeholder="Add filters..."
							multiple
							value={multiSelectHintsValue}
							onChange={(v) => setMultiSelectHintsValue(v as string[])}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Filters:{' '}
							{multiSelectHintsValue.length > 0 ? multiSelectHintsValue.join(', ') : 'none'}
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Multi Select With Hints And Create</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							groups={hintGroupsWithCreate}
							placeholder="Add tags..."
							multiple
							allowCreate
							value={multiSelectHintsCreateValue}
							onChange={(v) => setMultiSelectHintsCreateValue(v as string[])}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Tags:{' '}
							{multiSelectHintsCreateValue.length > 0
								? multiSelectHintsCreateValue.join(', ')
								: 'none'}
						</p>
						<p
							style={{
								marginTop: '0.5rem',
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Type "tag:" to filter, or create custom tags like "tag:mynewtag"
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>Loading</h3>
					<div
						style={{
							padding: '2rem',
							width: '100%',
							maxWidth: '42rem',
							display: 'flex',
							flexDirection: 'column',
							gap: '2rem',
						}}
					>
						<div>
							<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
								Infinite Loading
							</h3>
							<ComboboxSimple
								items={[]}
								placeholder="Select a framework..."
								loading
								loadingPlaceholder="Fetching options..."
							/>
						</div>
						<div>
							<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
								Loading with Delay (5s)
							</h3>
							<ComboboxSimple
								items={loadingDelayItems}
								placeholder="Select a framework..."
								loading={loadingDelayIsLoading}
								loadingPlaceholder="Loading options..."
							/>
						</div>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With Keywords</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={keywordItems}
							placeholder="Select duration..."
							value={withKeywordsValue}
							onChange={(v) => setWithKeywordsValue(v as string)}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {withKeywordsValue || 'none'}
						</p>
						<p
							style={{
								marginTop: '0.5rem',
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Try searching: "minute", "hour", "quarter", "half", "daily"
						</p>
					</div>
				</section>
				<section>
					<h3 style={sectionTitleStyle}>With String Labels Filter</h3>
					<div style={comboboxWrapperStyle}>
						<ComboboxSimple
							items={regionItems}
							placeholder="Select region..."
							value={stringLabelsFilterValue}
							onChange={(v) => setStringLabelsFilterValue(v as string)}
						/>
						<p
							style={{
								marginTop: '1rem',
								fontSize: '0.875rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Selected: {stringLabelsFilterValue || 'none'}
						</p>
						<p
							style={{
								marginTop: '0.5rem',
								fontSize: '0.75rem',
								color: 'var(--muted-foreground)',
							}}
						>
							Search by value ("us-east") or label ("Virginia", "Oregon", "Ireland")
						</p>
					</div>
				</section>
			</div>
		);
	},
};
