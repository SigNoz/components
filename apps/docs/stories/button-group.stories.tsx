import { ChevronLeft, ChevronRight, Code } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonGroup,
	ButtonSize,
	ButtonVariant,
	type VariantColorType,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './button-group.stories.module.css';
import { COLORS, VARIANTS } from './shared/button-arg-types.js';

const meta: Meta<typeof ButtonGroup> = {
	title: 'Primitive Components/ButtonGroup',
	component: ButtonGroup,
	parameters: {
		layout: 'fullscreen',
		controls: { disable: false },
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
			description: 'Mirrored on the group element as `data-variant`.',
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
			description: 'Mirrored on the group element as `data-size`.',
		},
		color: {
			control: 'select',
			options: COLORS,
			description: 'Mirrored on the group element as `data-color`.',
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
	render: ({ variant, size, color, ...args }) => {
		// The controls pick `variant` and `color` independently, so the pair has to be
		// re-asserted before it reaches the group.
		const appearance = {
			variant: variant ?? ButtonVariant.Outlined,
			color: color ?? ButtonColor.Secondary,
		} as VariantColorType;

		return (
			<ButtonGroup {...appearance} size={size} {...args}>
				<Button {...appearance} size={size ?? ButtonSize.MD}>
					Day
				</Button>
				<Button {...appearance} size={size ?? ButtonSize.MD}>
					Week
				</Button>
				<Button {...appearance} size={size ?? ButtonSize.MD}>
					Month
				</Button>
			</ButtonGroup>
		);
	},
};

export const Variants: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="story-container-full story-section-sm">
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary}>
				<Button variant={ButtonVariant.Outlined} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Day
				</Button>
				<Button variant={ButtonVariant.Outlined} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Week
				</Button>
				<Button variant={ButtonVariant.Outlined} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Month
				</Button>
			</ButtonGroup>
			<ButtonGroup variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
				<Button variant={ButtonVariant.Solid} size={ButtonSize.MD} color={ButtonColor.Primary}>
					Day
				</Button>
				<Button variant={ButtonVariant.Solid} size={ButtonSize.MD} color={ButtonColor.Primary}>
					Week
				</Button>
				<Button variant={ButtonVariant.Solid} size={ButtonSize.MD} color={ButtonColor.Primary}>
					Month
				</Button>
			</ButtonGroup>
			<ButtonGroup variant={ButtonVariant.Ghost} color={ButtonColor.Secondary}>
				<Button variant={ButtonVariant.Ghost} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Day
				</Button>
				<Button variant={ButtonVariant.Ghost} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Week
				</Button>
				<Button variant={ButtonVariant.Ghost} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Month
				</Button>
			</ButtonGroup>
		</div>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className={`story-container-full story-row-lg ${styles.flexRowAlignEnd}`}>
			{[ButtonSize.SM, ButtonSize.MD].map((size) => (
				<ButtonGroup
					key={size}
					size={size}
					variant={ButtonVariant.Outlined}
					color={ButtonColor.Secondary}
				>
					<Button variant={ButtonVariant.Outlined} size={size} color={ButtonColor.Secondary}>
						Prev
					</Button>
					<Button variant={ButtonVariant.Outlined} size={size} color={ButtonColor.Secondary}>
						Next
					</Button>
				</ButtonGroup>
			))}
		</div>
	),
};

export const IconCluster: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="story-container-full">
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary} size="md">
				<Button
					variant={ButtonVariant.Outlined}
					size={ButtonSize.MD}
					color={ButtonColor.Secondary}
					icon
					aria-label="Previous"
				>
					<ChevronLeft />
				</Button>
				<Button
					variant={ButtonVariant.Outlined}
					size={ButtonSize.MD}
					color={ButtonColor.Secondary}
					icon
					aria-label="Code"
				>
					<Code />
				</Button>
				<Button
					variant={ButtonVariant.Outlined}
					size={ButtonSize.MD}
					color={ButtonColor.Secondary}
					icon
					aria-label="Next"
				>
					<ChevronRight />
				</Button>
			</ButtonGroup>
		</div>
	),
};

export const PerButtonOverride: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="story-container-full">
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary}>
				<Button variant={ButtonVariant.Outlined} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Approve
				</Button>
				<Button variant={ButtonVariant.Outlined} size={ButtonSize.MD} color={ButtonColor.Secondary}>
					Hold
				</Button>
				<Button variant={ButtonVariant.Solid} size={ButtonSize.MD} color={ButtonColor.Danger}>
					Reject
				</Button>
			</ButtonGroup>
		</div>
	),
};
