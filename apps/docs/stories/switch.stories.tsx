import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@signozhq/switch'; // adjust to your actual import path

const meta: Meta<typeof Switch> = {
	title: 'Components/Switch',
	component: Switch,
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
type Story = StoryObj<typeof Switch>;

// ✅ Interactive uncontrolled story
export const Default: Story = {
	args: {
		id: 'default-switch',
		labelName: 'Default switch',
		defaultChecked: false,
		disabled: false,
	},
};

// ✅ Hover simulation (optional addon required)
export const Hover: Story = {
	args: {
		id: 'hover-switch',
		labelName: 'Hover switch',
		defaultChecked: false,
		disabled: false,
	},
	parameters: {
		pseudo: {
			hover: true,
		},
	},
};

// ✅ Checked switch
export const Filled: Story = {
	args: {
		id: 'filled-switch',
		labelName: 'Filled switch',
		defaultChecked: true,
		disabled: false,
	},
};

// ✅ Disabled switch
export const Disabled: Story = {
	args: {
		id: 'disabled-switch',
		labelName: 'Disabled switch',
		defaultChecked: false,
		disabled: true,
	},
};

// ✅ Disabled + Checked
export const DisabledChecked: Story = {
	args: {
		id: 'disabled-checked-switch',
		labelName: 'Disabled switch – pre selected',
		defaultChecked: true,
		disabled: true,
	},
};
