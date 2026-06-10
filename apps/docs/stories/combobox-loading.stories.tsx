import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxLoading,
	ComboboxTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

const meta: Meta<typeof ComboboxLoading> = {
	title: 'Primitive Components/Combobox/ComboboxLoading',
	component: ComboboxLoading,
	argTypes: {
		children: {
			control: 'text',
			description: 'Loading message displayed to the user.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: 'object',
			description: 'Inline styles for the loading container.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		id: {
			control: 'text',
			description: 'Unique identifier for the element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test identifier for testing libraries.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxLoading>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {
		children: 'Loading options...',
	},
	render: (args) => {
		const [value] = useState('');
		const [open, setOpen] = useState(true);

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search frameworks..." />
								<ComboboxList>
									<ComboboxLoading {...args} />
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const Variations: Story = {
	render: () => (
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
				<InfiniteLoadingExample />
			</div>
			<div>
				<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
					Loading with Delay (5s)
				</h3>
				<DelayedLoadingExample />
			</div>
		</div>
	),
};

function InfiniteLoadingExample() {
	const [open, setOpen] = useState(false);

	return (
		<Combobox open={open} onOpenChange={setOpen}>
			<ComboboxTrigger placeholder="Select a framework..." value="" />
			{open && (
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxInput placeholder="Search frameworks..." />
						<ComboboxList>
							<ComboboxLoading>Fetching options...</ComboboxLoading>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			)}
		</Combobox>
	);
}

function DelayedLoadingExample() {
	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);
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
		<Combobox open={open} onOpenChange={setOpen}>
			<ComboboxTrigger
				placeholder="Select a framework..."
				value={frameworks.find((f) => f.value === value)?.label || ''}
			/>
			{open && (
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxInput placeholder="Search frameworks..." />
						<ComboboxList>
							{isLoading ? (
								<ComboboxLoading>Loading options...</ComboboxLoading>
							) : (
								items.map((f) => (
									<ComboboxItem
										key={f.value}
										value={f.value}
										onSelect={() => {
											setValue(f.value);
											setOpen(false);
										}}
										isSelected={value === f.value}
									>
										{f.label}
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			)}
		</Combobox>
	);
}
