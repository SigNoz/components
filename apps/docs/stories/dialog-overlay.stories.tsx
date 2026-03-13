import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { overlayComponentArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogOverlay> = {
	title: 'Components/Dialog/DialogOverlay',
	component: DialogOverlay,
	argTypes: overlayComponentArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogOverlay>;

export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogPortal>
				<DialogOverlay {...args} />
				<DialogContent width="base">
					<DialogHeader>
						<DialogTitle>Dialog overlay</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="text-sm font-normal leading-5 font-inter font-regular">
							The overlay dims the background and blocks interaction with the page while the dialog
							is open.
						</p>
					</DialogDescription>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	),
};
