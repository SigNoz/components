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
import React from 'react';

const meta: Meta<typeof Dialog> = {
	title: 'Components/Dialog/Dialog',
	component: Dialog,
	argTypes: {
		open: {
			control: 'boolean',
			description:
				'The controlled open state of the dialog. Must be used together with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultOpen: {
			control: 'boolean',
			description:
				'The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		modal: {
			control: 'boolean',
			description:
				'The modality of the dialog. When true, interaction with outside elements is disabled and only dialog content is visible to screen readers.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state of the dialog changes.',
			table: {
				category: 'Events',
				type: { summary: '(open: boolean) => void' },
			},
		},
		children: {
			control: false,
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
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
				<DialogContent width="base">
					<DialogHeader>
						<DialogTitle>Dialog title</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="text-sm font-normal leading-5 font-inter font-regular">
							Dialog content goes here. Use the primitive dialog components for full control.
						</p>
					</DialogDescription>
					<DialogFooter>
						<Button variant={ButtonVariant.Ghost} color="secondary" onClick={() => setOpen(false)}>
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
			</Dialog>
		);
	},
};
