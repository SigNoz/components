import Badge from '@signozhq/badge';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'danger', 'outline'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon'],
		},
		children: { control: 'text' },
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		children: 'Badge',
		variant: 'primary',
		size: 'default',
	},
};

export const Secondary: Story = {
	args: {
		...Default.args,
		variant: 'secondary',
	},
};

export const Danger: Story = {
	args: {
		...Default.args,
		variant: 'danger',
	},
};

export const Outline: Story = {
	args: {
		...Default.args,
		variant: 'outline',
	},
};

export const Small: Story = {
	args: {
		...Default.args,
		size: 'sm',
	},
};

export const Large: Story = {
	args: {
		...Default.args,
		size: 'lg',
	},
};

export const Icon: Story = {
	args: {
		...Default.args,
		size: 'icon',
		children: '🚀',
	},
};
