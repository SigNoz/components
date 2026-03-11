import { Button, ButtonColor, ButtonVariant, DialogWrapper } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DialogWrapper> = {
	title: 'Components/Dialog/DialogWrapper',
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
	},
	render: (args) => (
		<DialogWrapper
			{...args}
			trigger={
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open Dialog
				</Button>
			}
		>
			<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
				<p>Dialog content goes here.</p>
				<div className="flex justify-end">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Save Changes
					</Button>
				</div>
			</div>
		</DialogWrapper>
	),
};
