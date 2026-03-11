import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DialogOverlay> = {
	title: 'Components/Dialog/DialogOverlay',
	component: DialogOverlay,
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the dialog overlay element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the overlay.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the dialog overlay.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		forceMount: {
			control: 'boolean',
			description:
				'When true, keeps the overlay mounted even when the dialog is closed. Useful for controlling animations.',
			table: { category: 'Behavior', type: { summary: 'boolean | undefined' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to the overlay element.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogOverlay>;

export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogPortal>
				<DialogOverlay {...args} />
				<DialogContent width="base">
					<DialogHeader>
						<DialogTitle>Dialog overlay</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="text-sm font-normal leading-5 font-inter font-regular">
							The overlay dims the background and blocks interaction with the page while the dialog
							is open.
						</p>
					</DialogDescription>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	),
};
