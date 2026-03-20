import { Button, ButtonColor, ButtonVariant, PopoverSimple } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { simpleArgTypes } from './shared/popover-arg-types.js';

const meta: Meta<typeof PopoverSimple> = {
	title: 'Components/Popover/PopoverSimple',
	component: PopoverSimple,
	argTypes: simpleArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopoverSimple>;

export const Default: Story = {
	args: {
		trigger: undefined,
		className: 'w-64',
		side: 'bottom',
		align: 'center',
		arrow: false,
	},
	render: (args) => (
		<PopoverSimple
			{...args}
			trigger={
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open popover
				</Button>
			}
		>
			<p className="text-sm">
				Simple popover content. Pass trigger and children instead of composing subcomponents.
			</p>
		</PopoverSimple>
	),
};
