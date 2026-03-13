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

const meta: Meta<typeof Combobox> = {
	title: 'Components/Combobox/Combobox',
	component: Combobox,
	argTypes: {
		open: {
			control: 'boolean',
			description: 'The controlled open state of the combobox popover.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onOpenChange: {
			control: false,
			description: 'Callback fired when the popover open state changes.',
			table: {
				category: 'Events',
				type: { summary: '(open: boolean) => void' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

export const Default: Story = {
	args: {
		open: undefined,
	},
	render: (args) => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(args.open ?? false);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox
					open={args.open !== undefined ? args.open : open}
					onOpenChange={args.open !== undefined ? args.onOpenChange : setOpen}
				>
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
