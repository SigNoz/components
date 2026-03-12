import { Button, ButtonColor, ButtonVariant, ConfirmDrawer } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { confirmArgTypes } from './shared/dialog-drawer-arg-types.js';

const { position: _, ...sharedConfirmArgTypes } = confirmArgTypes ?? {};

const meta: Meta<typeof ConfirmDrawer> = {
	title: 'Components/Drawer/ConfirmDrawer',
	component: ConfirmDrawer,
	argTypes: {
		...sharedConfirmArgTypes,
		direction: {
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			description: 'The side of the viewport from which the drawer appears.',
			table: {
				category: 'Layout',
				type: { summary: '"left" | "right" | "top" | "bottom"' },
				defaultValue: { summary: 'right' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDrawer>;

export const Default: Story = {
	args: {
		title: 'Confirm action',
		children: 'Are you sure you want to proceed? This action cannot be undone.',
		cancelText: 'Cancel',
		confirmText: 'Confirm',
		confirmColor: 'destructive',
		direction: 'right',
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
					Open confirm drawer
				</Button>
				<ConfirmDrawer
					{...args}
					width="narrow"
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
