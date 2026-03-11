import { Button, ButtonColor, ButtonVariant, ConfirmDialog } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof ConfirmDialog> = {
	title: 'Components/Dialog/ConfirmDialog',
	component: ConfirmDialog,
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Controlled open state of the confirm dialog.',
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
		cancelText: {
			control: 'text',
			description: 'Label of the cancel button.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
				defaultValue: { summary: 'Cancel' },
			},
		},
		cancelIcon: {
			control: false,
			description: 'Optional icon element for the cancel button.',
			table: { category: 'Content', type: { summary: 'React.ReactElement' } },
		},
		confirmText: {
			control: 'text',
			description: 'Label of the confirm button.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		confirmColor: {
			control: 'select',
			options: ['primary', 'secondary', 'destructive', 'tertiary', 'outline', 'ghost'],
			description: 'The color of the confirm button.',
			table: {
				category: 'Appearance',
				type: { summary: "ButtonProps['color']" },
				defaultValue: { summary: 'destructive' },
			},
		},
		confirmIcon: {
			control: false,
			description: 'Optional icon element for the confirm button.',
			table: { category: 'Content', type: { summary: 'React.ReactElement' } },
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
		position: {
			control: 'select',
			options: ['center', 'top', 'custom'],
			description: 'The position of the dialog on the screen.',
			table: { category: 'Layout', type: { summary: "'center' | 'top' | 'custom'" } },
		},
		onOpenChange: {
			control: false,
			description: 'Event handler called when the open state of the dialog changes.',
			table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
		},
		onCancel: {
			control: false,
			description: 'Event handler called when the cancel button is clicked.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		onConfirm: {
			control: false,
			description:
				'Event handler called when the confirm button is clicked. Can return a boolean or promise to decide whether the dialog should close.',
			table: {
				category: 'Events',
				type: { summary: '() => boolean | void | Promise<boolean | void>' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
	args: {
		title: 'Confirm action',
		children: 'Are you sure you want to proceed? This action cannot be undone.',
		cancelText: 'Cancel',
		confirmText: 'Confirm',
		confirmColor: 'destructive',
		width: 'narrow',
	},
	render: (args) => {
		const [open, setOpen] = React.useState(false);

		return (
			<>
				<Button
					variant={ButtonVariant.Solid}
					color={ButtonColor.Primary}
					onClick={() => setOpen(true)}
				>
					Open confirm dialog
				</Button>
				<ConfirmDialog
					{...args}
					open={open}
					onOpenChange={setOpen}
					onCancel={() => setOpen(false)}
					onConfirm={() => {
						setOpen(false);
						return true;
					}}
				/>
			</>
		);
	},
};
