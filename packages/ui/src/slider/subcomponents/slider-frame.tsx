import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { type CSSProperties, forwardRef, useEffect, useState } from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { partTestId, type RejectedProps } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import { hasTooltipContent } from '../../tooltip/tooltip-content-stack-context.js';
import { TooltipTriggerBoundary } from '../../tooltip/tooltip-trigger-context.js';
import {
	SLIDER_RANGE_THUMB_LABELS,
	SLIDER_RANGE_THUMBS,
	SLIDER_SINGLE_THUMBS,
	SliderTextOverflow,
} from '../constants.js';
import styles from '../slider.module.scss';
import type { SliderProps } from '../types.js';
import {
	areValuesEqual,
	getClosestThumb,
	getLargeStep,
	splitAttributes,
	toThumbValue,
	toValueList,
} from '../utils.js';
import { SliderMarks } from './slider-marks.js';
import { SliderThumb } from './slider-thumb.js';

/**
 * @access private
 */
export type SliderFrameProps = Omit<
	SliderProps,
	'value' | 'defaultValue' | 'onChange' | 'onAfterChange'
> & {
	range: boolean;
	value: readonly number[] | undefined;
	defaultValue: readonly number[] | undefined;
	onChange: ((values: number[]) => void) | undefined;
	onAfterChange: ((values: number[]) => void) | undefined;
};

/**
 * Everything `Slider` and `Slider.Range` render, with the value as a list of one or two numbers.
 *
 * @access private
 */
export const SliderFrame = forwardRef<HTMLDivElement, SliderFrameProps>(function SliderFrame(
	{
		range,
		value,
		defaultValue,
		onChange,
		onAfterChange,
		min = 0,
		max = 100,
		step = 1,
		color,
		marks,
		textOverflow = SliderTextOverflow.Ellipsis,
		tooltip = false,
		formatValue,
		name,
		form,
		required: _required,
		disabled = false,
		disabledTooltip,
		readOnly = false,
		readOnlyTooltip,
		width,
		maxWidth,
		id,
		testId,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
		className: _className,
		style: _style,
		...props
	}: SliderFrameProps & RejectedProps,
	ref,
) {
	const isControlled = value !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = useState<readonly number[]>(
		() => defaultValue ?? (range ? [min, max] : [min]),
	);
	const values = (isControlled ? value : uncontrolledValue).map((entry) =>
		toThumbValue(entry, min, max),
	);

	const isDisabled = disabled && !readOnly;
	const isInteractive = !disabled && !readOnly;

	const hasReadOnlyTooltip = readOnly && hasTooltipContent(readOnlyTooltip);
	const hasDisabledTooltip = isDisabled && hasTooltipContent(disabledTooltip);
	const reason = hasReadOnlyTooltip ? readOnlyTooltip : hasDisabledTooltip ? disabledTooltip : null;
	// The anchor mounts from the props, not from whether there is a reason right now, so the
	// slider never remounts and a focused thumb keeps its focus when a reason appears.
	const hasReasonAnchor = disabledTooltip != null || readOnlyTooltip != null;
	const canShowValueTooltip = !isDisabled && !hasReadOnlyTooltip;

	const [press, setPress] = useState<{ thumb: number; hasMoved: boolean } | null>(null);
	const isPressing = press !== null;

	useEffect(() => {
		if (!isPressing) {
			return undefined;
		}

		const release = (): void => setPress(null);

		window.addEventListener('pointerup', release);
		window.addEventListener('pointercancel', release);

		return () => {
			window.removeEventListener('pointerup', release);
			window.removeEventListener('pointercancel', release);
		};
	}, [isPressing]);

	function setValues(next: number[]): void {
		if (!isControlled) {
			setUncontrolledValue(next);
		}

		onChange?.(next);
	}

	function moveToMark(markValue: number): void {
		if (!isInteractive) {
			return;
		}

		const next = [...values];
		next[getClosestThumb(values, markValue)] = markValue;

		if (areValuesEqual(next, values)) {
			return;
		}

		setValues(next);
		onAfterChange?.(next);
	}

	// A single slider names and describes its thumb input. A range is a group, so every aria
	// attribute goes to the root and the thumbs get names of their own.
	const { aria, data } = splitAttributes(props);
	const rootAria = range
		? {
				...aria,
				'aria-label': ariaLabel,
				'aria-labelledby': ariaLabelledBy,
				'aria-describedby': ariaDescribedBy,
			}
		: {};
	const thumbInputAttributes = {
		...(range ? {} : aria),
		...(readOnly ? { 'aria-readonly': 'true' } : {}),
	};

	const rootStyle = {
		...(width == null ? {} : { '--slider-internal-width': toCssLength(width) }),
		...(maxWidth == null ? {} : { '--slider-internal-max-width': toCssLength(maxWidth) }),
	} as CSSProperties;

	const slider = (
		<SliderPrimitive.Root
			{...data}
			{...rootAria}
			ref={ref}
			id={id}
			value={range ? values : values[0]}
			min={min}
			max={max}
			step={step}
			largeStep={getLargeStep(min, max, step)}
			name={name}
			form={form}
			disabled={isDisabled}
			orientation="horizontal"
			thumbAlignment="edge"
			// With `none`, Base UI hands a press on two thumbs at one value to the upper one, which
			// cannot move down. `swap` moves the thumb on the side of the pointer instead, and leaves
			// the other value where it is. Only until that first move, or a drag that meets the other
			// thumb would cross it.
			thumbCollisionBehavior={
				range && values[0] === values[1] && !press?.hasMoved ? 'swap' : 'none'
			}
			onValueChange={(next, details) => {
				if (readOnly) {
					details.cancel();
					return;
				}

				if (details.reason === 'drag' || details.reason === 'track-press') {
					setPress({ thumb: details.activeThumbIndex, hasMoved: true });
				}

				setValues(toValueList(next));
			}}
			onValueCommitted={(next) => onAfterChange?.(toValueList(next))}
			data-slot="slider"
			data-color={color}
			data-readonly={readOnly || undefined}
			data-range={range || undefined}
			data-text-overflow={textOverflow}
			className={styles.slider}
			style={rootStyle}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			<TooltipTriggerBoundary>
				<SliderPrimitive.Control
					data-slot="slider-control"
					className={styles['slider__control']}
					onPointerDown={(event) => {
						if (readOnly) {
							event.preventBaseUIHandler();
						}
					}}
				>
					<SliderPrimitive.Track
						data-slot="slider-track"
						data-testid={partTestId(testId, 'track')}
						className={styles['slider__track']}
					>
						<SliderPrimitive.Indicator
							data-slot="slider-indicator"
							data-testid={partTestId(testId, 'indicator')}
							className={styles['slider__indicator']}
						/>
					</SliderPrimitive.Track>
					{(range ? SLIDER_RANGE_THUMBS : SLIDER_SINGLE_THUMBS).map((index) => (
						<SliderThumb
							key={index}
							index={index}
							valueText={formatValue?.(values[index]) ?? String(values[index])}
							hasTooltip={tooltip}
							canShowTooltip={canShowValueTooltip}
							isPressed={press?.thumb === index}
							isInteractive={isInteractive}
							onPress={(thumb) => setPress({ thumb, hasMoved: false })}
							ariaLabel={range ? SLIDER_RANGE_THUMB_LABELS[index] : ariaLabel}
							ariaLabelledBy={range ? undefined : ariaLabelledBy}
							ariaDescribedBy={range ? undefined : ariaDescribedBy}
							inputAttributes={thumbInputAttributes}
							testId={testId}
						/>
					))}
				</SliderPrimitive.Control>
				<SliderMarks
					marks={marks}
					min={min}
					max={max}
					values={values}
					textOverflow={textOverflow}
					reason={reason}
					onSelect={moveToMark}
					testId={testId}
				/>
			</TooltipTriggerBoundary>
		</SliderPrimitive.Root>
	);

	if (!hasReasonAnchor) {
		return slider;
	}

	return <TooltipAnchor content={reason}>{slider}</TooltipAnchor>;
});
