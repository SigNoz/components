import { Toggle, type ToggleColor } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold } from 'lucide-react';

const meta: Meta<typeof Toggle> = {
	title: 'Components/Toggle',
	component: Toggle,
	argTypes: {
		value: {
			control: 'boolean',
			description: 'The controlled state of the toggle.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		defaultValue: {
			control: 'boolean',
			description:
				'The state of the toggle when initially rendered. Use when you do not need to control the state.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		onChange: {
			control: false,
			description: 'The callback that fires when the state of the toggle changes.',
			table: { category: 'Events', type: { summary: '(value: boolean) => void' } },
		},
		size: {
			control: 'radio',
			options: ['default', 'sm', 'lg'],
			description: 'The size of the toggle.',
			table: {
				category: 'Appearance',
				type: { summary: "'default' | 'sm' | 'lg'" },
				defaultValue: { summary: 'default' },
			},
		},
		color: {
			control: 'select',
			options: ['primary', 'destructive', 'warning', 'secondary', 'none'],
			description: 'The color variant of the toggle.',
			table: {
				category: 'Appearance',
				type: { summary: 'ToggleColor' },
				defaultValue: { summary: 'secondary' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'When true, prevents the user from interacting with the toggle.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling' },
		},
		testId: {
			control: 'text',
			description: 'The testId for testing purposes.',
			table: { category: 'Testing' },
		},
	},
	parameters: {
		layout: 'fullscreen',
		tags: ['autodocs'],
	},
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
	args: {
		defaultValue: false,
		size: 'default',
		color: 'secondary',
		disabled: false,
	},
	render: (args) => (
		<Toggle {...args} aria-label="Toggle bold">
			<Bold className="h-3 w-3" />
		</Toggle>
	),
};

export const Pressed: Story = {
	args: {
		defaultValue: true,
		size: 'default',
		color: 'secondary',
		disabled: false,
	},
	render: (args) => (
		<Toggle {...args} aria-label="Toggle bold">
			<Bold className="h-3 w-3" />
		</Toggle>
	),
};

export const Disabled: Story = {
	args: {
		defaultValue: false,
		disabled: true,
	},
	render: (args) => (
		<Toggle {...args} aria-label="Toggle bold">
			<Bold className="h-3 w-3" />
		</Toggle>
	),
};

const colors: ToggleColor[] = ['primary', 'destructive', 'warning', 'secondary', 'none'];

export const AllColors: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{colors.map((color) => (
				<div key={color} className="flex flex-col items-center gap-2">
					<span className="text-sm capitalize">{color}</span>
					<div className="flex gap-2">
						<Toggle defaultValue={false} color={color} aria-label={`${color} off`}>
							<Bold className="h-3 w-3" />
						</Toggle>
						<Toggle defaultValue={true} color={color} aria-label={`${color} on`}>
							<Bold className="h-3 w-3" />
						</Toggle>
					</div>
				</div>
			))}
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Toggle size="sm" aria-label="Small">
				<Bold className="h-3 w-3" />
			</Toggle>
			<Toggle size="default" aria-label="Default">
				<Bold className="h-3 w-3" />
			</Toggle>
			<Toggle size="lg" aria-label="Large">
				<Bold className="h-3 w-3" />
			</Toggle>
		</div>
	),
};
