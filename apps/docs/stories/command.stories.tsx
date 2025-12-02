import type { Meta, StoryObj } from '@storybook/react';
import { Command } from '@signozhq/command';
import { generateDocs } from '../utils/generateDocs';

const CommandExamples = [
	`import { Command } from '@signozhq/command';

export default function MyComponent() {
  return (
    <Command />
  );
}`,
];

const CommandDocs = generateDocs({
	packageName: '@signozhq/command',
	description: 'Fast, composable, unstyled command menu for React.',
	examples: CommandExamples,
});

const meta: Meta<typeof Command> = {
	title: 'Components/Command',
	component: Command,
	parameters: {
		docs: {
			description: {
				component: CommandDocs,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
	args: {
		// Add default props here
	},
};
