import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { commandArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof Command> = {
	title: 'Components/Command/Command',
	component: Command,
	argTypes: commandArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
	args: {
		value: '',
	},
	render: (args) => {
		const [value, setValue] = React.useState(args.value ?? '');

		return (
			<div style={{ width: 520 }}>
				<Command
					value={value}
					onValueChange={(next) => {
						setValue(next);
						args.onValueChange?.(next);
					}}
					className={args.className}
				>
					<CommandInput placeholder="Search commands…" />
					<CommandList>
						<CommandGroup heading="General">
							<CommandItem onSelect={() => {}}>Open settings</CommandItem>
							<CommandItem onSelect={() => {}}>Toggle sidebar</CommandItem>
						</CommandGroup>
						<CommandEmpty>No results.</CommandEmpty>
					</CommandList>
				</Command>
			</div>
		);
	},
};
