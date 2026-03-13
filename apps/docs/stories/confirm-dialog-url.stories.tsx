import { Button, ButtonColor, ButtonVariant, ConfirmDialogUrl } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { confirmUrlArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof ConfirmDialogUrl> = {
	title: 'Components/Dialog/ConfirmDialogUrl',
	component: ConfirmDialogUrl,
	argTypes: confirmUrlArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialogUrl>;

export const Default: Story = {
	args: {
		urlKey: 'dialog-delete-step',
		title: 'Delete from URL param',
		confirmText: 'Delete',
		cancelText: 'Cancel',
		confirmColor: 'destructive',
		children: 'This confirm dialog is controlled via a URL query parameter using nuqs.',
		width: 'narrow',
	},
};

Default.decorators = [
	(Story) => {
		const Wrapped = (storyArgs: Story['args']) => {
			const [, setOpen] = useQueryState(
				storyArgs?.urlKey ?? 'dialog-delete-step',
				parseAsBoolean.withDefault(false)
			);

			return (
				<>
					<Button
						variant={ButtonVariant.Solid}
						color={ButtonColor.Primary}
						onClick={() => setOpen(true)}
					>
						Open confirm dialog (URL)
					</Button>
					<ConfirmDialogUrl
						{...(storyArgs as any)}
						onConfirm={async () => {
							await new Promise((resolve) => setTimeout(resolve, 300));
							return true;
						}}
					/>
				</>
			);
		};

		return (
			<NuqsAdapter>
				<Story />
				<Wrapped {...(Default.args as any)} />
			</NuqsAdapter>
		);
	},
];
