import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { itemArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof ComboboxItem> = {
	title: 'Primitive Components/Combobox/ComboboxItem',
	component: ComboboxItem,
	argTypes: {
		...itemArgTypes,
		isSelected: {
			control: 'boolean',
			description: 'When true, shows a checkmark indicating the current selection.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		prefix: {
			control: false,
			description: 'Custom prefix. Pass null to hide the default check icon.',
			table: { category: 'Content', type: { summary: 'React.ReactNode | null' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxItem>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {
		children: 'React',
		disabled: false,
		isSelected: false,
	},
	render: (args) => {
		const [value, setValue] = useState(args.isSelected ? 'react' : '');
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
									{frameworks.map((f) => (
										<ComboboxItem
											key={f.value}
											value={f.value}
											onSelect={() => {
												setValue(f.value);
												setOpen(false);
											}}
											isSelected={value === f.value}
											{...(f.value === 'react' ? args : {})}
										>
											{f.value === 'react' ? args.children : f.label}
										</ComboboxItem>
									))}
									<ComboboxEmpty>No results.</ComboboxEmpty>
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

function WithPrefixNullPreview() {
	const [previewValue, setPreviewValue] = useState('');
	const [previewOpen, setPreviewOpen] = useState(true);

	return (
		<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
			<Combobox open={previewOpen} onOpenChange={setPreviewOpen}>
				<ComboboxTrigger
					placeholder="Select a framework..."
					value={frameworks.find((f) => f.value === previewValue)?.label || ''}
				/>
				{previewOpen && (
					<ComboboxContent>
						<ComboboxCommand>
							<ComboboxInput placeholder="Search frameworks..." />
							<ComboboxList>
								{frameworks.map((f) => (
									<ComboboxItem
										key={f.value}
										value={f.value}
										onSelect={() => {
											setPreviewValue(f.value);
											setPreviewOpen(false);
										}}
										isSelected={previewValue === f.value}
										prefix={null}
									>
										{f.label}
									</ComboboxItem>
								))}
								<ComboboxEmpty>No results.</ComboboxEmpty>
							</ComboboxList>
						</ComboboxCommand>
					</ComboboxContent>
				)}
			</Combobox>
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
					With Prefix Null
				</h3>
				<WithPrefixNullPreview />
			</section>
		</div>
	),
};
