import { Command, CommandEmpty, CommandInput, CommandList } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { inputArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandInput> = {
	title: 'Components/Command/CommandInput',
	component: CommandInput,
	argTypes: inputArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandInput>;

export const Default: Story = {
	args: {
		placeholder: 'Search commands…',
		autoFocus: false,
	},
	render: (args) => {
		const [query, setQuery] = React.useState('');

		return (
			<div style={{ width: 520 }}>
				<Command>
					<CommandInput
						{...args}
						onValueChange={(value: string) => {
							setQuery(value);
							args.onValueChange?.(value);
						}}
					/>
					<CommandList>
						<CommandEmpty>
							No results for <strong>{query || 'your query'}</strong>.
						</CommandEmpty>
					</CommandList>
				</Command>
			</div>
		);
	},
};
