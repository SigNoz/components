import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { useId, useMemo } from 'react';
import { cn } from '../lib/utils.js';
import styles from './progress.module.css';

export interface ProgressProps
	extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
	/**
	 * The completion value from 0 to 100.
	 * @defaultValue 0
	 */
	percent?: number;
	/**
	 * If provided, divides the progress bar into equal visual segments instead of a continuous bar.
	 */
	steps?: number;
	/**
	 * Controls the edge styling of the progress indicator.
	 * @defaultValue 'butt'
	 */
	strokeLinecap?: 'butt' | 'round';
	/**
	 * A CSS color value to dynamically override the indicator's background color.
	 */
	strokeColor?: string;
	/**
	 * The size of the progress bar.
	 * @defaultValue 'default'
	 */
	size?: 'small' | 'default';
	/**
	 * If true, renders the percent value as text next to the progress bar.
	 * @defaultValue false
	 */
	showInfo?: boolean;
	/**
	 * If 'active', applies a subtle striped animation to the progress bar.
	 * @defaultValue 'normal'
	 */
	status?: 'normal' | 'active';
	/**
	 * Test ID for the progress bar.
	 */
	testId?: string;
	/**
	 * A unique identifier for the progress bar.
	 */
	id?: string;
	/**
	 * Inline styles applied to the progress wrapper.
	 */
	style?: React.CSSProperties;
}

/**
 * Displays a progress bar indicating the completion percentage of a task or process.
 * Supports different sizes, line cap styles, step dividers, and an animated active state.
 *
 * @example
 * ```tsx
 * <Progress percent={50} />
 * ```
 *
 * @example
 * ```tsx
 * <Progress percent={75} strokeLinecap="round" showInfo />
 * ```
 *
 * @example
 * ```tsx
 * <Progress percent={30} status="active" strokeColor="#52c41a" />
 * ```
 *
 * @example
 * ```tsx
 * <Progress percent={60} steps={5} size="small" />
 * ```
 */
const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
	(
		{
			className,
			percent = 0,
			steps,
			strokeLinecap = 'butt',
			strokeColor,
			size = 'default',
			showInfo = false,
			status = 'normal',
			testId,
			id,
			style,
			...props
		},
		ref
	) => {
		const internalId = useId();
		// Clamp percent between 0 and 100
		const clampedPercent = Math.min(Math.max(percent, 0), 100);
		const stepList = useMemo(() => (steps ? Array.from({ length: steps - 1 }) : []), [steps]);

		return (
			<div className={cn(styles.wrapper, className)} data-testid={testId} id={id} style={style}>
				<ProgressPrimitive.Root
					ref={ref}
					className={styles.root}
					data-size={size}
					data-linecap={strokeLinecap}
					value={clampedPercent}
					{...props}
				>
					<ProgressPrimitive.Indicator
						className={styles.indicator}
						data-status={status}
						style={{
							transform: `translateX(-${100 - clampedPercent}%)`,
							backgroundColor: strokeColor,
						}}
					/>

					{/* Overlay dividers for steps */}
					{steps && steps > 1 ? (
						<div className={styles.stepDividers} aria-hidden="true">
							{stepList.map((_, i) => (
								<div
									key={`progress-step-divider-${internalId}-${i}`}
									className={styles.stepDivider}
									style={{ left: `${((i + 1) * 100) / steps}%` }}
								/>
							))}
						</div>
					) : null}
				</ProgressPrimitive.Root>
				{showInfo && <span className={styles.info}>{clampedPercent}%</span>}
			</div>
		);
	}
);

Progress.displayName = 'Progress';

export { Progress };
