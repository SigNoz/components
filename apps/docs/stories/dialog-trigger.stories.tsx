import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DialogTrigger> = {
	title: 'Components/Dialog/DialogTrigger',
	component: DialogTrigger,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the trigger element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the trigger.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'When true, the child element will be treated as the trigger (no extra DOM wrapper).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		testId: {
			control: 'text',
			description: 'Test ID for the dialog trigger.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		onClick: {
			control: false,
			description: 'Click handler for the trigger element.',
			table: { category: 'Events', type: { summary: '(event: MouseEvent) => void' } },
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
type Story = StoryObj<typeof DialogTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger {...args}>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle>Dialog with custom trigger</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Use DialogTrigger asChild to wrap any interactive element that should open the dialog.
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};
