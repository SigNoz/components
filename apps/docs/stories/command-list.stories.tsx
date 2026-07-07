import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import styles from './command-list.stories.module.css';
import { listArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandList> = {
	title: 'Primitive Components/Command/CommandList',
	component: CommandList,
	argTypes: listArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandList>;

export const Default: Story = {
	render: (args) => (
		<div className={styles.container}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList {...args}>
					<CommandGroup heading="General">
						<CommandItem onSelect={() => {}}>Open settings</CommandItem>
						<CommandItem onSelect={() => {}}>Toggle sidebar</CommandItem>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
