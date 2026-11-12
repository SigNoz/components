import type { ToggleGroup } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const toggleGroupParameters: Meta<typeof ToggleGroup>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'A segmented button bar built from an `items` array. It scrolls once it holds more options than it has room for.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=6365-10017&p=f&m=dev',
	},
};

/**
 * The `ToggleGroup` props. `ToggleGroupField` takes them too, so `toggle-group-field.stories.tsx`
 * shares them with `toggle-group.stories.tsx`.
 */
export const toggleGroupArgTypes: Meta<typeof ToggleGroup>['argTypes'] = {
	items: {
		control: false,
		description:
			'The buttons, in render order. Each is `{ value, label }` plus optional `prefix`, `suffix`, `testId` and the `disabled` + `disabledTooltip` pair. An icon goes in `prefix` or `suffix`, never in `label`.',
		table: { category: 'Content', type: { summary: 'ToggleGroupItemProps[]' } },
	},
	type: {
		control: 'radio',
		options: ['single', 'multiple'],
		description:
			'How many buttons can be pressed at once. `single` reports a string, `multiple` an array.',
		table: { category: 'Behavior', type: { summary: "'single' | 'multiple'" } },
	},
	variant: {
		control: 'select',
		options: ['outlined'],
		description: 'The visual treatment of the bar. `outlined` is the only value.',
		table: { category: 'Appearance', type: { summary: "'outlined'" } },
	},
	color: {
		control: 'select',
		options: ['secondary'],
		description: 'The colour treatment of the bar. `secondary` is the only value drawn today.',
		table: { category: 'Appearance', type: { summary: "'secondary'" } },
	},
	size: {
		control: 'select',
		options: ['sm', 'md'],
		description:
			'Height + padding token. Both sizes are 32px tall, the border included, and differ in horizontal padding alone.',
		table: { category: 'Appearance', type: { summary: "'sm' | 'md'" } },
	},
	value: {
		control: 'text',
		description: 'The controlled pressed value(s). Use with `onChange`.',
		table: { category: 'State', type: { summary: 'string | string[]' } },
	},
	defaultValue: {
		control: 'text',
		description: 'The pressed value(s) on the first render, for a bar that keeps its own state.',
		table: { category: 'State', type: { summary: 'string | string[]' } },
	},
	onChange: {
		control: false,
		description:
			'Called with the pressed value: a string for `single`, an array for `multiple`. Not called for a press the bar cancels, which is what blocks clearing.',
		table: { category: 'Events', type: { summary: '(value: string | string[]) => void' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Whether the whole bar ignores user interaction. Requires `disabledTooltip`. Every button carries `aria-disabled` rather than the native attribute, so the reason stays reachable.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the bar cannot be used, shown on every button. Only allowed alongside `disabled`.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the pressed value while the bar keeps its tab stop and its label colours. Requires `readOnlyTooltip`. Outranks `disabled`, which does not render at all while this is set. Announced through `aria-disabled`, because `aria-readonly` is not allowed on `role="button"`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the value is locked, shown on every button. Only renders while `readOnly` is true, and it is then the only reason shown: the bar and item `disabledTooltip`s are suppressed.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	allowClear: {
		control: 'boolean',
		description:
			'Whether the last pressed button can be released. Off by default: once something is pressed the bar keeps reporting a value.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'text',
		description: 'Width of the bar. Sizes to its content when omitted.',
		table: {
			category: 'Layout',
			type: { summary: 'CSSProperties["width"]' },
			defaultValue: { summary: 'fit-content' },
		},
	},
	maxWidth: {
		control: 'text',
		description: 'Max-width of the bar. Past it the bar scrolls instead of shrinking its buttons.',
		table: {
			category: 'Layout',
			type: { summary: 'CSSProperties["maxWidth"]' },
			defaultValue: { summary: '100%' },
		},
	},
	id: { control: 'text', table: { category: 'Styling' } },
	testId: { control: 'text', table: { category: 'Testing' } },
};
