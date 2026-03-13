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
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatePresence } from 'motion/react';
import React from 'react';
import { overlayArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof Dialog> = {
	title: 'Components/Dialog/Dialog',
	component: Dialog,
	argTypes: overlayArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
	args: {
		defaultOpen: false,
		modal: true,
	},
	render: (args) => {
		const [open, setOpen] = React.useState<boolean | undefined>(args.open ?? args.defaultOpen);

		return (
			<Dialog
				{...args}
				open={args.open ?? open}
				onOpenChange={(next) => {
					setOpen(next);
					args.onOpenChange?.(next);
				}}
			>
				<DialogTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open dialog
					</Button>
				</DialogTrigger>
				<AnimatePresence>
					{(args.open ?? open) && (
						<DialogContent key="dialog" width="base" forceMount>
							<DialogHeader>
								<DialogTitle>Dialog title</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								<p className="text-sm font-normal leading-5 font-inter font-regular">
									Dialog content goes here. Use the primitive dialog components for full control.
								</p>
							</DialogDescription>
							<DialogFooter>
								<Button
									variant={ButtonVariant.Ghost}
									color="secondary"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Primary}
									onClick={() => setOpen(false)}
								>
									Confirm
								</Button>
							</DialogFooter>
						</DialogContent>
					)}
				</AnimatePresence>
			</Dialog>
		);
	},
};
