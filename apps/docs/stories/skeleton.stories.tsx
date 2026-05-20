import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@signozhq/ui';

const meta: Meta<typeof Skeleton> = {
	title: 'Components/Skeleton',
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

// Base Skeleton 

export const Default: Story = {
	args: {
		active: true,
		title: { width: '40%' },
		paragraph: { rows: 3 },
	},
};

export const NoAnimation: Story = {
	args: {
		active: false,
		title: { width: '40%' },
		paragraph: { rows: 3 },
	},
};

export const NoTitle: Story = {
	args: {
		active: true,
		title: false,
		paragraph: { rows: 4 },
	},
};

export const NoParagraph: Story = {
	args: {
		active: true,
		title: { width: '60%' },
		paragraph: false,
	},
};

export const ManyRows: Story = {
	args: {
		active: true,
		paragraph: { rows: 8 },
	},
};

export const VariableRowWidths: Story = {
	args: {
		active: true,
		title: { width: '60%' },
		paragraph: {
			rows: 4,
			width: ['100%', '95%', '80%', '60%'],
		},
	},
};

export const SingleRowWidth: Story = {
	args: {
		active: true,
		paragraph: {
			rows: 4,
			width: '60%',
		},
	},
};

// Skeleton.Input 

export const InputDefault: Story = {
	render: () => <Skeleton.Input active />,
};

export const InputSmall: Story = {
	render: () => <Skeleton.Input active size="small" />,
};

export const InputLarge: Story = {
	render: () => <Skeleton.Input active size="large" />,
};

export const InputBlock: Story = {
	render: () => <Skeleton.Input active block />,
};

// Skeleton.Button

export const ButtonDefault: Story = {
	render: () => <Skeleton.Button active />,
};

export const ButtonSmall: Story = {
	render: () => <Skeleton.Button active size="small" />,
};

export const ButtonBlock: Story = {
	render: () => <Skeleton.Button active block />,
};

// Skeleton.Avatar 

export const AvatarCircle: Story = {
	render: () => <Skeleton.Avatar active shape="circle" size={36} />,
};

export const AvatarSquare: Story = {
	render: () => <Skeleton.Avatar active shape="square" size={36} />,
};

export const AvatarLarge: Story = {
	render: () => <Skeleton.Avatar active size="large" />,
};

//  Composed example 

export const ComposedCard: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
			<Skeleton.Avatar active shape="circle" size={48} />
			<div style={{ flex: 1 }}>
				<Skeleton active title={{ width: '40%' }} paragraph={{ rows: 3 }} />
			</div>
		</div>
	),
};
