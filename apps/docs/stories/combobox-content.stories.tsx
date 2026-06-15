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

const meta: Meta<typeof ComboboxContent> = {
	title: 'Primitive Components/Combobox/ComboboxContent',
	component: ComboboxContent,
	argTypes: {
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the content container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to the content container.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'Alignment of the content relative to the trigger.',
			table: { category: 'Layout', type: { summary: "'start' | 'center' | 'end'" } },
		},
		sideOffset: {
			control: 'number',
			description: 'Offset from the trigger.',
			table: { category: 'Layout', type: { summary: 'number' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxContent>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {},
	render: (args) => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(true);

		return (
			<div style={{ padding: '2rem', width: '100%', maxWidth: '24rem' }}>
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent {...args}>
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
	},
};
