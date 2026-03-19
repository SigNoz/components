import type { TooltipContentProps } from '@signozhq/ui';
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

const meta: Meta<typeof TooltipContent> = {
	title: 'Components/Tooltip/TooltipContent',
	component: TooltipContent,
	argTypes: {
		side: {
			control: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			description:
				'The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.',
			table: { category: 'Position', type: { summary: "'top' | 'right' | 'bottom' | 'left'" } },
		},
		sideOffset: {
			control: 'number',
			description: 'The distance in pixels from the trigger.',
			table: { category: 'Position', type: { summary: 'number' }, defaultValue: { summary: '4' } },
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'The preferred alignment against the trigger. May change when collisions occur.',
			table: { category: 'Position', type: { summary: "'start' | 'center' | 'end'" } },
		},
		alignOffset: {
			control: 'number',
			description: 'An offset in pixels from the "start" or "end" alignment options.',
			table: { category: 'Position', type: { summary: 'number' } },
		},
		arrowPadding: {
			control: 'number',
			description:
				'The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners.',
			table: { category: 'Position', type: { summary: 'number' } },
		},
		avoidCollisions: {
			control: 'boolean',
			description:
				'When true, overrides the side and align preferences to prevent collisions with boundary edges.',
			table: { category: 'Position', type: { summary: 'boolean' } },
		},
		arrow: {
			control: 'boolean',
			description: 'Whether to show the arrow.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		forceMount: {
			control: 'boolean',
			description:
				'Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.',
			table: { category: 'Behavior', type: { summary: 'true' } },
		},
		testId: {
			control: 'text',
			description: 'The test id of the tooltip content.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		onEscapeKeyDown: {
			control: false,
			description: 'Event handler called when the escape key is down. Can be prevented.',
			table: { category: 'Events' },
		},
		onPointerDownOutside: {
			control: false,
			description:
				'Event handler called when a pointerdown event happens outside of the Tooltip. Can be prevented.',
			table: { category: 'Events' },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TooltipContent>;

export const Default: Story = {
	args: {
		side: 'bottom',
		sideOffset: 4,
		align: 'center',
		arrow: true,
	},
	render: (args: Partial<TooltipContentProps>) => (
		<TooltipProvider delayDuration={0}>
			<div className="p-20 flex items-center justify-center">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
							Custom content
						</Button>
					</TooltipTrigger>
					<TooltipContent {...args}>
						<span>Rich tooltip content with positioning controls</span>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
