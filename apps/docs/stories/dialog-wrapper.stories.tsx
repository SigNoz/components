import { Button, ButtonColor, ButtonVariant, DialogClose, DialogWrapper } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { wrapperArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogWrapper> = {
	title: 'Composed Components/DialogWrapper',
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
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					fontSize: '0.875rem',
					fontWeight: 400,
					lineHeight: '1.25rem',
					fontFamily: 'Inter, sans-serif',
				}}
			>
				<p>Dialog content goes here.</p>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
