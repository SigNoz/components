import { Button, ButtonColor, ButtonVariant, DrawerWrapper } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { wrapperArgTypes } from './shared/dialog-drawer-arg-types.js';

const { width, titleIcon, ...sharedWrapperArgTypes } = wrapperArgTypes ?? {};

const meta: Meta<typeof DrawerWrapper> = {
	title: 'Components/Drawer/DrawerWrapper',
	component: DrawerWrapper,
	argTypes: {
		...sharedWrapperArgTypes,
		direction: {
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			description: 'The direction the drawer opens from.',
			table: {
				category: 'Appearance',
				type: { summary: '"left" | "right" | "top" | "bottom"' },
				defaultValue: { summary: 'right' },
			},
		},
		width: {
			control: 'select',
			options: ['narrow', 'base', 'wide', 'extra-wide'],
			description: 'The width of the dialog surface.',
			table: {
				category: 'Appearance',
				type: { summary: '"narrow" | "base" | "wide" | "extra-wide"' },
				defaultValue: { summary: 'base' },
			},
		},
		drawerContentProps: {
			control: 'object',
			description: 'Props passed to the DrawerContent component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: 'Omit<DrawerContentProps, ...>' },
			},
		},
		drawerHeaderProps: {
			control: 'object',
			description: 'Props passed to the DrawerHeader component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: "Omit<DrawerHeaderProps, 'children'>" },
			},
		},
		drawerTitleProps: {
			control: 'object',
			description: 'Props passed to the DrawerTitle component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: "Omit<DrawerTitleProps, 'children'>" },
			},
		},
		drawerSubtitleProps: {
			control: 'object',
			description: 'Props passed to the DrawerSubtitle component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: "Omit<DrawerSubtitleProps, 'children'>" },
			},
		},
		drawerDescriptionProps: {
			control: 'object',
			description: 'Props passed to the DrawerDescription component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: "Omit<DrawerDescriptionProps, 'children'>" },
			},
		},
		drawerFooterProps: {
			control: 'object',
			description: 'Props passed to the DrawerFooter component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: "Omit<DrawerFooterProps, 'children'>" },
			},
		},
		closeButtonProps: {
			control: 'object',
			description: 'Props passed to the DialogCloseButton component.',
			table: {
				category: 'Sub-component Props',
				type: { summary: "Omit<DialogCloseButtonProps, 'onClick'>" },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerWrapper>;

export const Default: Story = {
	args: {
		title: 'Drawer header',
		subTitle: 'Use DrawerWrapper for common header / content / footer layouts.',
		children: (
			<p>
				Place your main drawer content here. Use the primitive Drawer components when you need
				lower-level control.
			</p>
		),
		footer: (
			<div className="flex gap-2 justify-end">
				<Button variant={ButtonVariant.Ghost}>Cancel</Button>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Save
				</Button>
			</div>
		),
		direction: 'right',
		showCloseButton: true,
		disableOutsideClick: false,
		showOverlay: true,
	},
	render: (args) => {
		const [open, setOpen] = React.useState(false);
		return (
			<DrawerWrapper
				{...args}
				open={open}
				onOpenChange={setOpen}
				trigger={
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open drawer
					</Button>
				}
				footer={
					<div className="flex gap-2 justify-end">
						<Button variant="ghost" color="none" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							onClick={() => setOpen(false)}
						>
							Save
						</Button>
					</div>
				}
			/>
		);
	},
};
