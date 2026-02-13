import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonColor, ButtonVariant } from '@signozhq/button';
import { DrawerWrapper } from '@signozhq/drawer';
import { generateDocs } from '../utils/generateDocs';

const drawerExamples = [
	`import { DrawerWrapper } from '@signozhq/drawer';
import { Button } from '@signozhq/button';

export default function MyComponent() {
	return (
		<DrawerWrapper
			trigger={<Button variant="outlined">Open Drawer</Button>}
			header={{
				title: "Drawer Title",
				description: "This is a description of the drawer content"
			}}
			content={
				<div className="p-4">
					<p>Main content of the drawer goes here</p>
				</div>
			}
			footer={
				<div className="flex gap-2">
					<Button>Save</Button>
					<Button variant="outlined">Cancel</Button>
				</div>
			}
			direction="right"
		/>
	);
}`,
	`// Controlled mode - programmatic open/close
import { useState } from 'react';
import { DrawerWrapper } from '@signozhq/drawer';
import { Button } from '@signozhq/button';

export default function ControlledDrawer() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open</Button>
			<DrawerWrapper
				open={open}
				onOpenChange={setOpen}
				trigger={<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>Or click here</Button>}
				header={{ title: "Controlled Drawer" }}
				content={<div className="p-4">Content</div>}
			/>
		</>
	);
}`,
];

const drawerDocs = generateDocs({
	packageName: '@signozhq/drawer',
	description:
		'A customizable drawer component that slides in from any edge of the screen with support for header, content, and footer sections.',
	examples: drawerExamples,
});

const meta: Meta<typeof DrawerWrapper> = {
	title: 'Components/Drawer',
	component: DrawerWrapper,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: drawerDocs,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		trigger: {
			description:
				'The element that triggers the drawer to open. Optional when using controlled mode (open/onOpenChange).',
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
		open: {
			description:
				'Controlled open state. When provided with onOpenChange, enables programmatic control of drawer visibility.',
			control: 'boolean',
		},
		onOpenChange: {
			description:
				'Called when drawer open state changes (close button, outside click, ESC). Required when using controlled mode (open prop).',
			action: 'onOpenChange',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DrawerWrapper>;

export const SideDrawer: Story = {
	args: {
		trigger: (
			<Button variant={ButtonVariant.Outlined} color={ButtonColor.Primary}>
				Open Drawer
			</Button>
		),
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
				<Button variant={ButtonVariant.Outlined} color={ButtonColor.Primary}>
					Cancel
				</Button>
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
		trigger: (
			<Button variant={ButtonVariant.Outlined} color={ButtonColor.Primary}>
				Open Panel
			</Button>
		),
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
				<Button variant={ButtonVariant.Outlined} color={ButtonColor.Primary}>
					Cancel
				</Button>
			</div>
		),
		type: 'panel',
		direction: 'right',
		showCloseButton: true,
		allowOutsideClick: true,
		showOverlay: true,
	},
};

export const Controlled: Story = {
	render: (args) => {
		const [open, setOpen] = React.useState(false);
		return (
			<div className="flex gap-2">
				<Button
					variant={ButtonVariant.Solid}
					color={ButtonColor.Primary}
					onClick={() => setOpen(true)}
				>
					Open Programmatically
				</Button>
				<DrawerWrapper {...args} open={open} onOpenChange={setOpen} />
			</div>
		);
	},
	args: {
		trigger: (
			<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
				Or Open via Trigger
			</Button>
		),

		header: {
			title: 'Controlled Drawer',
			description: 'Can be opened from a button outside or via the trigger',
		},

		content: (
			<div className="p-4 w-full">
				<p className="text-sm">
					Visibility is controlled by the parent via open/onOpenChange.
				</p>
			</div>
		),

		direction: 'right',
		showCloseButton: true,
		allowOutsideClick: true,
		showOverlay: true,
		open: true,
	},
};
