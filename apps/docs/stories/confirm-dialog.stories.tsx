import { Button, ButtonColor, ButtonVariant, ConfirmDialog } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { confirmArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof ConfirmDialog> = {
	title: 'Components/Dialog/ConfirmDialog',
	component: ConfirmDialog,
	argTypes: confirmArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
	args: {
		title: 'Confirm action',
		children: 'Are you sure you want to proceed? This action cannot be undone.',
		cancelText: 'Cancel',
		confirmText: 'Confirm',
		confirmColor: 'destructive',
		width: 'narrow',
	},
	render: (args) => {
		const [open, setOpen] = React.useState(false);

		return (
			<>
				<Button
					variant={ButtonVariant.Solid}
					color={ButtonColor.Primary}
					onClick={() => setOpen(true)}
				>
					Open confirm dialog
				</Button>
				<ConfirmDialog
					{...args}
					open={open}
					onOpenChange={setOpen}
					onCancel={() => setOpen(false)}
					onConfirm={() => {
						setOpen(false);
						return true;
					}}
				/>
			</>
		);
	},
};
