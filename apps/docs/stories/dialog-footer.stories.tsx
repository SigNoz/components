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

const meta: Meta<typeof DialogFooter> = {
	title: 'Components/Dialog/DialogFooter',
	component: DialogFooter,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the dialog footer element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the footer container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the dialog footer.',
			table: { category: 'Testing', type: { summary: 'string' } },
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
type Story = StoryObj<typeof DialogFooter>;

export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="narrow">
				<DialogHeader>
					<DialogTitle>Delete this step</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<p className="text-sm font-normal leading-5 font-inter font-regular">
						Deleting this step would stop further analytics using this step of the funnel.
					</p>
				</DialogDescription>
				<DialogFooter {...args}>
					<Button variant={ButtonVariant.Ghost} color="secondary">
						Cancel
					</Button>
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
