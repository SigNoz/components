import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '@signozhq/radio-group';

const meta: Meta<typeof RadioGroup> = {
	title: 'Components/RadioGroup',
	component: RadioGroup,
	argTypes: {
		disabled: { control: 'boolean' },
		id: { control: 'text' },
	},
	parameters: {
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/file/your-design-url',
			},
		],
	},
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
	render: () => (
		<RadioGroup defaultValue="">
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="default" id="default-radio" />
				<label htmlFor="default-radio">Default radio</label>
			</div>
		</RadioGroup>
	),
};

export const Hover: Story = {
	render: () => (
		<RadioGroup defaultValue="">
			<div className="flex items-center space-x-2">
				<RadioGroupItem
					value="hover"
					id="hover-radio"
					className="hover:ring-1 hover:ring-primary"
				/>
				<label htmlFor="hover-radio">Hover radio</label>
			</div>
		</RadioGroup>
	),
};

export const Checked: Story = {
	render: () => (
		<RadioGroup defaultValue="filled">
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="filled" id="filled-radio" />
				<label htmlFor="filled-radio">Filled radio</label>
			</div>
		</RadioGroup>
	),
};

export const Disabled: Story = {
	render: () => (
		<RadioGroup defaultValue="">
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="disabled" id="disabled-radio" disabled />
				<label
					htmlFor="disabled-radio"
					className="text-zinc-400 cursor-not-allowed"
				>
					Disabled radio
				</label>
			</div>
		</RadioGroup>
	),
};

export const DisabledChecked: Story = {
	render: () => (
		<RadioGroup defaultValue="disabled-checked">
			<div className="flex items-center space-x-2">
				<RadioGroupItem
					value="disabled-checked"
					id="disabled-checked-radio"
					disabled
				/>
				<label
					htmlFor="disabled-checked-radio"
					className="text-zinc-400 cursor-not-allowed"
				>
					Disabled radio – selected
				</label>
			</div>
		</RadioGroup>
	),
};
