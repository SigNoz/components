import { type Field, FieldStatus } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const fieldParameters: Meta<typeof Field>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'The label, the control and the row below it of one form field, in the one layout the design system draws: label above, description or message below, nothing for the call site to arrange.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=6463-20230&p=f&m=dev',
	},
};

/**
 * The props `Field`, `Field.Group` and the field shorthands share: the label, its marker and
 * tooltip, and the row below the control.
 */
export const fieldLabelArgTypes: Meta<typeof Field>['argTypes'] = {
	label: {
		control: 'text',
		description:
			'Required. The name of the field, rendered as the label above the control and used as its accessible name. It wraps to 2 lines, then ends with an ellipsis and a tooltip with the full text. An empty label renders `<No label>`, so the missing name shows in review and in tests.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	labelIcon: {
		control: false,
		description:
			'An icon before the label text, hidden from assistive tech. Only for a label that fits on one line.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	labelTooltip: {
		control: 'text',
		description:
			'Renders an info icon after the label, with this content in a tooltip. The same text is part of the control description. Use plain text: a link or a button inside cannot be reached with the keyboard, so put those in `description`.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	description: {
		control: 'text',
		description:
			'Neutral help text below the control. A status message replaces it in the same row while one shows, so the field does not grow when an error appears.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	required: {
		control: 'boolean',
		description:
			'Marks the label with an asterisk and makes the control required. A screen reader says "required" once, from the control. The form never blocks the submit for an empty required control, the consumer validation does.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	error: {
		control: 'text',
		description:
			'The validation error, a shorthand for `status="danger"` with `message`. A value that renders nothing (`undefined`, `null`, `\'\'`) shows no message and sets no status, so `error={errors.name?.message}` is the whole react-hook-form wiring. Not allowed next to `status` or `message`.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	status: {
		control: 'select',
		options: [undefined, ...Object.values(FieldStatus)],
		description:
			'The validation state of the field. It colors the label and the message, and tints the control. `danger` also sets `aria-invalid` on the control. `success` confirms a check that ran and passed, it is not the state of a valid field. Requires `message`.',
		table: { category: 'State', type: { summary: 'FieldStatusType' } },
	},
	message: {
		control: 'text',
		description:
			'What the status has to say, rendered below the control with the status icon. Only allowed next to `status`.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
};

export const fieldArgTypes: Meta<typeof Field>['argTypes'] = {
	...fieldLabelArgTypes,
	children: {
		control: false,
		description:
			'Exactly one form control. The field hands it the control id, the description ids, `status` and `required` through context, and the control own props win. A control that does not read the field yet needs `id` here and `htmlFor` on the field.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	htmlFor: {
		control: 'text',
		description:
			'The id of the control, for a control that sets its own `id` instead of taking the one the field generates, or that does not read the field yet.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the field root.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the field root as `data-testid`, and the prefix of the parts: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};

export const fieldGroupArgTypes: Meta<typeof Field.Group>['argTypes'] = {
	...fieldLabelArgTypes,
	children: {
		control: false,
		description:
			'The controls that share the label: a Radio Group, a Toggle Group, a `Slider.Range`, a list of Checkboxes or Switches, or several fields. Each control needs a name of its own, since the label names the group and not them.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the `<fieldset>`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the `<fieldset>` as `data-testid`, and the prefix of the parts: `${testId}-label`, `${testId}-label-tooltip`, `${testId}-description` and `${testId}-message`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
