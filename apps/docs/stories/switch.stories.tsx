import { Switch } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Switch> = {
	title: 'Components/Switch',
	component: Switch,
	argTypes: {
		children: {
			control: 'text',
			description:
				'The content inside the switch label. Typically used for adding text or other elements alongside the switch.',
			table: { category: 'Content' },
		},
		color: {
			control: 'select',
			options: ['robin', 'forest', 'amber', 'sienna', 'cherry', 'sakura', 'aqua'],
			description:
				'The color theme of the switch. Each color has semantic meaning for different use cases.',
			table: { category: 'Appearance', defaultValue: { summary: 'robin' } },
		},
		disabled: {
			control: 'boolean',
			description: 'Prevents user interaction and displays the switch in a disabled state.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		required: {
			control: 'boolean',
			description:
				'When true, indicates that the user must toggle the switch before the owning form can be submitted.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		id: {
			control: 'text',
			description:
				'A unique identifier for the switch. Links the switch with its label for accessibility.',
			table: { category: 'Accessibility' },
		},
		name: {
			control: 'text',
			description:
				'The name of the switch. Submitted with its owning form as part of a name/value pair.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		value: {
			control: 'boolean',
			description:
				'The controlled checked state of the switch. Use when you need to control its checked state.',
			table: { category: 'Form', type: { summary: 'boolean' } },
		},
		defaultValue: {
			control: 'boolean',
			description:
				'The initial checked state of the switch. Use when you do not need to control its checked state.',
			table: { category: 'Form', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes to apply to the switch.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		onChange: {
			control: false,
			description: 'The callback invoked when the checked state of the switch changes.',
			table: { category: 'Events', type: { summary: '(checked: boolean) => void' } },
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
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Default switch
export const Default: Story = {
	args: {
		id: 'default',
		children: 'Default switch',
		defaultValue: false,
		disabled: false,
		color: 'robin',
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="space-y-4">
			{['robin', 'forest', 'amber', 'sienna', 'cherry', 'sakura', 'aqua'].map((c) => (
				<div key={c} className="flex items-center gap-6">
					<div style={{ width: 120 }} className="capitalize">
						{c}
					</div>

					<Switch id={`switch-${c}-default`} color={c as any}>
						Default
					</Switch>

					<Switch id={`switch-${c}-checked`} defaultValue={true} color={c as any}>
						Checked
					</Switch>

					<Switch id={`switch-${c}-disabled`} disabled={true} color={c as any}>
						Disabled
					</Switch>

					<Switch
						id={`switch-${c}-disabled-checked`}
						defaultValue={true}
						disabled={true}
						color={c as any}
					>
						Disabled Checked
					</Switch>
				</div>
			))}
		</div>
	),
};
