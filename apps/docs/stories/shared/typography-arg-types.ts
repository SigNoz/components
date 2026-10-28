import {
	type Typography,
	TypographyAlign,
	TypographyColor,
	TypographyDisplay,
	TypographyElement,
	TypographySize,
	TypographySpacing,
	TypographyTextOverflow,
	TypographyVariant,
	TypographyVerticalAlign,
	TypographyWeight,
} from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const VARIANTS = Object.values(TypographyVariant);
export const SIZES = Object.values(TypographySize);
export const WEIGHTS = Object.values(TypographyWeight);
export const COLORS = Object.values(TypographyColor);

/**
 * The steps each variant has, in the order of the Periscope type tokens page.
 */
export const VARIANT_SIZES = {
	label: ['large', 'medium', 'base', 'small'],
	paragraph: ['medium', 'base', 'small'],
	uppercase: ['base', 'small'],
	code: ['base', 'small'],
} as const;

export const WEIGHT_NUMBERS = { regular: 400, medium: 500, bold: 600 } as const;

const SPACING_OPTIONS = [undefined, ...TypographySpacing];
const MARGIN_OPTIONS = [...SPACING_OPTIONS, 'auto'];

const SPACING_SIDES = [
	{ side: 'X', where: 'on the left and the right' },
	{ side: 'Y', where: 'on the top and the bottom' },
	{ side: 'Top', where: 'on the top', axis: 'Y' },
	{ side: 'Right', where: 'on the right', axis: 'X' },
	{ side: 'Bottom', where: 'on the bottom', axis: 'Y' },
	{ side: 'Left', where: 'on the left', axis: 'X' },
] as const;

function spacingSideArgTypes(prop: 'margin' | 'padding'): Meta<typeof Typography>['argTypes'] {
	const isMargin = prop === 'margin';

	return Object.fromEntries(
		SPACING_SIDES.map(({ side, where, ...rest }) => {
			const winsOver = 'axis' in rest ? `\`${prop}${rest.axis}\` and \`${prop}\`` : `\`${prop}\``;

			return [
				`${prop}${side}`,
				{
					control: 'select',
					options: isMargin ? MARGIN_OPTIONS : SPACING_OPTIONS,
					description: `The ${prop} ${where}. Wins over ${winsOver}.`,
					table: {
						category: 'Layout',
						type: { summary: isMargin ? 'TypographyMarginType' : 'TypographySpacingType' },
					},
				},
			];
		}),
	);
}

export const SENTENCE = 'Data is kept for 15 days, then archived.';
export const LONG_TEXT =
	'checkout-service-production-east-us-2 failed its health check three times in the last five minutes';

export const typographyParameters: Meta<typeof Typography>['parameters'] = {
	layout: 'fullscreen',
};

/**
 * The props `Typography` and `Typography.Link` share. `typography-components.stories.tsx` takes
 * them for the link and adds its own.
 */
export const typographyFontArgTypes: Meta<typeof Typography>['argTypes'] = {
	children: {
		control: 'text',
		description: 'The text.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	variant: {
		control: 'select',
		options: VARIANTS,
		description:
			'Required. The group of the text style: `label` for one line of interface text, `paragraph` for text that wraps, `uppercase` for section and column headers, `code` for ids, queries and keys. It sets the font family, the line height, the letter spacing and the case.',
		table: { category: 'Appearance', type: { summary: 'TypographyVariantType' } },
	},
	size: {
		control: 'inline-radio',
		options: SIZES,
		description:
			'Required. The step of the type scale. `label` has all four, `paragraph` stops at `medium`, and `uppercase` and `code` have `small` and `base`.',
		table: { category: 'Appearance', type: { summary: 'TypographySizeType' } },
	},
	weight: {
		control: 'inline-radio',
		options: WEIGHTS,
		description: 'Required. The font weight: `regular` is 400, `medium` 500 and `bold` 600.',
		table: { category: 'Appearance', type: { summary: 'TypographyWeightType' } },
	},
	textOverflow: {
		control: 'inline-radio',
		options: Object.values(TypographyTextOverflow),
		description:
			'Required. How the text behaves when it is longer than its box. `wrap` breaks the lines, `visible` keeps one line that overflows, `hidden` cuts it at the edge, and `ellipsis` cuts it with `…` and shows the full text in a tooltip while it is cut. An inline text takes only `visible` and `wrap`.',
		table: { category: 'Behavior', type: { summary: 'TypographyTextOverflowType' } },
	},
	maxLines: {
		control: 'number',
		description:
			'The number of lines shown before the ellipsis. Only with `ellipsis`, and past 1 only with `variant="paragraph"`.',
		table: {
			category: 'Behavior',
			type: { summary: 'number' },
			defaultValue: { summary: '1' },
		},
	},
	display: {
		control: 'select',
		options: [undefined, ...Object.values(TypographyDisplay)],
		description:
			'How the element sits. Without it, `span`, `label`, `code` and a link are inline and the other elements are blocks. `inline-block` gives an inline text a box and keeps it in the line. `flex` and `inline-flex` lay out the children in a row. An inline text takes no `align`, `width`, `minWidth`, `maxWidth`, margin or padding.',
		table: { category: 'Layout', type: { summary: 'TypographyDisplayType' } },
	},
	gap: {
		control: 'select',
		options: SPACING_OPTIONS,
		description:
			'The space between the children of a `flex` or `inline-flex` text, as a step of the spacing scale. Each step is 2px.',
		table: { category: 'Layout', type: { summary: 'TypographySpacingType' } },
	},
	align: {
		control: 'inline-radio',
		options: [undefined, ...Object.values(TypographyAlign)],
		description:
			'The horizontal alignment of the content: the lines of a block, or the children of a `flex` text.',
		table: { category: 'Layout', type: { summary: 'TypographyAlignType' } },
	},
	verticalAlign: {
		control: 'inline-radio',
		options: Object.values(TypographyVerticalAlign),
		description: 'The vertical alignment of the children of a `flex` or `inline-flex` text.',
		table: {
			category: 'Layout',
			type: { summary: 'TypographyVerticalAlignType' },
			defaultValue: { summary: 'center' },
		},
	},
	width: {
		control: 'text',
		description: 'The width of the text.',
		table: { category: 'Layout', type: { summary: 'CSSProperties["width"]' } },
	},
	minWidth: {
		control: 'text',
		description: 'The min-width of the text.',
		table: { category: 'Layout', type: { summary: 'CSSProperties["minWidth"]' } },
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the text, where it wraps or cuts.',
		table: {
			category: 'Layout',
			type: { summary: 'CSSProperties["maxWidth"]' },
			defaultValue: { summary: '100%' },
		},
	},
	margin: {
		control: 'select',
		options: MARGIN_OPTIONS,
		description:
			'The space around the text, as a step of the spacing scale. Each step is 2px, so `4` is 8px. `auto` takes the free space. The axis and side props win over it.',
		table: {
			category: 'Layout',
			type: { summary: 'TypographyMarginType' },
			defaultValue: { summary: '0' },
		},
	},
	...spacingSideArgTypes('margin'),
	padding: {
		control: 'select',
		options: SPACING_OPTIONS,
		description:
			'The space between the edge of the text box and the text, as a step of the spacing scale. Each step is 2px. The axis and side props win over it.',
		table: {
			category: 'Layout',
			type: { summary: 'TypographySpacingType' },
			defaultValue: { summary: '0' },
		},
	},
	...spacingSideArgTypes('padding'),
	testId: {
		control: 'text',
		description: 'Forwarded as `data-testid`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};

/**
 * The number features, on `Typography` and `Typography.Link`.
 */
export const typographyNumeralArgTypes: Meta<typeof Typography>['argTypes'] = {
	tabularNumbers: {
		control: 'boolean',
		description:
			'Gives every digit the same width. Put it on the number only, where digits change in place or line up.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	slashedZero: {
		control: 'boolean',
		description: 'Draws `0` with a slash. Only on ids, hashes and codes.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
};

export const typographyArgTypes: Meta<typeof Typography>['argTypes'] = {
	...typographyFontArgTypes,
	color: {
		control: 'select',
		options: COLORS,
		description:
			'Required. The text color, with the color names of Badge. `main` is body text, `secondary` the secondary text color and `tertiary` the least important one. `inherit` takes the color of the parent element.',
		table: { category: 'Appearance', type: { summary: 'TypographyColorType' } },
	},
	as: {
		control: 'select',
		options: Object.values(TypographyElement),
		description:
			'Required. The element to render. It sets the meaning of the text, never its look, and the display when `display` is not set.',
		table: { category: 'Content', type: { summary: 'TypographyElementType' } },
	},
	...typographyNumeralArgTypes,
	htmlFor: {
		control: 'text',
		description: 'The id of the control that this label names. Only with `as="label"`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	role: {
		control: 'text',
		description: 'The role of the element, such as `alert` for an error message.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	onMouseEnter: { control: false, table: { category: 'Events' } },
	onMouseLeave: { control: false, table: { category: 'Events' } },
};
