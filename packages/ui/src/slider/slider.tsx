import * as SliderPrimitive from '@radix-ui/react-slider';
import React from 'react';

import { cn } from '../lib/utils.js';
import { Tooltip, TooltipProvider } from '../tooltip/tooltip.js';
import styles from './slider.module.css';

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
	 */
	styles?: {
		track?: React.CSSProperties;
		range?: React.CSSProperties;
		thumb?: React.CSSProperties;
	};
}

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
			value: controlledValue,
			defaultValue,
			min = 0,
			max = 100,
			...props
		},
		ref
	) => {
		const toArray = (val: number | number[] | undefined) =>
			Array.isArray(val) ? val : val !== undefined ? [val] : undefined;

		const internalValue = toArray(controlledValue);
		const internalDefaultValue = toArray(defaultValue);

		const [localValues, setLocalValues] = React.useState<number[]>(
			internalValue || internalDefaultValue || [min]
		);

		React.useEffect(() => {
			if (internalValue !== undefined) {
				setLocalValues(internalValue);
			}
		}, [internalValue]);

		const handleValueChange = (newValues: number[]) => {
			if (internalValue === undefined) {
				setLocalValues(newValues);
			}
			if (onChange) {
				onChange(range ? newValues : newValues[0]);
			}
		};

		const handleValueCommit = (newValues: number[]) => {
			if (onAfterChange) {
				onAfterChange(range ? newValues : newValues[0]);
			}
		};

		return (
			<SliderPrimitive.Root
				ref={ref}
				min={min}
				max={max}
				value={internalValue}
				defaultValue={internalDefaultValue}
				onValueChange={handleValueChange}
				onValueCommit={handleValueCommit}
				className={cn(styles['slider-root'], className)}
				{...props}
			>
				<SliderPrimitive.Track className={styles['slider-track']} style={inlineStyles?.track}>
					<SliderPrimitive.Range className={styles['slider-range']} style={inlineStyles?.range} />
				</SliderPrimitive.Track>

				{localValues.map((val, index) => {
					const thumb = (
						// biome-ignore lint/suspicious/noArrayIndexKey: Thumbs order does not change
						<SliderPrimitive.Thumb
							key={index}
							className={styles['slider-thumb']}
							style={inlineStyles?.thumb}
						/>
					);

					if (tooltip) {
						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: Thumbs order does not change
							<TooltipProvider key={index}>
								<Tooltip title={tooltip.formatter ? tooltip.formatter(val) : val}>{thumb}</Tooltip>
							</TooltipProvider>
						);
					}

					return thumb;
				})}

				{marks && (
					<div className={styles['slider-marks']}>
						{Object.entries(marks).map(([key, markObj]) => {
							const markVal = Number(key);
							const percent = ((markVal - min) / (max - min)) * 100;

							const isObject =
								typeof markObj === 'object' && markObj !== null && !React.isValidElement(markObj);
							const label = isObject && 'label' in markObj ? (markObj as any).label : markObj;
							const markStyle = isObject && 'style' in markObj ? (markObj as any).style : {};

							return (
								<span
									key={key}
									className={styles['slider-mark']}
									style={{ left: `${percent}%`, ...markStyle }}
								>
									{label}
								</span>
							);
						})}
					</div>
				)}
			</SliderPrimitive.Root>
		);
	}
);
Slider.displayName = 'Slider';

export { Slider };
