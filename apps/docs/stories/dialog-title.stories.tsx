import { Code } from '@signozhq/icons';
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
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { titleArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogTitle> = {
	title: 'Primitive Components/Dialog/DialogTitle',
	component: DialogTitle,
	argTypes: titleArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogTitle>;

export const Default: Story = {
	args: {
		children: 'Dialog title',
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
					<DialogTitle {...args} />
				</DialogHeader>
				<DialogDescription>
					<Typography size="sm">
						The title labels the dialog content for assistive technologies.
					</Typography>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};

export const WithIcon: Story = {
	args: {
		children: 'Dialog with icon',
		icon: <Code size={16} />,
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
					<DialogTitle {...args} />
				</DialogHeader>
				<DialogDescription>
					<Typography size="sm">
						Use the icon prop to visually differentiate dialog types.
					</Typography>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};
