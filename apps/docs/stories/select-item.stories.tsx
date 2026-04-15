import { Code, Database, GitBranch, Terminal } from '@signozhq/icons';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectItem> = {
	title: 'Components/Select/SelectItem',
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

export const Default: Story = {
	args: {
		children: 'React',
		value: 'react',
		disabled: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent>
						{frameworks.map((f) => (
							<SelectItem key={f.value} value={f.value} {...(f.value === 'react' ? args : {})}>
								{f.value === 'react' ? args.children : f.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const WithIcons: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a tool..." />
					<SelectContent>
						<SelectItem value="react" textValue="React">
							<Code className="mr-2 h-4 w-4" />
							React
						</SelectItem>
						<SelectItem value="nodejs" textValue="Node.js">
							<Terminal className="mr-2 h-4 w-4" />
							Node.js
						</SelectItem>
						<SelectItem value="postgres" textValue="PostgreSQL">
							<Database className="mr-2 h-4 w-4" />
							PostgreSQL
						</SelectItem>
						<SelectItem value="git" textValue="Git">
							<GitBranch className="mr-2 h-4 w-4" />
							Git
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
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
	},
};

export const InMultiSelect: Story = {
	render: () => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="p-8 w-full max-w-sm">
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
				<p className="mt-4 text-sm text-muted-foreground">
					Selected: {values.length > 0 ? values.join(', ') : 'none'}
				</p>
			</div>
		);
	},
};
