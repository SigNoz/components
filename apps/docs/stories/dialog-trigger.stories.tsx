import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { triggerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogTrigger> = {
	title: 'Components/Dialog/DialogTrigger',
	component: DialogTrigger,
	argTypes: triggerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger {...args}>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle>Dialog with custom trigger</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Use DialogTrigger asChild to wrap any interactive element that should open the dialog.
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};
