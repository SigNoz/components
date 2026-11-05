import { forwardRef, useMemo, type ElementType } from 'react';
import { mergeRefs } from '../lib/merge-refs.js';
import { useIsLabelTruncated } from '../lib/useIsLabelTruncated.js';
import type { RejectedProps } from '../lib/utils.js';
import { TooltipAnchor } from '../tooltip/subcomponents/tooltip-anchor.js';
import { TypographyLink } from './subcomponents/typography-link.js';
import type { TypographyProps } from './types.js';
import styles from './typography.module.scss';
import {
	getTypographyLook,
	isFlexDisplay,
	isTypographyTruncated,
	resolveTypographyDisplay,
	splitTypographySpacing,
	wrapTextRuns,
} from './utils.js';

/**
 * Renders text in one of the 33 Periscope text styles, as the element `as` names. Use
 * `Typography.Link` for a navigation inside or next to text.
 *
 * Every `aria-*` and any `data-*` are forwarded, with `id`, `role`, `htmlFor` and the mouse
 * handlers. There is no `className` or `style`: every font property and the layout come from the
 * props.
 *
 * Visual values are `--typography-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The text is not focusable and has no role of its own. A heading is `as="h2"` or the level the
 * page outline needs, never a consequence of `size`. `uppercase` changes the case with CSS only, so
 * a screen reader reads the words as written.
 *
 * ### Layout
 *
 * `display` follows `as` when it is not set: `span`, `label` and `code` are inline, the other
 * elements are blocks. An inline text has no box, so the types reject `align`, `width`, `minWidth`,
 * `maxWidth`, the margin and padding props and the `hidden` and `ellipsis` overflows on it, until
 * `display` is `block`, `inline-block`, `flex` or `inline-flex`. `inline-block` is for a text that
 * needs a box and stays in the line; `flex` and `inline-flex` are for an icon next to the text.
 *
 * In a `flex` or `inline-flex` text, each run of text in `children` sits in its own span, which
 * takes the overflow. So with `ellipsis` an icon next to the text stays whole and only the text
 * cuts. A `Typography` or `Typography.Link` inside it shrinks and cuts on its own overflow; every
 * other child keeps its size.
 *
 * Headings, paragraphs and list items render with no margin until `margin` sets one.
 *
 * `margin`, `padding` and `gap` take steps of the spacing scale, each 2px: `margin={4}` is 8px.
 * `marginX` and `marginY` win over `margin`, and one side such as `marginBottom` wins over both, so
 * `margin={2} marginBottom={6}` is 4px on three sides and 12px below. Padding works the same way.
 *
 * ### Ellipsis
 *
 * `textOverflow="ellipsis"` cuts the text after `maxLines` lines at the edge of its box, with
 * `min-width: 0` so the cut also works on a flex child. The text is measured again when its size
 * changes and when the font loads.
 *
 * While it is cut, hovering it opens a tooltip with the full text. The full text stays in the DOM,
 * so a screen reader reads all of it and a copy returns all of it. The tooltip does not open from
 * the keyboard, since the text is not focusable.
 *
 * ### Nested text
 *
 * A `Typography` inside another one states its own style, color, element and overflow, since they
 * are required. Nothing passes down from the parent, except the color through `color="inherit"`.
 * A `--typography-*` override is different: it reaches every text under the element it is set on,
 * nested ones included, since custom properties inherit.
 *
 * ### Asserting on it
 *
 * `testId` becomes `data-testid` on the element. Otherwise use the data attributes, never the
 * hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"typography"` |
 * | `data-variant`, `data-size`, `data-weight`, `data-color`, `data-text-overflow` | mirror the prop, always present |
 * | `data-display` | the display the text renders with, including the one that comes from `as` |
 * | `data-align` | mirrors `align`, only when set |
 * | `data-vertical-align` | mirrors `verticalAlign`, only on a `flex` or `inline-flex` text |
 * | `data-max-lines` | the number of lines, only with `ellipsis` |
 * | `data-tabular-numbers`, `data-slashed-zero` | present only when the prop is set |
 * | `data-truncated` | present only while the text is cut by `ellipsis` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `typography` | always, on the element |
 * | `typography-text` | on each run of text of a `flex` or `inline-flex` text |
 *
 * @example
 * ```tsx
 * <Typography
 *   variant="paragraph"
 *   size="base"
 *   weight="regular"
 *   color="secondary"
 *   as="p"
 *   textOverflow="wrap"
 * >
 *   Data is kept for 15 days, then archived.
 * </Typography>
 * ```
 *
 * @example
 * ```tsx
 * // A heading that cuts at the width of its column, full text on hover
 * <Typography
 *   variant="label"
 *   size="large"
 *   weight="bold"
 *   color="main"
 *   as="h2"
 *   textOverflow="ellipsis"
 * >
 *   {dashboard.name}
 * </Typography>
 * ```
 *
 * @example
 * ```tsx
 * // An icon next to the text, in one row
 * <Typography
 *   variant="label"
 *   size="base"
 *   weight="medium"
 *   color="danger"
 *   as="span"
 *   display="inline-flex"
 *   gap={2}
 *   textOverflow="visible"
 * >
 *   <SolidAlertCircle size={12} />
 *   Failed
 * </Typography>
 * ```
 *
 * @example
 * ```tsx
 * // Tabular numbers on the number only, the unit outside
 * <Typography variant="paragraph" size="base" weight="regular" color="main" as="p" textOverflow="wrap">
 *   Showing{' '}
 *   <Typography
 *     variant="paragraph"
 *     size="base"
 *     weight="regular"
 *     color="inherit"
 *     as="span"
 *     textOverflow="wrap"
 *     tabularNumbers
 *   >
 *     {count}
 *   </Typography>{' '}
 *   of 5,000 logs
 * </Typography>
 * ```
 */
const TypographyRoot = forwardRef<HTMLElement, TypographyProps>(function Typography(
	{
		variant,
		size,
		weight,
		color,
		as,
		textOverflow,
		maxLines,
		tabularNumbers,
		slashedZero,
		display,
		gap,
		align,
		verticalAlign,
		width,
		minWidth,
		maxWidth,
		testId,
		children,
		className: _className,
		style: _style,
		...rest
	}: TypographyProps & RejectedProps,
	ref,
) {
	const [spacing, props] = splitTypographySpacing(rest);
	const resolvedDisplay = resolveTypographyDisplay(as, display);
	const hasEllipsis = textOverflow === 'ellipsis';
	const [isTruncated, measureRef] = useIsLabelTruncated(hasEllipsis, isTypographyTruncated);
	const mergedRef = useMemo(() => mergeRefs(ref, measureRef), [ref, measureRef]);
	const look = getTypographyLook({
		variant,
		size,
		weight,
		color,
		textOverflow,
		maxLines,
		display: resolvedDisplay,
		align,
		verticalAlign,
		tabularNumbers,
		slashedZero,
		width,
		minWidth,
		maxWidth,
		gap,
		...spacing,
	});
	const Element = as as ElementType;

	const element = (
		<Element
			ref={mergedRef}
			{...props}
			{...look}
			data-slot="typography"
			data-truncated={isTruncated || undefined}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
			className={styles['typography']}
		>
			{isFlexDisplay(resolvedDisplay)
				? wrapTextRuns(children, styles['typography__text'])
				: children}
		</Element>
	);

	if (!hasEllipsis) {
		return element;
	}

	return (
		<TooltipAnchor
			content={isTruncated ? children : null}
			contentProps={{ className: styles['typography__tooltip'] }}
		>
			{element}
		</TooltipAnchor>
	);
});
TypographyRoot.displayName = 'Typography';

export const Typography = Object.assign(TypographyRoot, {
	Link: TypographyLink,
});
