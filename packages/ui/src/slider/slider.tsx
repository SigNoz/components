import * as SliderPrimitive from '@radix-ui/react-slider';
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '../lib/utils.js';
import { TooltipProvider, TooltipSimple } from '../tooltip/index.js';
import styles from './slider.module.scss';

export interface SliderProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
		'onChange' | 'value' | 'defaultValue'
	> {
	value?: number | number[];
	defaultValue?: number | number[];
	/**
	 * Tick marks along the track. The key is the numerical value, and the value can be a string, a React node, or an object with label and style.
	 */
	marks?: Record<number, React.ReactNode | { style?: React.CSSProperties; label: React.ReactNode }>;
	/**
	 * Configuration for the tooltip wrapped around the slider thumb.
	 */
	tooltip?: { formatter?: (value: number) => React.ReactNode };
	/**
	 * Callback fired when the value changes during dragging.
	 */
	onChange?: (value: number | number[]) => void;
	/**
	 * Callback fired when `mouseup` or `keyup` happens.
	 */
	onAfterChange?: (value: number | number[]) => void;
	/**
	 * If true, renders a dual-thumb slider for range selection.
	 */
	range?: boolean;
	/**
	 * Custom inline styles for the internal track, range, and thumb elements.
	 *
	 * @example
	 * ```tsx
	 * // Custom track fill color
	 * <Slider styles={{ range: { backgroundColor: '#4E74F8' } }} />
	 * ```
	 */
	styles?: {
		track?: React.CSSProperties;
		range?: React.CSSProperties;
		thumb?: React.CSSProperties;
	};
	/**
	 * Custom CSS class names for the internal track, range, and thumb elements.
	 *
	 * @example
	 * ```tsx
	 * // Apply custom classes
	 * <Slider classNames={{ track: 'bg-gray-200', range: 'bg-blue-500', thumb: 'border-blue-500' }} />
	 * ```
	 */
	classNames?: {
		track?: string;
		range?: string;
		thumb?: string;
	};
	/**
	 * Test ID for testing purposes (mapped to data-testid).
	 */
	testId?: string;
	/**
	 * Unique identifier for the slider root element.
	 */
	id?: string;
	/**
	 * Inline style for the slider root element.
	 */
	style?: React.CSSProperties;
}

const toArray = (val: number | number[] | undefined) =>
	Array.isArray(val) ? val : val !== undefined ? [val] : undefined;

/**
 * Slider component for selecting a value or range from a continuous set of values.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Slider defaultValue={50} max={100} step={1} />
 * ```
 *
 * @example
 * ```tsx
 * // Range slider with two thumbs
 * <Slider defaultValue={[25, 75]} max={100} range />
 * ```
 *
 * @example
 * ```tsx
 * // With marks
 * <Slider
 *   defaultValue={50}
 *   marks={{
 *     0: '0°C',
 *     26: '26°C',
 *     37: '37°C',
 *     100: { style: { color: '#f50' }, label: <strong>100°C</strong> },
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With tooltip
 * <Slider defaultValue={25} tooltip={{ formatter: (val) => `${val}%` }} />
 * ```
 *
 * @example
 * ```tsx
 * // Custom styles (inline)
 * <Slider
 *   styles={{
 *     track: { backgroundColor: '#ffe4e6' },
 *     range: { backgroundColor: '#e11d48' },
 *     thumb: { borderColor: '#e11d48' },
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom classNames (Tailwind/CSS modules)
 * <Slider
 *   classNames={{
 *     track: 'bg-gray-200',
 *     range: 'bg-blue-500',
 *     thumb: 'border-blue-500',
 *   }}
 * />
 * ```
 */
const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
	(
		{
			className,
			marks,
			tooltip,
			onChange,
			onAfterChange,
			range,
			styles: inlineStyles,
			classNames,
			value: controlledValue,
			defaultValue,
			min = 0,
			max = 100,
			id,
			style,
			testId,
			...props
		},
		ref
	) => {
		const internalValue = useMemo(() => toArray(controlledValue), [controlledValue]);
		const internalDefaultValue = useMemo(() => toArray(defaultValue), [defaultValue]);

		const [localValues, setLocalValues] = useState<number[]>(
			internalValue || internalDefaultValue || [min]
		);

		useEffect(() => {
			if (internalValue !== undefined) {
				setLocalValues(internalValue);
			}
		}, [internalValue]);

		const handleValueChange = useCallback(
			(newValues: number[]) => {
				if (internalValue === undefined) {
					setLocalValues(newValues);
				}
				if (onChange) {
					onChange(range ? newValues : newValues[0]);
				}
			},
			[internalValue, onChange, range]
		);

		const handleValueCommit = useCallback(
			(newValues: number[]) => {
				if (onAfterChange) {
					onAfterChange(range ? newValues : newValues[0]);
				}
			},
			[onAfterChange, range]
		);

		const markList = useMemo(() => {
			if (!marks) return [];
			return Object.entries(marks).map(([key, markObj]) => {
				const markVal = Number(key);
				const percent = ((markVal - min) / (max - min)) * 100;

				const isObject =
					typeof markObj === 'object' && markObj !== null && !React.isValidElement(markObj);
				const label = isObject && 'label' in markObj ? (markObj as any).label : markObj;
				const markStyle = isObject && 'style' in markObj ? (markObj as any).style : {};

				return { key, markVal, percent, label, markStyle };
			});
		}, [marks, min, max]);

		const isMarkActive = useCallback(
			(markVal: number) => {
				if (localValues.length === 1) return markVal <= localValues[0];
				return markVal >= localValues[0] && markVal <= localValues[localValues.length - 1];
			},
			[localValues]
		);

		const handleMarkClick = useCallback(
			(markVal: number) => {
				let newValues: number[];
				if (localValues.length === 1) {
					newValues = [markVal];
				} else {
					const lastIndex = localValues.length - 1;
					const distToFirst = Math.abs(localValues[0] - markVal);
					const distToLast = Math.abs(localValues[lastIndex] - markVal);
					newValues =
						distToFirst <= distToLast
							? [markVal, ...localValues.slice(1)]
							: [...localValues.slice(0, lastIndex), markVal];
					newValues = [...newValues].sort((a, b) => a - b);
				}

				if (internalValue === undefined) {
					setLocalValues(newValues);
				}
				if (onChange) {
					onChange(range ? newValues : newValues[0]);
				}
				if (onAfterChange) {
					onAfterChange(range ? newValues : newValues[0]);
				}
			},
			[localValues, internalValue, onChange, onAfterChange, range]
		);

		const internalId = useId();

		return (
			<SliderPrimitive.Root
				ref={ref}
				id={id}
				style={style}
				data-testid={testId}
				min={min}
				max={max}
				value={internalValue}
				defaultValue={internalDefaultValue}
				onValueChange={handleValueChange}
				onValueCommit={handleValueCommit}
				className={cn(
					styles['slider-root'],
					markList.length > 0 && styles['slider-root-with-marks'],
					className
				)}
				{...props}
			>
				<SliderPrimitive.Track
					className={cn(styles['slider-track'], classNames?.track)}
					style={inlineStyles?.track}
				>
					<SliderPrimitive.Range
						className={cn(styles['slider-range'], classNames?.range)}
						style={inlineStyles?.range}
					/>
				</SliderPrimitive.Track>

				{markList.length > 0 && (
					<div className={styles['slider-dots']}>
						{markList.map(({ key, markVal, percent }) => (
							<span
								key={`slider-${internalId}-dot-${key}`}
								className={cn(
									styles['slider-dot'],
									isMarkActive(markVal) && styles['slider-dot-active']
								)}
								style={{ left: `${percent}%` }}
							/>
						))}
					</div>
				)}

				{localValues.map((val, index) => (
					<SliderThumb
						// biome-ignore lint/suspicious/noArrayIndexKey: Thumbs order does not change
						key={`slider-${internalId}-thumb-${index}`}
						value={val}
						className={cn(styles['slider-thumb'], classNames?.thumb)}
						style={inlineStyles?.thumb}
						tooltip={tooltip}
					/>
				))}

				{markList.length > 0 && (
					<div className={styles['slider-marks']}>
						{markList.map(({ key, markVal, percent, label, markStyle }) => (
							// biome-ignore lint/a11y/useSemanticElements: span is intentional to avoid native button styling on slider marks
							<span
								key={`slider-${internalId}-mark-${key}`}
								className={styles['slider-mark']}
								style={{ left: `${percent}%`, ...markStyle }}
								role="button"
								tabIndex={0}
								onClick={() => handleMarkClick(markVal)}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										handleMarkClick(markVal);
									}
								}}
							>
								{label}
							</span>
						))}
					</div>
				)}
			</SliderPrimitive.Root>
		);
	}
);
Slider.displayName = 'Slider';

interface SliderThumbProps {
	value: number;
	className: string;
	style?: React.CSSProperties;
	tooltip?: SliderProps['tooltip'];
}

/**
 * Internal thumb wrapper that keeps the tooltip open for the entire drag/focus
 * lifecycle. Radix's default behavior only shows the tooltip on hover, which
 * causes flicker as the thumb moves under the cursor during dragging.
 */
function SliderThumb({ value, className, style, tooltip }: SliderThumbProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	useEffect(() => {
		if (!isDragging) return;
		const handlePointerUp = () => setIsDragging(false);
		window.addEventListener('pointerup', handlePointerUp);
		return () => window.removeEventListener('pointerup', handlePointerUp);
	}, [isDragging]);

	const thumb = (
		<SliderPrimitive.Thumb
			className={className}
			style={style}
			onPointerDown={() => setIsDragging(true)}
			onPointerEnter={() => setIsHovering(true)}
			onPointerLeave={() => setIsHovering(false)}
		/>
	);

	if (!tooltip) return thumb;

	return (
		<TooltipProvider delayDuration={0}>
			<TooltipSimple
				open={isDragging || isHovering}
				title={tooltip.formatter ? tooltip.formatter(value) : value}
			>
				{thumb}
			</TooltipSimple>
		</TooltipProvider>
	);
}

export { Slider };
