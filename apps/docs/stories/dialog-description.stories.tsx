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
import { descriptionArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogDescription> = {
	title: 'Components/Dialog/DialogDescription',
	component: DialogDescription,
	argTypes: descriptionArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogDescription>;

export const Default: Story = {
	args: {
		children: 'Are you sure you want to proceed? This action cannot be undone.',
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle>Confirm action</DialogTitle>
				</DialogHeader>
				<DialogDescription {...args} />
			</DialogContent>
		</Dialog>
	),
};
