import type React from 'react';
import { forwardRef, useMemo } from 'react';
import { cn } from '../lib/utils.js';
import {
	type ButtonColorValue,
	ButtonGroupContext,
	type ButtonSizeValue,
	type ButtonVariantValue,
} from './button.js';
import styles from './button-group.module.scss';

export type ButtonGroupProps = {
	/**
	 * Default `size` applied to descendant `Button`s that do not set their own `size`.
	 * Individual buttons can still override this locally.
	 */
	size?: ButtonSizeValue;
	/**
	 * Default `variant` applied to descendant `Button`s that do not set their own `variant`.
	 * Individual buttons can still override this locally.
	 */
	variant?: ButtonVariantValue;
	/**
	 * Default `color` applied to descendant `Button`s that do not set their own `color`.
	 * Individual buttons can still override this locally (e.g. to mark one action destructive).
	 */
	color?: ButtonColorValue;
	/**
	 * Forwarded to the rendered group element as `data-testid`.
	 */
	testId?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>;

/**
 * Segmented cluster of related buttons. Renders as `<div role="group">` with
 * inline-flex children, deduped internal borders, and only the outer corners
 * rounded. `size` / `variant` / `color` set on the group propagate to descendant
 * `Button`s through context — per-button props still take precedence.
 *
 * @example
 * ```tsx
 * // Time-range segmented control — all three buttons share the group's variant + color
 * <ButtonGroup variant="outlined" color="secondary">
 *   <Button>Day</Button>
 *   <Button>Week</Button>
 *   <Button>Month</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Per-button override — last button opts into a destructive color
 * <ButtonGroup variant="outlined" color="secondary">
 *   <Button>Approve</Button>
 *   <Button>Hold</Button>
 *   <Button color="destructive">Reject</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Icon-only navigation cluster
 * <ButtonGroup variant="outlined" color="secondary" size="icon">
 *   <Button prefix={<ChevronLeft />} aria-label="Previous" />
 *   <Button prefix={<ChevronRight />} aria-label="Next" />
 * </ButtonGroup>
 * ```
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
	({ size, variant, color, className, children, testId, ...props }, ref) => {
		const value = useMemo(() => ({ size, variant, color, inGroup: true }), [size, variant, color]);

		return (
			<ButtonGroupContext.Provider value={value}>
				{/* biome-ignore lint/a11y/useSemanticElements: <div role="group"> is the standard ButtonGroup pattern; alternatives (fieldset/menu) carry unwanted semantics. */}
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
			</ButtonGroupContext.Provider>
		);
	}
);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
