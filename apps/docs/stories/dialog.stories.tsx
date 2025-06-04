import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@signozhq/button';
import { DialogWrapper } from '@signozhq/dialog';
import { Code } from 'lucide-react';

const meta: Meta<typeof DialogWrapper> = {
	title: 'Components/Dialog',
	component: DialogWrapper,
	tags: ['autodocs'],
	argTypes: {
		width: {
			control: 'select',
			options: ['narrow', 'base', 'wide', 'extra-wide'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof DialogWrapper>;

export const Default: Story = {
	args: {
		title: 'Edit report details',
		width: 'base',
		trigger: (
			<Button variant="solid" color="primary">
				Open Dialog
			</Button>
		),
		children: <div style={{ height: '70vh' }} />,
	},
};

export const Controlled: Story = {
	render: () => {
		const [open, setOpen] = React.useState(false);

		return (
			<DialogWrapper
				open={open}
				onOpenChange={setOpen}
				title="Controlled Dialog"
				titleIcon={<Code size={16} />}
				trigger={
					<Button variant="solid" color="primary">
						Open Controlled Dialog
					</Button>
				}
			>
				<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
					<p>Dialog content goes here</p>
					<div className="flex justify-end">
						<Button variant="solid" color="primary" onClick={() => setOpen(false)}>
							Close Dialog
						</Button>
					</div>
				</div>
			</DialogWrapper>
		);
	},
};

export const AlertDialog: Story = {
	render: () => {
		const [open, setOpen] = React.useState(false);

		const handleClose = () => {
			setOpen(false);
		};

		const handleAction = () => {
			console.log('Action performed');
			setOpen(false);
		};

		return (
			<DialogWrapper
				open={open}
				onOpenChange={setOpen}
				title="Are you absolutely sure?"
				trigger={
					<Button variant="solid" color="primary" prefixIcon={<Code />}>
						Open Alert Dialog
					</Button>
				}
				disableOutsideClick={true}
				showCloseButton={false}
			>
				<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
					This action cannot be undone. This will permanently delete your account and
					remove your data from our servers.
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button variant="outlined" color="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="solid" color="destructive" onClick={handleAction}>
						Delete Account
					</Button>
				</div>
			</DialogWrapper>
		);
	},
};
