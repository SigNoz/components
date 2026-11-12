import type { Combobox } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

/**
 * The `Combobox` props, shared by `combobox.stories.tsx` and `combobox-field.stories.tsx`.
 */
export const comboboxArgTypes: Meta<typeof Combobox>['argTypes'] = {
	items: {
		control: false,
		description:
			'The rows, in render order. Four kinds, told apart by a required `type`: `item`, `hint`, `group` and `separator`. An empty list renders the `noContent` row, and warns unless `noContent` or `allowCreate` is set.',
		table: { category: 'Content', type: { summary: 'ComboboxItemType[]' } },
	},
	placeholder: {
		control: 'text',
		description:
			'What the trigger shows while nothing is selected. Also its accessible name when no `aria-label` or `aria-labelledby` is given.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	displayValue: {
		control: false,
		description:
			"Decides what the trigger shows for the selected row, in place of the row's `prefix`, `displayValue` and label. Single only. Also runs while nothing is selected, with `undefined`.",
		table: {
			category: 'Content',
			type: { summary: '(item: ComboboxOptionItemType | undefined) => ReactNode' },
		},
	},
	noContent: {
		control: 'text',
		description:
			'What the non-interactive row shows when there is nothing to list: an empty `items`, or a query that matches nothing. Setting it silences the empty `items` warning.',
		table: {
			category: 'Content',
			type: { summary: 'ReactNode' },
			defaultValue: { summary: "'No results found :/'" },
		},
	},
	footerAction: {
		control: false,
		description:
			'A row pinned under the list for an action that is not a value. Holds `label`, `prefix`, `onClick` and `testId`. The popup closes after `onClick`.',
		table: { category: 'Content', type: { summary: 'ComboboxFooterActionType' } },
	},
	value: {
		control: false,
		description:
			'The selected value, a `string`, or a `string[]` with `multiple`. `undefined` on the first render leaves the combobox uncontrolled, starting at `defaultValue`. A value that arrives later is followed, with a warning, and once controlled `undefined` shows nothing selected. `null` is nothing selected too, with `nullable`.',
		table: { category: 'Behavior', type: { summary: 'string | string[]' } },
	},
	defaultValue: {
		control: false,
		description: 'The value selected on the first render, for a combobox that keeps its own state.',
		table: { category: 'Behavior', type: { summary: 'string | string[]' } },
	},
	multiple: {
		control: 'boolean',
		description:
			'Picks several values, shown as chips in the trigger. A pick keeps the popup open and clears the query.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	maxDisplayedPills: {
		control: 'number',
		description:
			'How many chips the trigger shows. The rest collapse into a `+N` chip whose tooltip lists them. Multiple only.',
		table: { category: 'Behavior', type: { summary: 'number' } },
	},
	allowClear: {
		control: 'boolean',
		description:
			'Shows a clear button over the chevron while the pointer is over a combobox with a value. `Delete` and `Backspace` on the trigger clear it too.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	allowCreate: {
		control: 'boolean',
		description:
			'Adds a `Create "<query>"` row while the query matches no row and is not selected. A function renders the row label from the query.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean | ((query: string) => ReactNode)' },
			defaultValue: { summary: 'false' },
		},
	},
	searchInputProps: {
		control: 'object',
		description:
			'The search row: `placeholder`, which is required and names the field, `prefix`, `suffix`, `loading`, `filter` and `onChange`. `filter: false` stops the built-in filtering for rows a server already filtered.',
		table: { category: 'Behavior', type: { summary: 'ComboboxSearchInputProps' } },
	},
	virtualized: {
		control: 'boolean',
		description:
			'Mounts only the rows in view, for lists of thousands of rows. Group headings become plain rows.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	onChange: {
		control: false,
		description: 'Called with the new value: `string | undefined`, or `string[]` with `multiple`.',
		table: { category: 'Events', type: { summary: '(value) => void' } },
	},
	loading: {
		control: 'boolean',
		description:
			'Swaps the chevron for a spinner and the rows for `loadingContent`. The popup still opens and takes a query.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	loadingContent: {
		control: 'text',
		description: 'What to show in place of the rows while `loading`. Defaults to a spinner.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Keeps the popup closed and hides the clear and chip remove buttons. The trigger carries `aria-disabled`, not the native `disabled`, so the reason stays reachable. Requires `disabledTooltip`. Outranks `readOnly`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the combobox cannot be used, in a tooltip on the trigger while `disabled` is true.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Keeps the popup closed and the selection as it is, with the trigger colours unchanged, faded a little and without its chevron. The trigger carries `aria-readonly`. Requires `readOnlyTooltip`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the combobox cannot be changed, in a tooltip on the trigger while `readOnly` is true and `disabled` is not.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	width: {
		control: 'text',
		description: 'The width of the combobox. A number is read as pixels.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '100%' },
		},
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the combobox. A number is read as pixels.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '100%' },
		},
	},
	contentMaxWidth: {
		control: 'text',
		description:
			'How wide the popup may get. The popup is never narrower than the trigger, so a wider trigger wins.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '15.75rem' },
		},
	},
	contentMaxHeight: {
		control: 'text',
		description:
			'How tall the rows may get before they scroll. The search row and the footer action stay pinned.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '20rem' },
		},
	},
	container: {
		control: false,
		description:
			'The element the popup is portalled into. Defaults to `document.body`, or to the panel of the `Dialog` or `Drawer` the combobox sits in.',
		table: { category: 'Behavior', type: { summary: 'HTMLElement | RefObject' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the trigger, so a `<label htmlFor>` can name it.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'Names the trigger, and the popup with it. Without it or `aria-labelledby`, the `placeholder` names the trigger, which is not a label.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-labelledby': {
		control: 'text',
		description: 'The id of a visible label that names the trigger and the popup.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-invalid': {
		control: 'boolean',
		description:
			'Marks the value as invalid. The trigger border turns destructive, hovered or not.',
		table: { category: 'Accessibility', type: { summary: 'boolean' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the trigger as `data-testid`, and the stem every part is named from.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
