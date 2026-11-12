import { type Switch, SwitchColor, SwitchTextOverflow } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const switchParameters: Meta<typeof Switch>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'An on/off toggle that commits immediately. Label and description ride along in a `<label>` wrapper; without them the switch renders bare.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-742&m=dev',
	},
};

/**
 * The `Switch` props. `SwitchField` takes most of them too, so `switch-field.stories.tsx` shares
 * them with `switch.stories.tsx`.
 */
export const switchArgTypes: Meta<typeof Switch>['argTypes'] = {
	children: {
		control: 'text',
		description:
			'The label, and the accessible name. Clicking it toggles. Without it the switch renders bare, with no wrapper element at all: name it with `aria-label` instead. Children that render nothing count as not passed.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	description: {
		control: 'text',
		description:
			'A muted second line under the label, announced through `aria-describedby`. The label steps up to medium weight beside it, reading as the row title.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	color: {
		control: 'select',
		options: Object.values(SwitchColor),
		description:
			"Same palette as Badge's `color`. Tints the track while the switch is on; the knob keeps one color across the palette.",
		table: { category: 'Appearance', type: { summary: 'SwitchColorType' } },
	},
	textPlacement: {
		control: 'inline-radio',
		options: ['right', 'left'],
		description:
			'Which side of the switch the text sits on. `right` is the plain toggle row, sized to its content. `left` is the settings row: text first, the row fills its container, and the switch sits at the far edge.',
		table: { category: 'Appearance', type: { summary: 'SwitchTextPlacementType' } },
	},
	textOverflow: {
		control: 'inline-radio',
		options: Object.values(SwitchTextOverflow),
		description:
			'`ellipsis` (default) truncates the label and shows it in full in a tooltip. `wrap` lets it take another line, `hidden` clips it, `visible` clips nothing. None of the last three shows a tooltip.',
		table: {
			category: 'Behavior',
			type: { summary: 'SwitchTextOverflowType' },
			defaultValue: { summary: 'ellipsis' },
		},
	},
	value: {
		control: 'boolean',
		description: 'The controlled checked state. Use with `onChange`, never with `defaultValue`.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	defaultValue: {
		control: 'boolean',
		description: 'The checked state on first render, for a switch that keeps its own state.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Blocks the switch. Announced through `aria-disabled`, so it stays hoverable and keeps its tab stop and the reason stays reachable. Requires `disabledTooltip`. Suppressed entirely while `readOnly` is true.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the switch cannot be used. Only renders while `disabled` is true, and never while `readOnly` is.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the value while the switch stays focusable. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set.',
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
		description: 'The owning form cannot be submitted until the switch is on.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'text',
		description:
			'The width of the labelled row, written as the `--switch-internal-width` custom property. Numbers are px. Sizes the row, never the 28px track.',
		table: { category: 'Behavior', type: { summary: "CSSProperties['width']" } },
	},
	maxWidth: {
		control: 'text',
		description:
			'The max-width of the labelled row, written as `--switch-internal-max-width`. Defaults to `100%` of the container.',
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
			'Forwarded to the switch itself as `data-testid`. The wrapper is named by `containerTestId` instead.',
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
	'aria-label': {
		control: 'text',
		description:
			'The accessible name for a bare switch. With a label as `children` the name comes from it instead.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
