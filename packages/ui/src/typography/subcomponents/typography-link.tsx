import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { useRenderLink } from '../../lib/use-render-link.js';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { cn, type RejectedProps } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import type { TypographyLinkProps } from '../types.js';
import styles from '../typography.module.scss';
import {
	getTypographyLook,
	isFlexDisplay,
	isTypographyTruncated,
	resolveTypographyDisplay,
	splitTypographySpacing,
	wrapTextRuns,
} from '../utils.js';

/**
 * A navigation inside a sentence or next to text. Reached as `Typography.Link`, not imported on its
 * own. It takes the style, number and layout props of `Typography` and the link props of
 * `Callout.Link`.
 *
 * It draws in the link color, and the hover underlines it. There is no `color`, since a link reads
 * as a link everywhere, and no `as`: it renders the `render` element, an `a` by default.
 *
 * Every `aria-*` and any `data-*` are forwarded to the link. There is no `className` or `style`.
 *
 * The link is a tab stop and shows the focus ring when the keyboard moves focus to it. `Enter`
 * follows it. A link that renders no text has no accessible name: it warns on the console unless
 * it has an `aria-label` or an `aria-labelledby`. The text is read from the rendered element, so a
 * child component that renders its own text, such as a translation, counts.
 *
 * ### Router links
 *
 * `Typography` imports no router. `render={<Link to="/settings" />}` renders the router link, so
 * the click is a client-side navigation and a modified click still opens a new tab. The link needs
 * the consumer's router context at render time.
 *
 * The `ref` reaches the rendered element, and so does a `ref` on the `render` element.
 *
 * A link with neither `href` nor a destination on the `render` element is a bug: it renders plain
 * text in the same style and warns on the console.
 *
 * ### Nested in text
 *
 * Nothing passes down from a `Typography` around the link, so a link inside a sentence repeats the
 * `variant`, `size` and `weight` of the sentence.
 *
 * ### Asserting on it
 *
 * `data-slot="typography-link"`, and `testId` as `data-testid`. It carries the same data
 * attributes as `Typography`, except `data-color`.
 *
 * @example
 * ```tsx
 * <Typography variant="paragraph" size="base" weight="regular" color="main" as="p" textOverflow="wrap">
 *   Read the{' '}
 *   <Typography.Link
 *     variant="paragraph"
 *     size="base"
 *     weight="regular"
 *     textOverflow="wrap"
 *     href="https://signoz.io/docs"
 *     target="_blank"
 *   >
 *     docs
 *   </Typography.Link>
 *   .
 * </Typography>
 * ```
 *
 * @example
 * ```tsx
 * // A router link
 * <Typography.Link
 *   variant="label"
 *   size="base"
 *   weight="medium"
 *   textOverflow="visible"
 *   render={<Link to="/settings" />}
 * >
 *   Settings
 * </Typography.Link>
 * ```
 */
export const TypographyLink = forwardRef<HTMLElement, TypographyLinkProps>(function TypographyLink(
	{
		variant,
		size,
		weight,
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
		children,
		className: _className,
		style: _style,
		...rest
	}: TypographyLinkProps & RejectedProps,
	ref,
) {
	const [spacing, props] = splitTypographySpacing(rest);
	const resolvedDisplay = resolveTypographyDisplay('a', display);
	const hasEllipsis = textOverflow === 'ellipsis';
	const [isTruncated, measureRef] = useIsLabelTruncated(hasEllipsis, isTypographyTruncated);
	const nameRef = useRef<HTMLElement | null>(null);
	const setNameNode = useCallback((node: HTMLElement | null): void => {
		nameRef.current = node;
	}, []);
	const ariaLabel = props['aria-label'];
	const ariaLabelledBy = props['aria-labelledby'];

	useEffect(() => {
		const text = nameRef.current?.textContent ?? '';
		const hasName = ariaLabel != null || ariaLabelledBy != null || text.trim() !== '';

		if (!hasName) {
			console.warn(
				'Typography.Link has no accessible name. Give it text, or an `aria-label` when it holds only an icon.',
			);
		}
	}, [ariaLabel, ariaLabelledBy, children]);

	const link = useRenderLink(
		{
			...props,
			children: isFlexDisplay(resolvedDisplay)
				? wrapTextRuns(children, styles['typography__text'])
				: children,
		},
		[ref, measureRef, setNameNode],
		{
			slot: 'typography-link',
			className: cn(styles['typography'], styles['typography__link']),
			fallbackClassName: styles['typography'],
			name: 'Typography.Link',
			props: {
				...getTypographyLook({
					variant,
					size,
					weight,
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
				}),
				'data-truncated': isTruncated || undefined,
			},
		},
	);

	if (!hasEllipsis) {
		return link;
	}

	return (
		<TooltipAnchor
			content={isTruncated ? children : null}
			contentProps={{ className: styles['typography__tooltip'] }}
		>
			{link}
		</TooltipAnchor>
	);
});
TypographyLink.displayName = 'Typography.Link';
