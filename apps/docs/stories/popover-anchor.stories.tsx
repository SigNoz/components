import {
	Button,
	ButtonColor,
	ButtonVariant,
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './popover-anchor.stories.module.css';
import { anchorArgTypes } from './shared/popover-arg-types.js';

const meta: Meta<typeof PopoverAnchor> = {
	title: 'Primitive Components/Popover/PopoverAnchor',
	component: PopoverAnchor,
	argTypes: anchorArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopoverAnchor>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Popover>
			<PopoverAnchor {...args}>
				<div className={`story-row story-panel ${styles.anchorContainer}`}>
					<Typography size="sm">Row as anchor</Typography>
					<PopoverTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size="sm">
							Trigger
						</Button>
					</PopoverTrigger>
				</div>
			</PopoverAnchor>
			<PopoverContent className="w-56">
				<Typography size="sm">
					Content positioned against the anchor row, not the trigger.
				</Typography>
			</PopoverContent>
		</Popover>
	),
};
