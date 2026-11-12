import { type Form, FormLayout } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const formParameters: Meta<typeof Form>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'The `<form>` element and the rhythm between its fields. It holds no values and runs no validation: the values live in react-hook-form or in the consumer state, and `Field` shows what the consumer decides is invalid.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=7063-127&p=f&m=dev',
	},
};

export const formArgTypes: Meta<typeof Form>['argTypes'] = {
	children: {
		control: false,
		description:
			'Required. The fields, groups and action buttons of the form. Any element is allowed, not only `Field`.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	layout: {
		control: 'inline-radio',
		options: Object.values(FormLayout),
		description:
			'How the children sit. `vertical` stacks them 16px apart. `inline` places them in a row 16px apart, wraps to a new row 16px below when the width runs out, and lines the fields up on their bottom edge, so a label that wraps does not push its control out of line.',
		table: {
			category: 'Appearance',
			type: { summary: 'FormLayoutType' },
			defaultValue: { summary: "'vertical'" },
		},
	},
	autoComplete: {
		control: 'inline-radio',
		options: [undefined, 'on', 'off'],
		description: 'Turns the browser saved values on or off for every field of the form.',
		table: { category: 'Behavior', type: { summary: "'on' | 'off'" } },
	},
	onSubmit: {
		control: false,
		description:
			'Required. Called when the form is submitted. The form has already called `preventDefault()`, so the page never reloads. Submit with a `Button` with `type="submit"`, inside the form, or outside it with `form` set to the `id` of the form.',
		table: { category: 'Events', type: { summary: '(event: FormEvent<HTMLFormElement>) => void' } },
	},
	onReset: {
		control: false,
		description:
			'Called when a `type="reset"` button resets the form. The native reset only clears uncontrolled native inputs: with react-hook-form, call `reset()` here, and with plain state, set the state back.',
		table: { category: 'Events', type: { summary: '(event: FormEvent<HTMLFormElement>) => void' } },
	},
	id: {
		control: 'text',
		description:
			'Forwarded to the `<form>`. A `Button` outside the form submits it with `form` set to this id.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Forwarded to the `<form>` as `data-testid`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
