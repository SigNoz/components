import { Spinner } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Spinner> = {
	title: 'Primitive Components/Spinner',
	component: Spinner,
	parameters: {
		docs: {
			description: {
				component:
					'A ring that rotates while work of unknown length is in flight. Size comes from the `size` prop, thickness and both ring colours are `--spinner-*` custom properties, and the colours derive from `currentColor`, so it takes the colour of whatever it sits in.',
			},
		},
	},
	argTypes: {
		size: {
			control: 'text',
			description: 'Diameter of the ring, written to `--spinner-size`. A number is read as pixels.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '12px' },
			},
		},
		role: {
			control: 'text',
			description:
				'Left unset, the spinner says nothing to a screen reader. Set `role="status"` with an `aria-label` when it stands alone instead of inside an `aria-busy` element.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the spinner.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles, the place to set the `--spinner-*` custom properties.',
			table: { category: 'Styling', type: { summary: 'CSSProperties' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Playground: Story = {
	args: {
		role: 'status',
		'aria-label': 'Loading',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="story-row">
			{[12, 16, 24, 40].map((size) => (
				<Spinner key={size} size={size} />
			))}
		</div>
	),
};

export const InheritsColor: Story = {
	render: () => (
		<div className="story-row">
			<span style={{ color: 'var(--primary-background)' }}>
				<Spinner />
			</span>
			<span style={{ color: 'var(--danger-background)' }}>
				<Spinner />
			</span>
			<span style={{ color: 'var(--success-background)' }}>
				<Spinner />
			</span>
		</div>
	),
};
