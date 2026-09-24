import {
	cloneElement,
	forwardRef,
	isValidElement,
	type CSSProperties,
	type ElementType,
	type KeyboardEventHandler,
	type MouseEventHandler,
	type ReactElement,
} from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { cn } from '../../lib/utils.js';
import { useIsLabelTruncated } from '../../lib/useIsLabelTruncated.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../badge.module.scss';
import { BadgeTextOverflow } from '../constants.js';
import type { BadgeColorType, BadgeProps, BadgeVariantType } from '../types.js';

function BadgeAffix({
	slot,
	element,
	className,
	interactive = false,
}: {
	slot: string;
	element: ReactElement | undefined;
	className: string;
	interactive?: boolean;
}): ReactElement | null {
	if (!isValidElement<{ className?: string }>(element)) {
		return null;
	}

	const clonedElement = cloneElement(element, {
		className: cn(element.props.className, className),
	});

	return (
		<span data-slot={slot} aria-hidden={interactive ? undefined : true}>
			{clonedElement}
		</span>
	);
}

export type BadgeRootProps = Omit<BadgeProps, 'variant' | 'color'> & {
	/**
	 * `Pill.Closeable` has no `variant`/`color` of its own (fixed neutral fill), so unlike
	 * `BadgeProps` these stay optional here.
	 *
	 * @access private
	 */
	variant?: BadgeVariantType;
	/**
	 * @access private
	 */
	color?: BadgeColorType;
	/**
	 * The rendered element. `Badge` always passes `span` (its public default); `Pill` passes
	 * `button` to get real button semantics (hover, `:focus-visible`, Enter/Space) for free.
	 *
	 * @access private
	 */
	as?: 'span' | 'button';
	/**
	 * Overrides `data-slot`, so a caller composing this (like `Pill`) can stamp its own identity
	 * instead of `"badge"`.
	 *
	 * @access private
	 */
	slot?: string;
	/**
	 * `Pill.Closeable` renders as `span` but still needs button semantics, so it passes
	 * `role="button"` and `tabIndex={0}` itself instead of `as="button"` (its close icon needs to
	 * be its own nested `<button>`, which a real `<button>` root can't contain).
	 *
	 * @access private
	 */
	role?: 'button';
	/**
	 * @access private
	 */
	tabIndex?: number;
	/**
	 * `Pill` merges its own class in. `Badge` exposes none.
	 *
	 * @access private
	 */
	className?: string;
	/**
	 * `Pill` forwards the style its size props build. `Badge` exposes none.
	 *
	 * @access private
	 */
	style?: CSSProperties;
	/**
	 * Stamped as `id` on the label span. `Pill.Closeable` points its own `aria-labelledby` at it,
	 * so its accessible name is the label alone and never sweeps in the nested close button's
	 * `aria-label`, whatever type `children` is.
	 *
	 * @access private
	 */
	labelId?: string;
	/**
	 * @access private
	 */
	onClick?: MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
	/**
	 * @access private
	 */
	onKeyDown?: KeyboardEventHandler<HTMLButtonElement | HTMLSpanElement>;
	/**
	 * `suffix` is normally decorative: `aria-hidden`, and only its sizing class is cloned in.
	 * `Pill.Closeable` passes its own close `<button>` as `suffix` and sets this so it stays in
	 * the accessibility tree and keeps its own class untouched (no cloned-in sizing class, which
	 * would fight its `all: unset` reset).
	 *
	 * @access private
	 */
	interactiveSuffix?: boolean;
};

/**
 * Shared rendering for `Badge` and `Pill`: label, truncation tooltip, prefix/suffix, width and
 * testId wiring. Not part of the package's public surface, reach it through `Badge` (`span`, the
 * default) or `Pill` (`button`).
 *
 * @access private
 */
export const BadgeRoot = forwardRef<HTMLSpanElement | HTMLButtonElement, BadgeRootProps>(
	function BadgeRoot(
		{
			as = 'span',
			slot = 'badge',
			role,
			tabIndex,
			labelId,
			className,
			variant,
			color,
			textTransform,
			textOverflow = BadgeTextOverflow.Ellipsis,
			testId,
			width,
			maxWidth,
			style,
			prefix,
			suffix,
			interactiveSuffix = false,
			onClick,
			onKeyDown,
			children,
			...props
		},
		ref,
	) {
		const hasOverflowTooltip = textOverflow === BadgeTextOverflow.Ellipsis;
		const [isTruncated, labelRef] = useIsLabelTruncated(hasOverflowTooltip);

		if (children == null || children === false || children === '') {
			return null;
		}

		const badgeStyle = {
			...style,
			...(width != null && { '--badge-internal-width': toCssLength(width) }),
			...(maxWidth != null && { '--badge-internal-max-width': toCssLength(maxWidth) }),
		};

		const Root = as as ElementType;

		const badgeEl = (
			<Root
				data-slot={slot}
				data-color={color}
				data-variant={variant}
				data-text-transform={textTransform}
				data-text-overflow={textOverflow}
				data-truncated={isTruncated || undefined}
				className={cn(styles['badge'], className)}
				ref={ref}
				style={badgeStyle}
				role={role}
				tabIndex={tabIndex}
				onClick={onClick}
				onKeyDown={onKeyDown}
				type={as === 'button' ? 'button' : undefined}
				{...props}
				{...(testId === undefined ? {} : { 'data-testid': testId })}
			>
				<BadgeAffix slot={`${slot}-prefix`} element={prefix} className={styles['badge__prefix']} />
				<span
					ref={labelRef}
					id={labelId}
					data-slot={`${slot}-label`}
					className={styles['badge__label']}
				>
					{children}
				</span>
				<BadgeAffix
					slot={`${slot}-suffix`}
					element={suffix}
					className={interactiveSuffix ? '' : styles['badge__suffix']}
					interactive={interactiveSuffix}
				/>
			</Root>
		);

		if (!hasOverflowTooltip) {
			return badgeEl;
		}

		return (
			<TooltipAnchor
				content={isTruncated ? children : null}
				contentProps={{ className: styles['badge__label-tooltip'] }}
			>
				{badgeEl}
			</TooltipAnchor>
		);
	},
);
