import {
	Button,
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
import { useState } from 'react';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Dialog',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Dialog.Root / Portal / Backdrop / Popup. motion/react still owns the enter and exit animation — only the primitive underneath changed.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Dialog.Root / Portal / Backdrop / Popup / Title / Close"
			notes={[
				'Radix Overlay became Base UI Backdrop and Content became Popup; every public prop name is unchanged.',
				'The popup gets role="dialog" and aria-labelledby wired from DialogTitle, plus aria-haspopup and aria-expanded on the trigger.',
				'DialogDescription stays a plain element, as it was before, so it does not become the dialog’s aria-describedby.',
			]}
		>
			<Demo title="Composed">
				<Dialog>
					<DialogTrigger asChild>
						<Button>Open dialog</Button>
					</DialogTrigger>
					<DialogContent width="base">
						<DialogHeader>
							<DialogTitle>Edit report details</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							<Typography.Text>
								Root / Portal / Backdrop / Popup, composed by DialogContent.
							</Typography.Text>
						</DialogDescription>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="ghost" color="secondary">
									Cancel
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button>Save</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Demo>

			<Demo title="Preset">
				<DialogWrapper
					trigger={<Button variant="outlined">Open wrapper</Button>}
					title="Edit report"
					subTitle="The preset composes header, body and footer"
					footer={<Button>Save</Button>}
				>
					<Typography.Text>Body copy goes here.</Typography.Text>
				</DialogWrapper>
			</Demo>
		</BaseUIPanel>
	),
};

export const Animation: StoryObj = {
	name: 'Animation',
	render: () => (
		<BaseUIPanel
			parts="Dialog.Popup rendered as a motion.div"
			notes={[
				'MotionContent used to read Radix’s data-state; it now reads Base UI’s data-open, and the variants are untouched.',
				'Base UI hides a kept-mounted popup as soon as it considers the dialog closed, which would cut the exit off — so forceMount also unhides it and lets the animation own visibility.',
				'A CSS-driven rewrite onto data-starting-style / data-ending-style would let motion go, but the position × animation × height-mode matrix makes that its own change.',
			]}
		>
			<Demo title="Positions">
				<DialogWrapper trigger={<Button>Centre, fade</Button>} title="Centred">
					<Typography.Text>The default fade and zoom.</Typography.Text>
				</DialogWrapper>
			</Demo>

			<Demo title="Widths">
				<DialogWrapper
					trigger={<Button variant="outlined">Narrow</Button>}
					width="narrow"
					title="Narrow"
				>
					<Typography.Text>data-width drives the panel size.</Typography.Text>
				</DialogWrapper>
				<DialogWrapper trigger={<Button variant="outlined">Wide</Button>} width="wide" title="Wide">
					<Typography.Text>data-width drives the panel size.</Typography.Text>
				</DialogWrapper>
			</Demo>
		</BaseUIPanel>
	),
};

export const Dismissal: StoryObj = {
	name: 'Dismissal callbacks',
	render: () => {
		function Locked() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<Button variant="outlined" onClick={() => setOpen(true)}>
						Outside click ignored
					</Button>
					<DialogWrapper open={open} onOpenChange={setOpen} title="Locked" disableOutsideClick>
						<Typography.Text>Clicking the backdrop will not close this.</Typography.Text>
					</DialogWrapper>
				</>
			);
		}

		return (
			<BaseUIPanel
				parts="root onOpenChange, bridged to content callbacks"
				notes={[
					'Base UI reports escape and outside presses on the root rather than the content, so onEscapeKeyDown / onPointerDownOutside / onFocusOutside / onInteractOutside are registered upwards and still honour preventDefault().',
					'That is what keeps the presets’ disableOutsideClick working without any change to their code.',
				]}
			>
				<Demo title="disableOutsideClick">
					<Locked />
				</Demo>

				<Demo title="Escape is prevented">
					<Dialog>
						<DialogTrigger asChild>
							<Button>Escape does nothing</Button>
						</DialogTrigger>
						<DialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
							<DialogHeader>
								<DialogTitle>Press Escape</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								<Typography.Text>The callback cancels the dismissal.</Typography.Text>
							</DialogDescription>
							<DialogFooter>
								<DialogClose asChild>
									<Button>Close</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</Demo>
			</BaseUIPanel>
		);
	},
};
