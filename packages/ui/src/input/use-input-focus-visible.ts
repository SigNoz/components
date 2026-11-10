import { useState, type FocusEvent, type PointerEvent } from 'react';
import { isPointerModality } from '../lib/focus-modality.js';

/**
 * @access private
 */
export type InputFocusVisible = {
	focusVisible: boolean;
	focusProps: {
		onFocusCapture: (event: FocusEvent<HTMLElement>) => void;
		onBlurCapture: (event: FocusEvent<HTMLElement>) => void;
		onPointerDownCapture: (event: PointerEvent<HTMLElement>) => void;
	};
};

// React sends events through portals and nested frames, so events from another Input (one in a
// slot, or in a popover opened from one) reach this frame too. Only a target whose nearest frame is
// this one counts.
function isInOwnFrame(event: FocusEvent<HTMLElement> | PointerEvent<HTMLElement>): boolean {
	return (event.target as Element).closest('[data-slot="input"]') === event.currentTarget;
}

function isOwnField(event: FocusEvent<HTMLElement>): boolean {
	return (
		(event.target as Element).getAttribute('data-slot') === 'input-field' && isInOwnFrame(event)
	);
}

/**
 * Whether the frame draws its focus ring: true while the field holds focus that a keyboard or a
 * script put there, false after a click or a tap. `focusProps` go on the frame and listen in the
 * capture phase, so they see the field before its own `onFocus` and `onBlur`, which a caller may
 * use to stop propagation. Focus on the other buttons in the slots does not count. A press clears
 * the ring without waiting for focus: a click on the field that already has focus fires none.
 *
 * @access private
 */
export function useInputFocusVisible(): InputFocusVisible {
	const [focusVisible, setFocusVisible] = useState(false);

	return {
		focusVisible,
		focusProps: {
			onFocusCapture: (event) => {
				if (isOwnField(event)) {
					setFocusVisible(!isPointerModality());
				}
			},
			onBlurCapture: (event) => {
				if (isOwnField(event)) {
					setFocusVisible(false);
				}
			},
			onPointerDownCapture: (event) => {
				if (isInOwnFrame(event)) {
					setFocusVisible(false);
				}
			},
		},
	};
}
