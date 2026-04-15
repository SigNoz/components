import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectViewport,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof SelectViewport> = {
	title: 'Components/Select/SelectViewport',
	component: SelectViewport,
	argTypes: {
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
type Story = StoryObj<typeof SelectViewport>;

const manyItems = Array.from({ length: 30 }, (_, i) => ({
	value: `item-${i + 1}`,
	label: `Item ${i + 1}`,
}));

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
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
					SelectViewport is the scrolling viewport that contains the select items. SelectContent
					uses it internally by default.
				</p>
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
			</div>
		);
	},
};

export const CustomMaxHeight: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
					You can customize the viewport height with inline styles or CSS variables. Use
					SelectViewport directly when you need scroll buttons.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select an item..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton />
						<SelectViewport style={{ maxHeight: '150px' }}>
							{manyItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectViewport>
						<SelectScrollDownButton />
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const WithGroups: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
					SelectViewport works seamlessly with groups, labels, and separators.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a technology..." />
					<SelectContent withViewport={false}>
						<SelectScrollUpButton />
						<SelectViewport style={{ maxHeight: '200px' }}>
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
							<SelectSeparator />
							<SelectGroup>
								<SelectLabel>More Items</SelectLabel>
								{manyItems.slice(0, 10).map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectViewport>
						<SelectScrollDownButton />
					</SelectContent>
				</Select>
			</div>
		);
	},
};

export const CustomPadding: Story = {
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div className="p-8 w-full max-w-sm">
				<p className="mb-4 text-sm text-muted-foreground">
					Customize viewport padding using CSS variables or className.
				</p>
				<Select value={value} onChange={(v) => setValue(v as string)}>
					<SelectTrigger placeholder="Select a framework..." />
					<SelectContent withViewport={false}>
						<SelectViewport className="!p-4">
							{frameworks.map((f) => (
								<SelectItem key={f.value} value={f.value}>
									{f.label}
								</SelectItem>
							))}
						</SelectViewport>
					</SelectContent>
				</Select>
			</div>
		);
	},
};
