import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@signozhq/button';
import { DrawerWrapper } from '@signozhq/drawer';

const meta: Meta<typeof DrawerWrapper> = {
	title: 'Components/Drawer',
	component: DrawerWrapper,
	tags: ['autodocs'],
	argTypes: {
		trigger: {
			description: 'The element that triggers the drawer to open',
			control: false,
		},
		type: {
			description: 'Panel or Drawer',
			control: 'select',
			options: ['drawer', 'panel'],
			defaultValue: 'drawer',
		},
		header: {
			description: 'Header configuration with title and optional description',
			control: 'object',
		},
		content: {
			description: 'The main content of the drawer',
			control: false,
		},
		footer: {
			description: 'Optional footer content',
			control: false,
		},
		direction: {
			description: 'The direction the drawer opens from',
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			defaultValue: 'right',
		},
		showCloseButton: {
			description: 'Whether to show the close button in header',
			control: 'boolean',
			defaultValue: true,
		},
		allowOutsideClick: {
			description: 'Whether clicking outside closes the drawer',
			control: 'boolean',
			defaultValue: true,
		},
		showOverlay: {
			description: 'Whether to show the overlay behind the drawer',
			control: 'boolean',
			defaultValue: true,
		},
		className: {
			description: 'Additional CSS classes',
			control: 'text',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DrawerWrapper>;

export const SideDrawer: Story = {
	args: {
		trigger: <Button variant="outlined">Open Drawer</Button>,
		header: {
			title: 'Drawer Header',
			description: 'This is a description of the drawer content',
		},
		content: (
			<div className="p-4 w-full">
				<h2 className="text-lg font-semibold">Content Title</h2>
				<p className="text-sm text-gray-500">
					This is the main content area of the drawer.
				</p>
			</div>
		),
		footer: (
			<div className="flex gap-2">
				<Button>Submit</Button>
				<Button variant="outlined">Cancel</Button>
			</div>
		),
		direction: 'right',
		showCloseButton: true,
		allowOutsideClick: true,
		showOverlay: true,
	},
};

export const SidePanel: Story = {
	args: {
		trigger: <Button variant="outlined">Open Panel</Button>,
		header: {
			title: 'Panel Header',
			description: 'This is a description of the panel content',
		},
		content: (
			<div className="p-4 w-full">
				<h2 className="text-lg font-semibold">Content Title</h2>
				<p className="text-sm text-gray-500">
					This is the main content area of the panel.
				</p>
			</div>
		),
		footer: (
			<div className="flex gap-2">
				<Button>Submit</Button>
				<Button variant="outlined">Cancel</Button>
			</div>
		),
		type: 'panel',
		direction: 'right',
		showCloseButton: true,
		allowOutsideClick: true,
		showOverlay: true,
	},
};
