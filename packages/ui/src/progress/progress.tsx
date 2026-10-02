import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { type CSSProperties, forwardRef, useEffect } from 'react';
import { toCssLength } from '../lib/css-length.js';
import type { RejectedProps } from '../lib/utils.js';
import styles from './progress.module.scss';
import type { ProgressProps } from './types.js';

const EMPTY_VALUE_TEXT = '-';

const EMPTY_ARIA_VALUE_TEXT = 'No data';

/** Not `toFixed(2)`, which pads: `5` would show `5.00%` and `41.2` would show `41.20%`. */
function formatPercent(percent: number): string {
	return `${Math.round(percent * 100) / 100}%`;
}

/**
 * Renders a determinate progress bar (Base UI `Progress`), for a metric in a table cell or a card,
 * or for a task with a known end.
 *
 * Every `aria-*` and any `data-*` are forwarded to the root, which is the `role="progressbar"`.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped.
 *
 * Visual values are `--progress-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The bar has no visible label, and the column header of a table does not name it. Give it a name
 * that says what is measured, through `aria-label` or `aria-labelledby` (`aria-label="CPU usage"`).
 *
 * `aria-valuemin` is `0`, `aria-valuemax` is `100`, `aria-valuenow` is the clamped `percent` and
 * `aria-valuetext` is the value text. So a screen reader reads `140%` and not `100`. The value text
 * itself is `aria-hidden`, since `aria-valuetext` already reads it.
 *
 * The progress is not focusable and reacts to neither hover nor keys.
 *
 * ### Value text
 *
 * `showInfo` writes `percent` rounded to at most 2 decimals, with no trailing zeros, then `%`:
 * `33.333` shows `33.33%` and `5` shows `5%`.
 *
 * The fill clamps to the track, the text does not. So `140` shows `140%` over a full bar.
 *
 * The text never shrinks and never truncates. When space runs out, the bar shrinks, down to 0.
 *
 * The digits are tabular, with a slashed zero. `infoWidth` gives the text a minimum width, aligned
 * to the end, so the bar keeps its length while the number changes.
 *
 * ### Empty value
 *
 * A `percent` that is not a finite number renders the empty track and the text `-`. It announces
 * `No data`, with `aria-valuenow` at `0`.
 *
 * The bar is never hidden: a table column with a missing bar shifts, and hides that the data is
 * missing.
 *
 * ### Steps
 *
 * `steps` cuts the track into equal segments with rounded corners. The gaps are transparent, so
 * the bar works on any surface, and the fill runs on across them.
 *
 * Segments are not elements: they have no test ID and no slot.
 *
 * ### Motion
 *
 * Without `active` the fill jumps to a new `percent`. A table refreshes dozens of bars at once, and
 * a transition on each would turn the data into motion.
 *
 * With `active` the fill eases to each new `percent` and stripes move across it, until `percent`
 * reaches 100. With `prefers-reduced-motion: reduce` neither moves.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root, and the prefix of the parts. Otherwise use the role and
 * the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"progress"` |
 * | `data-color` | mirrors the prop |
 * | `data-steps` | the number of segments, only while the bar is segmented |
 * | `data-active` | present only while `active` |
 * | `data-progressing`, `data-complete` | from Base UI, `data-complete` once `percent` reaches 100 |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `progress-track` | always | `${testId}-track` |
 * | `progress-indicator` | always, inside the track, its inline `width` is the fill | `${testId}-indicator` |
 * | `progress-value` | only with `showInfo`, `aria-hidden` | `${testId}-value` |
 *
 * @example
 * ```tsx
 * <Progress percent={cpu} color={cpuColor(cpu)} showInfo aria-label="CPU usage" />
 * ```
 *
 * @example
 * ```tsx
 * // A task with a known end: segmented, and moving while it runs
 * <Progress
 *   percent={done}
 *   color="primary"
 *   steps={5}
 *   active={isRunning}
 *   aria-label="Onboarding checklist"
 * />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
	{
		percent,
		color,
		showInfo = false,
		infoWidth,
		steps,
		active = false,
		width,
		maxWidth,
		testId,
		className: _className,
		style: _style,
		...props
	}: ProgressProps & RejectedProps,
	ref,
) {
	const hasValue = Number.isFinite(percent);
	const valueText = hasValue ? formatPercent(percent) : EMPTY_VALUE_TEXT;
	const isFractionalSteps = steps !== undefined && !Number.isInteger(steps);
	const segments = steps !== undefined && !isFractionalSteps && steps >= 2 ? steps : undefined;

	useEffect(() => {
		if (isFractionalSteps) {
			console.warn('Progress: `steps` must be an integer, showing the continuous bar.');
		}
	}, [isFractionalSteps]);

	const rootStyle = {
		...(width != null && { '--progress-internal-width': toCssLength(width) }),
		...(maxWidth != null && { '--progress-internal-max-width': toCssLength(maxWidth) }),
		...(segments !== undefined && { '--progress-internal-steps': String(segments) }),
		...(infoWidth != null && {
			'--progress-internal-value-min-inline-size': toCssLength(infoWidth),
		}),
	} as CSSProperties;

	return (
		<ProgressPrimitive.Root
			{...props}
			ref={ref}
			// Base UI clamps `value` for the fill and `aria-valuenow`. An empty value is `0`, since
			// Base UI renders `null` as an indeterminate bar.
			value={hasValue ? percent : 0}
			// Base UI's defaults, written after the spread so a stray `min` or `max` cannot move the range.
			min={0}
			max={100}
			aria-valuetext={hasValue ? valueText : EMPTY_ARIA_VALUE_TEXT}
			data-slot="progress"
			data-color={color}
			data-steps={segments}
			data-active={active || undefined}
			className={styles.progress}
			style={rootStyle}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<ProgressPrimitive.Track
				data-slot="progress-track"
				className={styles['progress__track']}
				{...(testId === undefined ? {} : { 'data-testid': `${testId}-track` })}
			>
				<ProgressPrimitive.Indicator
					data-slot="progress-indicator"
					className={styles['progress__indicator']}
					{...(testId === undefined ? {} : { 'data-testid': `${testId}-indicator` })}
				/>
			</ProgressPrimitive.Track>
			{showInfo && (
				<ProgressPrimitive.Value
					data-slot="progress-value"
					className={styles['progress__value']}
					{...(testId === undefined ? {} : { 'data-testid': `${testId}-value` })}
				>
					{() => valueText}
				</ProgressPrimitive.Value>
			)}
		</ProgressPrimitive.Root>
	);
});
