import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';
import { type SizeType, type VariantColorType } from '../button';
import styles from './button-group.module.scss';

export type ButtonGroupProps = {
	/**
	 * Mirrored on the group element as `data-size`. Not inherited by the buttons: set `size`
	 * on every child too.
	 */
	size?: SizeType;
	/**
	 * Forwarded to the rendered group element as `data-testid`.
	 */
	testId?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'> &
	VariantColorType;

/**
 * Segmented cluster of related buttons. Renders as `<div role="group">` with
 * inline-flex children, deduped internal borders, and only the outer corners
 * rounded. `size` / `variant` / `color` set on the group style the cluster itself,
 * they are not inherited by the buttons: set them on every child too.
 *
 * @example
 * ```tsx
 * // Time-range segmented control — all three buttons share the group's variant + color
 * <ButtonGroup variant="outlined" color="secondary">
 *   <Button variant="outlined" size="md" color="secondary">Day</Button>
 *   <Button variant="outlined" size="md" color="secondary">Week</Button>
 *   <Button variant="outlined" size="md" color="secondary">Month</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Per-button override — last button opts into a danger color
 * <ButtonGroup variant="outlined" color="secondary">
 *   <Button variant="outlined" size="md" color="secondary">Approve</Button>
 *   <Button variant="outlined" size="md" color="secondary">Hold</Button>
 *   <Button variant="solid" size="md" color="danger">Reject</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Icon-only navigation cluster
 * <ButtonGroup variant="outlined" color="secondary">
 *   <Button variant="outlined" size="md" color="secondary" icon aria-label="Previous">
 *     <ChevronLeft />
 *   </Button>
 *   <Button variant="outlined" size="md" color="secondary" icon aria-label="Next">
 *     <ChevronRight />
 *   </Button>
 * </ButtonGroup>
 * ```
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ size, variant, color, className, children, testId, ...props }, ref) => {
		return (
			// biome-ignore lint/a11y/useSemanticElements: <div role="group"> is the standard ButtonGroup pattern; alternatives (fieldset/menu) carry unwanted semantics.
			<div
				ref={ref}
				role="group"
				data-testid={testId}
				data-size={size}
				data-variant={variant}
				data-color={color}
				className={cn(styles['button-group'], className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
