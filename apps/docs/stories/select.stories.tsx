import { Code, Database, GitBranch, Terminal } from '@signozhq/icons';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectLoading,
	SelectSeparator,
	SelectTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

const meta: Meta<typeof Select> = {
	title: 'Primitive Components/Select',
	component: Select,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof Select>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
];

const languages = [
	{ value: 'javascript', label: 'JavaScript' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'python', label: 'Python' },
	{ value: 'go', label: 'Go' },
	{ value: 'rust', label: 'Rust' },
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
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
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const Uncontrolled: Story = {
	render: () => (
		<div className="p-8 w-full max-w-sm">
			<Select defaultValue="">
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
	),
};

export const WithGroups: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a technology..." />
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Frameworks</SelectLabel>
							{frameworks.map((f) => (
								<SelectItem key={f.value} value={f.value}>
									{f.label}
								</SelectItem>
							))}
						</SelectGroup>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Languages</SelectLabel>
							{languages.map((l) => (
								<SelectItem key={l.value} value={l.value}>
									{l.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
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
					<SelectTrigger placeholder="Select a tool..." className="flex gap-2" />
					<SelectContent>
						<SelectItem value="react" textValue="React" className="flex gap-2">
							<Code className="mr-2 h-4 w-4" />
							React
						</SelectItem>
						<SelectItem value="nodejs" textValue="Node.js" className="flex gap-2">
							<Terminal className="mr-2 h-4 w-4" />
							Node.js
						</SelectItem>
						<SelectItem value="postgres" textValue="PostgreSQL" className="flex gap-2">
							<Database className="mr-2 h-4 w-4" />
							PostgreSQL
						</SelectItem>
						<SelectItem value="git" textValue="Git" className="flex gap-2">
							<GitBranch className="mr-2 h-4 w-4" />
							Git
						</SelectItem>
					</SelectContent>
				</Select>
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const MultiSelect: Story = {
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

export const MultiSelectWithOverflow: Story = {
	render: () => {
		const [values, setValues] = useState<string[]>(['react', 'vue', 'angular']);

		return (
			<div className="p-8 w-full max-w-sm">
				<Select multiple value={values} onChange={(v) => setValues(v as string[])}>
					<SelectTrigger placeholder="Select frameworks..." maxDisplayedPills={2} />
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
				<p className="mt-1 text-xs text-muted-foreground">
					(maxDisplayedPills=2, showing +N for overflow)
				</p>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="p-8 w-full max-w-sm">
			<Select disabled>
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
	),
};

export const DisabledItems: Story = {
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
						<SelectItem value="svelte" disabled>
							Svelte (disabled)
						</SelectItem>
					</SelectContent>
				</Select>
				<p className="mt-4 text-sm text-muted-foreground">Selected: {value || 'none'}</p>
			</div>
		);
	},
};

export const Loading: Story = {
	render: () => (
		<div className="p-8 w-full max-w-2xl space-y-8">
			<div>
				<h3 className="text-sm font-medium mb-2">Infinite Loading</h3>
				<Select>
					<SelectTrigger placeholder="Select a framework..." loading />
					<SelectContent>
						<SelectLoading>Fetching options...</SelectLoading>
					</SelectContent>
				</Select>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2">Loading with Delay (5s)</h3>
				<SelectLoadingWithDelay />
			</div>
		</div>
	),
};

function SelectLoadingWithDelay() {
	const [value, setValue] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [items, setItems] = useState<typeof frameworks>([]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setItems(frameworks);
			setIsLoading(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Select value={value} onChange={(v) => setValue(v as string)}>
			<SelectTrigger placeholder="Select a framework..." loading={isLoading} />
			<SelectContent>
				{isLoading ? (
					<SelectLoading>Loading options...</SelectLoading>
				) : (
					items.map((f) => (
						<SelectItem key={f.value} value={f.value}>
							{f.label}
						</SelectItem>
					))
				)}
			</SelectContent>
		</Select>
	);
}
