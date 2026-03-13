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

import { emptyArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof ComboboxEmpty> = {
	title: 'Components/Combobox/ComboboxEmpty',
	component: ComboboxEmpty,
	argTypes: emptyArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxEmpty>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {
		children: 'No framework found. Try a different search.',
	},
	render: (args) => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(true);

		return (
			<div className="p-8 w-full max-w-sm">
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
										>
											{f.label}
										</ComboboxItem>
									))}
									<ComboboxEmpty {...args} />
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};
