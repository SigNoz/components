import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { contentArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogContent> = {
	title: 'Primitive Components/Dialog/DialogContent',
	component: DialogContent,
	argTypes: contentArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

export const Default: Story = {
	args: {
		width: 'base',
		position: 'center',
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent {...args}>
				<DialogHeader>
					<DialogTitle>Dialog content</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<Typography size="sm">
						This story focuses on the DialogContent surface and its layout-related props.
					</Typography>
				</DialogDescription>
				<DialogFooter>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Secondary action
					</Button>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Primary action
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
