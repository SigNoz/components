import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	Button,
	ButtonSize,
	ButtonColor,
	ButtonVariant,
} from '@signozhq/button';
import { DialogWrapper, AlertDialogWrapper } from '@signozhq/dialog';
import { Code, X, Trash2 } from '@signozhq/icons';
import { generateDocs } from '../utils/generateDocs';

const dialogExamples = [
	`import { DialogWrapper } from '@signozhq/dialog';
import { Button } from '@signozhq/button';

export default function MyComponent() {
	return (
		<DialogWrapper
			title="Edit Details"
			description="Make changes to your profile information."
			trigger={<Button variant="solid">Open Dialog</Button>}
		>
			<div className="flex flex-col gap-4">
				<p>Dialog content goes here</p>
				<div className="flex justify-end">
					<Button variant="solid" color="primary">Save Changes</Button>
				</div>
			</div>
		</DialogWrapper>
	);
}`,
];

const dialogDocs = generateDocs({
	packageName: '@signozhq/dialog',
	description:
		'A modal dialog component for displaying content that requires user attention or interaction.',
	examples: dialogExamples,
});

const meta: Meta<typeof DialogWrapper> = {
	title: 'Components/Dialog',
	component: DialogWrapper,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: dialogDocs,
			},
		},
	},
	argTypes: {
		width: {
			control: 'select',
			options: ['narrow', 'base', 'wide', 'extra-wide'],
		},
	},
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
		children: <div style={{ height: '70vh' }} />,
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
					<p>Dialog content goes here</p>
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

export const DialogWidth: Story = {
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
						title={`${width.charAt(0).toUpperCase() + width.slice(1)} Width Dialog`}
						width={width}
						trigger={
							<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
								Open {width} Dialog
							</Button>
						}
					>
						<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
							<p>This is a dialog with {width} width.</p>
							<div className="flex justify-end">
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Primary}
									onClick={() => setOpen(null)}
								>
									Close Dialog
								</Button>
							</div>
						</div>
					</DialogWrapper>
				))}
			</div>
		);
	},
};

export const AlertDialog: Story = {
	render: () => {
		const [open, setOpen] = React.useState(false);
		const [checkboxChecked, setCheckboxChecked] = React.useState(true);

		return (
			<AlertDialogWrapper
				open={open}
				width="narrow"
				onOpenChange={setOpen}
				title="Delete this step"
				checkboxLabel="Do not ask me this again"
				checkboxChecked={checkboxChecked}
				onCheckboxChange={setCheckboxChecked}
				trigger={
					<Button
						variant={ButtonVariant.Solid}
						color={ButtonColor.Primary}
						prefixIcon={<Code />}
					>
						Open Dialog
					</Button>
				}
				footer={
					<>
						<Button
							variant={ButtonVariant.Ghost}
							color="secondary"
							prefixIcon={<X size={12} />}
							onClick={() => setOpen(false)}
							size={ButtonSize.SM}
						>
							Cancel
						</Button>
						<Button
							variant={ButtonVariant.Solid}
							color="destructive"
							prefixIcon={<Trash2 size={12} />}
							size={ButtonSize.SM}
							onClick={() => {
								setOpen(false);
							}}
						>
							Delete Step
						</Button>
					</>
				}
			>
				Deleting this step would stop further analytics using this step of the
				funnel.
			</AlertDialogWrapper>
		);
	},
};
