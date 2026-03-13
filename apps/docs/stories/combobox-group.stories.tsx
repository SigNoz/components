import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { groupArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof ComboboxGroup> = {
	title: 'Components/Combobox/ComboboxGroup',
	component: ComboboxGroup,
	argTypes: groupArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboboxGroup>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
];
const languages = [
	{ value: 'ts', label: 'TypeScript' },
	{ value: 'js', label: 'JavaScript' },
];

export const Default: Story = {
	args: {},
	render: (args) => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(true);
		const allItems = [
			{ group: 'Frameworks', items: frameworks },
			{ group: 'Languages', items: languages },
		];

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
									{allItems.map((g) => (
										<ComboboxGroup key={g.group} heading={g.group} {...args}>
											{g.items.map((item) => (
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
