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
	title: 'Primitive Components/Popover/PopoverAnchor',
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
				<div
					style={{
						display: 'flex',
						gap: '0.5rem',
						alignItems: 'center',
						padding: '0.5rem',
						borderRadius: '0.25rem',
						border: '1px solid var(--border)',
						borderColor: 'var(--border)',
						width: 'fit-content',
					}}
				>
					<span style={{ fontSize: '0.875rem' }}>Row as anchor</span>
					<PopoverTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Secondary} size="sm">
							Trigger
						</Button>
					</PopoverTrigger>
				</div>
			</PopoverAnchor>
			<PopoverContent style={{ width: '14rem' }}>
				<p style={{ fontSize: '0.875rem' }}>
					Content positioned against the anchor row, not the trigger.
				</p>
			</PopoverContent>
		</Popover>
	),
};
