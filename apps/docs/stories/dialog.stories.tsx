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
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatePresence } from 'motion/react';
import React from 'react';
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
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '1rem',
										fontSize: '0.875rem',
										fontWeight: 400,
										lineHeight: '1.25rem',
										fontFamily: 'Inter, sans-serif',
									}}
								>
									<p>
										Dialog content goes here. Use the primitive dialog components for full control.
									</p>
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => {
		function ControlledSection() {
			const [controlledOpen, setControlledOpen] = React.useState(false);

			return (
				<DialogWrapper
					open={controlledOpen}
					onOpenChange={setControlledOpen}
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
							onClick={() => setControlledOpen(false)}
						>
							Close Dialog
						</Button>
					}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							fontSize: '0.875rem',
							fontWeight: 400,
							lineHeight: '1.25rem',
							fontFamily: 'Inter, sans-serif',
						}}
					>
						<p>Dialog content goes here. Uses AnimatePresence for exit animation.</p>
					</div>
				</DialogWrapper>
			);
		}

		function WidthVariantsSection() {
			const [widthOpen, setWidthOpen] = React.useState<string | null>(null);
			const widths = ['narrow', 'base', 'wide', 'extra-wide'] as const;

			return (
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
					{widths.map((width) => (
						<DialogWrapper
							key={width}
							open={widthOpen === width}
							onOpenChange={(isOpen: boolean) => setWidthOpen(isOpen ? width : null)}
							title={`${width.charAt(0).toUpperCase() + width.slice(1)} width`}
							width={width}
							trigger={
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
									Open {width}
								</Button>
							}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
									fontSize: '0.875rem',
									fontWeight: 400,
									lineHeight: '1.25rem',
									fontFamily: 'Inter, sans-serif',
								}}
							>
								<p>This dialog uses the {width} width variant.</p>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Primary}
										onClick={() => setWidthOpen(null)}
									>
										Close
									</Button>
								</div>
							</div>
						</DialogWrapper>
					))}
				</div>
			);
		}

		function PositionVariantsSection() {
			const [positionOpen, setPositionOpen] = React.useState<
				'center' | 'top' | 'left' | 'right' | 'bottom' | null
			>(null);

			return (
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
					{(['center', 'top', 'left', 'right', 'bottom'] as const).map((position) => (
						<Dialog
							key={position}
							open={positionOpen === position}
							onOpenChange={(v) => setPositionOpen(v ? position : null)}
						>
							<DialogTrigger asChild>
								<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
									Open {position}
								</Button>
							</DialogTrigger>
							<AnimatePresence>
								{positionOpen === position && (
									<DialogContent
										key={`dialog-${position}`}
										position={position}
										width="base"
										forceMount
										onPointerDownOutside={() => setPositionOpen(null)}
									>
										<DialogHeader>
											<DialogTitle>
												{position.charAt(0).toUpperCase() + position.slice(1)} dialog
											</DialogTitle>
										</DialogHeader>
										<DialogDescription>
											<div
												style={{
													display: 'flex',
													flexDirection: 'column',
													gap: '1rem',
													fontSize: '0.875rem',
													fontWeight: 400,
													lineHeight: '1.25rem',
													fontFamily: 'Inter, sans-serif',
												}}
											>
												<p>This dialog is positioned at {position}.</p>
											</div>
										</DialogDescription>
										<DialogFooter>
											<Button
												variant={ButtonVariant.Solid}
												color={ButtonColor.Primary}
												onClick={() => setPositionOpen(null)}
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
		}

		function PrimitiveSection() {
			const [primitiveOpen, setPrimitiveOpen] = React.useState(false);

			return (
				<Dialog open={primitiveOpen} onOpenChange={setPrimitiveOpen}>
					<DialogTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Open primitive dialog
						</Button>
					</DialogTrigger>
					<AnimatePresence>
						{primitiveOpen && (
							<DialogContent key="dialog-primitive" width="base" forceMount>
								<DialogHeader>
									<DialogTitle icon={<Code size={16} />}>Primitive composition</DialogTitle>
								</DialogHeader>
								<DialogDescription>
									<p
										style={{
											fontSize: '0.875rem',
											fontWeight: 400,
											lineHeight: '1.25rem',
											fontFamily: 'Inter, sans-serif',
										}}
									>
										Use Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
										DialogDescription and DialogFooter for full control.
									</p>
								</DialogDescription>
								<DialogFooter>
									<Button
										variant={ButtonVariant.Ghost}
										color="secondary"
										onClick={() => setPrimitiveOpen(false)}
									>
										Cancel
									</Button>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Primary}
										onClick={() => setPrimitiveOpen(false)}
									>
										Confirm
									</Button>
								</DialogFooter>
							</DialogContent>
						)}
					</AnimatePresence>
				</Dialog>
			);
		}

		return (
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
						Controlled
					</h3>
					<ControlledSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Width Variants
					</h3>
					<WidthVariantsSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Position Variants
					</h3>
					<PositionVariantsSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Without Close Button
					</h3>
					<DialogWrapper
						title="Dialog without close button"
						showCloseButton={false}
						trigger={
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
								Open Dialog
							</Button>
						}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
								fontSize: '0.875rem',
								fontWeight: 400,
								lineHeight: '1.25rem',
								fontFamily: 'Inter, sans-serif',
							}}
						>
							<p>
								This dialog has no close (X) button. Use the button below or click outside to close.
							</p>
							<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<DialogClose asChild>
									<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
										Close
									</Button>
								</DialogClose>
							</div>
						</div>
					</DialogWrapper>
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Primitive
					</h3>
					<PrimitiveSection />
				</section>
			</div>
		);
	},
};
