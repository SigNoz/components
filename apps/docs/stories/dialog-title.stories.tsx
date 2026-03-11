import { Code } from '@signozhq/icons';
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

const meta: Meta<typeof DialogTitle> = {
	title: 'Components/Dialog/DialogTitle',
	component: DialogTitle,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the dialog title element.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the title.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the dialog title.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		icon: {
			control: false,
			description: 'Optional icon element to render before the title text.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		children: {
			control: 'text',
			description: 'The text content of the dialog title.',
			table: { category: 'Content' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogTitle>;

export const Default: Story = {
	args: {
		children: 'Dialog title',
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
					<DialogTitle {...args} />
				</DialogHeader>
				<DialogDescription>
					<p className="text-sm font-normal leading-5 font-inter font-regular">
						The title labels the dialog content for assistive technologies.
					</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};

export const WithIcon: Story = {
	args: {
		children: 'Dialog with icon',
		icon: <Code size={16} />,
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
					<DialogTitle {...args} />
				</DialogHeader>
				<DialogDescription>
					<p className="text-sm font-normal leading-5 font-inter font-regular">
						Use the icon prop to visually differentiate dialog types.
					</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};
