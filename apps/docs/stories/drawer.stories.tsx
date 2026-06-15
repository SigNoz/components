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
	title: 'Primitive Components/Drawer',
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

function DrawerWithoutOverlay() {
	const [open, setOpen] = React.useState<boolean | undefined>(false);

	return (
		<Drawer defaultOpen={false} open={open} onOpenChange={setOpen}>
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
							<p style={{ fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.25rem' }}>
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
}

export const Default: Story = {
	args: {
		defaultOpen: false,
	},
	render: (args) => (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2rem' }}>
			{(['left', 'right', 'top', 'bottom'] as const).map((dir) => (
				<DrawerPositionVariant key={dir} args={args} direction={dir} />
			))}
		</div>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Without Overlay
				</h3>
				<DrawerWithoutOverlay />
			</section>
		</div>
	),
};
