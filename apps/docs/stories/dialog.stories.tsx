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
import React from 'react';

const meta: Meta<typeof DialogWrapper> = {
	title: 'Components/Dialog',
	component: DialogWrapper,
	argTypes: {
		title: {
			control: 'text',
			description: 'The title of the dialog.',
			table: { category: 'Content', type: { summary: 'string' } },
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
		open: {
			control: 'boolean',
			description: 'Controlled open state of the dialog. Use together with onOpenChange.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		disableOutsideClick: {
			control: 'boolean',
			description:
				'When true, prevents closing the dialog when clicking outside (pointer down outside is prevented).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		showCloseButton: {
			control: 'boolean',
			description: 'When true, shows the built-in close (X) button in the dialog content.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		titleIcon: {
			control: false,
			description: 'Optional icon element to display next to the title.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		trigger: {
			control: false,
			description: 'The element that opens the dialog when clicked.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		children: {
			control: false,
			description: 'The content of the dialog.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		footer: {
			control: false,
			description: 'Optional footer area, typically used for action buttons.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		className: {
			control: 'text',
			description:
				'Optional class name passed to the underlying dialog content for custom styling.',
			table: { category: 'Appearance', type: { summary: 'string' } },
		},
		onOpenChange: {
			control: false,
			description: 'Callback when the open state changes.',
			table: {
				category: 'Events',
				type: { summary: '(open: boolean) => void' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogWrapper>;

export const Default: Story = {
	args: {
		title: 'Edit report details',
		width: 'base',
		trigger: (
			<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
				Open Dialog
			</Button>
		),
		children: (
			<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
				<p>Dialog content goes here.</p>
				<div className="flex justify-end">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Save Changes
					</Button>
				</div>
			</div>
		),
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
			>
				<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
					<p>Dialog content goes here.</p>
					<div className="flex justify-end">
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							onClick={() => setOpen(false)}
						>
							Close Dialog
						</Button>
					</div>
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
			<div className="flex flex-wrap gap-4">
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
						<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
							<p>This dialog uses the {width} width variant.</p>
							<div className="flex justify-end">
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
		const [open, setOpen] = React.useState<'center' | 'top' | null>(null);

		return (
			<div className="flex flex-wrap gap-4">
				{(['center', 'top'] as const).map((position) => (
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
						<DialogContent
							position={position}
							width="base"
							onPointerDownOutside={() => setOpen(null)}
						>
							<DialogHeader>
								<DialogTitle>
									{position.charAt(0).toUpperCase() + position.slice(1)} dialog
								</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
									<p>This dialog is positioned at {position}.</p>
									<div className="flex justify-end">
										<Button
											variant={ButtonVariant.Solid}
											color={ButtonColor.Primary}
											onClick={() => setOpen(null)}
										>
											Close
										</Button>
									</div>
								</div>
							</DialogDescription>
						</DialogContent>
					</Dialog>
				))}
			</div>
		);
	},
};

PositionVariants.decorators = [
	(Story) => (
		<div style={{ minHeight: 400 }}>
			<Story />
		</div>
	),
];

export const WithoutCloseButton: Story = {
	args: {
		title: 'Dialog without close button',
		showCloseButton: false,
		trigger: (
			<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
				Open Dialog
			</Button>
		),
		children: (
			<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
				<p>This dialog has no close (X) button. Use the button below or click outside to close.</p>
				<div className="flex justify-end">
					<DialogClose asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Close
						</Button>
					</DialogClose>
				</div>
			</div>
		),
	},
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
				<DialogContent width="base">
					<DialogHeader>
						<DialogTitle icon={<Code size={16} />}>Primitive composition</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="text-sm font-normal leading-5 font-inter font-regular">
							Use Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription
							and DialogFooter for full control.
						</p>
					</DialogDescription>
					<DialogFooter>
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
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};
