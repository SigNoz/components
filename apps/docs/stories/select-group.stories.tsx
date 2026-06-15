import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectGroup> = {
	title: 'Primitive Components/Select/SelectGroup',
	component: SelectGroup,
	argTypes: {
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
type Story = StoryObj<typeof SelectGroup>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
];

const languages = [
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'javascript', label: 'JavaScript' },
];

export const Default: Story = {
	args: {},
	render: (args) => {
		const [value, setValue] = useState('');
		const allItems = [
			{ heading: 'Frameworks', items: frameworks },
			{ heading: 'Languages', items: languages },
		];

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an option..." />
					<SelectContent>
						{allItems.map((group, idx) => (
							<>
								{idx > 0 && <SelectSeparator key={`sep-${group.heading}`} />}
								<SelectGroup key={group.heading} {...args}>
									<SelectLabel>{group.heading}</SelectLabel>
									{group.items.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	},
};

function WithoutLabelPreview() {
	const [value, setValue] = useState('');

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select a framework..." />
				<SelectContent>
					<SelectGroup>
						{frameworks.map((f) => (
							<SelectItem key={f.value} value={f.value}>
								{f.label}
							</SelectItem>
						))}
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						{languages.map((l) => (
							<SelectItem key={l.value} value={l.value}>
								{l.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

function MultipleGroupsPreview() {
	const [value, setValue] = useState('');
	const groups = [
		{ heading: 'Frameworks', items: frameworks },
		{ heading: 'Languages', items: languages },
		{
			heading: 'Databases',
			items: [
				{ value: 'postgres', label: 'PostgreSQL' },
				{ value: 'redis', label: 'Redis' },
			],
		},
	];

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Select value={value} onChange={(v) => setValue(v as string)}>
				<SelectTrigger placeholder="Select an option..." />
				<SelectContent>
					{groups.map((group, idx) => (
						<>
							{idx > 0 && <SelectSeparator key={`sep-${group.heading}`} />}
							<SelectGroup key={group.heading}>
								<SelectLabel>{group.heading}</SelectLabel>
								{group.items.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</>
					))}
				</SelectContent>
			</Select>
			<p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Selected: {value || 'none'}
			</p>
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
					Without Label
				</h3>
				<WithoutLabelPreview />
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
					Multiple Groups
				</h3>
				<MultipleGroupsPreview />
			</section>
		</div>
	),
};
