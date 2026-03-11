import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DialogPortal> = {
	title: 'Components/Dialog/DialogPortal',
	component: DialogPortal,
	argTypes: {
		testId: {
			control: 'text',
			description: 'Test ID for the dialog portal.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		container: {
			control: false,
			description:
				'Optional DOM element to portal the dialog into. Defaults to document.body when not provided.',
			table: { category: 'Behavior', type: { summary: 'HTMLElement | null | undefined' } },
		},
		forceMount: {
			control: 'boolean',
			description:
				'When true, keeps the portal mounted even when the dialog is closed. Useful for controlling animations.',
			table: { category: 'Behavior', type: { summary: 'boolean | undefined' } },
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
type Story = StoryObj<typeof DialogPortal>;

export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogPortal {...args}>
				<DialogContent width="base">
					<DialogHeader>
						<DialogTitle>Dialog portal</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="text-sm font-normal leading-5 font-inter font-regular">
							DialogPortal controls where in the DOM the dialog is rendered (by default,
							document.body).
						</p>
					</DialogDescription>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	),
};
