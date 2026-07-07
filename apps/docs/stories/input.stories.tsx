import { Input, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './input.stories.module.css';

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

// Default input story (Primary)
export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
		type: 'text',
		disabled: false,
		required: false,
		readOnly: false,
	},
};

// Variant Examples - These appear in the Examples section

export const InputTypes: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Input component supports various HTML input types. Each type provides appropriate keyboard layouts and validation on mobile devices.',
			},
		},
	},
	argTypes: {
		placeholder: { control: false },
		type: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="story-container-full">
			<div className="story-section">
				<Typography as="h3" size="sm" weight="medium">
					Common Input Types
				</Typography>
				<div className={`story-section ${styles.maxWidthMd}`}>
					<div className="story-section-sm">
						<label htmlFor="type-text">
							<Typography size="xs" color="muted">
								Text
							</Typography>
						</label>
						<Input id="type-text" type="text" placeholder="Enter text" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="type-email">
							<Typography size="xs" color="muted">
								Email
							</Typography>
						</label>
						<Input id="type-email" type="email" placeholder="email@example.com" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="type-password">
							<Typography size="xs" color="muted">
								Password
							</Typography>
						</label>
						<Input id="type-password" type="password" placeholder="Enter password" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="type-number">
							<Typography size="xs" color="muted">
								Number
							</Typography>
						</label>
						<Input id="type-number" type="number" placeholder="Enter number" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="type-tel">
							<Typography size="xs" color="muted">
								Telephone
							</Typography>
						</label>
						<Input id="type-tel" type="tel" placeholder="+1 (555) 000-0000" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="type-url">
							<Typography size="xs" color="muted">
								URL
							</Typography>
						</label>
						<Input id="type-url" type="url" placeholder="https://example.com" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="type-search">
							<Typography size="xs" color="muted">
								Search
							</Typography>
						</label>
						<Input id="type-search" type="search" placeholder="Search..." />
					</div>
				</div>
			</div>
		</div>
	),
};

export const WithLabels: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Inputs should always be paired with labels for accessibility. Labels help screen readers and provide context for users.',
			},
		},
	},
	argTypes: {
		placeholder: { control: false },
		type: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="story-container-full">
			<div className={`story-section ${styles.maxWidthMd}`}>
				<div className="story-section-sm">
					<label htmlFor="labeled-input-1">
						<Typography size="sm" weight="medium">
							Full Name
						</Typography>
					</label>
					<Input id="labeled-input-1" placeholder="John Doe" />
				</div>
				<div className="story-section-sm">
					<label htmlFor="labeled-input-2">
						<Typography size="sm" weight="medium">
							Email Address
						</Typography>
					</label>
					<Input id="labeled-input-2" type="email" placeholder="john@example.com" />
				</div>
				<div className="story-section-sm">
					<label htmlFor="labeled-input-3">
						<Typography size="sm" weight="medium">
							Phone Number
						</Typography>
					</label>
					<Input id="labeled-input-3" type="tel" placeholder="+1 (555) 000-0000" />
				</div>
			</div>
		</div>
	),
};

export const DisabledStates: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Disabled inputs are non-interactive and visually indicate they cannot be edited. Use disabled state when an input is not applicable or waiting for user action.',
			},
		},
	},
	argTypes: {
		placeholder: { control: false },
		type: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="story-container-full">
			<div className={`story-section ${styles.maxWidthMd}`}>
				<div className="story-section-sm">
					<label htmlFor="disabled-input">
						<Typography size="sm" weight="medium">
							Disabled Input
						</Typography>
					</label>
					<Input id="disabled-input" placeholder="Cannot edit this" disabled />
				</div>
			</div>
		</div>
	),
};

export const ReadOnlyStates: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Read-only inputs can be focused and selected but cannot be edited. Useful for displaying values that users can copy but not modify.',
			},
		},
	},
	argTypes: {
		placeholder: { control: false },
		type: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="story-container-full">
			<div className={`story-section ${styles.maxWidthMd}`}>
				<div className="story-section-sm">
					<label htmlFor="readonly-input">
						<Typography size="sm" weight="medium">
							Read-Only Input
						</Typography>
					</label>
					<Input id="readonly-input" value="This value can be selected but not edited" readOnly />
				</div>
			</div>
		</div>
	),
};

export const RequiredFields: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Required inputs indicate that a field must be filled before form submission. Browsers will show validation messages if left empty.',
			},
		},
	},
	argTypes: {
		placeholder: { control: false },
		type: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="story-container-full">
			<div className={`story-section ${styles.maxWidthMd}`}>
				<div className="story-section-sm">
					<label htmlFor="required-input">
						<Typography size="sm" weight="medium">
							Email Address{' '}
							<Typography as="span" color="danger">
								*
							</Typography>
						</Typography>
					</label>
					<Input id="required-input" type="email" placeholder="Required field" required />
					<Typography size="xs" color="muted">
						This field is required
					</Typography>
				</div>
			</div>
		</div>
	),
};

export const FormExamples: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Complete form examples showing how to use Input components in real-world scenarios with proper labels, validation, and accessibility.',
			},
		},
	},
	argTypes: {
		placeholder: { control: false },
		type: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="story-container-full">
			<div className={`story-section ${styles.maxWidthMd}`}>
				<Typography as="h3" size="sm" weight="medium">
					Contact Form
				</Typography>
				<form className="story-section">
					<div className="story-section-sm">
						<label htmlFor="form-name">
							<Typography size="sm" weight="medium">
								Full Name{' '}
								<Typography as="span" color="danger">
									*
								</Typography>
							</Typography>
						</label>
						<Input id="form-name" placeholder="John Doe" required />
					</div>
					<div className="story-section-sm">
						<label htmlFor="form-email">
							<Typography size="sm" weight="medium">
								Email Address{' '}
								<Typography as="span" color="danger">
									*
								</Typography>
							</Typography>
						</label>
						<Input id="form-email" type="email" placeholder="john@example.com" required />
					</div>
					<div className="story-section-sm">
						<label htmlFor="form-phone">
							<Typography size="sm" weight="medium">
								Phone Number
							</Typography>
						</label>
						<Input id="form-phone" type="tel" placeholder="+1 (555) 000-0000" />
					</div>
					<div className="story-section-sm">
						<label htmlFor="form-password">
							<Typography size="sm" weight="medium">
								Password{' '}
								<Typography as="span" color="danger">
									*
								</Typography>
							</Typography>
						</label>
						<Input id="form-password" placeholder="Enter password" required type="password" />
					</div>
				</form>
			</div>
		</div>
	),
};

export const PasswordInput: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Password input variant with a built-in visibility toggle. The type is fixed to "password" and cannot be changed.',
			},
		},
	},
	argTypes: {
		placeholder: { control: 'text' },
		type: { control: false },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		readOnly: { control: 'boolean' },
	},
	args: {
		placeholder: 'Enter password',
		disabled: false,
		required: false,
		readOnly: false,
	},
	render: (args) => {
		return (
			<div className="story-container-full">
				<Typography as="h2" size="lg" weight="medium" className={styles.headerMargin}>
					Input.Password Example
				</Typography>
				<Input.Password {...args} />
			</div>
		);
	},
};
