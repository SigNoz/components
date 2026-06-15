import { Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { getTransformedTypographyTokens } from '../utils.js';

const typography = getTransformedTypographyTokens();

const getFontSize = (variant: string): string => {
	return typography.FONTSIZE[variant as keyof typeof typography.FONTSIZE] || '';
};

const getFontWeight = (variant: string): string => {
	return typography.FONTWEIGHT[variant as keyof typeof typography.FONTWEIGHT] || '';
};

const FontSizeShowcase: React.FC = () => (
	<div style={{ padding: '1.25rem' }}>
		<h1
			style={{
				marginBottom: '1.25rem',
				fontSize: '1.125rem',
				fontWeight: 700,
				color: 'var(--text-vanilla-100)',
			}}
		>
			Font Sizes
		</h1>
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem' }}>
			{Object.keys(typography.FONTSIZE).map((variant) => (
				<div key={variant} style={{ color: 'var(--text-vanilla-100)' }}>
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
	<div style={{ padding: '1.25rem' }}>
		<h1
			style={{
				marginBottom: '1.25rem',
				fontSize: '1.125rem',
				fontWeight: 700,
				color: 'var(--text-vanilla-100)',
			}}
		>
			Font Weights
		</h1>
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem' }}>
			{Object.keys(typography.FONTWEIGHT).map((variant) => (
				<div key={variant} style={{ color: 'var(--text-vanilla-100)' }}>
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

const meta = {
	title: 'Primitive Components/Typography',
	component: Typography,
	parameters: {
		layout: 'fullscreen',
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
				// Semantic sizes (Ant Design compatible)
				'small',
				'base',
				'medium',
				'large',
				// Legacy sizes
				'xs',
				'sm',
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
			description:
				'Font size token. Use semantic sizes (small/base/medium/large) for Ant Design compatibility.',
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
			description: 'Apply a muted/secondary color treatment (deprecated, use color="muted").',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		color: {
			control: 'select',
			options: [undefined, 'muted', 'danger', 'warning', 'success'],
			description: 'Semantic color variant.',
			table: { category: 'Appearance' },
		},
		strong: {
			control: 'boolean',
			description: 'Apply bold font weight.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		italic: {
			control: 'boolean',
			description: 'Apply italic font style.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		code: {
			control: 'boolean',
			description: 'Apply inline code styling.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Apply disabled styling.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		copyable: {
			control: 'boolean',
			description: 'Enable copy to clipboard.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		interactive: {
			control: 'boolean',
			description:
				'Enable interactive hover styling (cursor pointer, hover color). Auto-enabled when onClick provided.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		onClick: {
			action: 'clicked',
			description: 'Click handler for the typography element.',
			table: { category: 'Events' },
		},
		onMouseEnter: {
			action: 'mouseEnter',
			description: 'Mouse enter handler.',
			table: { category: 'Events' },
		},
		onMouseLeave: {
			action: 'mouseLeave',
			description: 'Mouse leave handler.',
			table: { category: 'Events' },
		},
		level: {
			control: 'select',
			options: [undefined, 1, 2, 3, 4, 5],
			description: 'Heading level (1-5). Only for variant="title".',
			table: { category: 'Appearance' },
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
		style: {
			control: false,
			description: 'Inline styles for custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
	},
} as Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
	args: {
		children: 'The quick brown fox jumps over the lazy dog',
		variant: 'text',
		size: 'base',
		weight: 'normal',
		muted: false,
	},
	render: (props) => (
		<div style={{ padding: '1.5rem' }}>
			<Typography {...props} />
		</div>
	),
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

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Font Size
				</h3>
				<FontSizeShowcase />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Font Weight
				</h3>
				<FontWeightShowcase />
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Semantic Sizes
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					{(
						[
							{ name: 'small', px: '12px' },
							{ name: 'base', px: '14px' },
							{ name: 'medium', px: '16px' },
							{ name: 'large', px: '20px' },
						] as const
					).map(({ name, px }) => (
						<div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
							<span
								style={{
									width: 100,
									fontSize: 12,
									textAlign: 'right',
									color: 'var(--text-vanilla-400)',
									flexShrink: 0,
								}}
							>
								{name} ({px})
							</span>
							<Typography size={name}>The quick brown fox jumps over the lazy dog</Typography>
						</div>
					))}
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					All Sizes
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					{(
						[
							'xs',
							'sm',
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
						] as const
					).map((s) => (
						<div key={s} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
							<span
								style={{
									width: 48,
									fontSize: 12,
									textAlign: 'right',
									color: 'var(--text-vanilla-400)',
									flexShrink: 0,
								}}
							>
								{s}
							</span>
							<Typography size={s}>The quick brown fox jumps over the lazy dog</Typography>
						</div>
					))}
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					All Weights
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					{ALL_WEIGHTS.map(({ name, value }) => (
						<div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
							<span
								style={{
									width: 110,
									fontSize: 12,
									textAlign: 'right',
									color: 'var(--text-vanilla-400)',
									flexShrink: 0,
								}}
							>
								{name.toUpperCase()} - {value}
							</span>
							<Typography size="xl" weight={name}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</Typography>
						</div>
					))}
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Heading Variant
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
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
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Text Variant
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					<div>
						<Typography size="lg">
							This is a paragraph of body text. Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</Typography>
					</div>
					<div>
						<Typography as="span" size="sm" muted>
							This is a muted span element.
						</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Alignment
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					<div style={{ width: '25rem' }}>
						<Typography align="left" size="lg" style={{ width: '100%' }}>
							Left-aligned text
						</Typography>
					</div>
					<div style={{ width: '25rem' }}>
						<Typography align="center" size="lg" style={{ width: '100%' }}>
							Center-aligned text
						</Typography>
					</div>
					<div style={{ width: '25rem' }}>
						<Typography align="right" size="lg" style={{ width: '100%' }}>
							Right-aligned text
						</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Truncation
				</h3>
				<div
					style={{
						maxWidth: 400,
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						padding: '1.5rem',
					}}
				>
					<div>
						<Typography size="sm" muted style={{ marginBottom: 4 }}>
							truncate=1
						</Typography>
						<Typography truncate={1} size="base">
							This is a long piece of text that should be truncated after a single line. It keeps
							going and going to demonstrate the ellipsis behavior.
						</Typography>
					</div>
					<div>
						<Typography size="sm" muted style={{ marginBottom: 4 }}>
							truncate=2
						</Typography>
						<Typography truncate={2} size="base">
							This is a long piece of text that should be truncated after two lines. It keeps going
							and going to demonstrate the multi-line clamp behavior. The third line and beyond
							should be hidden with an ellipsis.
						</Typography>
					</div>
					<div>
						<Typography size="sm" muted style={{ marginBottom: 4 }}>
							truncate=3
						</Typography>
						<Typography truncate={3} size="base">
							This is a long piece of text that should be truncated after three lines. It keeps
							going and going and going. We need enough text here to fill at least four lines so we
							can verify the clamp works. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
							sed do eiusmod tempor incididunt ut labore.
						</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Muted State
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem' }}>
					<div>
						<Typography size="lg" weight="bold">
							Primary heading text
						</Typography>
					</div>
					<div>
						<Typography size="base">Normal body text with default color.</Typography>
					</div>
					<div>
						<Typography size="sm" muted>
							Muted helper text — secondary information or captions.
						</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Color Variants
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem' }}>
					<div>
						<Typography>Default text</Typography>
					</div>
					<div>
						<Typography color="muted">Muted text (secondary)</Typography>
					</div>
					<div>
						<Typography color="success">Success text</Typography>
					</div>
					<div>
						<Typography color="warning">Warning text</Typography>
					</div>
					<div>
						<Typography color="danger">Danger/error text</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Text Decorations
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem' }}>
					<div>
						<Typography strong>Strong/bold text</Typography>
					</div>
					<div>
						<Typography italic>Italic text</Typography>
					</div>
					<div>
						<Typography code>Inline code: const x = 1</Typography>
					</div>
					<div>
						<Typography strong italic>
							Strong and italic combined
						</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Title Levels
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					<Typography.Title level={1}>Heading Level 1 (h1)</Typography.Title>
					<Typography.Title level={2}>Heading Level 2 (h2)</Typography.Title>
					<Typography.Title level={3}>Heading Level 3 (h3)</Typography.Title>
					<Typography.Title level={4}>Heading Level 4 (h4)</Typography.Title>
					<Typography.Title level={5}>Heading Level 5 (h5)</Typography.Title>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Compound Components
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					<div>
						<Typography.Title level={2}>Typography.Title</Typography.Title>
					</div>
					<div>
						<Typography.Text>Typography.Text - regular paragraph text</Typography.Text>
					</div>
					<div>
						<Typography.Text strong>Typography.Text with strong</Typography.Text>
					</div>
					<div>
						<Typography.Text color="danger">Typography.Text with color="danger"</Typography.Text>
					</div>
					<div>
						<Typography.Link href="https://signoz.io">Typography.Link to SigNoz</Typography.Link>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Copyable
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem' }}>
					<div>
						<Typography copyable>Click the icon to copy this text</Typography>
					</div>
					<div>
						<Typography.Text code copyable>
							npm install @signozhq/ui
						</Typography.Text>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Disabled State
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem' }}>
					<div>
						<Typography>Normal text</Typography>
					</div>
					<div>
						<Typography disabled>Disabled text - cannot be selected</Typography>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Interactive
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
					<div>
						<Typography>Normal text (no hover effect)</Typography>
					</div>
					<div>
						<Typography onClick={() => alert('Clicked!')}>
							Clickable text - click me (has onClick)
						</Typography>
					</div>
					<div>
						<Typography interactive>
							Interactive text - hover me (no onClick, just styling)
						</Typography>
					</div>
					<div>
						<Typography
							onClick={() => alert('Clicked!')}
							onMouseEnter={() => console.log('Mouse entered')}
							onMouseLeave={() => console.log('Mouse left')}
						>
							With all mouse handlers - click, enter, leave
						</Typography>
					</div>
				</div>
			</section>
		</div>
	),
};
