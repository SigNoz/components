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

const meta: Meta<typeof ComboboxTrigger> = {
	title: 'Components/Combobox/ComboboxTrigger',
	component: ComboboxTrigger,
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Text shown when no value is selected.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description: 'The selected value label displayed in the trigger.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, disables the trigger.',
			table: { category: 'State', type: { summary: 'boolean' } },
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
type Story = StoryObj<typeof ComboboxTrigger>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {
		placeholder: 'Select a framework...',
		value: '',
		disabled: false,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);
		const displayValue =
			args.value !== undefined
				? args.value
				: frameworks.find((f) => f.value === value)?.label || '';

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						{...args}
						value={displayValue}
						placeholder={args.placeholder}
						disabled={args.disabled}
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
