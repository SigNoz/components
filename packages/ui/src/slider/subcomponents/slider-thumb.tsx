import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { type ReactElement, useLayoutEffect, useRef, useState } from 'react';
import { partTestId } from '../../lib/utils.js';
import { TooltipAnchor } from '../../tooltip/subcomponents/tooltip-anchor.js';
import styles from '../slider.module.scss';
import { isFocusVisible } from '../utils.js';

/**
 * @access private
 */
export type SliderThumbProps = {
	index: number;
	valueText: string;
	hasTooltip: boolean;
	/** The value tooltip may open now. False while disabled, or replaced by `readOnlyTooltip`. */
	canShowTooltip: boolean;
	isPressed: boolean;
	isInteractive: boolean;
	onPress: (index: number) => void;
	ariaLabel: string | undefined;
	ariaLabelledBy: string | undefined;
	ariaDescribedBy: string | undefined;
	/** Every other attribute of the thumb input, written after render. */
	inputAttributes: Record<string, unknown>;
	testId: string | undefined;
};

/**
 * One thumb, its native range input and, with `tooltip`, the tooltip that shows its value.
 *
 * @access private
 */
export function SliderThumb({
	index,
	valueText,
	hasTooltip,
	canShowTooltip,
	isPressed,
	isInteractive,
	onPress,
	ariaLabel,
	ariaLabelledBy,
	ariaDescribedBy,
	inputAttributes,
	testId,
}: SliderThumbProps): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

	// Base UI renders the input and forwards it only `aria-label`, `aria-labelledby` and
	// `aria-describedby`. Runs after every render, since the attributes are a new object each time.
	useLayoutEffect(() => {
		const input = inputRef.current;
		const entries = Object.entries(inputAttributes).filter(([, value]) => value != null);

		for (const [name, value] of entries) {
			input?.setAttribute(name, String(value));
		}

		return () => {
			for (const [name] of entries) {
				input?.removeAttribute(name);
			}
		};
	});

	const thumb = (
		<SliderPrimitive.Thumb
			index={index}
			inputRef={inputRef}
			data-slot="slider-thumb"
			className={styles['slider__thumb']}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-describedby={ariaDescribedBy}
			aria-valuetext={valueText}
			onPointerDown={() => {
				if (isInteractive) {
					onPress(index);
				}
			}}
			onPointerEnter={() => setIsHovered(true)}
			onPointerLeave={() => setIsHovered(false)}
			onFocus={(event) => setIsKeyboardFocused(isFocusVisible(event.currentTarget))}
			onBlur={() => setIsKeyboardFocused(false)}
			// Base UI restores `:focus-visible` on a key press without calling `onFocus` again.
			onKeyDown={() => setIsKeyboardFocused(true)}
			data-testid={partTestId(testId, `thumb-${index}`)}
		/>
	);

	if (!hasTooltip) {
		return thumb;
	}

	return (
		<TooltipAnchor
			content={valueText}
			open={canShowTooltip && (isPressed || isHovered || isKeyboardFocused)}
			// Base UI ignores hover and focus on an enabled trigger nested in another one, so the
			// thumb would keep the reason of the root from opening.
			disabled={!canShowTooltip}
			// The value is already `aria-valuetext`, so the tooltip does not describe the input.
			aria-describedby={ariaDescribedBy}
		>
			{thumb}
		</TooltipAnchor>
	);
}
