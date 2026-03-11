import { Button, ButtonColor, ButtonVariant, ConfirmDialogUrl } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/react';

const meta: Meta<typeof ConfirmDialogUrl> = {
	title: 'Components/Dialog/ConfirmDialogUrl',
	component: ConfirmDialogUrl,
	argTypes: {
		urlKey: {
			control: 'text',
			description: 'The URL query parameter key used to control the open state.',
			table: { category: 'Behavior', type: { summary: 'string' } },
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
type Story = StoryObj<typeof ConfirmDialogUrl>;

export const Default: Story = {
	args: {
		urlKey: 'dialog-delete-step',
		title: 'Delete from URL param',
		confirmText: 'Delete',
		cancelText: 'Cancel',
		confirmColor: 'destructive',
		children: 'This confirm dialog is controlled via a URL query parameter using nuqs.',
		width: 'narrow',
	},
};

Default.decorators = [
	(Story) => {
		const Wrapped = (storyArgs: Story['args']) => {
			const [, setOpen] = useQueryState(
				storyArgs?.urlKey ?? 'dialog-delete-step',
				parseAsBoolean.withDefault(false)
			);

			return (
				<>
					<Button
						variant={ButtonVariant.Solid}
						color={ButtonColor.Primary}
						onClick={() => setOpen(true)}
					>
						Open confirm dialog (URL)
					</Button>
					<ConfirmDialogUrl
						{...(storyArgs as any)}
						onConfirm={async () => {
							await new Promise((resolve) => setTimeout(resolve, 300));
							return true;
						}}
					/>
				</>
			);
		};

		return (
			<NuqsAdapter>
				<Story />
				<Wrapped {...(Default.args as any)} />
			</NuqsAdapter>
		);
	},
];
