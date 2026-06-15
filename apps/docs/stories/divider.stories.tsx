import { Divider } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Divider> = {
	title: 'Primitive Components/Divider',
	component: Divider,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A separator component for visually dividing content. Supports horizontal and vertical orientations, dashed lines, and optional text labels between the lines.',
			},
		},
	},
	argTypes: {
		type: {
			control: 'inline-radio',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the divider.',
			table: { category: 'Appearance', defaultValue: { summary: 'horizontal' } },
		},
		dashed: {
			control: 'boolean',
			description: 'Whether the divider line is dashed.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		plain: {
			control: 'boolean',
			description:
				'Use plain style for the divider text (normal font weight instead of bold). Only relevant when children are provided.',
			table: { category: 'Appearance', defaultValue: { summary: 'false' } },
		},
		children: {
			control: 'text',
			description: 'Optional text to display within a horizontal divider.',
			table: { category: 'Content' },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the divider.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles for custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {
	args: {
		type: 'horizontal',
		dashed: false,
		plain: false,
	},
	render: (props) => (
		<div style={{ width: '100%', padding: '1rem' }}>
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Content above</p>
			<Divider {...props} />
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Content below</p>
		</div>
	),
};

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
					Horizontal
				</h3>
				<div style={{ width: '100%', padding: '1rem' }}>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Section A</p>
					<Divider />
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Section B</p>
					<Divider />
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Section C</p>
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
					Vertical
				</h3>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
					<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Edit</span>
					<Divider type="vertical" />
					<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Copy</span>
					<Divider type="vertical" />
					<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Delete</span>
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
					Dashed
				</h3>
				<div style={{ width: '100%', padding: '1rem' }}>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Solid (default)</p>
					<Divider />
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Dashed</p>
					<Divider dashed />
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>End</p>
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
					With Text
				</h3>
				<div style={{ width: '100%', padding: '1rem' }}>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Login with email</p>
					<Divider>OR</Divider>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Login with SSO</p>
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
					Plain Text
				</h3>
				<div style={{ width: '100%', padding: '1rem' }}>
					<Divider>Default weight</Divider>
					<div style={{ height: '1rem' }} />
					<Divider plain>Plain weight</Divider>
				</div>
			</section>
		</div>
	),
};
