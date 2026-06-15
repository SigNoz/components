import { Input } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Input> = {
	title: 'Primitive Components/Input',
	component: Input,
	parameters: {
		layout: 'fullscreen',
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-742&p=f',
			},
		],
		docs: {
			description: {
				component:
					'A flexible input component with light and dark theme support. Supports various input types including password, proper accessibility, and seamless integration with forms. Perfect for text entry, search fields, password inputs, and form validation.',
			},
		},
	},
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the input.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		name: {
			control: 'text',
			description:
				'The name of the input. Submitted with its owning form as part of a name/value pair.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text displayed when the input is empty.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		type: {
			control: 'select',
			options: [
				'text',
				'email',
				'password',
				'number',
				'tel',
				'url',
				'search',
				'date',
				'time',
				'datetime-local',
			],
			description:
				'The input type. Determines the keyboard layout and validation behavior. Use type="password" for password inputs.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'text' },
				type: { summary: 'string' },
			},
		},
		disabled: {
			control: 'boolean',
			description:
				'Whether the input is disabled and non-interactive. Disabled inputs cannot be focused or edited.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		required: {
			control: 'boolean',
			description: 'Whether the input is required. Browsers will prevent form submission if empty.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		readOnly: {
			control: 'boolean',
			description:
				'Whether the input is read-only. Read-only inputs can be focused but not edited.',
			table: {
				category: 'Behavior',
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		value: {
			control: 'text',
			description: 'The controlled value of the input.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		defaultValue: {
			control: 'text',
			description: 'The default uncontrolled value of the input.',
			table: { category: 'Form', type: { summary: 'string' } },
		},
		prefix: {
			control: false,
			description: 'Optional element rendered before the input, such as an icon or label.',
			table: { category: 'Appearance', type: { summary: 'React.ReactNode' } },
		},
		suffix: {
			control: false,
			description: 'Optional element rendered after the input, such as an icon or action button.',
			table: { category: 'Appearance', type: { summary: 'React.ReactNode' } },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles applied to custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		onChange: {
			control: false,
			description: 'Event handler called when the input value changes.',
			table: {
				category: 'Events',
				type: { summary: '(event: React.ChangeEvent<HTMLInputElement>) => void' },
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
		type: 'text',
		disabled: false,
		required: false,
		readOnly: false,
	},
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
					Input Types
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Common Input Types
						</h3>
						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}
						>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-text"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									Text
								</label>
								<Input id="type-text" type="text" placeholder="Enter text" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-email"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									Email
								</label>
								<Input id="type-email" type="email" placeholder="email@example.com" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-password"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									Password
								</label>
								<Input id="type-password" type="password" placeholder="Enter password" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-number"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									Number
								</label>
								<Input id="type-number" type="number" placeholder="Enter number" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-tel"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									Telephone
								</label>
								<Input id="type-tel" type="tel" placeholder="+1 (555) 000-0000" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-url"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									URL
								</label>
								<Input id="type-url" type="url" placeholder="https://example.com" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="type-search"
									style={{
										display: 'block',
										fontSize: '0.75rem',
										color: 'var(--muted-foreground)',
									}}
								>
									Search
								</label>
								<Input id="type-search" type="search" placeholder="Search..." />
							</div>
						</div>
					</div>
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
					With Labels
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<label
								htmlFor="labeled-input-1"
								style={{
									display: 'block',
									fontSize: '0.875rem',
									fontWeight: 500,
									color: 'var(--muted-foreground)',
								}}
							>
								Full Name
							</label>
							<Input id="labeled-input-1" placeholder="John Doe" />
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<label
								htmlFor="labeled-input-2"
								style={{
									display: 'block',
									fontSize: '0.875rem',
									fontWeight: 500,
									color: 'var(--muted-foreground)',
								}}
							>
								Email Address
							</label>
							<Input id="labeled-input-2" type="email" placeholder="john@example.com" />
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<label
								htmlFor="labeled-input-3"
								style={{
									display: 'block',
									fontSize: '0.875rem',
									fontWeight: 500,
									color: 'var(--muted-foreground)',
								}}
							>
								Phone Number
							</label>
							<Input id="labeled-input-3" type="tel" placeholder="+1 (555) 000-0000" />
						</div>
					</div>
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
					Disabled States
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<label
								htmlFor="disabled-input"
								style={{
									display: 'block',
									fontSize: '0.875rem',
									fontWeight: 500,
									color: 'var(--muted-foreground)',
								}}
							>
								Disabled Input
							</label>
							<Input id="disabled-input" placeholder="Cannot edit this" disabled />
						</div>
					</div>
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
					Read Only States
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<label
								htmlFor="readonly-input"
								style={{
									display: 'block',
									fontSize: '0.875rem',
									fontWeight: 500,
									color: 'var(--muted-foreground)',
								}}
							>
								Read-Only Input
							</label>
							<Input
								id="readonly-input"
								value="This value can be selected but not edited"
								readOnly
							/>
						</div>
					</div>
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
					Required Fields
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '28rem' }}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<label
								htmlFor="required-input"
								style={{
									display: 'block',
									fontSize: '0.875rem',
									fontWeight: 500,
									color: 'var(--muted-foreground)',
								}}
							>
								Email Address <span style={{ color: '#ef4444' }}>*</span>
							</label>
							<Input id="required-input" type="email" placeholder="Required field" required />
							<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
								This field is required
							</p>
						</div>
					</div>
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
					Form Examples
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '2rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div
						style={{ maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
					>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>
							Contact Form
						</h3>
						<form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="form-name"
									style={{
										display: 'block',
										fontSize: '0.875rem',
										fontWeight: 500,
										color: 'var(--muted-foreground)',
									}}
								>
									Full Name <span style={{ color: '#ef4444' }}>*</span>
								</label>
								<Input id="form-name" placeholder="John Doe" required />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="form-email"
									style={{
										display: 'block',
										fontSize: '0.875rem',
										fontWeight: 500,
										color: 'var(--muted-foreground)',
									}}
								>
									Email Address <span style={{ color: '#ef4444' }}>*</span>
								</label>
								<Input id="form-email" type="email" placeholder="john@example.com" required />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="form-phone"
									style={{
										display: 'block',
										fontSize: '0.875rem',
										fontWeight: 500,
										color: 'var(--muted-foreground)',
									}}
								>
									Phone Number
								</label>
								<Input id="form-phone" type="tel" placeholder="+1 (555) 000-0000" />
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
								<label
									htmlFor="form-password"
									style={{
										display: 'block',
										fontSize: '0.875rem',
										fontWeight: 500,
										color: 'var(--muted-foreground)',
									}}
								>
									Password <span style={{ color: '#ef4444' }}>*</span>
								</label>
								<Input id="form-password" placeholder="Enter password" required type="password" />
							</div>
						</form>
					</div>
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
					Password Input
				</h3>
				<div style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
					<h2 style={{ marginBottom: '0.75rem' }}>Input.Password Example</h2>
					<Input.Password placeholder="Enter password" />
				</div>
			</section>
		</div>
	),
};
