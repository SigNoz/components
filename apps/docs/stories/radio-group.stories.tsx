import { type RadioColorProps, RadioGroup, RadioGroupItem, RadioGroupLabel } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Import RadioGroupItem stories to reuse their args
import * as RadioGroupItemStories from './radio-group-item.stories.js';

const meta: Meta<typeof RadioGroup> = {
	title: 'Components/RadioGroup',
	component: RadioGroup,
	subcomponents: {
		RadioGroupItem: RadioGroupItem as any,
		RadioGroupLabel: RadioGroupLabel as any,
	},
	argTypes: {
		defaultValue: {
			control: 'text',
			description:
				'The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		value: {
			control: 'text',
			description:
				'The controlled value of the radio item to check. Should be used in conjunction with onChange.',
			table: { category: 'Form', type: { summary: 'string | null' } },
		},
		name: {
			control: 'text',
			description:
				'The name of the group. Submitted with its owning form as part of a name/value pair.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		required: {
			control: 'boolean',
			description:
				'When true, indicates that the user must check a radio item before the owning form can be submitted.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with radio items.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		dir: {
			control: 'select',
			options: ['ltr', 'rtl'],
			description:
				'The reading direction of the radio group. If omitted, inherits globally from DirectionProvider or assumes LTR (left-to-right) reading mode.',
			table: { category: 'Behavior', type: { summary: "'ltr' | 'rtl'" } },
		},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
			description: 'The orientation of the component.',
			table: { category: 'Layout', type: { summary: "'horizontal' | 'vertical'" } },
		},
		loop: {
			control: 'boolean',
			description:
				'When true, keyboard navigation will loop from last item to first, and vice versa.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		color: {
			control: 'select',
			options: ['robin', 'forest', 'amber', 'sienna', 'cherry', 'sakura', 'aqua'],
			description: 'The color of the radio group.',
			table: { category: 'Appearance', defaultValue: { summary: 'robin' } },
		},
		id: {
			control: 'text',
			description: 'A unique identifier for the radio group.',
			table: { category: 'Accessibility' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the radio group.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description: 'The testId associated with the radio group for testing purposes.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		onChange: {
			control: false,
			description: 'Event handler called when the value changes.',
			table: { category: 'Events', type: { summary: '(value: string) => void' } },
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
type Story = StoryObj<typeof RadioGroup>;

// Default radio group
export const Default: Story = {
	args: {
		defaultValue: 'option1',
		disabled: false,
		required: false,
		color: 'robin',
	},
	render: (args) => (
		<RadioGroup {...args}>
			<RadioGroupItem {...RadioGroupItemStories.Default.args} value="option1" id="option1">
				Option 1
			</RadioGroupItem>
			<RadioGroupItem {...RadioGroupItemStories.Default.args} value="option2" id="option2">
				Option 2
			</RadioGroupItem>
			<RadioGroupItem {...RadioGroupItemStories.Default.args} value="option3" id="option3">
				Option 3
			</RadioGroupItem>
		</RadioGroup>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="space-y-4">
			{['robin', 'forest', 'amber', 'sienna', 'cherry', 'sakura', 'aqua'].map((c) => (
				<div key={c} className="flex items-start gap-6">
					<div style={{ width: 120 }} className="capitalize">
						{c}
					</div>

					<RadioGroup color={c as RadioColorProps}>
						<RadioGroupItem value="default" id={`radio-${c}-default`}>
							Default
						</RadioGroupItem>
					</RadioGroup>

					<RadioGroup defaultValue="selected" color={c as RadioColorProps}>
						<RadioGroupItem value="selected" id={`radio-${c}-selected`}>
							Selected
						</RadioGroupItem>
					</RadioGroup>

					<RadioGroup color={c as RadioColorProps}>
						<RadioGroupItem value="disabled" id={`radio-${c}-disabled`} disabled={true}>
							Disabled
						</RadioGroupItem>
					</RadioGroup>

					<RadioGroup defaultValue="disabled-selected" color={c as RadioColorProps}>
						<RadioGroupItem
							value="disabled-selected"
							id={`radio-${c}-disabled-selected`}
							disabled={true}
						>
							Disabled Selected
						</RadioGroupItem>
					</RadioGroup>
				</div>
			))}
		</div>
	),
};
