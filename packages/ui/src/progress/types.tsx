import type { AriaAttributes, ComponentProps, CSSProperties } from 'react';
import type { ProgressColor } from './constants.js';

export type ProgressColorType = (typeof ProgressColor)[keyof typeof ProgressColor];

export type ProgressProps = Pick<ComponentProps<'div'>, 'id'> &
	// JSX does not type-check hyphenated names, so this `Omit` only keeps them out of the docs. The
	// component writes its own after the spread, so a caller value never wins.
	Omit<AriaAttributes, 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuetext'> & {
		/**
		 * The completion, from 0 to 100.
		 *
		 * @note The fill stops at 0 and 100, the value text does not: `140` shows `140%` over a full
		 * bar.
		 *
		 * @note A value that is not a finite number (`NaN`, `Infinity`) renders the empty track, the
		 * value text `-`, and announces `No data`.
		 */
		percent: number;
		/**
		 * The status of the bar. Pick it from a threshold on the metric, never from how the value
		 * feels, and keep the thresholds of one metric in one helper.
		 *
		 * @note Required, with no default: a bar that falls back to `primary` reads as a status
		 * nobody picked.
		 *
		 * @note The color is never the only signal: the value text, or the number next to the bar,
		 * carries the data.
		 */
		color: ProgressColorType;
		/**
		 * Shows the percent as text to the right of the bar, rounded to at most 2 decimals.
		 *
		 * @note The text never truncates. When space runs out, the bar shrinks first.
		 *
		 * @default false
		 */
		showInfo?: boolean;
		/**
		 * Splits the bar into this number of equal segments, with a gap between them that shows the
		 * surface behind the progress.
		 *
		 * @note The fill stays continuous across the segments: `percent={50}` with `steps={5}` fills
		 * two and a half.
		 *
		 * @note Below 2 renders the continuous bar. A value that is not an integer is a bug: it also
		 * renders the continuous bar, and warns in the console.
		 */
		steps?: number;
		/**
		 * Marks a task that is running: the fill shows moving stripes and eases to each new
		 * `percent`. The stripes stop at 100.
		 *
		 * @note Not for a metric bar, which refreshes with no motion. With
		 * `prefers-reduced-motion: reduce` the stripes hold still and the fill does not ease.
		 *
		 * @default false
		 */
		active?: boolean;
		/**
		 * The width of the progress. Without it the progress fills its parent. Numbers are written
		 * as `px`.
		 */
		width?: CSSProperties['width'];
		/**
		 * The max-width of the progress. Numbers are written as `px`.
		 *
		 * @default '100%'
		 */
		maxWidth?: CSSProperties['maxWidth'];
		/**
		 * Forwarded to the root as `data-testid`. The parts take it as a prefix:
		 * `${testId}-track`, `${testId}-indicator` and, with `showInfo`, `${testId}-value`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root.
		 */
		[key: `data-${string}`]: unknown;
	};
