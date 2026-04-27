import { Typography } from '@signozhq/ui';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { generateDocs } from '../utils/generateDocs.js';
import { getTransformedTypographyTokens } from '../utils.js';

// ─── Usage documentation ─────────────────────────────────────────────────────

const typographyExamples = [
	`import { Typography } from '@signozhq/ui';

// Basic text (renders as <p>)
<Typography>Hello World</Typography>`,

	`// Heading variant (renders as <h2> by default)
<Typography variant="title" size="4xl">
  Page Title
</Typography>`,

	`// Control the heading level with "as"
<Typography variant="title" as="h1" size="5xl">
  Main Heading
</Typography>
<Typography variant="title" as="h3" size="2xl">
  Sub Heading
</Typography>`,

	`// Sizes: xs | sm | base | lg | xl | 2xl | 3xl | 4xl | 5xl | 6xl | 7xl | 8xl | 9xl
<Typography size="xs">Extra small</Typography>
<Typography size="base">Base (default)</Typography>
<Typography size="4xl">Extra large</Typography>`,

	`// Weights: thin | extralight | light | normal | medium | semibold | bold | extrabold | black
<Typography weight="thin">Thin — 100</Typography>
<Typography weight="normal">Normal — 400</Typography>
<Typography weight="bold">Bold — 700</Typography>
<Typography weight="black">Black — 900</Typography>`,

	`// Truncate after N lines
<Typography truncate={2}>
  This long text will be clamped to 2 lines with an ellipsis...
</Typography>`,

	`// Muted (secondary color)
<Typography muted>
  Helper text or captions
</Typography>`,

	`// Alignment
<Typography align="center" size="xl">
  Centered text
</Typography>`,
];

const typographyDocs = generateDocs({
	packageName: '@signozhq/ui',
	description:
		'A flexible Typography component for rendering text with consistent sizing, weight, alignment, and truncation. Supports two variants: `title` (heading) and `text` (body). Uses design tokens from the project for font sizes and weights.',
	examples: typographyExamples,
});

// ─── Token showcase (existing) ───────────────────────────────────────────────

const typography = getTransformedTypographyTokens();

const getFontSize = (variant: string): string => {
	return typography.FONTSIZE[variant as keyof typeof typography.FONTSIZE] || '';
};

const getFontWeight = (variant: string): string => {
	return typography.FONTWEIGHT[variant as keyof typeof typography.FONTWEIGHT] || '';
};

const FontSizeShowcase: React.FC = () => (
	<div className="p-5">
		<h1 className="mb-5 text-lg font-bold text-vanilla-100">Font Sizes</h1>
		<div className="grid grid-cols-1 gap-4">
			{Object.keys(typography.FONTSIZE).map((variant) => (
				<div key={variant} className="text-vanilla-100">
					<h2 style={{ fontSize: getFontSize(variant) }}>
						{variant} - {getFontSize(variant)}
					</h2>
					<p style={{ fontSize: getFontSize(variant) }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</div>
			))}
		</div>
	</div>
);

const FontWeightShowcase: React.FC = () => (
	<div className="p-5">
		<h1 className="mb-5 text-lg font-bold text-vanilla-100">Font Weights</h1>
		<div className="grid grid-cols-1 gap-4">
			{Object.keys(typography.FONTWEIGHT).map((variant) => (
				<div key={variant} className="text-vanilla-100">
					<h2 style={{ fontWeight: getFontWeight(variant) }}>
						{variant} - {getFontWeight(variant)}
					</h2>
					<p style={{ fontWeight: getFontWeight(variant) }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</div>
			))}
		</div>
	</div>
);

// ─── Meta ────────────────────────────────────────────────────────────────────

export default {
	title: 'Design System/Typography',
	component: Typography,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#1a1a1a' }],
		},
		docs: {
			description: {
				component: typographyDocs,
			},
		},
	},
	tags: ['autodocs'],
} as Meta<typeof Typography>;

type Story = StoryObj<typeof Typography>;

export const FontSize: StoryFn = () => <FontSizeShowcase />;
export const FontWeight: StoryFn = () => <FontWeightShowcase />;

// ─── Typography component stories ────────────────────────────────────────────

export const Playground: Story = {
	args: {
		children: 'The quick brown fox jumps over the lazy dog',
		variant: 'text',
		size: 'base',
		weight: 'normal',
		muted: false,
	},
	argTypes: {
		variant: {
			control: 'inline-radio',
			options: ['title', 'text'],
			description: 'Semantic variant – `title` renders as h2, `text` renders as p.',
			table: { category: 'Appearance', defaultValue: { summary: 'text' } },
		},
		as: {
			control: 'select',
			options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label'],
			description: 'Override the rendered HTML element.',
			table: { category: 'Appearance' },
		},
		size: {
			control: 'select',
			options: [
				'xs',
				'sm',
				'base',
				'lg',
				'xl',
				'2xl',
				'3xl',
				'4xl',
				'5xl',
				'6xl',
				'7xl',
				'8xl',
				'9xl',
			],
			description: 'Font size token.',
			table: { category: 'Appearance', defaultValue: { summary: 'base' } },
		},
		weight: {
			control: 'select',
			options: [
				'thin',
				'extralight',
				'light',
				'normal',
				'medium',
				'semibold',
				'bold',
				'extrabold',
				'black',
			],
			description: 'Font weight token (100–900).',
			table: { category: 'Appearance', defaultValue: { summary: 'normal' } },
		},
		align: {
			control: 'inline-radio',
			options: ['left', 'center', 'right'],
			description: 'Text alignment.',
			table: { category: 'Appearance' },
		},
		truncate: {
			control: { type: 'number', min: 1, max: 5 },
			description: 'Number of lines before truncating with ellipsis.',
			table: { category: 'Appearance' },
		},
		muted: {
			control: 'boolean',
			description: 'Apply a muted/secondary color treatment.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		children: {
			control: 'text',
			description: 'Content to render.',
			table: { category: 'Content' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling' },
		},
	},
	render: (props) => (
		<div className="p-6">
			<Typography {...props} />
		</div>
	),
};

export const AllSizes: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'All available size tokens from `xs` to `9xl`. Each row shows the token name alongside sample text at that size.',
			},
		},
	},
	render: () => {
		const sizes = [
			'xs',
			'sm',
			'base',
			'lg',
			'xl',
			'2xl',
			'3xl',
			'4xl',
			'5xl',
			'6xl',
			'7xl',
			'8xl',
			'9xl',
		] as const;

		return (
			<div className="space-y-4 p-6">
				{sizes.map((s) => (
					<div key={s} className="flex items-baseline gap-4">
						<span
							className="text-vanilla-400 shrink-0"
							style={{ width: 48, fontSize: 12, textAlign: 'right' }}
						>
							{s}
						</span>
						<Typography size={s}>The quick brown fox jumps over the lazy dog</Typography>
					</div>
				))}
			</div>
		);
	},
};

const ALL_WEIGHTS = [
	{ name: 'thin' as const, value: 100 },
	{ name: 'extralight' as const, value: 200 },
	{ name: 'light' as const, value: 300 },
	{ name: 'normal' as const, value: 400 },
	{ name: 'medium' as const, value: 500 },
	{ name: 'semibold' as const, value: 600 },
	{ name: 'bold' as const, value: 700 },
	{ name: 'extrabold' as const, value: 800 },
	{ name: 'black' as const, value: 900 },
];

export const AllWeights: Story = {
	parameters: {
		docs: {
			description: {
				story: 'All 9 font weight tokens from `thin` (100) to `black` (900).',
			},
		},
	},
	render: () => (
		<div className="space-y-4 p-6">
			{ALL_WEIGHTS.map(({ name, value }) => (
				<div key={name} className="flex items-baseline gap-4">
					<span
						className="text-vanilla-400 shrink-0"
						style={{ width: 110, fontSize: 12, textAlign: 'right' }}
					>
						{name.toUpperCase()} - {value}
					</span>
					<Typography size="xl" weight={name}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</Typography>
				</div>
			))}
		</div>
	),
};

export const HeadingVariant: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Using `variant="title"` renders as an `<h2>` by default with bold weight and tighter line-height. Combine with `as` to control the heading level.',
			},
		},
	},
	render: () => (
		<div className="space-y-4 p-6">
			<Typography variant="title" as="h1" size="5xl">
				Heading 1
			</Typography>
			<Typography variant="title" as="h2" size="4xl">
				Heading 2
			</Typography>
			<Typography variant="title" as="h3" size="3xl">
				Heading 3
			</Typography>
			<Typography variant="title" as="h4" size="2xl">
				Heading 4
			</Typography>
			<Typography variant="title" as="h5" size="xl">
				Heading 5
			</Typography>
			<Typography variant="title" as="h6" size="lg">
				Heading 6
			</Typography>
		</div>
	),
};

export const TextVariant: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The default `variant="text"` renders as `<p>`. Use `as` to render as `<span>`, `<div>`, or `<label>`.',
			},
		},
	},
	render: () => (
		<div className="space-y-4 p-6">
			<Typography size="lg">
				This is a paragraph of body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</Typography>
			<Typography as="span" size="sm" muted>
				This is a muted span element.
			</Typography>
		</div>
	),
};

export const Alignment: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Control text alignment with the `align` prop.',
			},
		},
	},
	render: () => (
		<div className="space-y-4 p-6">
			<Typography align="left" size="lg">
				Left-aligned text
			</Typography>
			<Typography align="center" size="lg">
				Center-aligned text
			</Typography>
			<Typography align="right" size="lg">
				Right-aligned text
			</Typography>
		</div>
	),
};

export const Truncation: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use the `truncate` prop to clamp text after N lines. Hover the text to see the full content via the browser title.',
			},
		},
	},
	render: () => (
		<div className="space-y-6 p-6" style={{ maxWidth: 400 }}>
			<div>
				<Typography size="sm" muted style={{ marginBottom: 4 }}>
					truncate=1
				</Typography>
				<Typography truncate={1} size="base">
					This is a long piece of text that should be truncated after a single line. It keeps going
					and going to demonstrate the ellipsis behavior.
				</Typography>
			</div>
			<div>
				<Typography size="sm" muted style={{ marginBottom: 4 }}>
					truncate=2
				</Typography>
				<Typography truncate={2} size="base">
					This is a long piece of text that should be truncated after two lines. It keeps going and
					going to demonstrate the multi-line clamp behavior. The third line and beyond should be
					hidden with an ellipsis.
				</Typography>
			</div>
			<div>
				<Typography size="sm" muted style={{ marginBottom: 4 }}>
					truncate=3
				</Typography>
				<Typography truncate={3} size="base">
					This is a long piece of text that should be truncated after three lines. It keeps going
					and going and going. We need enough text here to fill at least four lines so we can verify
					the clamp works. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
					tempor incididunt ut labore.
				</Typography>
			</div>
		</div>
	),
};

export const MutedState: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use `muted` to apply a secondary/subdued color. Useful for captions, helper text, and secondary labels.',
			},
		},
	},
	render: () => (
		<div className="space-y-2 p-6">
			<Typography size="lg" weight="bold">
				Primary heading text
			</Typography>
			<Typography size="base">Normal body text with default color.</Typography>
			<Typography size="sm" muted>
				Muted helper text — secondary information or captions.
			</Typography>
		</div>
	),
};
