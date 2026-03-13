import { Button, ButtonColor, ButtonVariant, DialogClose, DialogWrapper } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { closeArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogClose> = {
	title: 'Components/Dialog/DialogClose',
	component: DialogClose,
	argTypes: closeArgTypes,
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
		<DialogWrapper
			trigger={
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			}
			footer={
				<>
					<DialogClose {...args}>
						<Button variant={ButtonVariant.Ghost} color="secondary">
							Cancel
						</Button>
					</DialogClose>
					<DialogClose {...args}>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Close
						</Button>
					</DialogClose>
				</>
			}
			title="Dialog with custom close"
		>
			This dialog uses DialogClose in the footer for the close action.
		</DialogWrapper>
	),
};
