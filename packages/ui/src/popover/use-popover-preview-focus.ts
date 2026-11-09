import { type FocusEvent, useEffect, useRef } from 'react';
import type { PopoverHandle } from './popover-handle.js';

/**
 * @access private
 */
export type PopoverPreviewFocus = {
	onFocus: (event: FocusEvent<HTMLElement>) => void;
	onBlur: (event: FocusEvent<HTMLElement>) => void;
};

/**
 * Opens the popup of a preview trigger while the keyboard focus is on it, or on something inside
 * it, which a Base UI popover trigger does not do by itself: it opens on hover and on a press, and
 * a preview takes no press.
 *
 * A focus that a click or a tap put there opens nothing, only one `:focus-visible` matches. The
 * popup closes with the focus leaving its trigger, unless the focus went into the popup, to another
 * element inside the trigger (a row that holds a link and a menu), or to another trigger, which has
 * moved the popup to itself by then.
 *
 * @access private
 */
export function usePopoverPreviewFocus<Payload>(
	handle: PopoverHandle<Payload>,
	triggerId: string,
	delay: number,
): PopoverPreviewFocus {
	const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timeout.current), []);

	return {
		onFocus: (event) => {
			clearTimeout(timeout.current);

			// `focus` bubbles in React, so a row that holds a link sees the link take the focus.
			if (!(event.target as HTMLElement).matches(':focus-visible')) {
				return;
			}

			if (handle.isOpen) {
				handle.openTrigger(triggerId);

				return;
			}

			timeout.current = setTimeout(() => handle.openTrigger(triggerId), delay);
		},
		onBlur: (event) => {
			clearTimeout(timeout.current);

			const trigger = event.currentTarget;
			const next = event.relatedTarget as Node | null;

			// Base UI gives the popup `tabindex="-1"`, so a press anywhere in it takes the focus from
			// the trigger before its click lands.
			if (trigger.contains(next) || handle.popupElement?.contains(next)) {
				return;
			}

			timeout.current = setTimeout(() => {
				if (
					trigger.hasAttribute('data-popup-open') &&
					!handle.popupElement?.contains(trigger.ownerDocument.activeElement)
				) {
					handle.close();
				}
			}, 0);
		},
	};
}
