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

type Story = StoryObj<typeof Checkbox>;

export const Checked: Story = {
	args: {
		id: 'filled',
		labelName: 'Filled checkbox',
		defaultChecked: true,
		disabled: false,
	},
};

export const Disabled: Story = {
	args: {
		id: 'disabled',
		labelName: 'Disabled checkbox',
		defaultChecked: false,
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		id: 'disabled-filled',
		labelName: 'Disabled Filled',
		defaultChecked: true,
		disabled: true,
	},
};
