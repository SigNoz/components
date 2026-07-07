import {
	Button,
	ButtonColor,
	ButtonVariant,
	DialogClose,
	DialogWrapper,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './dialog-wrapper.stories.module.css';
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
			<div className="story-column">
				<Typography size="sm">Dialog content goes here.</Typography>
				<div className={styles.flexEnd}>
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
