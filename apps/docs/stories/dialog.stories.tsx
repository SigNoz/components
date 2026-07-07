import { Code } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogWrapper,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatePresence } from 'motion/react';
import React from 'react';
import styles from './dialog.stories.module.css';
import { overlayArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof Dialog> = {
	title: 'Primitive Components/Dialog',
	component: Dialog,
	argTypes: overlayArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
	args: {
		defaultOpen: false,
	},
	render: (args) => {
		const [open, setOpen] = React.useState<boolean | undefined>(args.open ?? args.defaultOpen);

		return (
			<Dialog
				{...args}
				open={args.open ?? open}
				onOpenChange={(next) => {
					setOpen(next);
					args.onOpenChange?.(next);
				}}
			>
				<DialogTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open dialog
					</Button>
				</DialogTrigger>
				<AnimatePresence>
					{open && (
						<DialogContent key="dialog" width="base" forceMount>
							<DialogHeader>
								<DialogTitle>Edit report details</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								<div className="story-column">
									<Typography size="sm">
										Dialog content goes here. Use the primitive dialog components for full control.
									</Typography>
									<div className={styles.flexEnd}>
										<Button
											variant={ButtonVariant.Solid}
											color={ButtonColor.Primary}
											onClick={() => setOpen(false)}
										>
											Save Changes
										</Button>
									</div>
								</div>
							</DialogDescription>
						</DialogContent>
					)}
				</AnimatePresence>
			</Dialog>
		);
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
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open Controlled Dialog
					</Button>
				}
				footer={
					<Button
						variant={ButtonVariant.Solid}
						color={ButtonColor.Primary}
						onClick={() => setOpen(false)}
					>
						Close Dialog
					</Button>
				}
			>
				<div className="story-column">
					<Typography size="sm">
						Dialog content goes here. Uses AnimatePresence for exit animation.
					</Typography>
				</div>
			</DialogWrapper>
		);
	},
};

export const WidthVariants: Story = {
	render: () => {
		const [open, setOpen] = React.useState<string | null>(null);
		const widths = ['narrow', 'base', 'wide', 'extra-wide'] as const;

		return (
			<div className="story-grid">
				{widths.map((width) => (
					<DialogWrapper
						key={width}
						open={open === width}
						onOpenChange={(isOpen: boolean) => setOpen(isOpen ? width : null)}
						title={`${width.charAt(0).toUpperCase() + width.slice(1)} width`}
						width={width}
						trigger={
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
								Open {width}
							</Button>
						}
					>
						<div className="story-column">
							<Typography size="sm">This dialog uses the {width} width variant.</Typography>
							<div className={styles.flexEnd}>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Primary}
									onClick={() => setOpen(null)}
								>
									Close
								</Button>
							</div>
						</div>
					</DialogWrapper>
				))}
			</div>
		);
	},
};

export const PositionVariants: Story = {
	render: () => {
		const [open, setOpen] = React.useState<'center' | 'top' | 'left' | 'right' | 'bottom' | null>(
			null,
		);

		return (
			<div className="story-grid">
				{(['center', 'top', 'left', 'right', 'bottom'] as const).map((position) => (
					<Dialog
						key={position}
						open={open === position}
						onOpenChange={(v) => setOpen(v ? position : null)}
					>
						<DialogTrigger asChild>
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
								Open {position}
							</Button>
						</DialogTrigger>
						<AnimatePresence>
							{open === position && (
								<DialogContent
									key={`dialog-${position}`}
									position={position}
									width="base"
									forceMount
									onPointerDownOutside={() => setOpen(null)}
								>
									<DialogHeader>
										<DialogTitle>
											{position.charAt(0).toUpperCase() + position.slice(1)} dialog
										</DialogTitle>
									</DialogHeader>
									<DialogDescription>
										<div className="story-column">
											<Typography size="sm">This dialog is positioned at {position}.</Typography>
										</div>
									</DialogDescription>
									<DialogFooter>
										<Button
											variant={ButtonVariant.Solid}
											color={ButtonColor.Primary}
											onClick={() => setOpen(null)}
										>
											Close
										</Button>
									</DialogFooter>
								</DialogContent>
							)}
						</AnimatePresence>
					</Dialog>
				))}
			</div>
		);
	},
};

PositionVariants.decorators = [
	(Story) => (
		<div className={styles.minHeightContainer}>
			<Story />
		</div>
	),
];

export const WithoutCloseButton: Story = {
	render: () => (
		<DialogWrapper
			title="Dialog without close button"
			showCloseButton={false}
			trigger={
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open Dialog
				</Button>
			}
		>
			<div className="story-column">
				<Typography size="sm">
					This dialog has no close (X) button. Use the button below or click outside to close.
				</Typography>
				<div className={styles.flexEnd}>
					<DialogClose asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Close
						</Button>
					</DialogClose>
				</div>
			</div>
		</DialogWrapper>
	),
};

export const Primitive: Story = {
	render: () => {
		const [open, setOpen] = React.useState(false);

		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Open primitive dialog
					</Button>
				</DialogTrigger>
				<AnimatePresence>
					{open && (
						<DialogContent key="dialog-primitive" width="base" forceMount>
							<DialogHeader>
								<DialogTitle icon={<Code size={16} />}>Primitive composition</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								<Typography size="sm">
									Use Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
									DialogDescription and DialogFooter for full control.
								</Typography>
							</DialogDescription>
							<DialogFooter>
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
							</DialogFooter>
						</DialogContent>
					)}
				</AnimatePresence>
			</Dialog>
		);
	},
};
