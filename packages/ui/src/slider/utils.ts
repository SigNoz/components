import { SLIDER_OWN_ARIA_ATTRIBUTES } from './constants.js';

const OWN_ARIA_ATTRIBUTES = new Set<string>(SLIDER_OWN_ARIA_ATTRIBUTES);

/**
 * A mark of `marks`, as the slider renders it.
 *
 * @access private
 */
export type SliderMark = {
	value: number;
	label: string;
};

/**
 * Where a thumb renders a value: `min` for a value that is not a finite number, otherwise the
 * value clamped to the scale.
 *
 * @access private
 */
export function toThumbValue(value: number, min: number, max: number): number {
	if (!Number.isFinite(value)) {
		return min;
	}

	return Math.min(Math.max(value, min), max);
}

/**
 * A Base UI value, one number or one per thumb, as a list.
 *
 * @access private
 */
export function toValueList(value: number | readonly number[]): number[] {
	return typeof value === 'number' ? [value] : [...value];
}

/**
 * @access private
 */
export function areValuesEqual(a: readonly number[], b: readonly number[]): boolean {
	return a.length === b.length && a.every((value, index) => value === b[index]);
}

function countDecimals(value: number): number {
	return String(value).split('.')[1]?.length ?? 0;
}

/**
 * 10% of the scale, rounded to a multiple of `step`, and at least one `step`.
 *
 * @access private
 */
export function getLargeStep(min: number, max: number, step: number): number {
	const steps = Math.max(1, Math.round((max - min) / 10 / step));

	// `toFixed` drops the float noise of the product: `3 * 0.1` is `0.30000000000000004`.
	return Number((steps * step).toFixed(countDecimals(step)));
}

/**
 * The index of the thumb a click on `target` moves: the closest one, or the one on the side of
 * the target when both hold the same value.
 *
 * @access private
 */
export function getClosestThumb(values: readonly number[], target: number): number {
	if (values.length === 1) {
		return 0;
	}

	const [lower, upper] = values;

	if (lower === upper) {
		return target < lower ? 0 : 1;
	}

	return Math.abs(target - lower) <= Math.abs(target - upper) ? 0 : 1;
}

/**
 * The marks inside the scale, sorted by value.
 *
 * @access private
 */
export function getMarkList(
	marks: Record<number, string> | undefined,
	min: number,
	max: number,
): SliderMark[] {
	return Object.entries(marks ?? {})
		.map(([key, label]) => ({ value: Number(key), label }))
		.filter((mark) => Number.isFinite(mark.value) && mark.value >= min && mark.value <= max)
		.sort((a, b) => a.value - b.value);
}

/**
 * Where each mark sits, as a fraction of the scale, and half the distance to the mark before and
 * after it. A side with no mark has no half.
 *
 * @access private
 */
export function getMarkLayout(
	markList: readonly SliderMark[],
	min: number,
	max: number,
): Array<{ position: number; halfGapStart: number | undefined; halfGapEnd: number | undefined }> {
	const positions = markList.map((mark) => (mark.value - min) / (max - min));

	return positions.map((position, index) => {
		const before = positions[index - 1];
		const after = positions[index + 1];

		return {
			position,
			halfGapStart: before === undefined ? undefined : (position - before) / 2,
			halfGapEnd: after === undefined ? undefined : (after - position) / 2,
		};
	});
}

/**
 * Whether a mark sits inside the fill: between the two thumbs of a range, or between `min` and
 * the thumb of a single slider.
 *
 * @access private
 */
export function isMarkActive(markValue: number, values: readonly number[], min: number): boolean {
	const lower = values.length === 1 ? min : values[0];
	const upper = values[values.length - 1];

	return markValue >= lower && markValue <= upper;
}

/**
 * The end of the track a mark sits at, if any.
 *
 * @access private
 */
export function getMarkEdge(
	markValue: number,
	min: number,
	max: number,
): 'start' | 'end' | undefined {
	if (markValue === min) {
		return 'start';
	}

	return markValue === max ? 'end' : undefined;
}

/**
 * Whether an element shows keyboard focus. A browser that does not know `:focus-visible` throws,
 * and every focus counts there.
 *
 * @access private
 */
export function isFocusVisible(element: Element): boolean {
	try {
		return element.matches(':focus-visible');
	} catch {
		return true;
	}
}

/**
 * The `aria-*` and `data-*` entries of a props rest, in two records. The aria attributes the
 * slider writes itself and every other key are dropped, so a prop that gets past the types
 * (`orientation`, `render`) never reaches Base UI.
 *
 * @access private
 */
export function splitAttributes(props: Record<string, unknown>): {
	aria: Record<string, unknown>;
	data: Record<string, unknown>;
} {
	const aria: Record<string, unknown> = {};
	const data: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(props)) {
		if (key.startsWith('aria-') && !OWN_ARIA_ATTRIBUTES.has(key)) {
			aria[key] = value;
		} else if (key.startsWith('data-')) {
			data[key] = value;
		}
	}

	return { aria, data };
}
