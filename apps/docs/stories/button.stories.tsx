import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonSize } from '@signozhq/button';
import { Code, ChevronLeft, ChevronRight } from 'lucide-react';

const VARIANTS = ['solid', 'outlined', 'dashed', 'ghost', 'link'] as const;
const COLORS = ['primary', 'destructive', 'warning', 'secondary'] as const;

type ButtonConfig = {
	size?: ButtonSize;
	variant?: 'solid' | 'outlined' | 'dashed' | 'ghost' | 'link';
	color?: 'primary' | 'destructive' | 'warning' | 'secondary';
	label: string;
	buttonText?: string;
};

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
	},
	parameters: {
		design: {
			type: 'figma',
			url: 'https://www.figma.com/file/...',
		},
		backgrounds: {
			disable: true,
		},
		controls: { disable: true },
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	render: () => {
		const buttonConfigs: ButtonConfig[] = [
			// Size Variations
			{ size: 'xs', label: 'Extra-small Button', color: 'primary' },
			{ size: 'sm', label: 'Small Button', color: 'primary' },
			{ size: 'md', label: 'Medium Button', color: 'primary' },
			{ size: 'lg', label: 'Large Button', color: 'primary' },

			// Variant Types
			{ variant: 'outlined', label: 'Border-solid Button' },
			{ variant: 'dashed', label: 'Border-dashed Button' },
			{ variant: 'ghost', label: 'Ghost Button' },
			{
				variant: 'link',
				label: 'Link Button',
				buttonText: 'Default button',
				color: 'primary',
			},

			// Color Variations
			{ color: 'primary', label: 'Primary Button' },
			{ color: 'destructive', label: 'Danger Button' },
			{ color: 'warning', label: 'Warning Button' },
			{ color: 'secondary', label: 'Secondary Button' },
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
							{VARIANTS.map((variant) => (
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
		variant: 'solid',
		color: 'primary',
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
					{['xs', 'sm', 'md', 'lg'].map((size) => (
						<div key={size} className="space-y-4">
							<h3 className="text-sm font-medium capitalize">{size}</h3>
							<Button
								size={size as ButtonSize}
								{...args}
								prefixIcon={<ChevronLeft />}
								suffixIcon={<ChevronRight />}
							>
								{size} Button
							</Button>
						</div>
					))}
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
		variant: 'solid',
		color: 'primary',
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
				<Button loading variant="outlined" {...args}>
					Loading
				</Button>
				<Button loading variant="dashed" {...args}>
					Loading
				</Button>
				<Button loading variant="ghost" {...args}>
					Loading
				</Button>
			</div>
			<div className="flex gap-4">
				{['xs', 'sm', 'md', 'lg'].map((size) => (
					<Button key={size} size={size as ButtonSize} loading {...args}>
						Loading
					</Button>
				))}
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
		variant: 'solid',
		color: 'primary',
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
							size="icon"
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
					{['xs', 'sm', 'md', 'lg'].map((size) => (
						<Button
							key={size}
							size={size as ButtonSize}
							prefixIcon={<Code />}
							{...args}
						/>
					))}
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
		variant: 'solid',
		color: 'primary',
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
		variant: 'solid',
		color: 'primary',
		size: 'md',
		disabled: false,
		loading: false,
		width: undefined,
		prefixIcon: undefined,
		suffixIcon: undefined,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['solid', 'outlined', 'dashed', 'ghost', 'text', 'link'],
		},
		color: {
			control: 'select',
			options: ['primary', 'destructive', 'warning', 'secondary'],
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg'],
		},
	},
};
