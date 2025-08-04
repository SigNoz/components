import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@signozhq/input';
import { generateDocs } from '../utils/generateDocs';

const inputExamples = [
	`import { Input } from "@signozhq/input";

export default function MyComponent() {
  return (
    <div>
      <label htmlFor="my-input" className="block mb-2 text-sm font-medium">
        Email address
      </label>
      <Input 
        id="my-input" 
        type="email" 
        placeholder="name@example.com" 
      />
    </div>
  );
}`,
];

const inputDocs = generateDocs({
	packageName: '@signozhq/input',
	description: 'A flexible input component with light and dark themes.',
	examples: inputExamples,
});

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
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: inputDocs,
			},
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
				className={`block mb-2 text-sm font-medium ${args.theme === 'dark' ? 'text-white' : ''}`}
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
