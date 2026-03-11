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

const meta: Meta<typeof DialogDescription> = {
	title: 'Components/Dialog/DialogDescription',
	component: DialogDescription,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the dialog description element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the description container.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the dialog description.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		children: {
			control: 'text',
			description: 'The descriptive text or content of the dialog.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogDescription>;

export const Default: Story = {
	args: {
		children: 'Are you sure you want to proceed? This action cannot be undone.',
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle>Confirm action</DialogTitle>
				</DialogHeader>
				<DialogDescription {...args} />
			</DialogContent>
		</Dialog>
	),
};
