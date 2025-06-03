import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@signozhq/input';

const meta: Meta<typeof Input> = {
	title: 'Components/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		theme: {
			control: 'radio',
			options: ['light', 'dark'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
		theme: 'light',
	},
};

export const Dark: Story = {
	args: {
		placeholder: 'Enter text...',
		theme: 'dark',
	},
};

export const WithLabel: Story = {
	render: (args) => (
		<div className={args.theme === 'dark' ? 'bg-gray-800 p-4' : ''}>
			<label
				htmlFor="input-with-label"
				className={`block mb-2 text-sm ${args.theme === 'dark' ? 'text-white' : ''}`}
			>
				Label
			</label>
			<Input id="input-with-label" {...args} />
		</div>
	),
	args: {
		placeholder: 'Enter text...',
		theme: 'light',
	},
};

export const Disabled: Story = {
	args: {
		placeholder: 'Disabled input',
		disabled: true,
		theme: 'light',
	},
};

export const DisabledDark: Story = {
	args: {
		placeholder: 'Disabled input',
		disabled: true,
		theme: 'dark',
	},
};

export const WithType: Story = {
	args: {
		type: 'password',
		placeholder: 'Enter password...',
		theme: 'light',
	},
};

export const WithTypeDark: Story = {
	args: {
		type: 'password',
		placeholder: 'Enter password...',
		theme: 'dark',
	},
};
