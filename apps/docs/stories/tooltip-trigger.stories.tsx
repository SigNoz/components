import {
	Button,
	ButtonColor,
	ButtonVariant,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TooltipTrigger> = {
	title: 'Components/Tooltip/TooltipTrigger',
	component: TooltipTrigger,
	argTypes: {
		asChild: {
			control: 'boolean',
			description:
				'When true, merges props onto the child element instead of rendering a wrapper. Use to delegate to a child (e.g. a Button).',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TooltipTrigger>;

export const Default: Story = {
	args: {
		asChild: true,
	},
	render: (args: { asChild?: boolean }) => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex items-center justify-center">
				<Tooltip>
					<TooltipTrigger {...args}>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
							Custom content tooltip
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom" arrow>
						<span>Rich tooltip content</span>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
