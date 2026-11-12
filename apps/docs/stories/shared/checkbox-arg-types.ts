import { type Checkbox, CheckboxColor, CheckboxTextOverflow } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const checkboxParameters: Meta<typeof Checkbox>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'One independent yes/no choice that something else commits — a form, an apply button. Label rides along in a `<label>` wrapper; without it the checkbox renders bare.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=4628-34798',
	},
};

/**
 * The `Checkbox` props. `CheckboxField` takes most of them too, so `checkbox-field.stories.tsx` shares
 * them with `checkbox.stories.tsx`.
 */
export const checkboxArgTypes: Meta<typeof Checkbox>['argTypes'] = {
	children: {
		control: 'text',
		description:
			'The label, and the accessible name. Clicking it toggles. Without it the checkbox renders bare, with no wrapper element at all: name it with `aria-label` instead. Children that render nothing count as not passed.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	color: {
		control: 'select',
		options: Object.values(CheckboxColor),
		description:
			"Same palette as Badge's `color`, without `secondary`. Fills the box while checked or indeterminate; the unchecked box keeps a neutral border for every color. Required: the checked fill is a semantic statement, so the call site has to make it.",
		table: {
			category: 'Appearance',
			type: { summary: 'CheckboxColorType' },
		},
	},
	textOverflow: {
		control: 'inline-radio',
		options: Object.values(CheckboxTextOverflow),
		description:
			'`ellipsis` (default) truncates the label and shows it in full in a tooltip. `wrap` lets it take more lines, `hidden` clips it, `visible` clips nothing. None of the last three shows a tooltip.',
		table: {
			category: 'Behavior',
			type: { summary: 'CheckboxTextOverflowType' },
			defaultValue: { summary: 'ellipsis' },
		},
	},
	value: {
		control: 'inline-radio',
		options: [true, false, 'indeterminate'],
		description:
			'The controlled checked state. `"indeterminate"` shows the mixed state: a dash instead of the check mark, announced as `aria-checked="mixed"`; clicking it reports `true` through `onChange`, and deriving it from a tree\'s children is the call site\'s job. Use with `onChange`, never with `defaultValue`.',
		table: { category: 'State', type: { summary: "boolean | 'indeterminate'" } },
	},
	defaultValue: {
		control: 'inline-radio',
		options: [true, false, 'indeterminate'],
		description:
			'The checked state on first render, for a checkbox that keeps its own state. `"indeterminate"` shows the dash until the first toggle.',
		table: { category: 'State', type: { summary: "boolean | 'indeterminate'" } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Blocks the checkbox. Announced through `aria-disabled`, so it stays hoverable and keeps its tab stop and the reason stays reachable. Requires `disabledTooltip`. Suppressed entirely while `readOnly` is true.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the checkbox cannot be used. Only renders while `disabled` is true, and never while `readOnly` is.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the value while the checkbox stays focusable. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set.',
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
		description:
			'Identifies the field when the owning form is submitted; the hidden input submits `"on"` while checked, like a native checkbox.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description: 'The owning form cannot be submitted until the checkbox is checked.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'text',
		description:
			'The width of the labelled row, written as the `--checkbox-internal-width` custom property. Numbers are px. Sizes the row, never the 16px box.',
		table: { category: 'Behavior', type: { summary: "CSSProperties['width']" } },
	},
	maxWidth: {
		control: 'text',
		description:
			'The max-width of the labelled row, written as `--checkbox-internal-max-width`. Defaults to `100%` of the container.',
		table: { category: 'Behavior', type: { summary: "CSSProperties['maxWidth']" } },
	},
	onChange: {
		control: false,
		description:
			'Called with the new checked state, and with nothing else. Never fires while `disabled` or `readOnly`.',
		table: { category: 'Events', type: { summary: '(checked: boolean) => void' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the checkbox itself as `data-testid`. The wrapper is named by `containerTestId` instead.',
		table: { category: 'Testing' },
	},
	containerTestId: {
		control: 'text',
		description: 'Forwarded to the `<label>` wrapper as `data-testid`.',
		table: { category: 'Testing' },
	},
	id: {
		control: 'text',
		description:
			'Lands on the hidden checkbox input, which is the element an external `htmlFor` points at.',
		table: { category: 'Accessibility' },
	},
	tabIndex: {
		control: 'number',
		description:
			'Forwarded to the checkbox. A disabled checkbox keeps its tab stop by default, so `disabledTooltip` stays reachable without a pointer.',
		table: { category: 'Accessibility', type: { summary: 'number' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'The accessible name for a bare checkbox. With a label as `children` the name comes from it instead.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
