import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@signozhq/checkbox';

const meta: Meta<typeof Checkbox> = {
	title: 'Components/Checkbox',
	component: Checkbox,
	argTypes: {
		labelName: {
			control: 'text',
		},
		disabled: {
			control: 'boolean',
		},
		id: {
			control: 'text',
		},
		color: {
			control: 'select',
			options: ['robin', 'forest', 'amber', 'sienna', 'cherry', 'sakura', 'aqua'],
			description: 'The color variant of the checkbox',
		},
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
type Story = StoryObj<typeof Checkbox>;

// Default checkbox
export const Default: Story = {
	args: {
		id: 'default',
		labelName: 'Default checkbox',
		defaultChecked: false,
		disabled: false,
		color: 'robin',
	},
};

export const Checked: Story = {
	args: {
		id: 'filled',
		labelName: 'Filled checkbox',
		defaultChecked: true,
		disabled: false,
		color: 'robin',
	},
};

export const Disabled: Story = {
	args: {
		id: 'disabled',
		labelName: 'Disabled checkbox',
		defaultChecked: false,
		disabled: true,
		color: 'robin',
	},
};

export const DisabledChecked: Story = {
	args: {
		id: 'disabled-filled',
		labelName: 'Disabled Filled',
		defaultChecked: true,
		disabled: true,
		color: 'robin',
	},
};
