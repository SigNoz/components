import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import { SliderFrame } from './subcomponents/slider-frame.js';
import { SliderRange } from './subcomponents/slider-range.js';
import type { SliderProps, SliderRangeProps, ValidateSliderProps } from './types.js';

/**
 * Picks one number from a continuous scale (Base UI `Slider`): a setting with a known range, or an
 * estimate where the exact number does not matter. Use `Slider.Range` for a lower and an upper
 * bound.
 *
 * Every `aria-*` goes to the thumb input, which is the `role="slider"`. Any `data-*` goes to the
 * root.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped.
 *
 * Visual values are `--slider-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The slider has no visible label. Name it with `aria-labelledby`, pointing at the label next to
 * it, or with `aria-label`. A `<label htmlFor>` does not work, since the input id is internal.
 *
 * Each thumb input carries `min`, `max`, `aria-valuenow` and `aria-valuetext`, from `formatValue`.
 * So a screen reader reads `1,000 GB` and not `50`.
 *
 * ### Color
 *
 * `color` paints the fill, the thumb border and the dots inside the fill, from the same hues as
 * `Badge`. The track and the other dots are tints of it. It is required, with no default.
 *
 * ### Keys
 *
 * Each thumb is one tab stop, a native `<input type="range">`. The arrows move one `step`.
 * `PageUp`, `PageDown` and `Shift` with an arrow move one large step: 10% of `max - min`, rounded
 * to a multiple of `step`, and at least one `step`. `Home` and `End` move to `min` and `max`.
 *
 * Each key press calls `onChange` and `onAfterChange` once.
 *
 * ### Value out of range
 *
 * A `value` that is not a finite number renders the thumb at `min`. A value below `min` or above
 * `max` renders the thumb at the nearest end, and the tooltip and `aria-valuetext` show the value
 * of the thumb. The slider never calls `onChange` to correct a value.
 *
 * ### Disabled and read-only
 *
 * `disabled` fades the whole slider and blocks drag, a click on the track or on a mark, and the
 * keys. The thumbs leave the tab order, and the slider is left out of the form submit. Hover still
 * opens `disabledTooltip`.
 *
 * `readOnly` fades it less and blocks the same changes, and `onChange` and `onAfterChange` are not
 * called. The thumbs stay in the tab order with `aria-readonly="true"`, and the slider is still
 * submitted. `readOnlyTooltip` opens on hover and on keyboard focus.
 *
 * `readOnly` outranks `disabled`: with both, the slider is only read-only.
 *
 * Each state travels with its reason, the way it does on `Switch`: `disabled` with
 * `disabledTooltip`, `readOnly` with `readOnlyTooltip`. Pass the reason as `undefined` when there
 * is none to give.
 *
 * ### Tooltips
 *
 * `tooltip` shows the value of each thumb above it. It opens on hover, on press and on keyboard
 * focus, and stays open while the thumb drags. Only one tooltip shows at a time: the value tooltip
 * never opens while `disabled`, nor while `readOnly` with a `readOnlyTooltip`.
 *
 * Do not wrap the slider in a `Tooltip`. Use `tooltip` and `formatValue`.
 *
 * ### Marks
 *
 * Each mark draws a dot on the track and a label under it. The label row sits inside the root, so
 * the root grows taller and nothing paints outside it. A label at `min` aligns with the start of
 * the track, one at `max` with its end, and every other one is centred on its value.
 *
 * Each label has the room up to halfway to the mark on each side, less a small gap, or up to the
 * end of the slider when there is no mark on that side. A centred label takes the same room on
 * both sides of its value. `textOverflow` says what a longer label does: `ellipsis` (the default)
 * truncates it and shows it in full in a tooltip under it on hover, and `wrap` breaks it into
 * lines.
 *
 * A click on a label or its dot moves the closest thumb to the mark value, and calls `onChange`
 * and `onAfterChange` once each.
 *
 * ### Layout
 *
 * The root fills the width of its parent. The track runs from edge to edge of the root, and a
 * thumb at `min` or `max` stays inside it, so the parent needs no margin to make room.
 *
 * The root is never narrower than two thumbs. In a narrower parent it paints outside the parent.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the root, and the prefix of the parts. Otherwise use the role and
 * the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"slider"` |
 * | `data-color` | mirrors the prop |
 * | `data-disabled` | present while disabled, and not read-only |
 * | `data-readonly` | present while `readOnly` |
 * | `data-dragging` | present while a thumb moves under the pointer |
 * | `data-range` | present on `Slider.Range` |
 * | `data-text-overflow` | `"ellipsis"` or `"wrap"` |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `slider-control` | always, the area a press moves a thumb in | none |
 * | `slider-track` | always | `${testId}-track` |
 * | `slider-indicator` | always, inside the track, the fill | `${testId}-indicator` |
 * | `slider-thumb` | one per value, with `data-index` | `${testId}-thumb-${index}` |
 * | `slider-mark-dot` | one per mark, `data-active` inside the fill | none |
 * | `slider-marks` | only with `marks`, the label row, `aria-hidden` | none |
 * | `slider-mark` | one per mark, `data-active` inside the fill, `data-truncated` while cut | `${testId}-mark-${value}` |
 *
 * @example
 * ```tsx
 * <Typography.Text id="opacity-label">Fill opacity</Typography.Text>
 * <Slider
 *   color="primary"
 *   min={0}
 *   max={1}
 *   step={0.01}
 *   value={opacity}
 *   onChange={setOpacity}
 *   aria-labelledby="opacity-label"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Marks and a value tooltip, on a scale that stands for a log scale
 * <Slider
 *   color="primary"
 *   value={position}
 *   onChange={setPosition}
 *   marks={{ 0: '1 GB', 25: '10 GB', 50: '100 GB', 75: '1 TB', 100: '10 TB' }}
 *   tooltip
 *   formatValue={(value) => formatVolume(value)}
 *   aria-labelledby="logs-volume-label"
 * />
 * ```
 */
const SliderRoot = forwardRef<HTMLDivElement, SliderProps>(function Slider(
	{ value, defaultValue, onChange, onAfterChange, ...props },
	ref,
) {
	return (
		<SliderFrame
			{...props}
			ref={ref}
			range={false}
			value={value === undefined ? undefined : [value]}
			defaultValue={defaultValue === undefined ? undefined : [defaultValue]}
			onChange={onChange && ((values) => onChange(values[0]))}
			onAfterChange={onAfterChange && ((values) => onAfterChange(values[0]))}
		/>
	);
});

// `T` is inferred from the call site, so `T extends SliderProps` alone never runs excess property
// checks. Every key outside the props is pinned to `never` instead.
export const Slider = Object.assign(SliderRoot, { Range: SliderRange }) as (<T extends SliderProps>(
	props: T &
		ValidateSliderProps<T> &
		Record<Exclude<keyof T, keyof SliderProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement) & {
	Range: <T extends SliderRangeProps>(
		props: T &
			ValidateSliderProps<T> &
			Record<
				Exclude<keyof T, keyof SliderRangeProps | keyof RefAttributes<HTMLDivElement>>,
				never
			> &
			RefAttributes<HTMLDivElement>,
	) => ReactElement;
};
