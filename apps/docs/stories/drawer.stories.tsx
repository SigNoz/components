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
import { AnimatePresence } from 'motion/react';
import React from 'react';
import { overlayArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof Drawer> = {
	title: 'Components/Drawer',
	component: Drawer,
	argTypes: overlayArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const DrawerPositionVariant = ({
	args,
	direction,
}: {
	args: Story['args'];
	direction: 'left' | 'right' | 'top' | 'bottom';
}) => {
	const [open, setOpen] = React.useState<boolean | undefined>(false);

	return (
		<Drawer
			{...args}
			open={args?.open ?? open}
			onOpenChange={(next) => {
				setOpen(next);
				args?.onOpenChange?.(next);
			}}
		>
			<DrawerTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					From {direction}
				</Button>
			</DrawerTrigger>
			<AnimatePresence>
				{open && (
					<DrawerContent key={`drawer-${direction}`} direction={direction} forceMount>
						<DrawerHeader>
							<DrawerTitle>Drawer from {direction}</DrawerTitle>
							<DrawerCloseButton />
						</DrawerHeader>
						<DrawerDescription>
							Drawer content goes here. Use the primitive drawer components for full control.
						</DrawerDescription>
						<DrawerFooter>
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
						</DrawerFooter>
					</DrawerContent>
				)}
			</AnimatePresence>
		</Drawer>
	);
};

export const Default: Story = {
	args: {
		defaultOpen: false,
	},
	render: (args) => (
		<div className="flex flex-wrap gap-4 p-8">
			{(['left', 'right', 'top', 'bottom'] as const).map((dir) => (
				<DrawerPositionVariant key={dir} args={args} direction={dir} />
			))}
		</div>
	),
};

export const WithoutOverlay: Story = {
	args: {
		...Default.args,
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
				<AnimatePresence>
					{open && (
						<DrawerContent key="drawer-no-overlay" showOverlay={false} forceMount>
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
							</DrawerFooter>
						</DrawerContent>
					)}
				</AnimatePresence>
			</Drawer>
		);
	},
};
