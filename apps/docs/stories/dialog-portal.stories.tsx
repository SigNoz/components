import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { portalArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogPortal> = {
	title: 'Primitive Components/Dialog/DialogPortal',
	component: DialogPortal,
	argTypes: portalArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogPortal>;

export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogPortal {...args}>
				<DialogContent width="base">
					<DialogHeader>
						<DialogTitle>Dialog portal</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p
							style={{
								fontSize: '0.875rem',
								fontWeight: 400,
								lineHeight: '1.25rem',
								fontFamily: 'Inter, sans-serif',
							}}
						>
							DialogPortal controls where in the DOM the dialog is rendered (by default,
							document.body).
						</p>
					</DialogDescription>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	),
};
