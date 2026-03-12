import {
	Button,
	ButtonColor,
	ButtonVariant,
	Drawer,
	DrawerCloseButton,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Drawer> = {
	title: 'Components/Drawer',
	component: Drawer,
	argTypes: {
		open: {
			control: 'boolean',
			description:
				'The controlled open state of the drawer. Must be used together with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultOpen: {
			control: 'boolean',
			description:
				'The open state of the drawer when it is initially rendered. Use when you do not need to control its open state.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		modal: {
			control: 'boolean',
			description:
				'The modality of the drawer. When true, interaction with outside elements is disabled and focus is trapped.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		direction: {
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			description: 'The side of the viewport from which the drawer appears.',
			table: {
				category: 'Appearance',
				type: { summary: '"left" | "right" | "top" | "bottom"' },
				defaultValue: { summary: 'right' },
			},
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state of the drawer changes.',
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
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
	args: {
		defaultOpen: false,
		modal: true,
		direction: 'right',
	},
	render: (args) => {
		const [open, setOpen] = React.useState<boolean | undefined>(args.open ?? args.defaultOpen);

		return (
			<Drawer
				{...args}
				open={args.open ?? open}
				onOpenChange={(next) => {
					setOpen(next);
					args.onOpenChange?.(next);
				}}
			>
				<DrawerTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open drawer
					</Button>
				</DrawerTrigger>
				<DrawerContent type="drawer">
					<DrawerHeader>
						<DrawerTitle>Drawer title</DrawerTitle>
						<DrawerCloseButton />
					</DrawerHeader>
					<DrawerDescription>
						<p className="text-sm font-normal leading-5">
							Drawer content goes here. Use the primitive drawer components for full control.
						</p>
					</DrawerDescription>
					<DrawerFooter>
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
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	},
};

export const FromLeft: Story = {
	args: {
		...Default.args,
		direction: 'left',
	},
	render: Default.render,
};

export const FromTop: Story = {
	args: {
		...Default.args,
		direction: 'top',
	},
	render: Default.render,
};

export const FromBottom: Story = {
	args: {
		...Default.args,
		direction: 'bottom',
	},
	render: Default.render,
};

export const PanelType: Story = {
	args: {
		...Default.args,
		direction: 'right',
	},
	render: (args) => {
		const [openDrawer, setOpenDrawer] = React.useState<boolean | undefined>(
			args.open ?? args.defaultOpen
		);
		const [openPanel, setOpenPanel] = React.useState<boolean | undefined>(
			args.open ?? args.defaultOpen
		);

		return (
			<>
				<Drawer
					{...args}
					open={openDrawer}
					onOpenChange={(next) => {
						setOpenDrawer(next);
					}}
				>
					<DrawerTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Open type=drawer
						</Button>
					</DrawerTrigger>
					<DrawerContent type="drawer">
						<DrawerHeader>
							<DrawerTitle>Type drawer</DrawerTitle>
							<DrawerCloseButton />
						</DrawerHeader>
						<DrawerDescription>
							This variant uses the drawer type, which is useful for narrower, such as menus or
							dialogs.
						</DrawerDescription>
						<DrawerFooter>
							<Button
								variant={ButtonVariant.Ghost}
								color="secondary"
								onClick={() => setOpenDrawer(false)}
							>
								Cancel
							</Button>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Primary}
								onClick={() => setOpenDrawer(false)}
							>
								Save
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				<Drawer
					{...args}
					open={openPanel}
					onOpenChange={(next) => {
						setOpenPanel(next);
						args.onOpenChange?.(next);
					}}
				>
					<DrawerTrigger asChild>
						<Button className="ml-3" variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Open type=panel
						</Button>
					</DrawerTrigger>
					<DrawerContent type="panel">
						<DrawerHeader>
							<DrawerTitle>Type panel</DrawerTitle>
							<DrawerCloseButton />
						</DrawerHeader>
						<DrawerDescription>
							This variant uses the panel type, which is useful for wider, full-height layouts such
							as settings or detail views.
						</DrawerDescription>
						<DrawerFooter>
							<Button
								variant={ButtonVariant.Ghost}
								color="secondary"
								onClick={() => setOpenPanel(false)}
							>
								Cancel
							</Button>
							<Button
								variant={ButtonVariant.Solid}
								color={ButtonColor.Primary}
								onClick={() => setOpenPanel(false)}
							>
								Save
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</>
		);
	},
};

export const WithoutOverlay: Story = {
	args: {
		...Default.args,
		modal: false,
	},
	render: (args) => {
		const [open, setOpen] = React.useState<boolean | undefined>(args.open ?? args.defaultOpen);

		return (
			<Drawer
				{...args}
				open={args.open ?? open}
				onOpenChange={(next) => {
					setOpen(next);
					args.onOpenChange?.(next);
				}}
			>
				<DrawerTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open drawer without overlay
					</Button>
				</DrawerTrigger>
				<DrawerContent type="drawer" showOverlay={false}>
					<DrawerHeader>
						<DrawerTitle>Drawer without overlay</DrawerTitle>
						<DrawerCloseButton />
					</DrawerHeader>
					<DrawerDescription>
						<p className="text-sm font-normal leading-5">
							This variant keeps the background interactive by disabling the overlay while the
							drawer is open.
						</p>
					</DrawerDescription>
					<DrawerFooter>
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
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	},
};
