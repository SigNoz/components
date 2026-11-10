import { useState, type FocusEvent } from 'react';
import { isPointerModality, useFocusModalityTracking } from '../lib/focus-modality.js';

/**
 * @access private
 */
export type InputFocusVisible = {
	focusVisible: boolean;
	focusProps: {
		onFocus: (event: FocusEvent<HTMLElement>) => void;
		onBlur: (event: FocusEvent<HTMLElement>) => void;
	};
};

function isField(event: FocusEvent<HTMLElement>): boolean {
	return (event.target as Element).getAttribute('data-slot') === 'input-field';
}

/**
 * Whether the frame draws its focus ring: true while the field holds focus that a keyboard or a
 * script put there, false after a click or a tap. `focusProps` go on the frame, where React's
 * bubbling focus events see the field and ignore the other buttons in the slots.
 *
 * @access private
 */
export function useInputFocusVisible(): InputFocusVisible {
	useFocusModalityTracking();

	const [focusVisible, setFocusVisible] = useState(false);

	return {
		focusVisible,
		focusProps: {
			onFocus: (event) => {
				if (isField(event)) {
					setFocusVisible(!isPointerModality());
				}
			},
			onBlur: (event) => {
				if (isField(event)) {
					setFocusVisible(false);
				}
			},
		},
	};
}
