import {
	Button,
	ButtonColor,
	ButtonVariant,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { triggerArgTypes } from './shared/popover-arg-types.js';

const meta: Meta<typeof PopoverTrigger> = {
	title: 'Primitive Components/Popover/PopoverTrigger',
	component: PopoverTrigger,
	argTypes: triggerArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopoverTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args) => (
		<Popover>
			<PopoverTrigger {...args}>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open popover
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64">
				<Typography size="sm">
					Use PopoverTrigger asChild to wrap any interactive element.
				</Typography>
			</PopoverContent>
		</Popover>
	),
};
