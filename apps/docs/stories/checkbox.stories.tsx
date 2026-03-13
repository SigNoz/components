import { Checkbox } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Checkbox> = {
	title: 'Components/Checkbox',
	component: Checkbox,
	argTypes: {
		children: {
			control: 'text',
			description:
				'The content inside the checkbox. Typically used for adding text or other elements alongside the checkbox.',
			table: { category: 'Content' },
		},
		color: {
			control: 'select',
			options: [
				'primary',
				'success',
				'warning',
				'error',
				'robin',
				'forest',
				'amber',
				'sienna',
				'cherry',
				'sakura',
				'aqua',
			],
			description:
				'The color theme of the checkbox. Each color has semantic meaning for different use cases.',
			table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Prevents user interaction and displays the checkbox in a disabled state.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		required: {
			control: 'boolean',
			description:
				'When true, indicates that the user must check the checkbox before the owning form can be submitted.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		id: {
			control: 'text',
			description:
				'A unique identifier for the checkbox. Links the checkbox with its label for accessibility.',
			table: { category: 'Accessibility' },
		},
		name: {
			control: 'text',
			description:
				'The name of the checkbox. Submitted with its owning form as part of a name/value pair.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		value: {
			control: 'select',
			options: [true, false, 'indeterminate'],
			description:
				'The controlled checked state of the checkbox. Use when you need to control its checked state.',
			table: { category: 'Form', type: { summary: 'boolean' } },
		},
		defaultValue: {
			control: 'select',
			options: [true, false, 'indeterminate'],
			description:
				'The initial checked state of the checkbox. Use when you do not need to control its checked state.',
			table: { category: 'Form', defaultValue: { summary: 'false' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the checkbox for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the checkbox.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onChange: {
			control: false,
			description: 'The callback invoked when the checked state of the checkbox changes.',
			table: { category: 'Events', type: { summary: '(checked: CheckedState) => void' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
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
		children: 'Default checkbox',
		defaultValue: false,
		disabled: false,
		required: false,
		color: 'primary',
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="space-y-4">
			{[
				'primary',
				'success',
				'warning',
				'error',
				'robin',
				'forest',
				'amber',
				'sienna',
				'cherry',
				'sakura',
				'aqua',
			].map((c) => (
				<div key={c} className="flex items-center gap-6">
					<div style={{ width: 120 }} className="capitalize">
						{c}
					</div>

					<Checkbox id={`checkbox-${c}-default`} color={c as any}>
						Default
					</Checkbox>

					<Checkbox id={`checkbox-${c}-checked`} defaultValue={true} color={c as any}>
						Checked
					</Checkbox>

					<Checkbox
						id={`checkbox-${c}-indeterminate`}
						defaultValue={'indeterminate' as any}
						color={c as any}
					>
						Indeterminate
					</Checkbox>

					<Checkbox id={`checkbox-${c}-disabled`} disabled={true} color={c as any}>
						Disabled
					</Checkbox>

					<Checkbox
						id={`checkbox-${c}-disabled-checked`}
						defaultValue={true}
						disabled={true}
						color={c as any}
					>
						Disabled Checked
					</Checkbox>
				</div>
			))}
		</div>
	),
};
