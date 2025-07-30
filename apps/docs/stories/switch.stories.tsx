import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@signozhq/switch';
import { generateDocs } from '../utils/generateDocs';

const switchExamples = [
	`import { Switch } from '@signozhq/switch';

export default function MyComponent() {
	return (
		<div className="space-y-4">
			<Switch id="notifications" labelName="Enable notifications" />
			<Switch id="dark-mode" labelName="Dark mode" defaultChecked />
			<Switch id="maintenance" labelName="Maintenance mode" disabled />
		</div>
	);
}`,
];

const switchDocs = generateDocs({
	packageName: '@signozhq/switch',
	description:
		'A toggle switch component for binary on/off or true/false selections.',
	examples: switchExamples,
});

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
		color: {
			control: 'select',
			options: ['robin', 'forest', 'amber', 'sienna', 'cherry', 'sakura', 'aqua'],
			description: 'The color variant of the switch',
		},
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: switchDocs,
			},
		},
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-742&p=f',
			},
		],
	},
	tags: ['autodocs'],
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
		color: 'robin',
	},
};

// ✅ Checked switch
export const Filled: Story = {
	args: {
		id: 'filled-switch',
		labelName: 'Filled switch',
		defaultChecked: true,
		disabled: false,
		color: 'robin',
	},
};

// ✅ Disabled switch
export const Disabled: Story = {
	args: {
		id: 'disabled-switch',
		labelName: 'Disabled switch',
		defaultChecked: false,
		disabled: true,
		color: 'robin',
	},
};

// ✅ Disabled + Checked
export const DisabledChecked: Story = {
	args: {
		id: 'disabled-checked-switch',
		labelName: 'Disabled switch – pre selected',
		defaultChecked: true,
		disabled: true,
		color: 'robin',
	},
};
