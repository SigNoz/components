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
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
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
				<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
					Selected: {value || 'none'}
				</p>
			</div>
		);
	},
};

function WithGroupsPreview() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
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
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {value || 'none'}
			</p>
		</div>
	);
}

function WithIconsPreview() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select a tool..." style={{ display: 'flex', gap: '0.5rem' }} />
				<SelectContent>
					<SelectItem value="react" textValue="React" style={{ display: 'flex', gap: '0.5rem' }}>
						<Code size={16} style={{ marginRight: '0.5rem' }} />
						React
					</SelectItem>
					<SelectItem value="nodejs" textValue="Node.js" style={{ display: 'flex', gap: '0.5rem' }}>
						<Terminal size={16} style={{ marginRight: '0.5rem' }} />
						Node.js
					</SelectItem>
					<SelectItem
						value="postgres"
						textValue="PostgreSQL"
						style={{ display: 'flex', gap: '0.5rem' }}
					>
						<Database size={16} style={{ marginRight: '0.5rem' }} />
						PostgreSQL
					</SelectItem>
					<SelectItem value="git" textValue="Git" style={{ display: 'flex', gap: '0.5rem' }}>
						<GitBranch size={16} style={{ marginRight: '0.5rem' }} />
						Git
					</SelectItem>
				</SelectContent>
			</Select>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {value || 'none'}
			</p>
		</div>
	);
}

function MultiSelectPreview() {
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

function MultiSelectWithOverflowPreview() {
	const [values, setValues] = useState<string[]>(['react', 'vue', 'angular']);

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
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
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {values.length > 0 ? values.join(', ') : 'none'}
			</p>
			<p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
				(maxDisplayedPills=2, showing +N for overflow)
			</p>
		</div>
	);
}

function DisabledItemsPreview() {
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
					<SelectItem value="svelte" disabled>
						Svelte (disabled)
					</SelectItem>
				</SelectContent>
			</Select>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {value || 'none'}
			</p>
		</div>
	);
}

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
					With Groups
				</h3>
				<WithGroupsPreview />
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
				<WithIconsPreview />
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
				<MultiSelectPreview />
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
					Multi Select With Overflow
				</h3>
				<MultiSelectWithOverflowPreview />
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
					Disabled Items
				</h3>
				<DisabledItemsPreview />
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
					Loading
				</h3>
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
						<Select>
							<SelectTrigger placeholder="Select a framework..." loading />
							<SelectContent>
								<SelectLoading>Fetching options...</SelectLoading>
							</SelectContent>
						</Select>
					</div>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Loading with Delay (5s)
						</h3>
						<SelectLoadingWithDelay />
					</div>
				</div>
			</section>
		</div>
	),
};
