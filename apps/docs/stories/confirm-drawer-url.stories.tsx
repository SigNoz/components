import { Button, ButtonColor, ButtonVariant, ConfirmDrawerUrl } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { confirmUrlArgTypes } from './shared/dialog-drawer-arg-types.js';

const { position: _, ...sharedConfirmUrlArgTypes } = confirmUrlArgTypes ?? {};

const meta: Meta<typeof ConfirmDrawerUrl> = {
	title: 'Components/Drawer/ConfirmDrawerUrl',
	component: ConfirmDrawerUrl,
	argTypes: {
		...sharedConfirmUrlArgTypes,
		direction: {
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			description: 'The side of the viewport from which the drawer appears.',
			table: {
				category: 'Layout',
				type: { summary: '"left" | "right" | "top" | "bottom"' },
				defaultValue: { summary: 'right' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDrawerUrl>;

export const Default: Story = {
	args: {
		urlKey: 'drawer-delete-step',
		title: 'Delete from URL param',
		confirmText: 'Delete',
		cancelText: 'Cancel',
		confirmColor: 'destructive',
		children: 'This confirm drawer is controlled via a URL query parameter using nuqs.',
		direction: 'right',
		width: 'narrow',
	},
};

Default.decorators = [
	(Story) => {
		const Wrapped = (storyArgs: Story['args']) => {
			const [, setOpen] = useQueryState(
				storyArgs?.urlKey ?? 'drawer-delete-step',
				parseAsBoolean.withDefault(false)
			);

			return (
				<>
					<Button
						variant={ButtonVariant.Solid}
						color={ButtonColor.Primary}
						onClick={() => setOpen(true)}
					>
						Open confirm drawer (URL)
					</Button>
					<ConfirmDrawerUrl
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
