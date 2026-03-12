import { Code, Trash2, X } from '@signozhq/icons';
import { AlertDialog, Button, ButtonColor, ButtonVariant, CheckboxColors } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof AlertDialog> = {
	title: 'Components/Dialog/AlertDialog',
	component: AlertDialog,
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Controlled open state of the alert dialog.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		title: {
			control: 'text',
			description: 'The title of the dialog.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		titleIcon: {
			control: false,
			description: 'Optional icon element to display next to the title.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		children: {
			control: 'text',
			description: 'The descriptive content rendered inside the dialog.',
			table: { category: 'Content' },
		},
		className: {
			control: 'text',
			description:
				'Optional class name passed to the underlying dialog content for custom styling.',
			table: { category: 'Appearance', type: { summary: 'string' } },
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
		trigger: {
			control: false,
			description: 'The element that opens the dialog when clicked.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		footer: {
			control: false,
			description: 'Optional footer area, typically used for action buttons.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		checkboxLabel: {
			control: 'text',
			description: 'Label text for the optional checkbox.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		checkboxChecked: {
			control: 'boolean',
			description: 'Controlled checked state of the optional checkbox.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		checkboxColor: {
			control: 'select',
			options: Object.values(CheckboxColors),
			description: 'The color of the checkbox when rendered.',
			table: {
				category: 'Appearance',
				type: { summary: `"${Object.values(CheckboxColors).join('" | "')}"` },
				defaultValue: { summary: 'cherry' },
			},
		},
		onCheckboxChange: {
			control: false,
			description: 'Callback invoked when the checkbox value changes.',
			table: { category: 'Events', type: { summary: '(checked: boolean) => void' } },
		},
		onOpenChange: {
			control: false,
			description: 'Callback when the open state changes.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
	args: {
		title: 'Delete this step',
		checkboxLabel: 'Do not ask me this again',
		checkboxChecked: true,
		width: 'narrow',
		children: 'Deleting this step would stop further analytics using this step of the funnel.',
	},
	render: (args) => {
		const [open, setOpen] = React.useState(false);
		const [checked, setChecked] = React.useState(args.checkboxChecked ?? false);

		return (
			<AlertDialog
				{...args}
				open={open}
				onOpenChange={setOpen}
				checkboxChecked={checked}
				onCheckboxChange={setChecked}
				trigger={
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary} prefix={<Code />}>
						Open alert dialog
					</Button>
				}
				footer={
					<>
						<Button
							variant={ButtonVariant.Ghost}
							color="secondary"
							prefix={<X />}
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant={ButtonVariant.Solid}
							color="destructive"
							prefix={<Trash2 />}
							onClick={() => setOpen(false)}
						>
							Delete Step
						</Button>
					</>
				}
			/>
		);
	},
};
