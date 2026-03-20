import {
	Button,
	ButtonColor,
	ButtonVariant,
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { anchorArgTypes } from './shared/popover-arg-types.js';

const meta: Meta<typeof PopoverAnchor> = {
	title: 'Components/Popover/PopoverAnchor',
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
				<div className="flex gap-2 items-center p-2 rounded border border-border w-fit">
					<span className="text-sm">Row as anchor</span>
					<PopoverTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size="sm">
							Trigger
						</Button>
					</PopoverTrigger>
				</div>
			</PopoverAnchor>
			<PopoverContent className="w-56">
				<p className="text-sm">Content positioned against the anchor row, not the trigger.</p>
			</PopoverContent>
		</Popover>
	),
};
