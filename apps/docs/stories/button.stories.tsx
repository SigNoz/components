import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	Button,
	ButtonSize,
	ButtonVariant,
	ButtonColor,
	ButtonBackground,
} from '@signozhq/button';
import { Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateDocs } from '../utils/generateDocs';

const VARIANTS = [
	ButtonVariant.Solid,
	ButtonVariant.Outlined,
	ButtonVariant.Dashed,
	ButtonVariant.Ghost,
	ButtonVariant.Link,
] as const;
const COLORS = [
	ButtonColor.Primary,
	ButtonColor.Destructive,
	ButtonColor.Warning,
	ButtonColor.Secondary,
] as const;

type ButtonConfig = {
	size?: ButtonSize;
	variant?: ButtonVariant;
	color?: ButtonColor;
	label: string;
	buttonText?: string;
};

const buttonExamples = [
	`import { Button } from '@signozhq/button';
import { ChevronLeft, ChevronRight } from '@signozhq/icons';

export default function MyComponent() {
return (
	<Button 
		variant="solid" 
		color="primary" 
		size="md"
		prefixIcon={<ChevronLeft />}
		suffixIcon={<ChevronRight />}
	>
		Click Me
	</Button>
);
}`,
];

const buttonDocs = generateDocs({
	packageName: '@signozhq/button',
	description:
		'A versatile button component with multiple variants, colors, and sizes.',
	examples: buttonExamples,
});

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	decorators: [],
	argTypes: {
		variant: {
			control: 'select',
			options: ['solid', 'outlined', 'dashed', 'ghost', 'link', 'text'],
			description: 'The visual style of the button',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg', 'icon'],
			description: 'The size of the button',
		},
		color: {
			control: 'select',
			options: ['primary', 'destructive', 'warning', 'secondary'],
			description: 'The color scheme of the button',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the button is disabled',
		},
		width: {
			control: 'text',
			description: 'Custom width for the button',
		},
		asChild: {
			control: 'boolean',
			description: 'Whether to render as a child component',
		},
		background: {
			control: 'select',
			options: ['ink-500', 'ink-400', 'vanilla-100', 'vanilla-200'],
			description: 'The background context for the action button',
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/file/...',
		},
		backgrounds: {
			disable: true,
		},
		controls: { disable: false },
		docs: {
			description: {
				component: buttonDocs,
			},
			source: {
				type: 'code',
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	render: () => {
		const buttonConfigs: ButtonConfig[] = [
			// Size Variations
			{
				size: ButtonSize.XS,
				label: 'Extra-small Button',
				color: ButtonColor.Primary,
			},
			{ size: ButtonSize.SM, label: 'Small Button', color: ButtonColor.Primary },
			{ size: ButtonSize.MD, label: 'Medium Button', color: ButtonColor.Primary },
			{ size: ButtonSize.LG, label: 'Large Button', color: ButtonColor.Primary },

			// Variant Types
			{ variant: ButtonVariant.Outlined, label: 'Border-solid Button' },
			{ variant: ButtonVariant.Dashed, label: 'Border-dashed Button' },
			{
				variant: ButtonVariant.Ghost,
				label: 'Ghost Button',
				color: ButtonColor.Secondary,
			},
			{
				variant: ButtonVariant.Link,
				label: 'Link Button',
				buttonText: 'Default button',
				color: ButtonColor.Primary,
			},

			// Color Variations
			{ color: ButtonColor.Primary, label: 'Primary Button' },
			{ color: ButtonColor.Destructive, label: 'Danger Button' },
			{ color: ButtonColor.Warning, label: 'Warning Button' },
			{ color: ButtonColor.Secondary, label: 'Secondary Button' },
		];

		return (
			<div className="p-8 rounded-lg bg-background">
				<div className="space-y-6">
					{buttonConfigs.map((config, index) => (
						<div key={index} className="flex items-center">
							<div className="w-[200px]">
								<Button
									size={config.size}
									variant={config.variant}
									color={config.color}
									prefixIcon={<ChevronLeft />}
									suffixIcon={<ChevronRight />}
								>
									{config.label}
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	},
};

// Main showcase of all button styles
export const ButtonShowcase: Story = {
	render: () => (
		<div className="p-8 rounded-lg bg-vanilla-100 dark:bg-background ">
			<div className="space-y-12">
				{COLORS.map((color) => (
					<div key={color} className="space-y-4">
						<h2 className="text-base font-semibold capitalize text-foreground">
							{color}
						</h2>
						<div className="flex gap-4">
							{/* Filter variants based on color */}
							{VARIANTS.filter(
								(variant) =>
									// Only show outlined and dashed for secondary
									color === 'secondary' ||
									!(variant === 'outlined' || variant === 'dashed'),
							).map((variant) => (
								<div key={variant} className="grid grid-cols-1 gap-4">
									<Button
										variant={variant}
										color={color}
										prefixIcon={<ChevronLeft />}
										suffixIcon={<ChevronRight />}
									>
										{variant}
									</Button>
									<Button
										variant={variant}
										color={color}
										prefixIcon={<ChevronLeft />}
										suffixIcon={<ChevronRight />}
										disabled
									>
										{variant} disabled
									</Button>
									<Button
										variant={variant}
										color={color}
										prefixIcon={<ChevronLeft />}
										suffixIcon={<ChevronRight />}
										loading
									>
										{variant} loading
									</Button>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	),
};

// Size Variations
export const Sizes: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	render: (args) => (
		<div className="p-8 space-y-8">
			<div className="space-y-4">
				<h2 className="text-base font-semibold">Size Variations</h2>
				<div className="space-y-8">
					{[ButtonSize.XS, ButtonSize.SM, ButtonSize.MD, ButtonSize.LG].map(
						(size) => (
							<div key={size} className="space-y-4">
								<h3 className="text-sm font-medium capitalize">{size}</h3>
								<Button
									size={size}
									{...args}
									prefixIcon={<ChevronLeft />}
									suffixIcon={<ChevronRight />}
								>
									{size} Button
								</Button>
							</div>
						),
					)}
				</div>
			</div>
		</div>
	),
};

// Loading States
export const LoadingStates: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	render: (args) => (
		<div className="flex flex-col gap-4">
			<div className="flex gap-4">
				<Button loading {...args}>
					Loading
				</Button>
				<Button loading variant={ButtonVariant.Outlined} {...args}>
					Loading
				</Button>
				<Button loading variant={ButtonVariant.Dashed} {...args}>
					Loading
				</Button>
				<Button loading variant={ButtonVariant.Ghost} {...args}>
					Loading
				</Button>
			</div>
			<div className="flex gap-4">
				{[ButtonSize.XS, ButtonSize.SM, ButtonSize.MD, ButtonSize.LG].map(
					(size) => (
						<Button key={size} size={size} loading {...args}>
							Loading
						</Button>
					),
				)}
			</div>
		</div>
	),
};

// Icon Only Buttons
export const IconButtons: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	render: (args) => (
		<div className="p-8 space-y-8 rounded-lg bg-background">
			<div className="space-y-4">
				<h2 className="text-base font-semibold text-foreground">
					Icon Only Buttons
				</h2>
				<div className="flex gap-4">
					{VARIANTS.map((variant) => (
						<Button
							key={variant}
							variant={variant}
							prefixIcon={<Code />}
							size={ButtonSize.Icon}
							{...args}
						/>
					))}
				</div>
			</div>
			<div className="space-y-4">
				<h2 className="text-base font-semibold text-foreground">
					Icon Button Sizes
				</h2>
				<div className="flex gap-4">
					{[ButtonSize.XS, ButtonSize.SM, ButtonSize.MD, ButtonSize.LG].map(
						(size) => (
							<Button key={size} size={size} prefixIcon={<Code />} {...args} />
						),
					)}
				</div>
			</div>
		</div>
	),
};

// Full Width Buttons
export const FullWidth: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	render: (args) => (
		<div className="p-8 space-y-4 rounded-lg bg-background">
			<h2 className="text-base font-semibold text-foreground">
				Full Width Buttons
			</h2>
			<div className="space-y-4 w-full">
				{VARIANTS.map((variant) => (
					<Button key={variant} variant={variant} width="full" {...args}>
						{variant} Full Width
					</Button>
				))}
			</div>
		</div>
	),
};

// Playground
export const Playground: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: 'Button',
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
		size: ButtonSize.MD,
		disabled: false,
		loading: false,
		width: undefined,
		prefixIcon: undefined,
		suffixIcon: undefined,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: [
				ButtonVariant.Solid,
				ButtonVariant.Outlined,
				ButtonVariant.Dashed,
				ButtonVariant.Ghost,
				ButtonVariant.Link,
			],
		},
		color: {
			control: 'select',
			options: [
				ButtonColor.Primary,
				ButtonColor.Destructive,
				ButtonColor.Warning,
				ButtonColor.Secondary,
			],
		},
		size: {
			control: 'select',
			options: [ButtonSize.XS, ButtonSize.SM, ButtonSize.MD, ButtonSize.LG],
		},
	},
};

// Add Action Button Story
export const ActionButtons: Story = {
	parameters: {
		controls: { disable: false },
	},
	argTypes: {
		background: {
			control: 'select',
			options: [
				ButtonBackground.Ink500,
				ButtonBackground.Ink400,
				ButtonBackground.Vanilla100,
				ButtonBackground.Vanilla200,
			],
			description: 'The background context for the action button',
		},
	},
	args: {
		variant: ButtonVariant.Action,
		background: ButtonBackground.Ink500,
	},
	render: () => (
		<div className="space-y-8">
			<div>
				<h2 className="text-base font-semibold mb-4">Action Buttons</h2>
				<p className="text-sm mb-4">
					Action buttons adapt their style based on the background they`re placed on.
				</p>

				<div className="grid grid-cols-2 gap-8">
					{/* ink-500 background */}
					<div className="p-6 bg-ink-500 rounded-lg">
						<p className="text-vanilla-100 mb-4">On ink-500 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Ink500}
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>

					{/* ink-400 background */}
					<div className="p-6 bg-ink-400 rounded-lg">
						<p className="text-vanilla-100 mb-4">On ink-400 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Ink400}
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>

					{/* vanilla-100 background */}
					<div className="p-6 bg-vanilla-100 rounded-lg">
						<p className="text-slate-500 mb-4">On vanilla-100 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Vanilla100}
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>

					{/* vanilla-200 background */}
					<div className="p-6 bg-vanilla-200 rounded-lg">
						<p className="text-slate-500 mb-4">On vanilla-200 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Vanilla200}
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium mb-3">Disabled Action Buttons</h3>
				<div className="grid grid-cols-2 gap-8">
					{/* Disabled examples */}
					<div className="p-6 bg-ink-500 rounded-lg">
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Ink500}
							disabled
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Disabled Action Button
						</Button>
					</div>
					<div className="p-6 bg-vanilla-100 rounded-lg">
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Vanilla100}
							disabled
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Disabled Action Button
						</Button>
					</div>
				</div>
			</div>
		</div>
	),
};
