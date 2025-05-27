import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonSize } from '@signozhq/button';
import { Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateDocs } from '../utils/generateDocs';

const VARIANTS = ['solid', 'outlined', 'dashed', 'ghost', 'link'] as const;
const COLORS = ['primary', 'destructive', 'warning', 'secondary'] as const;

type ButtonConfig = {
	size?: ButtonSize;
	variant?: 'solid' | 'outlined' | 'dashed' | 'ghost' | 'link';
	color?: 'primary' | 'destructive' | 'warning' | 'secondary';
	label: string;
	buttonText?: string;
};

const buttonExamples = [
	`import { Button } from '@signozhq/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
		design: {
			type: 'figma',
			url: 'https://www.figma.com/file/...',
		},
		backgrounds: {
			disable: true,
		},
		controls: { disable: true },
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

// Add Action Button Story
export const ActionButtons: Story = {
	parameters: {
		controls: { disable: true },
	},
	argTypes: {
		background: {
			control: 'select',
			options: ['ink-500', 'ink-400', 'vanilla-100', 'vanilla-200'],
			description: 'The background context for the action button',
		},
	},
	args: {
		variant: 'action',
		background: 'ink-500',
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
							variant="action"
							background="ink-500"
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
							variant="action"
							background="ink-400"
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
							variant="action"
							background="vanilla-100"
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
							variant="action"
							background="vanilla-200"
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
							variant="action"
							background="ink-500"
							disabled
							prefixIcon={<ChevronLeft />}
							suffixIcon={<ChevronRight />}
						>
							Disabled Action Button
						</Button>
					</div>
					<div className="p-6 bg-vanilla-100 rounded-lg">
						<Button
							variant="action"
							background="vanilla-100"
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
