import { Skeleton } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Skeleton> = {
	title: 'Primitive Components/Skeleton',
	component: Skeleton,
	argTypes: {
		active: {
			control: 'boolean',
			description: 'Whether to show an animated pulse effect.',
		},
		title: {
			control: 'object',
			description: 'Show/hide the title placeholder or configure its width.',
		},
		paragraph: {
			control: 'object',
			description: 'Configure paragraph rows and widths.',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
	args: {
		active: true,
		title: { width: '40%' },
		paragraph: { rows: 3 },
	},
};

export const Overview: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
			{/* Base variants */}
			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Base — with title & paragraph</p>
				<Skeleton active title={{ width: '40%' }} paragraph={{ rows: 3 }} />
			</div>

			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Base — variable row widths</p>
				<Skeleton active paragraph={{ rows: 4, width: ['100%', '95%', '80%', '60%'] }} />
			</div>

			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Base — no animation</p>
				<Skeleton active={false} title={{ width: '40%' }} paragraph={{ rows: 3 }} />
			</div>

			{/* Skeleton.Input */}
			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Skeleton.Input — small</p>
				<Skeleton.Input active size="small" />
			</div>

			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Skeleton.Input — default</p>
				<Skeleton.Input active />
			</div>

			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Skeleton.Input — large & block</p>
				<Skeleton.Input active size="large" block />
			</div>

			{/* Skeleton.Button */}
			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Skeleton.Button — small</p>
				<Skeleton.Button active size="small" />
			</div>

			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Skeleton.Button — block</p>
				<Skeleton.Button active block />
			</div>

			{/* Skeleton.Avatar */}
			<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
				<div>
					<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Avatar — circle</p>
					<Skeleton.Avatar active shape="circle" size={36} />
				</div>
				<div>
					<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Avatar — square</p>
					<Skeleton.Avatar active shape="square" size={36} />
				</div>
			</div>

			{/* Composed */}
			<div>
				<p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Composed — avatar + content</p>
				<div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
					<Skeleton.Avatar active shape="circle" size={48} />
					<div style={{ flex: 1 }}>
						<Skeleton active title={{ width: '40%' }} paragraph={{ rows: 3 }} />
					</div>
				</div>
			</div>
		</div>
	),
};
