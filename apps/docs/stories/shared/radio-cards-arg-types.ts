import { type RadioCards, RadioCardsTextOverflow } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const radioCardsParameters: Meta<typeof RadioCards>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'A form field where each option is a card. The whole card is the control, so the radio and its label are one target. `RadioCards` picks one option, `RadioCards.Multiple` picks several.',
		},
	},
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=7219-4&p=f&m=dev',
	},
};

/**
 * The props `RadioCards` and `RadioCards.Multiple` share, so `radio-cards-components.stories.tsx`
 * uses them with `radio-cards.stories.tsx`.
 */
export const radioCardsArgTypes: Meta<typeof RadioCards>['argTypes'] = {
	items: {
		control: false,
		description:
			'The cards, in the order they are rendered. Each is `{ label, value }`, plus an optional `prefix` icon, an optional `testId`, and an optional `disabled` + `disabledTooltip` pair that blocks that card alone. The label takes text only: no link, button or input inside a card. A label that renders nothing falls back to `<No label>`.',
		table: { category: 'Content', type: { summary: 'RadioCardsItemType[]' } },
	},
	columns: {
		control: 'number',
		description:
			'The most cards a row holds. The cards share the row equally, and a row holds fewer when a card would get narrower than its minimum width. Without it, a row holds as many cards as fit. A value that is not a whole number from 1 up is ignored, with a warning.',
		table: { category: 'Appearance', type: { summary: 'number' } },
	},
	textOverflow: {
		control: 'inline-radio',
		options: Object.values(RadioCardsTextOverflow),
		description:
			'`ellipsis` keeps the label on one line and shows it in full in a tooltip while it is truncated. `wrap` lets the label take more lines, the card grows, and no tooltip shows.',
		table: {
			category: 'Appearance',
			type: { summary: "'ellipsis' | 'wrap'" },
			defaultValue: { summary: "'ellipsis'" },
		},
	},
	value: {
		control: 'text',
		description:
			'The controlled value. `null` is the group with no card checked, and the only way to write one: `undefined` makes the group uncontrolled. Use with `onChange`.',
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
			'Fades every card and blocks the check. The group keeps one tab stop and the cards stay hoverable, so the reason stays reachable, and the group is left out of the submit. Requires `disabledTooltip`. Ignored while `readOnly` is true.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the group cannot be used. Only renders while `disabled` is true, and takes the place of every card reason.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the value. The focus still moves, the checked cards keep their tint, and the group is still submitted. Requires `readOnlyTooltip`. Outranks `disabled`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the value is locked, on hover and on focus. Only renders while `readOnly` is true.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	name: {
		control: 'text',
		description: 'Identifies the field when the owning form is submitted.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	form: {
		control: 'text',
		description: 'The id of the owning form, for a group rendered outside the `<form>` element.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description: 'The owning form cannot be submitted while no card is checked.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	allowClear: {
		control: 'boolean',
		description:
			'Whether a click or `Space` on the checked card unchecks it. Off by default, the same as a native radio. With it, `onChange` reports `null` and has to take it.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	onChange: {
		control: false,
		description:
			'Called with the `value` of the card that becomes checked: on a click, on `Space` and on each arrow key, and with `null` once `allowClear` unchecks the card. A choice, not an action: an `onChange` that navigates runs on the first arrow key press. Never called while `disabled` or `readOnly`.',
		table: {
			category: 'Events',
			type: {
				summary: '(value: string) => void, or (value: string | null) => void with allowClear',
			},
		},
	},
	'aria-label': {
		control: 'text',
		description:
			'Names the group: the question the cards answer. Use when there is no visible question. `aria-label` or `aria-labelledby` is required.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-labelledby': {
		control: 'text',
		description:
			'The id of the visible question above the group. `aria-label` or `aria-labelledby` is required.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Lands on the root.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the root as `data-testid`. Also names every card, as `${testId}-item-${value}`, and its icons, unless the item carries a `testId` of its own.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
