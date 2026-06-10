import { ChevronLeft, ChevronRight, Code } from '@signozhq/icons';
import { Button, ButtonColor, ButtonGroup, ButtonSize, ButtonVariant } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { COLORS, VARIANTS } from './shared/button-arg-types.js';

const meta: Meta<typeof ButtonGroup> = {
	title: 'Primitive Components/Button/ButtonGroup',
	component: ButtonGroup,
	parameters: {
		layout: 'fullscreen',
		controls: { disable: false },
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
			description:
				'Default `variant` applied to descendant Buttons that do not set their own `variant`.',
			table: { defaultValue: { summary: 'solid' } },
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'icon'],
			description: 'Default `size` applied to descendant Buttons that do not set their own `size`.',
			table: { defaultValue: { summary: 'md' } },
		},
		color: {
			control: 'select',
			options: COLORS,
			description:
				'Default `color` applied to descendant Buttons that do not set their own `color`.',
			table: { defaultValue: { summary: 'primary' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the rendered group element as `data-testid`.',
		},
	},
	args: {
		variant: ButtonVariant.Outlined,
		color: ButtonColor.Secondary,
		size: ButtonSize.MD,
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
	render: (args) => (
		<ButtonGroup {...args}>
			<Button>Day</Button>
			<Button>Week</Button>
			<Button>Month</Button>
		</ButtonGroup>
	),
};

export const Variants: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary}>
				<Button>Day</Button>
				<Button>Week</Button>
				<Button>Month</Button>
			</ButtonGroup>
			<ButtonGroup variant={ButtonVariant.Solid}>
				<Button>Day</Button>
				<Button>Week</Button>
				<Button>Month</Button>
			</ButtonGroup>
			<ButtonGroup variant={ButtonVariant.Ghost}>
				<Button>Day</Button>
				<Button>Week</Button>
				<Button>Month</Button>
			</ButtonGroup>
		</div>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div style={{ padding: '2rem', display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
			{[ButtonSize.SM, ButtonSize.MD].map((size) => (
				<ButtonGroup
					key={size}
					size={size}
					variant={ButtonVariant.Outlined}
					color={ButtonColor.Secondary}
				>
					<Button>Prev</Button>
					<Button>Next</Button>
				</ButtonGroup>
			))}
		</div>
	),
};

export const IconCluster: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div style={{ padding: '2rem' }}>
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary} size="icon">
				<Button prefix={<ChevronLeft />} aria-label="Previous" />
				<Button prefix={<Code />} aria-label="Code" />
				<Button prefix={<ChevronRight />} aria-label="Next" />
			</ButtonGroup>
		</div>
	),
};

export const PerButtonOverride: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div style={{ padding: '2rem' }}>
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary}>
				<Button>Approve</Button>
				<Button>Hold</Button>
				<Button color={ButtonColor.Destructive}>Reject</Button>
			</ButtonGroup>
		</div>
	),
};
