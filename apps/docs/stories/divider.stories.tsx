import { Divider, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './divider.stories.module.css';

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
		<div className={styles.container}>
			<Typography size="sm">Content above</Typography>
			<Divider {...props} />
			<Typography size="sm">Content below</Typography>
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
		<div className={styles.container}>
			<Typography size="sm">Section A</Typography>
			<Divider />
			<Typography size="sm">Section B</Typography>
			<Divider />
			<Typography size="sm">Section C</Typography>
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
		<div className={`story-row ${styles.container}`}>
			<Typography size="sm">Edit</Typography>
			<Divider type="vertical" />
			<Typography size="sm">Copy</Typography>
			<Divider type="vertical" />
			<Typography size="sm">Delete</Typography>
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
		<div className={styles.container}>
			<Typography size="sm">Solid (default)</Typography>
			<Divider />
			<Typography size="sm">Dashed</Typography>
			<Divider dashed />
			<Typography size="sm">End</Typography>
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
		<div className={styles.container}>
			<Typography size="sm">Login with email</Typography>
			<Divider>OR</Divider>
			<Typography size="sm">Login with SSO</Typography>
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
		<div className={styles.container}>
			<Divider>Default weight</Divider>
			<div className={styles.spacer} />
			<Divider plain>Plain weight</Divider>
		</div>
	),
};
