import { RadioGroupColor, type RadioGroup, RadioGroupTextOverflow } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const radioGroupParameters: Meta<typeof RadioGroup>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'A single-choice control rendered from `items`. The group owns its markup, so there is nothing to compose inside it.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=4628-34799&p=f&m=dev',
	},
};

/**
 * The `RadioGroup` props. `RadioGroupField` takes them too, so `radio-group-field.stories.tsx`
 * shares them with `radio-group.stories.tsx`.
 */
export const radioGroupArgTypes: Meta<typeof RadioGroup>['argTypes'] = {
	items: {
		control: false,
		description:
			'The options, in the order they are rendered. Each is `{ label, value }`, plus an optional `testId`, and an optional `disabled` + `disabledTooltip` pair that blocks that row alone. A `label` is a node: when it holds something that draws outside its own box, such as a field with a focus ring, pass `textOverflow="visible"`. A label that renders nothing falls back to `<No label>` rather than dropping the row.',
		table: { category: 'Content', type: { summary: 'RadioGroupItemType[]' } },
	},
	color: {
		control: 'select',
		options: Object.values(RadioGroupColor),
		description: "Button's `color` palette, without `secondary`. Tints the checked item.",
		table: { category: 'Appearance', type: { summary: 'RadioGroupColorType' } },
	},
	textOverflow: {
		control: 'inline-radio',
		options: Object.values(RadioGroupTextOverflow),
		description:
			'`ellipsis` (default) truncates a label and shows it in full in a tooltip. `wrap` lets it take another line, `hidden` clips it, `visible` clips nothing. None of the last three shows a tooltip. Use `visible` for a label that holds a control, so its focus ring is not cut.',
		table: {
			category: 'Behavior',
			type: { summary: 'RadioGroupTextOverflowType' },
			defaultValue: { summary: 'ellipsis' },
		},
	},
	value: {
		control: 'text',
		description:
			'The controlled value. `null` is the empty group. `undefined` on the first render leaves the group uncontrolled, and a value that arrives later is followed, with a warning. Once controlled, `undefined` and `null` both show no radio checked. Use with `onChange`.',
		table: { category: 'State', type: { summary: 'string | null' } },
	},
	defaultValue: {
		control: 'text',
		description: 'The value checked on the first render, for a group that keeps its own state.',
		table: { category: 'State', type: { summary: 'string' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Blocks the whole group. Announced through `aria-disabled`, so the group stays hoverable and keeps its tab stop and the reason stays reachable. Requires `disabledTooltip`. Suppressed entirely while `readOnly` is true.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the group cannot be used. Only renders while `disabled` is true, and never while `readOnly` is.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the value while arrow keys keep moving focus. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	readOnlyTooltip: {
		control: 'text',
		description: 'Why the value is locked. Only renders while `readOnly` is true.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	name: {
		control: 'text',
		description: 'Identifies the field when the owning form is submitted.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description: 'The owning form cannot be submitted until one item is checked.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	onChange: {
		control: false,
		description:
			"Called with the newly checked item's `value`. Never fires with `null`: only a radio reports a change, and it reports its own value.",
		table: { category: 'Events', type: { summary: '(value: string) => void' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the rendered element as `data-testid`. Also names every row, as `${testId}-item-${value}`, unless the item carries a `testId` of its own.',
		table: { category: 'Testing' },
	},
	id: {
		control: 'text',
		table: { category: 'Accessibility' },
	},
	'aria-labelledby': {
		control: 'text',
		description:
			'The id of the element that asks the question. A radio group needs a name of its own on top of the per-option labels, otherwise a screen reader gets a list of answers to a question nobody asked.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
