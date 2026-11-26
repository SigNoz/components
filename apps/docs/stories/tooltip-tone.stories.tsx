import type { TooltipToneProps } from '@signozhq/ui';
import { Button, ButtonColor, ButtonVariant, TooltipProvider, TooltipTone } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import styles from './tooltip.stories.module.css';

const meta: Meta<typeof TooltipTone> = {
	title: 'Composed Components/Tooltip/TooltipTone',
	component: TooltipTone,
	argTypes: {
		tone: {
			control: 'select',
			options: ['danger'],
			description:
				'The look of the popup that holds this content. One `TooltipTone` anywhere in the popup sets it for the whole popup, every entry of a stacked one included.',
			table: { category: 'Appearance', type: { summary: "'danger'" } },
		},
		children: {
			control: 'text',
			description:
				'The content to show in the tooltip. It renders as it would without the wrapper.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story): ReactElement => (
			<TooltipProvider>
				<Story />
			</TooltipProvider>
		),
	],
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TooltipTone>;

export const Default: Story = {
	args: {
		tone: 'danger',
		children: 'You cannot delete this rule',
	},
	parameters: {
		// Playground: every tone and the stack it can sit in are covered by `TooltipShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args: Partial<TooltipToneProps>) => (
		<div className={`story-center ${styles.playground}`}>
			<Button
				variant={ButtonVariant.Solid}
				color={ButtonColor.Danger}
				size="md"
				disabled
				disabledTooltip={<TooltipTone {...(args as TooltipToneProps)} />}
			>
				Delete rule
			</Button>
		</div>
	),
};
