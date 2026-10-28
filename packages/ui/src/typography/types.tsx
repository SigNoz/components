import type { AriaAttributes, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type { RenderLinkProps } from '../lib/use-render-link.js';
import type {
	TypographyAlign,
	TypographyColor,
	TypographyDisplay,
	TypographyElement,
	TypographySize,
	TypographySpacing,
	TypographySpacingPropNames,
	TypographyTextOverflow,
	TypographyVariant,
	TypographyVerticalAlign,
	TypographyWeight,
} from './constants.js';

export type TypographyVariantType = (typeof TypographyVariant)[keyof typeof TypographyVariant];
export type TypographySizeType = (typeof TypographySize)[keyof typeof TypographySize];
export type TypographyWeightType = (typeof TypographyWeight)[keyof typeof TypographyWeight];
export type TypographyColorType = (typeof TypographyColor)[keyof typeof TypographyColor];
export type TypographyElementType = (typeof TypographyElement)[keyof typeof TypographyElement];
export type TypographyTextOverflowType =
	(typeof TypographyTextOverflow)[keyof typeof TypographyTextOverflow];
export type TypographyDisplayType = (typeof TypographyDisplay)[keyof typeof TypographyDisplay];
export type TypographyAlignType = (typeof TypographyAlign)[keyof typeof TypographyAlign];
export type TypographyVerticalAlignType =
	(typeof TypographyVerticalAlign)[keyof typeof TypographyVerticalAlign];
export type TypographySpacingType = (typeof TypographySpacing)[number];
export type TypographyMarginType = TypographySpacingType | 'auto';
type TypographySpacingPropName = (typeof TypographySpacingPropNames)[number];

type TypographyInlineElement = 'span' | 'label' | 'code';
type TypographyBlockElement = Exclude<TypographyElementType, TypographyInlineElement>;

/**
 * The type of a box prop on an inline text, which no value matches.
 */
export interface AnInlineTextHasNoBox {
	'an inline text has no box: set `display` to `block`, `inline-block`, `flex` or `inline-flex`, or render a block `as`': never;
}

/**
 * The type of `gap` and `verticalAlign` on a text that is not `flex`, which no value matches.
 */
export interface OnlyAFlexTextLaysOutItsChildren {
	'`gap` and `verticalAlign` lay out the children of a `flex` or `inline-flex` text': never;
}

/**
 * The type of `maxLines` without `textOverflow="ellipsis"`, which no value matches.
 */
export interface OnlyAnEllipsisTakesMaxLines {
	'`maxLines` only works with `textOverflow="ellipsis"`': never;
}

/**
 * The type of a `maxLines` past 1 on a text that is not `paragraph`, which no value matches.
 */
export interface OnlyAParagraphWrapsPastOneLine {
	'`maxLines` past 1 only works with `variant="paragraph"`': never;
}

/**
 * The type of `htmlFor` on an element other than `label`, which no value matches.
 */
export interface OnlyALabelNamesAControl {
	'`htmlFor` only works with `as="label"`': never;
}

type TypographyStyleProps = {
	/**
	 * The group of the text style. It sets the font family, the line height, the letter spacing and
	 * the case.
	 *
	 * `paragraph` is for text that can wrap, `label` for one line of interface text next to a control
	 * or an icon, `uppercase` for section and column headers, and `code` for values such as ids,
	 * queries and keys.
	 */
	variant: TypographyVariantType;
	/**
	 * The step of the type scale. With `variant` and `weight` it names the Figma text style:
	 * `variant="label" size="base" weight="medium"` is `Label / Base / 500`.
	 *
	 * @note `label` has all four steps, `paragraph` has `small`, `base` and `medium`, and `uppercase`
	 * and `code` have `small` and `base`.
	 */
	size: TypographySizeType;
	/**
	 * The font weight: `regular` is 400, `medium` 500 and `bold` 600.
	 */
	weight: TypographyWeightType;
} & (
	| { variant: 'label'; size: TypographySizeType; maxLines?: 1 | OnlyAParagraphWrapsPastOneLine }
	| { variant: 'paragraph'; size: 'small' | 'base' | 'medium' }
	| {
			variant: 'uppercase' | 'code';
			size: 'small' | 'base';
			maxLines?: 1 | OnlyAParagraphWrapsPastOneLine;
	  }
);

type TypographyOverflowProps = {
	/**
	 * How the text behaves when it is longer than its box.
	 *
	 * `wrap` breaks the lines at spaces, and a word longer than the line at any character. `visible`
	 * keeps one line that overflows its parent. `hidden` keeps one line and cuts it at the edge, with
	 * no ellipsis and no tooltip. `ellipsis` cuts it with `…` after `maxLines` lines and, while the
	 * text is cut, shows the full text in a tooltip on hover.
	 *
	 * @note `hidden` and `ellipsis` need a box to cut at, so an inline text takes only `visible` and
	 * `wrap`.
	 */
	textOverflow: TypographyTextOverflowType;
} & (
	| {
			textOverflow: 'ellipsis';
			/**
			 * The number of lines shown before the ellipsis. A fraction is rounded down, and anything
			 * below 1, or not a number, is 1.
			 *
			 * @note Only `paragraph` goes past one line. `label`, `uppercase` and `code` have a line
			 * height of 1, so a second line would run into the first, and they always show one.
			 *
			 * @default 1
			 */
			maxLines?: number;
	  }
	| {
			textOverflow: 'visible' | 'hidden' | 'wrap';
			/**
			 * Only `textOverflow="ellipsis"` takes a number of lines.
			 */
			maxLines?: OnlyAnEllipsisTakesMaxLines;
	  }
);

type TypographyBoxProps = {
	/**
	 * The horizontal alignment of the content: the lines of a block, or the children of a `flex`
	 * text. `start` and `end` follow the direction of the text.
	 */
	align?: TypographyAlignType;
	/**
	 * The width of the text. Numbers are written as `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The min-width of the text, such as a label in a column that keeps its width. Numbers are
	 * written as `px`.
	 */
	minWidth?: CSSProperties['minWidth'];
	/**
	 * The max-width of the text, where it wraps or cuts. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * The space around the text, as a step of the spacing scale. Each step is 2px, so `4` is 8px.
	 * `auto` takes the free space, such as to push the text to the end of a flex row.
	 *
	 * @note `marginX` and `marginY` win over `margin`, and `marginTop`, `marginRight`,
	 * `marginBottom` and `marginLeft` win over both: `margin={2} marginBottom={6}`.
	 *
	 * @default 0
	 */
	margin?: TypographyMarginType;
	/**
	 * The space to the left and the right of the text. Wins over `margin`.
	 */
	marginX?: TypographyMarginType;
	/**
	 * The space above and below the text. Wins over `margin`.
	 */
	marginY?: TypographyMarginType;
	/**
	 * The space above the text. Wins over `marginY` and `margin`.
	 */
	marginTop?: TypographyMarginType;
	/**
	 * The space to the right of the text. Wins over `marginX` and `margin`.
	 */
	marginRight?: TypographyMarginType;
	/**
	 * The space below the text. Wins over `marginY` and `margin`.
	 */
	marginBottom?: TypographyMarginType;
	/**
	 * The space to the left of the text. Wins over `marginX` and `margin`.
	 */
	marginLeft?: TypographyMarginType;
	/**
	 * The space between the edge of the text box and the text, as a step of the spacing scale.
	 * Each step is 2px, so `4` is 8px.
	 *
	 * @note `paddingX` and `paddingY` win over `padding`, and `paddingTop`, `paddingRight`,
	 * `paddingBottom` and `paddingLeft` win over both: `padding={2} paddingX={4}`.
	 *
	 * @default 0
	 */
	padding?: TypographySpacingType;
	/**
	 * The padding on the left and the right. Wins over `padding`.
	 */
	paddingX?: TypographySpacingType;
	/**
	 * The padding on the top and the bottom. Wins over `padding`.
	 */
	paddingY?: TypographySpacingType;
	/**
	 * The padding on the top. Wins over `paddingY` and `padding`.
	 */
	paddingTop?: TypographySpacingType;
	/**
	 * The padding on the right. Wins over `paddingX` and `padding`.
	 */
	paddingRight?: TypographySpacingType;
	/**
	 * The padding on the bottom. Wins over `paddingY` and `padding`.
	 */
	paddingBottom?: TypographySpacingType;
	/**
	 * The padding on the left. Wins over `paddingX` and `padding`.
	 */
	paddingLeft?: TypographySpacingType;
};

type TypographyNoBoxProps = {
	[Key in keyof TypographyBoxProps]?: AnInlineTextHasNoBox;
};

type TypographyFlexProps = {
	/**
	 * The space between the children, as a step of the spacing scale. Each step is 2px, so `4` is
	 * 8px.
	 */
	gap?: TypographySpacingType;
	/**
	 * The vertical alignment of the children.
	 *
	 * @default 'center'
	 */
	verticalAlign?: TypographyVerticalAlignType;
};

type TypographyNoFlexProps = {
	/**
	 * Only a `flex` or `inline-flex` text takes a gap.
	 */
	gap?: OnlyAFlexTextLaysOutItsChildren;
	/**
	 * Only a `flex` or `inline-flex` text aligns its children.
	 */
	verticalAlign?: OnlyAFlexTextLaysOutItsChildren;
};

type TypographyBoxLayout = TypographyBoxProps & TypographyNoFlexProps;

type TypographyFlexLayout = {
	display: 'flex' | 'inline-flex';
} & TypographyBoxProps &
	TypographyFlexProps;

type TypographyInlineLayout = {
	textOverflow: 'visible' | 'wrap';
} & TypographyNoBoxProps &
	TypographyNoFlexProps;

type TypographyLayoutProps = {
	/**
	 * The element to render. It sets the meaning of the text, never its look, and the display when
	 * `display` is not set.
	 */
	as: TypographyElementType;
	/**
	 * How the element sits. Without it, `span`, `label` and `code` are inline and the other elements
	 * are blocks. A block `li` stays a list item, so it keeps its marker. `inline-block` gives an
	 * inline text a box and keeps it in the line. `flex` and `inline-flex` lay out the children in a
	 * row, such as an icon and the text.
	 *
	 * @note An inline text has no box, so it takes no `align`, `width`, `minWidth`, `maxWidth`,
	 * margin or padding, and only the `visible` and `wrap` overflows.
	 */
	display?: TypographyDisplayType;
} & (
	| TypographyFlexLayout
	| ({ display: 'block' | 'inline-block' } & TypographyBoxLayout)
	| ({ as: TypographyBlockElement; display?: undefined } & TypographyBoxLayout)
	| ({ display: 'inline' } & TypographyInlineLayout)
	| ({ as: TypographyInlineElement; display?: undefined } & TypographyInlineLayout)
);

type TypographyLabelProps =
	| {
			as: 'label';
			/**
			 * The id of the control that this label names.
			 */
			htmlFor?: string;
	  }
	| {
			as: Exclude<TypographyElementType, 'label'>;
			/**
			 * Only `as="label"` names a control.
			 */
			htmlFor?: OnlyALabelNamesAControl;
	  };

type TypographyNumeralProps = {
	/**
	 * Gives every digit the same width, so a number that changes in place does not move the text
	 * around it. Put it on the number only and keep the unit outside: it also gives the space, the
	 * comma and the period a fixed width.
	 *
	 * @default false
	 */
	tabularNumbers?: boolean;
	/**
	 * Draws `0` with a slash, so it does not read as the letter `O`. Use it only on ids, hashes and
	 * codes.
	 *
	 * @default false
	 */
	slashedZero?: boolean;
};

type TypographyBaseProps = AriaAttributes &
	TypographyNumeralProps & {
		id?: string;
		/**
		 * Forwarded to the element as `data-testid`.
		 */
		testId?: string;
		/**
		 * The text color. It takes the color names of `Badge`: each hue draws in the label color of an
		 * outlined badge of the same `color`. `main` is the color of body text, `secondary` the
		 * secondary text color and `tertiary` the least important one.
		 *
		 * `inherit` takes the color of the parent element, so the text follows a component that sets
		 * one, such as `Callout` or `AlertStrip`.
		 */
		color: TypographyColorType;
		/**
		 * The role of the element, such as `alert` for an error message that must be announced when it
		 * shows.
		 */
		role?: string;
		/**
		 * Forwarded to the element, so the text can be the trigger of a `Tooltip`.
		 */
		onMouseEnter?: MouseEventHandler<HTMLElement>;
		/**
		 * Forwarded to the element, so the text can be the trigger of a `Tooltip`.
		 */
		onMouseLeave?: MouseEventHandler<HTMLElement>;
		/**
		 * The text. Nothing passes down from a `Typography` around it, except the color through
		 * `color="inherit"`.
		 */
		children: ReactNode;
		/**
		 * Any `data-*` prop is accepted and forwarded to the element.
		 */
		[key: `data-${string}`]: unknown;
	};

export type TypographyProps = TypographyBaseProps &
	TypographyStyleProps &
	TypographyOverflowProps &
	TypographyLayoutProps &
	TypographyLabelProps;

type TypographyLinkLayoutProps = {
	/**
	 * How the link sits. Without it, the link is inline. `inline-block` gives it a box and keeps it
	 * in the line. `flex` and `inline-flex` lay out the children in a row, such as an icon and the
	 * text.
	 *
	 * @note An inline link has no box, so it takes no `align`, `width`, `minWidth`, `maxWidth`,
	 * margin or padding, and only the `visible` and `wrap` overflows.
	 */
	display?: TypographyDisplayType;
} & (
	| TypographyFlexLayout
	| ({ display: 'block' | 'inline-block' } & TypographyBoxLayout)
	| ({ display?: 'inline' } & TypographyInlineLayout)
);

export type TypographyLinkProps = RenderLinkProps &
	TypographyStyleProps &
	TypographyNumeralProps &
	TypographyOverflowProps &
	TypographyLinkLayoutProps & {
		id?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the link.
		 */
		[key: `data-${string}`]: unknown;
	};

/**
 * The margin and padding props of a text. They arrive as their rule types where the text does not
 * take them.
 *
 * @access private
 */
export type TypographySpacingProps = Partial<Record<TypographySpacingPropName, unknown>>;

/**
 * `Props` without the margin and padding props, member by member of a union.
 *
 * @access private
 */
export type WithoutTypographySpacingProps<Props> = Props extends unknown
	? Omit<Props, TypographySpacingPropName>
	: never;

/**
 * The props of a text that set its look, for `Typography` and `Typography.Link`.
 *
 * @access private
 */
export type TypographyLookProps = {
	variant: TypographyVariantType;
	size: TypographySizeType;
	weight: TypographyWeightType;
	color?: TypographyColorType;
	textOverflow: TypographyTextOverflowType;
	display: TypographyDisplayType;
	tabularNumbers?: boolean;
	slashedZero?: boolean;
	maxLines?: unknown;
	align?: unknown;
	verticalAlign?: unknown;
	width?: unknown;
	minWidth?: unknown;
	maxWidth?: unknown;
	gap?: unknown;
} & TypographySpacingProps;
