import { InputSize, InputStatus, InputVariant, type Input } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const inputParameters: Meta<typeof Input>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'A one-line text field: a native input inside a frame that owns the border, the sizes, the validation states and the prefix/suffix slots. `Input.Password`, `Input.TextArea` and `Input.Number` swap the control and keep the frame.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=6463-20230&p=f&m=dev',
	},
};

/**
 * The `Input` props. The members take them too (minus the slots each one owns), so
 * `input-components.stories.tsx` shares them with `input.stories.tsx`.
 */
export const inputArgTypes: Meta<typeof Input>['argTypes'] = {
	placeholder: {
		control: 'text',
		description: 'The hint shown while the field is empty.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	value: {
		control: false,
		description: 'The controlled value. Use with `onChange`.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	defaultValue: {
		control: 'text',
		description: 'The value on first render, for a field that keeps its own state.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	type: {
		control: 'text',
		description:
			'The native input type: `text`, `search`, `email`, `time`, … For passwords use `Input.Password`, for numbers `Input.Number`.',
		table: {
			category: 'Content',
			type: { summary: 'string' },
			defaultValue: { summary: "'text'" },
		},
	},
	prefix: {
		control: false,
		description:
			"Rendered inside the field before the text. An icon takes the field's icon size and color.",
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	suffix: {
		control: false,
		description:
			'Rendered inside the field after the text, before the status icon. A node, so it can hold a control of its own, such as a clear button.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	size: {
		control: 'inline-radio',
		options: Object.values(InputSize),
		description:
			'The height of the field: `base` is 32px, `large` is 40px. The text size does not change.',
		table: {
			category: 'Appearance',
			type: { summary: 'InputSizeType' },
			defaultValue: { summary: "'base'" },
		},
	},
	variant: {
		control: 'inline-radio',
		options: Object.values(InputVariant),
		description:
			'`default` draws the bordered field. `unstyled` drops the border and the background and keeps everything else, including the focus ring.',
		table: {
			category: 'Appearance',
			type: { summary: 'InputVariantType' },
			defaultValue: { summary: "'default'" },
		},
	},
	status: {
		control: 'select',
		options: [undefined, ...Object.values(InputStatus)],
		description:
			'The validation state: tints the border and the background and renders a matching icon at the trailing edge. `danger` also announces itself as `aria-invalid`.',
		table: { category: 'Appearance', type: { summary: 'InputStatusType' } },
	},
	noFocusRing: {
		control: 'boolean',
		description:
			'Draws no ring on keyboard focus, for a surface that draws a focus treatment of its own. Never use it with `variant="unstyled"`, where the ring is all that marks focus.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'text',
		description:
			'The width of the field. Without it the field fills its parent. Numbers are written as `px`.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the field. Numbers are written as `px`.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["maxWidth"]' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Blocks typing, fades the field, and leaves it out of the tab order and the form submit. Requires `disabledTooltip`. Ignored while `readOnly`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the field cannot be used, shown on hover while `disabled`. Empty content renders no tooltip. Only allowed alongside `disabled`, pass `undefined` when there is no reason to give.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the value while the field keeps its tab stop, and its value stays selectable and copyable. Requires `readOnlyTooltip`. Outranks `disabled`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the value is locked, shown on hover and on keyboard focus while `readOnly`. Only allowed alongside `readOnly`, pass `undefined` when there is no reason to give.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	name: {
		control: 'text',
		description:
			"Identifies the field when the owning form is submitted. react-hook-form's `register()` spreads it together with its callbacks and ref.",
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description: 'The owning form cannot be submitted while the field is empty.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	onChange: {
		control: false,
		description: 'The native change event, on every keystroke.',
		table: { category: 'Events', type: { summary: '(event: ChangeEvent) => void' } },
	},
	onBlur: {
		control: false,
		description: 'The native blur event.',
		table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
	},
	onWheel: {
		control: false,
		description:
			'The native wheel event, for a call site that blurs a focused field on scroll so the page scrolls instead.',
		table: { category: 'Events', type: { summary: '(event: WheelEvent) => void' } },
	},
	'aria-label': {
		control: 'text',
		description: 'The name of the field when it has no visible label of its own.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the native input, so a label can point at it with htmlFor.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the frame as `data-testid`, and the prefix of the parts: `${testId}-field`, `${testId}-prefix`, `${testId}-suffix` and `${testId}-status`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
