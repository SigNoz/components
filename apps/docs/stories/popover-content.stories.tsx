import {
	Button,
	ButtonColor,
	ButtonVariant,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { contentArgTypes } from './shared/popover-arg-types.js';

const meta: Meta<typeof PopoverContent> = {
	title: 'Components/Popover/PopoverContent',
	component: PopoverContent,
	argTypes: contentArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopoverContent>;

export const Default: Story = {
	args: {
		side: 'bottom',
		align: 'center',
		sideOffset: 4,
		arrow: false,
	},
	render: (args) => (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open popover
				</Button>
			</PopoverTrigger>
			<PopoverContent {...args} className="w-64">
				<p className="text-sm">This story focuses on PopoverContent and its positioning props.</p>
			</PopoverContent>
		</Popover>
	),
};
