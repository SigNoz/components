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
import { headerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogHeader> = {
	title: 'Primitive Components/Dialog/DialogHeader',
	component: DialogHeader,
	argTypes: headerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogHeader>;

export const Default: Story = {
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base">
				<DialogHeader {...args}>
					<DialogTitle>Dialog header</DialogTitle>
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
						The header typically contains the title and optional actions.
					</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};
