import { Bold } from '@signozhq/icons';
import { Toggle, type ToggleColor } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
			<Bold size={12} />
		</Toggle>
	),
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Pressed
				</h3>
				<Toggle
					defaultValue
					size="default"
					color="secondary"
					disabled={false}
					aria-label="Toggle bold"
				>
					<Bold size={12} />
				</Toggle>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Disabled
				</h3>
				<Toggle defaultValue={false} disabled aria-label="Toggle bold">
					<Bold size={12} />
				</Toggle>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					All Colors
				</h3>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
					{(['primary', 'destructive', 'warning', 'secondary', 'none'] as ToggleColor[]).map(
						(color) => (
							<div
								key={color}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '0.5rem',
								}}
							>
								<span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{color}</span>
								<div style={{ display: 'flex', gap: '0.5rem' }}>
									<Toggle defaultValue={false} color={color} aria-label={`${color} off`}>
										<Bold size={12} />
									</Toggle>
									<Toggle defaultValue color={color} aria-label={`${color} on`}>
										<Bold size={12} />
									</Toggle>
								</div>
							</div>
						)
					)}
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					All Sizes
				</h3>
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
					<Toggle size="sm" aria-label="Small">
						<Bold size={12} />
					</Toggle>
					<Toggle size="default" aria-label="Default">
						<Bold size={12} />
					</Toggle>
					<Toggle size="lg" aria-label="Large">
						<Bold size={12} />
					</Toggle>
				</div>
			</section>
		</div>
	),
};
