import { Button, ButtonColor, ButtonVariant, Tooltip, TooltipProvider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TooltipProvider> = {
	title: 'Components/Tooltip/TooltipProvider',
	component: TooltipProvider,
	argTypes: {
		delayDuration: {
			control: 'number',
			description:
				'The duration from when the pointer enters the trigger until the tooltip gets opened.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '700' },
			},
		},
		skipDelayDuration: {
			control: 'number',
			description:
				'How much time a user has to enter another trigger without incurring a delay again.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '300' },
			},
		},
		disableHoverableContent: {
			control: 'boolean',
			description:
				'When true, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TooltipProvider>;

export const Default: Story = {
	args: {
		delayDuration: 0,
	},
	render: (args) => (
		<TooltipProvider {...args}>
			<div className="p-20 flex items-center justify-center gap-4">
				<Tooltip title="First tooltip">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Hover me
					</Button>
				</Tooltip>
				<Tooltip title="Second tooltip">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Or me
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
