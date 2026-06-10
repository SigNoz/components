import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogSubtitle,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { subtitleArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogSubtitle> = {
	title: 'Primitive Components/Dialog/DialogSubtitle',
	component: DialogSubtitle,
	argTypes: subtitleArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogSubtitle>;

export const Default: Story = {
	args: {
		children: 'Use DialogSubtitle for supporting text under the title.',
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
					<DialogTitle>Dialog title</DialogTitle>
					<DialogSubtitle {...args} />
				</DialogHeader>
				<DialogDescription>
					<p
						style={{
							fontSize: '0.875rem',
							fontWeight: 400,
							lineHeight: '1.25rem',
							fontFamily: 'Inter, sans-serif',
						}}
					>
						The subtitle provides supporting text below the title.
					</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};
