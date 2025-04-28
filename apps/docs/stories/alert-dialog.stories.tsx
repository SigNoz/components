import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@signozhq/button';
import {
	AlertDialogWrapper,
	AlertDialogAction,
	AlertDialogCancel,
} from '@signozhq/alert-dialog';
import { Code } from 'lucide-react';

const meta: Meta<typeof AlertDialogWrapper> = {
	title: 'Components/Alert Dialog',
	component: AlertDialogWrapper,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AlertDialogWrapper>;

export const Default: Story = {
	args: {
		title: 'Are you absolutely sure?',
		description:
			'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
		trigger: (
			<Button variant="solid" color="primary" prefixIcon={<Code />}>
				Open Alert Dialog
			</Button>
		),
		children: (
			<div className="flex justify-end gap-2">
				<AlertDialogCancel asChild>
					<Button variant="outlined" color="secondary">
						Cancel
					</Button>
				</AlertDialogCancel>
				<AlertDialogAction asChild>
					<Button variant="solid" color="destructive">
						Delete Account
					</Button>
				</AlertDialogAction>
			</div>
		),
	},
};

export const Controlled: Story = {
	render: () => {
		const [open, setOpen] = React.useState(false);

		const handleClose = () => {
			setOpen(false);
		};

		const handleAction = () => {
			// Perform the action here
			console.log('Action performed');
			setOpen(false);
		};

		return (
			<AlertDialogWrapper
				open={open}
				onOpenChange={setOpen}
				title="Delete Account"
				description="Are you sure you want to delete your account? This action cannot be undone."
				trigger={
					<Button variant="solid" color="destructive">
						Delete Account
					</Button>
				}
			>
				<div className="flex justify-end gap-2">
					<Button variant="outlined" color="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="solid" color="destructive" onClick={handleAction}>
						Delete Account
					</Button>
				</div>
			</AlertDialogWrapper>
		);
	},
};
