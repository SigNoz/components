import { type Button, ButtonColor, ButtonVariant } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const VARIANTS = Object.values(ButtonVariant);
export const COLORS = Object.values(ButtonColor);

export const buttonArgTypes: Meta<typeof Button>['argTypes'] = {
	variant: {
		control: 'select',
		options: VARIANTS,
		description: 'The visual style of the button',
		table: {
			defaultValue: { summary: 'solid' },
		},
	},
	size: {
		control: 'select',
		options: ['sm', 'md', 'icon'],
		description: 'The size of the button',
		table: {
			defaultValue: { summary: 'md' },
		},
	},
	color: {
		control: 'select',
		options: COLORS,
		description: 'The color scheme of the button',
	},
	disabled: {
		control: 'boolean',
		description: 'Whether the button is disabled',
		table: {
			defaultValue: { summary: 'false' },
			type: { summary: 'boolean' },
		},
	},
	asChild: {
		control: 'boolean',
		description: 'Whether to render as a child component',
		table: {
			type: { summary: 'boolean' },
		},
	},
	background: {
		control: 'select',
		options: ['ink-500', 'ink-400', 'vanilla-100', 'vanilla-200'],
		description:
			'The background context for the action button. Only applicable to *Action* buttons.',
		table: {
			type: { summary: 'string' },
		},
	},
	loading: {
		control: 'boolean',
		description: 'Whether the button is loading',
		table: {
			defaultValue: { summary: 'false' },
			type: { summary: 'boolean' },
		},
	},
	type: {
		control: 'select',
		options: ['button', 'submit'],
		description: 'The type of the button',
		table: {
			defaultValue: { summary: 'submit' },
		},
	},
	onClick: {
		action: 'onClick',
		description: 'The function to call when the button is clicked',
		table: {
			type: { summary: 'function' },
		},
	},
	onDoubleClick: {
		action: 'onDoubleClick',
		description: 'The function to call when the button is double clicked',
		table: {
			type: { summary: 'function' },
		},
	},
};
