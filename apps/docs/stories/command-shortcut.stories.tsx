import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

import styles from './command-shortcut.stories.module.css';
import { shortcutArgTypes } from './shared/command-combobox-arg-types.js';

const meta: Meta<typeof CommandShortcut> = {
	title: 'Primitive Components/Command/CommandShortcut',
	component: CommandShortcut,
	argTypes: shortcutArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandShortcut>;

export const Default: Story = {
	args: {
		children: '⌘K',
	},
	render: (args) => (
		<div className={styles.container}>
			<Command>
				<CommandInput placeholder="Search commands…" />
				<CommandList>
					<CommandGroup heading="Keyboard">
						<CommandItem onSelect={() => {}}>
							Open command palette
							<CommandShortcut {...args} />
						</CommandItem>
					</CommandGroup>
					<CommandEmpty>No results.</CommandEmpty>
				</CommandList>
			</Command>
		</div>
	),
};
