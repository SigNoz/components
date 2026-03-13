import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxSeparator,
	ComboboxTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { separatorArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof ComboboxSeparator> = {
	title: 'Components/Combobox/ComboboxSeparator',
	component: ComboboxSeparator,
	argTypes: separatorArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxSeparator>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
];
const languages = [
	{ value: 'ts', label: 'TypeScript' },
	{ value: 'js', label: 'JavaScript' },
];

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(true);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select an option..."
						value={[...frameworks, ...languages].find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search..." />
								<ComboboxList>
									<ComboboxGroup heading="Frameworks">
										{frameworks.map((item) => (
											<ComboboxItem
												key={item.value}
												value={item.value}
												onSelect={() => {
													setValue(item.value);
													setOpen(false);
												}}
												isSelected={value === item.value}
											>
												{item.label}
											</ComboboxItem>
										))}
									</ComboboxGroup>

									<ComboboxSeparator {...args} />

									<ComboboxGroup heading="Languages">
										{languages.map((item) => (
											<ComboboxItem
												key={item.value}
												value={item.value}
												onSelect={() => {
													setValue(item.value);
													setOpen(false);
												}}
												isSelected={value === item.value}
											>
												{item.label}
											</ComboboxItem>
										))}
									</ComboboxGroup>

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
