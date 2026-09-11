import { Button, ButtonColor, ButtonVariant, Tooltip, TooltipProvider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './tooltip-provider.stories.module.css';

const meta: Meta<typeof TooltipProvider> = {
	title: 'Composed Components/Tooltip/TooltipProvider',
	component: TooltipProvider,
	argTypes: {
		delay: {
			control: 'number',
			description:
				'How long to wait before opening a tooltip on hover, in milliseconds. Focus opens it at once.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '300' },
			},
		},
		closeDelay: {
			control: 'number',
			description:
				'How long to wait before closing a tooltip once the pointer leaves, in milliseconds.',
			table: { category: 'Behavior', type: { summary: 'number' }, defaultValue: { summary: '0' } },
		},
		timeout: {
			control: 'number',
			description:
				'Another tooltip opens at once, skipping `delay`, when the previous one closed within this many milliseconds.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '400' },
			},
		},
		container: {
			control: false,
			description:
				'The element every tooltip below is portalled into. Defaults to `document.body`.',
			table: { category: 'Behavior', type: { summary: 'HTMLElement | ShadowRoot | RefObject' } },
		},
		children: {
			control: false,
			description: 'The children of the tooltip provider.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
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
	render: (args) => (
		<TooltipProvider {...args}>
			<div className={`story-center ${styles.demoArea}`}>
				<Tooltip title="First tooltip">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size="md">
						Hover me
					</Button>
				</Tooltip>
				<Tooltip title="Second tooltip">
					<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size="md">
						Or me
					</Button>
				</Tooltip>
			</div>
		</TooltipProvider>
	),
};
