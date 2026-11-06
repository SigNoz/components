export const TypographyVariant = {
	Label: 'label',
	Paragraph: 'paragraph',
	Uppercase: 'uppercase',
	Code: 'code',
} as const;

export const TypographySize = {
	Small: 'small',
	Base: 'base',
	Medium: 'medium',
	Large: 'large',
} as const;

export const TypographyWeight = {
	Regular: 'regular',
	Medium: 'medium',
	Bold: 'bold',
} as const;

export const TypographyColor = {
	Main: 'main',
	Secondary: 'secondary',
	Tertiary: 'tertiary',
	Primary: 'primary',
	Success: 'success',
	Danger: 'danger',
	Warning: 'warning',
	Info: 'info',
	Archive: 'archive',
	HighlightDanger: 'highlight-danger',
	Inherit: 'inherit',
} as const;

export const TypographyElement = {
	Span: 'span',
	P: 'p',
	Div: 'div',
	Label: 'label',
	Li: 'li',
	Code: 'code',
	H1: 'h1',
	H2: 'h2',
	H3: 'h3',
	H4: 'h4',
	H5: 'h5',
	H6: 'h6',
} as const;

export const TypographyTextOverflow = {
	Visible: 'visible',
	Hidden: 'hidden',
	Wrap: 'wrap',
	Ellipsis: 'ellipsis',
} as const;

export const TypographyDisplay = {
	Inline: 'inline',
	Block: 'block',
	InlineBlock: 'inline-block',
	Flex: 'flex',
	InlineFlex: 'inline-flex',
} as const;

export const TypographyAlign = {
	Start: 'start',
	Center: 'center',
	End: 'end',
} as const;

export const TypographyVerticalAlign = {
	Start: 'start',
	Center: 'center',
	End: 'end',
	Baseline: 'baseline',
} as const;

/**
 * The names of the margin and padding props.
 *
 * @access private
 */
export const TypographySpacingPropNames = [
	'margin',
	'marginX',
	'marginY',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginLeft',
	'padding',
	'paddingX',
	'paddingY',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
] as const;

export const TypographySpacing = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64,
] as const;
