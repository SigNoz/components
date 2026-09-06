import {
	type Button,
	ButtonColor,
	ButtonTextOverflow,
	ButtonVariant,
	type ColorType,
	type VariantColorType,
	type VariantType,
} from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const VARIANTS = Object.values(ButtonVariant);
export const COLORS = Object.values(ButtonColor);

/**
 * Variants that accept any `ButtonColor`.
 */
export const MULTI_COLOR_VARIANTS = [ButtonVariant.Solid, ButtonVariant.Link] as VariantType[];

/**
 * Variants restricted to `secondary`.
 */
export const SECONDARY_ONLY_VARIANTS = [
	ButtonVariant.Outlined,
	ButtonVariant.Dashed,
	ButtonVariant.Ghost,
] as VariantType[];

/**
 * The colors a variant accepts: everything for solid/link, only `secondary` for
 * outlined/dashed/ghost.
 */
export function colorsForVariant(variant: VariantType): ColorType[] {
	return SECONDARY_ONLY_VARIANTS.includes(variant) ? [ButtonColor.Secondary] : COLORS;
}

/**
 * Clamps a variant/color pair to a combination the `Button` types allow, so stories with a free
 * color control keep rendering something valid when the variant only supports `secondary`.
 */
export function resolveVariantColor(
	variant: VariantType = ButtonVariant.Solid,
	color: ColorType = ButtonColor.Primary,
): VariantColorType {
	if (SECONDARY_ONLY_VARIANTS.includes(variant)) {
		return { variant: variant as 'outlined' | 'dashed' | 'ghost', color: ButtonColor.Secondary };
	}

	return { variant: variant as 'solid' | 'link', color };
}

export const buttonArgTypes: Meta<typeof Button>['argTypes'] = {
	// Content
	children: {
		control: 'text',
		description:
			'The label of the button. Required, an empty button is not allowed. In `icon` mode this is the icon itself and must be a single element.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	prefix: {
		control: false,
		description:
			'Element rendered before the label. The sizing class is merged into its own `className`. Not allowed in `icon` mode.',
		table: { category: 'Content', type: { summary: 'React.ReactElement' } },
	},
	suffix: {
		control: false,
		description:
			'Element rendered after the label. The sizing class is merged into its own `className`. Not allowed in `icon` mode.',
		table: { category: 'Content', type: { summary: 'React.ReactElement' } },
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the button cannot be used. Required whenever `disabled` is set, and only allowed alongside it. Opens only while `disabled` is true and `loading` is not. Stacks above the `ellipsis` overflow tooltip.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	loadingTooltip: {
		control: 'text',
		description:
			'What the button is busy with. Optional, and opens only while `loading` is true. Takes the place of `disabledTooltip`, which is suppressed while loading. Stacks above the `ellipsis` overflow tooltip.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},

	// Appearance
	variant: {
		control: 'select',
		options: VARIANTS,
		description:
			'The visual treatment. Required. `solid` and `link` accept every `color`, `outlined`, `dashed` and `ghost` only exist with `color="secondary"`.',
		table: { category: 'Appearance', type: { summary: 'VariantType' } },
	},
	color: {
		control: 'select',
		options: COLORS,
		description:
			'The palette behind the variant. Required. Only `solid` and `link` accept every color, `outlined`, `dashed` and `ghost` are restricted to `secondary`.',
		table: { category: 'Appearance', type: { summary: 'ColorType' } },
	},
	size: {
		control: 'select',
		options: ['sm', 'md'],
		description: 'Height and padding token. Required. `sm` is 24px, `md` is 32px.',
		table: { category: 'Appearance', type: { summary: 'SizeType' } },
	},
	icon: {
		control: 'boolean',
		description:
			'Renders the button square, optimized for a single icon. The children are the icon, so `prefix` and `suffix` are not allowed and `aria-label` is required.',
		table: { category: 'Appearance', type: { summary: 'true' } },
	},
	textOverflow: {
		control: 'select',
		options: Object.values(ButtonTextOverflow),
		description:
			'What happens to the label when it does not fit. `ellipsis` truncates and shows the full text in a tooltip, only while it is actually truncated. `none` clips at the edge with no marker and no tooltip.',
		table: {
			category: 'Appearance',
			type: { summary: 'TextOverflowType' },
			defaultValue: { summary: 'ellipsis' },
		},
	},
	width: {
		control: 'text',
		description:
			'Width of the button, written as the `--button-internal-width` custom property so it composes with the tokens. Numbers are written as `px`.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
	},
	maxWidth: {
		control: 'text',
		description:
			'Max width of the button, written as the `--button-internal-max-width` custom property so it composes with the tokens. Numbers are written as `px`.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["maxWidth"]' } },
	},

	// State
	disabled: {
		control: 'boolean',
		description:
			'Stops `onClick`, `onDoubleClick` and keyboard activation. Requires `disabledTooltip`. The button carries `aria-disabled` rather than the native attribute, so it stays hoverable and tabbable and the tooltip stays reachable.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	loading: {
		control: 'boolean',
		description:
			'Cross-fades a spinner over the `prefix` slot and stops the button from responding to clicks and keyboard activation. The label and `suffix` stay visible. Suppresses `disabledTooltip` even when `disabled` is true, `loadingTooltip` takes its place.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},

	// Behavior
	type: {
		control: 'select',
		options: ['button', 'submit', 'reset'],
		description:
			'The native button type. Base UI defaults it to `button`, so a button inside a form does not submit unless asked to.',
		table: {
			category: 'Behavior',
			type: { summary: "'button' | 'submit' | 'reset'" },
			defaultValue: { summary: 'button' },
		},
	},
	tabIndex: {
		control: 'number',
		description: 'Forwarded to the rendered element.',
		table: { category: 'Behavior', type: { summary: 'number' } },
	},
	autoFocus: {
		control: 'boolean',
		description: 'Focuses the button on mount.',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},

	// Accessibility
	'aria-label': {
		control: 'text',
		description:
			'The accessible name. Required in `icon` mode, where the children are an icon and there is no text to announce. Every other `aria-*` attribute is forwarded as well.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},

	// Events
	onClick: {
		control: false,
		action: 'onClick',
		description: 'Called on click. Swallowed while `disabled` or `loading`.',
		table: { category: 'Events', type: { summary: 'MouseEventHandler<HTMLButtonElement>' } },
	},
	onDoubleClick: {
		control: false,
		action: 'onDoubleClick',
		description: 'Called on double click. Swallowed while `disabled` or `loading`.',
		table: { category: 'Events', type: { summary: 'MouseEventHandler<HTMLButtonElement>' } },
	},
	onKeyDown: {
		control: false,
		description: 'Forwarded to the rendered element.',
		table: { category: 'Events', type: { summary: 'KeyboardEventHandler<HTMLButtonElement>' } },
	},
	onKeyUp: {
		control: false,
		description: 'Forwarded to the rendered element.',
		table: { category: 'Events', type: { summary: 'KeyboardEventHandler<HTMLButtonElement>' } },
	},
	onFocus: {
		control: false,
		description: 'Forwarded to the rendered element. Still fires while `disabled` or `loading`.',
		table: { category: 'Events', type: { summary: 'FocusEventHandler<HTMLButtonElement>' } },
	},
	onBlur: {
		control: false,
		description: 'Forwarded to the rendered element.',
		table: { category: 'Events', type: { summary: 'FocusEventHandler<HTMLButtonElement>' } },
	},
	onMouseEnter: {
		control: false,
		description: 'Forwarded to the rendered element. Still fires while `disabled` or `loading`.',
		table: { category: 'Events', type: { summary: 'MouseEventHandler<HTMLButtonElement>' } },
	},
	onMouseLeave: {
		control: false,
		description: 'Forwarded to the rendered element.',
		table: { category: 'Events', type: { summary: 'MouseEventHandler<HTMLButtonElement>' } },
	},

	// Testing
	testId: {
		control: 'text',
		description:
			'Forwarded as `data-testid`. Survives the tooltip trigger cloning the button, which a raw `data-testid` prop does not, so that prop is a type error.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},

	// Styling
	id: {
		control: 'text',
		description: 'Forwarded to the rendered element.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Merged after the component class, never replaces it.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	style: {
		control: false,
		description:
			'Merged with the `width` / `maxWidth` custom properties. The place to override `--button-*` tokens per call site.',
		table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
	},
};
