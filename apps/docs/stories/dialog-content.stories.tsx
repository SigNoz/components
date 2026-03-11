import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DialogContent> = {
	title: 'Components/Dialog/DialogContent',
	component: DialogContent,
	argTypes: {
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
			table: {
				category: 'Layout',
				type: { summary: "'center' | 'top' | 'custom'" },
				defaultValue: { summary: 'center' },
			},
		},
		offset: {
			control: 'number',
			description: 'The offset used when position is set to top.',
			table: { category: 'Layout', type: { summary: 'number' }, defaultValue: { summary: '100' } },
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
		testId: {
			control: 'text',
			description: 'Test ID for the dialog content.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		onClose: {
			control: false,
			description: 'Callback invoked when the built-in close button is clicked.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		onEscapeKeyDown: {
			control: false,
			description: 'Handler called when the escape key is pressed while the dialog is open.',
			table: { category: 'Events' },
		},
		onPointerDownOutside: {
			control: false,
			description: 'Handler called when a pointer event happens outside the dialog.',
			table: { category: 'Events' },
		},
		onFocusOutside: {
			control: false,
			description: 'Handler called when focus moves outside of the dialog.',
			table: { category: 'Events' },
		},
		onInteractOutside: {
			control: false,
			description:
				'Handler called when an interaction happens outside of the dialog (pointer down or focus).',
			table: { category: 'Events' },
		},
		onOpenAutoFocus: {
			control: false,
			description: 'Handler called when the dialog is about to receive focus on open.',
			table: { category: 'Events' },
		},
		onCloseAutoFocus: {
			control: false,
			description: 'Handler called when focus is moving after the dialog closes.',
			table: { category: 'Events' },
		},
		forceMount: {
			control: 'boolean',
			description:
				'When true, keeps the content mounted even when the dialog is closed. Useful for controlling animations.',
			table: { category: 'Behavior', type: { summary: 'boolean | undefined' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the dialog content.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		children: {
			control: false,
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

export const Default: Story = {
	args: {
		width: 'base',
		position: 'center',
		showCloseButton: true,
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent {...args}>
				<DialogHeader>
					<DialogTitle>Dialog content</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<p className="text-sm font-normal leading-5 font-inter font-regular">
						This story focuses on the DialogContent surface and its layout-related props.
					</p>
				</DialogDescription>
				<DialogFooter>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Secondary action
					</Button>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Primary action
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
