import { Button, ButtonColor, ButtonVariant, TooltipProvider, TooltipSimple } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TooltipProvider> = {
	title: 'Primitive Components/Tooltip/TooltipProvider',
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
		testId: {
			control: 'text',
			description: 'The test id of the tooltip provider.',
			table: { category: 'Testing', type: { summary: 'string' } },
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
			<div
				style={{
					padding: '5rem',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '1rem',
				}}
			>
				<TooltipSimple title="First tooltip">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Hover me
					</Button>
				</TooltipSimple>
				<TooltipSimple title="Second tooltip">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary}>
						Or me
					</Button>
				</TooltipSimple>
			</div>
		</TooltipProvider>
	),
};
