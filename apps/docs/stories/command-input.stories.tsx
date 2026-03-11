import { Command, CommandEmpty, CommandInput, CommandList } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof CommandInput> = {
	title: 'Components/Command/CommandInput',
	component: CommandInput,
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text displayed inside the input.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		autoFocus: {
			control: 'boolean',
			description: 'When true, focuses the input when it is mounted.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		disabled: {
			control: 'boolean',
			description: 'When true, disables user interaction with the input.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onValueChange: {
			control: false,
			description: 'Callback fired when the input value changes.',
			table: {
				category: 'Events',
				type: { summary: '(value: string) => void' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the input.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
	},
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
