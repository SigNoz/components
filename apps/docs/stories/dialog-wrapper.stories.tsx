import { Button, ButtonColor, ButtonVariant, DialogClose, DialogWrapper } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { wrapperArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogWrapper> = {
	title: 'Components/Dialog/DialogWrapper',
	component: DialogWrapper,
	argTypes: wrapperArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogWrapper>;

export const Default: Story = {
	args: {
		title: 'Edit report details',
		width: 'base',
	},
	render: (args) => (
		<DialogWrapper
			{...args}
			trigger={
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open Dialog
				</Button>
			}
		>
			<div className="flex flex-col gap-4 text-sm font-normal leading-5 font-inter font-regular">
				<p>Dialog content goes here.</p>
				<div className="flex justify-end">
					<DialogClose asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Save Changes
						</Button>
					</DialogClose>
				</div>
			</div>
		</DialogWrapper>
	),
};
