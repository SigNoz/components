import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@signozhq/input';

// Meta Configuration
const meta: Meta<typeof Input> = {
	title: 'Components/Input',
	component: Input,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A flexible input component with light and dark theme support. Supports various input types including password, proper accessibility, and seamless integration with forms. Perfect for text entry, search fields, password inputs, and form validation.',
			},
		},
	},
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text displayed when the input is empty.',
			table: { category: 'Content' },
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
			table: { category: 'Behavior', defaultValue: { summary: 'text' } },
		},
		theme: {
			control: 'inline-radio',
			options: ['light', 'dark'],
			description:
				'The visual theme of the input. Light theme for light backgrounds, dark theme for dark backgrounds.',
			table: { category: 'Appearance', defaultValue: { summary: 'light' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Whether the input is disabled and non-interactive. Disabled inputs cannot be focused or edited.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		required: {
			control: 'boolean',
			description:
				'Whether the input is required. Browsers will prevent form submission if empty.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		readOnly: {
			control: 'boolean',
			description:
				'Whether the input is read-only. Read-only inputs can be focused but not edited.',
			table: { category: 'Behavior', defaultValue: { summary: 'false' } },
		},
		value: {
			control: 'text',
			description: 'The controlled value of the input.',
			table: { category: 'Content' },
		},
		defaultValue: {
			control: 'text',
			description: 'The default uncontrolled value of the input.',
			table: { category: 'Content' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Customization' },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Input>;

// The "Playground" Story - This is the Primary story
export const Playground: Story = {
	args: {
		placeholder: 'Enter text...',
		type: 'text',
		theme: 'light',
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
		theme: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 space-y-6 bg-background">
			<div className="space-y-4">
				<h3 className="text-sm font-medium text-vanilla-800 dark:text-vanilla-300">
					Common Input Types
				</h3>
				<div className="space-y-4 max-w-md">
					<div className="space-y-2">
						<label
							htmlFor="type-text"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							Text
						</label>
						<Input
							id="type-text"
							type="text"
							placeholder="Enter text"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="type-email"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							Email
						</label>
						<Input
							id="type-email"
							type="email"
							placeholder="email@example.com"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="type-password"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							Password
						</label>
						<Input
							id="type-password"
							type="password"
							placeholder="Enter password"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="type-number"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							Number
						</label>
						<Input
							id="type-number"
							type="number"
							placeholder="Enter number"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="type-tel"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							Telephone
						</label>
						<Input
							id="type-tel"
							type="tel"
							placeholder="+1 (555) 000-0000"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="type-url"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							URL
						</label>
						<Input
							id="type-url"
							type="url"
							placeholder="https://example.com"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="type-search"
							className="block text-xs text-vanilla-600 dark:text-vanilla-400"
						>
							Search
						</label>
						<Input
							id="type-search"
							type="search"
							placeholder="Search..."
							theme="light"
						/>
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
		theme: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 space-y-6 bg-background">
			<div className="space-y-4 max-w-md">
				<div className="space-y-2">
					<label
						htmlFor="labeled-input-1"
						className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
					>
						Full Name
					</label>
					<Input id="labeled-input-1" placeholder="John Doe" theme="light" />
				</div>
				<div className="space-y-2">
					<label
						htmlFor="labeled-input-2"
						className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
					>
						Email Address
					</label>
					<Input
						id="labeled-input-2"
						type="email"
						placeholder="john@example.com"
						theme="light"
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="labeled-input-3"
						className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
					>
						Phone Number
					</label>
					<Input
						id="labeled-input-3"
						type="tel"
						placeholder="+1 (555) 000-0000"
						theme="light"
					/>
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
		theme: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 space-y-6 bg-background">
			<div className="space-y-4 max-w-md">
				<div className="space-y-2">
					<label
						htmlFor="disabled-input"
						className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
					>
						Disabled Input
					</label>
					<Input
						id="disabled-input"
						placeholder="Cannot edit this"
						disabled
						theme="light"
					/>
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
		theme: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 space-y-6 bg-background">
			<div className="space-y-4 max-w-md">
				<div className="space-y-2">
					<label
						htmlFor="readonly-input"
						className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
					>
						Read-Only Input
					</label>
					<Input
						id="readonly-input"
						value="This value can be selected but not edited"
						readOnly
						theme="light"
					/>
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
		theme: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 space-y-6 bg-background">
			<div className="space-y-4 max-w-md">
				<div className="space-y-2">
					<label
						htmlFor="required-input"
						className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
					>
						Email Address <span className="text-red-500">*</span>
					</label>
					<Input
						id="required-input"
						type="email"
						placeholder="Required field"
						required
						theme="light"
					/>
					<p className="text-xs text-vanilla-600 dark:text-vanilla-400">
						This field is required
					</p>
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
		theme: { control: false },
		disabled: { control: false },
		required: { control: false },
		readOnly: { control: false },
		value: { control: false },
		defaultValue: { control: false },
		className: { control: false },
	},
	render: () => (
		<div className="p-8 space-y-8 bg-background">
			<div className="max-w-md space-y-6">
				<h3 className="text-sm font-medium text-vanilla-800 dark:text-vanilla-300">
					Contact Form
				</h3>
				<form className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="form-name"
							className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
						>
							Full Name <span className="text-red-500">*</span>
						</label>
						<Input id="form-name" placeholder="John Doe" required theme="light" />
					</div>
					<div className="space-y-2">
						<label
							htmlFor="form-email"
							className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
						>
							Email Address <span className="text-red-500">*</span>
						</label>
						<Input
							id="form-email"
							type="email"
							placeholder="john@example.com"
							required
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="form-phone"
							className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
						>
							Phone Number
						</label>
						<Input
							id="form-phone"
							type="tel"
							placeholder="+1 (555) 000-0000"
							theme="light"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="form-password"
							className="block text-sm font-medium text-vanilla-800 dark:text-vanilla-300"
						>
							Password <span className="text-red-500">*</span>
						</label>
						<Input
							id="form-password"
							placeholder="Enter password"
							required
							type="password"
							theme="light"
						/>
					</div>
				</form>
			</div>
		</div>
	),
};
