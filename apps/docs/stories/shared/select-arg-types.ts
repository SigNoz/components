import type { Select } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

/**
 * The `Select` props, shared by `select.stories.tsx` and `select-field.stories.tsx`.
 */
export const selectArgTypes: Meta<typeof Select>['argTypes'] = {
	items: {
		control: false,
		description:
			'The rows, in render order. Three kinds, told apart by a required `type`: `item`, `group` and `separator`. An empty list renders the `noContent` row, and warns unless `noContent` is set.',
		table: { category: 'Content', type: { summary: 'SelectItemType[]' } },
	},
	placeholder: {
		control: 'text',
		description:
			'What the trigger shows while nothing is selected. Also its accessible name when no `aria-label`, `aria-labelledby` or `<label>` names it.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	displayValue: {
		control: false,
		description:
			'Decides what the trigger shows. A single select gets the selected row and replaces its `prefix`, `displayValue` and label. A multiple select gets the selected rows and replaces the chips. Both also run while nothing is selected.',
		table: {
			category: 'Content',
			type: {
				summary:
					'(item: SelectOptionItemType | undefined) => ReactNode | (items: SelectOptionItemType[]) => ReactNode',
			},
		},
	},
	noContent: {
		control: 'text',
		description:
			'What the non-interactive row shows when `items` is empty. Setting it silences the empty `items` warning.',
		table: {
			category: 'Content',
			type: { summary: 'ReactNode' },
			defaultValue: { summary: "'No results found :/'" },
		},
	},
	value: {
		control: false,
		description:
			'The selected value, a `string`, or a `string[]` with `multiple`. `undefined` on the first render leaves the select uncontrolled, starting at `defaultValue`. A value that arrives later is followed, with a warning, and once controlled `undefined` shows nothing selected. `null` is nothing selected too, with `nullable`.',
		table: { category: 'Behavior', type: { summary: 'string | string[]' } },
	},
	defaultValue: {
		control: false,
		description: 'The value selected on the first render, for a select that keeps its own state.',
		table: { category: 'Behavior', type: { summary: 'string | string[]' } },
	},
	multiple: {
		control: 'boolean',
		description:
			'Picks several values, shown as chips in the trigger. A pick keeps the popup open.',
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
	container: {
		control: false,
		description:
			'The element the popup is portalled into. Defaults to `document.body`, or to the panel of the `Dialog` or `Drawer` the select sits in.',
		table: { category: 'Behavior', type: { summary: 'HTMLElement | RefObject' } },
	},
	onChange: {
		control: false,
		description: 'Called with the new value: a `string`, or a `string[]` with `multiple`.',
		table: { category: 'Events', type: { summary: '(value) => void' } },
	},
	loading: {
		control: 'boolean',
		description:
			'Swaps the chevron for a spinner and the rows for `loadingContent`. The popup still opens.',
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
			'Keeps the popup closed and hides the chip remove buttons. The trigger carries `aria-disabled`, not the native `disabled`, so the reason stays reachable. Requires `disabledTooltip`. Outranks `readOnly`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the select cannot be used, in a tooltip on the trigger while `disabled` is true.',
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
			'Why the select cannot be changed, in a tooltip on the trigger while `readOnly` is true and `disabled` is not.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	width: {
		control: 'text',
		description: 'The width of the select. A number is read as pixels.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '100%' },
		},
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the select. A number is read as pixels.',
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
		description: 'How tall the rows may get before they scroll.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '20rem' },
		},
	},
	id: {
		control: 'text',
		description: 'Forwarded to the trigger, so a `<label htmlFor>` can name it.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'Names the trigger, and the list with it. Without a name, the `placeholder` names the trigger, which is not a label.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-labelledby': {
		control: 'text',
		description: 'The id of a visible label that names the trigger and the list.',
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
