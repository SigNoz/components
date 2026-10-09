import { forwardRef } from 'react';
import type { SliderRangeProps } from '../types.js';
import { SliderFrame } from './slider-frame.js';

/**
 * Picks a range of two numbers, a lower and an upper bound, from a continuous scale (Base UI
 * `Slider`). Reached as `Slider.Range`, not imported on its own.
 *
 * It takes every prop of `Slider`. `value`, `defaultValue`, `onChange` and `onAfterChange` hold a
 * pair, the lower bound first.
 *
 * Every `aria-*` goes to the root, which is a `role="group"`, and any `data-*` too. Name the group
 * with `aria-label` or `aria-labelledby`. The thumbs are named `Minimum` and `Maximum`.
 *
 * ### Two thumbs
 *
 * The fill runs between the two thumbs. A click on the track or on a mark moves the closest
 * thumb. When both hold the same value, a click or a drag moves the thumb on the side it goes
 * to.
 *
 * A thumb stops when it reaches the other one, by drag or by key, and the two can hold the same
 * value. A drag on one thumb never changes the value of the other.
 *
 * ### Forms
 *
 * Each thumb input carries `name` and `form`, so the range submits two values under the same
 * `name`, the lower bound first.
 *
 * ### Asserting on it
 *
 * The same as `Slider`. The root also has `data-range`, and the thumbs are `${testId}-thumb-0`
 * and `${testId}-thumb-1`.
 *
 * @example
 * ```tsx
 * <Slider.Range
 *   color="primary"
 *   min={0}
 *   max={100000}
 *   value={duration}
 *   onChange={setDuration}
 *   onAfterChange={applyDurationFilter}
 *   tooltip
 *   formatValue={(value) => `${value} ms`}
 *   aria-label="Duration"
 * />
 * ```
 */
export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>(function SliderRange(
	{ value, defaultValue, onChange, onAfterChange, ...props },
	ref,
) {
	return (
		<SliderFrame
			{...props}
			ref={ref}
			range
			value={value}
			defaultValue={defaultValue}
			onChange={onChange && ((values) => onChange([values[0], values[1]]))}
			onAfterChange={onAfterChange && ((values) => onAfterChange([values[0], values[1]]))}
		/>
	);
});

SliderRange.displayName = 'Slider.Range';
