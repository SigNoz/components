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
import { footerArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogFooter> = {
	title: 'Primitive Components/Dialog/DialogFooter',
	component: DialogFooter,
	argTypes: footerArgTypes,
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
					<p
						style={{
							fontSize: '0.875rem',
							fontWeight: 400,
							lineHeight: '1.25rem',
							fontFamily: 'Inter, sans-serif',
						}}
					>
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
