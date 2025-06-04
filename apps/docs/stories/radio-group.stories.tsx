import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	RadioGroup,
	RadioGroupItem,
	RadioGroupLabel,
} from '@signozhq/radio-group';

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
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-742&p=f',
			},
		],
	},
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
	render: () => (
		<RadioGroup defaultValue="option1">
			<div className="flex flex-col space-y-2">
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option1" id="option1-radio" />
					<RadioGroupLabel htmlFor="option1-radio">Option 1</RadioGroupLabel>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option2" id="option2-radio" />
					<RadioGroupLabel htmlFor="option2-radio">Option 2</RadioGroupLabel>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option3" id="option3-radio" />
					<RadioGroupLabel htmlFor="option3-radio">Option 3</RadioGroupLabel>
				</div>
			</div>
		</RadioGroup>
	),
};

export const Disabled: Story = {
	render: () => (
		<RadioGroup defaultValue="active">
			<div className="flex flex-col space-y-2">
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="active" id="active-radio" />
					<RadioGroupLabel htmlFor="active-radio">Active Option</RadioGroupLabel>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="disabled1" id="disabled1-radio" disabled />
					<RadioGroupLabel htmlFor="disabled1-radio">
						Disabled Option 1
					</RadioGroupLabel>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="disabled2" id="disabled2-radio" disabled />
					<RadioGroupLabel htmlFor="disabled2-radio">
						Disabled Option 2
					</RadioGroupLabel>
				</div>
			</div>
		</RadioGroup>
	),
};
