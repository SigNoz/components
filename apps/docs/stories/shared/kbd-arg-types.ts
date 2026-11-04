import { type Kbd, KbdDisplay, KbdNamedKey } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const NAMED_KEYS = Object.values(KbdNamedKey);

/**
 * One character of each kind a key takes. A lowercase letter draws uppercase.
 */
export const CHARACTER_KEYS = ['a', 'k', 'Z', '0', '9', '/', '?', ',', '.'];

const MARGIN_OPTIONS = [
	undefined,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	10,
	12,
	16,
	20,
	24,
	32,
	40,
	48,
	56,
	64,
	'auto',
];

const MARGIN_ARG = {
	control: 'select',
	options: MARGIN_OPTIONS,
	if: { arg: 'display', eq: 'block' },
	table: { category: 'Layout', type: { summary: 'KbdMarginType' } },
} as const;

const KEY_OPTIONS = [...NAMED_KEYS, 'K', 'G', 'P', '1', '/', '?', ',', '.'];

export const kbdParameters: Meta<typeof Kbd>['parameters'] = {
	layout: 'fullscreen',
};

/**
 * The `Kbd` props. `Kbd.Shortcut` takes `disabled`, `pressed`, `display`, the margins, `testId` and
 * `id` too, so `kbd-components.stories.tsx` shares them with `kbd.stories.tsx`.
 */
export const kbdArgTypes: Meta<typeof Kbd>['argTypes'] = {
	value: {
		control: 'select',
		options: KEY_OPTIONS,
		description:
			'Required. The key, named as `KeyboardEvent.key` names it, or `Mod` for `⌘` on macOS and `⌃` elsewhere. The key picks its glyph and its spoken word from this value. Anything else than a named key or one visible character renders nothing and logs an error. A word never goes in a key: `Escape` draws `⎋`, never `esc`.',
		table: { category: 'Content', type: { summary: 'KbdKey' } },
	},
	disabled: {
		control: 'boolean',
		description:
			'Draws the key at half opacity and keeps it at rest, whatever `pressed` says. Set it when the action the key belongs to is disabled; the control that owns the action carries `aria-disabled`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	pressed: {
		control: 'boolean',
		description:
			'Draws the key as pressed. The key never listens to the keyboard, so set it while your own handler runs. A disabled key stays at rest.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	display: {
		control: 'inline-radio',
		options: Object.values(KbdDisplay),
		description:
			'How the key sits. `inline` keeps it in the line of text around it, centred on the text. `block` puts it on a line of its own, with no line box around it, and gives it the margin props. An inline key takes no margin: the text around it sets the spacing.',
		table: {
			category: 'Layout',
			type: { summary: 'KbdDisplayType' },
			defaultValue: { summary: "'inline'" },
		},
	},
	margin: {
		...MARGIN_ARG,
		description:
			'Only with `display="block"`. The space around the key, as a step of the spacing scale. Each step is 2px, so `4` is 8px. `auto` takes the free space. `marginX` and `marginY` win over `margin`, and one side wins over both.',
		table: { ...MARGIN_ARG.table, defaultValue: { summary: '0' } },
	},
	marginX: {
		...MARGIN_ARG,
		description: 'The space to the left and the right. Wins over `margin`.',
	},
	marginY: { ...MARGIN_ARG, description: 'The space above and below. Wins over `margin`.' },
	marginTop: { ...MARGIN_ARG, description: 'The space above. Wins over `marginY` and `margin`.' },
	marginRight: {
		...MARGIN_ARG,
		description: 'The space to the right. Wins over `marginX` and `margin`.',
	},
	marginBottom: {
		...MARGIN_ARG,
		description: 'The space below. Wins over `marginY` and `margin`.',
	},
	marginLeft: {
		...MARGIN_ARG,
		description: 'The space to the left. Wins over `marginX` and `margin`.',
	},
	testId: {
		control: 'text',
		description: 'Forwarded as `data-testid`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description:
			'The id of the element, for the `aria-describedby` of the control that owns the shortcut.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
