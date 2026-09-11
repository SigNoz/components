import { cloneElement, forwardRef, isValidElement, type ReactElement, useId } from 'react';
import { cn } from '../lib/utils.js';
import { toCssLength } from '../lib/css-length.js';
import { useIsLabelTruncated } from '../lib/useIsLabelTruncated.js';
import { TooltipContent } from '../tooltip/subcomponents/tooltip-content.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../tooltip/subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../tooltip/subcomponents/tooltip-trigger.js';
import { useTooltipHandle } from '../tooltip/tooltip-handle.js';
import styles from './badge.module.scss';
import { BadgeTextOverflow, BadgeTextTransform } from './constants.js';
import type { BadgeProps } from './types.js';

function BadgeAffix({
	slot,
	element,
	className,
}: {
	slot: 'badge-prefix' | 'badge-suffix';
	element: ReactElement | undefined;
	className: string;
}): ReactElement | null {
	if (!isValidElement<{ className?: string }>(element)) {
		return null;
	}

	const clonedElement = cloneElement(element, {
		className: cn(element.props.className, className),
	});

	return (
		<span data-slot={slot} aria-hidden="true">
			{clonedElement}
		</span>
	);
}

/**
 * Renders a `<span>` for status, counts, and labels, in the same colors as `Button`.
 *
 * Every `aria-*` and any `data-*` are forwarded.
 *
 * Visual values are `--badge-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Truncation
 *
 * `textOverflow="ellipsis"` (the default) measures the content and re-measures on resize.
 *
 * While it does not fit: `data-truncated`, plus a tooltip with the full content. The visible
 * content is only clipped, so nothing is lost, just hidden until hovered or focused.
 *
 * `none` clips with no tooltip.
 *
 * The trigger is always mounted, so the element never remounts when a tooltip appears. The
 * tooltip root and popup mount only while there is something to show.
 *
 * Inside a wrapping `<Tooltip>` the badge adds its content to that popup instead of opening a
 * second one.
 *
 * ### Width
 *
 * `width` and `maxWidth` are written as inline `--badge-internal-width` and
 * `--badge-internal-max-width`.
 *
 * So they compose with the tokens instead of overwriting `style.width`. Numbers are written as
 * `px`, and any `style` you pass is kept.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` and survives the tooltip trigger cloning the badge. Otherwise use
 * the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"badge"` |
 * | `data-variant`, `data-color` | mirrors the prop |
 * | `data-text-transform` | mirrors `textTransform` |
 * | `data-text-overflow` | mirrors `textOverflow` |
 * | `data-truncated` | present only while the content does not fit |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `badge-label` | always, this is the measured element |
 * | `badge-prefix` | only when `prefix` is a valid element |
 * | `badge-suffix` | only when `suffix` is a valid element |
 *
 * ### Prefix and suffix
 *
 * `prefix` and `suffix` sit either side of the label, vertically centered with a gap. Both are
 * `aria-hidden`, so give the badge an accessible name if they carry meaning `children` doesn't
 * already convey.
 *
 * @example
 * ```tsx
 * <Badge variant="solid" color="danger">
 *   Critical
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * <Badge variant="outlined" color="success" prefix={<Check />}>
 *   Resolved
 * </Badge>
 * ```
 *
 * @example
 * ```tsx
 * // Truncates once the badge is narrower than its content, full text on hover
 * <Badge variant="outlined" color="secondary" maxWidth="10rem">
 *   kubernetes-deployment-production-east-us-2
 * </Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{
		className,
		variant,
		color,
		textTransform = BadgeTextTransform.Uppercase,
		textOverflow = BadgeTextOverflow.Ellipsis,
		testId,
		width,
		maxWidth,
		style,
		prefix,
		suffix,
		children,
		...props
	},
	ref,
) {
	const hasOverflowTooltip = textOverflow === BadgeTextOverflow.Ellipsis;
	const [isTruncated, labelRef] = useIsLabelTruncated(hasOverflowTooltip);
	const tooltipHandle = useTooltipHandle();
	const tooltipContentId = useId();

	if (children == null || children === false || children === '') {
		return null;
	}

	const badgeStyle = {
		...style,
		...(width != null && { '--badge-internal-width': toCssLength(width) }),
		...(maxWidth != null && { '--badge-internal-max-width': toCssLength(maxWidth) }),
	};

	const badgeEl = (
		<span
			data-slot="badge"
			data-color={color}
			data-variant={variant}
			data-text-transform={textTransform}
			data-text-overflow={textOverflow}
			data-truncated={isTruncated || undefined}
			className={cn(styles['badge'], className)}
			ref={ref}
			style={badgeStyle}
			{...props}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<BadgeAffix slot="badge-prefix" element={prefix} className={styles['badge__prefix']} />
			<span ref={labelRef} data-slot="badge-label" className={styles['badge__label']}>
				{children}
			</span>
			<BadgeAffix slot="badge-suffix" element={suffix} className={styles['badge__suffix']} />
		</span>
	);

	if (!hasOverflowTooltip) {
		return badgeEl;
	}

	return (
		<TooltipProviderIfMissing>
			<TooltipTrigger handle={tooltipHandle} contentId={isTruncated ? tooltipContentId : undefined}>
				{badgeEl}
			</TooltipTrigger>
			{isTruncated && (
				<TooltipRoot handle={tooltipHandle}>
					<TooltipContent id={tooltipContentId} className={styles['badge__label-tooltip']}>
						{children}
					</TooltipContent>
				</TooltipRoot>
			)}
		</TooltipProviderIfMissing>
	);
});
