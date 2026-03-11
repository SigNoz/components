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
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DialogClose> = {
	title: 'Components/Dialog/DialogClose',
	component: DialogClose,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the dialog close element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the close element.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the dialog close.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		asChild: {
			control: 'boolean',
			description:
				'When true, the child element will be treated as the close control (no extra DOM wrapper).',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		onClick: {
			control: false,
			description: 'Click handler invoked when the close element is activated.',
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
type Story = StoryObj<typeof DialogClose>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Dialog with custom close</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<p className="text-sm font-normal leading-5 font-inter font-regular">
						This dialog uses DialogClose in the footer instead of the built-in close button.
					</p>
				</DialogDescription>
				<DialogFooter>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Cancel
					</Button>
					<DialogClose {...args}>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
