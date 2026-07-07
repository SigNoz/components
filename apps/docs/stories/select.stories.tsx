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
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import styles from './select.stories.module.css';

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
			<div className="story-container">
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
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {value || 'none'}
				</Typography>
			</div>
		);
	},
};

export const Uncontrolled: Story = {
	render: () => (
		<div className="story-container">
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
			<div className="story-container">
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
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {value || 'none'}
				</Typography>
			</div>
		);
	},
};

export const WithIcons: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="story-container">
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a tool..." className="story-row" />
					<SelectContent>
						<SelectItem value="react" textValue="React" className="story-row">
							<Code className={`icon-md ${styles.iconSpacing}`} />
							React
						</SelectItem>
						<SelectItem value="nodejs" textValue="Node.js" className="story-row">
							<Terminal className={`icon-md ${styles.iconSpacing}`} />
							Node.js
						</SelectItem>
						<SelectItem value="postgres" textValue="PostgreSQL" className="story-row">
							<Database className={`icon-md ${styles.iconSpacing}`} />
							PostgreSQL
						</SelectItem>
						<SelectItem value="git" textValue="Git" className="story-row">
							<GitBranch className={`icon-md ${styles.iconSpacing}`} />
							Git
						</SelectItem>
					</SelectContent>
				</Select>
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {value || 'none'}
				</Typography>
			</div>
		);
	},
};

export const MultiSelect: Story = {
	render: () => {
		const [values, setValues] = useState<string[]>([]);

		return (
			<div className="story-container">
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
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {values.length > 0 ? values.join(', ') : 'none'}
				</Typography>
			</div>
		);
	},
};

export const MultiSelectWithOverflow: Story = {
	render: () => {
		const [values, setValues] = useState<string[]>(['react', 'vue', 'angular']);

		return (
			<div className="story-container">
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
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {values.length > 0 ? values.join(', ') : 'none'}
				</Typography>
				<Typography size="xs" color="muted" className={styles.overflowHint}>
					(maxDisplayedPills=2, showing +N for overflow)
				</Typography>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="story-container">
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
			<div className="story-container">
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
				<Typography size="sm" color="muted" className={styles.selectedText}>
					Selected: {value || 'none'}
				</Typography>
			</div>
		);
	},
};

export const Loading: Story = {
	render: () => (
		<div className={`story-container-full ${styles.variationsContainer}`}>
			<div className="story-section">
				<div>
					<Typography size="sm" weight="medium" className={styles.sectionHeading}>
						Infinite Loading
					</Typography>
					<Select>
						<SelectTrigger placeholder="Select a framework..." loading />
						<SelectContent>
							<SelectLoading>Fetching options...</SelectLoading>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Typography size="sm" weight="medium" className={styles.sectionHeading}>
						Loading with Delay (5s)
					</Typography>
					<SelectLoadingWithDelay />
				</div>
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
