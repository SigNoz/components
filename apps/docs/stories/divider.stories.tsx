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

export const Playground: Story = {
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

export const Horizontal: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A simple horizontal divider separating content sections.',
			},
		},
	},
	render: () => (
		<div style={{ width: '100%', padding: '1rem' }}>
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Section A</p>
			<Divider />
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Section B</p>
			<Divider />
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Section C</p>
		</div>
	),
};

export const Vertical: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A vertical divider for inline separation, commonly used in toolbars and action groups.',
			},
		},
	},
	render: () => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
			<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Edit</span>
			<Divider type="vertical" />
			<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Copy</span>
			<Divider type="vertical" />
			<span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Delete</span>
		</div>
	),
};

export const Dashed: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Use the `dashed` prop for a dashed line style.',
			},
		},
	},
	render: () => (
		<div style={{ width: '100%', padding: '1rem' }}>
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Solid (default)</p>
			<Divider />
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Dashed</p>
			<Divider dashed />
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>End</p>
		</div>
	),
};

export const WithText: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Pass children to render text between the divider lines. Useful for "OR" separators and section labels.',
			},
		},
	},
	render: () => (
		<div style={{ width: '100%', padding: '1rem' }}>
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Login with email</p>
			<Divider>OR</Divider>
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Login with SSO</p>
		</div>
	),
};

export const PlainText: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The `plain` prop renders divider text with normal font weight instead of medium.',
			},
		},
	},
	render: () => (
		<div style={{ width: '100%', padding: '1rem' }}>
			<Divider>Default weight</Divider>
			<div style={{ height: '1rem' }} />
			<Divider plain>Plain weight</Divider>
		</div>
	),
};
