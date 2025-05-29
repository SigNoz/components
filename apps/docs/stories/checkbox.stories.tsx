import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@signozhq/checkbox';
import { generateDocs } from '../utils/generateDocs';

const checkboxExamples = [
	`import { Checkbox } from '@signozhq/checkbox';

export default function MyComponent() {
	return (
		<div className="space-y-2">
			<Checkbox id="terms" labelName="Accept terms and conditions" />
			<Checkbox id="newsletter" labelName="Subscribe to newsletter" defaultChecked />
			<Checkbox id="disabled" labelName="Disabled option" disabled />
		</div>
	);
}`,
];

const checkboxDocs = generateDocs({
	packageName: '@signozhq/checkbox',
	description:
		'A customizable checkbox component for user selections with support for disabled states.',
	examples: checkboxExamples,
});

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
		docs: {
			description: {
				component: checkboxDocs,
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
type Story = StoryObj<typeof Checkbox>;

// Default checkbox
export const Default: Story = {
	args: {
		id: 'default',
		labelName: 'Default checkbox',
		defaultChecked: false,
		disabled: false,
	},
};

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
