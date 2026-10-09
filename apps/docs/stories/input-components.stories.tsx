import { Input } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { inputArgTypes, inputParameters } from './shared/input-arg-types.js';

/**
 * The static members of `Input`, grouped under `Input/Components` in the sidebar. They are
 * documented on the `Input` page, `input.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Input> = {
	title: 'Primitive Components/Input/Components',
	component: Input,
	tags: ['!autodocs'],
	parameters: inputParameters,
	argTypes: inputArgTypes,
};

export default meta;

/**
 * `Input.Password` is `Input` with a visibility toggle in the suffix slot: no `type`, no `suffix`.
 */
export const Password: StoryObj<typeof Input.Password> = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	args: {
		placeholder: 'Enter password',
		'aria-label': 'Password',
		autoComplete: 'new-password',
	},
	parameters: {
		controls: { exclude: ['type', 'suffix'] },
	},
	render: (args) => <Input.Password {...args} />,
};

/**
 * `Input.TextArea` grows with its rows and has no `prefix`/`suffix`: adornments belong to a
 * one-line field.
 */
export const TextArea: StoryObj<typeof Input.TextArea> = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	args: {
		placeholder: 'Describe the incident...',
		'aria-label': 'Description',
		rows: 2,
		size: 'large',
		noFocusRing: false,
	},
	parameters: {
		controls: { exclude: ['type', 'prefix', 'suffix'] },
	},
	argTypes: {
		rows: {
			control: 'number',
			description: 'The native attribute: how many lines tall the field starts.',
			table: { category: 'Appearance', type: { summary: 'number' } },
		},
	},
	render: (args) => <Input.TextArea {...args} />,
};

/**
 * `Input.Number` holds a number, `null` while empty. `onChange` reports the parsed value, not the
 * event, so it is not a target for react-hook-form's `register()` spread; use a `Controller`.
 */
export const Number: StoryObj<typeof Input.Number> = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	args: {
		'aria-label': 'Replica count',
		defaultValue: 3,
		min: 0,
		max: 100,
		step: 1,
		onChange: fn(),
	},
	parameters: {
		controls: { exclude: ['type'] },
	},
	argTypes: {
		value: {
			control: false,
			description:
				'The controlled value. `null` is the empty field, and the only way to write one.',
			table: { category: 'Content', type: { summary: 'number | null' } },
		},
		defaultValue: {
			control: 'number',
			description: 'The value on first render, for a field that keeps its own state.',
			table: { category: 'Content', type: { summary: 'number' } },
		},
		onChange: {
			control: false,
			description:
				'Called with the parsed value on every change: typing, the step buttons, the arrow keys. `null` is the field going empty.',
			table: { category: 'Events', type: { summary: '(value: number | null) => void' } },
		},
		min: {
			control: 'number',
			description: 'The smallest value the steppers and the arrow keys reach.',
			table: { category: 'Content', type: { summary: 'number' } },
		},
		max: {
			control: 'number',
			description: 'The largest value the steppers and the arrow keys reach.',
			table: { category: 'Content', type: { summary: 'number' } },
		},
		step: {
			control: 'number',
			description:
				'How far one step moves the value. `Shift` steps by `largeStep` (10 by default).',
			table: { category: 'Content', type: { summary: 'number' }, defaultValue: { summary: '1' } },
		},
		controls: {
			control: 'boolean',
			description: 'Renders the step buttons at the trailing edge of the field.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
	},
	// Remounts on a new `defaultValue`, since the value is uncontrolled.
	render: (args) => <Input.Number key={String(args.defaultValue)} {...args} />,
};
