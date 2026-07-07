import { Bold } from '@signozhq/icons';
import { Toggle, type ToggleColor, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './toggle.stories.module.css';

const meta: Meta<typeof Toggle> = {
	title: 'Primitive Components/Toggle',
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
			<Bold className="icon-sm" />
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
			<Bold className="icon-sm" />
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
			<Bold className="icon-sm" />
		</Toggle>
	),
};

const colors: ToggleColor[] = ['primary', 'destructive', 'warning', 'secondary', 'none'];

export const AllColors: Story = {
	render: () => (
		<div className="story-grid">
			{colors.map((color) => (
				<div key={color} className="story-column">
					<Typography size="sm" as="span" className={styles.capitalize}>
						{color}
					</Typography>
					<div className="story-row">
						<Toggle defaultValue={false} color={color} aria-label={`${color} off`}>
							<Bold className="icon-sm" />
						</Toggle>
						<Toggle defaultValue={true} color={color} aria-label={`${color} on`}>
							<Bold className="icon-sm" />
						</Toggle>
					</div>
				</div>
			))}
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className="story-row-lg">
			<Toggle size="sm" aria-label="Small">
				<Bold className="icon-sm" />
			</Toggle>
			<Toggle size="default" aria-label="Default">
				<Bold className="icon-sm" />
			</Toggle>
			<Toggle size="lg" aria-label="Large">
				<Bold className="icon-sm" />
			</Toggle>
		</div>
	),
};
